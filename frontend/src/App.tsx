import { type FormEvent, useEffect, useMemo, useState } from 'react';
import AppointmentRequest from './components/AppointmentRequest';
import AppointmentView from './components/AppointmentView';

type Status = 'RECEBIDA' | 'EM_ANALISE' | 'AGENDADA' | 'CONCLUIDA' | 'CANCELADA';
type Priority = 'BAIXA' | 'MEDIA' | 'ALTA' | 'URGENTE';
type Category = 'CONSULTA' | 'EXAME' | 'VACINACAO' | 'OUTRO';

type Appointment = {
  id: number;
  protocol: string;
  applicantName: string;
  category: Category;
  priority: Priority;
  status: Status;
  description: string;
  priorityJustification?: string;
  createdAt: string;
  updatedAt: string;
};

const API_URL = 'http://localhost:8000/api/v1';

const initialForm = {
  applicantName: '',
  category: 'CONSULTA' as Category,
  priority: 'MEDIA' as Priority,
  description: '',
  priorityJustification: '',
};

export default function App() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState(initialForm);
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  const fetchAppointments = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set('status', statusFilter);
      if (priorityFilter) params.set('prioridade', priorityFilter);

      const response = await fetch(`${API_URL}/solicitacoes?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Não foi possível carregar as solicitações.');
      }
      const data = await response.json();
      setAppointments(Array.isArray(data.data) ? data.data : data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchAppointments();
  }, [statusFilter, priorityFilter]);

  const summary = useMemo(() => {
    const map = new Map<Status, number>();
    for (const item of appointments) {
      map.set(item.status, (map.get(item.status) ?? 0) + 1);
    }
    return Array.from(map.entries()).map(([status, total]) => ({ status, total }));
  }, [appointments]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const payload = {
        ...form,
        priorityJustification: form.priority === 'URGENTE' ? form.priorityJustification : undefined,
      };

      const response = await fetch(`${API_URL}/solicitacoes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message ?? 'Erro ao criar solicitação.');
      }

      setForm(initialForm);
      await fetchAppointments();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar solicitação.');
    }
  };

  const updateStatus = async (id: number, status: Status) => {
    try {
      const response = await fetch(`${API_URL}/solicitacoes/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Não foi possível atualizar o status.');
      }

      await fetchAppointments();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar status.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-5 py-8">
      <header className="mb-6">
        <div>
          <p className="text-cyan-400 uppercase text-xs tracking-wider">Painel operacional</p>
          <h1 className="text-2xl font-semibold">Solicitações de Atendimento</h1>
        </div>
      </header>

      <section className="grid gap-4 mb-6 grid-rows-1 sm:grid-rows-2 md:grid-rows-3 lg:grid-cols-4">
        {summary.map((item) => (
          <article key={item.status} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <span className="block text-slate-600 mb-2">{item.status}</span>
            <strong className="text-2xl text-slate-900">{item.total}</strong>
          </article>
        ))}
      </section>

      <main className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <AppointmentRequest form={form} setForm={setForm} onSubmit={handleSubmit} />

        <AppointmentView
          appointments={appointments}
          loading={loading}
          error={error}
          statusFilter={statusFilter}
          priorityFilter={priorityFilter}
          onStatusFilterChange={setStatusFilter}
          onPriorityFilterChange={setPriorityFilter}
          onUpdateStatus={updateStatus}
        />
      </main>
    </div>
  );
}
