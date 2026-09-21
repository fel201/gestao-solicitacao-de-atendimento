import { useState } from "react";
import type { Status } from "../../interfaces/Appointment";
import {
  nextStatuses,
  statusActionClasses,
  statusLabels,
} from "../../constants/appointment";
import ConfirmDialog from "../ui/ConfirmDialog";

type AppointmentActionsProps = {
  status: Status;
  appointmentId: number;
  onUpdateStatus: (id: number, status: Status) => Promise<void>;
  className?: string;
};

export default function AppointmentActions({
  status,
  appointmentId,
  onUpdateStatus,
  className = "flex flex-wrap gap-2",
}: AppointmentActionsProps) {
  const allowedStatuses = nextStatuses[status];
  const [pendingStatus, setPendingStatus] = useState<Status | null>(null);

  async function requestStatusChange(nextStatus: Status) {
    if (nextStatus === "EM_ANALISE" || nextStatus === "CANCELADA") {
      setPendingStatus(nextStatus);
      return;
    }

    await onUpdateStatus(appointmentId, nextStatus);
  }

  async function confirmStatusChange() {
    if (pendingStatus) await onUpdateStatus(appointmentId, pendingStatus);
    setPendingStatus(null);
  }

  if (allowedStatuses.length === 0) return null;

  return (
    <>
      <div className={className}>
        {allowedStatuses.map((nextStatus) => (
          <button
            key={nextStatus}
            type="button"
            className={`rounded-md px-3 py-1 text-sm ${statusActionClasses[nextStatus]}`}
            onClick={() => requestStatusChange(nextStatus)}
          >
            {statusLabels[nextStatus]}
          </button>
        ))}
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
    </>
  );
}
