<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\CulturalItem;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class CulturalItemCoordinatesTest extends TestCase
{
    use RefreshDatabase;

    public function test_coordinates_are_saved_updated_and_exposed_on_the_public_map(): void
    {
        Storage::fake('public');
        $category = Category::create(['name' => ['en' => 'Heritage'], 'url' => 'heritage']);
        $this->actingAs(User::factory()->create());
        $data = [
            'name' => ['en' => 'Carthage'], 'short_description' => ['en' => 'Historic site'],
            'description' => ['en' => 'A cultural site'], 'url' => 'carthage',
            'main_image' => UploadedFile::fake()->image('site.jpg'),
            'category_ids' => [$category->id], 'importance' => 'high', 'is_active' => true,
            'latitude' => 36.852800, 'longitude' => 10.323300,
        ];
        $this->post(route('admin.cultural-items.store'), $data)->assertSessionHasNoErrors()->assertRedirect();
        $item = CulturalItem::firstOrFail();
        $this->assertEquals(36.8528, $item->latitude);
        $this->assertNull($item->x_position);
        unset($data['main_image']);
        $data['longitude'] = 10.324123;
        $this->put(route('admin.cultural-items.update', $item), $data)->assertSessionHasNoErrors();
        $this->get('/')->assertInertia(fn (Assert $page) => $page->component('Client/Home')
            ->has('storedItems', 1)->where('storedItems.0.longitude', 10.324123));
        $data['latitude'] = 91;
        $this->put(route('admin.cultural-items.update', $item), $data)->assertSessionHasErrors('latitude');
        $data['latitude'] = '';
        $data['longitude'] = '';
        $this->put(route('admin.cultural-items.update', $item), $data)->assertSessionHasErrors(['latitude', 'longitude']);
    }
}
