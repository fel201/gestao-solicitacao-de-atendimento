import type { Dispatch, FormEvent, SetStateAction } from 'react';

type Category = 'CONSULTA' | 'EXAME' | 'VACINACAO' | 'OUTRO';
type Priority = 'BAIXA' | 'MEDIA' | 'ALTA' | 'URGENTE';

type AppointmentForm = {
  applicantName: string;
  category: Category;
  priority: Priority;
  description: string;
  priorityJustification: string;
};

type AppointmentRequestProps = {
  form: AppointmentForm;
  setForm: Dispatch<SetStateAction<AppointmentForm>>;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};
// d3d3d3
// f5f5f5
// FAFAFA
// ff6000
export default function AppointmentRequest({ form, setForm, onSubmit }: AppointmentRequestProps) {
  return (
    <section className="bg-[#d3d3d3] border border-slate-300 rounded-xl p-4">
      <h2 className="text-lg font-semibold mb-3 text-slate-900">Nova solicitação</h2>
      <form onSubmit={onSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="flex flex-col gap-2 text-slate-700">
            Nome do paciente
          <input
            className="bg-white border border-slate-300 rounded-md text-slate-900 p-2"
            value={form.applicantName}
            onChange={(event) => setForm((prev) => ({ ...prev, applicantName: event.target.value }))}
            placeholder="Ex.: Maria Silva"
          />
        </label>

        <label className="flex flex-col gap-2 text-slate-900">
          Categoria
          <select
            className="bg-white border border-slate-300 rounded-md text-slate-900 p-2"
            value={form.category}
            onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value as Category }))}
          >
            <option value="CONSULTA">CONSULTA</option>
            <option value="EXAME">EXAME</option>
            <option value="VACINACAO">VACINACAO</option>
            <option value="OUTRO">OUTRO</option>
          </select>
        </label>

        <label className="flex flex-col gap-2 text-slate-900">
          Prioridade
          <select
            className="bg-white border border-slate-300 rounded-md text-slate-900 p-2"
            value={form.priority}
            onChange={(event) => setForm((prev) => ({ ...prev, priority: event.target.value as Priority }))}
          >
            <option value="BAIXA">BAIXA</option>
            <option value="MEDIA">MEDIA</option>
            <option value="ALTA">ALTA</option>
            <option value="URGENTE">URGENTE</option>
          </select>
        </label>

        <label className="flex flex-col gap-2 text-slate-900 sm:col-span-2">
          Descrição
          <textarea
            className="bg-white border border-slate-300 rounded-md text-slate-900 p-2"
            value={form.description}
            onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
            rows={4}
          />
        </label>

        {form.priority === 'URGENTE' && (
          <label className="flex flex-col gap-2 text-slate-900 sm:col-span-2">
            Urgent priority justification
            <textarea
              className="bg-white border border-slate-300 rounded-md text-slate-900 p-2"
              value={form.priorityJustification}
              onChange={(event) => setForm((prev) => ({ ...prev, priorityJustification: event.target.value }))}
              rows={3}
            />
          </label>
        )}

        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-4 py-2 mt-2">Salvar solicitação</button>
      </form>
    </section>
  );
}
