import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';

const displayName = (name) => name?.en || name?.fr || name?.ar || 'Untitled';

export default function Index({ resource, title, items }) {
    const { auth } = usePage().props;
    const canManage = auth.user.role === 'admin';
    const remove = (item) => window.confirm(`Delete “${displayName(item.name)}”?`) && router.delete(route(`admin.${resource}.destroy`, item.id), { preserveScroll: true });
    return <AdminLayout header={<div className="flex items-end justify-between"><div><p className="text-xs font-semibold uppercase tracking-[.18em] text-[#747A3C]">Catalog</p><h1 className="font-serif text-3xl font-bold">{title}</h1></div><Link href={route(`admin.${resource}.create`)} className="rounded-xl bg-[#49351F] px-4 py-2.5 text-sm font-semibold text-white">+ Add new</Link></div>}>
        <Head title={title} />
        <div className="overflow-hidden rounded-2xl border border-[#9B7847]/25 bg-white shadow-sm">
            <table className="w-full text-left text-sm"><thead className="bg-[#EED9AE]/55 text-[11px] uppercase tracking-wider text-[#44301D]/60"><tr><th className="px-5 py-3">Name</th><th className="hidden px-5 py-3 md:table-cell">URL</th><th className="hidden px-5 py-3 sm:table-cell">Relation / title</th><th className="px-5 py-3 text-right">Actions</th></tr></thead>
            <tbody className="divide-y divide-[#9B7847]/15">{items.map((item) => <tr key={item.id} className="hover:bg-[#EED9AE]/20"><td className="px-5 py-4 font-semibold">{displayName(item.name)}<span className="mt-0.5 block text-xs font-normal text-[#44301D]/50">{item.name?.ar}</span></td><td className="hidden px-5 py-4 text-[#44301D]/65 md:table-cell">/{item.url}</td><td className="hidden px-5 py-4 text-[#44301D]/65 sm:table-cell">{item.parent ? `Parent: ${displayName(item.parent.name)}` : item.category ? displayName(item.category.name) : item.profession || '—'}</td><td className="px-5 py-4 text-right">{canManage && <Link href={route(`admin.${resource}.edit`, item.id)} className="mr-3 font-semibold text-[#747A3C]">Edit</Link>}{canManage && <button onClick={() => remove(item)} className="font-semibold text-red-700">Delete</button>} </td></tr>)}</tbody>
            </table>
            {!items.length && <div className="px-5 py-16 text-center text-sm text-[#44301D]/55">No records yet. Add the first one to begin.</div>}
        </div>
    </AdminLayout>;
}
