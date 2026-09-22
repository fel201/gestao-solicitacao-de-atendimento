<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        //
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*') || $request->expectsJson(),
        );

        $exceptions->render(function (\Throwable $exception, Request $request) {
            if (!$request->is('api/*') && !$request->expectsJson()) {
                return null;
            }

            // Validation errors contain only the public field messages defined
            // by the application and can keep Laravel's standard structure.
            if ($exception instanceof ValidationException) {
                return null;
            }

            if ($exception instanceof HttpExceptionInterface) {
                $status = $exception->getStatusCode();
                $messages = [
                    401 => 'É necessário autenticar-se para realizar esta operação.',
                    403 => 'Você não tem permissão para realizar esta operação.',
                    404 => 'O recurso solicitado não foi encontrado.',
                    405 => 'Método não permitido para esta rota.',
                    429 => 'Muitas tentativas. Aguarde um momento e tente novamente.',
                ];

                return response()->json([
                    'message' => $messages[$status] ?? 'Não foi possível concluir a operação.',
                    'code' => 'HTTP_ERROR',
                ], $status);
            }

            if ($exception instanceof QueryException) {
                return response()->json([
                    'message' => 'O serviço está temporariamente indisponível. Tente novamente em instantes.',
                    'code' => 'DATABASE_UNAVAILABLE',
                ], 503);
            }

            return response()->json([
                'message' => 'Não foi possível concluir a operação. Tente novamente.',
                'code' => 'INTERNAL_SERVER_ERROR',
            ], 500);
        });
    })->create();
