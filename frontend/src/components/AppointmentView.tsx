type Status = 'RECEBIDA' | 'EM_ANALISE' | 'AGENDADA' | 'CONCLUIDA' | 'CANCELADA';
type Priority = 'BAIXA' | 'MEDIA' | 'ALTA' | 'URGENTE';
type Category = 'CONSULTA' | 'EXAME' | 'VACINACAO' | 'OUTRO';

type Appointment = {
  id: number;
  protocol: string;
  applicantName: string;
  category: Category;
  priority: Priority;
  status: Status;
  description: string;
  priorityJustification?: string;
  createdAt: string;
  updatedAt: string;
};

type AppointmentViewProps = {
  appointments: Appointment[];
  loading: boolean;
  error: string | null;
  statusFilter: string;
  priorityFilter: string;
  onStatusFilterChange: (value: string) => void;
  onPriorityFilterChange: (value: string) => void;
  onUpdateStatus: (id: number, status: Status) => void;
};

export default function AppointmentView({
  appointments,
  loading,
  error,
  statusFilter,
  priorityFilter,
  onStatusFilterChange,
  onPriorityFilterChange,
  onUpdateStatus,
}: AppointmentViewProps) {
  return (
    <section className="bg-[#d3d3d3] border border-slate-300 rounded-xl p-4">
      <h2 className="text-lg font-semibold mb-3 text-slate-900">Solicitações</h2>

      <div className="flex gap-3 mb-4">
        <select
          className="bg-white border border-slate-300 rounded-md text-slate-900 p-3"
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
          className="bg-white border border-slate-300 rounded-md text-slate-900 p-2"
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

      {error && <div className="rounded-md p-3 mb-3 bg-red-50 text-red-800 border border-red-200">{error}</div>}

      {loading ? (
        <p>Carregando...</p>
      ) : appointments.length === 0 ? (
        <p>Nenhuma solicitação encontrada.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {appointments.map((item) => (
            <article key={item.id} className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <strong className="text-slate-900">{item.protocol}</strong>
                <span className="inline-flex items-center rounded-full px-3 py-1 text-xs bg-blue-100 border border-blue-200 text-blue-800">{item.status}</span>
              </div>

              <p className="text-slate-800">{item.applicantName}</p>
              <p className="text-slate-600">{item.category} · {item.priority}</p>
              <p className="mt-2 text-slate-700">{item.description}</p>

              <div className="flex gap-2 mt-3 flex-wrap">
                <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-3 py-1 text-sm" onClick={() => onUpdateStatus(item.id, 'EM_ANALISE')}>Em análise</button>
                <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-3 py-1 text-sm" onClick={() => onUpdateStatus(item.id, 'AGENDADA')}>Agendar</button>
                <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-3 py-1 text-sm" onClick={() => onUpdateStatus(item.id, 'CONCLUIDA')}>Concluir</button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
