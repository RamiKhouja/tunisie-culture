import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-[#f7ead0] px-4 py-8 text-[#44301D] sm:justify-center sm:pt-10">
            <div>
                <Link href="/">
                    <ApplicationLogo className="h-20 w-20 fill-current text-gray-500" />
                </Link>
            </div>

            <div className="mt-6 w-full overflow-hidden rounded-2xl border border-[#9B7847]/30 bg-[#fff8e6] px-6 py-6 shadow-[0_18px_60px_rgba(73,53,31,0.14)] sm:max-w-4xl sm:px-10 sm:py-8">
                {children}
            </div>
        </div>
    );
}
