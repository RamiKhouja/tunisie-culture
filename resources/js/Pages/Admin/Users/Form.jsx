import AdminLayout from '@/Layouts/AdminLayout';
import { Check, Errors, Field } from '@/Components/Admin/EntityFields';
import { Head, Link, useForm } from '@inertiajs/react';
import { useLanguage } from '@/i18n';

export default function Form({ item }) {
    const { t } = useLanguage();
    const { data, setData, post, errors, processing } = useForm({
        first_name: item?.first_name || item?.name || '',
        last_name: item?.last_name || '',
        email: item?.email || '',
        role: item?.role || 'organizer',
        password: '',
        password_confirmation: '',
        is_active: item?.is_active ?? true,
        _method: item ? 'put' : 'post',
    });

    const title = item ? `${t('edit')} ${t('user').toLowerCase()}` : t('addUser');

    const submit = (event) => {
        event.preventDefault();
        post(
            route(
                item ? 'admin.users.update' : 'admin.users.store',
                item?.id,
            ),
        );
    };

    return (
        <AdminLayout
            header={<h1 className="font-serif text-3xl font-bold">{title}</h1>}
        >
            <Head title={title} />

            <form
                onSubmit={submit}
                className="mx-auto max-w-2xl space-y-6"
            >
                <Errors errors={errors} />

                <div className="grid gap-5 sm:grid-cols-2">
                    <Field
                        label={t('firstName')}
                        required
                        value={data.first_name}
                        onChange={(value) => setData('first_name', value)}
                    />
                    <Field
                        label={t('lastName')}
                        required
                        value={data.last_name}
                        onChange={(value) => setData('last_name', value)}
                    />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                    <Field
                        label={t('email')}
                        type="email"
                        required
                        value={data.email}
                        onChange={(value) => setData('email', value)}
                    />
                </div>

                <label className="block text-sm font-semibold">
                    {t('role')}
                    <select
                        value={data.role}
                        onChange={(event) => setData('role', event.target.value)}
                        className="mt-1 w-full rounded-xl border-[#9B7847]/35 bg-white text-sm"
                    >
                        <option value="organizer">{t('organizationMembers')}</option>
                        <option value="admin">{t('administrator')}</option>
                    </select>
                </label>

                <div className="grid gap-5 sm:grid-cols-2">
                    <Field
                        label={item ? `${t('password')} (${t('none').toLowerCase()})` : t('password')}
                        type="password"
                        required={!item}
                        value={data.password}
                        onChange={(value) => setData('password', value)}
                    />
                    <Field
                        label={t('confirmPassword')}
                        type="password"
                        required={!item}
                        value={data.password_confirmation}
                        onChange={(value) =>
                            setData('password_confirmation', value)
                        }
                    />
                </div>

                <Check
                    label={t('active')}
                    value={data.is_active}
                    onChange={(value) => setData('is_active', value)}
                />

                <div className="flex justify-end gap-4">
                    <Link
                        href={route('admin.users.index')}
                        className="p-3"
                    >
                        {t('cancel')}
                    </Link>
                    <button
                        disabled={processing}
                        className="rounded-xl bg-[#49351F] px-6 py-3 text-white disabled:opacity-50"
                    >
                        {processing ? t('saving') : `${t('save')} ${t('user').toLowerCase()}`}
                    </button>
                </div>
            </form>
        </AdminLayout>
    );
}
