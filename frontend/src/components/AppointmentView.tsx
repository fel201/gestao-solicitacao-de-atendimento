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
    <section className="panel">
      <h2>Solicitações</h2>

      <div className="filters">
        <select value={statusFilter} onChange={(event) => onStatusFilterChange(event.target.value)}>
          <option value="">Todos os status</option>
          <option value="RECEBIDA">RECEBIDA</option>
          <option value="EM_ANALISE">EM_ANALISE</option>
          <option value="AGENDADA">AGENDADA</option>
          <option value="CONCLUIDA">CONCLUIDA</option>
          <option value="CANCELADA">CANCELADA</option>
        </select>

        <select value={priorityFilter} onChange={(event) => onPriorityFilterChange(event.target.value)}>
          <option value="">Todas as prioridades</option>
          <option value="BAIXA">BAIXA</option>
          <option value="MEDIA">MEDIA</option>
          <option value="ALTA">ALTA</option>
          <option value="URGENTE">URGENTE</option>
        </select>
      </div>

      {error && <div className="alert error">{error}</div>}

      {loading ? (
        <p>Carregando...</p>
      ) : appointments.length === 0 ? (
        <p>Nenhuma solicitação encontrada.</p>
      ) : (
        <div className="request-list">
          {appointments.map((item) => (
            <article key={item.id} className="request-card">
              <div className="request-head">
                <strong>{item.protocol}</strong>
                <span className="badge">{item.status}</span>
              </div>

              <p>{item.applicantName}</p>
              <p>{item.category} · {item.priority}</p>
              <p>{item.description}</p>

              <div className="actions">
                <button onClick={() => onUpdateStatus(item.id, 'EM_ANALISE')}>Em análise</button>
                <button onClick={() => onUpdateStatus(item.id, 'AGENDADA')}>Agendar</button>
                <button onClick={() => onUpdateStatus(item.id, 'CONCLUIDA')}>Concluir</button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
