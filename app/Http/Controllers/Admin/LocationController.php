<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Location;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class LocationController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Locations/Index', ['locations' => Location::orderBy('name->en')->get()]);
    }

    public function store(Request $request)
    {
        Location::create($this->data($request));

        return back()->with('success', 'State created.');
    }

    public function update(Request $request, Location $location)
    {
        $location->update($this->data($request, $location));

        return back()->with('success', 'State updated.');
    }

    public function destroy(Location $location)
    {
        $location->delete();

        return back()->with('success', 'State deleted.');
    }

    private function data(Request $request, ?Location $location = null): array
    {
        return $request->validate(['name.en' => 'required_without_all:name.fr,name.ar|max:255', 'name.fr' => 'nullable|max:255', 'name.ar' => 'nullable|max:255', 'code' => ['nullable', 'max:20', Rule::unique('locations')->ignore($location)], 'cities' => 'nullable|array', 'cities.*.en' => 'required_without_all:cities.*.fr,cities.*.ar|max:255', 'cities.*.fr' => 'nullable|max:255', 'cities.*.ar' => 'nullable|max:255']);
    }
}
