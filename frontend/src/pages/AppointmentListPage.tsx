import AppointmentView from "../components/AppointmentView";
import StatusSummary from "../components/StatusSummary/StatusSummary";
import type { Appointment, Status } from "../interfaces/Appointment";

type AppointmentListPageProps = {
  appointments: Appointment[];
  summary: Array<{ status: Status; total: number }>;
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

export default function AppointmentListPage(props: AppointmentListPageProps) {
  return (
    <div className="space-y-6">
      <StatusSummary summary={props.summary} />
      <AppointmentView {...props} />
    </div>
  );
}
