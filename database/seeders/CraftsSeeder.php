<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Craft;
use App\Models\Location;
use Illuminate\Database\Seeder;

class CraftsSeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            'food' => Category::findOrFail(11),
            'crafts' => Category::findOrFail(3),
            'music' => Category::findOrFail(4),
        ];
        $locations = Location::whereIn('code', ['TN-11', 'TN-21', 'TN-23', 'TN-31', 'TN-41', 'TN-51', 'TN-61', 'TN-72'])->get()->keyBy('code');

        $records = [
            ['medina-saveurs-tunis', ['Medina Saveurs', 'Saveurs de la Médina', 'نكهات المدينة'], ['A family food shop sharing Tunisian pantry traditions from the heart of the old medina.', 'Une boutique familiale qui transmet les traditions du garde-manger tunisien au cœur de la médina.', 'متجر عائلي يشارك تقاليد المؤونة التونسية من قلب المدينة العتيقة.'], 'TN-11', 'Tunis', 'Hanen Ben Salem', 'food', [['Harissa arbi', 'Harissa artisanale', 'هريسة عربي', 12.5], ['Meskoudi olive oil', 'Huile d’olive meskoudi', 'زيت زيتون مسكودي', 28], ['Date syrup', 'Sirop de dattes', 'دبس التمر', 15]]],
            ['nabeul-saveurs-du-cap-bon', ['Cap Bon Pantry', 'Saveurs du Cap Bon', 'مؤونة الوطن القبلي'], ['A small shop dedicated to the citrus, spice and preserved-food traditions of Cap Bon.', 'Une petite boutique consacrée aux agrumes, épices et conserves traditionnelles du Cap Bon.', 'متجر صغير مخصص لتقاليد الحمضيات والتوابل والمصبرات في الوطن القبلي.'], 'TN-21', 'Nabeul', 'Sana Trabelsi', 'food', [['Orange blossom water', 'Eau de fleur d’oranger', 'ماء الزهر', 9], ['Artisanal orange jam', 'Confiture d’orange artisanale', 'مربى البرتقال التقليدي', 14], ['Spiced dried peppers', 'Piments séchés épicés', 'فلفل مجفف متبل', 11]]],
            ['sejnane-terre-vivante', ['Living Earth Sejnane', 'Terre vivante de Sejnane', 'تراب سجنان الحي'], ['A workshop preserving Sejnane hand-shaped pottery and natural decoration techniques.', 'Un atelier qui préserve la poterie modelée à la main et les décors naturels de Sejnane.', 'ورشة تحافظ على الفخار المشكل يدويًا وتقنيات الزخرفة الطبيعية في سجنان.'], 'TN-23', 'Sejnane', 'Amel Gharbi', 'crafts', [['Sejnane bird figurine', 'Figurine d’oiseau de Sejnane', 'مجسم طائر سجنان', 32], ['Hand-painted bowl', 'Bol peint à la main', 'زبدية مزخرفة يدويًا', 45], ['Decorative clay plate', 'Assiette décorative en terre', 'طبق طيني للزينة', 55]]],
            ['nabeul-poterie-atelier', ['Nabeul Pottery House', 'Maison de la poterie de Nabeul', 'دار فخار نابل'], ['A pottery shop offering glazed ceramics inspired by Nabeul’s workshops.', 'Une boutique de céramique émaillée inspirée des ateliers de Nabeul.', 'متجر للخزف المزجج مستوحى من ورشات نابل.'], 'TN-21', 'Nabeul', 'Mohamed Ayari', 'crafts', [['Blue-and-white serving plate', 'Plat de service bleu et blanc', 'طبق تقديم أزرق وأبيض', 68], ['Painted ceramic cup', 'Tasse en céramique peinte', 'كأس خزفي مزخرف', 22], ['Tile set', 'Set de carreaux décoratifs', 'مجموعة بلاطات للزينة', 35]]],
            ['testour-oud-makers', ['Testour Oud Makers', 'Les luthiers de Testour', 'صناع العود في تستور'], ['A music shop and workshop specializing in the making and repair of Tunisian ouds.', 'Une boutique et un atelier spécialisés dans la fabrication et la réparation des ouds tunisiens.', 'متجر وورشة متخصصة في صناعة وإصلاح العود التونسي.'], 'TN-31', 'Testour', 'Youssef Khemiri', 'music', [['Handmade oud', 'Oud fabriqué à la main', 'عود مصنوع يدويًا', 1850], ['Oud plectrum set', 'Jeu de plectres pour oud', 'مجموعة ريش للعود', 18], ['Oud maintenance kit', 'Kit d’entretien pour oud', 'عدة صيانة العود', 42]]],
            ['kairouan-mezoued-atelier', ['Kairouan Instrument House', 'Atelier des instruments de Kairouan', 'ورشة آلات القيروان'], ['A workshop for traditional instruments, including mezoued, bendir and regional percussion.', 'Un atelier d’instruments traditionnels : mezoued, bendir et percussions régionales.', 'ورشة للآلات التقليدية مثل المزود والبندير وآلات الإيقاع الجهوية.'], 'TN-41', 'Kairouan', 'Ridha Jlassi', 'music', [['Mezoued', 'Mezoued', 'مزود', 620], ['Bendir', 'Bendir', 'بندير', 170], ['Leather drum head', 'Peau de rechange pour tambour', 'جلدة بديلة للطبل', 38]]],
            ['sousse-woodcraft-atelier', ['Coastal Handcrafts', 'Artisanat du Sahel', 'حرف الساحل'], ['A coastal craft shop bringing together woodwork, woven goods and handmade household pieces.', 'Une boutique artisanale du Sahel réunissant travail du bois, tissage et objets domestiques faits main.', 'متجر حرفي من الساحل يجمع بين الخشب والمنسوجات والقطع المنزلية اليدوية.'], 'TN-51', 'Sousse', 'Meriem Kallel', 'crafts', [['Carved serving tray', 'Plateau de service sculpté', 'صينية تقديم منحوتة', 75], ['Woven market basket', 'Panier de marché tressé', 'سلة سوق منسوجة', 48], ['Palm-fiber storage box', 'Boîte de rangement en fibres de palmier', 'صندوق تخزين من ألياف النخيل', 62]]],
            ['tozeur-palm-studio', ['Tozeur Palm Studio', 'Atelier des palmes de Tozeur', 'ورشة سعف توزر'], ['A workshop turning local palm leaves into practical and decorative objects.', 'Un atelier qui transforme les palmes locales en objets utiles et décoratifs.', 'ورشة تحول سعف النخيل المحلي إلى قطع عملية وزخرفية.'], 'TN-72', 'Tozeur', 'Noura Ghali', 'crafts', [['Palm-leaf basket', 'Panier en feuilles de palmier', 'سلة من سعف النخيل', 36], ['Woven lampshade', 'Abat-jour tressé', 'غطاء مصباح منسوج', 95], ['Palm-fiber mat', 'Natte en fibres de palmier', 'حصيرة من ألياف النخيل', 55]]],
        ];

        foreach ($records as [$slug, $name, $summary, $state, $city, $owner, $category, $products]) {
            $location = $locations[$state] ?? null;
            if (! $location) {
                $this->command?->warn("Skipping craft {$slug}: location {$state} not found.");
                continue;
            }

            $craft = Craft::updateOrCreate(['url' => $slug], [
                'name' => $this->translation($name),
                'short_description' => $this->translation($summary),
                'description' => $this->translation([
                    $summary[0].' This seeded shop record can be expanded with owner, product and media details.',
                    $summary[1].' Cette fiche de boutique peut être enrichie avec des informations sur le propriétaire, les produits et les médias.',
                    $summary[2].' يمكن إثراء بطاقة المتجر هذه بمعلومات عن المالك والمنتجات والوسائط.',
                ]),
                'main_image' => 'seed/tunisia-map.png',
                'icon' => null,
                'pictures' => [],
                'products' => array_map(fn ($product) => [
                    'name' => $this->translation(array_slice($product, 0, 3)),
                    'price' => $product[3],
                    'image' => 'seed/tunisia-map.png',
                ], $products),
                'videos' => [],
                'latitude' => $this->coordinates($state, $city)[1],
                'longitude' => $this->coordinates($state, $city)[0],
                'google_maps_url' => null,
                'owner' => $owner,
                'location_id' => $location->id,
                'city' => $city,
                'is_active' => true,
            ]);
            $craft->categories()->sync([$categories[$category]->id]);
        }
    }

    private function coordinates(string $state, string $city): array
    {
        return match ([$state, $city]) {
            ['TN-11', 'Tunis'] => [10.1815, 36.8065],
            ['TN-21', 'Nabeul'] => [10.7357, 36.4561],
            ['TN-23', 'Sejnane'] => [9.2383, 37.0572],
            ['TN-31', 'Testour'] => [9.4431, 36.5513],
            ['TN-41', 'Kairouan'] => [10.0963, 35.6781],
            ['TN-51', 'Sousse'] => [10.63699, 35.8256],
            ['TN-72', 'Tozeur'] => [8.1335, 33.9197],
            default => [10.1815, 36.8065],
        };
    }

    private function translation(array $values): array
    {
        return ['en' => $values[0], 'fr' => $values[1], 'ar' => $values[2]];
    }
}
