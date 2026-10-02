<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $role = $request->query('role', 'organizer');
        abort_unless(in_array($role, ['admin', 'organizer'], true), 422);

        return Inertia::render('Admin/Users/Index', [
            'users' => User::with('organizations:id,name')
                ->where('role', $role)
                ->latest()
                ->paginate(20)
                ->withQueryString(),
            'selectedRole' => $role,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Users/Form', [
            'item' => null,
        ]);
    }

    public function store(Request $request)
    {
        $user = new User;
        $this->save($request, $user, true);

        return to_route('admin.users.index', [
            'role' => $user->role,
        ])->with('success', 'User created.');
    }

    public function edit(User $user)
    {
        return Inertia::render('Admin/Users/Form', ['item' => $user]);
    }

    public function update(Request $request, User $user)
    {
        $this->save($request, $user, false);

        return to_route('admin.users.index', [
            'role' => $user->role,
        ])->with('success', 'User updated.');
    }

    public function toggleStatus(Request $request, User $user)
    {
        abort_if(
            $request->user()->is($user),
            422,
            'You cannot disable your own account.',
        );
        $user->update(['is_active' => ! $user->is_active]);

        return back()->with('success', $user->is_active ? 'User activated.' : 'User disabled.');
    }

    public function destroy(Request $request, User $user)
    {
        abort_if(
            $request->user()->is($user),
            422,
            'You cannot delete your own account.',
        );
        $user->delete();

        return back()->with('success', 'User deleted.');
    }

    private function save(Request $request, User $user, bool $creating): void
    {
        $data = $request->validate([
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($user->id),
            ],
            'role' => ['required', Rule::in(['admin', 'organizer'])],
            'password' => [
                $creating ? 'required' : 'nullable',
                'string',
                'min:8',
                'confirmed',
            ],
            'is_active' => ['required', 'boolean'],
        ]);

        if (! empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        $data['name'] = trim($data['first_name'].' '.$data['last_name']);
        $user->fill($data)->save();
    }
}
