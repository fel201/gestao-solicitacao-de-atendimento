import type {
  Appointment,
  Category,
  FilterValue,
  Priority,
  Status,
} from "../interfaces/Appointment";
import AppointmentCard from "../components/appointment/AppointmentCard";
import AppointmentFilters from "../components/appointment/AppointmentFilters";
import AppointmentListFeedback from "../components/appointment/AppointmentListFeedback";
import StatusSummary from "../components/appointment/StatusSummary";
import Panel from "../components/ui/Panel";

type AppointmentViewProps = {
  appointments: Appointment[];
  summary: Array<{ status: Status; total: number }>;
  loading: boolean;
  error: string | null;
  statusFilter: FilterValue<Status>;
  categoryFilter: FilterValue<Category>;
  priorityFilter: FilterValue<Priority>;
  onStatusFilterChange: (value: FilterValue<Status>) => void;
  onCategoryFilterChange: (value: FilterValue<Category>) => void;
  onPriorityFilterChange: (value: FilterValue<Priority>) => void;
  onApplyFilters: () => void;
  hasAppliedFilters: boolean;
  onRetry: () => void;
  currentPage: number;
  lastPage: number;
  total: number;
  onPageChange: (page: number) => void;
  onViewDetails: (appointment: Appointment) => void;
  onUpdateStatus: (id: number, status: Status) => Promise<void>;
};

export default function AppointmentView({
  appointments,
  summary,
  loading,
  error,
  statusFilter,
  categoryFilter,
  priorityFilter,
  onStatusFilterChange,
  onCategoryFilterChange,
  onPriorityFilterChange,
  onApplyFilters,
  hasAppliedFilters,
  onRetry,
  currentPage,
  lastPage,
  total,
  onPageChange,
  onViewDetails,
  onUpdateStatus,
}: AppointmentViewProps) {
  return (
    <div className="space-y-6">
      <StatusSummary summary={summary} />
      <Panel>
        <h2 className="mb-3 text-lg font-semibold text-slate-100">
          Solicitações
        </h2>

        <AppointmentFilters
          status={statusFilter}
          category={categoryFilter}
          priority={priorityFilter}
          onStatusChange={onStatusFilterChange}
          onCategoryChange={onCategoryFilterChange}
          onPriorityChange={onPriorityFilterChange}
          onApply={onApplyFilters}
        />

        <AppointmentListFeedback
          loading={loading}
          error={error}
          isEmpty={appointments.length === 0}
          hasFilters={hasAppliedFilters}
          onRetry={onRetry}
        />

        {!loading && !error && appointments.length > 0 && (
          <div className="space-y-5">
            <div className="flex flex-col gap-5">
              {appointments.map((item) => (
                <AppointmentCard
                  key={item.id}
                  appointment={item}
                  onViewDetails={onViewDetails}
                  onUpdateStatus={onUpdateStatus}
                />
              ))}
            </div>
            <nav
              className="flex flex-wrap items-center justify-between gap-3 border-t border-[#3f4b59] pt-4"
              aria-label="Paginação de solicitações"
            >
              <span className="text-sm text-slate-400">
                {total} {total === 1 ? "solicitação" : "solicitações"} · Página {currentPage} de {lastPage}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="rounded-md border border-[#536170] px-3 py-2 text-sm text-slate-200 hover:bg-[#2b323a] disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={currentPage === 1}
                  onClick={() => onPageChange(currentPage - 1)}
                >
                  Anterior
                </button>
                <button
                  type="button"
                  className="rounded-md border border-[#536170] px-3 py-2 text-sm text-slate-200 hover:bg-[#2b323a] disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={currentPage === lastPage}
                  onClick={() => onPageChange(currentPage + 1)}
                >
                  Próxima
                </button>
              </div>
            </nav>
          </div>
        )}
      </Panel>
    </div>
  );
}
