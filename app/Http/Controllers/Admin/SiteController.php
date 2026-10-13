<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\HandlesCatalogData;
use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Location;
use App\Models\Site;
use App\Support\GoogleMapsCoordinates;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class SiteController extends Controller
{
    use HandlesCatalogData;

    public function index(Request $request)
    {
        $items = Site::with(['categories:id,name', 'location:id,name'])->withCount('events')
            ->when($request->string('search')->toString(), fn ($query, $search) => $query->where('name->en', 'like', "%{$search}%")->orWhere('url', 'like', "%{$search}%"))
            ->latest()->paginate(15)->withQueryString();

        return Inertia::render('Admin/Sites/Index', ['items' => $items, 'filters' => $request->only('search')]);
    }

    public function create() { return $this->form(); }
    public function edit(Site $site) { return $this->form($site->load('categories:id')); }

    public function store(Request $request)
    {
        $site = Site::create($this->data($request));
        $site->categories()->sync($request->input('category_ids', []));
        return to_route('admin.sites.index')->with('success', 'Site created.');
    }

    public function update(Request $request, Site $site)
    {
        $site->update($this->data($request, $site));
        $site->categories()->sync($request->input('category_ids', []));
        return to_route('admin.sites.index')->with('success', 'Site updated.');
    }

    public function destroy(Site $site)
    {
        $site->delete();
        return back()->with('success', 'Site deleted.');
    }

    private function form(?Site $site = null)
    {
        return Inertia::render('Admin/Sites/Form', [
            'item' => $site,
            'categories' => Category::all(['id', 'name']),
            'locations' => Location::all(['id', 'name', 'cities']),
        ]);
    }

    private function data(Request $request, ?Site $site = null): array
    {
        $request->merge(['url' => $this->slug($request)]);
        $data = $request->validate([
            'name.en' => 'required_without_all:name.fr,name.ar|max:255', 'name.fr' => 'nullable|max:255', 'name.ar' => 'nullable|max:255',
            'short_description.en' => 'required_without_all:short_description.fr,short_description.ar|string', 'short_description.fr' => 'nullable|string', 'short_description.ar' => 'nullable|string',
            'url' => ['required', 'max:255', Rule::unique('sites')->ignore($site)],
            'description.en' => 'required_without_all:description.fr,description.ar|string', 'description.fr' => 'nullable|string', 'description.ar' => 'nullable|string',
            'main_image' => [$site ? 'nullable' : 'required', 'image', 'max:10240'], 'icon' => 'nullable|image|max:2048',
            'pictures.*' => 'nullable|image|max:10240', 'video_files.*' => 'nullable|mimetypes:video/mp4,video/webm,video/quicktime|max:51200', 'video_urls.*' => 'nullable|url|max:2048',
            'google_maps_url' => 'nullable|url|max:2048', 'latitude' => 'required_without:google_maps_url|nullable|numeric|between:-90,90', 'longitude' => 'required_without:google_maps_url|nullable|numeric|between:-180,180',
            'category_ids' => 'required|array|min:1', 'category_ids.*' => 'exists:categories,id', 'location_id' => 'nullable|exists:locations,id', 'city' => 'nullable|max:255', 'is_active' => 'boolean',
            'founded_by' => 'nullable|string|max:255', 'foundation_year' => 'nullable|integer|min:1|max:9999', 'foundation_month' => 'nullable|integer|min:1|max:12', 'is_unesco_certif' => 'boolean', 'unesco_certif_year' => 'nullable|integer|min:1|max:9999',
        ]);
        if ($request->filled('google_maps_url')) {
            $coordinates = GoogleMapsCoordinates::extract($request->input('google_maps_url'));
            if (! $coordinates) throw ValidationException::withMessages(['google_maps_url' => 'The Google Maps URL does not contain valid coordinates.']);
            $data = [...$data, ...$coordinates];
        }
        foreach (['name', 'short_description', 'description'] as $field) $data[$field] = $this->translations($request, $field);
        $data['main_image'] = $this->upload($request, 'main_image', 'sites/main', $site?->main_image);
        $data['icon'] = $this->upload($request, 'icon', 'sites/icons', $site?->icon);
        $data['pictures'] = $this->multipleUploads($request, 'pictures', 'sites/pictures', $site?->pictures);
        $uploadedVideos = $this->multipleUploads($request, 'video_files', 'sites/videos', []);
        $data['videos'] = array_values(array_unique([...($site?->videos ?? []), ...$uploadedVideos, ...array_filter($request->input('video_urls', []))]));
        $data['is_active'] = $request->boolean('is_active');
        $data['is_unesco_certif'] = $request->boolean('is_unesco_certif');
        return Arr::except($data, ['category_ids', 'video_files', 'video_urls']);
    }

    private function multipleUploads(Request $request, string $field, string $folder, ?array $current = []): array
    {
        $paths = $current ?? [];
        foreach ($request->file($field, []) as $file) $paths[] = $file->store($folder, 'public');
        return array_values(array_unique($paths));
    }
}
