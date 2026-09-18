import type { Appointment, Status } from '../interfaces/Appointment';
import { nextStatuses, statusLabels } from '../utils/appointmentStatus';
import AppointmentListFeedback from './AppointmentListFeedback';

type AppointmentViewProps = {
  appointments: Appointment[];
  loading: boolean;
  error: string | null;
  statusFilter: string;
  categoryFilter: string;
  priorityFilter: string;
  onStatusFilterChange: (value: string) => void;
  onCategoryFilterChange: (value: string) => void;
  onPriorityFilterChange: (value: string) => void;
  onRetry: () => void;
  onViewDetails: (appointment: Appointment) => void;
  onUpdateStatus: (id: number, status: Status) => void;
};

export default function AppointmentView({
  appointments,
  loading,
  error,
  statusFilter,
  categoryFilter,
  priorityFilter,
  onStatusFilterChange,
  onCategoryFilterChange,
  onPriorityFilterChange,
  onRetry,
  onViewDetails,
  onUpdateStatus,
}: AppointmentViewProps) {
  return (
    <section className="bg-[#2D2D2D] border border-[#3f4b59] rounded-xl p-4">
      <h2 className="text-lg font-semibold mb-3 text-slate-100">Solicitações</h2>

      <div className="flex gap-3 mb-4">
        <select
          className="bg-[#151a20] border border-[#536170] rounded-md text-slate-100 p-3"
          value={statusFilter}
          onChange={(event) => onStatusFilterChange(event.target.value)}
        >
          <option value="">Todos os status</option>
          <option value="RECEBIDA">RECEBIDA</option>
          <option value="EM_ANALISE">EM_ANALISE</option>
          <option value="AGENDADA">AGENDADA</option>
          <option value="CONCLUIDA">CONCLUIDA</option>
          <option value="CANCELADA">CANCELADA</option>
        </select>

        <select
          className="bg-[#151a20] border border-[#536170] rounded-md text-slate-100 p-2"
          value={categoryFilter}
          onChange={(event) => onCategoryFilterChange(event.target.value)}
        >
          <option value="">Todas as categorias</option>
          <option value="CONSULTA">CONSULTA</option>
          <option value="EXAME">EXAME</option>
          <option value="VACINACAO">VACINACAO</option>
          <option value="OUTRO">OUTRO</option>
        </select>

        <select
          className="bg-[#151a20] border border-[#536170] rounded-md text-slate-100 p-2"
          value={priorityFilter}
          onChange={(event) => onPriorityFilterChange(event.target.value)}
        >
          <option value="">Todas as prioridades</option>
          <option value="BAIXA">BAIXA</option>
          <option value="MEDIA">MEDIA</option>
          <option value="ALTA">ALTA</option>
          <option value="URGENTE">URGENTE</option>
        </select>
      </div>

      <AppointmentListFeedback
        loading={loading}
        error={error}
        isEmpty={appointments.length === 0}
        hasFilters={Boolean(statusFilter || categoryFilter || priorityFilter)}
        onRetry={onRetry}
      />

      {!loading && !error && appointments.length > 0 && (
        <div className="flex flex-col gap-3">
          {appointments.map((item) => (
            <article key={item.id} className="border border-[#536170] rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <strong className="text-slate-100">{item.protocolo}</strong>
                <span className="inline-flex items-center rounded-full px-3 py-1 text-xs bg-blue-100 border border-blue-200 text-blue-800">{item.status}</span>
              </div>

              <p className="text-slate-200">{item.nome_solicitante}</p>
              <p className="text-slate-400">{item.categoria} · {item.prioridade}</p>

              <button
                type="button"
                className="mt-3 text-cyan-300 hover:text-cyan-200 font-medium text-sm underline"
                onClick={() => onViewDetails(item)}
              >
                Ver detalhes
              </button>

              {nextStatuses[item.status].length > 0 && (
                <div className="flex gap-2 mt-3 flex-wrap">
                  {nextStatuses[item.status].map((nextStatus) => (
                    <button
                      key={nextStatus}
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-3 py-1 text-sm"
                      onClick={() => onUpdateStatus(item.id, nextStatus)}
                    >
                      {statusLabels[nextStatus]}
                    </button>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
