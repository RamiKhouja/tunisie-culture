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
        <div dir={dir} className={`min-h-screen overflow-x-clip bg-[#f3e5c8] pt-[6.5rem] md:pt-[8.125rem] text-[#1e2a3a] ${locale === 'ar' ? 'font-arabic-body' : 'font-latin-body'}`}>
            <header className={`maqamat-header fixed inset-x-0 top-0 z-50 border-b border-[#b88a6b]/35 bg-[#e7d6cc] ${locale === 'ar' ? 'nav-arabic' : ''}`}>
                <div className="relative mx-auto flex h-[5.125rem] w-full items-center justify-between px-5 sm:px-8 lg:px-8">
                    <Link href="/" className="group maqamat-brand flex items-center gap-3" aria-label="Maqamat Tunisia home">
                        <img src="/pictures/maqamat-logo.svg" alt="" className="size-11 shrink-0" />
                        <span>
                            <span className={`maqamat-name block text-2xl font-bold tracking-[0.02em] text-[#2e3c8f] ${locale === 'ar' ? 'font-arabic-title' : 'font-latin-title'}`}>{locale === 'ar' ? 'مقامات تونس' : 'Maqamat Tunisia'}</span>
                            <span className="maqamat-subtitle block text-[9px] tracking-[0.05em] text-[#4a5670]">{locale === 'ar' ? 'خارطة تونس الثقافية' : 'Cultural Map of Tunisia'}</span>
                        </span>
                    </Link>

                    <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-7 text-sm font-semibold md:flex" aria-label="Main navigation">
                        {navigation.map((item) => (
                            <a key={item.key} href={item.href} className={`border-b-2 py-2 transition ${item.key === 'home' ? 'nav-active border-[#a4502a] text-[#913d20]' : 'border-transparent text-[#18293b] hover:border-[#a4502a] hover:text-[#913d20]'}`}>
                                {t(item.key)}
                            </a>
                        ))}
                    </nav>

                    <div className="flex items-center gap-3">
                        <div className="relative hidden md:block">
                            <button type="button" aria-label={t('language')} aria-expanded={isLanguageOpen} onClick={() => setIsLanguageOpen((open) => !open)} className="nav-language-control flex items-center gap-2 rounded-lg border border-[#b88a6b] px-3.5 py-2 text-sm font-normal text-[#18293b] transition hover:bg-[#f1e2d9]">
                            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.4 2.5 3.5 5.5 3.5 9s-1.1 6.5-3.5 9c-2.4-2.5-3.5-5.5-3.5-9S9.6 5.5 12 3Z" /></svg>
                                <span className="text-xs">{languages.find((item) => item.code === locale)?.label}</span>
                                <svg viewBox="0 0 20 20" className={`size-3 transition ${isLanguageOpen ? 'rotate-180' : ''}`} fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M5.2 7.2a.75.75 0 0 1 1.06 0L10 10.94l3.74-3.74a.75.75 0 1 1 1.06 1.06l-4.27 4.27a.75.75 0 0 1-1.06 0L5.2 8.26a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" /></svg>
                            </button>
                            {isLanguageOpen && <div className="absolute end-0 top-full z-[70] mt-2 min-w-32 overflow-hidden rounded-xl border border-[#8b6a3e]/40 bg-[#f7ead0] p-1 text-[#49351F] shadow-lg" role="menu">
                                {languages.map((item) => <button key={item.code} type="button" role="menuitem" onClick={() => { setLocale(item.code); setIsLanguageOpen(false); }} className={`block w-full rounded-lg px-3 py-2 text-start text-xs font-semibold transition hover:bg-[#49351F] hover:text-[#ead7aa] ${locale === item.code ? 'bg-[#49351F]/10' : ''}`}>{item.shortLabel} <span className="ms-2 font-normal opacity-70">{item.label}</span></button>)}
                            </div>}
                        </div>

                        <Link
                            href={auth?.user ? route('dashboard') : route('login')}
                            className="nav-auth-button hidden rounded-lg bg-[#a4502a] px-5 py-2.5 text-sm font-semibold text-[#fff8ed] transition hover:bg-[#913d20] md:inline-flex"
                        >
                            {auth?.user ? t('dashboard') : t('signIn')}
                        </Link>

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
                <div className="maqamat-header-ornament" aria-hidden="true" />
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
                        className={`fixed bottom-0 top-0 z-[60] w-[min(82vw,22rem)] overflow-y-auto ${dir === 'rtl' ? 'left-0 border-r shadow-[12px_0_30px_rgba(43,29,16,0.22)]' : 'right-0 border-l shadow-[-12px_0_30px_rgba(43,29,16,0.22)]'} bg-[#ead7aa] p-5 md:hidden`}
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
                                    className={`border-b border-[#8b6a3e]/20 px-4 py-3.5 text-[#49351F] transition last:border-0 hover:bg-[#49351F]/10 ${item.key === 'home' ? 'nav-active' : ''}`}
                                >
                                    {t(item.key)}
                                </a>
                            ))}
                            <div className="mt-auto space-y-3">
                                <div className="relative">
                                    <button type="button" aria-label={t('language')} aria-expanded={isLanguageOpen} onClick={() => setIsLanguageOpen((open) => !open)} className="flex w-full items-center justify-between rounded-xl border border-[#8b6a3e]/50 px-4 py-3 text-sm font-semibold text-[#49351F] transition hover:bg-[#49351F]/10">
                                        <span className="flex items-center gap-2">
                                            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.4 2.5 3.5 5.5 3.5 9s-1.1 6.5-3.5 9c-2.4-2.5-3.5-6.5-3.5-9S9.6 5.5 12 3Z" /></svg>
                                            <span>{languages.find((item) => item.code === locale)?.label}</span>
                                        </span>
                                        <svg viewBox="0 0 20 20" className={`size-4 transition ${isLanguageOpen ? 'rotate-180' : ''}`} fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M5.2 7.2a.75.75 0 0 1 1.06 0L10 10.94l3.74-3.74a.75.75 0 1 1 1.06 1.06l-4.27 4.27a.75.75 0 0 1-1.06 0L5.2 8.26a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" /></svg>
                                    </button>
                                    {isLanguageOpen && <div className="absolute inset-x-0 bottom-full z-[70] mb-2 overflow-hidden rounded-xl border border-[#8b6a3e]/40 bg-[#f7ead0] p-1 text-[#49351F] shadow-lg" role="menu">
                                        {languages.map((item) => <button key={item.code} type="button" role="menuitem" onClick={() => { setLocale(item.code); setIsLanguageOpen(false); }} className={`block w-full rounded-lg px-3 py-2 text-start text-xs font-semibold transition hover:bg-[#49351F] hover:text-[#ead7aa] ${locale === item.code ? 'bg-[#49351F]/10' : ''}`}>{item.shortLabel} <span className="ms-2 font-normal opacity-70">{item.label}</span></button>)}
                                    </div>}
                                </div>
                                <Link
                                    href={auth?.user ? route('dashboard') : route('login')}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="block rounded-xl bg-[#49351F] px-4 py-3 text-center text-sm font-semibold text-[#f0dfb8] transition hover:bg-[#2f2115]"
                                >
                                    {auth?.user ? t('dashboard') : t('signIn')}
                                </Link>
                            </div>
                        </div>
                    </nav>
                </>
            )}

            {children}
        </div>
    );
}
