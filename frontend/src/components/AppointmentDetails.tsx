import { useState } from "react";
import type { Appointment, Status } from "../interfaces/Appointment";
import {
  nextStatuses,
  priorityBadgeClasses,
  statusActionClasses,
  statusBadgeClasses,
  statusLabels,
} from "../utils/appointmentStatus";
import ConfirmDialog from "./ConfirmDialog/ConfirmDialog";
import Panel from "./Panel/Panel";

type AppointmentDetailsProps = {
  appointment: Appointment;
  error: string | null;
  onBack: () => void;
  onRetry: () => void;
  onUpdateStatus: (id: number, status: Status) => void;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function AppointmentDetails({
  appointment,
  error,
  onBack,
  onRetry,
  onUpdateStatus,
}: AppointmentDetailsProps) {
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
    <Panel className="overflow-hidden p-0">
      {error && (
        <div
          className="m-5 rounded-md border border-red-200 bg-red-50 p-4 text-red-800"
          role="alert"
        >
          <p className="font-medium">Não foi possível concluir a operação.</p>
          <p className="mt-1 text-sm">{error}</p>
          <button
            type="button"
            className="mt-3 rounded-md bg-red-700 px-3 py-2 text-sm text-white hover:bg-red-800"
            onClick={onRetry}
          >
            Tentar carregar novamente
          </button>
        </div>
      )}

      <header className="border-b border-[#3f4b59] from-[#1b252d] to-[#161616] px-5 py-6 sm:px-8">
        <button
          type="button"
          className="mb-7 text-sm font-medium text-cyan-100 hover:text-cyan-200"
          onClick={onBack}
        >
          ← Voltar para solicitações
        </button>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="mt-1 font-mono text-2xl font-semibold text-cyan-300">
              Solicitação {appointment.protocolo}
            </h2>
          </div>
          <span
            className={`inline-flex w-fit items-center rounded-full border px-3 py-1 text-sm ${statusBadgeClasses[appointment.status]}`}
          >
            {appointment.status}
          </span>
        </div>
      </header>

      <article className="mx-auto max-w-4xl px-5 py-7 sm:px-8 sm:py-9">
        <p className="mt-3 text-lg font-medium text-slate-100">
              {appointment.nome_solicitante}
        </p>
        <dl className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-[#3f4b59] bg-[#1b1b1b] p-4">
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Categoria
            </dt>
            <dd className="mt-2 font-medium text-slate-100">
              {appointment.categoria}
            </dd>
          </div>
          <div className="rounded-lg border border-[#3f4b59] bg-[#1b1b1b] p-4">
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Prioridade
            </dt>
            <dd className="mt-2">
              <span
                className={`inline-flex rounded-full border px-2 py-1 text-xs font-medium ${priorityBadgeClasses[appointment.prioridade]}`}
              >
                {appointment.prioridade}
              </span>
            </dd>
          </div>
          <div className="rounded-lg border border-[#3f4b59] bg-[#1b1b1b] p-4">
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Criada em
            </dt>
            <dd className="mt-2 text-sm font-medium text-slate-100">
              {formatDate(appointment.data_criacao)}
            </dd>
          </div>
        </dl>

        <section className="mt-9">
          <h3 className="text-sm font-medium uppercase tracking-wide text-slate-400">
            Descrição
          </h3>
          <p className="mt-3 whitespace-pre-wrap border-l-2 border-cyan-400/70 pl-4 text-base leading-7 text-slate-100">
            {appointment.descricao}
          </p>
        </section>

        <section className="mt-8 rounded-lg border border-amber-400/25 bg-amber-400/5 p-5">
          <h3 className="text-sm font-medium text-amber-200">
            Justificativa da prioridade
          </h3>
          <p className="mt-2 whitespace-pre-wrap leading-7 text-slate-200">
            {appointment.justificativa_prioridade?.trim() ||
              "Nenhuma justificativa informada."}
          </p>
        </section>

        <p className="mt-8 text-sm text-slate-400">
          Última atualização: {formatDate(appointment.data_atualizacao)}
        </p>
      </article>

      {allowedStatuses.length > 0 && (
        <footer className="flex flex-wrap justify-end gap-2 border-t border-[#3f4b59] bg-[#141414] px-5 py-4 sm:px-8">
          {allowedStatuses.map((status) => (
            <button
              key={status}
              type="button"
              className={`rounded-md px-4 py-2 text-sm ${statusActionClasses[status]}`}
              onClick={() => requestStatusChange(status)}
            >
              {statusLabels[status]}
            </button>
          ))}
        </footer>
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
        onConfirm={confirmStatusChange}
        onCancel={() => setPendingStatus(null)}
      />
    </Panel>
  );
}
