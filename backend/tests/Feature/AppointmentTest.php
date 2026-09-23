<?php

namespace Tests\Feature;

use App\Models\Appointment;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use Tests\TestCase;

class AppointmentTest extends TestCase
{
    use RefreshDatabase;

    public function test_health_check_returns_ok(): void
    {
        $this->getJson('/api/v1/health')
            ->assertOk()
            ->assertExactJson(['status' => 'ok']);
    }

    public function test_creation_ignores_client_status_and_uses_received_status(): void
    {
        $payload = [
            'nome_solicitante' => 'Maria da Silva',
            'categoria' => 'CONSULTA',
            'prioridade' => 'MEDIA',
            'descricao' => 'Preciso de uma consulta de rotina.',
            'status' => 'CONCLUIDA',
        ];

        $response = $this->postJson('/api/v1/solicitacoes', $payload);

        $response->assertCreated()
            ->assertJsonPath('nome_solicitante', $payload['nome_solicitante'])
            ->assertJsonPath('status', 'RECEBIDA')
            ->assertJsonPath('prioridade', 'MEDIA')
            ->assertJsonPath('protocolo', fn (string $protocol) => (bool) preg_match('/^APT-[A-Z0-9]{10}$/', $protocol));

        $this->assertDatabaseHas('atendimentos', [
            'nome_solicitante' => $payload['nome_solicitante'],
            'categoria' => 'CONSULTA',
            'prioridade' => 'MEDIA',
            'status' => 'RECEBIDA',
        ]);
    }

    public function test_requires_a_priority_justification_for_an_urgent_appointment(): void
    {
        $this->postJson('/api/v1/solicitacoes', [
            'nome_solicitante' => 'João Souza',
            'categoria' => 'EXAME',
            'prioridade' => 'URGENTE',
            'descricao' => 'Preciso realizar um exame.',
        ])->assertUnprocessable()
            ->assertJsonValidationErrors('justificativa_prioridade');
    }

    public function test_creates_an_urgent_appointment_when_its_justification_is_informed(): void
    {
        $this->postJson('/api/v1/solicitacoes', [
            'nome_solicitante' => 'Carla Santos',
            'categoria' => 'EXAME',
            'prioridade' => 'URGENTE',
            'descricao' => 'Preciso realizar um exame com rapidez.',
            'justificativa_prioridade' => 'Há risco clínico identificado.',
        ])->assertCreated()
            ->assertJsonPath('prioridade', 'URGENTE')
            ->assertJsonPath('justificativa_prioridade', 'Há risco clínico identificado.');
    }

    public function test_validates_required_and_enumerated_creation_fields(): void
    {
        $this->postJson('/api/v1/solicitacoes', [
            'nome_solicitante' => '',
            'categoria' => 'INEXISTENTE',
            'prioridade' => 'CRITICA',
            'descricao' => '',
        ])->assertUnprocessable()
            ->assertJsonValidationErrors([
                'nome_solicitante',
                'categoria',
                'prioridade',
                'descricao',
            ]);
    }

    public function test_accepts_a_255_character_name_and_rejects_a_longer_name(): void
    {
        $payload = [
            'nome_solicitante' => str_repeat('A', 255),
            'categoria' => 'CONSULTA',
            'prioridade' => 'MEDIA',
            'descricao' => 'Solicitação fictícia.',
        ];

        $this->postJson('/api/v1/solicitacoes', $payload)
            ->assertCreated()
            ->assertJsonPath('nome_solicitante', $payload['nome_solicitante']);

        $payload['nome_solicitante'] .= 'B';

        $this->postJson('/api/v1/solicitacoes', $payload)
            ->assertUnprocessable()
            ->assertJsonValidationErrors('nome_solicitante')
            ->assertJsonPath('errors.nome_solicitante.0', 'O nome do solicitante deve ter no máximo 255 caracteres.');

        $this->assertDatabaseCount('atendimentos', 1);
    }

    public function test_rejects_non_text_creation_fields_before_persistence(): void
    {
        $this->postJson('/api/v1/solicitacoes', [
            'nome_solicitante' => ['nome' => 'Pessoa Fictícia'],
            'categoria' => 'CONSULTA',
            'prioridade' => 'URGENTE',
            'descricao' => ['texto' => 'Solicitação fictícia.'],
            'justificativa_prioridade' => ['texto' => 'Urgência fictícia.'],
        ])->assertUnprocessable()
            ->assertJsonValidationErrors([
                'nome_solicitante',
                'descricao',
                'justificativa_prioridade',
            ])
            ->assertJsonPath('errors.nome_solicitante.0', 'O nome do solicitante deve ser um texto.')
            ->assertJsonPath('errors.descricao.0', 'A descrição deve ser um texto.')
            ->assertJsonPath('errors.justificativa_prioridade.0', 'A justificativa da prioridade deve ser um texto.');

        $this->assertDatabaseCount('atendimentos', 0);
    }

    public function test_rejects_a_non_text_optional_justification(): void
    {
        $this->postJson('/api/v1/solicitacoes', [
            'nome_solicitante' => 'Pessoa Fictícia',
            'categoria' => 'CONSULTA',
            'prioridade' => 'MEDIA',
            'descricao' => 'Solicitação fictícia.',
            'justificativa_prioridade' => ['texto' => 'Justificativa inválida.'],
        ])->assertUnprocessable()
            ->assertJsonValidationErrors('justificativa_prioridade');

        $this->assertDatabaseCount('atendimentos', 0);
    }

    public function test_does_not_expose_database_details_when_persistence_fails(): void
    {
        config(['app.debug' => true]);
        Schema::drop('atendimentos');

        $response = $this->postJson('/api/v1/solicitacoes', [
            'nome_solicitante' => 'Pessoa Fictícia',
            'categoria' => 'CONSULTA',
            'prioridade' => 'MEDIA',
            'descricao' => 'Solicitação para testar uma falha de persistência.',
        ]);

        $response->assertStatus(503)
            ->assertExactJson([
                'message' => 'O serviço está temporariamente indisponível. Tente novamente em instantes.',
                'code' => 'DATABASE_UNAVAILABLE',
            ]);

        $content = strtolower($response->getContent());
        $this->assertStringNotContainsString('sqlstate', $content);
        $this->assertStringNotContainsString('atendimentos', $content);
        $this->assertStringNotContainsString('insert into', $content);
    }

    public function test_lists_full_appointment_data_and_applies_filters(): void
    {
        $matching = $this->createAppointment([
            'nome_solicitante' => 'Ana Costa',
            'categoria' => 'CONSULTA',
            'prioridade' => 'ALTA',
            'status' => 'RECEBIDA',
        ]);
        $this->createAppointment([
            'nome_solicitante' => 'Bruno Lima',
            'categoria' => 'EXAME',
            'prioridade' => 'BAIXA',
            'status' => 'EM_ANALISE',
        ]);

        $this->getJson('/api/v1/solicitacoes?status=RECEBIDA&categoria=CONSULTA&prioridade=ALTA')
            ->assertOk()
            ->assertJsonPath('total', 1)
            ->assertJsonPath('pagina_atual', 1)
            ->assertJsonPath('ultima_pagina', 1)
            ->assertJsonPath('itens_por_pagina', 15)
            ->assertJsonPath('dados.0.id', $matching->id)
            ->assertJsonPath('dados.0.descricao', $matching->descricao)
            ->assertJsonStructure([
                'dados' => [[
                    'id',
                    'protocolo',
                    'nome_solicitante',
                    'categoria',
                    'prioridade',
                    'status',
                    'descricao',
                    'justificativa_prioridade',
                    'data_criacao',
                    'data_atualizacao',
                ]],
            ]);
    }

    public function test_paginates_with_portuguese_fields_and_query_parameter(): void
    {
        for ($index = 0; $index < 16; $index++) {
            $this->createAppointment();
        }

        $response = $this->getJson('/api/v1/solicitacoes?pagina=2');

        $response
            ->assertOk()
            ->assertJsonCount(1, 'dados')
            ->assertJsonPath('pagina_atual', 2)
            ->assertJsonPath('ultima_pagina', 2)
            ->assertJsonPath('itens_por_pagina', 15)
            ->assertJsonPath('total', 16);

        $this->assertSame([
            'dados',
            'pagina_atual',
            'ultima_pagina',
            'itens_por_pagina',
            'total',
        ], array_keys($response->json()));
    }

    public function test_returns_a_summary_for_all_appointments_matching_the_filters(): void
    {
        $this->createAppointment(['categoria' => 'CONSULTA', 'status' => 'RECEBIDA']);
        $this->createAppointment(['categoria' => 'CONSULTA', 'status' => 'EM_ANALISE']);
        $this->createAppointment(['categoria' => 'EXAME', 'status' => 'RECEBIDA']);

        $this->getJson('/api/v1/solicitacoes/resumo?categoria=CONSULTA')
            ->assertOk()
            ->assertExactJson([
                ['status' => 'EM_ANALISE', 'total' => 1],
                ['status' => 'RECEBIDA', 'total' => 1],
            ]);
    }

    public function test_shows_an_appointment_by_id_and_returns_not_found_for_an_unknown_id(): void
    {
        $appointment = $this->createAppointment();

        $this->getJson("/api/v1/solicitacoes/{$appointment->id}")
            ->assertOk()
            ->assertJsonPath('id', $appointment->id)
            ->assertJsonPath('justificativa_prioridade', $appointment->justificativa_prioridade);

        $this->getJson('/api/v1/solicitacoes/99999')
            ->assertNotFound()
            ->assertExactJson([
                'message' => 'O recurso solicitado não foi encontrado.',
                'code' => 'HTTP_ERROR',
            ]);
    }

    public function test_allows_only_the_next_status_in_the_defined_flow(): void
    {
        $appointment = $this->createAppointment(['status' => 'RECEBIDA']);

        $this->patchJson("/api/v1/solicitacoes/{$appointment->id}/status", [
            'status' => 'EM_ANALISE',
        ])->assertOk()
            ->assertJsonPath('status', 'EM_ANALISE');

        $this->assertDatabaseHas('atendimentos', [
            'id' => $appointment->id,
            'status' => 'EM_ANALISE',
        ]);
    }

    public function test_rejects_an_invalid_status_transition_or_a_repeated_status(): void
    {
        $appointment = $this->createAppointment(['status' => 'RECEBIDA']);

        $this->patchJson("/api/v1/solicitacoes/{$appointment->id}/status", [
            'status' => 'CONCLUIDA',
        ])->assertUnprocessable()
            ->assertJsonPath('message', 'Transição de status inválida.');

        $this->patchJson("/api/v1/solicitacoes/{$appointment->id}/status", [
            'status' => 'RECEBIDA',
        ])->assertUnprocessable()
            ->assertJsonPath('message', 'Transição de status inválida.');
    }

    public function test_rejects_status_updates_for_terminal_appointments_and_invalid_statuses(): void
    {
        $appointment = $this->createAppointment(['status' => 'CONCLUIDA']);

        $this->patchJson("/api/v1/solicitacoes/{$appointment->id}/status", [
            'status' => 'CANCELADA',
        ])->assertUnprocessable()
            ->assertJsonPath('message', 'Atendimento finalizado não pode ter status alterado.');

        $this->patchJson("/api/v1/solicitacoes/{$appointment->id}/status", [
            'status' => 'INEXISTENTE',
        ])->assertUnprocessable()
            ->assertJsonValidationErrors('status');

        $this->patchJson("/api/v1/solicitacoes/{$appointment->id}/status", [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('status');

        $this->patchJson('/api/v1/solicitacoes/99999/status', [
            'status' => 'EM_ANALISE',
        ])->assertNotFound();
    }

    private function createAppointment(array $attributes = []): Appointment
    {
        return Appointment::query()->create(array_merge([
            'protocolo' => 'APT-'.Str::upper(Str::random(10)),
            'nome_solicitante' => 'Pessoa Solicitante',
            'categoria' => 'CONSULTA',
            'prioridade' => 'MEDIA',
            'status' => 'RECEBIDA',
            'descricao' => 'Descrição da solicitação de atendimento.',
            'justificativa_prioridade' => null,
        ], $attributes));
    }
}
