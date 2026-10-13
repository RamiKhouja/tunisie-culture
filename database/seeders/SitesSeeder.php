<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Location;
use App\Models\Site;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class SitesSeeder extends Seeder
{
    public function run(): void
    {
        $path = base_path('inp_sites.json');
        if (! is_file($path)) {
            $this->command?->warn("Sites seed file not found: {$path}");

            return;
        }

        $payload = json_decode(file_get_contents($path), true, 512, JSON_THROW_ON_ERROR);
        $categoryIds = Category::query()->orderBy('id')->pluck('id')->all();
        $locationIds = Location::query()->pluck('id')->all();
        $created = 0;
        $skipped = 0;

        foreach ($payload['sites'] ?? [] as $index => $record) {
            $sourceId = (string) ($record['id'] ?? '');
            $name = $this->translatedName($record['name'] ?? null);
            $locationId = (int) ($record['location_id'] ?? 0);
            $latitude = $record['coordinates']['latitude'] ?? null;
            $longitude = $record['coordinates']['longitude'] ?? null;

            if ($sourceId === '' || $name === '' || ! in_array($locationId, $locationIds, true) || ! is_numeric($latitude) || ! is_numeric($longitude)) {
                $skipped++;
                $this->command?->warn("Skipping invalid INP site at index {$index}.");

                continue;
            }

            $site = Site::updateOrCreate(
                ['url' => 'inp-site-'.Str::slug($sourceId)],
                [
                    'name' => $name,
                    'short_description' => [
                        'en' => "INP heritage site in {$record['delegation']}.",
                        'fr' => "Site patrimonial de l’INP à {$record['delegation']}.",
                        'ar' => "موقع تراثي تابع للمعهد الوطني للتراث في {$record['delegation']}.",
                    ],
                    'description' => [
                        'en' => "Site listed in the INP classical heritage inventory. Original reference: {$sourceId}.",
                        'fr' => "Site répertorié dans l’inventaire classique du patrimoine de l’INP. Référence originale : {$sourceId}.",
                        'ar' => "موقع مُدرج في الجرد الكلاسيكي للتراث بالمعهد الوطني للتراث. المرجع الأصلي: {$sourceId}.",
                    ],
                    'main_image' => 'seed/tunisia-map.png',
                    'icon' => null,
                    'pictures' => [],
                    'videos' => [],
                    'location_id' => $locationId,
                    'city' => $record['delegation'] ?? null,
                    'latitude' => $latitude,
                    'longitude' => $longitude,
                    'google_maps_url' => null,
                    'is_active' => true,
                    'founded_by' => null,
                    'foundation_year' => null,
                    'foundation_month' => null,
                    'is_unesco_certif' => false,
                    'unesco_certif_year' => null,
                ],
            );

            $assigned = $categoryIds ? [$categoryIds[0]] : [];
            if (count($categoryIds) > 1 && $index % 3 === 0) {
                $assigned[] = $categoryIds[1];
            }
            $site->categories()->sync($assigned);
            $created++;
        }

        $this->command?->info("Seeded {$created} INP sites".($skipped ? "; skipped {$skipped}." : '.'));
    }

    private function translatedName(mixed $value): array
    {
        if (is_array($value)) {
            $fallback = trim((string) ($value['en'] ?? $value['fr'] ?? $value['ar'] ?? ''));

            return [
                'en' => trim((string) ($value['en'] ?? $fallback)),
                'fr' => trim((string) ($value['fr'] ?? $fallback)),
                'ar' => trim((string) ($value['ar'] ?? $fallback)),
            ];
        }

        $fallback = trim((string) $value);

        return ['en' => $fallback, 'fr' => $fallback, 'ar' => $fallback];
    }
}
