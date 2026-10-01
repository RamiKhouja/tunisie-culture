import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { nameOf } from './EntityFields';

export default function EntityIndex({ items, resource, title }) {
    return <AdminLayout header={<div className="flex items-center justify-between"><h1 className="font-serif text-3xl font-bold">{title}</h1><Link className="rounded-xl bg-[#49351F] px-5 py-3 text-white" href={route(`admin.${resource}.create`)}>Create {resource === 'events' ? 'event' : 'organization'}</Link></div>}>
        <Head title={title}/><div className="overflow-x-auto rounded-xl border"><table className="w-full text-left text-sm"><thead className="bg-stone-100"><tr><th className="p-4">Name</th><th>Details</th><th className="p-4 text-right">Actions</th></tr></thead><tbody>{items.data.map(item => <tr key={item.id} className="border-t"><td className="p-4 font-semibold">{nameOf(item.name)}</td><td>{resource === 'events' ? `${nameOf(item.organization?.name)} · ${item.event_dates?.[0]?.date || ''}` : `${item.is_active ? 'Active' : 'Inactive'} · ${item.events_count} events`}</td><td className="space-x-4 p-4 text-right"><Link href={route(`admin.${resource}.edit`, item.id)}>Edit</Link><button className="text-red-700" onClick={() => { if (confirm(resource === 'organizations' ? 'Delete this organization and all its events?' : 'Delete this event?')) router.delete(route(`admin.${resource}.destroy`, item.id)); }}>Delete</button></td></tr>)}</tbody></table>{items.data.length === 0 && <p className="p-8 text-center">No {resource} yet.</p>}</div>
        <div className="mt-4 flex gap-2">{items.links.map((link, index) => link.url ? <Link key={index} href={link.url} className={`rounded border px-3 py-2 ${link.active ? 'bg-stone-200' : ''}`} dangerouslySetInnerHTML={{ __html: link.label }}/> : null)}</div>
    </AdminLayout>;
}
