import { createContext, useContext, useEffect, useMemo, useState } from 'react';

export const languages = [
    { code: 'ar', label: 'العربية', shortLabel: 'AR', dir: 'rtl' },
    { code: 'fr', label: 'Français', shortLabel: 'FR', dir: 'ltr' },
    { code: 'en', label: 'English', shortLabel: 'EN', dir: 'ltr' },
];

const messages = {
    ar: {
        home: 'الرئيسية', destinations: 'الوجهات', experiences: 'التجارب', about: 'عن أثَر',
        exploreTunisia: 'اكتشف تونس', exploreSubtitle: 'اكتشف التراث الثقافي والفعاليات في جميع الولايات التونسية.',
        signIn: 'تسجيل الدخول', dashboard: 'لوحة التحكم', menu: 'القائمة', language: 'اللغة',
        culturalDiscoveries: 'اكتشافات ثقافية', upcomingEvents: 'فعاليات قادمة', discoverCollection: 'اكتشف المجموعة',
        culturalDescription: 'أحدث الإضافات إلى تراثنا المشترك.', todayBeyond: 'اليوم وما بعده',
        calendarDescription: 'تقويمك الثقافي حسب توقيت تونس.', explore: 'استكشف', filters: 'التصفية',
        governorate: 'الولاية', allTunisia: 'كل تونس', showPlacesNames: 'إظهار أسماء الأماكن', resetFilters: 'إعادة ضبط التصفية',
        all: 'الكل', allCategories: 'كل الفئات', culturalContent: 'محتوى ثقافي', events: 'فعاليات', noCultural: 'لا توجد عناصر ثقافية تطابق هذه المرشحات.',
        noEvents: 'لا توجد فعاليات قادمة تطابق هذه المرشحات.', tryAnother: 'جرّب فئة أو ولاية أخرى.', today: 'اليوم', tomorrow: 'غدًا',
        freeEntry: 'دخول مجاني', items: 'عناصر', item: 'عنصر', event: 'فعالية',
        mapLabel: 'خريطة تونس الثقافية', close: 'إغلاق', openFilters: 'فتح التصفية', closeFilters: 'إغلاق التصفية',
        createAccount: 'إنشاء حساب', account: 'الحساب', profile: 'الملف الشخصي', organization: 'المنظمة',
        firstName: 'الاسم', lastName: 'اللقب', email: 'البريد الإلكتروني', password: 'كلمة المرور', confirmPassword: 'تأكيد كلمة المرور',
        phoneOptional: 'الهاتف (اختياري)', bioOptional: 'نبذة (اختياري)', tellUsAboutYou: 'أخبرنا قليلاً عن نفسك. يمكنك تحديث هذه المعلومات لاحقًا.',
        organizationYouManage: 'أنشئ المنظمة التي ستديرها.', organizationName: 'اسم المنظمة', description: 'الوصف', organizationPhone: 'هاتف المنظمة',
        organizationEmailOptional: 'البريد الإلكتروني للمنظمة (اختياري)', selectGovernorate: 'اختر الولاية', city: 'المدينة', selectCity: 'اختر المدينة',
        organizationInfo: 'معلومات المنظمة', organizationSocials: 'شبكات التواصل', organizationSocialsHelp: 'أضف روابط المنظمة على شبكات التواصل (اختياري).',
        organizationLogo: 'شعار المنظمة', organizationMf: 'المعرّف الجبائي (اختياري)', showPhonePublicly: 'إظهار الهاتف للعموم', showEmailPublicly: 'إظهار البريد الإلكتروني للعموم',
        address: 'العنوان', postalCodeOptional: 'الرمز البريدي (اختياري)', alreadyRegistered: 'مسجل بالفعل؟', back: 'رجوع', continue: 'متابعة', creating: 'جارٍ الإنشاء…',
    },
    fr: {
        home: 'Accueil', destinations: 'Destinations', experiences: 'Expériences', about: 'À propos',
        exploreTunisia: 'Explorer la Tunisie', exploreSubtitle: 'Découvrez le patrimoine culturel et les événements des 24 gouvernorats.',
        signIn: 'Se connecter', dashboard: 'Tableau de bord', menu: 'MENU', language: 'Langue',
        culturalDiscoveries: 'Découvertes culturelles', upcomingEvents: 'Événements à venir', discoverCollection: 'Découvrir la collection',
        culturalDescription: 'Les derniers ajouts à notre patrimoine commun.', todayBeyond: "Aujourd'hui et au-delà",
        calendarDescription: 'Votre agenda culturel à l’heure tunisienne.', explore: 'Explorer', filters: 'Filtres',
        governorate: 'Gouvernorat', allTunisia: 'Toute la Tunisie', showPlacesNames: 'Afficher les noms des lieux', resetFilters: 'Réinitialiser les filtres',
        all: 'Tout', allCategories: 'Toutes les catégories', culturalContent: 'Contenu culturel', events: 'Événements', noCultural: 'Aucun élément culturel ne correspond à ces filtres.',
        noEvents: 'Aucun événement à venir ne correspond à ces filtres.', tryAnother: 'Essayez une autre catégorie ou un autre gouvernorat.', today: "Aujourd'hui", tomorrow: 'Demain',
        freeEntry: 'Entrée gratuite', items: 'éléments', item: 'élément', event: 'événement',
        mapLabel: 'Carte culturelle de la Tunisie', close: 'Fermer', openFilters: 'Ouvrir les filtres', closeFilters: 'Fermer les filtres',
        createAccount: 'Créer un compte', account: 'Compte', profile: 'Profil', organization: 'Organisation',
        firstName: 'Prénom', lastName: 'Nom', email: 'E-mail', password: 'Mot de passe', confirmPassword: 'Confirmer le mot de passe',
        phoneOptional: 'Téléphone (facultatif)', bioOptional: 'Biographie (facultatif)', tellUsAboutYou: 'Parlez-nous un peu de vous. Vous pourrez modifier ces informations plus tard.',
        organizationYouManage: 'Créez l’organisation que vous allez gérer.', organizationName: 'Nom de l’organisation', description: 'Description', organizationPhone: 'Téléphone de l’organisation',
        organizationInfo: 'Informations', organizationSocials: 'Réseaux sociaux', organizationSocialsHelp: 'Ajoutez les liens vers les réseaux sociaux de l’organisation (facultatif).',
        organizationLogo: 'Logo de l’organisation', organizationMf: 'Matricule fiscal (facultatif)', showPhonePublicly: 'Afficher le téléphone publiquement', showEmailPublicly: 'Afficher l’e-mail publiquement',
        organizationEmailOptional: 'E-mail de l’organisation (facultatif)', selectGovernorate: 'Sélectionnez un gouvernorat', city: 'Ville', selectCity: 'Sélectionnez une ville',
        address: 'Adresse', postalCodeOptional: 'Code postal (facultatif)', alreadyRegistered: 'Déjà inscrit ?', back: 'Retour', continue: 'Continuer', creating: 'Création…',
    },
    en: {
        home: 'Home', destinations: 'Destinations', experiences: 'Experiences', about: 'About',
        exploreTunisia: 'Explore Tunisia', exploreSubtitle: 'Discover cultural heritage and events across all 24 governorates.',
        signIn: 'Sign in', dashboard: 'Dashboard', menu: 'MENU', language: 'Language',
        culturalDiscoveries: 'Cultural discoveries', upcomingEvents: 'Upcoming events', discoverCollection: 'Discover the collection',
        culturalDescription: 'The latest additions to our shared heritage.', todayBeyond: 'Today & beyond',
        calendarDescription: 'Your cultural calendar, in Tunisia time.', explore: 'Explore', filters: 'Filters',
        governorate: 'Governorate', allTunisia: 'All Tunisia', showPlacesNames: 'Show places names', resetFilters: 'Reset filters',
        all: 'All', allCategories: 'All categories', culturalContent: 'Cultural Content', events: 'Events', noCultural: 'No cultural items match these filters.',
        noEvents: 'No upcoming events match these filters.', tryAnother: 'Try another category or governorate.', today: 'Today', tomorrow: 'Tomorrow',
        freeEntry: 'Free entry', items: 'items', item: 'item', event: 'event',
        mapLabel: 'Tunisia cultural map', close: 'Close', openFilters: 'Open filters', closeFilters: 'Close filters',
        createAccount: 'Create your account', account: 'Account', profile: 'Profile', organization: 'Organization',
        firstName: 'First name', lastName: 'Last name', email: 'Email', password: 'Password', confirmPassword: 'Confirm password',
        phoneOptional: 'Phone (optional)', bioOptional: 'Bio (optional)', tellUsAboutYou: 'Tell us a little about yourself. You can update this information later.',
        organizationInfo: 'Organization info', organizationSocials: 'Socials', organizationSocialsHelp: 'Add the organization social media links (optional).',
        organizationLogo: 'Organization logo', organizationMf: 'Tax ID (optional)', showPhonePublicly: 'Show phone publicly', showEmailPublicly: 'Show email publicly',
        organizationYouManage: 'Create the organization you will manage.', organizationName: 'Organization name', description: 'Description', organizationPhone: 'Organization phone',
        organizationEmailOptional: 'Organization email (optional)', selectGovernorate: 'Select governorate', city: 'City', selectCity: 'Select city',
        address: 'Address', postalCodeOptional: 'Postal code (optional)', alreadyRegistered: 'Already registered?', back: 'Back', continue: 'Continue', creating: 'Creating…',
    },
};

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
    const [locale, setLocale] = useState(() => window.localStorage.getItem('athar-locale') || 'ar');
    const language = languages.find((item) => item.code === locale) || languages[0];
    useEffect(() => {
        window.localStorage.setItem('athar-locale', language.code);
        document.documentElement.lang = language.code;
        document.documentElement.dir = language.dir;
    }, [language]);
    const value = useMemo(() => ({ locale: language.code, dir: language.dir, language, languages, setLocale, t: (key) => messages[language.code][key] || messages.en[key] || key }), [language]);
    return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
    return useContext(LanguageContext);
}

export function localizedValue(value, locale = 'ar') {
    return value?.[locale] || value?.en || value?.fr || value?.ar || '';
}
