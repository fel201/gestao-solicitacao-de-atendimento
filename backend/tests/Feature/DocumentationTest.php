<?php

namespace Tests\Feature;

use Tests\TestCase;

class DocumentationTest extends TestCase
{
    public function test_displays_the_swagger_ui_page(): void
    {
        $this->get('/docs')
            ->assertOk()
            ->assertSee('SwaggerUIBundle')
            ->assertSee('docs\\/openapi.yaml', false);
    }

    public function test_serves_the_openapi_specification(): void
    {
        $this->get('/docs/openapi.yaml')
            ->assertOk()
            ->assertHeader('Content-Type', 'application/yaml; charset=UTF-8')
            ->assertSee('openapi: 3.0.3');
    }
}
