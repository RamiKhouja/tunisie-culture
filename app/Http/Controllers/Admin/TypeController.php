<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\HandlesCatalogData;
use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Type;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class TypeController extends Controller
{
    use HandlesCatalogData;

    public function index()
    {
        return Inertia::render('Admin/Catalog/Index', ['resource' => 'types', 'title' => 'Types', 'items' => Type::with('category:id,name')->latest()->get()]);
    }

    public function create()
    {
        return $this->form();
    }

    public function store(Request $request)
    {
        $data = $this->data($request);
        Type::create($data);

        return to_route('admin.types.index')->with('success', 'Type created.');
    }

    public function edit(Type $type)
    {
        return $this->form($type);
    }

    public function update(Request $request, Type $type)
    {
        $type->update($this->data($request, $type));

        return to_route('admin.types.index')->with('success', 'Type updated.');
    }

    public function destroy(Type $type)
    {
        $type->delete();

        return back()->with('success', 'Type deleted.');
    }

    private function form(?Type $type = null)
    {
        return Inertia::render('Admin/Catalog/Form', ['resource' => 'types', 'title' => $type ? 'Edit type' : 'New type', 'item' => $type, 'options' => ['categories' => Category::orderBy('name->en')->get(['id', 'name'])]]);
    }

    private function data(Request $request, ?Type $type = null): array
    {
        $request->merge(['url' => $this->slug($request)]);
        $data = $request->validate(['name.en' => 'required_without_all:name.fr,name.ar|max:255', 'name.fr' => 'nullable|max:255', 'name.ar' => 'nullable|max:255', 'url' => ['required', 'max:255', Rule::unique('types')->ignore($type)], 'description.*' => 'nullable|string', 'main_image' => 'nullable|image|max:5120', 'icon' => 'nullable|image|max:2048', 'category_id' => 'nullable|exists:categories,id']);
        $data['name'] = $this->translations($request, 'name');
        $data['description'] = $this->translations($request, 'description');
        $data['main_image'] = $this->upload($request, 'main_image', 'types', $type?->main_image);
        $data['icon'] = $this->upload($request, 'icon', 'types/icons', $type?->icon);

        return $data;
    }
}
