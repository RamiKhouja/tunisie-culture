<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\HandlesCatalogData;
use App\Http\Controllers\Controller;
use App\Models\Craft;
use App\Support\GoogleMapsCoordinates;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class CraftController extends Controller
{
    use HandlesCatalogData;

    public function index(Request $request)
    {
        $items = Craft::with(['categories:id,name', 'types:id,name', 'location:id,name'])
            ->when($request->string('search')->toString(), fn ($query, $search) => $query->where('name->en', 'like', "%{$search}%")->orWhere('url', 'like', "%{$search}%"))
            ->latest()->paginate(15)->withQueryString();

        return Inertia::render('Admin/Crafts/Index', ['items' => $items, 'filters' => $request->only('search')]);
    }

    public function create() { return $this->form(); }
    public function edit(Craft $craft) { return $this->form($craft->load(['categories:id', 'types:id'])); }

    public function store(Request $request)
    {
        $craft = Craft::create($this->data($request));
        $this->syncRelations($request, $craft);
        return to_route('admin.crafts.index')->with('success', 'Craft created.');
    }

    public function update(Request $request, Craft $craft)
    {
        $craft->update($this->data($request, $craft));
        $this->syncRelations($request, $craft);
        return to_route('admin.crafts.index')->with('success', 'Craft updated.');
    }

    public function destroy(Craft $craft)
    {
        $craft->delete();
        return back()->with('success', 'Craft deleted.');
    }

    private function form(?Craft $craft = null)
    {
        return Inertia::render('Admin/Crafts/Form', ['item' => $craft, 'options' => $this->options()]);
    }

    private function data(Request $request, ?Craft $craft = null): array
    {
        $request->merge(['url' => $this->slug($request)]);
        $data = $request->validate([
            'name.en' => 'required_without_all:name.fr,name.ar|max:255', 'name.fr' => 'nullable|max:255', 'name.ar' => 'nullable|max:255',
            'short_description.en' => 'required_without_all:short_description.fr,short_description.ar|string', 'short_description.fr' => 'nullable|string', 'short_description.ar' => 'nullable|string',
            'url' => ['required', 'max:255', Rule::unique('crafts')->ignore($craft)],
            'description.en' => 'required_without_all:description.fr,description.ar|string', 'description.fr' => 'nullable|string', 'description.ar' => 'nullable|string',
            'main_image' => [$craft ? 'nullable' : 'required', 'image', 'max:10240'], 'icon' => 'nullable|image|max:2048',
            'pictures.*' => 'nullable|image|max:10240', 'video_files.*' => 'nullable|mimetypes:video/mp4,video/webm,video/quicktime|max:51200', 'video_urls.*' => 'nullable|url|max:2048',
            'products' => 'nullable|array', 'products.*.name.en' => 'required_without_all:products.*.name.fr,products.*.name.ar|max:255', 'products.*.name.fr' => 'nullable|max:255', 'products.*.name.ar' => 'nullable|max:255', 'products.*.price' => 'nullable|numeric|min:0', 'products.*.image' => 'nullable|string', 'product_images.*' => 'nullable|image|max:10240',
            'google_maps_url' => 'nullable|url|max:2048', 'latitude' => 'required_without:google_maps_url|nullable|numeric|between:-90,90', 'longitude' => 'required_without:google_maps_url|nullable|numeric|between:-180,180',
            'category_ids' => 'required|array|min:1', 'category_ids.*' => 'exists:categories,id', 'type_ids' => 'nullable|array', 'type_ids.*' => 'exists:types,id',
            'owner' => 'required|string|max:255', 'location_id' => 'nullable|exists:locations,id', 'city' => 'nullable|max:255', 'is_active' => 'boolean',
        ]);
        if ($request->filled('google_maps_url')) {
            $coordinates = GoogleMapsCoordinates::extract($request->input('google_maps_url'));
            if (! $coordinates) throw ValidationException::withMessages(['google_maps_url' => 'The Google Maps URL does not contain valid coordinates.']);
            $data = [...$data, ...$coordinates];
        }
        foreach (['name', 'short_description', 'description'] as $field) $data[$field] = $this->translations($request, $field);
        $data['main_image'] = $this->upload($request, 'main_image', 'crafts/main', $craft?->main_image);
        $data['icon'] = $this->upload($request, 'icon', 'crafts/icons', $craft?->icon);
        $data['pictures'] = $this->multipleUploads($request, 'pictures', 'crafts/pictures', $craft?->pictures);
        $uploadedVideos = $this->multipleUploads($request, 'video_files', 'crafts/videos', []);
        $data['videos'] = array_values(array_unique([...($craft?->videos ?? []), ...$uploadedVideos, ...array_filter($request->input('video_urls', []))]));
        $data['products'] = collect($request->input('products', []))->values()->map(function (array $product, int $index) use ($request): array {
            $image = Arr::get($product, 'image');
            if ($request->hasFile("product_images.{$index}")) {
                $image = $request->file("product_images.{$index}")->store('crafts/products', 'public');
            }

            return [
                'name' => array_filter(Arr::get($product, 'name', []), fn ($value) => filled($value)),
                'price' => filled(Arr::get($product, 'price')) ? (float) Arr::get($product, 'price') : null,
                'image' => $image,
            ];
        })->filter(fn (array $product) => filled(Arr::get($product, 'name.en')) || filled(Arr::get($product, 'name.fr')) || filled(Arr::get($product, 'name.ar')))->values()->all();
        $data['is_active'] = $request->boolean('is_active');
        return Arr::except($data, ['category_ids', 'type_ids', 'video_files', 'video_urls', 'product_images']);
    }

    private function multipleUploads(Request $request, string $field, string $folder, ?array $current = []): array
    {
        $paths = $current ?? [];
        foreach ($request->file($field, []) as $file) $paths[] = $file->store($folder, 'public');
        return array_values(array_unique($paths));
    }

    private function syncRelations(Request $request, Craft $craft): void
    {
        $craft->categories()->sync($request->input('category_ids', []));
        $craft->types()->sync($request->input('type_ids', []));
    }
}
