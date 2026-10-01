<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\HandlesCatalogData;
use App\Http\Controllers\Controller;
use App\Models\Artist;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class ArtistController extends Controller
{
    use HandlesCatalogData;

    public function index()
    {
        return Inertia::render('Admin/Catalog/Index', ['resource' => 'artists', 'title' => 'Artists & people', 'items' => Artist::latest()->get()]);
    }

    public function create()
    {
        return $this->form();
    }

    public function store(Request $request)
    {
        Artist::create($this->data($request));

        return to_route('admin.artists.index')->with('success', 'Artist created.');
    }

    public function edit(Artist $artist)
    {
        return $this->form($artist);
    }

    public function update(Request $request, Artist $artist)
    {
        $artist->update($this->data($request, $artist));

        return to_route('admin.artists.index')->with('success', 'Artist updated.');
    }

    public function destroy(Artist $artist)
    {
        $artist->delete();

        return back()->with('success', 'Artist deleted.');
    }

    private function form(?Artist $artist = null)
    {
        return Inertia::render('Admin/Catalog/Form', ['resource' => 'artists', 'title' => $artist ? 'Edit artist or person' : 'New artist or person', 'item' => $artist]);
    }

    private function data(Request $request, ?Artist $artist = null): array
    {
        $request->merge(['url' => $this->slug($request)]);
        $data = $request->validate(['name.en' => 'required_without_all:name.fr,name.ar|max:255', 'name.fr' => 'nullable|max:255', 'name.ar' => 'nullable|max:255', 'url' => ['required', 'max:255', Rule::unique('artists')->ignore($artist)], 'profession' => 'nullable|max:255', 'description.*' => 'nullable|string', 'picture' => 'nullable|image|max:5120']);
        $data['name'] = $this->translations($request, 'name');
        $data['description'] = $this->translations($request, 'description');
        $data['picture'] = $this->upload($request, 'picture', 'artists', $artist?->picture);

        return $data;
    }
}
