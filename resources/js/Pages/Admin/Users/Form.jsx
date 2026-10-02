import AdminLayout from '@/Layouts/AdminLayout';
import { Check, Errors, Field } from '@/Components/Admin/EntityFields';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Form({ item }) {
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

    const title = item ? 'Edit user' : 'Add user';

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
                        label="First name"
                        required
                        value={data.first_name}
                        onChange={(value) => setData('first_name', value)}
                    />
                    <Field
                        label="Last name"
                        required
                        value={data.last_name}
                        onChange={(value) => setData('last_name', value)}
                    />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                    <Field
                        label="Email"
                        type="email"
                        required
                        value={data.email}
                        onChange={(value) => setData('email', value)}
                    />
                </div>

                <label className="block text-sm font-semibold">
                    Role
                    <select
                        value={data.role}
                        onChange={(event) => setData('role', event.target.value)}
                        className="mt-1 w-full rounded-xl border-[#9B7847]/35 bg-white text-sm"
                    >
                        <option value="organizer">Organization member</option>
                        <option value="admin">Administrator</option>
                    </select>
                </label>

                <div className="grid gap-5 sm:grid-cols-2">
                    <Field
                        label={item ? 'New password (optional)' : 'Password'}
                        type="password"
                        required={!item}
                        value={data.password}
                        onChange={(value) => setData('password', value)}
                    />
                    <Field
                        label="Confirm password"
                        type="password"
                        required={!item}
                        value={data.password_confirmation}
                        onChange={(value) =>
                            setData('password_confirmation', value)
                        }
                    />
                </div>

                <Check
                    label="Active account"
                    value={data.is_active}
                    onChange={(value) => setData('is_active', value)}
                />

                <div className="flex justify-end gap-4">
                    <Link
                        href={route('admin.users.index')}
                        className="p-3"
                    >
                        Cancel
                    </Link>
                    <button
                        disabled={processing}
                        className="rounded-xl bg-[#49351F] px-6 py-3 text-white disabled:opacity-50"
                    >
                        {processing ? 'Saving…' : 'Save user'}
                    </button>
                </div>
            </form>
        </AdminLayout>
    );
}
