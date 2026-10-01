import { Listbox, ListboxButton, ListboxLabel, ListboxOption, ListboxOptions } from '@headlessui/react';
import { useLanguage } from '@/i18n';

const names = {
    Ariana: ['Ariana', 'أريانة'],
    'Béja': ['Béja', 'باجة'],
    'Ben Arous': ['Ben Arous', 'بن عروس'],
    Bizerte: ['Bizerte', 'بنزرت'],
    'El Kef': ['Le Kef', 'الكاف'],
    'Gabès': ['Gabès', 'قابس'],
    Gafsa: ['Gafsa', 'قفصة'],
    Jendouba: ['Jendouba', 'جندوبة'],
    Kairouan: ['Kairouan', 'القيروان'],
    Kasserine: ['Kasserine', 'القصرين'],
    'Kébili': ['Kébili', 'قبلي'],
    Mahdia: ['Mahdia', 'المهدية'],
    Manouba: ['La Manouba', 'منوبة'],
    'Médenine': ['Médenine', 'مدنين'],
    Monastir: ['Monastir', 'المنستير'],
    Nabeul: ['Nabeul', 'نابل'],
    Sfax: ['Sfax', 'صفاقس'],
    'Sidi Bouzid': ['Sidi Bouzid', 'سيدي بوزيد'],
    Siliana: ['Siliana', 'سليانة'],
    Sousse: ['Sousse', 'سوسة'],
    Tataouine: ['Tataouine', 'تطاوين'],
    Tozeur: ['Tozeur', 'توزر'],
    Tunis: ['Tunis', 'تونس'],
    Zaghouan: ['Zaghouan', 'زغوان'],
};

export default function GovernorateSelect({ value, onChange, governorates, counts }) {
    const { locale, dir, t } = useLanguage();
    const label = state => !state ? t('allTunisia') : locale === 'en' ? state : names[state]?.[locale === 'ar' ? 1 : 0] || state;
    return <Listbox value={value} onChange={onChange}>
        <div className="mt-10">
            <ListboxLabel className="block text-sm font-semibold">{t('governorate')}</ListboxLabel>
            <ListboxButton className="mt-2 flex w-full items-center justify-between gap-3 rounded-xl border border-[#98754d]/35 bg-transparent px-3 py-2 text-start text-sm text-[#49351F] transition hover:bg-[#d8bf94]/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#747A3C] data-[open]:border-[#747A3C]">
                <span>{label(value)}{value && <span className="ms-2 text-[#846440]">({counts[value] || 0})</span>}</span>
                <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-4 shrink-0 text-[#846440]"><path d="m5 7 5 5 5-5" /></svg>
            </ListboxButton>
            <ListboxOptions anchor={{ to: 'bottom start', gap: 6, padding: 12 }} dir={dir} className={`governorate-options z-[100] max-h-72 w-[var(--button-width)] overflow-y-auto rounded-xl border border-[#98754d]/40 bg-[#f7ead0] p-1.5 text-sm text-[#49351F] shadow-[0_10px_28px_rgba(73,53,31,0.18)] focus:outline-none ${locale === 'ar' ? 'font-arabic-body' : 'font-latin-body'}`}>
                {['', ...governorates].map(state => <ListboxOption key={state} value={state} className="group flex cursor-pointer select-none items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-start data-[focus]:bg-[#e8d6b0] data-[selected]:bg-[#747A3C] data-[selected]:text-[#fff8e6]">
                    <span>{label(state)}</span>
                    <span className="flex items-center gap-3">
                        {state && <span className="rounded-full bg-[#98754d]/10 px-2 py-0.5 text-xs tabular-nums group-data-[selected]:bg-white/15">{counts[state] || 0}</span>}
                        <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-4 opacity-0 group-data-[selected]:opacity-100"><path d="m4 10 4 4 8-8" /></svg>
                    </span>
                </ListboxOption>)}
            </ListboxOptions>
        </div>
    </Listbox>;
}
