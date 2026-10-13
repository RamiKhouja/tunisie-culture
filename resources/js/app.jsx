import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { appNames, LanguageProvider } from './i18n';

const appName = import.meta.env.VITE_APP_NAME || appNames.en;
const localizedAppName = () => appNames[document.documentElement.lang] || appName;

createInertiaApp({
    title: () => localizedAppName(),
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<LanguageProvider><App {...props} /></LanguageProvider>);
    },
    progress: {
        color: '#4B5563',
    },
});
