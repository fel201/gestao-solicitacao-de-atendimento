type AppointmentFiltersProps = {
  status: string;
  category: string;
  priority: string;
  onStatusChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onPriorityChange: (value: string) => void;
  onApply: () => void;
};

const selectClass = 'w-full rounded-md border border-[#536170] bg-[#262626] p-2 text-slate-100';

export default function AppointmentFilters({ status, category, priority, onStatusChange, onCategoryChange, onPriorityChange, onApply }: AppointmentFiltersProps) {
  return (
    <div className="mb-5 rounded-lg border border-[#3f4b59] bg-[#202020] p-4">
      <div className="mb-3">
        <h3 className="font-medium text-slate-100">Filtros</h3>
        <p className="text-sm text-slate-400">Defina os critérios e aplique a busca.</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:items-end">
        <label className="flex flex-col gap-1 text-sm text-slate-300">Status<select className={selectClass} value={status} onChange={(event) => onStatusChange(event.target.value)}><option value="">Todos os status</option><option value="RECEBIDA">RECEBIDA</option><option value="EM_ANALISE">EM_ANALISE</option><option value="AGENDADA">AGENDADA</option><option value="CONCLUIDA">CONCLUIDA</option><option value="CANCELADA">CANCELADA</option></select></label>
        <label className="flex flex-col gap-1 text-sm text-slate-300">Categoria<select className={selectClass} value={category} onChange={(event) => onCategoryChange(event.target.value)}><option value="">Todas as categorias</option><option value="CONSULTA">CONSULTA</option><option value="EXAME">EXAME</option><option value="VACINACAO">VACINACAO</option><option value="OUTRO">OUTRO</option></select></label>
        <label className="flex flex-col gap-1 text-sm text-slate-300">Prioridade<select className={selectClass} value={priority} onChange={(event) => onPriorityChange(event.target.value)}><option value="">Todas as prioridades</option><option value="BAIXA">BAIXA</option><option value="MEDIA">MEDIA</option><option value="ALTA">ALTA</option><option value="URGENTE">URGENTE</option></select></label>
        <button type="button" className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700" onClick={onApply}>Aplicar filtros</button>
      </div>
    </div>
  );
}
