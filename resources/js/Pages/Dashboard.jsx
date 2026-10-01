import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';

const stats = [
    { label: 'Cultural items', value: '1,248', change: '+24 this month', color: '#49351F', icon: '⌘' },
    { label: 'Heritage sites', value: '86', change: 'Across 24 regions', color: '#747A3C', icon: '⌖' },
    { label: 'Contributors', value: '312', change: '+8 this week', color: '#9B7847', icon: '♙' },
    { label: 'Pending reviews', value: '17', change: 'Needs attention', color: '#D5B66F', icon: '◷' },
];

const activity = [
    { title: 'Traditional pottery of Sejnane', meta: 'Added by Leila M. · 12 min ago', tag: 'New item', color: '#49351F' },
    { title: 'Medina of Tunis', meta: 'Location details updated · 1 hr ago', tag: 'Updated', color: '#747A3C' },
    { title: 'Malouf musical tradition', meta: 'Submitted for review · 3 hrs ago', tag: 'Review', color: '#9B7847' },
    { title: 'Kairouan carpet weaving', meta: 'New media uploaded · Yesterday', tag: 'Media', color: '#49351F' },
];

export default function Dashboard() {
    return (
        <AdminLayout header={<div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="mb-1 text-xs font-semibold uppercase tracking-[.18em] text-[#747A3C]">Admin workspace</p><h1 className="font-serif text-3xl font-bold text-[#44301D]">Welcome back</h1><p className="mt-1 text-sm text-[#44301D]/65">Here’s what is happening across the Athar archive.</p></div><button className="self-start rounded-xl bg-[#49351F] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#352617]">+ Add cultural item</button></div>}>
            <Head title="Dashboard" />

            
        </AdminLayout>
    );
}
