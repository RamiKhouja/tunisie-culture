import Dropdown from '@/Components/Dropdown';
import { Link, usePage } from '@inertiajs/react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;

    return (
        <div className="min-h-screen bg-white text-[#44301D]">
            <nav className="border-b border-[#9B7847]/30 bg-[#EED9AE]">
                <div className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
                    <Link href="/" className="flex items-center gap-3 font-serif text-xl font-bold tracking-wide">
                        <span className="grid h-9 w-9 place-items-center rounded-lg border border-[#9B7847]/60 bg-[#D5B66F]/35">أ</span>
                        ATHAR
                    </Link>

                    <div className="ml-auto">
                        <Dropdown>
                            <Dropdown.Trigger>
                                <button className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-white/45">
                                    {user.name}
                                    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.3 7.3a1 1 0 0 1 1.4 0l3.3 3.3 3.3-3.3a1 1 0 1 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 0-1.4Z" clipRule="evenodd" /></svg>
                                </button>
                            </Dropdown.Trigger>
                            <Dropdown.Content align="right" width="48">
                                <Dropdown.Link href={route('dashboard')}>Admin</Dropdown.Link>
                                <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
                                <Dropdown.Link href={route('logout')} method="post" as="button">Log out</Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>
                    </div>
                </div>
            </nav>

            {header && <header className="border-b border-[#9B7847]/20 bg-white"><div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{header}</div></header>}
            <main>{children}</main>
        </div>
    );
}
