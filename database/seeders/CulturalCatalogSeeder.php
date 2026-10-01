<?php

namespace Database\Seeders;

use App\Models\Artist;
use App\Models\Category;
use App\Models\CulturalItem;
use App\Models\Location;
use App\Models\Type;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class CulturalCatalogSeeder extends Seeder
{
    public function run(): void
    {
        $this->seedMapImage();
        $locations = $this->seedLocations();
        $categories = $this->seedCategories();
        $types = $this->seedTypes($categories);
        $artists = $this->seedArtists();
        $this->seedCulturalItems($locations, $categories, $types, $artists);
    }

    private function seedMapImage(): void
    {
        $source = storage_path('app/pictures/tunisia-map.png');
        if (is_file($source) && ! Storage::disk('public')->exists('seed/tunisia-map.png')) {
            Storage::disk('public')->put('seed/tunisia-map.png', file_get_contents($source));
        }
    }

    private function seedLocations(): array
    {
        $records = [
            ['TN-11', ['Tunis', 'Tunis', 'تونس'], [['Tunis', 'Tunis', 'تونس'], ['Carthage', 'Carthage', 'قرطاج'], ['Sidi Bou Saïd', 'Sidi Bou Saïd', 'سيدي بوسعيد']]],
            ['TN-12', ['Ariana', 'Ariana', 'أريانة'], [['Ariana', 'Ariana', 'أريانة'], ['Raoued', 'Raoued', 'رواد']]],
            ['TN-13', ['Ben Arous', 'Ben Arous', 'بن عروس'], [['Ben Arous', 'Ben Arous', 'بن عروس'], ['Radès', 'Radès', 'رادس']]],
            ['TN-14', ['Manouba', 'La Manouba', 'منوبة'], [['Manouba', 'La Manouba', 'منوبة'], ['Tebourba', 'Tebourba', 'طبربة']]],
            ['TN-21', ['Nabeul', 'Nabeul', 'نابل'], [['Nabeul', 'Nabeul', 'نابل'], ['Hammamet', 'Hammamet', 'الحمامات'], ['Kelibia', 'Kélibia', 'قليبية']]],
            ['TN-22', ['Zaghouan', 'Zaghouan', 'زغوان'], [['Zaghouan', 'Zaghouan', 'زغوان'], ['El Fahs', 'El Fahs', 'الفحص']]],
            ['TN-23', ['Bizerte', 'Bizerte', 'بنزرت'], [['Bizerte', 'Bizerte', 'بنزرت'], ['Sejnane', 'Sejnane', 'سجنان'], ['Menzel Bourguiba', 'Menzel Bourguiba', 'منزل بورقيبة']]],
            ['TN-31', ['Béja', 'Béja', 'باجة'], [['Béja', 'Béja', 'باجة'], ['Testour', 'Testour', 'تستور'], ['Medjez el-Bab', 'Medjez el-Bab', 'مجاز الباب']]],
            ['TN-32', ['Jendouba', 'Jendouba', 'جندوبة'], [['Jendouba', 'Jendouba', 'جندوبة'], ['Tabarka', 'Tabarka', 'طبرقة'], ['Aïn Draham', 'Aïn Draham', 'عين دراهم']]],
            ['TN-33', ['Kef', 'Le Kef', 'الكاف'], [['Kef', 'Le Kef', 'الكاف'], ['Dahmani', 'Dahmani', 'الدهماني']]],
            ['TN-34', ['Siliana', 'Siliana', 'سليانة'], [['Siliana', 'Siliana', 'سليانة'], ['Makthar', 'Makthar', 'مكثر']]],
            ['TN-41', ['Kairouan', 'Kairouan', 'القيروان'], [['Kairouan', 'Kairouan', 'القيروان'], ['Haffouz', 'Haffouz', 'حفوز']]],
            ['TN-42', ['Kasserine', 'Kasserine', 'القصرين'], [['Kasserine', 'Kasserine', 'القصرين'], ['Sbeitla', 'Sbeïtla', 'سبيطلة']]],
            ['TN-43', ['Sidi Bouzid', 'Sidi Bouzid', 'سيدي بوزيد'], [['Sidi Bouzid', 'Sidi Bouzid', 'سيدي بوزيد'], ['Regueb', 'Regueb', 'الرقاب']]],
            ['TN-51', ['Sousse', 'Sousse', 'سوسة'], [['Sousse', 'Sousse', 'سوسة'], ['Hergla', 'Hergla', 'هرقلة'], ['Kalaa Kebira', 'Kalâa Kebira', 'القلعة الكبرى']]],
            ['TN-52', ['Monastir', 'Monastir', 'المنستير'], [['Monastir', 'Monastir', 'المنستير'], ['Moknine', 'Moknine', 'المكنين']]],
            ['TN-53', ['Mahdia', 'Mahdia', 'المهدية'], [['Mahdia', 'Mahdia', 'المهدية'], ['El Jem', 'El Jem', 'الجم']]],
            ['TN-61', ['Sfax', 'Sfax', 'صفاقس'], [['Sfax', 'Sfax', 'صفاقس'], ['Kerkennah', 'Kerkennah', 'قرقنة']]],
            ['TN-71', ['Gafsa', 'Gafsa', 'قفصة'], [['Gafsa', 'Gafsa', 'قفصة'], ['Métlaoui', 'Métlaoui', 'المتلوي']]],
            ['TN-72', ['Tozeur', 'Tozeur', 'توزر'], [['Tozeur', 'Tozeur', 'توزر'], ['Nefta', 'Nefta', 'نفطة']]],
            ['TN-73', ['Kébili', 'Kébili', 'قبلي'], [['Kébili', 'Kébili', 'قبلي'], ['Douz', 'Douz', 'دوز']]],
            ['TN-81', ['Gabès', 'Gabès', 'قابس'], [['Gabès', 'Gabès', 'قابس'], ['Matmata', 'Matmata', 'مطماطة']]],
            ['TN-82', ['Médenine', 'Médenine', 'مدنين'], [['Médenine', 'Médenine', 'مدنين'], ['Houmt Souk', 'Houmt Souk', 'حومة السوق'], ['Zarzis', 'Zarzis', 'جرجيس']]],
            ['TN-83', ['Tataouine', 'Tataouine', 'تطاوين'], [['Tataouine', 'Tataouine', 'تطاوين'], ['Chenini', 'Chenini', 'شنني']]],
        ];

        $locations = [];
        foreach ($records as [$code, $name, $cities]) {
            $locations[$code] = Location::updateOrCreate(
                ['code' => $code],
                ['name' => $this->translation($name), 'cities' => array_map(fn ($city) => $this->translation($city), $cities)],
            );
        }

        return $locations;
    }

    private function seedCategories(): array
    {
        $records = [
            'built-heritage' => [['Built heritage', 'Patrimoine bâti', 'التراث المعماري'], ['Historic monuments, archaeological sites and traditional architecture.', 'Monuments historiques, sites archéologiques et architecture traditionnelle.', 'المعالم التاريخية والمواقع الأثرية والعمارة التقليدية.']],
            'intangible-heritage' => [['Intangible heritage', 'Patrimoine immatériel', 'التراث اللامادي'], ['Living traditions, knowledge and forms of expression.', 'Traditions vivantes, savoir-faire et formes d’expression.', 'التقاليد الحية والمعارف وأشكال التعبير.']],
            'crafts' => [['Crafts', 'Artisanat', 'الحرف التقليدية'], ['Traditional materials, techniques and handmade objects.', 'Matières, techniques et objets traditionnels faits main.', 'المواد والتقنيات والمنتجات التقليدية اليدوية.']],
            'music' => [['Music', 'Musique', 'الموسيقى'], ['Musical repertoires, instruments and performance traditions.', 'Répertoires, instruments et traditions musicales.', 'الأنماط والآلات والتقاليد الموسيقية.']],
            'customs' => [['Customs and rituals', 'Coutumes et rituels', 'العادات والطقوس'], ['Social practices, celebrations and community rituals.', 'Pratiques sociales, fêtes et rituels communautaires.', 'الممارسات الاجتماعية والاحتفالات والطقوس المجتمعية.']],
            'oral-traditions' => [['Oral traditions', 'Traditions orales', 'التقاليد الشفوية'], ['Stories, poetry and memory transmitted by voice.', 'Récits, poésie et mémoire transmis oralement.', 'الحكايات والشعر والذاكرة المنقولة شفويا.']],
        ];

        $categories = [];
        foreach ($records as $slug => [$name, $description]) {
            $categories[$slug] = Category::updateOrCreate(['url' => $slug], ['name' => $this->translation($name), 'description' => $this->translation($description)]);
        }
        foreach (['crafts', 'music', 'customs', 'oral-traditions'] as $child) {
            $categories[$child]->update(['parent_id' => $categories['intangible-heritage']->id]);
        }

        return $categories;
    }

    private function seedTypes(array $categories): array
    {
        $records = [
            'archaeological-site' => [['Archaeological site', 'Site archéologique', 'موقع أثري'], 'built-heritage'],
            'religious-monument' => [['Religious monument', 'Monument religieux', 'معلم ديني'], 'built-heritage'],
            'traditional-building' => [['Traditional building', 'Bâtiment traditionnel', 'مبنى تقليدي'], 'built-heritage'],
            'craft-practice' => [['Craft practice', 'Pratique artisanale', 'ممارسة حرفية'], 'crafts'],
            'musical-tradition' => [['Musical tradition', 'Tradition musicale', 'تقليد موسيقي'], 'music'],
            'oral-expression' => [['Oral expression', 'Expression orale', 'تعبير شفوي'], 'oral-traditions'],
            'social-practice' => [['Social practice', 'Pratique sociale', 'ممارسة اجتماعية'], 'customs'],
        ];
        $types = [];
        foreach ($records as $slug => [$name, $category]) {
            $types[$slug] = Type::updateOrCreate(['url' => $slug], ['name' => $this->translation($name), 'category_id' => $categories[$category]->id]);
        }

        return $types;
    }

    private function seedArtists(): array
    {
        $records = [
            'hannibal-barca' => [['Hannibal Barca', 'Hannibal Barca', 'حنبعل برقا'], 'Carthaginian general', ['A major military leader of ancient Carthage.', 'Grand chef militaire de la Carthage antique.', 'قائد عسكري بارز من قرطاج القديمة.']],
            'uqba-ibn-nafi' => [['Uqba ibn Nafi', 'Oqba Ibn Nafi', 'عقبة بن نافع'], 'Founder and military leader', ['Founder associated with Kairouan and its great mosque.', 'Fondateur associé à Kairouan et à sa grande mosquée.', 'مؤسس ارتبط اسمه بالقيروان وجامعها الكبير.']],
            'khemais-tarnane' => [['Khemaïs Tarnane', 'Khemaïs Tarnane', 'خميس ترنان'], 'Musician and composer', ['A leading twentieth-century master of Tunisian Malouf.', 'Une figure majeure du malouf tunisien au XXe siècle.', 'أحد أبرز أعلام المالوف التونسي في القرن العشرين.']],
            'women-potters-sejnane' => [['Women potters of Sejnane', 'Potières de Sejnane', 'حرفيات سجنان'], 'Tradition bearers', ['Generations of women preserving Sejnane pottery knowledge.', 'Des générations de femmes préservant le savoir de la poterie de Sejnane.', 'أجيال من النساء حافظن على معارف فخار سجنان.']],
        ];
        $artists = [];
        foreach ($records as $slug => [$name, $profession, $description]) {
            $artists[$slug] = Artist::updateOrCreate(['url' => $slug], ['name' => $this->translation($name), 'profession' => $profession, 'description' => $this->translation($description)]);
        }

        return $artists;
    }

    private function seedCulturalItems(array $locations, array $categories, array $types, array $artists): void
    {
        $items = [
            ['carthage-archaeological-site', ['Carthage Archaeological Site', 'Site archéologique de Carthage', 'موقع قرطاج الأثري'], ['The monumental remains of ancient Punic and Roman Carthage.', 'Les vestiges monumentaux de la Carthage punique et romaine.', 'البقايا الأثرية لقرطاج البونية والرومانية.'], 'TN-11', 'Carthage', 57, 11, 'high', '-814', 'hannibal-barca', ['built-heritage'], ['archaeological-site']],
            ['great-mosque-kairouan', ['Great Mosque of Kairouan', 'Grande Mosquée de Kairouan', 'جامع القيروان الكبير'], ['A masterpiece of Islamic architecture in the heart of Kairouan.', 'Un chef-d’œuvre de l’architecture islamique au cœur de Kairouan.', 'تحفة من العمارة الإسلامية في قلب القيروان.'], 'TN-41', 'Kairouan', 50, 29, 'high', '670', 'uqba-ibn-nafi', ['built-heritage'], ['religious-monument']],
            ['sejnane-pottery', ['Sejnane Pottery', 'Poterie de Sejnane', 'فخار سجنان'], ['An ancestral craft shaped and painted by the women of Sejnane.', 'Un artisanat ancestral façonné et peint par les femmes de Sejnane.', 'حرفة عريقة تشكلها وتزخرفها نساء سجنان.'], 'TN-23', 'Sejnane', 40, 11, 'high', 'Traditional', 'women-potters-sejnane', ['intangible-heritage', 'crafts'], ['craft-practice']],
            ['malouf-testour', ['Malouf of Testour', 'Malouf de Testour', 'مالوف تستور'], ['Tunisia’s classical Andalusian musical tradition.', 'La tradition musicale classique andalouse de Tunisie.', 'التقليد الموسيقي الأندلسي الكلاسيكي في تونس.'], 'TN-31', 'Testour', 43, 16, 'medium', 'Andalusian era', 'khemais-tarnane', ['intangible-heritage', 'music'], ['musical-tradition']],
            ['el-jem-amphitheatre', ['El Jem Amphitheatre', 'Amphithéâtre d’El Jem', 'مسرح الجم'], ['A remarkably preserved Roman amphitheatre rising above El Jem.', 'Un amphithéâtre romain remarquablement conservé dominant El Jem.', 'مدرج روماني محفوظ بشكل استثنائي يعلو مدينة الجم.'], 'TN-53', 'El Jem', 57, 36, 'high', '3rd century', null, ['built-heritage'], ['archaeological-site']],
            ['djerba-wedding-traditions', ['Djerba Wedding Traditions', 'Traditions du mariage à Djerba', 'تقاليد الزواج في جربة'], ['Dress, music and rituals celebrating marriage on the island.', 'Costumes, musique et rituels célébrant le mariage sur l’île.', 'أزياء وموسيقى وطقوس تحتفي بالزواج في الجزيرة.'], 'TN-82', 'Houmt Souk', 69, 50, 'medium', 'Traditional', null, ['intangible-heritage', 'customs'], ['social-practice']],
            ['matmata-troglodyte-houses', ['Matmata Troglodyte Houses', 'Habitations troglodytes de Matmata', 'منازل مطماطة الجوفية'], ['Courtyard homes carved into the soft rock of southern Tunisia.', 'Des maisons à cour creusées dans la roche tendre du sud tunisien.', 'منازل ذات أفنية محفورة في صخور الجنوب التونسي.'], 'TN-81', 'Matmata', 61, 57, 'medium', 'Traditional', null, ['built-heritage'], ['traditional-building']],
            ['saharan-oral-poetry', ['Saharan Oral Poetry', 'Poésie orale saharienne', 'الشعر الشفوي الصحراوي'], ['Stories, memory and desert life preserved through spoken verse.', 'Récits, mémoire et vie du désert préservés par la poésie récitée.', 'حكايات وذاكرة وحياة الصحراء محفوظة في الشعر المنطوق.'], 'TN-73', 'Douz', 43, 61, 'low', 'Traditional', null, ['intangible-heritage', 'oral-traditions'], ['oral-expression']],
        ];

        foreach ($items as [$slug, $name, $summary, $state, $city, $x, $y, $importance, $release, $author, $categorySlugs, $typeSlugs]) {
            $description = [
                $summary[0].' This seeded record can be expanded with archival research, media and contributor details.',
                $summary[1].' Cette fiche initiale peut être enrichie par des recherches, des médias et des informations sur les contributeurs.',
                $summary[2].' يمكن إثراء هذه البطاقة الأولية بالبحوث والوسائط ومعلومات المساهمين.',
            ];
            $item = CulturalItem::updateOrCreate(['url' => $slug], [
                'name' => $this->translation($name),
                'short_description' => $this->translation($summary),
                'description' => $this->translation($description),
                'main_image' => 'seed/tunisia-map.png',
                'pictures' => [], 'videos' => [], 'audio' => [],
                'x_position' => $x, 'y_position' => $y,
                'author_id' => $author ? $artists[$author]->id : null,
                'people' => $author ? [['name' => $artists[$author]->name['en'], 'position' => $artists[$author]->profession]] : [],
                'location_id' => $locations[$state]->id, 'city' => $city,
                'is_active' => true, 'release' => $release, 'importance' => $importance,
            ]);
            $item->categories()->sync(array_map(fn ($key) => $categories[$key]->id, $categorySlugs));
            $item->types()->sync(array_map(fn ($key) => $types[$key]->id, $typeSlugs));
        }
    }

    private function translation(array $values): array
    {
        return ['en' => $values[0], 'fr' => $values[1], 'ar' => $values[2]];
    }
}
