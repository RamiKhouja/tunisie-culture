<?php

use App\Http\Controllers\Admin\ArtistController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\CulturalItemController;
use App\Http\Controllers\Admin\EventController;
use App\Http\Controllers\Admin\LocationController;
use App\Http\Controllers\Admin\OrganizationController;
use App\Http\Controllers\Admin\TypeController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\MapController;
use App\Http\Controllers\ProfileController;
use App\Models\CulturalItem;
use App\Models\Event;
use App\Models\Organization;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', MapController::class);

Route::get('/pictures/tunisia-map.png', function () {
    return response()->file(storage_path('app/pictures/tunisia-map.png'));
});

Route::get('/admin', function () {
    if (request()->user()->role === 'organizer') {
        return redirect()->route('admin.events.create');
    }

    $today = now('Africa/Tunis')->toDateString();

    return Inertia::render('Dashboard', [
        'stats' => [
            'events' => [
                'total' => Event::count(),
                'upcoming' => Event::whereHas('eventDates', fn ($query) => $query->whereDate('date', '>=', $today))->count(),
            ],
            'organizations' => [
                'total' => Organization::count(),
                'members' => DB::table('organization_user')->distinct()->count('user_id'),
            ],
            'culturalItems' => CulturalItem::count(),
        ],
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
    Route::resource('organizations', OrganizationController::class)->except('show');
    Route::resource('events', EventController::class)->except('show');
    Route::resource('categories', CategoryController::class)->except('show');
    Route::resource('types', TypeController::class)->except('show')->middleware('role:admin');
    Route::resource('artists', ArtistController::class)->except('show')->middleware('role:admin');
    Route::resource('locations', LocationController::class)->only(['index', 'store', 'update', 'destroy'])->middleware('role:admin');
    Route::resource('cultural-items', CulturalItemController::class)->except('show')->middleware('role:admin');
    Route::resource('users', UserController::class)->except('show')->middleware('role:admin');
    Route::patch('users/{user}/toggle-status', [UserController::class, 'toggleStatus'])->name('users.toggle-status')->middleware('role:admin');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
