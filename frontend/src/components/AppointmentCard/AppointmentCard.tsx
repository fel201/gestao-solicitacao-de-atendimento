import type { Appointment, Status } from '../../interfaces/Appointment';
import { categoryBadgeClasses, nextStatuses, priorityBadgeClasses, priorityBorderClasses, statusActionClasses, statusBadgeClasses, statusLabels } from '../../utils/appointmentStatus';

type AppointmentCardProps = {
  appointment: Appointment;
  onViewDetails: (appointment: Appointment) => void;
  onUpdateStatus: (id: number, status: Status) => void;
};

export default function AppointmentCard({ appointment, onViewDetails, onUpdateStatus }: AppointmentCardProps) {
  const allowedStatuses = nextStatuses[appointment.status];

  return (
    <article className={`rounded-lg border border-[#536170] border-l-4 p-5 shadow-sm ${priorityBorderClasses[appointment.prioridade]}`}>
      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="font-mono text-xs tracking-wide text-slate-400">{appointment.protocolo}</span>
          <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs ${statusBadgeClasses[appointment.status]}`}>
            {appointment.status}
          </span>
        </div>
        <p className="text-lg font-semibold text-slate-100">{appointment.nome_solicitante}</p>
        <div className="mt-2 flex flex-wrap gap-2 text-xs">
          <span className={`rounded-full border px-2 py-1 ${categoryBadgeClasses[appointment.categoria]}`}>
            {appointment.categoria}
          </span>
          <span className={`rounded-full border px-2 py-1 ${priorityBadgeClasses[appointment.prioridade]}`}>
            {appointment.prioridade}
          </span>
        </div>
      </div>

      <div className="mt-4 border-t border-[#536170] pt-4">
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">Ações</p>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" className="text-sm font-medium text-cyan-300 underline hover:text-cyan-200" onClick={() => onViewDetails(appointment)}>
            Ver detalhes
          </button>

          {allowedStatuses.map((status) => (
            <button key={status} type="button" className={`rounded-md px-3 py-1 text-sm ${statusActionClasses[status]}`} onClick={() => onUpdateStatus(appointment.id, status)}>
              {statusLabels[status]}
            </button>
          ))}
        </div>
      </div>
    </article>
  );
}
