<?php

namespace App\Http\Controllers;

use App\Models\CulturalItem;
use App\Models\Category;
use App\Models\Event;
use Inertia\Inertia;

class MapController extends Controller
{
    public function __invoke()
    {
        $mediaUrl = fn (?string $path) => ! $path ? null : (preg_match('#^https?://#', $path) ? $path : asset('storage/'.$path));
        $items = CulturalItem::with(['categories:id,name,icon,color', 'types:id,name,icon', 'author:id,name,profession', 'location:id,name'])
            ->where('is_active', true)->get()->map(fn ($item) => [
                ...$item->toArray(), 'kind' => 'cultural', 'main_image' => $mediaUrl($item->main_image),
                'icon_url' => $mediaUrl($item->icon), 'pictures' => array_map($mediaUrl, $item->pictures ?? []),
                'videos' => array_map($mediaUrl, $item->videos ?? []), 'audio' => array_map($mediaUrl, $item->audio ?? []),
                'state' => $item->location?->name['en'] ?? null,
            ]);
        $events = Event::with(['categories:id,name,color', 'eventDates', 'state:id,name', 'organization.users:id,name'])
            ->whereHas('organization', fn ($q) => $q->where('is_active', true))->get()->map(function ($event) use ($mediaUrl) {
                $organization = $event->organization;

                return [
                    ...$event->makeHidden('organization')->toArray(), 'kind' => 'event',
                    'glow' => $event->isCurrentOrUpcoming(), 'state' => $event->state?->name['en'] ?? null,
                    'main_image' => $mediaUrl($event->main_image), 'pictures' => array_map($mediaUrl, $event->pictures ?? []), 'videos' => array_map($mediaUrl, $event->videos ?? []),
                    'organization' => [
                        'id' => $organization->id, 'name' => $organization->name, 'logo' => $mediaUrl($organization->logo), 'description' => $organization->description,
                        'phone' => $organization->show_phone ? $organization->phone : null, 'email' => $organization->show_email ? $organization->email : null,
                        'users' => $organization->users->filter(fn ($user) => $user->pivot->show_user)->map(fn ($user) => ['name' => $user->name, 'role' => $user->pivot->role])->values(),
                    ],
                ];
            });

        return Inertia::render('Client/Home', ['storedItems' => $items, 'storedEvents' => $events, 'storedCategories' => Category::all()->map(fn ($category) => [...$category->toArray(), 'icon_url' => $mediaUrl($category->icon)])]);
    }
}
