<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\HandlesCatalogData;
use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class CategoryController extends Controller
{
    use HandlesCatalogData;

    public function index(Request $request)
    {
        return Inertia::render('Admin/Catalog/Index', ['resource' => 'categories', 'title' => 'Categories', 'items' => Category::with('parent:id,name')->latest()->get()]);
    }

    public function create()
    {
        return Inertia::render('Admin/Catalog/Form', ['resource' => 'categories', 'title' => 'New category', 'options' => ['parents' => Category::orderBy('name->en')->get(['id', 'name'])]]);
    }

    public function store(Request $request)
    {
        $data = $this->validated($request);
        $data['url'] = $this->slug($request);
        $data['name'] = $this->translations($request, 'name');
        $data['description'] = $this->translations($request, 'description');
        $data['main_image'] = $this->upload($request, 'main_image', 'categories');
        $data['icon'] = $this->upload($request, 'icon', 'categories/icons');
        Category::create($data);

        return to_route('admin.categories.index')->with('success', 'Category created.');
    }

    public function edit(Request $request, Category $category)
    {
        abort_unless($request->user()->role === 'admin', 403);
        return Inertia::render('Admin/Catalog/Form', ['resource' => 'categories', 'title' => 'Edit category', 'item' => $category, 'options' => ['parents' => Category::whereKeyNot($category->id)->orderBy('name->en')->get(['id', 'name'])]]);
    }

    public function update(Request $request, Category $category)
    {
        abort_unless($request->user()->role === 'admin', 403);
        $data = $this->validated($request, $category);
        $data['url'] = $this->slug($request);
        $data['name'] = $this->translations($request, 'name');
        $data['description'] = $this->translations($request, 'description');
        $data['main_image'] = $this->upload($request, 'main_image', 'categories', $category->main_image);
        $data['icon'] = $this->upload($request, 'icon', 'categories/icons', $category->icon);
        $category->update($data);

        return to_route('admin.categories.index')->with('success', 'Category updated.');
    }

    public function destroy(Request $request, Category $category)
    {
        abort_unless($request->user()->role === 'admin', 403);
        $category->delete();

        return back()->with('success', 'Category deleted.');
    }

    private function validated(Request $request, ?Category $category = null): array
    {
        $request->merge(['url' => $this->slug($request)]);

        return $request->validate(['color' => ['sometimes', 'required', 'regex:/^#[0-9a-fA-F]{6}$/'], 'name.en' => 'required_without_all:name.fr,name.ar|max:255', 'name.fr' => 'nullable|max:255', 'name.ar' => 'nullable|max:255', 'url' => ['required', 'max:255', Rule::unique('categories')->ignore($category)], 'description.*' => 'nullable|string', 'main_image' => 'nullable|image|max:5120', 'icon' => 'nullable|image|max:2048', 'parent_id' => ['nullable', 'exists:categories,id', Rule::notIn(array_filter([$category?->id]))]]);
    }
}
