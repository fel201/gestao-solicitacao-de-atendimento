<?php

namespace Database\Seeders;

use App\Models\Appointment;
use Illuminate\Database\Seeder;

class AppointmentSeeder extends Seeder
{
    public function run(): void
    {
        $categories = ['CONSULTA', 'EXAME', 'VACINACAO', 'OUTRO'];
        $priorities = ['BAIXA', 'MEDIA', 'ALTA', 'URGENTE'];
        $statuses = ['RECEBIDA', 'EM_ANALISE', 'AGENDADA', 'CONCLUIDA', 'CANCELADA'];

        for ($index = 0; $index < 24; $index++) {
            $number = $index + 1;
            $protocol = sprintf('APT-DEMO%06d', $number);
            $appointment = Appointment::query()->firstOrNew(['protocolo' => $protocol]);

            if ($appointment->exists) {
                continue;
            }

            $category = $categories[$index % count($categories)];
            $priority = $priorities[(intdiv($index, 4) + $index % 4) % count($priorities)];
            $createdAt = now()->subDays(24 - $index);

            $appointment->fill([
                'nome_solicitante' => sprintf('Pessoa Fictícia %02d', $number),
                'categoria' => $category,
                'prioridade' => $priority,
                'status' => $statuses[$index % count($statuses)],
                'descricao' => sprintf(
                    'Solicitação fictícia de %s para demonstração do sistema.',
                    strtolower($category),
                ),
                'justificativa_prioridade' => $priority === 'URGENTE'
                    ? 'Prioridade urgente fictícia para demonstrar a regra de justificativa.'
                    : null,
            ]);
            $appointment->data_criacao = $createdAt;
            $appointment->data_atualizacao = $createdAt;
            $appointment->save();
        }
    }
}
