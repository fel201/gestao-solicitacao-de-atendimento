import { type FormEvent, useEffect, useMemo, useState } from 'react';
import { Navigate, Route, Routes, useNavigate, useParams } from 'react-router';
import NavigationSidebar from './components/NavigationSidebar';
import type { Appointment, AppointmentForm, Category, Priority, Status } from './interfaces/Appointment';
import AppointmentDetailsPage from './pages/AppointmentDetailsPage';
import AppointmentListPage from './pages/AppointmentListPage';
import NewAppointmentPage from './pages/NewAppointmentPage';

const API_URL = 'http://localhost:8000/api/v1';

const initialForm: AppointmentForm = {
  nome_solicitante: '',
  categoria: 'CONSULTA' as Category,
  prioridade: 'MEDIA' as Priority,
  descricao: '',
  justificativa_prioridade: '',
};

function DetailsRoute({
  appointments,
  error,
  onRetry,
  onUpdateStatus,
}: {
  appointments: Appointment[];
  error: string | null;
  onRetry: () => void;
  onUpdateStatus: (id: number, status: Status) => void;
}) {
  const { id } = useParams();
  const appointment = appointments.find((item) => item.id === Number(id));

  return (
    <AppointmentDetailsPage
      appointment={appointment}
      error={error}
      onRetry={onRetry}
      onUpdateStatus={onUpdateStatus}
    />
  );
}

export default function App() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<AppointmentForm>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  const fetchAppointments = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set('status', statusFilter);
      if (categoryFilter) params.set('categoria', categoryFilter);
      if (priorityFilter) params.set('prioridade', priorityFilter);

      const response = await fetch(`${API_URL}/appointments?${params.toString()}`);
      if (!response.ok) throw new Error('Não foi possível carregar as solicitações.');

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
  }, [statusFilter, categoryFilter, priorityFilter]);

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
      if (!response.ok) throw new Error('Não foi possível atualizar o status.');

      await fetchAppointments();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar status.');
    }
  };

  return (
    <div className="min-h-screen bg-[#14181d] text-slate-100 lg:flex">
      <NavigationSidebar />
      <main className="min-w-0 flex-1 px-5 py-8 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <header className="mb-6">
            <p className="text-cyan-300 uppercase text-xs tracking-wider">Gestão de solicitações</p>
            <h2 className="text-2xl font-semibold text-slate-100">Solicitações de Atendimento</h2>
          </header>

          <Routes>
            <Route
              path="/solicitacoes"
              element={
                <AppointmentListPage
                  appointments={appointments}
                  summary={summary}
                  loading={loading}
                  error={error}
                  statusFilter={statusFilter}
                  categoryFilter={categoryFilter}
                  priorityFilter={priorityFilter}
                  onStatusFilterChange={setStatusFilter}
                  onCategoryFilterChange={setCategoryFilter}
                  onPriorityFilterChange={setPriorityFilter}
                  onRetry={fetchAppointments}
                  onViewDetails={(appointment) => navigate(`/solicitacoes/${appointment.id}`)}
                  onUpdateStatus={updateStatus}
                />
              }
            />
            <Route
              path="/solicitacoes/nova"
              element={
                <NewAppointmentPage
                  form={form}
                  setForm={setForm}
                  onSubmit={handleSubmit}
                  isSubmitting={isSubmitting}
                  submitSuccess={submitSuccess}
                  submitError={submitError}
                />
              }
            />
            <Route
              path="/solicitacoes/:id"
              element={
                <DetailsRoute
                  appointments={appointments}
                  error={error}
                  onRetry={fetchAppointments}
                  onUpdateStatus={updateStatus}
                />
              }
            />
            <Route path="*" element={<Navigate to="/solicitacoes" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
