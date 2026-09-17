import { FormEvent, useEffect, useMemo, useState } from 'react';

type Status = 'RECEBIDA' | 'EM_ANALISE' | 'AGENDADA' | 'CONCLUIDA' | 'CANCELADA';
type Prioridade = 'BAIXA' | 'MEDIA' | 'ALTA' | 'URGENTE';
type Categoria = 'CONSULTA' | 'EXAME' | 'VACINACAO' | 'OUTRO';

type Solicitacao = {
  id: number;
  protocolo: string;
  nome_solicitante: string;
  categoria: Categoria;
  prioridade: Prioridade;
  status: Status;
  descricao: string;
  justificativa_prioridade?: string;
  data_criacao: string;
  data_atualizacao: string;
};

const API_URL = 'http://localhost:8000/api/v1';

const initialForm = {
  nome_solicitante: '',
  categoria: 'CONSULTA' as Categoria,
  prioridade: 'MEDIA' as Prioridade,
  descricao: '',
  justificativa_prioridade: '',
};

export default function App() {
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState(initialForm);
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  const fetchSolicitacoes = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set('status', statusFilter);
      if (priorityFilter) params.set('prioridade', priorityFilter);

      const response = await fetch(`${API_URL}/solicitacoes?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Não foi possível carregar as solicitações.');
      }
      const data = await response.json();
      setSolicitacoes(Array.isArray(data.data) ? data.data : data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchSolicitacoes();
  }, [statusFilter, priorityFilter]);

  const resumo = useMemo(() => {
    const map = new Map<Status, number>();
    for (const item of solicitacoes) {
      map.set(item.status, (map.get(item.status) ?? 0) + 1);
    }
    return Array.from(map.entries()).map(([status, total]) => ({ status, total }));
  }, [solicitacoes]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const payload = {
        ...form,
        justificativa_prioridade: form.prioridade === 'URGENTE' ? form.justificativa_prioridade : undefined,
      };

      const response = await fetch(`${API_URL}/solicitacoes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message ?? 'Erro ao criar solicitação.');
      }

      setForm(initialForm);
      await fetchSolicitacoes();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar solicitação.');
    }
  };

  const atualizarStatus = async (id: number, status: Status) => {
    try {
      const response = await fetch(`${API_URL}/solicitacoes/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Não foi possível atualizar o status.');
      }

      await fetchSolicitacoes();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar status.');
    }
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Painel operacional</p>
          <h1>Solicitações de Atendimento</h1>
        </div>
      </header>

      <section className="summary-grid">
        {resumo.map((item) => (
          <article key={item.status} className="summary-card">
            <span>{item.status}</span>
            <strong>{item.total}</strong>
          </article>
        ))}
      </section>

      <main className="content-grid">
        <section className="panel">
          <h2>Nova solicitação</h2>
          <form onSubmit={handleSubmit} className="form-grid">
            <label>
              Nome do solicitante
              <input
                value={form.nome_solicitante}
                onChange={(event) => setForm({ ...form, nome_solicitante: event.target.value })}
                placeholder="Ex.: Maria Silva"
              />
            </label>

            <label>
              Categoria
              <select
                value={form.categoria}
                onChange={(event) => setForm({ ...form, categoria: event.target.value as Categoria })}
              >
                <option value="CONSULTA">CONSULTA</option>
                <option value="EXAME">EXAME</option>
                <option value="VACINACAO">VACINACAO</option>
                <option value="OUTRO">OUTRO</option>
              </select>
            </label>

            <label>
              Prioridade
              <select
                value={form.prioridade}
                onChange={(event) => setForm({ ...form, prioridade: event.target.value as Prioridade })}
              >
                <option value="BAIXA">BAIXA</option>
                <option value="MEDIA">MEDIA</option>
                <option value="ALTA">ALTA</option>
                <option value="URGENTE">URGENTE</option>
              </select>
            </label>

            <label className="full-width">
              Descrição
              <textarea
                value={form.descricao}
                onChange={(event) => setForm({ ...form, descricao: event.target.value })}
                rows={4}
              />
            </label>

            {form.prioridade === 'URGENTE' && (
              <label className="full-width">
                Justificativa da prioridade urgente
                <textarea
                  value={form.justificativa_prioridade}
                  onChange={(event) => setForm({ ...form, justificativa_prioridade: event.target.value })}
                  rows={3}
                />
              </label>
            )}

            <button type="submit" className="primary-btn">Salvar solicitação</button>
          </form>
        </section>

        <section className="panel">
          <h2>Solicitações</h2>

          <div className="filters">
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              <option value="">Todos os status</option>
              <option value="RECEBIDA">RECEBIDA</option>
              <option value="EM_ANALISE">EM_ANALISE</option>
              <option value="AGENDADA">AGENDADA</option>
              <option value="CONCLUIDA">CONCLUIDA</option>
              <option value="CANCELADA">CANCELADA</option>
            </select>

            <select value={priorityFilter} onChange={(event) => setPriorityFilter(event.target.value)}>
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
          ) : solicitacoes.length === 0 ? (
            <p>Nenhuma solicitação encontrada.</p>
          ) : (
            <div className="request-list">
              {solicitacoes.map((item) => (
                <article key={item.id} className="request-card">
                  <div className="request-head">
                    <strong>{item.protocolo}</strong>
                    <span className="badge">{item.status}</span>
                  </div>

                  <p>{item.nome_solicitante}</p>
                  <p>{item.categoria} · {item.prioridade}</p>
                  <p>{item.descricao}</p>

                  <div className="actions">
                    <button onClick={() => atualizarStatus(item.id, 'EM_ANALISE')}>Em análise</button>
                    <button onClick={() => atualizarStatus(item.id, 'AGENDADA')}>Agendar</button>
                    <button onClick={() => atualizarStatus(item.id, 'CONCLUIDA')}>Concluir</button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
