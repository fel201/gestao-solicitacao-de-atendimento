<?php

use App\Http\Controllers\DocumentationController;
use Illuminate\Support\Facades\Route;

Route::prefix('api/v1')->group(function () {
    Route::get('/', function () {
        return response()->json(['message' => 'Solicitação de Atendimento API']);
    });

    Route::get('/docs', [DocumentationController::class, 'index'])
        ->withoutMiddleware('web')
        ->name('docs.index');
    Route::get('/docs/openapi.yaml', [DocumentationController::class, 'specification'])
        ->withoutMiddleware('web')
        ->name('docs.openapi');
});
