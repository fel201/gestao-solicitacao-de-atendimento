import type { Appointment, Status } from '../interfaces/Appointment';
import AppointmentCard from './AppointmentCard/AppointmentCard';
import AppointmentFilters from './AppointmentFilters/AppointmentFilters';
import AppointmentListFeedback from './AppointmentListFeedback/AppointmentListFeedback';
import Panel from './Panel/Panel';

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
  onApplyFilters: () => void;
  hasAppliedFilters: boolean;
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
  onApplyFilters,
  hasAppliedFilters,
  onRetry,
  onViewDetails,
  onUpdateStatus,
}: AppointmentViewProps) {
  return (
    <Panel>
      <h2 className="text-lg font-semibold mb-3 text-slate-100">Solicitações</h2>

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
        <div className="flex flex-col gap-3">
          {appointments.map((item) => (
            <AppointmentCard key={item.id} appointment={item} onViewDetails={onViewDetails} onUpdateStatus={onUpdateStatus} />
          ))}
        </div>
      )}
    </Panel>
  );
}
