<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Event;
use App\Models\Location;
use App\Models\Organization;
use App\Models\User;
use Illuminate\Database\Seeder;

class OrganizationEventSeeder extends Seeder
{
    public function run(): void
    {
        $locations = Location::all()->keyBy('code');
        $categories = Category::all()->keyBy('url');
        $state = $locations->get('TN-11');
        if (! $state) {
            return;
        }
        $organization = Organization::firstOrCreate(['mf' => 'DEMO-ATHAR'], [
            'name' => ['en' => 'Athar Cultural Association (demo)', 'fr' => 'Association culturelle Athar (démo)', 'ar' => 'جمعية آثار الثقافية (تجريبي)'],
            'logo' => 'https://placehold.co/200x200/49351f/f4e7c7.png?text=Athar', 'description' => '<p>Demo organization supporting local arts and heritage.</p>',
            'phone' => '+216 00 000 000', 'email' => 'demo@example.com', 'show_phone' => false, 'show_email' => false,
            'state_id' => $state->id, 'city' => 'Tunis', 'address' => 'Tunis, Tunisia', 'is_active' => true,
        ]);
        if ($user = User::first()) {
            $organization->users()->syncWithoutDetaching([$user->id => ['role' => 'Coordinator', 'show_user' => false]]);
        }
        $records = [
            ['Heritage evening', 'Soirée du patrimoine', 'أمسية تراثية', 'TN-11', 'Tunis', 0, 36.8065, 10.1815, ['intangible-heritage']],
            ['Medina music', 'Musique de la médina', 'موسيقى المدينة', 'TN-51', 'Sousse', 7, 35.8256, 10.6369, ['music']],
            ['Art workshop', 'Atelier d’art', 'ورشة فنية', 'TN-21', 'Nabeul', 14, 36.4561, 10.7376, ['crafts']],
            ['Past cultural gathering', 'Rencontre culturelle passée', 'لقاء ثقافي سابق', 'TN-61', 'Sfax', -7, 34.7406, 10.7603, ['customs']],
            ['Sejnane pottery workshop', 'Atelier de poterie de Sejnane', 'ورشة فخار سجنان', 'TN-23', 'Sejnane', 3, 37.0572, 9.2383, ['crafts']],
            ['Testour Malouf evening', 'Soirée malouf à Testour', 'أمسية مالوف بتستور', 'TN-31', 'Testour', 5, 36.5513, 9.4431, ['music', 'intangible-heritage']],
            ['Kairouan heritage walk', 'Balade patrimoniale à Kairouan', 'جولة تراثية بالقيروان', 'TN-41', 'Kairouan', 9, 35.6781, 10.0963, ['built-heritage']],
            ['El Jem music evening', 'Soirée musicale à El Jem', 'أمسية موسيقية بالجم', 'TN-53', 'El Jem', 12, 35.2964, 10.7069, ['music', 'built-heritage']],
            ['Douz poetry circle', 'Cercle de poésie à Douz', 'حلقة شعر بدوز', 'TN-73', 'Douz', 16, 33.4663, 9.0203, [$categories->has('poetry-and-tales') ? 'poetry-and-tales' : 'oral-traditions']],
            ['Matmata architecture tour', 'Visite architecturale de Matmata', 'جولة معمارية بمطماطة', 'TN-81', 'Matmata', 19, 33.5426, 9.9667, ['built-heritage']],
            ['Djerba traditions day', 'Journée des traditions de Djerba', 'يوم تقاليد جربة', 'TN-82', 'Houmt Souk', 21, 33.8758, 10.8575, ['customs', 'intangible-heritage']],
            ['Tozeur palm weaving', 'Tressage de palmes à Tozeur', 'نسج السعف بتوزر', 'TN-72', 'Tozeur', 24, 33.9197, 8.1335, ['crafts']],
        ];

        foreach ($records as [$en, $fr, $ar, $stateCode, $city, $days, $lat, $lng, $categorySlugs]) {
            $eventState = $locations->get($stateCode);
            $categoryIds = collect($categorySlugs)->map(fn ($slug) => $categories->get($slug)?->id)->filter()->values()->all();
            if (! $eventState || count($categoryIds) !== count($categorySlugs)) {
                $this->command?->warn("Skipping {$en}: required state or existing categories are missing.");

                continue;
            }
            $event = Event::updateOrCreate(['organization_id' => $organization->id, 'name->en' => $en.' (demo)'], [
                'name' => ['en' => $en.' (demo)', 'fr' => $fr.' (démo)', 'ar' => $ar.' (تجريبي)'],
                'main_image' => 'https://placehold.co/960x540/49351f/f4e7c7.png?text='.rawurlencode($en),
                'tags' => ['demo', 'culture'], 'is_free' => true, 'price' => 0, 'short_description' => '<p>A demonstration event for the cultural map.</p>',
                'description' => '<p>Sample content for exploring events, category colors and map clusters.</p>',
                'latitude' => $lat, 'longitude' => $lng, 'state_id' => $eventState->id, 'city' => $city, 'place_name' => 'Demo cultural venue', 'pictures' => [], 'videos' => [],
            ]);
            $event->categories()->sync($categoryIds);
            $event->eventDates()->updateOrCreate(
                ['start_at' => '18:00', 'end_at' => '21:00'],
                ['date' => now('Africa/Tunis')->addDays($days)->toDateString()],
            );
        }
    }
}
