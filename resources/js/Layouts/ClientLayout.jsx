import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { useLanguage } from '@/i18n';

const navigation = [
    { key: 'home', href: '/' },
    { key: 'destinations', href: '/#destinations' },
    { key: 'experiences', href: '/#experiences' },
    { key: 'about', href: '/#about' },
];

export default function ClientLayout({ children }) {
    const { auth } = usePage().props;
    const { languages, locale, setLocale, t, dir } = useLanguage();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLanguageOpen, setIsLanguageOpen] = useState(false);

    return (
        <div dir={dir} className={`paper-background min-h-screen bg-[#f3e3bf] pt-20 text-[#49351F] ${locale === 'ar' ? 'font-arabic-body' : 'font-latin-body'}`}>
            <header className="paper-background fixed inset-x-0 top-0 z-50 border-b border-[#8b6a3e]/40 bg-[#ead7aa] shadow-[0_3px_14px_rgba(73,53,31,0.2)]">
                <div className="relative mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
                    <Link href="/" className="group flex items-center gap-3" aria-label="Athar home">
                        <span className="grid size-10 place-items-center rounded-full border border-[#755332]/60 text-[#49351F] transition group-hover:bg-[#49351F] group-hover:text-[#ead7aa]">
                            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                                <path d="M12 21c4-3.2 6.5-6.4 6.5-10A6.5 6.5 0 1 0 5.5 11c0 3.6 2.5 6.8 6.5 10Z" />
                                <path d="M12 8.25a2.75 2.75 0 1 0 0 5.5 2.75 2.75 0 0 0 0-5.5Z" />
                            </svg>
                        </span>
                        <span>
                            <span className={`block text-xl font-bold tracking-[0.2em] ${locale === 'ar' ? 'font-arabic-title' : 'font-latin-title'}`}>ATHAR</span>
                            <span className="block text-[8px] uppercase tracking-[0.3em] text-[#755332]">Explore Tunisia</span>
                        </span>
                    </Link>

                    <nav className="hidden items-center gap-7 text-sm font-semibold md:flex" aria-label="Main navigation">
                        {navigation.map((item) => (
                            <a key={item.key} href={item.href} className="border-b border-transparent py-2 text-[#49351F] transition hover:border-[#49351F] hover:text-[#281c10]">
                                {t(item.key)}
                            </a>
                        ))}
                    </nav>

                    <div className="flex items-center gap-3">
                        <Link
                            href={auth?.user ? route('dashboard') : route('login')}
                            className="hidden rounded-full border border-[#49351F]/60 px-5 py-2 text-sm font-semibold text-[#49351F] transition hover:bg-[#49351F] hover:text-[#f0dfb8] md:inline-flex"
                        >
                            {auth?.user ? t('dashboard') : t('signIn')}
                        </Link>

                        <div className="relative hidden md:block">
                            <button type="button" aria-label={t('language')} aria-expanded={isLanguageOpen} onClick={() => setIsLanguageOpen((open) => !open)} className="flex items-center gap-2 rounded-full border border-[#49351F]/45 px-3 py-2 text-sm font-semibold text-[#49351F] transition hover:bg-[#49351F] hover:text-[#ead7aa]">
                            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.4 2.5 3.5 5.5 3.5 9s-1.1 6.5-3.5 9c-2.4-2.5-3.5-5.5-3.5-9S9.6 5.5 12 3Z" /></svg>
                                <span className="text-xs">{languages.find((item) => item.code === locale)?.shortLabel}</span>
                                <svg viewBox="0 0 20 20" className={`size-3 transition ${isLanguageOpen ? 'rotate-180' : ''}`} fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M5.2 7.2a.75.75 0 0 1 1.06 0L10 10.94l3.74-3.74a.75.75 0 1 1 1.06 1.06l-4.27 4.27a.75.75 0 0 1-1.06 0L5.2 8.26a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" /></svg>
                            </button>
                            {isLanguageOpen && <div className="absolute end-0 top-full z-[70] mt-2 min-w-32 overflow-hidden rounded-xl border border-[#8b6a3e]/40 bg-[#f7ead0] p-1 text-[#49351F] shadow-lg" role="menu">
                                {languages.map((item) => <button key={item.code} type="button" role="menuitem" onClick={() => { setLocale(item.code); setIsLanguageOpen(false); }} className={`block w-full rounded-lg px-3 py-2 text-start text-xs font-semibold transition hover:bg-[#49351F] hover:text-[#ead7aa] ${locale === item.code ? 'bg-[#49351F]/10' : ''}`}>{item.shortLabel} <span className="ms-2 font-normal opacity-70">{item.label}</span></button>)}
                            </div>}
                        </div>

                        <button
                            type="button"
                            className="grid size-11 place-items-center rounded-full border border-[#49351F]/50 text-[#49351F] transition hover:bg-[#49351F] hover:text-[#ead7aa] md:hidden"
                            onClick={() => setIsMenuOpen((open) => !open)}
                            aria-expanded={isMenuOpen}
                            aria-controls="mobile-navigation"
                            aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                        >
                            <span className="relative block h-4 w-5" aria-hidden="true">
                                <span className={`absolute left-0 top-0 h-0.5 w-5 bg-current transition ${isMenuOpen ? 'translate-y-[7px] rotate-45' : ''}`} />
                                <span className={`absolute left-0 top-[7px] h-0.5 w-5 bg-current transition ${isMenuOpen ? 'opacity-0' : ''}`} />
                                <span className={`absolute bottom-0 left-0 h-0.5 w-5 bg-current transition ${isMenuOpen ? '-translate-y-[7px] -rotate-45' : ''}`} />
                            </span>
                        </button>
                    </div>
                </div>
            </header>

            {isMenuOpen && (
                <>
                    <button
                        type="button"
                        className="fixed inset-0 z-[55] bg-[#2b1d10]/35 backdrop-blur-[2px] md:hidden"
                        onClick={() => setIsMenuOpen(false)}
                        aria-label="Close navigation menu"
                    />
                    <nav
                        id="mobile-navigation"
                        className={`paper-background fixed bottom-0 top-0 z-[60] w-[min(82vw,22rem)] overflow-y-auto ${dir === 'rtl' ? 'left-0 border-r shadow-[12px_0_30px_rgba(43,29,16,0.22)]' : 'right-0 border-l shadow-[-12px_0_30px_rgba(43,29,16,0.22)]'} bg-[#ead7aa] p-5 md:hidden`}
                        aria-label="Mobile navigation"
                    >
                        <div className="relative flex min-h-full flex-col">
                            <div className="mb-5 flex items-center justify-between border-b border-[#8b6a3e]/30 pb-5">
                                <span className={`text-lg font-bold tracking-[0.18em] text-[#49351F] ${locale === 'ar' ? 'font-arabic-title' : 'font-latin-title'}`}>{t('menu')}</span>
                                <button
                                    type="button"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="grid size-10 place-items-center rounded-full border border-[#49351F]/45 text-[#49351F] transition hover:bg-[#49351F] hover:text-[#ead7aa]"
                                    aria-label="Close navigation menu"
                                >
                                    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                                        <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
                                    </svg>
                                </button>
                            </div>
                            {navigation.map((item) => (
                                <a
                                    key={item.key}
                                    href={item.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="border-b border-[#8b6a3e]/20 px-4 py-3.5 font-semibold text-[#49351F] transition last:border-0 hover:bg-[#49351F]/10"
                                >
                                    {t(item.key)}
                                </a>
                            ))}
                            <Link
                                href={auth?.user ? route('dashboard') : route('login')}
                                onClick={() => setIsMenuOpen(false)}
                                className="mt-auto rounded-xl bg-[#49351F] px-4 py-3 text-center text-sm font-semibold text-[#f0dfb8] transition hover:bg-[#2f2115]"
                            >
                                {auth?.user ? t('dashboard') : t('signIn')}
                            </Link>
                        </div>
                    </nav>
                </>
            )}

            {children}
        </div>
    );
}
