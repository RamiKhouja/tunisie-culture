import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';

const roles = [
    { value: 'organizer', label: 'Organization members' },
    { value: 'admin', label: 'Administrators' },
];

export default function Index({ users, selectedRole }) {
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
        if (confirm('Delete this user?')) {
            router.delete(route('admin.users.destroy', user.id));
        }
    };

    return (
        <AdminLayout
            header={
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                    <div>
                        <h1 className="font-serif text-3xl font-bold">
                            Manage users
                        </h1>
                        <p className="mt-1 text-sm text-[#44301D]/65">
                            Manage administrator and organization member access.
                        </p>
                    </div>
                    <Link
                        href={route('admin.users.create')}
                        className="rounded-xl bg-[#49351F] px-5 py-3 text-center text-sm font-semibold text-white"
                    >
                        Add user
                    </Link>
                </div>
            }
        >
            <Head title="Manage users" />

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
                <table className="w-full text-left text-sm">
                    <thead className="bg-stone-100">
                        <tr>
                            <th className="p-4">User</th>
                            <th>Organization</th>
                            <th>Email</th>
                            <th>Status</th>
                            <th className="p-4 text-right">Actions</th>
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
                                            ? 'Administrator'
                                            : 'Organization member'}
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
                                        {user.is_active ? 'Active' : 'Disabled'}
                                    </span>
                                </td>
                                <td className="space-x-3 p-4 text-right">
                                    <Link
                                        className="font-semibold"
                                        href={route('admin.users.edit', user.id)}
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        className="text-[#747A3C]"
                                        onClick={() => toggleStatus(user)}
                                    >
                                        {user.is_active ? 'Disable' : 'Activate'}
                                    </button>
                                    <button
                                        className="text-red-700"
                                        onClick={() => deleteUser(user)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {users.data.length === 0 && (
                    <p className="p-8 text-center">
                        No users in this group yet.
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
