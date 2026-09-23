<?php

namespace App\Services;

use App\Models\Appointment;
use Illuminate\Support\Str;

class AppointmentService
{
    public const INITIAL_STATUS = 'RECEBIDA';

    public const VALID_STATUSES = [
        'RECEBIDA',
        'EM_ANALISE',
        'AGENDADA',
        'CONCLUIDA',
        'CANCELADA',
    ];

    public const VALID_PRIORITIES = ['BAIXA', 'MEDIA', 'ALTA', 'URGENTE'];

    public const VALID_CATEGORIES = ['CONSULTA', 'EXAME', 'VACINACAO', 'OUTRO'];

    public const STATUS_FLOW = [
        'RECEBIDA' => ['EM_ANALISE', 'CANCELADA'],
        'EM_ANALISE' => ['AGENDADA', 'CANCELADA'],
        'AGENDADA' => ['CONCLUIDA', 'CANCELADA'],
        'CONCLUIDA' => [],
        'CANCELADA' => [],
    ];

    public function generateProtocol(): string
    {
        return 'APT-' . strtoupper(Str::random(10));
    }

    public function validateTransition(string $currentStatus, string $newStatus): bool
    {
        if ($currentStatus === $newStatus) {
            return false;
        }

        $allowedStatuses = self::STATUS_FLOW[$currentStatus] ?? [];

        return in_array($newStatus, $allowedStatuses, true);
    }

    public function create(array $data): Appointment
    {
        $appointment = new Appointment();
        $appointment->protocolo = $this->generateProtocol();
        $appointment->nome_solicitante = $data['nome_solicitante'];
        $appointment->categoria = $data['categoria'];
        $appointment->prioridade = $data['prioridade'];
        $appointment->status = self::INITIAL_STATUS;
        $appointment->descricao = $data['descricao'];
        $appointment->justificativa_prioridade = $data['justificativa_prioridade'] ?? null;
        $appointment->save();

        return $appointment;
    }

    public function updateStatus(Appointment $appointment, string $newStatus): Appointment
    {
        if (in_array($appointment->status, ['CONCLUIDA', 'CANCELADA'], true)) {
            throw new \RuntimeException('Atendimento finalizado não pode ter status alterado.');
        }

        if (!$this->validateTransition($appointment->status, $newStatus)) {
            throw new \RuntimeException('Transição de status inválida.');
        }

        $appointment->status = $newStatus;
        $appointment->save();

        return $appointment;
    }
}
