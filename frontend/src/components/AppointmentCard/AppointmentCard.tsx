import type { Appointment, Status } from '../../interfaces/Appointment';
import { nextStatuses, priorityBadgeClasses, priorityBorderClasses, statusBadgeClasses, statusLabels } from '../../utils/appointmentStatus';

type AppointmentCardProps = {
  appointment: Appointment;
  onViewDetails: (appointment: Appointment) => void;
  onUpdateStatus: (id: number, status: Status) => void;
};

export default function AppointmentCard({ appointment, onViewDetails, onUpdateStatus }: AppointmentCardProps) {
  const allowedStatuses = nextStatuses[appointment.status];

  return (
    <article className={`rounded-lg border border-[#536170] border-l-4 p-4 shadow-sm ${priorityBorderClasses[appointment.prioridade]}`}>
      <div className="mb-2 flex items-center justify-between">
        <strong className="text-slate-100">{appointment.protocolo}</strong>
        <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs ${statusBadgeClasses[appointment.status]}`}>
          {appointment.status}
        </span>
      </div>
      <p className="text-slate-200">{appointment.nome_solicitante}</p>
      <p className="text-slate-400">
        {appointment.categoria} · <span className={priorityBadgeClasses[appointment.prioridade]}>{appointment.prioridade}</span>
      </p>
      <button type="button" className="mt-3 text-sm font-medium text-cyan-300 underline hover:text-cyan-200" onClick={() => onViewDetails(appointment)}>
        Ver detalhes
      </button>
      {allowedStatuses.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {allowedStatuses.map((status) => (
            <button key={status} type="button" className="rounded-md bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700" onClick={() => onUpdateStatus(appointment.id, status)}>
              {statusLabels[status]}
            </button>
          ))}
        </div>
      )}
    </article>
  );
}
