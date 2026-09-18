import type { Dispatch, FormEvent, SetStateAction } from 'react';
import { useState } from 'react';
import type { AppointmentForm } from '../interfaces/Appointment';

type Category = 'CONSULTA' | 'EXAME' | 'VACINACAO' | 'OUTRO';
type Priority = 'BAIXA' | 'MEDIA' | 'ALTA' | 'URGENTE';
type FormErrors = Partial<Record<keyof AppointmentForm, string>>;

type AppointmentRequestProps = {
  form: AppointmentForm;
  setForm: Dispatch<SetStateAction<AppointmentForm>>;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
  submitSuccess: boolean;
  submitError: string | null;
};

function validate(form: AppointmentForm): FormErrors {
  const errors: FormErrors = {};

  if (!form.nome_solicitante.trim()) errors.nome_solicitante = 'Informe o nome do paciente.';
  if (!form.categoria) errors.categoria = 'Selecione uma categoria.';
  if (!form.prioridade) errors.prioridade = 'Selecione uma prioridade.';
  if (!form.descricao.trim()) errors.descricao = 'Descreva a solicitação.';

  if (form.prioridade === 'URGENTE' && !form.justificativa_prioridade.trim()) {
    errors.justificativa_prioridade =
      'Justificativa é obrigatória para prioridade URGENTE.';
  }

  return errors;
}

const inputClass = 'bg-[#151a20] border rounded-md text-slate-100 placeholder:text-slate-500 p-2';

function fieldClass(hasError?: string) {
  return `${inputClass} ${hasError ? 'border-red-400' : 'border-[#536170]'}`;
}

export default function AppointmentRequest({
  form,
  setForm,
  onSubmit,
  isSubmitting,
  submitSuccess,
  submitError,
}: AppointmentRequestProps) {
  const [errors, setErrors] = useState<FormErrors>({});
  const isUrgente = form.prioridade === 'URGENTE';

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const found = validate(form);
    setErrors(found);

    if (Object.keys(found).length > 0) {
      event.preventDefault();
      return;
    }

    onSubmit(event);
  }

  function update<K extends keyof AppointmentForm>(key: K, value: AppointmentForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  return (
    <section className="bg-[#2D2D2D] border border-[#3f4b59] rounded-xl p-4">
      <h2 className="text-lg font-semibold mb-3 text-slate-100">Nova solicitação</h2>

      {submitSuccess && (
        <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3 mb-4 text-emerald-800" role="status">
          Solicitação criada com sucesso.
        </div>
      )}

      {submitError && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 mb-4 text-red-800" role="alert">
          {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate aria-busy={isSubmitting} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="flex flex-col gap-2 text-slate-200">
          Nome do paciente *
          <input
            className={fieldClass(errors.nome_solicitante)}
            value={form.nome_solicitante}
            disabled={isSubmitting}
            onChange={(event) => update('nome_solicitante', event.target.value)}
            placeholder="Ex.: Maria Silva"
            aria-invalid={Boolean(errors.nome_solicitante)}
          />
          {errors.nome_solicitante && (
            <span className="text-sm text-red-700">{errors.nome_solicitante}</span>
          )}
        </label>

        <label className="flex flex-col gap-2 text-slate-200">
          Categoria *
          <select
            className={fieldClass(errors.categoria)}
            value={form.categoria}
            disabled={isSubmitting}
            onChange={(event) => update('categoria', event.target.value as Category)}
            aria-invalid={Boolean(errors.categoria)}
          >
            <option value="CONSULTA">CONSULTA</option>
            <option value="EXAME">EXAME</option>
            <option value="VACINACAO">VACINACAO</option>
            <option value="OUTRO">OUTRO</option>
          </select>
          {errors.categoria && <span className="text-sm text-red-700">{errors.categoria}</span>}
        </label>

        <label className="flex flex-col gap-2 text-slate-200">
          Prioridade *
          <select
            className={fieldClass(errors.prioridade)}
            value={form.prioridade}
            disabled={isSubmitting}
            onChange={(event) => update('prioridade', event.target.value as Priority)}
            aria-invalid={Boolean(errors.prioridade)}
          >
            <option value="BAIXA">BAIXA</option>
            <option value="MEDIA">MEDIA</option>
            <option value="ALTA">ALTA</option>
            <option value="URGENTE">URGENTE</option>
          </select>
          {errors.prioridade && <span className="text-sm text-red-700">{errors.prioridade}</span>}
        </label>

        <label className="flex flex-col gap-2 text-slate-200 sm:col-span-2">
          Descrição *
          <textarea
            className={fieldClass(errors.descricao)}
            value={form.descricao}
            disabled={isSubmitting}
            onChange={(event) => update('descricao', event.target.value)}
            rows={4}
            aria-invalid={Boolean(errors.descricao)}
          />
          {errors.descricao && <span className="text-sm text-red-700">{errors.descricao}</span>}
        </label>

        <label className="flex flex-col gap-2 text-slate-200 sm:col-span-2">
          Justificativa de prioridade {isUrgente && '*'}
          <textarea
            className={fieldClass(errors.justificativa_prioridade)}
            value={form.justificativa_prioridade}
            disabled={isSubmitting}
            onChange={(event) => update('justificativa_prioridade', event.target.value)}
            rows={3}
            aria-invalid={Boolean(errors.justificativa_prioridade)}
          />
          {isUrgente && !errors.justificativa_prioridade && (
            <span className="text-sm text-slate-400">
              Prioridade URGENTE exige justificativa.
            </span>
          )}
          {errors.justificativa_prioridade && (
            <span className="text-sm text-red-700">{errors.justificativa_prioridade}</span>
          )}
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70 text-white rounded-md px-4 py-2 mt-2"
        >
          {isSubmitting && (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          )}
          {isSubmitting ? 'Enviando solicitação...' : 'Salvar solicitação'}
        </button>
      </form>
    </section>
  );
}