import Dropdown from '@/Components/Dropdown';
import { Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/i18n';

const Icon = ({ name, className = 'h-5 w-5' }) => {
    const paths = {
        dashboard: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
        collection: <><path d="M4 19.5V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v14.5"/><path d="M8 7h7M8 11h7M3 19.5h18"/></>,
        map: <><path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3Z"/><path d="M9 3v15M15 6v15"/></>,
        users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></>,
        tags: <><path d="M20.6 13.6 11 4H4v7l9.6 9.6a2 2 0 0 0 2.8 0l4.2-4.2a2 2 0 0 0 0-2.8Z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/></>,
        report: <><path d="M4 19V9M10 19V5M16 19v-7M22 19V3"/><path d="M2 19h22"/></>,
        settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1v.1h-4v-.1A1.7 1.7 0 0 0 8.6 19.4a1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.2 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1-.4h-.1v-4h.1A1.7 1.7 0 0 0 4.2 8.6a1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 0 0 8.6 4.2a1.7 1.7 0 0 0 1-.6 1.7 1.7 0 0 0 .4-1v-.1h4v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 19.4 8.6a1.7 1.7 0 0 0 .6 1 1.7 1.7 0 0 0 1 .4h.1v4H21a1.7 1.7 0 0 0-1.6 1Z"/></>,
        menu: <path d="M4 6h16M4 12h16M4 18h16"/>,
        close: <path d="m6 6 12 12M18 6 6 18"/>,
        bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></>,
        search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
        chevron: <path d="m9 18 6-6-6-6"/>,
    };
    return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
};

const navigation = [
    { key: 'overview', icon: 'dashboard', href: 'dashboard' },
    { key: 'culturalItems', icon: 'collection', href: 'admin.cultural-items.index' },
    { key: 'organizations', icon: 'users', href: 'admin.organizations.index' },
    { key: 'users', icon: 'users', href: 'admin.users.index' },
    { key: 'events', icon: 'collection', href: 'admin.events.index' },
    { key: 'statesCities', icon: 'map', href: 'admin.locations.index' },
    { key: 'categories', icon: 'tags', href: 'admin.categories.index' },
    { key: 'types', icon: 'tags', href: 'admin.types.index' },
    { key: 'artistsPeople', icon: 'users', href: 'admin.artists.index' },
    { key: 'reports', icon: 'report' },
];

export default function AdminLayout({ header, children }) {
    const { auth, flash } = usePage().props;
    const { user } = auth;
    const { languages, locale, setLocale, t, dir } = useLanguage();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);

    useEffect(() => {
        document.body.style.overflow = drawerOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [drawerOpen]);

    const sidebar = (
        <div className="flex h-full flex-col bg-[#EED9AE] text-[#44301D]">
            <div className={`flex h-20 items-center border-b border-[#9B7847]/30 ${collapsed ? 'justify-center px-3' : 'px-6'}`}>
                <Link href="/" className="flex items-center gap-3" aria-label="Athar home">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-[#9B7847]/60 bg-[#D5B66F]/35 text-lg font-bold text-[#44301D]">أ</span>
                    {!collapsed && <div><div className="font-serif text-xl font-bold tracking-wide">ATHAR</div><div className="text-[10px] uppercase tracking-[.24em] text-[#747A3C]">{t('heritageArchive')}</div></div>}
                </Link>
            </div>

            <nav className="flex-1 space-y-1.5 overflow-y-auto px-3 py-6" aria-label="Admin navigation">
                {!collapsed && <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[.2em] text-[#44301D]/50">{t('workspace')}</p>}
                {navigation.filter(item => user.role === 'admin' || ['overview', 'organizations', 'events', 'categories'].includes(item.key)).map((item) => {
                    const active = item.href && route().current(item.href);
                    return (
                        <Link key={item.key} href={item.href === 'admin.organizations.index' && user.role === 'organizer' ? route('admin.organizations.edit', auth.organization_id) : item.href ? route(item.href) : '#'} title={collapsed ? t(item.key) : undefined}
                            className={`group flex items-center rounded-xl py-3 text-sm font-medium transition ${collapsed ? 'justify-center px-2' : 'gap-3 px-3'} ${active ? 'bg-[#D5B66F] text-[#44301D] shadow-sm' : 'text-[#44301D]/75 hover:bg-white/45 hover:text-[#44301D]'}`}>
                            <Icon name={item.icon} className="h-[19px] w-[19px] shrink-0" />
                            {!collapsed && <span>{t(item.key)}</span>}
                            {!collapsed && !active && <Icon name="chevron" className={`${dir === 'rtl' ? 'mr-auto rotate-180' : 'ml-auto'} h-3.5 w-3.5 opacity-0 transition group-hover:opacity-60`} />}
                        </Link>
                    );
                })}
            </nav>

            <div className="border-t border-[#9B7847]/30 p-3">
                <Link href={route('profile.edit')} className={`flex items-center rounded-xl py-3 text-sm text-[#44301D]/75 hover:bg-white/45 hover:text-[#44301D] ${collapsed ? 'justify-center px-2' : 'gap-3 px-3'}`}>
                    <Icon name="settings" className="h-[19px] w-[19px]" />{!collapsed && t('settings')}
                </Link>
            </div>
        </div>
    );

    return (
        <div dir={dir} className={`min-h-screen bg-white text-[#44301D] ${locale === 'ar' ? 'font-arabic-admin' : ''}`}>
            <aside className={`fixed inset-y-0 z-30 hidden transition-[width] duration-300 lg:block ${dir === 'rtl' ? 'right-0' : 'left-0'} ${collapsed ? 'w-20' : 'w-64'}`}>{sidebar}</aside>

            {drawerOpen && <button className="fixed inset-0 z-40 bg-[#44301D]/55 backdrop-blur-sm lg:hidden" onClick={() => setDrawerOpen(false)} aria-label="Close navigation" />}
            <aside className={`fixed inset-y-0 z-50 w-72 transform transition duration-300 lg:hidden ${dir === 'rtl' ? 'right-0' : 'left-0'} ${drawerOpen ? 'translate-x-0' : dir === 'rtl' ? 'translate-x-full' : '-translate-x-full'}`}>
                <button onClick={() => setDrawerOpen(false)} className={`absolute top-5 rounded-lg p-2 text-[#44301D]/70 hover:bg-white/45 ${dir === 'rtl' ? 'left-4' : 'right-4'}`} aria-label="Close menu"><Icon name="close" /></button>
                {sidebar}
            </aside>

            <div dir={dir} className={`min-h-screen transition-[padding] duration-300 ${dir === 'rtl' ? (collapsed ? 'lg:pr-20' : 'lg:pr-64') : (collapsed ? 'lg:pl-20' : 'lg:pl-64')}`}>
                <header className="sticky top-0 z-20 flex h-20 items-center border-b border-[#9B7847]/30 bg-[#EED9AE] px-4 text-[#44301D] shadow-sm sm:px-6">
                    <button onClick={() => setDrawerOpen(true)} className="rounded-lg p-2 hover:bg-white/45 lg:hidden" aria-label="Open menu"><Icon name="menu" /></button>
                    <button onClick={() => setCollapsed((value) => !value)} className="hidden rounded-lg p-2 hover:bg-white/45 lg:block" aria-label="Toggle sidebar"><Icon name="menu" /></button>

                    <div className="ml-4 hidden w-full max-w-sm sm:block">
                        <label className="relative block">
                            <span className="sr-only">{t('searchArchive')}</span><Icon name="search" className="absolute left-3 top-2.5 h-4 w-4 text-[#44301D]/45" />
                            <input className="w-full rounded-xl border border-[#9B7847]/35 bg-white/45 py-2 pl-10 pr-4 text-sm text-[#44301D] placeholder:text-[#44301D]/45 focus:border-[#49351F] focus:ring-[#49351F]" placeholder={t('searchArchive')} />
                        </label>
                    </div>

                    <div className="ml-auto flex items-center gap-2 sm:gap-4">
                        <div className="flex items-center gap-1 rounded-xl bg-white/35 p-1" aria-label={t('language')}>{languages.map((language) => <button key={language.code} type="button" onClick={() => setLocale(language.code)} className={`rounded-lg px-2 py-1 text-[11px] font-bold ${locale === language.code ? 'bg-[#49351F] text-white' : 'text-[#44301D]/65'}`}>{language.shortLabel}</button>)}</div>
                        <button className="relative rounded-xl p-2.5 text-[#44301D]/75 hover:bg-white/45 hover:text-[#49351F]" aria-label={t('notifications')}><Icon name="bell" /><span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#49351F] ring-2 ring-[#EED9AE]" /></button>
                        <span className="hidden h-8 w-px bg-[#9B7847]/30 sm:block" />
                        <Dropdown>
                            <Dropdown.Trigger>
                                <button className="flex items-center gap-3 rounded-xl p-1.5 text-left hover:bg-white/45">
                                    <span className="grid h-9 w-9 place-items-center rounded-full bg-[#D5B66F] text-sm font-bold text-[#44301D]">{user.name?.charAt(0).toUpperCase()}</span>
                                    <span className="hidden sm:block"><span className="block max-w-32 truncate text-sm font-semibold">{user.name}</span><span className="block text-[11px] text-[#44301D]/55">{user.role === 'organizer' ? t('organizer') : t('administrator')}</span></span>
                                    <svg className="hidden h-4 w-4 sm:block" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.3 7.3a1 1 0 0 1 1.4 0l3.3 3.3 3.3-3.3a1 1 0 1 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 0-1.4Z" clipRule="evenodd" /></svg>
                                </button>
                            </Dropdown.Trigger>
                            <Dropdown.Content align="right" width="48">
                                <Dropdown.Link href={route('profile.edit')}>{t('profile')}</Dropdown.Link>
                                <Dropdown.Link href={route('logout')} method="post" as="button">{t('logOut')}</Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>
                    </div>
                </header>

                <main className="p-4 sm:p-6 lg:p-8">
                    {flash?.success && <div className="mb-5 rounded-xl border border-[#747A3C]/35 bg-[#747A3C]/10 px-4 py-3 text-sm font-medium text-[#52602f]">{flash.success}</div>}
                    {header && <div className="mb-6">{header}</div>}
                    {children}
                </main>
            </div>
        </div>
    );
}
