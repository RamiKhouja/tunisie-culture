<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Event;
use App\Models\Location;
use App\Models\Organization;
use App\Support\RichText;
use App\Support\GoogleMapsCoordinates;
use Illuminate\Validation\ValidationException;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class EventController extends Controller
{
    public function index(Request $request)
    {
        $query = Event::with('organization:id,name', 'eventDates')->latest();
        if ($request->user()->role === 'organizer') {
            $query->whereHas('organization.users', fn ($q) => $q->whereKey($request->user()->id));
        }
        return Inertia::render('Admin/Events/Index', ['items' => $query->paginate(20)]);
    }

    public function create(Request $request)
    {
        return $this->form($request);
    }

    public function edit(Request $request, Event $event)
    {
        $this->authorizeEvent($request, $event);
        return $this->form($request, $event->load('categories:id', 'eventDates'));
    }

    private function form(Request $request, ?Event $event = null)
    {
        return Inertia::render('Admin/Events/Form', ['item' => $event, 'organizations' => $request->user()->role === 'organizer' ? $request->user()->organizations()->get(['organizations.id', 'organizations.name']) : Organization::all(['id', 'name']), 'categories' => Category::all(['id', 'name', 'color']), 'locations' => Location::all(['id', 'name', 'cities'])]);
    }

    public function store(Request $request)
    {
        return $this->save($request, new Event);
    }

    public function update(Request $request, Event $event)
    {
        return $this->save($request, $event);
    }

    private function save(Request $request, Event $event)
    {
        $this->authorizeEvent($request, $event);
        if ($request->user()->role === 'organizer' && $request->filled('organization_id')) {
            abort_unless($request->user()->organizations()->whereKey($request->input('organization_id'))->exists(), 403);
        }
        $request->merge(['tags' => $request->input('tags', []), 'existing_pictures' => $request->input('existing_pictures', []), 'existing_videos' => $request->input('existing_videos', []), 'video_urls' => $request->input('video_urls', [])]);
        $rules = [
            'name' => 'required|array:en,fr,ar', 'name.en' => 'required_without_all:name.fr,name.ar|nullable|string|max:255', 'name.fr' => 'nullable|string|max:255', 'name.ar' => 'nullable|string|max:255',
            'main_image' => [$event->exists ? 'nullable' : 'required', 'image', 'max:10240'], 'organization_id' => 'required|exists:organizations,id',
            'category_ids' => 'required|array|min:1', 'category_ids.*' => 'required|integer|distinct|exists:categories,id', 'tags' => 'present|array', 'tags.*' => 'required|string|max:100',
            'event_dates' => 'required|array|min:1', 'event_dates.*.date' => 'required|date_format:Y-m-d', 'event_dates.*.start_at' => 'required|date_format:H:i', 'event_dates.*.end_at' => 'required|date_format:H:i',
            'is_free' => 'required|boolean', 'price' => [Rule::requiredIf(! $request->boolean('is_free')), 'nullable', 'numeric', 'min:0', 'max:9999999999.99'], 'payment_link' => 'nullable|url:http,https|max:2048',
            'short_description' => 'required|string|max:10000', 'description' => 'required|string|max:100000', 'google_maps_url' => 'nullable|url|max:2048', 'latitude' => 'required_without:google_maps_url|nullable|numeric|between:-90,90', 'longitude' => 'required_without:google_maps_url|nullable|numeric|between:-180,180',
            'state_id' => 'required|exists:locations,id', 'city' => 'required|string|max:255', 'place_name' => 'required|string|max:255',
            'pictures' => 'nullable|array', 'pictures.*' => 'image|max:10240',
            'existing_pictures' => 'present|array', 'existing_pictures.*' => ['string', Rule::in($event->pictures ?? [])],
            'existing_videos' => 'present|array', 'existing_videos.*' => ['string', Rule::in($event->videos ?? [])],
            'video_files' => 'nullable|array', 'video_files.*' => 'file|mimetypes:video/mp4,video/webm,video/quicktime|max:51200', 'video_urls' => 'present|array', 'video_urls.*' => 'required|url:http,https|max:2048',
        ];
        foreach (['facebook', 'instagram', 'tiktok', 'linkedin', 'youtube', 'website', 'other_link'] as $field) {
            $rules[$field] = 'nullable|url:http,https|max:2048';
        }
        $data = $request->validate($rules);
        if ($request->filled('google_maps_url')) {
            $coordinates = GoogleMapsCoordinates::extract($request->input('google_maps_url'));
            if (! $coordinates) {
                throw ValidationException::withMessages(['google_maps_url' => 'The Google Maps URL does not contain a valid latitude and longitude.']);
            }
            $data = [...$data, ...$coordinates];
        }
        foreach (['description', 'short_description'] as $field) {
            $data[$field] = RichText::clean($data[$field]);
        }
        $data['price'] = $request->boolean('is_free') ? 0 : $data['price'];
        $data['main_image'] = $request->hasFile('main_image') ? $request->file('main_image')->store('events/main', 'public') : $event->main_image;
        $data['pictures'] = $data['existing_pictures'];
        foreach ($request->file('pictures', []) as $file) {
            $data['pictures'][] = $file->store('events/pictures', 'public');
        }
        $data['videos'] = array_values(array_unique([...$data['existing_videos'], ...$data['video_urls']]));
        foreach ($request->file('video_files', []) as $file) {
            $data['videos'][] = $file->store('events/videos', 'public');
        }
        DB::transaction(function () use ($data, $event) {
            $event->fill(Arr::except($data, ['category_ids', 'event_dates', 'existing_pictures', 'existing_videos', 'video_urls', 'video_files']))->save();
            $event->categories()->sync($data['category_ids']);
            $event->eventDates()->delete();
            $event->eventDates()->createMany(array_map(fn ($slot) => Arr::only($slot, ['date', 'start_at', 'end_at']), $data['event_dates']));
        });

        return to_route('admin.events.index')->with('success', 'Event saved.');
    }

    private function authorizeEvent(Request $request, Event $event): void
    {
        abort_unless($request->user()->role === 'admin' || !$event->exists || $event->organization()->whereHas('users', fn ($q) => $q->whereKey($request->user()->id))->exists(), 403);
    }

    public function destroy(Request $request, Event $event)
    {
        $this->authorizeEvent($request, $event);
        $event->delete();

        return back()->with('success', 'Event deleted.');
    }
}
