import { type FormEvent, useEffect, useMemo, useState } from 'react';
import AppointmentDetails from './components/AppointmentDetails';
import AppointmentRequest from './components/AppointmentRequest';
import AppointmentView from './components/AppointmentView';
import type { Appointment, Category, Priority, Status } from './interfaces/Appointment';

const API_URL = 'http://localhost:8000/api/v1';

const initialForm = {
  nome_solicitante: '',
  categoria: 'CONSULTA' as Category,
  prioridade: 'MEDIA' as Priority,
  descricao: '',
  justificativa_prioridade: '',
};

export default function App() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const fetchAppointments = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set('status', statusFilter);
      if (priorityFilter) params.set('prioridade', priorityFilter);

      const response = await fetch(`${API_URL}/appointments?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Não foi possível carregar as solicitações.');
      }
      const data = await response.json();
      setAppointments(Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
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
    setIsSubmitting(true);
    setSubmitSuccess(false);
    setSubmitError(null);

    try {
      const payload = {
        ...form,
        justificativa_prioridade:
          form.prioridade === 'URGENTE' ? form.justificativa_prioridade : undefined,
      };

      const response = await fetch(`${API_URL}/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message ?? 'Erro ao criar solicitação.');
      }

      setForm(initialForm);
      setSubmitSuccess(true);
      await fetchAppointments();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Erro ao salvar solicitação.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateStatus = async (id: number, status: Status) => {
    try {
      const response = await fetch(`${API_URL}/appointments/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Não foi possível atualizar o status.');
      }

      await fetchAppointments();
      setSelectedAppointment((current) =>
        current && current.id === id ? { ...current, status } : current,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar status.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-5 py-8">
      <header className="mb-6">
        <div>
          <p className="text-cyan-300 uppercase text-xs tracking-wider">Painel operacional</p>
          <h1 className="text-2xl font-semibold text-slate-100">Solicitações de Atendimento</h1>
        </div>
      </header>

      <section className="grid gap-4 mb-6 grid-rows-1 sm:grid-rows-2 md:grid-rows-3 lg:grid-cols-4">
        {summary.map((item) => (
          <article key={item.status} className="bg-[#20252b] border border-[#3f4b59] rounded-xl p-4 shadow-sm">
            <span className="block text-slate-300 mb-2">{item.status}</span>
            <strong className="text-2xl text-slate-100">{item.total}</strong>
          </article>
        ))}
      </section>

      {selectedAppointment ? (
        <AppointmentDetails
          appointment={selectedAppointment}
          error={error}
          onBack={() => setSelectedAppointment(null)}
          onRetry={fetchAppointments}
          onUpdateStatus={updateStatus}
        />
      ) : (
        <main className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <AppointmentRequest
            form={form}
            setForm={setForm}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            submitSuccess={submitSuccess}
            submitError={submitError}
          />

          <AppointmentView
            appointments={appointments}
            loading={loading}
            error={error}
            statusFilter={statusFilter}
            priorityFilter={priorityFilter}
            onStatusFilterChange={setStatusFilter}
            onPriorityFilterChange={setPriorityFilter}
            onRetry={fetchAppointments}
            onViewDetails={setSelectedAppointment}
            onUpdateStatus={updateStatus}
          />
        </main>
      )}
    </div>
  );
}
