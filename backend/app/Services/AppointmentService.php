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

        if (empty($data['applicant_name'] ?? $data['nome_solicitante'] ?? '')) {
            $errors['applicant_name'] = 'O nome do solicitante é obrigatório.';
        }

        $category = $data['category'] ?? $data['categoria'] ?? null;
        if (!in_array($category, self::VALID_CATEGORIES, true)) {
            $errors['category'] = 'Categoria inválida.';
        }

        $priority = $data['priority'] ?? $data['prioridade'] ?? null;
        if (!in_array($priority, self::VALID_PRIORITIES, true)) {
            $errors['priority'] = 'Prioridade inválida.';
        }

        $description = $data['description'] ?? $data['descricao'] ?? '';
        if (empty($description)) {
            $errors['description'] = 'A descrição é obrigatória.';
        }

        $priorityJustification = $data['priority_justification'] ?? $data['justificativa_prioridade'] ?? '';
        if (($priority ?? null) === 'URGENTE' && empty($priorityJustification)) {
            $errors['priority_justification'] = 'A justificativa da prioridade urgente é obrigatória.';
        }

        if (isset($data['status']) && !in_array($data['status'], self::VALID_STATUSES, true)) {
            $errors['status'] = 'Status inválido.';
        }

        return $errors;
    }

    public function validateTransition(string $currentStatus, string $newStatus): bool
    {
        if ($currentStatus === $newStatus) {
            return true;
        }

        $allowedStatuses = self::STATUS_FLOW[$currentStatus] ?? [];

        return in_array($newStatus, $allowedStatuses, true);
    }

    public function create(array $data): Appointment
    {
        $appointment = new Appointment();
        $appointment->protocol = $this->generateProtocol();
        $appointment->applicant_name = $data['applicant_name'] ?? $data['nome_solicitante'];
        $appointment->category = $data['category'] ?? $data['categoria'];
        $appointment->priority = $data['priority'] ?? $data['prioridade'];
        $appointment->status = $data['status'] ?? 'RECEBIDA';
        $appointment->description = $data['description'] ?? $data['descricao'];
        $appointment->priority_justification = $data['priority_justification'] ?? $data['justificativa_prioridade'] ?? null;
        $appointment->created_at = now();
        $appointment->updated_at = now();
        $appointment->save();

        return $appointment;
    }

    public function updateStatus(Appointment $appointment, string $newStatus): Appointment
    {
        if (in_array($appointment->status, ['CONCLUIDA', 'CANCELADA'], true)) {
            throw new \RuntimeException('Appointment finalizado não pode ter status alterado.');
        }

        if (!$this->validateTransition($appointment->status, $newStatus)) {
            throw new \RuntimeException('Transição de status inválida.');
        }

        $appointment->status = $newStatus;
        $appointment->updated_at = now();
        $appointment->save();

        return $appointment;
    }
}
