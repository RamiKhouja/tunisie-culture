import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useLanguage } from '@/i18n';

export default function Index({ resource, title, items }) {
    const { auth } = usePage().props;
    const { locale, dir, t } = useLanguage();
    const canManage = auth.user.role === 'admin';
    const displayName = (name) => name?.[locale] || name?.en || name?.fr || name?.ar || t('none');
    const localizedTitle = resource === 'categories' ? t('categories') : resource === 'types' ? t('types') : t('artistsPeople');
    const addLabel = resource === 'categories' ? t('addNewCategory') : resource === 'types' ? t('addNewType') : t('addNewArtist');
    const remove = (item) => window.confirm(`${t('delete')} “${displayName(item.name)}”?`) && router.delete(route(`admin.${resource}.destroy`, item.id), { preserveScroll: true });
    return <AdminLayout header={<div className="flex items-end justify-between"><div><p className="text-xs font-semibold uppercase tracking-[.18em] text-[#747A3C]">{t('catalog')}</p><h1 className="font-serif text-3xl font-bold">{localizedTitle}</h1></div><Link href={route(`admin.${resource}.create`)} className="rounded-xl bg-[#49351F] px-4 py-2.5 text-sm font-semibold text-white">+ {addLabel}</Link></div>}>
        <Head title={localizedTitle} />
        <div className="overflow-hidden rounded-2xl border border-[#9B7847]/25 bg-white shadow-sm">
            <table dir={dir} className="w-full text-start text-sm"><thead className="bg-[#EED9AE]/55 text-[11px] uppercase tracking-wider text-[#44301D]/60"><tr><th className={`px-5 py-3 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t('name')}</th><th className={`hidden px-5 py-3 md:table-cell ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t('url')}</th><th className={`hidden px-5 py-3 sm:table-cell ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t('relationTitle')}</th><th className="px-5 py-3 text-end">{t('actions')}</th></tr></thead>
            <tbody className="divide-y divide-[#9B7847]/15">{items.map((item) => <tr key={item.id} className="hover:bg-[#EED9AE]/20"><td className="px-5 py-4 font-semibold">{displayName(item.name)}<span className="mt-0.5 block text-xs font-normal text-[#44301D]/50">{item.name?.[locale]}</span></td><td className="hidden px-5 py-4 text-[#44301D]/65 md:table-cell">/{item.url}</td><td className="hidden px-5 py-4 text-[#44301D]/65 sm:table-cell">{item.parent ? `${t('parent')}: ${displayName(item.parent.name)}` : item.category ? displayName(item.category.name) : item.profession || '—'}</td><td className="px-5 py-4 text-end"><div className="flex items-center justify-end gap-4">{canManage && <Link href={route(`admin.${resource}.edit`, item.id)} className="font-semibold text-[#747A3C]">{t('edit')}</Link>}{canManage && <button onClick={() => remove(item)} className="font-semibold text-red-700">{t('delete')}</button>}</div></td></tr>)}</tbody>
            </table>
            {!items.length && <div className="px-5 py-16 text-center text-sm text-[#44301D]/55">{t('noRecords')}</div>}
        </div>
    </AdminLayout>;
}
