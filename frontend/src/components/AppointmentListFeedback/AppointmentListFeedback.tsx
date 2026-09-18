type AppointmentListFeedbackProps = { loading: boolean; error: string | null; isEmpty: boolean; hasFilters: boolean; onRetry: () => void };

function LoadingState() {
  return <div className="space-y-3" role="status" aria-label="Carregando solicitações"><div className="flex items-center gap-2 text-slate-300"><span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-400 border-t-blue-600" /><span>Carregando solicitações...</span></div>{[1, 2, 3].map((item) => <div key={item} className="animate-pulse rounded-lg border border-[#536170] bg-[#161616] p-4"><div className="h-4 w-1/3 rounded bg-slate-600" /><div className="mt-3 h-3 w-2/3 rounded bg-slate-600" /><div className="mt-2 h-3 w-1/2 rounded bg-slate-600" /></div>)}</div>;
}

export default function AppointmentListFeedback({ loading, error, isEmpty, hasFilters, onRetry }: AppointmentListFeedbackProps) {
  if (loading) return <LoadingState />;
  if (error) return <div className="rounded-md border border-red-200 bg-red-50 p-4 text-red-800" role="alert"><p className="font-medium">Não foi possível carregar as solicitações.</p><p className="mt-1 text-sm">{error}</p><button type="button" className="mt-3 rounded-md bg-red-700 px-3 py-2 text-sm text-white hover:bg-red-800" onClick={onRetry}>Tentar novamente</button></div>;
  if (isEmpty) return <div className="rounded-md border border-[#536170] bg-[#2b323a] p-6 text-center text-slate-400"><p className="font-medium text-slate-100">{hasFilters ? 'Nenhuma solicitação corresponde aos filtros.' : 'Nenhuma solicitação cadastrada.'}</p><p className="mt-1 text-sm">{hasFilters ? 'Tente remover ou alterar os filtros.' : 'As novas solicitações aparecerão aqui.'}</p></div>;
  return null;
}
