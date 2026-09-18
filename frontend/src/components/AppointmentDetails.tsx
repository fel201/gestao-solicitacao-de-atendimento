import type { Appointment, Status } from '../interfaces/Appointment';
import { nextStatuses, priorityBadgeClasses, statusBadgeClasses, statusLabels } from '../utils/appointmentStatus';
import Panel from './Panel/Panel';

type AppointmentDetailsProps = {
  appointment: Appointment;
  error: string | null;
  onBack: () => void;
  onRetry: () => void;
  onUpdateStatus: (id: number, status: Status) => void;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'medium',
    timeStyle: 'short',
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

  return (
    <Panel className="p-5">
      {error && (
        <div className="mb-5 rounded-md border border-red-200 bg-red-50 p-4 text-red-800" role="alert">
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

      <button
        type="button"
        className="text-cyan-300 hover:text-cyan-200 font-medium text-sm mb-5"
        onClick={onBack}
      >
        ← Voltar para solicitações
      </button>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-wide text-slate-400">Detalhes da solicitação</p>
          <h2 className="text-2xl font-semibold text-slate-100">{appointment.protocolo}</h2>
        </div>
        <span className={`inline-flex w-fit items-center rounded-full border px-3 py-1 text-sm ${statusBadgeClasses[appointment.status]}`}>
          {appointment.status}
        </span>
      </div>

      <dl className="grid gap-4 mt-6 sm:grid-cols-2">
        <div>
          <dt className="text-sm text-slate-400">Nome do solicitante</dt>
          <dd className="font-medium text-slate-100">{appointment.nome_solicitante}</dd>
        </div>
        <div>
          <dt className="text-sm text-slate-400">Categoria</dt>
          <dd className="font-medium text-slate-100">{appointment.categoria}</dd>
        </div>
        <div>
          <dt className="text-sm text-slate-400">Prioridade</dt>
          <dd className={`font-medium ${priorityBadgeClasses[appointment.prioridade]}`}>{appointment.prioridade}</dd>
        </div>
        <div>
          <dt className="text-sm text-slate-400">Criada em</dt>
          <dd className="font-medium text-slate-100">{formatDate(appointment.data_criacao)}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-sm text-slate-400">Descrição</dt>
          <dd className="whitespace-pre-wrap text-slate-100">{appointment.descricao}</dd>
        </div>
        {appointment.justificativa_prioridade && (
          <div className="sm:col-span-2">
            <dt className="text-sm text-slate-400">Justificativa da prioridade</dt>
            <dd className="whitespace-pre-wrap text-slate-100">{appointment.justificativa_prioridade}</dd>
          </div>
        )}
        <div>
          <dt className="text-sm text-slate-400">Última atualização</dt>
          <dd className="font-medium text-slate-100">{formatDate(appointment.data_atualizacao)}</dd>
        </div>
      </dl>

      {allowedStatuses.length > 0 && (
        <div className="flex gap-2 mt-7 flex-wrap">
          {allowedStatuses.map((status) => (
            <button
              key={status}
              type="button"
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-4 py-2 text-sm"
              onClick={() => onUpdateStatus(appointment.id, status)}
            >
              {statusLabels[status]}
            </button>
          ))}
        </div>
      )}
    </Panel>
  );
}