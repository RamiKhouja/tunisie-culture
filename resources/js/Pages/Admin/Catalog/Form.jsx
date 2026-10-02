import File from '@/Components/Admin/FileUpload';
import TranslatableFields from '@/Components/Admin/TranslatableFields';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { useLanguage } from '@/i18n';

const slugify = (text) => text?.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || '';

export default function Form({ resource, title, item, options = {} }) {
    const isArtist = resource === 'artists';
    const { locale, t } = useLanguage();
    const displayName = (name) => name?.[locale] || name?.en || name?.fr || name?.ar || t('none');
    const dataForm = useForm({ color: item?.color || '#8f3527', name: item?.name || { en:'',fr:'',ar:'' }, url: item?.url || '', description: item?.description || { en:'',fr:'',ar:'' }, main_image: null, icon: null, picture: null, parent_id: item?.parent_id || '', category_id: item?.category_id || '', profession: item?.profession || '', _method: item ? 'put' : 'post' });
    const { data, setData, post, processing, errors } = dataForm;
    const [urlEdited, setUrlEdited] = useState(Boolean(item?.url));
    const changeName = (value) => { setData((current) => ({ ...current, name: value, url: urlEdited ? current.url : slugify(value.en || value.fr) })); };
    const submit = (e) => { e.preventDefault(); post(item ? route(`admin.${resource}.update`,item.id) : route(`admin.${resource}.store`), { forceFormData:true }); };
    const selectOptions = resource === 'categories' ? options.parents : options.categories;
    const catalogTitle = resource === 'categories' ? t('categories') : resource === 'types' ? t('types') : t('artistsPeople');
    return <AdminLayout header={<div><p className="text-xs font-semibold uppercase tracking-[.18em] text-[#747A3C]">{t('catalogEditor')}</p><h1 className="font-serif text-3xl font-bold">{title.replace(/New category|Edit category|New type|Edit type|New artist or person|Edit artist or person/, catalogTitle)}</h1></div>}>
        <Head title={title}/><form onSubmit={submit} className="mx-auto max-w-5xl space-y-6">
            <section className="space-y-6 rounded-2xl border border-[#9B7847]/25 bg-[#EED9AE]/20 p-5 sm:p-7">
                {resource === 'categories' && <label className="block text-sm font-semibold">{t('mapPointColor')}<input type="color" value={data.color} onChange={e => setData('color', e.target.value)} className="mt-2 block h-12 w-24"/>{errors.color && <span className="text-red-700">{errors.color}</span>}</label>}
                <TranslatableFields label={t('name')} value={data.name} onChange={changeName} errors={errors} required />
                <label className="block"><span className="mb-1 block text-sm font-semibold">{t('urlSlug')}</span><input value={data.url} onChange={(e)=>{setUrlEdited(true);setData('url',slugify(e.target.value));}} className="w-full rounded-xl border-[#9B7847]/35" placeholder={t('urlSlug')}/>{errors.url && <span className="text-xs text-red-700">{errors.url}</span>}</label>
                {isArtist && <label className="block"><span className="mb-1 block text-sm font-semibold">{t('professionTitle')}</span><input value={data.profession} onChange={(e)=>setData('profession',e.target.value)} className="w-full rounded-xl border-[#9B7847]/35"/></label>}
                <TranslatableFields label={t('description')} value={data.description} onChange={(v)=>setData('description',v)} errors={errors} multiline />
                {!isArtist && <label className="block"><span className="mb-1 block text-sm font-semibold">{resource === 'categories' ? `${t('parent')} ${t('category').toLowerCase()}` : t('category')}</span><select value={resource === 'categories' ? data.parent_id : data.category_id} onChange={(e)=>setData(resource === 'categories' ? 'parent_id':'category_id',e.target.value)} className="w-full rounded-xl border-[#9B7847]/35"><option value="">{t('none')}</option>{selectOptions?.map((option)=><option key={option.id} value={option.id}>{displayName(option.name)}</option>)}</select></label>}
                <div className="grid gap-5 sm:grid-cols-2">{isArtist ? <File label={t('portrait')} accept="image/*" onChange={(f)=>setData('picture',f)} error={errors.picture} current={item?.picture}/> : <><File label={t('mainImage')} accept="image/*" onChange={(f)=>setData('main_image',f)} error={errors.main_image} current={item?.main_image}/><File label={t('icon')} accept="image/*" onChange={(f)=>setData('icon',f)} error={errors.icon} current={item?.icon}/></>}</div>
            </section>
            <div className="flex justify-end gap-3"><Link href={route(`admin.${resource}.index`)} className="rounded-xl border border-[#9B7847]/40 px-5 py-2.5 text-sm font-semibold">{t('cancel')}</Link><button disabled={processing} className="rounded-xl bg-[#49351F] px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-50">{processing?t('saving'):t('save')}</button></div>
        </form>
    </AdminLayout>;
}
