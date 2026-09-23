<?php

namespace Tests\Feature;

use App\Models\Appointment;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AppointmentSeederTest extends TestCase
{
    use RefreshDatabase;

    public function test_seed_is_repeatable_and_preserves_existing_appointments(): void
    {
        Appointment::query()->create([
            'protocolo' => 'APT-MANUAL0001',
            'nome_solicitante' => 'Pessoa Fictícia Manual',
            'categoria' => 'CONSULTA',
            'prioridade' => 'MEDIA',
            'status' => 'RECEBIDA',
            'descricao' => 'Solicitação fictícia criada antes da carga inicial.',
            'justificativa_prioridade' => null,
        ]);

        $this->artisan('db:seed')->assertExitCode(0);
        Appointment::query()
            ->where('protocolo', 'APT-DEMO000001')
            ->firstOrFail()
            ->update(['descricao' => 'Descrição fictícia editada após a carga inicial.']);
        $this->artisan('db:seed')->assertExitCode(0);

        $this->assertDatabaseCount('atendimentos', 25);
        $this->assertDatabaseHas('atendimentos', [
            'protocolo' => 'APT-MANUAL0001',
            'nome_solicitante' => 'Pessoa Fictícia Manual',
        ]);
        $this->assertDatabaseHas('atendimentos', [
            'protocolo' => 'APT-DEMO000001',
            'descricao' => 'Descrição fictícia editada após a carga inicial.',
        ]);
        $this->assertSame(24, Appointment::query()->where('protocolo', 'like', 'APT-DEMO%')->count());
        $this->assertSame(6, Appointment::query()->where('protocolo', 'like', 'APT-DEMO%')->where('prioridade', 'URGENTE')->count());
        $this->assertSame(0, Appointment::query()
            ->where('protocolo', 'like', 'APT-DEMO%')
            ->where('prioridade', 'URGENTE')
            ->whereNull('justificativa_prioridade')
            ->count());

        foreach (['RECEBIDA', 'EM_ANALISE', 'AGENDADA', 'CONCLUIDA', 'CANCELADA'] as $status) {
            $this->assertTrue(Appointment::query()->where('protocolo', 'like', 'APT-DEMO%')->where('status', $status)->exists());
        }
    }
}
