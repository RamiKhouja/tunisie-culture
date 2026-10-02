import AdminLayout from '@/Layouts/AdminLayout';
import TranslatableFields from '@/Components/Admin/TranslatableFields';
import { Check, Errors, Field, Select, Upload, links } from '@/Components/Admin/EntityFields';
import { Head, Link, useForm } from '@inertiajs/react';
import { useLanguage } from '@/i18n';

const translations = value => typeof value === 'object' && value !== null ? value : { en: value || '', fr: '', ar: '' };

export default function Form({ item, locations, users }) {
    const { locale, t } = useLanguage();
    const { data, setData, post, errors, processing } = useForm({
        name: item?.name || { en: '', fr: '', ar: '' }, logo: null,
        ...Object.fromEntries(['mf', 'email', 'phone', 'state_id', 'city', 'address', 'zip_code', ...links].map(key => [key, item?.[key] || ''])), description: translations(item?.description),
        show_phone: item?.show_phone ?? false, show_email: item?.show_email ?? false, is_active: item?.is_active ?? true,
        users: item?.users?.map(user => ({ user_id: user.id, role: user.pivot.role, show_user: Boolean(user.pivot.show_user) })) || [], _method: item ? 'put' : 'post',
    });
    const title = item ? `${t('edit')} ${t('organization').toLowerCase()}` : t('addNewOrganization');
    const changeMember = (index, key, value) => setData('users', data.users.map((user, i) => i === index ? { ...user, [key]: value } : user));
    return <AdminLayout header={<h1 className="font-serif text-3xl font-bold">{title}</h1>}><Head title={title}/>
        <form className="mx-auto max-w-5xl space-y-6" onSubmit={e => { e.preventDefault(); post(route(item ? 'admin.organizations.update' : 'admin.organizations.store', item?.id), { forceFormData: true }); }}>
            <Errors errors={errors}/><TranslatableFields field="name" label={t('name')} value={data.name} onChange={v => setData('name', v)} required/>
            <div className="grid gap-5 sm:grid-cols-2"><Upload label={t('organizationLogo')} current={item?.logo} onChange={v => setData('logo', v)}/><Field label={t('organizationMf')} value={data.mf} onChange={v => setData('mf', v)}/></div>
            <TranslatableFields field="description" label={t('description')} value={data.description} onChange={v => setData('description', v)} multiline required/>
            <div className="grid gap-5 sm:grid-cols-2"><Field label={t('phone')} required value={data.phone} onChange={v => setData('phone', v)}/><Field label={t('emailOptional')} type="email" value={data.email} onChange={v => setData('email', v)}/><Check label={t('showPhonePublicly')} value={data.show_phone} onChange={v => setData('show_phone', v)}/><Check label={t('showEmailPublicly')} value={data.show_email} onChange={v => setData('show_email', v)}/></div>
            <div className="grid gap-5 sm:grid-cols-2"><Select label="State" value={data.state_id} options={locations} onChange={v => setData('state_id', v)}/>{['city', 'address', 'zip_code'].map(key => <Field key={key} label={key.replace('_', ' ')} required={key !== 'zip_code'} value={data[key]} onChange={v => setData(key, v)}/>)}</div>
            <div className="grid gap-5 sm:grid-cols-2">{links.map(key => <Field key={key} label={`${key} (optional)`} type="url" value={data[key]} onChange={v => setData(key, v)}/>)}</div>
            <Check label={t('activeOrganization')} value={data.is_active} onChange={v => setData('is_active', v)}/>
            <section className="space-y-3 rounded-xl border p-4"><h2 className="font-serif text-xl font-bold">Members</h2>{data.users.map((user, index) => <div key={index} className="grid items-end gap-3 rounded border p-3 sm:grid-cols-4"><Select label="User" options={users.map(u => ({ ...u, name: { en: u.name } }))} value={user.user_id} onChange={v => changeMember(index, 'user_id', v)}/><Field label="Role in organization" required value={user.role} onChange={v => changeMember(index, 'role', v)}/><Check label="Show publicly" value={user.show_user} onChange={v => changeMember(index, 'show_user', v)}/><button type="button" className="p-2 text-red-700" onClick={() => setData('users', data.users.filter((_, i) => i !== index))}>Remove member</button></div>)}<button type="button" className="rounded border px-4 py-2" onClick={() => setData('users', [...data.users, { user_id: '', role: '', show_user: false }])}>Add member</button></section>
            <div className="flex justify-end gap-4"><Link href={route('admin.organizations.index')} className="p-3">{t('cancel')}</Link><button disabled={processing} className="rounded-xl bg-[#49351F] px-6 py-3 text-white disabled:opacity-50">{processing ? t('saving') : `${t('save')} ${t('organization').toLowerCase()}`}</button></div>
        </form>
    </AdminLayout>;
}
