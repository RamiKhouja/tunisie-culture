import { newestFirst, paginateDays, upcomingDays } from '@/lib/discoveryContent';
import { localizedValue, useLanguage } from '@/i18n';
import { useEffect, useMemo, useState } from 'react';

const location = (item, locale) => [...new Set([item.place_name, item.city, item.state].filter(Boolean))].join(' · ');
const focusStyle = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#747A3C]';
const PAGE_SIZE = 10;

function Categories({ item }) {
    const { locale } = useLanguage();
    const translated = value => localizedValue(value, locale);
    return <span className="mt-3 flex flex-wrap gap-1.5">{item.categories?.map(category => <span key={category.id} className="inline-flex items-center gap-1.5 rounded-full border border-[#98754d]/25 bg-[#f7ead0]/70 px-2 py-1 text-[10px] font-semibold text-[#6b5138]">
        <span className="size-1.5 rounded-full" style={{ backgroundColor: category.color || '#8f3527' }} />{translated(category.name)}
    </span>)}</span>;
}

function Thumbnail({ item }) {
    return item.main_image
        ? <img src={item.main_image} alt="" loading="lazy" className="size-20 shrink-0 rounded-xl object-cover sm:size-24" />
        : <span aria-hidden="true" className="grid size-20 shrink-0 place-items-center rounded-xl bg-[#ead8b4] font-serif text-3xl text-[#98754d] sm:size-24">✦</span>;
}

export default function DiscoveryContent({ mode, items, today, onSelectEvent, onSelectCulturalItem, onSelectSite }) {
    const { locale, dir, t } = useLanguage();
    const translated = value => localizedValue(value, locale);
    const culturalItems = useMemo(() => ['cultural', 'crafts'].includes(mode) ? newestFirst(items) : [], [items, mode]);
    const days = useMemo(() => mode === 'events' ? upcomingDays(items, today) : [], [items, mode, today]);
    const sites = useMemo(() => mode === 'sites' ? newestFirst(items) : [], [items, mode]);
    const [page, setPage] = useState(1);
    useEffect(() => setPage(1), [mode, items, today]);
    if (mode === 'all') return null;
    const count = ['cultural', 'crafts'].includes(mode) ? culturalItems.length : mode === 'sites' ? sites.length : new Set(days.flatMap(day => day.entries.map(({ event }) => event.id))).size;
    const emptyMessage = ['cultural', 'crafts'].includes(mode) ? t('noCultural') : mode === 'sites' ? t('noSites') : t('noEvents');
    const totalEntries = mode === 'events' ? days.reduce((total, day) => total + day.entries.length, 0) : count;
    const totalPages = Math.ceil(totalEntries / PAGE_SIZE);
    const visibleCulturalItems = culturalItems.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    const visibleSites = sites.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    const visibleDays = paginateDays(days, page, PAGE_SIZE);

    return <section className="mt-8 border-t border-[#98754d]/25 pt-7 pb-6 lg:rounded-3xl lg:border lg:border-[#ab7d53]/62 lg:bg-[#e7d6cc] lg:px-6 lg:shadow-[0_8px_18px_rgba(73,53,31,0.08)]" aria-label={mode === 'crafts' ? t('mastersOfCrafts') : mode === 'cultural' ? t('culturalDiscoveries') : mode === 'sites' ? t('sites') : t('upcomingEvents')}>
        <div className="mb-6 flex items-start justify-between gap-3">
            <div><p className="text-[10px] font-bold uppercase tracking-[.22em] text-[#846440]">{mode === 'crafts' ? t('mastersOfCrafts') : mode === 'cultural' ? t('discoverCollection') : mode === 'sites' ? t('sites') : t('upcomingEvents')}</p>
                <h2 className={`mt-2 text-2xl font-bold text-[#49351F] ${locale === 'ar' ? 'font-arabic-title' : 'font-serif'}`}>{mode === 'crafts' ? t('mastersOfCrafts') : mode === 'cultural' ? t('culturalDiscoveries') : mode === 'sites' ? t('sites') : t('upcomingEvents')}</h2>
                <p className="mt-1 text-xs text-[#80674c]">{mode === 'crafts' ? t('craftDescription') : mode === 'cultural' ? t('culturalDescription') : mode === 'sites' ? t('sites') : t('calendarDescription')}</p>
            </div>
            <span role="status" className="shrink-0 rounded-full border border-[#98754d]/30 px-3 py-1 text-xs text-[#80674c]">{count} {mode === 'cultural' ? (count === 1 ? t('item') : t('items')) : (count === 1 ? t('event') : `${t('events')}`)}</span>
        </div>
        {!count && <p role="status" className="rounded-2xl border border-dashed border-[#98754d]/40 bg-white/20 px-5 py-8 text-center text-sm leading-6 text-[#80674c]">{emptyMessage}<br />{t('tryAnother')}</p>}
        {['cultural', 'crafts'].includes(mode) && <div className="space-y-4 xl:grid xl:grid-cols-2 xl:gap-4 xl:space-y-0">{visibleCulturalItems.map(item => <article key={item.id} className="overflow-hidden rounded-2xl border border-[#98754d]/25 bg-white/35 shadow-sm">
            <button type="button" onClick={() => onSelectCulturalItem(item)} aria-haspopup="dialog" className={`w-full p-4 text-start transition hover:bg-white/40 ${focusStyle}`}>
                <span className={`flex items-start gap-4 ${locale === 'ar' ? 'flex-row-reverse' : ''}`}><span className="min-w-0 flex-1"><span className={`block text-xl font-bold leading-tight ${locale === 'ar' ? 'font-arabic-title' : 'font-serif'}`}>{translated(item.name)}</span><span className="mt-2 block text-xs text-[#80674c]">{location(item, locale)}</span><span className="mt-2 line-clamp-2 text-sm leading-6 text-[#6b5138]">{translated(item.short_description)}</span></span><Thumbnail item={item} /></span>
                <Categories item={item} /><span className="mt-4 block text-xs font-bold text-[#8f3527]">{t('explore')} →</span>
            </button>
        </article>)}</div>}
        {mode === 'sites' && <div className="space-y-4 xl:grid xl:grid-cols-2 xl:gap-4 xl:space-y-0">{visibleSites.map(item => <article key={item.id} className="overflow-hidden rounded-2xl border border-[#98754d]/25 bg-white/35 shadow-sm"><button type="button" onClick={() => onSelectSite(item)} className={`w-full p-4 text-start transition hover:bg-white/40 ${focusStyle}`}><span className={`flex items-start gap-4 ${locale === 'ar' ? 'flex-row-reverse' : ''}`}><span className="min-w-0 flex-1"><span className={`block text-xl font-bold leading-tight ${locale === 'ar' ? 'font-arabic-title' : 'font-serif'}`}>{translated(item.name)}</span><span className="mt-2 block text-xs text-[#80674c]">{location(item, locale)}</span><span className="mt-2 line-clamp-2 text-sm leading-6 text-[#6b5138]">{translated(item.short_description)}</span></span><Thumbnail item={item} /></span><Categories item={item} /></button></article>)}</div>}
        {mode === 'events' && <div dir="ltr" className={`ml-1 border-dashed border-[#98754d]/45 ${locale === 'ar' ? 'mr-1 border-r pr-5 sm:pr-7' : 'border-l pl-5 sm:pl-7'}`}>{visibleDays.map(({ date, entries }) => <section key={date} className="relative pb-8 last:pb-0">
            <span aria-hidden="true" className={`absolute top-1.5 size-2.5 rounded-full border-2 border-[#98754d] ${locale === 'ar' ? '-right-[26px] sm:-right-[34px]' : '-left-[26px] sm:-left-[34px]'} ${date === today ? 'bg-[#98754d]' : 'bg-[#f3e3bf]'}`} />
            <h3 dir={dir} className="mb-4 flex flex-wrap items-baseline gap-2 text-sm"><span className="font-bold text-[#49351F]">{dateLabel(date, today, locale, t)}</span><time dateTime={date} className="text-[#80674c]">{formatDate(date, locale)}</time></h3>
            <div className="space-y-3">{entries.map(({ event, slot }) => <article key={`${event.id}-${slot.id}`} className="rounded-2xl border border-[#98754d]/25 bg-white/35 shadow-sm">
                <button dir={dir} type="button" onClick={() => onSelectEvent(event)} className={`w-full rounded-2xl p-4 text-start transition hover:bg-white/40 ${focusStyle}`}>
                    <span dir="ltr" className={`flex items-start gap-3 ${locale === 'ar' ? 'flex-row-reverse justify-between' : ''}`}><span dir={dir} className="min-w-0 flex-1 text-start"><span className="block text-xs font-semibold tracking-wide text-[#846440]">{slot.start_at.slice(0, 5)} → {slot.end_at.slice(0, 5)}{slot.end_at < slot.start_at && ' (+1 day)'}</span><span className={`mt-3 block text-lg font-bold leading-snug text-[#49351F] ${locale === 'ar' ? 'font-arabic-title' : 'font-serif'}`}>{translated(event.name)}</span><span className="mt-3 block text-xs leading-5 text-[#80674c]">{location(event, locale)}</span></span><Thumbnail item={event} /></span>
                    <span className="mt-3 inline-block rounded-full bg-[#747A3C]/15 px-2.5 py-1 text-[11px] font-bold text-[#59602e]">{event.is_free ? t('freeEntry') : `${Number(event.price).toFixed(2)} TND`}</span><Categories item={event} />
                </button>
            </article>)}</div>
        </section>)}</div>}
        {totalPages > 1 && <Pagination page={page} totalPages={totalPages} onChange={setPage} />}
    </section>;
}

function Pagination({ page, totalPages, onChange }) {
    const { dir, t } = useLanguage();
    return <nav dir={dir} className="mt-7 flex items-center justify-center gap-3 border-t border-[#98754d]/25 pt-5" aria-label="Pagination">
        <button type="button" onClick={() => onChange(current => current - 1)} disabled={page === 1} className="rounded-full border border-[#98754d]/35 px-4 py-2 text-sm font-semibold text-[#49351f] transition hover:bg-white/50 disabled:cursor-not-allowed disabled:opacity-40">{t('previous')}</button>
        <span className="text-sm tabular-nums text-[#80674c]">{t('page')} {page} / {totalPages}</span>
        <button type="button" onClick={() => onChange(current => current + 1)} disabled={page === totalPages} className="rounded-full border border-[#98754d]/35 px-4 py-2 text-sm font-semibold text-[#49351f] transition hover:bg-white/50 disabled:cursor-not-allowed disabled:opacity-40">{t('next')}</button>
    </nav>;
}

function dateLabel(date, today, locale, t) {
    if (date === today) return t('today');
    const tomorrow = new Date(`${today}T12:00:00Z`);
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
    if (date === tomorrow.toISOString().slice(0, 10)) return t('tomorrow');
    return new Intl.DateTimeFormat(localeTag(locale), { weekday: 'long', timeZone: 'UTC' }).format(new Date(`${date}T12:00:00Z`));
}

function formatDate(date, locale) {
    return new Intl.DateTimeFormat(localeTag(locale), { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${date}T12:00:00Z`));
}

function localeTag(locale) {
    return locale === 'ar' ? 'ar-TN' : locale === 'fr' ? 'fr-TN' : 'en-TN';
}
