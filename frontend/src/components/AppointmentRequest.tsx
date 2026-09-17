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

export default function AppointmentRequest({ form, setForm, onSubmit }: AppointmentRequestProps) {
  return (
    <section className="panel">
      <h2>Nova solicitação</h2>
      <form onSubmit={onSubmit} className="form-grid">
        <label>
          Applicant name
          <input
            value={form.applicantName}
            onChange={(event) => setForm((prev) => ({ ...prev, applicantName: event.target.value }))}
            placeholder="Ex.: Maria Silva"
          />
        </label>

        <label>
          Category
          <select
            value={form.category}
            onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value as Category }))}
          >
            <option value="CONSULTA">CONSULTA</option>
            <option value="EXAME">EXAME</option>
            <option value="VACINACAO">VACINACAO</option>
            <option value="OUTRO">OUTRO</option>
          </select>
        </label>

        <label>
          Priority
          <select
            value={form.priority}
            onChange={(event) => setForm((prev) => ({ ...prev, priority: event.target.value as Priority }))}
          >
            <option value="BAIXA">BAIXA</option>
            <option value="MEDIA">MEDIA</option>
            <option value="ALTA">ALTA</option>
            <option value="URGENTE">URGENTE</option>
          </select>
        </label>

        <label className="full-width">
          Description
          <textarea
            value={form.description}
            onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
            rows={4}
          />
        </label>

        {form.priority === 'URGENTE' && (
          <label className="full-width">
            Urgent priority justification
            <textarea
              value={form.priorityJustification}
              onChange={(event) => setForm((prev) => ({ ...prev, priorityJustification: event.target.value }))}
              rows={3}
            />
          </label>
        )}

        <button type="submit" className="primary-btn">Salvar solicitação</button>
      </form>
    </section>
  );
}
