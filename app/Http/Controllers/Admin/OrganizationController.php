<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Location;
use App\Models\Organization;
use App\Models\User;
use App\Support\RichText;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class OrganizationController extends Controller
{
    public function index(Request $request)
    {
        abort_unless($request->user()->role === 'admin', 403);
        return Inertia::render('Admin/Organizations/Index', ['items' => Organization::withCount('events')->latest()->paginate(20)]);
    }

    public function create(Request $request)
    {
        abort_unless($request->user()->role === 'admin', 403);
        return $this->form($request);
    }

    public function edit(Request $request, Organization $organization)
    {
        $this->authorizeOrganization($request, $organization);
        return $this->form($request, $organization->load('users:id,name')); 
    }

    private function form(Request $request, ?Organization $organization = null)
    {
        return Inertia::render('Admin/Organizations/Form', ['item' => $organization, 'locations' => Location::all(['id', 'name', 'cities']), 'users' => $request->user()->role === 'admin' ? User::all(['id', 'name']) : [$request->user()->only(['id', 'name'])]]);
    }

    public function store(Request $request)
    {
        abort_unless($request->user()->role === 'admin', 403);
        return $this->save($request, new Organization);
    }

    public function update(Request $request, Organization $organization)
    {
        $this->authorizeOrganization($request, $organization);
        return $this->save($request, $organization);
    }

    private function save(Request $request, Organization $organization)
    {
        $isAdmin = $request->user()->role === 'admin';
        $request->merge(['users' => $request->input('users', [])]);
        $rules = [
            'name' => 'required|array:en,fr,ar', 'name.en' => 'required_without_all:name.fr,name.ar|nullable|string|max:255', 'name.fr' => 'nullable|string|max:255', 'name.ar' => 'nullable|string|max:255',
            'logo' => 'nullable|image|max:5120', 'mf' => 'nullable|string|max:255', 'description' => 'required|string|max:100000',
            'email' => 'nullable|email|max:255', 'phone' => 'required|string|max:50', 'show_phone' => 'required|boolean', 'show_email' => 'required|boolean', 'is_active' => 'required|boolean',
            'state_id' => 'required|exists:locations,id', 'city' => 'required|string|max:255', 'address' => 'required|string|max:255', 'zip_code' => 'nullable|string|max:30',
            'users' => 'present|array', 'users.*.user_id' => 'required|integer|distinct|exists:users,id', 'users.*.role' => 'required|string|max:100', 'users.*.show_user' => 'required|boolean',
        ];
        foreach (['facebook', 'instagram', 'tiktok', 'linkedin', 'youtube', 'website'] as $field) {
            $rules[$field] = 'nullable|url:http,https|max:2048';
        }
        $data = $request->validate($rules);
        $data['description'] = RichText::clean($data['description']);
        $data['logo'] = $request->hasFile('logo') ? $request->file('logo')->store('organizations', 'public') : $organization->logo;
        DB::transaction(function () use ($data, $organization, $isAdmin) {
            $organization->fill(Arr::except($data, ['users']))->save();
            if ($isAdmin) {
                $organization->users()->sync(collect($data['users'])->mapWithKeys(fn ($user) => [$user['user_id'] => Arr::only($user, ['role', 'show_user'])])->all());
            }
        });

        return to_route($request->user()->role === 'organizer' ? 'admin.organizations.edit' : 'admin.organizations.index', $request->user()->role === 'organizer' ? $organization->id : [])->with('success', 'Organization saved.');
    }

    private function authorizeOrganization(Request $request, Organization $organization): void
    {
        abort_unless($request->user()->role === 'admin' || $organization->users()->whereKey($request->user()->id)->exists(), 403);
    }

    public function destroy(Request $request, Organization $organization)
    {
        abort_unless($request->user()->role === 'admin', 403);
        $organization->delete();

        return back()->with('success', 'Organization and its events deleted.');
    }
}
