import { newestFirst, upcomingDays } from '@/lib/discoveryContent';
import { localizedValue, useLanguage } from '@/i18n';
import { useMemo } from 'react';

const location = (item, locale) => [...new Set([item.place_name, item.city, item.state].filter(Boolean))].join(' · ');
const focusStyle = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#747A3C]';

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

export default function DiscoveryContent({ mode, items, today, onSelectEvent, onSelectCulturalItem }) {
    const { locale, dir, t } = useLanguage();
    const translated = value => localizedValue(value, locale);
    const culturalItems = useMemo(() => mode === 'cultural' ? newestFirst(items) : [], [items, mode]);
    const days = useMemo(() => mode === 'events' ? upcomingDays(items, today) : [], [items, mode, today]);
    if (mode === 'all') return null;
    const count = mode === 'cultural' ? culturalItems.length : new Set(days.flatMap(day => day.entries.map(({ event }) => event.id))).size;

    return <section className="mt-8 border-t border-[#98754d]/25 pt-7 pb-6" aria-label={mode === 'cultural' ? t('culturalDiscoveries') : t('upcomingEvents')}>
        <div className="mb-6 flex items-start justify-between gap-3">
            <div><p className="text-[10px] font-bold uppercase tracking-[.22em] text-[#846440]">{mode === 'cultural' ? t('discoverCollection') : t('upcomingEvents')}</p>
                <h2 className={`mt-2 text-2xl font-bold text-[#49351F] ${locale === 'ar' ? 'font-arabic-title' : 'font-serif'}`}>{mode === 'cultural' ? t('culturalDiscoveries') : t('upcomingEvents')}</h2>
                <p className="mt-1 text-xs text-[#80674c]">{mode === 'cultural' ? t('culturalDescription') : t('calendarDescription')}</p>
            </div>
            <span role="status" className="shrink-0 rounded-full border border-[#98754d]/30 px-3 py-1 text-xs text-[#80674c]">{count} {mode === 'cultural' ? (count === 1 ? t('item') : t('items')) : (count === 1 ? t('event') : `${t('events')}`)}</span>
        </div>
        {!count && <p role="status" className="rounded-2xl border border-dashed border-[#98754d]/40 bg-white/20 px-5 py-8 text-center text-sm leading-6 text-[#80674c]">{mode === 'cultural' ? t('noCultural') : t('noEvents')}<br />{t('tryAnother')}</p>}
        {mode === 'cultural' && <div className="space-y-4">{culturalItems.map(item => <article key={item.id} className="overflow-hidden rounded-2xl border border-[#98754d]/25 bg-white/35 shadow-sm">
            <button type="button" onClick={() => onSelectCulturalItem(item)} aria-haspopup="dialog" className={`w-full p-4 text-start transition hover:bg-white/40 ${focusStyle}`}>
                <span className={`flex items-start gap-4 ${locale === 'ar' ? 'flex-row-reverse' : ''}`}><span className="min-w-0 flex-1"><span className={`block text-xl font-bold leading-tight ${locale === 'ar' ? 'font-arabic-title' : 'font-serif'}`}>{translated(item.name)}</span><span className="mt-2 block text-xs text-[#80674c]">{location(item, locale)}</span><span className="mt-2 line-clamp-2 text-sm leading-6 text-[#6b5138]">{translated(item.short_description)}</span></span><Thumbnail item={item} /></span>
                <Categories item={item} /><span className="mt-4 block text-xs font-bold text-[#8f3527]">{t('explore')} →</span>
            </button>
        </article>)}</div>}
        {mode === 'events' && <div dir="ltr" className={`ml-1 border-dashed border-[#98754d]/45 ${locale === 'ar' ? 'mr-1 border-r pr-5 sm:pr-7' : 'border-l pl-5 sm:pl-7'}`}>{days.map(({ date, entries }) => <section key={date} className="relative pb-8 last:pb-0">
            <span aria-hidden="true" className={`absolute top-1.5 size-2.5 rounded-full border-2 border-[#98754d] ${locale === 'ar' ? '-right-[26px] sm:-right-[34px]' : '-left-[26px] sm:-left-[34px]'} ${date === today ? 'bg-[#98754d]' : 'bg-[#f3e3bf]'}`} />
            <h3 dir={dir} className="mb-4 flex flex-wrap items-baseline gap-2 text-sm"><span className="font-bold text-[#49351F]">{dateLabel(date, today, locale, t)}</span><time dateTime={date} className="text-[#80674c]">{formatDate(date, locale)}</time></h3>
            <div className="space-y-3">{entries.map(({ event, slot }) => <article key={`${event.id}-${slot.id}`} className="rounded-2xl border border-[#98754d]/25 bg-white/35 shadow-sm">
                <button dir={dir} type="button" onClick={() => onSelectEvent(event)} className={`w-full rounded-2xl p-4 text-start transition hover:bg-white/40 ${focusStyle}`}>
                    <span dir="ltr" className="flex items-start gap-3"><span dir={dir} className="min-w-0 flex-1 text-start"><span className="block text-xs font-semibold tracking-wide text-[#846440]">{slot.start_at.slice(0, 5)} → {slot.end_at.slice(0, 5)}{slot.end_at < slot.start_at && ' (+1 day)'}</span><span className={`mt-3 block text-lg font-bold leading-snug text-[#49351F] ${locale === 'ar' ? 'font-arabic-title' : 'font-serif'}`}>{translated(event.name)}</span><span className="mt-3 block text-xs leading-5 text-[#80674c]">{location(event, locale)}</span></span><Thumbnail item={event} /></span>
                    <span className="mt-3 inline-block rounded-full bg-[#747A3C]/15 px-2.5 py-1 text-[11px] font-bold text-[#59602e]">{event.is_free ? t('freeEntry') : `${Number(event.price).toFixed(2)} TND`}</span><Categories item={event} />
                </button>
            </article>)}</div>
        </section>)}</div>}
    </section>;
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
