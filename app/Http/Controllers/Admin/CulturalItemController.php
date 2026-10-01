<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\HandlesCatalogData;
use App\Http\Controllers\Controller;
use App\Models\CulturalItem;
use App\Support\GoogleMapsCoordinates;
use Illuminate\Validation\ValidationException;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class CulturalItemController extends Controller
{
    use HandlesCatalogData;

    public function index(Request $request)
    {
        $items = CulturalItem::with(['categories:id,name', 'types:id,name', 'author:id,name', 'location:id,name'])
            ->when($request->string('search')->toString(), fn ($query, $search) => $query->where('name->en', 'like', "%{$search}%")->orWhere('url', 'like', "%{$search}%"))
            ->latest()->paginate(15)->withQueryString();

        return Inertia::render('Admin/CulturalItems/Index', ['items' => $items, 'filters' => $request->only('search')]);
    }

    public function create()
    {
        return $this->form();
    }

    public function edit(CulturalItem $culturalItem)
    {
        $culturalItem->load('categories:id', 'types:id');

        return $this->form($culturalItem);
    }

    public function store(Request $request)
    {
        $item = CulturalItem::create($this->data($request));
        $this->syncRelations($request, $item);

        return to_route('admin.cultural-items.index')->with('success', 'Cultural item created.');
    }

    public function update(Request $request, CulturalItem $culturalItem)
    {
        $culturalItem->update($this->data($request, $culturalItem));
        $this->syncRelations($request, $culturalItem);

        return to_route('admin.cultural-items.index')->with('success', 'Cultural item updated.');
    }

    public function destroy(CulturalItem $culturalItem)
    {
        $culturalItem->delete();

        return back()->with('success', 'Cultural item deleted.');
    }

    private function form(?CulturalItem $item = null)
    {
        return Inertia::render('Admin/CulturalItems/Form', ['item' => $item, 'options' => $this->options()]);
    }

    private function data(Request $request, ?CulturalItem $item = null): array
    {
        $request->merge(['url' => $this->slug($request)]);
        $data = $request->validate([
            'name.en' => 'required_without_all:name.fr,name.ar|max:255', 'name.fr' => 'nullable|max:255', 'name.ar' => 'nullable|max:255',
            'short_description.en' => 'required_without_all:short_description.fr,short_description.ar|string', 'short_description.fr' => 'nullable|string', 'short_description.ar' => 'nullable|string',
            'url' => ['required', 'max:255', Rule::unique('cultural_items')->ignore($item)],
            'description.en' => 'required_without_all:description.fr,description.ar|string', 'description.fr' => 'nullable|string', 'description.ar' => 'nullable|string',
            'main_image' => [$item ? 'nullable' : 'required', 'image', 'max:10240'], 'icon' => 'nullable|image|max:2048',
            'pictures.*' => 'nullable|image|max:10240', 'video_files.*' => 'nullable|mimetypes:video/mp4,video/webm,video/quicktime|max:51200', 'video_urls.*' => 'nullable|url|max:2048', 'audio_files.*' => 'nullable|mimetypes:audio/mpeg,audio/mp3,audio/wav,audio/x-wav|max:20480',
            'google_maps_url' => 'nullable|url|max:2048', 'latitude' => 'required_without:google_maps_url|nullable|numeric|between:-90,90', 'longitude' => 'required_without:google_maps_url|nullable|numeric|between:-180,180',
            'category_ids' => 'required|array|min:1', 'category_ids.*' => 'exists:categories,id', 'type_ids' => 'nullable|array', 'type_ids.*' => 'exists:types,id',
            'author_id' => 'nullable|exists:artists,id', 'people' => 'nullable|array', 'people.*.name' => 'required_with:people|max:255', 'people.*.position' => 'nullable|max:255',
            'location_id' => 'nullable|exists:locations,id', 'city' => 'nullable|max:255', 'is_active' => 'boolean', 'release' => 'nullable|max:100', 'importance' => ['required', Rule::in(['high', 'medium', 'low'])],
        ]);
        if ($request->filled('google_maps_url')) {
            $coordinates = GoogleMapsCoordinates::extract($request->input('google_maps_url'));
            if (! $coordinates) {
                throw ValidationException::withMessages(['google_maps_url' => 'The Google Maps URL does not contain a valid latitude and longitude.']);
            }
            $data = [...$data, ...$coordinates];
        }
        foreach (['name', 'short_description', 'description'] as $field) {
            $data[$field] = $this->translations($request, $field);
        }
        $data['main_image'] = $this->upload($request, 'main_image', 'cultural-items/main', $item?->main_image);
        $data['icon'] = $this->upload($request, 'icon', 'cultural-items/icons', $item?->icon);
        $data['pictures'] = $this->multipleUploads($request, 'pictures', 'cultural-items/pictures', $item?->pictures);
        $data['audio'] = $this->multipleUploads($request, 'audio_files', 'cultural-items/audio', $item?->audio);
        $uploadedVideos = $this->multipleUploads($request, 'video_files', 'cultural-items/videos', []);
        $data['videos'] = array_values(array_unique([...($item?->videos ?? []), ...$uploadedVideos, ...array_filter($request->input('video_urls', []))]));
        $data['people'] = array_values(array_filter($request->input('people', []), fn ($person) => filled(Arr::get($person, 'name'))));
        $data['is_active'] = $request->boolean('is_active');

        return Arr::except($data, ['category_ids', 'type_ids', 'video_files', 'video_urls', 'audio_files']);
    }

    private function multipleUploads(Request $request, string $field, string $folder, ?array $current = []): array
    {
        $paths = $current ?? [];
        foreach ($request->file($field, []) as $file) {
            $paths[] = $file->store($folder, 'public');
        }

        return array_values(array_unique($paths));
    }

    private function syncRelations(Request $request, CulturalItem $item): void
    {
        $item->categories()->sync($request->input('category_ids', []));
        $item->types()->sync($request->input('type_ids',[]));
    }
}
