import type { Appointment, Status } from "../../interfaces/Appointment";
import {
  categoryBadgeClass,
  categoryLabels,
  priorityBorderClasses,
} from "../../constants/appointment";
import AppointmentActions from "./AppointmentActions";
import PriorityBadge from "./PriorityBadge";
import StatusBadge from "./StatusBadge";

type AppointmentCardProps = {
  appointment: Appointment;
  onViewDetails: (appointment: Appointment) => void;
  onUpdateStatus: (id: number, status: Status) => Promise<void>;
};

export default function AppointmentCard({
  appointment,
  onViewDetails,
  onUpdateStatus,
}: AppointmentCardProps) {
  const descriptionPreview = appointment.descricao.split(/\r?\n/, 1)[0];

  return (
    <article
      className={`rounded-lg border border-[#536170] border-l-4 p-5 shadow-sm ${priorityBorderClasses[appointment.prioridade]}`}
    >
      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="font-mono text-xs tracking-wide text-slate-400">
            {appointment.protocolo}
          </span>
          <StatusBadge status={appointment.status} />
        </div>
        <p className="text-lg font-semibold text-slate-100">
          {appointment.nome_solicitante}
        </p>
        <div className="mt-2 flex flex-wrap gap-2 text-xs">
          <span
            className={`rounded-full bg-transparent border px-2 py-1 ${categoryBadgeClass}`}
          >
            {categoryLabels[appointment.categoria]}
          </span>
          <PriorityBadge priority={appointment.prioridade} showLabel />
        </div>
      </div>

      <div className="mt-4 border-t border-[#536170] pt-4">
        <div className="flex flex-wrap items-center gap-2">
          <p className="min-w-0 flex-1 truncate text-sm text-slate-300">
            {descriptionPreview}
          </p>
          <div className="ml-auto flex flex-wrap items-center justify-end gap-2">
            <button
              type="button"
              className="text-sm font-medium text-cyan-300 underline hover:text-cyan-200"
              onClick={() => onViewDetails(appointment)}
            >
              Ver detalhes
            </button>

            <AppointmentActions
              status={appointment.status}
              appointmentId={appointment.id}
              onUpdateStatus={onUpdateStatus}
              className="flex flex-wrap items-center justify-end gap-2"
            />
          </div>
        </div>
      </div>
    </article>
  );
}
