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
  const [updatingStatus, setUpdatingStatus] = useState<Status | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function updateStatus(nextStatus: Status) {
    setUpdatingStatus(nextStatus);
    setError(null);

    try {
      await onUpdateStatus(appointmentId, nextStatus);
      return true;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível atualizar o status da solicitação.",
      );
      return false;
    } finally {
      setUpdatingStatus(null);
    }
  }

  async function requestStatusChange(nextStatus: Status) {
    if (nextStatus === "EM_ANALISE" || nextStatus === "CANCELADA") {
      setPendingStatus(nextStatus);
      return;
    }

    await updateStatus(nextStatus);
  }

  async function confirmStatusChange() {
    if (!pendingStatus) return;

    if (await updateStatus(pendingStatus)) setPendingStatus(null);
  }

  if (allowedStatuses.length === 0) return null;

  return (
    <div className="flex flex-col items-end gap-2">
      <div className={className} aria-busy={updatingStatus !== null}>
        {allowedStatuses.map((nextStatus) => (
          <button
            key={nextStatus}
            type="button"
            className={`rounded-md px-3 py-1 text-sm disabled:cursor-not-allowed disabled:opacity-50 ${statusActionClasses[nextStatus]}`}
            onClick={() => requestStatusChange(nextStatus)}
            disabled={updatingStatus !== null}
          >
            {updatingStatus === nextStatus
              ? "Atualizando..."
              : statusLabels[nextStatus]}
          </button>
        ))}
      </div>
      {error && (
        <p className="text-sm text-red-300" role="alert">
          {error}
        </p>
      )}
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
        isConfirming={updatingStatus !== null}
        onConfirm={confirmStatusChange}
        onCancel={() => setPendingStatus(null)}
      />
    </div>
  );
}
