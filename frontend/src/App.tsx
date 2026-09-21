import { type FormEvent, useEffect, useMemo, useState } from "react";
import { Navigate, Route, Routes, useNavigate, useParams } from "react-router";
import NavigationSidebar from "./components/layout/NavigationSidebar";
import type {
  AppointmentForm,
  AppointmentListItem,
  Category,
  Priority,
  Status,
} from "./interfaces/Appointment";
import AppointmentDetails from "./pages/AppointmentDetails";
import AppointmentRequest from "./pages/AppointmentRequest";
import AppointmentView from "./pages/AppointmentView";
import {
  createAppointment,
  listAppointments,
  updateAppointmentStatus,
} from "./services/appointments";

const initialForm: AppointmentForm = {
  nome_solicitante: "",
  categoria: "CONSULTA" as Category,
  prioridade: "MEDIA" as Priority,
  descricao: "",
  justificativa_prioridade: "",
};

function DetailsRoute({ onUpdateStatus }: {
  onUpdateStatus: (id: number, status: Status) => Promise<void>;
}) {
  const { id } = useParams();
  const navigate = useNavigate();
  const appointmentId = Number(id);

  if (!Number.isInteger(appointmentId) || appointmentId < 1) {
    return (
      <section className="rounded-xl border border-[#3f4b59] bg-[#161616] p-5 text-slate-200">
        Solicitação não encontrada.
      </section>
    );
  }

  return (
    <AppointmentDetails
      appointmentId={appointmentId}
      onBack={() => navigate("/solicitacoes")}
      onUpdateStatus={onUpdateStatus}
    />
  );
}

export default function App() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<AppointmentListItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<AppointmentForm>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [appliedStatusFilter, setAppliedStatusFilter] = useState("");
  const [appliedCategoryFilter, setAppliedCategoryFilter] = useState("");
  const [appliedPriorityFilter, setAppliedPriorityFilter] = useState("");

  const fetchAppointments = async (page = currentPage) => {
    setLoading(true);
    setError(null);

    try {
      const data = await listAppointments({
        status: appliedStatusFilter,
        categoria: appliedCategoryFilter,
        prioridade: appliedPriorityFilter,
        page,
      });
      setAppointments(data.data);
      setCurrentPage(data.current_page);
      setLastPage(data.last_page);
      setTotal(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar dados.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [
    appliedStatusFilter,
    appliedCategoryFilter,
    appliedPriorityFilter,
    currentPage,
  ]);

  const applyFilters = () => {
    setAppliedStatusFilter(statusFilter);
    setAppliedCategoryFilter(categoryFilter);
    setAppliedPriorityFilter(priorityFilter);
    setCurrentPage(1);
  };

  const summary = useMemo(() => {
    const map = new Map<Status, number>();
    for (const item of appointments) {
      map.set(item.status, (map.get(item.status) ?? 0) + 1);
    }
    return Array.from(map.entries()).map(([status, total]) => ({
      status,
      total,
    }));
  }, [appointments]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitSuccess(false);
    setSubmitError(null);

    try {
      await createAppointment(form);

      setForm(initialForm);
      setSubmitSuccess(true);
      await fetchAppointments(1);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Erro ao salvar solicitação.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateStatus = async (id: number, status: Status) => {
    try {
      await updateAppointmentStatus(id, status);
      await fetchAppointments();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao atualizar status.",
      );
      throw err;
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-slate-100 lg:flex">
      <NavigationSidebar />
      <main className="min-w-0 flex-1 px-5 py-8 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <header className="mb-6">
            <p className="text-cyan-300 uppercase text-xs tracking-wider">
              Gestão de solicitações
            </p>
            <h2 className="text-2xl font-semibold text-slate-100">
              Solicitações de Atendimento
            </h2>
          </header>

          <Routes>
            <Route
              path="/solicitacoes"
              element={
                <AppointmentView
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
                  onApplyFilters={applyFilters}
                  hasAppliedFilters={Boolean(
                    appliedStatusFilter ||
                    appliedCategoryFilter ||
                    appliedPriorityFilter,
                  )}
                  onRetry={fetchAppointments}
                  currentPage={currentPage}
                  lastPage={lastPage}
                  total={total}
                  onPageChange={setCurrentPage}
                  onViewDetails={(appointment) =>
                    navigate(`/solicitacoes/${appointment.id}`)
                  }
                  onUpdateStatus={updateStatus}
                />
              }
            />
            <Route
              path="/solicitacoes/nova"
              element={
                <AppointmentRequest
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
