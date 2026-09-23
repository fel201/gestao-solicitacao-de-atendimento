<?php

use App\Http\Controllers\AppointmentController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::get('/health', function () {
        DB::select('SELECT 1');

        return response()->json(['status' => 'ok']);
    });
    Route::get('/solicitacoes', [AppointmentController::class, 'index']);
    Route::get('/solicitacoes/resumo', [AppointmentController::class, 'summary']);
    Route::get('/solicitacoes/{id}', [AppointmentController::class, 'show']);
    Route::post('/solicitacoes', [AppointmentController::class, 'store']);
    Route::patch('/solicitacoes/{id}/status', [AppointmentController::class, 'updateStatus']);
});

Route::fallback(fn (Request $request) => response()->json([
    'message' => 'Rota não encontrada.',
], 404));
