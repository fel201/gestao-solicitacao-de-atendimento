import { useState } from "react";
import type { Appointment, Status } from "../../interfaces/Appointment";
import {
  categoryBadgeClasses,
  nextStatuses,
  priorityBadgeClasses,
  priorityBorderClasses,
  statusActionClasses,
  statusBadgeClasses,
  statusLabels,
} from "../../utils/appointmentStatus";
import ConfirmDialog from "../ConfirmDialog/ConfirmDialog";

type AppointmentCardProps = {
  appointment: Appointment;
  onViewDetails: (appointment: Appointment) => void;
  onUpdateStatus: (id: number, status: Status) => void;
};

export default function AppointmentCard({
  appointment,
  onViewDetails,
  onUpdateStatus,
}: AppointmentCardProps) {
  const allowedStatuses = nextStatuses[appointment.status];
  const [pendingStatus, setPendingStatus] = useState<Status | null>(null);

  function requestStatusChange(status: Status) {
    if (status === "EM_ANALISE" || status === "CANCELADA") {
      setPendingStatus(status);
      return;
    }

    onUpdateStatus(appointment.id, status);
  }

  function confirmStatusChange() {
    if (pendingStatus) onUpdateStatus(appointment.id, pendingStatus);
    setPendingStatus(null);
  }

  return (
    <article
      className={`rounded-lg border border-[#536170] border-l-4 p-5 shadow-sm ${priorityBorderClasses[appointment.prioridade]}`}
    >
      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="font-mono text-xs tracking-wide text-slate-400">
            {appointment.protocolo}
          </span>
          <span
            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs ${statusBadgeClasses[appointment.status]}`}
          >
            {appointment.status}
          </span>
        </div>
        <p className="text-lg font-semibold text-slate-100">
          {appointment.nome_solicitante}
        </p>
        <div className="mt-2 flex flex-wrap gap-2 text-xs">
          <span
            className={`rounded-full border px-2 py-1 ${categoryBadgeClasses[appointment.categoria]}`}
          >
            {appointment.categoria}
          </span>
          <span
            className={`rounded-full border px-2 py-1 ${priorityBadgeClasses[appointment.prioridade]}`}
          >
            {appointment.prioridade}
          </span>
        </div>
      </div>

      <div className="mt-4 border-t border-[#536170] pt-4">
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">
          Ações
        </p>
        <div className="flex flex-wrap items-center justify-end gap-2">
          <button
            type="button"
            className="text-sm font-medium text-cyan-300 underline hover:text-cyan-200"
            onClick={() => onViewDetails(appointment)}
          >
            Ver detalhes
          </button>

          {allowedStatuses.map((status) => (
            <button
              key={status}
              type="button"
              className={`rounded-md px-3 py-1 text-sm ${statusActionClasses[status]}`}
              onClick={() => requestStatusChange(status)}
            >
              {statusLabels[status]}
            </button>
          ))}
        </div>
      </div>
      <ConfirmDialog
        open={pendingStatus !== null}
        title={
          pendingStatus === "CANCELADA"
            ? "Cancelar solicitação?"
            : "Enviar para análise?"
        }
        description={
          pendingStatus === "CANCELADA"
            ? "Essa ação encerra a solicitação e não poderá ser desfeita."
            : "Confirme que deseja alterar o status desta solicitação para Em análise."
        }
        confirmLabel={
          pendingStatus === "CANCELADA"
            ? "Cancelar solicitação"
            : "Confirmar análise"
        }
        destructive={pendingStatus === "CANCELADA"}
        onConfirm={confirmStatusChange}
        onCancel={() => setPendingStatus(null)}
      />
    </article>
  );
}
