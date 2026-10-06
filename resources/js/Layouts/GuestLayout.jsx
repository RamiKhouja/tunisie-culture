import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import { useLanguage } from '@/i18n';

export default function GuestLayout({ children }) {
    const { dir, locale, t } = useLanguage();

    return (
        <div dir={dir} className={`flex min-h-screen flex-col items-center bg-[#f7ead0] px-4 py-8 text-[#44301D] sm:justify-center sm:pt-10 ${locale === 'ar' ? 'font-arabic-body' : 'font-latin-body'}`}>
            <div>
                <Link href="/" className="flex items-center gap-3">
                    <ApplicationLogo alt={t('maqamatName')} className="h-20 w-20 shrink-0" />
                    <span>
                        <span className={`block text-2xl font-bold tracking-[0.02em] text-[#2e3c8f] ${locale === 'ar' ? 'font-arabic-title' : 'font-latin-title'}`}>
                            {t('maqamatName')}
                        </span>
                        <span className="maqamat-subtitle block text-[10px] tracking-[0.04em] text-[#4a5670]">
                            {t('maqamatSubtitle')}
                        </span>
                    </span>
                </Link>
            </div>

            <div className="guest-login-panel mt-6 w-full bg-[#e7d6cc] px-10 pb-20 pt-10 sm:max-w-4xl">
                <span className="login-bottom-border" aria-hidden="true" />
                {children}
            </div>
        </div>
    );
}
