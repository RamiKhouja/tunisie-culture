import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';

const icons = {
    events: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /><path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" /></>,
    organizations: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
    culturalItems: <><path d="M4 19.5V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v14.5" /><path d="M8 7h7M8 11h7M3 19.5h18" /></>,
};

function StatIcon({ name }) {
    return <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#EED9AE]/60 text-[#49351F]"><svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{icons[name]}</svg></span>;
}

function StatCard({ icon, label, value, detail, detailValue }) {
    return <article className="rounded-2xl border border-[#9B7847]/25 bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between gap-4"><div><p className="text-sm font-medium text-[#44301D]/60">{label}</p><p className="mt-2 text-4xl font-bold tracking-tight text-[#44301D]">{value.toLocaleString()}</p></div><StatIcon name={icon} /></div>
        <div className="mt-5 flex items-center justify-between border-t border-[#9B7847]/15 pt-3 text-sm"><span className="text-[#44301D]/55">{detail}</span><span className="font-semibold text-[#747A3C]">{detailValue.toLocaleString()}</span></div>
    </article>;
}

export default function Dashboard({ stats }) {
    return <AdminLayout header={<div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="mb-1 text-xs font-semibold uppercase tracking-[.18em] text-[#747A3C]">Admin workspace</p><h1 className="font-serif text-3xl font-bold text-[#44301D]">Dashboard overview</h1><p className="mt-1 text-sm text-[#44301D]/65">A quick look at the Athar archive.</p></div></div>}>
        <Head title="Dashboard" />
        <section className="grid gap-5 md:grid-cols-3" aria-label="Archive statistics">
            <StatCard icon="events" label="Events" value={stats.events.total} detail="Upcoming events" detailValue={stats.events.upcoming} />
            <StatCard icon="organizations" label="Organizations" value={stats.organizations.total} detail="Members" detailValue={stats.organizations.members} />
            <StatCard icon="culturalItems" label="Cultural items" value={stats.culturalItems} detail="In the archive" detailValue={stats.culturalItems} />
        </section>
    </AdminLayout>;
}
