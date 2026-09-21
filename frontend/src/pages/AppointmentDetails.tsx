import { useEffect, useState } from "react";
import type { Appointment, Status } from "../interfaces/Appointment";
import AppointmentActions from "../components/appointment/AppointmentActions";
import PriorityBadge from "../components/appointment/PriorityBadge";
import StatusBadge from "../components/appointment/StatusBadge";
import DetailField from "../components/ui/DetailField";
import Panel from "../components/ui/Panel";
import { getAppointment } from "../services/appointments";
import formatDate from "../utils/formatDate";
import { categoryLabels } from "../constants/appointment";

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
            <button
              type="button"
              className="rounded-md bg-red-700 px-3 py-2 text-sm text-white hover:bg-red-800"
              onClick={() => loadAppointment()}
            >
              Tentar novamente
            </button>
            <button
              type="button"
              className="rounded-md border border-[#536170] px-3 py-2 text-sm text-slate-200 hover:bg-[#2b323a]"
              onClick={onBack}
            >
              Voltar
            </button>
          </div>
        </div>
      </Panel>
    );
  }

  return (
    <Panel className="overflow-hidden p-0">
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
          <StatusBadge status={appointment.status} className="w-fit text-sm" />
        </div>
      </header>

      <article className="mx-auto max-w-4xl px-5 py-7 sm:px-8 sm:py-9">
        <p className="mt-3 text-lg font-medium text-slate-100">
              {appointment.nome_solicitante}
        </p>
        <dl className="grid gap-3 sm:grid-cols-3">
          <DetailField label="Categoria">
            {categoryLabels[appointment.categoria]}
          </DetailField>
          <DetailField label="Prioridade">
            <PriorityBadge priority={appointment.prioridade} />
          </DetailField>
          <DetailField label="Criada em">
            {formatDate(appointment.data_criacao)}
          </DetailField>
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

      <AppointmentActions
        status={appointment.status}
        appointmentId={appointment.id}
        onUpdateStatus={async (id, status) => {
          await onUpdateStatus(id, status);
          await loadAppointment(false);
        }}
        className="flex flex-wrap justify-end gap-2 border-t border-[#3f4b59] bg-[#141414] px-5 py-4 sm:px-8"
      />
    </Panel>
  );
}
