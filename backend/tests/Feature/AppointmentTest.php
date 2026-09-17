<?php

use App\Models\Appointment;

it('cria appointment com prioridade urgente e justificativa', function () {
    $payload = [
        'applicant_name' => 'Maria da Silva',
        'category' => 'CONSULTA',
        'priority' => 'URGENTE',
        'description' => 'Necessidade de atendimento rápido.',
        'priority_justification' => 'Paciente com risco clínico.',
    ];

    $response = $this->postJson('/api/v1/appointments', $payload);

    $response->assertStatus(201)
        ->assertJsonPath('applicant_name', 'Maria da Silva')
        ->assertJsonPath('status', 'RECEBIDA');
    $this->assertDatabaseHas('appointments', ['applicant_name' => 'Maria da Silva']);
});

it('rejeita prioridade urgente sem justificativa', function () {
    $payload = [
        'applicant_name' => 'João Souza',
        'category' => 'EXAME',
        'priority' => 'URGENTE',
        'description' => 'Appointment urgente.',
    ];

    $response = $this->postJson('/api/v1/appointments', $payload);

    $response->assertStatus(422);
});

it('permite transição válida de recebida para analise', function () {
    $appointment = Appointment::factory()->create([
        'status' => 'RECEBIDA',
    ]);

    $response = $this->patchJson('/api/v1/appointments/' . $appointment->id . '/status', [
        'status' => 'EM_ANALISE',
    ]);

    $response->assertStatus(200);
    $this->assertDatabaseHas('appointments', ['id' => $appointment->id, 'status' => 'EM_ANALISE']);
});
