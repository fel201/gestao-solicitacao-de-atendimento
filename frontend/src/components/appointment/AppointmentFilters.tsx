import {
  categoryLabels,
  priorityLabels,
  statusDisplayLabels,
} from "../../constants/appointment";
import type {
  Category,
  FilterValue,
  Priority,
  Status,
} from "../../interfaces/Appointment";

type AppointmentFiltersProps = {
  status: FilterValue<Status>;
  category: FilterValue<Category>;
  priority: FilterValue<Priority>;
  onStatusChange: (value: FilterValue<Status>) => void;
  onCategoryChange: (value: FilterValue<Category>) => void;
  onPriorityChange: (value: FilterValue<Priority>) => void;
  onApply: () => void;
};

const selectClass =
  "w-full rounded-md border border-[#536170] bg-[#262626] p-2 text-slate-100";

export default function AppointmentFilters({
  status,
  category,
  priority,
  onStatusChange,
  onCategoryChange,
  onPriorityChange,
  onApply,
}: AppointmentFiltersProps) {
  return (
    <div className="mb-5 rounded-lg border border-[#3f4b59] bg-[#202020] p-4">
      <div className="mb-3">
        <h3 className="font-medium text-slate-100">Filtros</h3>
        <p className="text-sm text-slate-400">
          Defina os critérios e aplique a busca.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:items-end">
        <label className="flex flex-col gap-1 text-sm text-slate-300">
          Status
          <select
            className={selectClass}
            value={status}
            onChange={(event) =>
              onStatusChange(event.target.value as FilterValue<Status>)
            }
          >
            <option value="">Todos os status</option>
            <option value="RECEBIDA">{statusDisplayLabels.RECEBIDA}</option>
            <option value="EM_ANALISE">{statusDisplayLabels.EM_ANALISE}</option>
            <option value="AGENDADA">{statusDisplayLabels.AGENDADA}</option>
            <option value="CONCLUIDA">{statusDisplayLabels.CONCLUIDA}</option>
            <option value="CANCELADA">{statusDisplayLabels.CANCELADA}</option>
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm text-slate-300">
          Categoria
          <select
            className={selectClass}
            value={category}
            onChange={(event) =>
              onCategoryChange(event.target.value as FilterValue<Category>)
            }
          >
            <option value="">Todas as categorias</option>
            <option value="CONSULTA">{categoryLabels.CONSULTA}</option>
            <option value="EXAME">{categoryLabels.EXAME}</option>
            <option value="VACINACAO">{categoryLabels.VACINACAO}</option>
            <option value="OUTRO">{categoryLabels.OUTRO}</option>
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm text-slate-300">
          Prioridade
          <select
            className={selectClass}
            value={priority}
            onChange={(event) =>
              onPriorityChange(event.target.value as FilterValue<Priority>)
            }
          >
            <option value="">Todas as prioridades</option>
            <option value="BAIXA">{priorityLabels.BAIXA}</option>
            <option value="MEDIA">{priorityLabels.MEDIA}</option>
            <option value="ALTA">{priorityLabels.ALTA}</option>
            <option value="URGENTE">{priorityLabels.URGENTE}</option>
          </select>
        </label>
        <button
          type="button"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          onClick={onApply}
        >
          Aplicar filtros
        </button>
      </div>
    </div>
  );
}
