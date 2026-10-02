import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useLanguage } from '@/i18n';

export default function Index({ users, selectedRole }) {
    const { t, locale, dir } = useLanguage();
    const roles = [{ value: 'organizer', label: t('organizationMembers') }, { value: 'admin', label: t('administrators') }];
    const filter = (role) => {
        router.get(
            route('admin.users.index'),
            { role },
            { preserveState: true, replace: true },
        );
    };

    const toggleStatus = (user) => {
        router.patch(
            route('admin.users.toggle-status', user.id),
            {},
            { preserveScroll: true },
        );
    };

    const deleteUser = (user) => {
        if (confirm(t('deleteUserConfirm'))) {
            router.delete(route('admin.users.destroy', user.id));
        }
    };

    return (
        <AdminLayout
            header={
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                    <div>
                        <h1 className="font-serif text-3xl font-bold">
                            {t('manageUsers')}
                        </h1>
                        <p className="mt-1 text-sm text-[#44301D]/65">
                            {t('manageUsersHelp')}
                        </p>
                    </div>
                    <Link
                        href={route('admin.users.create')}
                        className="rounded-xl bg-[#49351F] px-5 py-3 text-center text-sm font-semibold text-white"
                    >
                        {t('addUser')}
                    </Link>
                </div>
            }
        >
            <Head title={t('manageUsers')} />

            <div
                className="mb-5 flex w-fit mx-auto flex-wrap gap-2 rounded-xl border border-[#9B7847]/30 bg-[#EED9AE]/25 p-2"
                aria-label="Filter users by role"
            >
                {roles.map((role) => (
                    <button
                        key={role.value}
                        type="button"
                        onClick={() => filter(role.value)}
                        className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                            selectedRole === role.value
                                ? 'bg-[#49351F] text-white'
                                : 'text-[#44301D]/70 hover:bg-white/70'
                        }`}
                    >
                        {role.label}
                    </button>
                ))}
            </div>

            <div className="overflow-x-auto rounded-xl border border-[#9B7847]/30">
                <table dir={dir} className="w-full text-start text-sm">
                    <thead className="bg-stone-100">
                        <tr>
                            <th className={`p-4 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t('user')}</th>
                            <th className={dir === 'rtl' ? 'text-right' : 'text-left'}>{t('organization')}</th>
                            <th className={dir === 'rtl' ? 'text-right' : 'text-left'}>{t('email')}</th>
                            <th className={dir === 'rtl' ? 'text-right' : 'text-left'}>{t('status')}</th>
                            <th className="p-4 text-end">{t('actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.data.map((user) => (
                            <tr
                                key={user.id}
                                className="border-t border-[#9B7847]/20"
                            >
                                <td className="p-4">
                                    <div className="font-semibold">{user.name}</div>
                                    <div className="text-xs text-[#44301D]/55">
                                        {user.role === 'admin'
                                            ? t('administrator')
                                            : t('organizationMembers')}
                                    </div>
                                </td>
                                <td>
                                    {user.organizations?.[0] ? (
                                        <Link
                                            href={route(
                                                'admin.organizations.edit',
                                                user.organizations[0].id,
                                            )}
                                            className="font-semibold text-[#747A3C] hover:underline"
                                        >
                                            {user.organizations[0].name?.en ||
                                                user.organizations[0].name?.fr ||
                                                user.organizations[0].name?.ar}
                                        </Link>
                                    ) : (
                                        <span className="text-[#44301D]/45">—</span>
                                    )}
                                </td>
                                <td>{user.email}</td>
                                <td>
                                    <span
                                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                                            user.is_active
                                                ? 'bg-[#747A3C]/15 text-[#52602f]'
                                                : 'bg-red-50 text-red-700'
                                        }`}
                                    >
                                        {user.is_active ? t('active') : t('disabled')}
                                    </span>
                                </td>
                                <td className="p-4 text-end">
                                    <div className="flex items-center justify-end gap-4">
                                    <Link
                                        className="font-semibold"
                                        href={route('admin.users.edit', user.id)}
                                    >
                                        {t('edit')}
                                    </Link>
                                    <button
                                        className="text-[#747A3C]"
                                        onClick={() => toggleStatus(user)}
                                    >
                                        {user.is_active ? t('disable') : t('activate')}
                                    </button>
                                    <button
                                        className="text-red-700"
                                        onClick={() => deleteUser(user)}
                                    >
                                        {t('delete')}
                                    </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {users.data.length === 0 && (
                    <p className="p-8 text-center">
                    {t('noUsers')}
                    </p>
                )}
            </div>

            {users.links?.length > 3 && (
                <div className="mt-5 flex flex-wrap gap-2">
                    {users.links.map((link, index) =>
                        link.url ? (
                            <Link
                                key={index}
                                href={link.url}
                                preserveScroll
                                className={`rounded-lg border px-3 py-1.5 text-sm ${
                                    link.active
                                        ? 'bg-[#49351F] text-white'
                                        : ''
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ) : (
                            <span
                                key={index}
                                className="px-3 py-1.5 text-sm text-gray-400"
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ),
                    )}
                </div>
            )}
        </AdminLayout>
    );
}
