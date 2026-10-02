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
        all: 'الكل', allCategories: 'كل الفئات', culturalContent: 'محتوى ثقافي', events: 'فعاليات', upcoming: 'قادم', past: 'منتهٍ', dateTime: 'التاريخ والوقت', eventStatus: 'حالة الفعالية', noCultural: 'لا توجد عناصر ثقافية تطابق هذه المرشحات.',
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
        overview: 'نظرة عامة', culturalItems: 'العناصر الثقافية', organizations: 'المنظمات', users: 'المستخدمون', events: 'الفعاليات', statesCities: 'الولايات والمدن', categories: 'الفئات', types: 'الأنواع', artistsPeople: 'الفنانون والأشخاص', reports: 'التقارير', workspace: 'مساحة العمل', heritageArchive: 'أرشيف التراث', settings: 'الإعدادات', profile: 'الملف الشخصي', logOut: 'تسجيل الخروج', administrator: 'مسؤول', organizer: 'منظم', searchArchive: 'البحث في الأرشيف…', notifications: 'الإشعارات',
        dashboardOverview: 'نظرة عامة على لوحة التحكم', quickLook: 'نظرة سريعة على أرشيف أثَر', archiveStatistics: 'إحصاءات الأرشيف', upcomingEventsCount: 'الفعاليات القادمة', members: 'الأعضاء', inArchive: 'في الأرشيف', manageUsers: 'إدارة المستخدمين', manageUsersHelp: 'إدارة صلاحيات المسؤولين وأعضاء المنظمات.', addUser: 'إضافة مستخدم', organizationMembers: 'أعضاء المنظمات', administrators: 'المسؤولون', user: 'المستخدم', status: 'الحالة', actions: 'الإجراءات', active: 'نشط', disabled: 'معطل', activate: 'تفعيل', disable: 'تعطيل', edit: 'تعديل', delete: 'حذف', noUsers: 'لا يوجد مستخدمون في هذه المجموعة.', deleteUserConfirm: 'هل تريد حذف هذا المستخدم؟',
        addNew: 'إضافة جديد', name: 'الاسم', url: 'الرابط', relationTitle: 'العلاقة / اللقب', noRecords: 'لا توجد سجلات بعد. أضف أول سجل للبدء.', parent: 'الأصل', category: 'الفئة', professionTitle: 'المهنة أو اللقب', urlSlug: 'معرّف الرابط', none: 'لا شيء', save: 'حفظ', saving: 'جارٍ الحفظ…', cancel: 'إلغاء', description: 'الوصف', mapPointColor: 'لون نقطة الخريطة', mainImage: 'الصورة الرئيسية', icon: 'الأيقونة', portrait: 'الصورة الشخصية',
        catalog: 'الفهرس', catalogEditor: 'محرر الفهرس', newCulturalItem: 'عنصر ثقافي جديد', editCulturalItem: 'تعديل عنصر ثقافي', identity: 'البيانات الأساسية', classification: 'التصنيف', location: 'الموقع', people: 'الأشخاص', media: 'الوسائط', shortDescription: 'الوصف المختصر', importance: 'الأهمية', releaseDate: 'تاريخ أو سنة الإصدار', visiblePublicMap: 'ظاهر على الخريطة العامة', state: 'الولاية', city: 'المدينة', selectState: 'اختر الولاية', selectCity: 'اختر المدينة', noCity: 'لا توجد مدينة', noState: 'لا توجد ولاية', high: 'مرتفع', medium: 'متوسط', low: 'منخفض',
        eventsTitle: 'الفعاليات', organizationsTitle: 'المنظمات', eventDetails: 'تفاصيل الفعالية', eventDates: 'تواريخ الفعالية', date: 'التاريخ', startsAt: 'تبدأ في', endsAt: 'تنتهي في', addDate: 'إضافة تاريخ', removeDate: 'إزالة التاريخ', freeEvent: 'فعالية مجانية', price: 'السعر', paymentLink: 'رابط الدفع', tags: 'الوسوم (مفصولة بفواصل)', categoriesLabel: 'الفئات', addPictures: 'إضافة صور', removePicture: 'إزالة الصورة', addVideos: 'إضافة ملفات فيديو', removeVideo: 'إزالة الفيديو', videoLinks: 'روابط الفيديو (رابط في كل سطر)', chooseMapPosition: 'اختر موقعًا على الخريطة', useLocation: 'استخدم هذا الموقع', noMapPosition: 'لم يتم اختيار موقع على الخريطة',
        membersLabel: 'الأعضاء', role: 'الدور', roleInOrganization: 'الدور في المنظمة', showPublicly: 'إظهار للعامة', addMember: 'إضافة عضو', removeMember: 'إزالة العضو', phone: 'الهاتف', emailOptional: 'البريد الإلكتروني (اختياري)', activeOrganization: 'منظمة نشطة (إظهار فعالياتها على الخريطة العامة)',
        statesCitiesTitle: 'الولايات والمدن', mapData: 'بيانات الخريطة', locationsHelp: 'إدارة اختيارات المواقع المتاحة للعناصر الثقافية.', addState: 'إضافة ولاية', editState: 'تعديل الولاية', newState: 'ولاية جديدة', stateCode: 'رمز الولاية', cities: 'المدن', addCity: 'إضافة مدينة', deleteStateConfirm: 'هل تريد حذف هذه الولاية؟', noCode: 'لا يوجد رمز',
    },
    fr: {
        home: 'Accueil', destinations: 'Destinations', experiences: 'Expériences', about: 'À propos',
        exploreTunisia: 'Explorer la Tunisie', exploreSubtitle: 'Découvrez le patrimoine culturel et les événements des 24 gouvernorats.',
        signIn: 'Se connecter', dashboard: 'Tableau de bord', menu: 'MENU', language: 'Langue',
        culturalDiscoveries: 'Découvertes culturelles', upcomingEvents: 'Événements à venir', discoverCollection: 'Découvrir la collection',
        culturalDescription: 'Les derniers ajouts à notre patrimoine commun.', todayBeyond: "Aujourd'hui et au-delà",
        calendarDescription: 'Votre agenda culturel à l’heure tunisienne.', explore: 'Explorer', filters: 'Filtres',
        governorate: 'Gouvernorat', allTunisia: 'Toute la Tunisie', showPlacesNames: 'Afficher les noms des lieux', resetFilters: 'Réinitialiser les filtres',
        all: 'Tout', allCategories: 'Toutes les catégories', culturalContent: 'Contenu culturel', events: 'Événements', upcoming: 'À venir', past: 'Passé', dateTime: 'Date et heure', eventStatus: 'Statut de l’événement', noCultural: 'Aucun élément culturel ne correspond à ces filtres.',
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
        overview: 'Vue d’ensemble', culturalItems: 'Éléments culturels', organizations: 'Organisations', users: 'Utilisateurs', events: 'Événements', statesCities: 'Gouvernorats et villes', categories: 'Catégories', types: 'Types', artistsPeople: 'Artistes et personnes', reports: 'Rapports', workspace: 'Espace de travail', heritageArchive: 'Archives du patrimoine', settings: 'Paramètres', logOut: 'Se déconnecter', administrator: 'Administrateur', organizer: 'Organisateur', searchArchive: 'Rechercher dans les archives…', notifications: 'Notifications', dashboardOverview: 'Vue d’ensemble du tableau de bord', quickLook: 'Un aperçu rapide des archives Athar', archiveStatistics: 'Statistiques des archives', upcomingEventsCount: 'Événements à venir', members: 'Membres', inArchive: 'Dans les archives', manageUsers: 'Gérer les utilisateurs', manageUsersHelp: 'Gérer les accès des administrateurs et des membres des organisations.', addUser: 'Ajouter un utilisateur', organizationMembers: 'Membres des organisations', administrators: 'Administrateurs', user: 'Utilisateur', status: 'Statut', actions: 'Actions', active: 'Actif', disabled: 'Désactivé', activate: 'Activer', disable: 'Désactiver', edit: 'Modifier', delete: 'Supprimer', noUsers: 'Aucun utilisateur dans ce groupe.', deleteUserConfirm: 'Supprimer cet utilisateur ?', addNew: 'Ajouter', name: 'Nom', url: 'URL', relationTitle: 'Relation / titre', noRecords: 'Aucun enregistrement. Ajoutez le premier pour commencer.', parent: 'Parent', category: 'Catégorie', professionTitle: 'Profession ou titre', urlSlug: 'Slug URL', none: 'Aucun', save: 'Enregistrer', saving: 'Enregistrement…', cancel: 'Annuler', description: 'Description', mapPointColor: 'Couleur du point sur la carte', mainImage: 'Image principale', icon: 'Icône', portrait: 'Portrait', catalog: 'Catalogue', catalogEditor: 'Éditeur du catalogue', newCulturalItem: 'Nouvel élément culturel', editCulturalItem: 'Modifier l’élément culturel', identity: 'Identité', classification: 'Classification', location: 'Lieu', people: 'Personnes', media: 'Médias', shortDescription: 'Description courte', importance: 'Importance', releaseDate: 'Date ou année de sortie', visiblePublicMap: 'Visible sur la carte publique', state: 'Gouvernorat', city: 'Ville', selectState: 'Sélectionnez un gouvernorat', selectCity: 'Sélectionnez une ville', noCity: 'Aucune ville', noState: 'Aucun gouvernorat', high: 'Élevée', medium: 'Moyenne', low: 'Faible', eventsTitle: 'Événements', organizationsTitle: 'Organisations', eventDetails: 'Détails de l’événement', eventDates: 'Dates de l’événement', date: 'Date', startsAt: 'Début', endsAt: 'Fin', addDate: 'Ajouter une date', removeDate: 'Supprimer la date', freeEvent: 'Événement gratuit', price: 'Prix', paymentLink: 'Lien de paiement', tags: 'Tags (séparés par des virgules)', categoriesLabel: 'Catégories', addPictures: 'Ajouter des images', removePicture: 'Supprimer l’image', addVideos: 'Ajouter des vidéos', removeVideo: 'Supprimer la vidéo', videoLinks: 'Liens vidéo (un par ligne)', chooseMapPosition: 'Choisir la position sur la carte', useLocation: 'Utiliser ce lieu', noMapPosition: 'Aucune position sélectionnée', membersLabel: 'Membres', role: 'Rôle', roleInOrganization: 'Rôle dans l’organisation', showPublicly: 'Afficher publiquement', addMember: 'Ajouter un membre', removeMember: 'Supprimer le membre', phone: 'Téléphone', emailOptional: 'E-mail (facultatif)', activeOrganization: 'Organisation active (afficher ses événements sur la carte publique)', statesCitiesTitle: 'Gouvernorats et villes', mapData: 'Données cartographiques', locationsHelp: 'Gérez les lieux disponibles pour les éléments culturels.', addState: 'Ajouter un gouvernorat', editState: 'Modifier le gouvernorat', newState: 'Nouveau gouvernorat', stateCode: 'Code du gouvernorat', cities: 'Villes', addCity: 'Ajouter une ville', deleteStateConfirm: 'Supprimer ce gouvernorat ?', noCode: 'Aucun code',
    },
    en: {
        home: 'Home', destinations: 'Destinations', experiences: 'Experiences', about: 'About',
        exploreTunisia: 'Explore Tunisia', exploreSubtitle: 'Discover cultural heritage and events across all 24 governorates.',
        signIn: 'Sign in', dashboard: 'Dashboard', menu: 'MENU', language: 'Language',
        culturalDiscoveries: 'Cultural discoveries', upcomingEvents: 'Upcoming events', discoverCollection: 'Discover the collection',
        culturalDescription: 'The latest additions to our shared heritage.', todayBeyond: 'Today & beyond',
        calendarDescription: 'Your cultural calendar, in Tunisia time.', explore: 'Explore', filters: 'Filters',
        governorate: 'Governorate', allTunisia: 'All Tunisia', showPlacesNames: 'Show places names', resetFilters: 'Reset filters',
        all: 'All', allCategories: 'All categories', culturalContent: 'Cultural Content', events: 'Events', upcoming: 'Upcoming', past: 'Past', dateTime: 'Date & time', eventStatus: 'Event status', noCultural: 'No cultural items match these filters.',
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
        overview: 'Overview', culturalItems: 'Cultural items', organizations: 'Organizations', users: 'Users', events: 'Events', statesCities: 'States & cities', categories: 'Categories', types: 'Types', artistsPeople: 'Artists & people', reports: 'Reports', workspace: 'Workspace', heritageArchive: 'Heritage archive', settings: 'Settings', logOut: 'Log out', administrator: 'Administrator', organizer: 'Organizer', searchArchive: 'Search the archive…', notifications: 'Notifications', dashboardOverview: 'Dashboard overview', quickLook: 'A quick look at the Athar archive.', archiveStatistics: 'Archive statistics', upcomingEventsCount: 'Upcoming events', members: 'Members', inArchive: 'In the archive', manageUsers: 'Manage users', manageUsersHelp: 'Manage administrator and organization member access.', addUser: 'Add user', organizationMembers: 'Organization members', administrators: 'Administrators', user: 'User', status: 'Status', actions: 'Actions', active: 'Active', disabled: 'Disabled', activate: 'Activate', disable: 'Disable', edit: 'Edit', delete: 'Delete', noUsers: 'No users in this group yet.', deleteUserConfirm: 'Delete this user?', addNew: 'Add new', name: 'Name', url: 'URL', relationTitle: 'Relation / title', noRecords: 'No records yet. Add the first one to begin.', parent: 'Parent', category: 'Category', professionTitle: 'Profession or title', urlSlug: 'URL slug', none: 'None', save: 'Save', saving: 'Saving…', cancel: 'Cancel', description: 'Description', mapPointColor: 'Map point color', mainImage: 'Main image', icon: 'Icon', portrait: 'Portrait', catalog: 'Catalog', catalogEditor: 'Catalog editor', newCulturalItem: 'New cultural item', editCulturalItem: 'Edit cultural item', identity: 'Identity', classification: 'Classification', location: 'Location', people: 'People', media: 'Media', shortDescription: 'Short description', importance: 'Importance', releaseDate: 'Release date or year', visiblePublicMap: 'Visible on the public map', state: 'State', city: 'City', selectState: 'Select state', selectCity: 'Select city', noCity: 'No city', noState: 'No state', high: 'High', medium: 'Medium', low: 'Low', eventsTitle: 'Events', organizationsTitle: 'Organizations', eventDetails: 'Event details', eventDates: 'Event dates', date: 'Date', startsAt: 'Starts at', endsAt: 'Ends at', addDate: 'Add date', removeDate: 'Remove date', freeEvent: 'Free event', price: 'Price', paymentLink: 'Payment link', tags: 'Tags (comma separated)', categoriesLabel: 'Categories', addPictures: 'Add pictures', removePicture: 'Remove picture', addVideos: 'Add video files', removeVideo: 'Remove video', videoLinks: 'Add video links (one per line)', chooseMapPosition: 'Choose map position', useLocation: 'Use this location', noMapPosition: 'No map position selected', membersLabel: 'Members', role: 'Role', roleInOrganization: 'Role in organization', showPublicly: 'Show publicly', addMember: 'Add member', removeMember: 'Remove member', phone: 'Phone', emailOptional: 'Email (optional)', activeOrganization: 'Active organization (show its events on the public map)', statesCitiesTitle: 'States & cities', mapData: 'Map data', locationsHelp: 'Manage the location choices available to cultural items.', addState: 'Add state', editState: 'Edit state', newState: 'New state', stateCode: 'State code', cities: 'Cities', addCity: 'Add city', deleteStateConfirm: 'Delete this state?', noCode: 'No code',
    },
};

const adminCreateLabels = {
    ar: { addNewEvent: 'إضافة فعالية', addNewOrganization: 'إضافة منظمة', addNewCulturalItem: 'إضافة عنصر ثقافي', addNewUser: 'إضافة مستخدم', addNewState: 'إضافة ولاية', addNewCategory: 'إضافة فئة', addNewType: 'إضافة نوع', addNewArtist: 'إضافة فنان أو شخص' },
    fr: { addNewEvent: 'Ajouter un événement', addNewOrganization: 'Ajouter une organisation', addNewCulturalItem: 'Ajouter un élément culturel', addNewUser: 'Ajouter un utilisateur', addNewState: 'Ajouter un gouvernorat', addNewCategory: 'Ajouter une catégorie', addNewType: 'Ajouter un type', addNewArtist: 'Ajouter un artiste ou une personne' },
    en: { addNewEvent: 'Add event', addNewOrganization: 'Add organization', addNewCulturalItem: 'Add cultural item', addNewUser: 'Add user', addNewState: 'Add state', addNewCategory: 'Add category', addNewType: 'Add type', addNewArtist: 'Add artist or person' },
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
    const value = useMemo(() => ({ locale: language.code, dir: language.dir, language, languages, setLocale, t: (key) => adminCreateLabels[language.code]?.[key] || messages[language.code][key] || messages.en[key] || key }), [language]);
    return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
    return useContext(LanguageContext);
}

export function localizedValue(value, locale = 'ar') {
    return value?.[locale] || value?.en || value?.fr || value?.ar || '';
}
