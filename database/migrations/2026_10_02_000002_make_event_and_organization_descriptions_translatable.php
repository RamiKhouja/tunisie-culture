<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        foreach ([['events', ['short_description', 'description']], ['organizations', ['description']]] as [$table, $columns]) {
            foreach (DB::table($table)->get() as $row) {
                $updates = [];
                foreach ($columns as $column) {
                    $value = $row->{$column};
                    $decoded = is_string($value) ? json_decode($value, true) : null;
                    $updates[$column] = is_array($decoded) ? $value : json_encode(['en' => $value ?: ''], JSON_UNESCAPED_UNICODE);
                }
                DB::table($table)->where('id', $row->id)->update($updates);
            }
        }
    }

    public function down(): void
    {
        foreach ([['events', ['short_description', 'description']], ['organizations', ['description']]] as [$table, $columns]) {
            foreach (DB::table($table)->get() as $row) {
                $updates = [];
                foreach ($columns as $column) {
                    $decoded = json_decode($row->{$column}, true);
                    $updates[$column] = is_array($decoded) ? ($decoded['en'] ?? reset($decoded) ?: '') : $row->{$column};
                }
                DB::table($table)->where('id', $row->id)->update($updates);
            }
        }
    }
};
