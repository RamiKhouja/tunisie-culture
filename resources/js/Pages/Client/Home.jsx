import GovernorateSelect from '@/Components/GovernorateSelect';
import DiscoveryContent from '@/Components/DiscoveryContent';
import { tunisiaToday } from '@/lib/discoveryContent';
import governorateLabels from '@/Components/tunisia-labels.json';
import { categoryGroups as groupCategories, categoryMatcher } from '@/lib/categoryGroups';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { culturalItemPosition } from '@/lib/culturalItemPosition';
import { googleMapsUrl } from '@/lib/googleMaps';
import TunisiaMap from '@/Components/TunisiaMap';
import ClientLayout from '@/Layouts/ClientLayout';
import { Head } from '@inertiajs/react';
import { localizedValue, useLanguage } from '@/i18n';
import { useEffect, useMemo, useState } from 'react';

const icons = {
    monument: <><path d="M4 20h16M6 17h12M8 17V9m4 8V9m4 8V9M5 9h14L12 4 5 9Z" /></>,
    architecture: <><path d="M5 20V9l7-5 7 5v11M9 20v-6h6v6M8 10h.01M16 10h.01" /></>,
    craft: <><path d="M8 4h8M9 4c0 3-3 5-3 10a6 6 0 0 0 12 0c0-5-3-7-3-10M7 10h10M6 15h12" /></>,
    music: <><path d="M9 18V6l10-2v12M9 10l10-2" /><circle cx="6.5" cy="18" r="2.5" /><circle cx="16.5" cy="16" r="2.5" /></>,
    tradition: <><path d="M12 21s7-4.3 7-11a4 4 0 0 0-7-2.6A4 4 0 0 0 5 10c0 6.7 7 11 7 11Z" /><path d="M9 12h6" /></>,
    story: <><path d="M4 5.5A4.5 4.5 0 0 1 8.5 4H12v15H8.5A4.5 4.5 0 0 0 4 20V5.5ZM20 5.5A4.5 4.5 0 0 0 15.5 4H12v15h3.5A4.5 4.5 0 0 1 20 20V5.5Z" /></>,
};

const governoratePositions = Object.fromEntries(governorateLabels.features.map(feature => [feature.properties.name, feature.geometry.coordinates]));

const governorates = ['Ariana', 'Béja', 'Ben Arous', 'Bizerte', 'El Kef', 'Gabès', 'Gafsa', 'Jendouba', 'Kairouan', 'Kasserine', 'Kébili', 'Mahdia', 'Manouba', 'Médenine', 'Monastir', 'Nabeul', 'Sfax', 'Sidi Bouzid', 'Siliana', 'Sousse', 'Tataouine', 'Tozeur', 'Tunis', 'Zaghouan'];

function ItemIcon({ type, className = 'size-5' }) {
    return <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{icons[type]}</svg>;
}

function CulturalItemDetails({ item }) {
    const { locale } = useLanguage();
    const translated = name => localizedValue(name, locale);
    const [activeImage, setActiveImage] = useState(item.main_image || item.pictures?.[0]);
    const importanceStyle = { high: 'bg-[#9b3d2d] text-white', medium: 'bg-[#c58a38] text-white', low: 'bg-[#66724b] text-white' };

    return <article className="overflow-hidden border-t border-[#d7bc83] bg-[#f4e7c7]">
            <div className="relative h-48 overflow-hidden bg-[#765334] sm:h-56">
                {item.main_image && <img src={item.main_image} alt="" className="h-full w-full object-cover opacity-70" />}
                <div className="absolute inset-0 bg-gradient-to-t from-[#382416] via-transparent to-transparent" />
                <div className="absolute bottom-5 left-6 flex items-end gap-4 text-[#fff5dc]">
                    <span className="grid size-14 shrink-0 place-items-center overflow-hidden rounded-full border border-white/40 bg-[#49351F]/90">{item.icon_url ? <img src={item.icon_url} alt="" className="h-full w-full object-cover" /> : <ItemIcon type={item.icon || 'monument'} className="size-7" />}</span>
                    <div><p className="text-xs uppercase tracking-[.2em] text-[#ead49e]">{item.city} · {item.state}</p><h2 id={`item-${item.id}-title`} className={`${locale === 'ar' ? 'font-arabic-title' : 'font-serif'} text-2xl font-bold sm:text-3xl`}>{translated(item.name)}</h2></div>
                </div>
            </div>
            <div className="p-6 sm:p-8">
                <div className="mb-5 flex flex-wrap gap-2">
                    <span className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${importanceStyle[item.importance]}`}>{item.importance} importance</span>
                    <span className="rounded-full border border-[#85633f]/30 px-3 py-1 text-[11px] font-bold uppercase tracking-wider">{item.release}</span>
                    <span className="rounded-full border border-[#85633f]/30 px-3 py-1 text-[11px] font-bold uppercase tracking-wider">{item.is_active ? 'Active' : 'Archived'}</span>
                </div>
                {item.approximate_position && <p className="mb-3 text-xs text-[#80674c]">Approximate location of the site or town.</p>}
                <p className="font-serif text-lg font-semibold leading-7 text-[#513823]">{translated(item.short_description)}</p>
                <p className="mt-3 text-sm leading-6 text-[#6b5138]">{translated(item.description)}</p>
                {item.author && <p className="mt-4 text-sm">Author: {translated(item.author.name)} {item.author.profession && `· ${item.author.profession}`}</p>}
                {googleMapsUrl(item.latitude, item.longitude, item.google_maps_url) && <a href={googleMapsUrl(item.latitude, item.longitude, item.google_maps_url)} target="_blank" rel="noreferrer" className="mt-5 inline-flex rounded-xl border border-[#98754d]/35 px-4 py-2 text-sm font-semibold text-[#49351f] hover:bg-white/50">Open in Google Maps ↗</a>}<MediaGallery item={item} activeImage={activeImage} setActiveImage={setActiveImage} />
                {(item.people?.length ?? 0) > 0 && <div className="mt-6 border-t border-[#98754d]/25 pt-5"><p className="mb-2 text-[10px] font-bold uppercase tracking-[.22em] text-[#846440]">People connected to this item</p>{item.people.map((person) => <p key={person.name} className="text-sm"><strong>{person.name}</strong> <span className="text-[#80674c]">— {person.position}</span></p>)}</div>}
                <div className="mt-6 flex items-center justify-between border-t border-[#98754d]/25 pt-5 text-xs text-[#80674c]"><span>{item.categories?.map((category) => category.name?.en).join(', ') || `Category #${item.category_id?.join(', #') || '—'}`} · {item.types?.map((type) => type.name?.en).join(', ') || `Type #${item.type_id?.join(', #') || '—'}`}</span><span>Item {String(item.id).padStart(3, '0')}</span></div>
            </div>
        </article>
    ;
}

function MediaGallery({ item, activeImage, setActiveImage }) {
    const { locale } = useLanguage();
    const translated = name => localizedValue(name, locale);
    const pictures = [item.main_image, ...(item.pictures || [])].filter((value, index, values) => value && values.indexOf(value) === index);
    const videos = item.videos || [];
    const audio = item.audio || [];
    if (!pictures.length && !videos.length && !audio.length) return null;

    return <section className="mt-7 border-t border-[#98754d]/25 pt-6" aria-label="Media gallery">
        <div className="mb-4 flex items-center justify-between"><h3 className="font-serif text-xl font-bold text-[#513823]">Media</h3><span className="text-[10px] font-bold uppercase tracking-[.18em] text-[#846440]">{pictures.length} photos · {videos.length} videos · {audio.length} audio</span></div>
        {pictures.length > 0 && <div>
            <div className="overflow-hidden rounded-2xl border border-[#98754d]/25 bg-[#49351F]/10"><img src={activeImage} alt={`${translated(item.name)} gallery`} className="h-64 w-full object-contain sm:h-80" /></div>
            {pictures.length > 1 && <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-6">{pictures.map((picture, index) => <button key={picture} type="button" onClick={() => setActiveImage(picture)} className={`relative h-16 overflow-hidden rounded-lg border-2 transition ${activeImage === picture ? 'border-[#9b3d2d] shadow-md' : 'border-transparent opacity-70 hover:opacity-100'}`} aria-label={`Show picture ${index + 1}`}><img src={picture} alt="" className="h-full w-full object-cover" /></button>)}</div>}
        </div>}
        {videos.length > 0 && <div className="mt-6 space-y-4"><h4 className="text-xs font-bold uppercase tracking-[.18em] text-[#846440]">Videos</h4>{videos.map((video, index) => <VideoPlayer key={`${video}-${index}`} src={video} title={`${translated(item.name)} video ${index + 1}`} />)}</div>}
        {audio.length > 0 && <div className="mt-6 space-y-3"><h4 className="text-xs font-bold uppercase tracking-[.18em] text-[#846440]">Audio recordings</h4>{audio.map((recording, index) => <div key={`${recording}-${index}`} className="rounded-xl border border-[#98754d]/25 bg-white/45 p-3"><div className="mb-2 flex items-center gap-2 text-xs font-semibold text-[#60452f]"><span className="grid size-7 place-items-center rounded-full bg-[#49351F] text-white">♪</span>Recording {index + 1}</div><audio controls preload="metadata" className="h-10 w-full" src={recording}>Your browser does not support audio playback.</audio></div>)}</div>}
    </section>;
}

function VideoPlayer({ src, title }) {
    const youtube = src.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{6,})/i);
    const vimeo = src.match(/vimeo\.com\/(?:video\/)?(\d+)/i);
    if (youtube || vimeo) {
        const embed = youtube ? `https://www.youtube-nocookie.com/embed/${youtube[1]}` : `https://player.vimeo.com/video/${vimeo[1]}`;
        return <div className="aspect-video overflow-hidden rounded-2xl bg-black shadow-sm"><iframe src={embed} title={title} className="h-full w-full" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen /></div>;
    }
    if (/\.(mp4|webm|mov|m4v)(?:\?.*)?$/i.test(src) || src.includes('/storage/')) {
        return <video controls preload="metadata" className="aspect-video w-full rounded-2xl bg-black" src={src}>Your browser does not support video playback.</video>;
    }
    return <a href={src} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-xl border border-[#98754d]/30 bg-white/45 px-4 py-3 text-sm font-semibold text-[#513823] transition hover:bg-white">Watch external video <span aria-hidden="true">↗</span></a>;
}

function MobileFilters({ onReset, contentFilter, onContentFilter, stateCounts, open, onClose, showNames, onToggleNames, selectedState, onSelectState, categoryOptions, categoryFilter, onCategoryFilter }) {
    const { dir, locale } = useLanguage();
    useEffect(() => {
        if (!open) return undefined;
        const closeOnEscape = (event) => event.key === 'Escape' && onClose();
        window.addEventListener('keydown', closeOnEscape);
        document.body.style.overflow = 'hidden';
        return () => { window.removeEventListener('keydown', closeOnEscape); document.body.style.overflow = ''; };
    }, [open, onClose]);

    if (!open) return null;

    return <>
        <button type="button" className="fixed inset-0 z-[70] bg-[#21170f]/50 backdrop-blur-sm lg:hidden" onClick={onClose} aria-label="Close filters" />
        <aside className={`fixed inset-y-0 z-[80] flex w-[min(88vw,22rem)] flex-col overflow-y-auto ${dir === 'rtl' ? 'left-0 border-r shadow-[12px_0_30px_rgba(43,29,16,0.25)]' : 'right-0 border-l shadow-[-12px_0_30px_rgba(43,29,16,0.25)]'} bg-[#f7ead0] p-5 text-[#49351F] lg:hidden`} role="dialog" aria-modal="true" aria-labelledby="mobile-filters-title">
            <div className="flex items-center justify-between border-b border-[#98754d]/25 pb-5">
        <div><p className="text-[10px] font-bold uppercase tracking-[.22em] text-[#846440]">Explore</p><h2 id="mobile-filters-title" className={`${locale === 'ar' ? 'font-arabic-title' : 'font-serif'} text-2xl font-bold`}>Filters</h2></div>
                <button type="button" onClick={onClose} className="grid size-10 place-items-center rounded-full border border-[#49351F]/35 text-xl transition hover:bg-[#49351F] hover:text-[#f7ead0]" aria-label="Close filters">×</button>
            </div>
            <MapFilters onReset={onReset} contentFilter={contentFilter} onContentFilter={onContentFilter} categoryOptions={categoryOptions} categoryFilter={categoryFilter} onCategoryFilter={onCategoryFilter} selectedState={selectedState} onSelectState={onSelectState} stateCounts={stateCounts} showNames={showNames} onToggleNames={onToggleNames} />
        </aside>
    </>;
}

export default function Home({ storedItems = [], storedEvents = [], storedCategories = [] }) {
    const { locale, t } = useLanguage();
    const [today, setToday] = useState(() => tunisiaToday());
    useEffect(() => {
        const timer = window.setInterval(() => setToday(tunisiaToday()), 60000);
        return () => window.clearInterval(timer);
    }, []);
    const [categoryFilter, setCategoryFilter] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [showNames, setShowNames] = useState(true);
    const [selectedState, setSelectedState] = useState('');
    const [contentFilter, setContentFilter] = useState('all');
    const filteredItems = useMemo(() => [
        ...(contentFilter !== 'events' ? storedItems.map(item => ({ ...culturalItemPosition(item), kind: 'cultural' })) : []),
        ...(contentFilter !== 'cultural' ? storedEvents : []),
    ], [storedItems, storedEvents, contentFilter]);
    const matchesCategory = useMemo(() => categoryMatcher(storedCategories), [storedCategories]);
    const categoryOptions = useMemo(() => storedCategories
        .filter(category => category.parent_id == null)
        .map(category => ({ category, count: filteredItems.filter(item => (!selectedState || item.state === selectedState) && matchesCategory(item, category.id)).length }))
        .filter(option => option.count > 0 || option.category.id === categoryFilter),
    [storedCategories, filteredItems, selectedState, matchesCategory, categoryFilter]);
    const categoryItems = useMemo(() => filteredItems.filter(item => categoryFilter === null || matchesCategory(item, categoryFilter)), [filteredItems, categoryFilter, matchesCategory]);
    const mapItems = useMemo(() => categoryItems.filter(item => item.kind !== 'cultural'), [categoryItems]);
    const discoveryItems = useMemo(() => categoryItems.filter(item => !selectedState || item.state === selectedState), [categoryItems, selectedState]);
    const discoveryContent = <DiscoveryContent mode={contentFilter} items={discoveryItems} today={today} onSelectEvent={setSelectedItem} onSelectCulturalItem={setSelectedItem} />;
    const mapGroups = useMemo(() => groupCategories(storedCategories, filteredItems.filter(item => !selectedState || item.state === selectedState), governoratePositions)
        .filter(group => categoryFilter === null || group.category.id === categoryFilter), [storedCategories, filteredItems, selectedState, categoryFilter]);
    const changeCategoryFilter = id => { setCategoryFilter(id); setSelectedCategory(null); setSelectedItem(null); };
    const resetFilters = () => {
        setContentFilter('all');
        changeCategoryFilter(null);
        setSelectedState('');
        setShowNames(true);
    };
    const activeGroup = mapGroups.find(group => group.key === selectedCategory);
    const stateCounts = Object.fromEntries(governorates.map(state => [state, categoryItems.filter(item => item.state === state).length]));
    return <ClientLayout>
        <Head title={t('mapLabel')} />
        <main className="min-h-[calc(100dvh-5rem)] p-3 sm:p-5 lg:p-6">
            <div className="grid items-start gap-4 lg:grid-cols-2 lg:gap-6">
                <aside dir={locale === 'ar' ? 'ltr' : 'rtl'} className="content-panel-scroll hidden h-[calc(100dvh-6.5rem)] min-h-[32rem] min-w-0 overflow-y-auto lg:block">
                    <div dir={locale === 'ar' ? 'rtl' : 'ltr'} className="p-6">
                    <div className="border-b border-[#98754d]/25 pb-5">
                        <p className="text-xs font-bold uppercase tracking-[.22em] text-[#846440]">ATHAR</p>
                        <h1 className={`mt-2 text-3xl font-bold text-[#49351F] ${locale === 'ar' ? 'font-arabic-title' : 'font-serif'}`}>{t('exploreTunisia')}</h1>
                        <p className="mt-2 max-w-sm text-sm leading-6 text-[#6b5138]">{t('exploreSubtitle')}</p>
                    </div>
                    <MapFilters onReset={resetFilters} contentFilter={contentFilter} onContentFilter={setContentFilter} categoryOptions={categoryOptions} categoryFilter={categoryFilter} onCategoryFilter={changeCategoryFilter} selectedState={selectedState} onSelectState={setSelectedState} stateCounts={stateCounts} showNames={showNames} onToggleNames={(event) => setShowNames(event.target.checked)} />
                    {discoveryContent}
                    </div>
                </aside>
                <section className="cultural-map relative h-[calc(100dvh-6.5rem)] min-h-[32rem] min-w-0 drop-shadow-[0_8px_12px_rgba(73,53,31,0.18)]" aria-label={t('mapLabel')}>
                    <div className="map-paper-edge relative h-full overflow-hidden bg-[#d9e5df]">
                        <TunisiaMap categoryGroups={mapGroups} onSelectCategory={setSelectedCategory} items={mapItems} onSelectItem={setSelectedItem} showNames={showNames} showPlacesNames={showNames} mapMode="vector" selectedState={selectedState} />
                        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 shadow-[inset_0_8px_8px_rgba(139,85,42,0.28),inset_0_0_28px_rgba(139,85,42,0.2)]" />
                    </div>
                    {/* <img src="/images/top-righ-leaf.png" alt="" aria-hidden="true" draggable={false} className="pointer-events-none absolute -right-2 -top-2 z-10 h-auto w-36 max-w-[35%] select-none sm:-right-4 sm:-top-6 sm:w-44" />
                    <img src="/images/bottom-left-leaf.png" alt="" aria-hidden="true" draggable={false} className="pointer-events-none absolute -bottom-2 -left-2 z-10 h-auto w-28 max-w-[30%] select-none sm:-bottom-8 sm:-left-8 sm:w-40" /> */}
                    <button type="button" onClick={() => setFiltersOpen(true)} className="absolute left-3 top-3 z-10 grid size-11 place-items-center rounded-xl border border-[#49351F]/20 bg-[#f7ead0]/95 text-[#49351F] shadow-md transition hover:bg-white lg:hidden" aria-label="Open filters">
                        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 6h16M7 12h10M10 18h4" /></svg>
                    </button>
                </section>
            </div>
            <div className="px-2 lg:hidden">{discoveryContent}</div>
        </main>
        <MobileFilters onReset={resetFilters} contentFilter={contentFilter} onContentFilter={setContentFilter} categoryOptions={categoryOptions} categoryFilter={categoryFilter} onCategoryFilter={changeCategoryFilter} stateCounts={stateCounts} open={filtersOpen} onClose={() => setFiltersOpen(false)} showNames={showNames} onToggleNames={(event) => setShowNames(event.target.checked)} selectedState={selectedState} onSelectState={setSelectedState} />
        {activeGroup && <CategoryDrawer key={activeGroup.key} group={activeGroup} onClose={() => setSelectedCategory(null)} />}
        {selectedItem?.kind === 'cultural' && <CulturalItemDrawer key={`cultural-${selectedItem.id}`} item={selectedItem} onClose={() => setSelectedItem(null)} />}
        {selectedItem?.kind === 'event' && <EventDrawer key={`event-${selectedItem.id}`} item={selectedItem} onClose={() => setSelectedItem(null)} />}
    </ClientLayout>;
}

function MapFilters({ onReset, contentFilter, onContentFilter, categoryOptions, categoryFilter, onCategoryFilter, selectedState, onSelectState, stateCounts, showNames, onToggleNames }) {
    const { t } = useLanguage();
    return <section className="mt-6" aria-label="Map filters">
        <ContentFilter value={contentFilter} onChange={onContentFilter} />
        <CategoryFilters options={categoryOptions} value={categoryFilter} onChange={onCategoryFilter} />
        <GovernorateSelect value={selectedState} onChange={onSelectState} governorates={governorates} counts={stateCounts} />
        <label className="mt-5 flex cursor-pointer items-center gap-3 text-sm font-semibold">
            <input type="checkbox" checked={showNames} onChange={onToggleNames} className="size-5 rounded border-[#98754d] text-[#747A3C] focus:ring-[#747A3C]" />
            <span>{t('showPlacesNames')}</span>
        </label>
        <button type="button" onClick={onReset} className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#98754d]/40 px-4 py-2 text-sm font-semibold text-[#49351F] transition hover:bg-[#d8bf94]/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#49351F]">
            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 4 4 9l5 5" /><path d="M4 9h9a6 6 0 0 1 0 12h-2" /></svg>
            {t('resetFilters')}
        </button>
    </section>;
}

function ContentFilter({ value, onChange }) {
    const { t } = useLanguage();
    return <fieldset><legend className="sr-only">{t('mapLabel')}</legend><div className="flex gap-2">{[['all', t('all')], ['cultural', t('culturalContent')], ['events', t('events')]].map(([key, label]) => <span key={key} className="flex min-w-0 flex-1 drop-shadow-[0_4px_3px_rgba(73,53,31,0.3)]"><button type="button" aria-pressed={value === key} onClick={() => onChange(key)} className={`filter-paper w-full px-3 py-4 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#49351F] ${value === key ? 'bg-[#49351F] text-[#fff3d9]' : 'bg-[#ead8b4] text-[#49351F] hover:bg-[#dfc69b]'}`}>{label}</button></span>)}</div></fieldset>;
}

const translated = name => name?.en || name?.fr || name?.ar || '';
function CulturalItemDrawer({ item, onClose }) {
    const { locale, dir } = useLanguage();
    const translated = name => localizedValue(name, locale);
    const [isOpen, setIsOpen] = useState(true);
    const close = () => setIsOpen(false);
    return <Transition appear show={isOpen} afterLeave={onClose}>
        <Dialog onClose={close} className="relative z-[80]">
        <TransitionChild enter="transition-opacity duration-300 ease-out motion-reduce:duration-0" enterFrom="opacity-0" enterTo="opacity-100" leave="transition-opacity duration-300 ease-in motion-reduce:duration-0" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-[#21170f]/40 backdrop-blur-sm" aria-hidden="true" />
        </TransitionChild>
        <div dir="ltr" className={`fixed inset-0 flex ${dir === 'rtl' ? 'justify-start' : 'justify-end'}`}>
            <TransitionChild enter="transform transition-transform duration-300 ease-out motion-reduce:duration-0" enterFrom={dir === 'rtl' ? '-translate-x-full' : 'translate-x-full'} enterTo="translate-x-0" leave="transform transition-transform duration-300 ease-in motion-reduce:duration-0" leaveFrom="translate-x-0" leaveTo={dir === 'rtl' ? '-translate-x-full' : 'translate-x-full'}>
            <DialogPanel dir={dir} className={`flex h-full w-full lg:w-1/2 flex-col ${dir === 'rtl' ? 'border-r' : 'border-l'} border-[#d7bc83] bg-[#f7ead0] text-[#49351f] shadow-2xl`}>
                <header className="flex shrink-0 items-center gap-4 border-b border-[#98754d]/25 p-5 sm:p-7">
                    <div className="min-w-0 flex-1"><p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#80674c]">Cultural item details</p><DialogTitle className={`break-words text-2xl font-bold ${locale === 'ar' ? 'font-arabic-title' : 'font-serif'}`}>{translated(item.name)}</DialogTitle></div>
                    <button type="button" onClick={close} aria-label="Close cultural item" className="grid size-11 shrink-0 place-items-center rounded-full border border-[#98754d]/30 text-2xl">×</button>
                </header>
                <div className="min-h-0 flex-1 overflow-y-auto">
                    <CulturalItemDetails item={item} />
                </div>
            </DialogPanel>
            </TransitionChild>
        </div>
        </Dialog>
    </Transition>;
}

function EventDrawer({ item, onClose }) {
    const { locale, dir, t } = useLanguage();
    const translated = name => localizedValue(name, locale);
    const [activeImage, setActiveImage] = useState(item.main_image || item.pictures?.[0]);
    const [isOpen, setIsOpen] = useState(true);
    const close = () => setIsOpen(false);
    return <Transition appear show={isOpen} afterLeave={onClose}>
        <Dialog onClose={close} className="relative z-[80]">
        <TransitionChild enter="transition-opacity duration-300 ease-out motion-reduce:duration-0" enterFrom="opacity-0" enterTo="opacity-100" leave="transition-opacity duration-300 ease-in motion-reduce:duration-0" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-[#21170f]/40 backdrop-blur-sm" aria-hidden="true" />
        </TransitionChild>
        <div dir="ltr" className={`fixed inset-0 flex ${dir === 'rtl' ? 'justify-start' : 'justify-end'}`}>
            <TransitionChild enter="transform transition-transform duration-300 ease-out motion-reduce:duration-0" enterFrom={dir === 'rtl' ? '-translate-x-full' : 'translate-x-full'} enterTo="translate-x-0" leave="transform transition-transform duration-300 ease-in motion-reduce:duration-0" leaveFrom="translate-x-0" leaveTo={dir === 'rtl' ? '-translate-x-full' : 'translate-x-full'}>
            <DialogPanel dir={dir} className={`flex h-full w-full lg:w-1/2 flex-col ${dir === 'rtl' ? 'border-r' : 'border-l'} border-[#d7bc83] bg-[#f7ead0] text-[#49351f] shadow-2xl`}>
                <header className="flex shrink-0 items-center gap-4 border-b border-[#98754d]/25 p-5 sm:p-7">
                    <div className="min-w-0 flex-1"><p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#80674c]">Event details</p><DialogTitle className={`break-words text-2xl font-bold ${locale === 'ar' ? 'font-arabic-title' : 'font-serif'}`}>{translated(item.name)}</DialogTitle></div>
                    <button type="button" onClick={close} aria-label="Close event" className="grid size-11 shrink-0 place-items-center rounded-full border border-[#98754d]/30 text-2xl">×</button>
                </header>
                <article className="min-h-0 flex-1 overflow-y-auto bg-[#f4e7c7]">
            <img src={item.main_image} alt="" className="h-56 w-full object-cover"/>
            <div className="space-y-4 p-6"><div className="flex flex-wrap gap-2"><span className="rounded-full bg-[#49351f] px-3 py-1 text-xs text-white">{item.glow ? 'Current / upcoming' : 'Past event'}</span><span className="rounded-full border border-[#98754d] px-3 py-1 text-xs">{item.is_free ? 'Free' : `${item.price.toFixed(2)} TND`}</span>{item.categories.map(c => <span key={c.id} className="rounded-full border px-3 py-1 text-xs" style={{ borderColor: c.color }}>{translated(c.name)}</span>)}</div>
                <p>{item.place_name} · {item.city} · {item.state}</p>{googleMapsUrl(item.latitude, item.longitude, item.google_maps_url) && <a href={googleMapsUrl(item.latitude, item.longitude, item.google_maps_url)} target="_blank" rel="noreferrer" className="inline-flex rounded-xl border border-[#98754d]/35 px-4 py-2 text-sm font-semibold text-[#49351f] hover:bg-white/50">Open in Google Maps ↗</a>}
                <ul className="space-y-1 text-sm">{item.event_dates.map(slot => <li key={slot.id}>{slot.date} · {slot.start_at.slice(0, 5)}–{slot.end_at.slice(0, 5)}{slot.end_at < slot.start_at ? ' (+1 day)' : ''} (Tunisia time)</li>)}</ul>
                <div className="rich-text font-semibold" dangerouslySetInnerHTML={{ __html: localizedValue(item.short_description, locale) }}/><div className="rich-text text-sm" dangerouslySetInnerHTML={{ __html: localizedValue(item.description, locale) }}/>
                {!item.is_free && item.payment_link && <a href={item.payment_link} target="_blank" rel="noreferrer" className="inline-block rounded-xl bg-[#49351f] px-5 py-3 text-white">Book / pay</a>}
                <div className="flex flex-wrap gap-2">{item.tags?.map(tag => <span key={tag} className="text-xs">#{tag}</span>)}</div>
                <div className="flex flex-wrap gap-4 text-sm">{['facebook', 'instagram', 'tiktok', 'linkedin', 'youtube', 'website', 'other_link'].filter(key => item[key]).map(key => <a key={key} href={item[key]} target="_blank" rel="noreferrer" className="underline">{key.replace('_', ' ')} ↗</a>)}</div>
                <section className="rounded-xl border border-[#98754d]/30 p-4"><h3 className="font-serif text-xl font-bold">Organized by {translated(item.organization.name)}</h3>{item.organization.logo && <img src={item.organization.logo} alt="Organization logo" className="my-2 h-16 w-16 rounded object-contain"/>}<div className="rich-text text-sm" dangerouslySetInnerHTML={{ __html: localizedValue(item.organization.description, locale) }}/>{item.organization.phone && <p className="mt-2 text-sm">Phone: {item.organization.phone}</p>}{item.organization.email && <p className="text-sm">Email: {item.organization.email}</p>}{item.organization.users.map((user, index) => <p key={index} className="text-sm">{user.name} · {user.role}</p>)}</section>
                <MediaGallery item={item} activeImage={activeImage} setActiveImage={setActiveImage}/>
            </div>
                </article>
            </DialogPanel>
            </TransitionChild>
        </div>
        </Dialog>
    </Transition>;
}

function CategoryDrawer({ group, onClose }) {
    const { locale, dir } = useLanguage();
    const translated = name => localizedValue(name, locale);
    const [expandedId, setExpandedId] = useState(null);
    const [isOpen, setIsOpen] = useState(true);
    const close = () => setIsOpen(false);
    return <Transition appear show={isOpen} afterLeave={onClose}>
        <Dialog onClose={close} className="relative z-[80]">
        <TransitionChild enter="transition-opacity duration-300 ease-out motion-reduce:duration-0" enterFrom="opacity-0" enterTo="opacity-100" leave="transition-opacity duration-300 ease-in motion-reduce:duration-0" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-[#21170f]/40 backdrop-blur-sm" aria-hidden="true" />
        </TransitionChild>
        <div dir="ltr" className={`fixed inset-0 flex ${dir === 'rtl' ? 'justify-start' : 'justify-end'}`}>
            <TransitionChild enter="transform transition-transform duration-300 ease-out motion-reduce:duration-0" enterFrom={dir === 'rtl' ? '-translate-x-full' : 'translate-x-full'} enterTo="translate-x-0" leave="transform transition-transform duration-300 ease-in motion-reduce:duration-0" leaveFrom="translate-x-0" leaveTo={dir === 'rtl' ? '-translate-x-full' : 'translate-x-full'}>
            <DialogPanel dir={dir} className={`flex h-full w-full lg:w-1/2 flex-col ${dir === 'rtl' ? 'border-r' : 'border-l'} border-[#d7bc83] bg-[#f7ead0] text-[#49351f] shadow-2xl`}>
                <header className="flex shrink-0 items-center gap-4 border-b border-[#98754d]/25 p-5 sm:p-7">
                    <span className="grid size-14 shrink-0 place-items-center rounded-full text-xl text-white" style={{ backgroundColor: group.category.color || '#8f3527' }}>{group.category.icon_url ? <img src={group.category.icon_url} alt="" className="size-8 object-contain" /> : translated(group.category.name).slice(0, 1)}</span>
                    <div className="flex-1"><DialogTitle className={`text-2xl font-bold ${locale === 'ar' ? 'font-arabic-title' : 'font-serif'}`}>{translated(group.category.name)}</DialogTitle><p className="mt-1 text-sm text-[#80674c]">{group.place} · {group.items.length} cultural items{group.approximate && <span className="block text-xs">Approximate map location</span>}</p></div>
                    <button type="button" onClick={close} aria-label="Close category" className="grid size-11 place-items-center rounded-full border border-[#98754d]/30 text-2xl">×</button>
                </header>
                <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4 sm:p-7">
                    {translated(group.category.description) && <p className="text-sm leading-6 text-[#80674c]">{translated(group.category.description)}</p>}
                    {!group.items.length && <p className="py-12 text-center text-[#80674c]">No cultural items in this category for the selected filters.</p>}
                    {group.items.map(item => <section key={item.id} className="overflow-hidden rounded-2xl border border-[#98754d]/25 bg-white/45 shadow-sm">
                        <button type="button" onClick={() => setExpandedId(expandedId === item.id ? null : item.id)} aria-expanded={expandedId === item.id} aria-controls={`cultural-details-${item.id}`} className="flex w-full gap-4 p-4 text-left transition hover:bg-white/50">
                            {item.main_image ? <img src={item.main_image} alt="" className="h-28 w-28 shrink-0 rounded-xl object-cover" loading="lazy" /> : <span className="grid h-28 w-28 shrink-0 place-items-center rounded-xl bg-[#ead8b4]"><ItemIcon type="monument" className="size-9" /></span>}
                            <span className="min-w-0 flex-1"><span className={`block text-xl font-bold ${locale === 'ar' ? 'font-arabic-title' : 'font-serif'}`}>{translated(item.name)}</span><span className="mt-1 block text-xs text-[#80674c]">{[item.city, item.state].filter(Boolean).join(' · ')}</span><span className="mt-2 line-clamp-2 text-sm leading-5 text-[#6b5138]">{translated(item.short_description)}</span><span className="mt-2 block text-xs font-bold">{expandedId === item.id ? 'Collapse details −' : 'Explore item +'}</span></span>
                        </button>
                        <div id={`cultural-details-${item.id}`} hidden={expandedId !== item.id}>{expandedId === item.id && <CulturalItemDetails item={item} />}</div>
                    </section>)}
                </div>
            </DialogPanel>
            </TransitionChild>
        </div>
        </Dialog>
    </Transition>;
}

function CategoryFilters({ options, value, onChange }) {
    const { locale, t } = useLanguage();
    const chipClass = active => `relative flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition ${active ? 'border-[#765334] bg-[#c7ac7c]/60 text-[#392817]' : 'border-[#98754d]/40 bg-transparent hover:bg-[#d8bf94]/30'}`;
    return <div className="mt-10 flex flex-wrap gap-2" role="group" aria-label="Filter by category">
        <button type="button" aria-pressed={value === null} onClick={() => onChange(null)} className={chipClass(value === null)}>{t('allCategories')}</button>
        {options.map(({ category, count }) => <button type="button" key={category.id} aria-pressed={value === category.id} onClick={() => onChange(value === category.id ? null : category.id)} className={chipClass(value === category.id)}>
            <span className="grid size-8 place-items-center rounded-full text-white" style={{ backgroundColor: category.color || '#8f3527' }}>{category.icon_url ? <img src={category.icon_url} alt="" className="size-5 object-contain" /> : translated(category.name).slice(0, 1)}</span>
            {localizedValue(category.name, locale)} ({count})
        </button>)}
    </div>;
}
