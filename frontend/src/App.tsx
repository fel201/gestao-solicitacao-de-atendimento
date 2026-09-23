import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router";
import NavigationSidebar from "./components/layout/NavigationSidebar";
import type { Appointment, Status } from "./interfaces/Appointment";
import useAppointments from "./hooks/useAppointments";
import AppointmentDetails from "./pages/AppointmentDetails";
import AppointmentRequest from "./pages/AppointmentRequest";
import AppointmentView from "./pages/AppointmentView";

function DetailsRoute({ onUpdateStatus }: {
  onUpdateStatus: (id: number, status: Status) => Promise<void>;
}) {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const appointmentId = Number(id);
  const initialAppointment = (
    location.state as { appointment?: Appointment } | null
  )?.appointment;

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
      initialAppointment={
        initialAppointment?.id === appointmentId ? initialAppointment : undefined
      }
      onBack={() => navigate("/solicitacoes")}
      onUpdateStatus={onUpdateStatus}
    />
  );
}

export default function App() {
  const navigate = useNavigate();
  const appointmentData = useAppointments();

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-slate-100 lg:flex">
      <NavigationSidebar />
      <main className="min-w-0 flex-1 px-5 py-8 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <Routes>
            <Route
              path="/solicitacoes"
              element={
                <AppointmentView
                  appointments={appointmentData.appointments}
                  summary={appointmentData.summary}
                  loading={appointmentData.loading}
                  error={appointmentData.error}
                  statusFilter={appointmentData.statusFilter}
                  categoryFilter={appointmentData.categoryFilter}
                  priorityFilter={appointmentData.priorityFilter}
                  onStatusFilterChange={appointmentData.setStatusFilter}
                  onCategoryFilterChange={appointmentData.setCategoryFilter}
                  onPriorityFilterChange={appointmentData.setPriorityFilter}
                  onApplyFilters={appointmentData.applyFilters}
                  hasAppliedFilters={appointmentData.hasAppliedFilters}
                  onRetry={appointmentData.retry}
                  currentPage={appointmentData.currentPage}
                  lastPage={appointmentData.lastPage}
                  total={appointmentData.total}
                  onPageChange={appointmentData.setCurrentPage}
                  onViewDetails={(appointment) =>
                    navigate(`/solicitacoes/${appointment.id}`, {
                      state: { appointment },
                    })
                  }
                  onUpdateStatus={appointmentData.updateStatus}
                />
              }
            />
            <Route
              path="/solicitacoes/nova"
              element={
                <AppointmentRequest
                  form={appointmentData.form}
                  setForm={appointmentData.setForm}
                  onSubmit={appointmentData.submitAppointment}
                  isSubmitting={appointmentData.isSubmitting}
                  submitSuccess={appointmentData.submitSuccess}
                  submitError={appointmentData.submitError}
                />
              }
            />
            <Route
              path="/solicitacoes/:id"
              element={
                <DetailsRoute
                  onUpdateStatus={appointmentData.updateStatus}
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
