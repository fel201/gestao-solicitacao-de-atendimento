<?php

namespace App\Http\Requests;

use App\Services\AppointmentService;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreAppointmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nome_solicitante' => ['required', 'string', 'max:255'],
            'categoria' => ['required', Rule::in(AppointmentService::VALID_CATEGORIES)],
            'prioridade' => ['required', Rule::in(AppointmentService::VALID_PRIORITIES)],
            'descricao' => ['required', 'string'],
            'justificativa_prioridade' => ['required_if:prioridade,URGENTE', 'nullable', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'nome_solicitante.required' => 'O nome do solicitante é obrigatório.',
            'nome_solicitante.string' => 'O nome do solicitante deve ser um texto.',
            'nome_solicitante.max' => 'O nome do solicitante deve ter no máximo 255 caracteres.',
            'categoria.required' => 'A categoria é obrigatória.',
            'categoria.in' => 'Categoria inválida.',
            'prioridade.required' => 'A prioridade é obrigatória.',
            'prioridade.in' => 'Prioridade inválida.',
            'descricao.required' => 'A descrição é obrigatória.',
            'descricao.string' => 'A descrição deve ser um texto.',
            'justificativa_prioridade.required_if' => 'A justificativa da prioridade urgente é obrigatória.',
            'justificativa_prioridade.string' => 'A justificativa da prioridade deve ser um texto.',
        ];
    }
}
