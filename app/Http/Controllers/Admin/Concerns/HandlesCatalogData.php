<?php

namespace App\Http\Controllers\Admin\Concerns;

use App\Models\Artist;
use App\Models\Category;
use App\Models\Location;
use App\Models\Type;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

trait HandlesCatalogData
{
    protected function translations(Request $request, string $field): array
    {
        return array_filter($request->input($field, []), fn ($value) => filled($value));
    }

    protected function slug(Request $request): string
    {
        return Str::slug($request->input('url') ?: $request->input('name.en') ?: $request->input('name.fr') ?: $request->input('name.ar'));
    }

    protected function upload(Request $request, string $field, string $folder, ?string $current = null): ?string
    {
        return $request->hasFile($field) ? $request->file($field)->store($folder, 'public') : $current;
    }

    protected function options(): array
    {
        return [
            'categories' => Category::orderBy('name->en')->get(['id', 'name']),
            'types' => Type::with('category:id,name')->orderBy('name->en')->get(['id', 'name', 'category_id']),
            'artists' => Artist::orderBy('name->en')->get(['id', 'name', 'profession']),
            'locations' => Location::orderBy('name->en')->get(['id', 'name', 'cities']),
        ];
    }
}
