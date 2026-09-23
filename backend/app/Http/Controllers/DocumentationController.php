<?php

namespace App\Http\Controllers;

use Illuminate\Contracts\View\View;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class DocumentationController extends Controller
{
    public function index(): View
    {
        return view('documentation');
    }

    public function specification(): BinaryFileResponse
    {
        $specificationPath = base_path('docs/openapi.yaml');

        abort_unless(
            is_file($specificationPath),
            404,
            'A especificação OpenAPI não está disponível.',
        );

        return response()->file($specificationPath, [
            'Content-Type' => 'application/yaml; charset=UTF-8',
            'Cache-Control' => 'no-store',
        ]);
    }
}
