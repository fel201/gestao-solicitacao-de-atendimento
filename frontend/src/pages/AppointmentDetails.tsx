import { useEffect, useState } from "react";
import type { Appointment, Status } from "../interfaces/Appointment";
import AppointmentActions from "../components/appointment/AppointmentActions";
import CategoryBadge from "../components/appointment/CategoryBadge";
import PriorityBadge from "../components/appointment/PriorityBadge";
import StatusBadge from "../components/appointment/StatusBadge";
import Button from "../components/ui/Button";
import Panel from "../components/ui/Panel";
import { getAppointment } from "../services/appointments";
import formatDate from "../utils/formatDate";
import {
  nextStatuses,
  priorityBorderClasses,
} from "../constants/appointment";

type AppointmentDetailsProps = {
  appointmentId: number;
  initialAppointment?: Appointment;
  onBack: () => void;
  onUpdateStatus: (id: number, status: Status) => Promise<void>;
};

export default function AppointmentDetails({
  appointmentId,
  initialAppointment,
  onBack,
  onUpdateStatus,
}: AppointmentDetailsProps) {
  const [appointment, setAppointment] = useState<Appointment | null>(
    initialAppointment ?? null,
  );
  const [loading, setLoading] = useState(!initialAppointment);
  const [error, setError] = useState<string | null>(null);

  async function loadAppointment(showLoading = true) {
    if (showLoading) setLoading(true);
    setError(null);

    try {
      setAppointment(await getAppointment(appointmentId));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível carregar a solicitação.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setAppointment(initialAppointment ?? null);
    setLoading(!initialAppointment);
    loadAppointment(!initialAppointment);
  }, [appointmentId, initialAppointment]);

  if (!appointment) {
    if (loading) {
      return (
        <Panel className="p-5 text-slate-300" role="status">
          Carregando solicitação...
        </Panel>
      );
    }

    return (
      <Panel className="p-5">
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-red-800" role="alert">
          <p className="font-medium">Não foi possível carregar a solicitação.</p>
          <p className="mt-1 text-sm">{error ?? "Solicitação não encontrada."}</p>
          <div className="mt-3 flex gap-3">
            <Button variant="primary" onClick={() => loadAppointment()}>
              Tentar novamente
            </Button>
            <Button variant="secondary" onClick={onBack}>
              Voltar
            </Button>
          </div>
        </div>
      </Panel>
    );
  }

  const hasAvailableActions = nextStatuses[appointment.status].length > 0;

  return (
    <div className="space-y-4">
      <Button
        variant="secondary"
        className="px-3 py-1.5 text-cyan-100"
        onClick={onBack}
      >
        <span aria-hidden="true">←</span> Voltar para solicitações
      </Button>

      <Panel
        className={`overflow-hidden border-l-4 p-0 shadow-lg ${priorityBorderClasses[appointment.prioridade]}`}
      >
        <article>
          <header className="bg-[#161616] px-5 py-6 sm:px-8 sm:py-8">
            <div className="flex items-start justify-between gap-4">
              <span className="break-all font-mono text-sm tracking-wide text-cyan-300">
                {appointment.protocolo}
              </span>
              <StatusBadge status={appointment.status} className="shrink-0" />
            </div>

            <h2 className="mt-5 text-2xl font-semibold leading-tight text-slate-100 sm:text-3xl">
              {appointment.nome_solicitante}
            </h2>

            <div className="mt-4 flex flex-wrap gap-2">
              <CategoryBadge category={appointment.categoria} />
              <PriorityBadge priority={appointment.prioridade} showLabel />
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-400">
              <span>
                Criada em {formatDate(appointment.data_criacao)}
              </span>
              <span aria-hidden="true" className="text-slate-600">•</span>
              <span>
                Atualizada em {formatDate(appointment.data_atualizacao)}
              </span>
            </div>
          </header>

          <div className="border-t border-[#3f4b59] bg-[#161616] px-5 py-7 sm:px-8 sm:py-9">
            <section aria-labelledby="appointment-description-title">
              <h3
                id="appointment-description-title"
                className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-200"
              >
                Descrição
              </h3>
              <p className="mt-4 max-w-4xl whitespace-pre-wrap text-base leading-8 text-slate-100 sm:text-lg">
                {appointment.descricao}
              </p>
            </section>

            <section className="mt-8 max-w-4xl border-l-2 border-amber-400/70 bg-amber-400/5 px-5 py-4">
              <h3 className="text-sm font-medium text-amber-200">
                Justificativa da prioridade
              </h3>
              <p className="mt-2 whitespace-pre-wrap leading-7 text-slate-300">
                {appointment.justificativa_prioridade?.trim() ||
                  "Nenhuma justificativa informada."}
              </p>
            </section>
          </div>

          <footer className="flex flex-col gap-4 border-t border-[#3f4b59] bg-[#161616] px-5 py-5 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-200">
                Ações da solicitação
              </h3>
              <p className="mt-1 text-sm text-slate-400">
                Atualize o andamento conforme o atendimento avançar.
              </p>
            </div>

            {hasAvailableActions ? (
              <AppointmentActions
                status={appointment.status}
                appointmentId={appointment.id}
                onUpdateStatus={async (id, status) => {
                  await onUpdateStatus(id, status);
                  await loadAppointment(false);
                }}
                className="flex flex-wrap items-center gap-2"
              />
            ) : (
              <p className="text-sm text-slate-400">
                Esta solicitação não possui ações disponíveis.
              </p>
            )}
          </footer>
        </article>
      </Panel>
    </div>
  );
}
