<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('atendimentos', function (Blueprint $table) {
            $table->id();
            $table->string('protocolo')->unique();
            $table->string('nome_solicitante');
            $table->enum('categoria', ['CONSULTA', 'EXAME', 'VACINACAO', 'OUTRO']);
            $table->enum('prioridade', ['BAIXA', 'MEDIA', 'ALTA', 'URGENTE']);
            $table->enum('status', ['RECEBIDA', 'EM_ANALISE', 'AGENDADA', 'CONCLUIDA', 'CANCELADA']);
            $table->text('descricao');
            $table->text('justificativa_prioridade')->nullable();
            $table->timestamp('data_criacao')->useCurrent();
            $table->timestamp('data_atualizacao')->useCurrent()->useCurrentOnUpdate();

            $table->index(['status', 'prioridade']);
            $table->index('categoria');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('atendimentos');
    }
};
