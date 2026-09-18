import { useNavigate } from "react-router";
import AppointmentDetails from "../components/AppointmentDetails";
import type { Appointment, Status } from "../interfaces/Appointment";

type AppointmentDetailsPageProps = {
  appointment: Appointment | undefined;
  error: string | null;
  onRetry: () => void;
  onUpdateStatus: (id: number, status: Status) => void;
};

export default function AppointmentDetailsPage({
  appointment,
  error,
  onRetry,
  onUpdateStatus,
}: AppointmentDetailsPageProps) {
  const navigate = useNavigate();

  if (!appointment) {
    return (
      <section className="rounded-xl border border-[#3f4b59] bg-[#161616] p-5 text-slate-200">
        Solicitação não encontrada.
      </section>
    );
  }

  return (
    <AppointmentDetails
      appointment={appointment}
      error={error}
      onBack={() => navigate("/solicitacoes")}
      onRetry={onRetry}
      onUpdateStatus={onUpdateStatus}
    />
  );
}
