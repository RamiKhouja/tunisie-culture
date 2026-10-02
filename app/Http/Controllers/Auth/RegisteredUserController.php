<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Location;
use App\Models\Organization;
use App\Support\RichText;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register', [
            'locations' => Location::all(['id', 'name', 'cities']),
        ]);
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        // Keep the original endpoint contract usable for clients that have not
        // moved to the onboarding wizard yet.
        if ($request->filled('name') && ! $request->filled('first_name')) {
            $legacy = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
                'password' => ['required', 'confirmed', Rules\Password::defaults()],
            ]);

            $user = User::create([
                'name' => $legacy['name'],
                'email' => $legacy['email'],
                'password' => Hash::make($legacy['password']),
            ]);

            event(new Registered($user));
            Auth::login($user);

            return redirect(route('dashboard', absolute: false));
        }

        $data = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'phone' => 'nullable|string|max:50',
            'bio' => 'nullable|string|max:5000',
            'organization_name' => 'required|array:en,fr,ar', 'organization_name.en' => 'required_without_all:organization_name.fr,organization_name.ar|nullable|string|max:255', 'organization_name.fr' => 'nullable|string|max:255', 'organization_name.ar' => 'nullable|string|max:255',
            'organization_logo' => 'nullable|image|max:5120',
            'organization_mf' => 'nullable|string|max:255',
            'organization_description' => 'required|string|max:100000',
            'organization_email' => 'nullable|email|max:255',
            'organization_phone' => 'required|string|max:50',
            'organization_state_id' => 'required|exists:locations,id',
            'organization_city' => 'required|string|max:255',
            'organization_address' => 'required|string|max:255',
            'organization_zip_code' => 'nullable|string|max:30',
            'organization_show_phone' => 'required|boolean', 'organization_show_email' => 'required|boolean',
        ]);

        foreach (['facebook', 'instagram', 'tiktok', 'linkedin', 'youtube', 'website'] as $link) {
            $field = 'organization_'.$link;
            $data[$field] = $request->validate([$field => 'nullable|url:http,https|max:2048'])[$field] ?? null;
        }
        $data['organization_logo'] = $request->hasFile('organization_logo') ? $request->file('organization_logo')->store('organizations', 'public') : null;

        [$user, $organization] = DB::transaction(function () use ($data) {
            $user = User::create([
                'name' => $data['first_name'].' '.$data['last_name'],
                'first_name' => $data['first_name'],
                'last_name' => $data['last_name'],
                'email' => $data['email'],
                'role' => 'organizer',
                'password' => Hash::make($data['password']),
                'phone' => $data['phone'] ?? null,
                'bio' => $data['bio'] ?? null,
            ]);

            $organization = Organization::create([
                'name' => $data['organization_name'],
                'logo' => $data['organization_logo'],
                'mf' => $data['organization_mf'] ?: null,
                'description' => ['en' => RichText::clean($data['organization_description'])],
                'email' => $data['organization_email'] ?? null,
                'phone' => $data['organization_phone'],
                'show_phone' => $data['organization_show_phone'],
                'show_email' => $data['organization_show_email'],
                'state_id' => $data['organization_state_id'],
                'city' => $data['organization_city'],
                'address' => $data['organization_address'],
                'zip_code' => $data['organization_zip_code'] ?? null,
                'is_active' => true,
                'facebook' => $data['organization_facebook'] ?? null, 'instagram' => $data['organization_instagram'] ?? null, 'tiktok' => $data['organization_tiktok'] ?? null,
                'linkedin' => $data['organization_linkedin'] ?? null, 'youtube' => $data['organization_youtube'] ?? null, 'website' => $data['organization_website'] ?? null,
            ]);

            $organization->users()->attach($user->id, [
                'role' => 'Owner',
                'show_user' => false,
            ]);

            return [$user, $organization];
        });

        event(new Registered($user));

        Auth::login($user);

        return redirect(route('dashboard', absolute: false));
    }
}
