<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Event;
use App\Models\EventDate;
use App\Models\Location;
use App\Models\Organization;
use App\Models\User;
use Carbon\Carbon;
use Database\Seeders\CulturalCatalogSeeder;
use Database\Seeders\OrganizationEventSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class OrganizationEventTest extends TestCase
{
    use RefreshDatabase;

    private function organizationData(): array
    {
        $state = Location::create(['name' => ['en' => 'Tunis'], 'code' => 'TN11', 'cities' => ['Tunis']]);

        return ['name' => ['en' => 'Association', 'fr' => 'Association', 'ar' => 'جمعية'], 'description' => '<p onclick="bad()">Culture <strong>for everyone</strong></p>', 'phone' => '12345678', 'email' => 'private@example.com', 'show_phone' => false, 'show_email' => false, 'is_active' => true, 'state_id' => $state->id, 'city' => 'Tunis', 'address' => 'Medina', 'users' => []];
    }

    public function test_organization_membership_crud_and_validation(): void
    {
        Storage::fake('public');
        $user = User::factory()->create();
        $this->actingAs($user);
        $data = $this->organizationData();
        $data['users'] = [['user_id' => $user->id, 'role' => 'Curator', 'show_user' => true]];
        $data['logo'] = UploadedFile::fake()->image('logo.png');
        $this->post(route('admin.organizations.store'), $data)->assertSessionHasNoErrors()->assertRedirect();
        $org = Organization::firstOrFail();
        $this->assertSame('<p>Culture <strong>for everyone</strong></p>', $org->description);
        $this->assertSame('Curator', $org->users->first()->pivot->role);
        $this->assertSame($org->id, $user->organizations->first()->id);
        Storage::disk('public')->assertExists($org->logo);
        unset($data['logo']);
        $data['users'][] = $data['users'][0];
        $this->put(route('admin.organizations.update', $org), $data)->assertSessionHasErrors('users.0.user_id');
        $data['users'] = [];
        $data['show_phone'] = true;
        $this->put(route('admin.organizations.update', $org), $data)->assertSessionHasNoErrors();
        $this->assertCount(0, $org->fresh()->users);
        $this->assertTrue($org->fresh()->show_phone);
        $this->delete(route('admin.organizations.destroy', $org))->assertRedirect();
        $this->assertDatabaseMissing('organizations', ['id' => $org->id]);
    }

    public function test_event_crud_map_privacy_media_and_validation(): void
    {
        Storage::fake('public');
        $user = User::factory()->create();
        $this->actingAs($user);
        $org = Organization::create($this->organizationData());
        $org->users()->attach($user, ['role' => 'Private member', 'show_user' => false]);
        $category = Category::create(['name' => ['en' => 'Music'], 'url' => 'music', 'color' => '#123abc']);
        $data = ['name' => ['fr' => 'Concert'], 'organization_id' => $org->id, 'main_image' => UploadedFile::fake()->image('event.png'), 'category_ids' => [$category->id], 'tags' => ['music'], 'event_dates' => [['date' => now('Africa/Tunis')->toDateString(), 'start_at' => '19:00', 'end_at' => '21:00']], 'is_free' => true, 'price' => 20, 'short_description' => '<p>Live music</p>', 'description' => '<p onmouseover="bad()">Welcome</p>', 'latitude' => 36.8, 'longitude' => 10.18, 'state_id' => $org->state_id, 'city' => 'Tunis', 'place_name' => 'Theater', 'pictures' => [UploadedFile::fake()->image('gallery.png')], 'existing_pictures' => [], 'existing_videos' => [], 'video_urls' => ['https://example.com/video.mp4']];
        $this->post(route('admin.events.store'), $data)->assertSessionHasNoErrors()->assertRedirect();
        $event = Event::firstOrFail();
        $this->assertEquals(0, $event->price);
        $this->assertSame('<p>Welcome</p>', $event->description);
        $this->assertCount(1, $event->eventDates);
        $this->assertCount(1, $event->pictures);
        $this->get('/')->assertInertia(fn (Assert $page) => $page->has('storedEvents', 1)->where('storedEvents.0.glow', true)->where('storedEvents.0.categories.0.color', '#123abc')->where('storedEvents.0.organization.phone', null)->where('storedEvents.0.organization.email', null)->has('storedEvents.0.organization.users', 0)->missing('storedEvents.0.organization.mf'));
        unset($data['main_image'], $data['pictures']);
        $data['event_dates'] = [['date' => now('Africa/Tunis')->subDays(3)->toDateString(), 'start_at' => '18:00', 'end_at' => '20:00']];
        $data['video_urls'] = [];
        $this->put(route('admin.events.update', $event), $data)->assertSessionHasNoErrors();
        $this->assertFalse($event->fresh()->isCurrentOrUpcoming());
        $this->assertCount(0, $event->fresh()->pictures);
        $this->assertCount(0, $event->fresh()->videos);
        $data['latitude'] = 91;
        $data['event_dates'][0]['start_at'] = '25:00';
        $data['website'] = 'javascript:alert(1)';
        $this->put(route('admin.events.update', $event), $data)->assertSessionHasErrors(['latitude', 'event_dates.0.start_at', 'website']);
        $org->update(['is_active' => false]);
        $this->get('/')->assertInertia(fn (Assert $page) => $page->has('storedEvents', 0));
        $this->delete(route('admin.events.destroy', $event))->assertRedirect();
        $this->assertDatabaseMissing('event_dates', ['event_id' => $event->id]);
        $this->assertDatabaseMissing('category_event', ['event_id' => $event->id]);
    }

    public function test_glow_uses_last_date_and_handles_overnight_end_dates(): void
    {
        $this->travelTo(Carbon::parse('2026-09-17 12:00:00', 'Africa/Tunis'));
        $event = new Event;
        $event->setRelation('eventDates', collect([new EventDate(['date' => '2026-09-16', 'start_at' => '23:00', 'end_at' => '02:00'])]));
        $this->assertTrue($event->isCurrentOrUpcoming());
        $event->setRelation('eventDates', collect([new EventDate(['date' => '2026-09-16', 'start_at' => '18:00', 'end_at' => '22:00'])]));
        $this->assertFalse($event->isCurrentOrUpcoming());
        $event->eventDates->push(new EventDate(['date' => '2026-09-20', 'start_at' => '18:00', 'end_at' => '22:00']));
        $this->assertTrue($event->isCurrentOrUpcoming());
    }

    public function test_demo_seeding_is_repeatable_and_category_colors_are_validated(): void
    {
        $this->seed(CulturalCatalogSeeder::class);
        $categoryIds = Category::pluck('id')->all();
        $this->seed(OrganizationEventSeeder::class);
        $this->seed(OrganizationEventSeeder::class);
        $this->assertDatabaseCount('organizations', 1);
        $this->assertDatabaseCount('events', 12);
        $this->assertDatabaseCount('event_dates', 12);
        $this->assertSame($categoryIds, Category::pluck('id')->all());
        $this->assertSame(12, Event::distinct()->count('state_id'));
        $this->assertSame(6, Event::with('categories')->get()->pluck('categories')->flatten()->unique('id')->count());
        $this->actingAs(User::factory()->create());
        $data = ['name' => ['en' => 'Arts'], 'url' => 'arts', 'color' => '#43ab12'];
        $this->post(route('admin.categories.store'), $data)->assertSessionHasNoErrors();
        $category = Category::where('url', 'arts')->firstOrFail();
        $this->assertSame('#43ab12', $category->color);
        $data['color'] = 'invalid-color';
        $this->put(route('admin.categories.update', $category), $data)->assertSessionHasErrors('color');
    }

    public function test_guest_cannot_change_catalog(): void
    {
        foreach (['organizations', 'events'] as $resource) {
            $this->post(route("admin.$resource.store"), [])->assertRedirect(route('login'));
            $this->get(route("admin.$resource.index"))->assertRedirect(route('login'));
        }
    }
}
