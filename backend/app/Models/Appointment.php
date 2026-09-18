<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    use HasFactory;

    protected $table = 'atendimentos';

    protected $fillable = [
        'protocolo',
        'nome_solicitante',
        'categoria',
        'prioridade',
        'status',
        'descricao',
        'justificativa_prioridade',
    ];

    protected $casts = [
        'data_criacao' => 'datetime',
        'data_atualizacao' => 'datetime',
    ];

    public const CREATED_AT = 'data_criacao';
    public const UPDATED_AT = 'data_atualizacao';
}
