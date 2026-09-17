<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('appointments', function (Blueprint $table) {
            $table->id();
            $table->string('protocol')->unique();
            $table->string('applicant_name');
            $table->enum('category', ['CONSULTA', 'EXAME', 'VACINACAO', 'OUTRO']);
            $table->enum('priority', ['BAIXA', 'MEDIA', 'ALTA', 'URGENTE']);
            $table->enum('status', ['RECEBIDA', 'EM_ANALISE', 'AGENDADA', 'CONCLUIDA', 'CANCELADA']);
            $table->text('description');
            $table->text('priority_justification')->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();

            $table->index(['status', 'priority']);
            $table->index('category');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('appointments');
    }
};
