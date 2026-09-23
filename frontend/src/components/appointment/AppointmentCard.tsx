import type { Appointment, Status } from "../../interfaces/Appointment";
import {
  priorityBorderClasses,
} from "../../constants/appointment";
import AppointmentActions from "./AppointmentActions";
import CategoryBadge from "./CategoryBadge";
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
          <CategoryBadge category={appointment.categoria} />
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
              className="inline-flex items-center gap-2 rounded-md border border-cyan-400/50 bg-cyan-400/5 px-3 py-1.5 text-sm font-medium text-cyan-200 transition-colors hover:border-cyan-300 hover:bg-cyan-400/10 hover:text-cyan-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#151515]"
              onClick={() => onViewDetails(appointment)}
            >
              <svg
                aria-hidden="true"
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 12s3.75-6.75 9.75-6.75S21.75 12 21.75 12 18 18.75 12 18.75 2.25 12 2.25 12Z"
                />
                <circle cx="12" cy="12" r="2.25" />
              </svg>
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
