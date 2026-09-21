<?php

namespace App\Services;

use App\Models\Appointment;
use Illuminate\Support\Str;

class AppointmentService
{
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

    public function validateCreation(array $data): array
    {
        $errors = [];

        if (empty($data['nome_solicitante'] ?? '')) {
            $errors['nome_solicitante'] = 'O nome do solicitante é obrigatório.';
        }

        $category = $data['categoria'] ?? null;
        if (!in_array($category, self::VALID_CATEGORIES, true)) {
            $errors['categoria'] = 'Categoria inválida.';
        }

        $priority = $data['prioridade'] ?? null;
        if (!in_array($priority, self::VALID_PRIORITIES, true)) {
            $errors['prioridade'] = 'Prioridade inválida.';
        }

        $description = $data['descricao'] ?? '';
        if (empty($description)) {
            $errors['descricao'] = 'A descrição é obrigatória.';
        }

        $priorityJustification = $data['justificativa_prioridade'] ?? '';
        if (($priority ?? null) === 'URGENTE' && empty($priorityJustification)) {
            $errors['justificativa_prioridade'] = 'A justificativa da prioridade urgente é obrigatória.';
        }

        if (isset($data['status']) && !in_array($data['status'], self::VALID_STATUSES, true)) {
            $errors['status'] = 'Status inválido.';
        }

        return $errors;
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
        $appointment->status = $data['status'];
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
