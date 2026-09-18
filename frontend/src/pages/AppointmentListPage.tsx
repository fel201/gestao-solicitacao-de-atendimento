import AppointmentView from '../components/AppointmentView';
import type { Appointment, Status } from '../interfaces/Appointment';

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
  onRetry: () => void;
  onViewDetails: (appointment: Appointment) => void;
  onUpdateStatus: (id: number, status: Status) => void;
};

export default function AppointmentListPage(props: AppointmentListPageProps) {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {props.summary.map((item) => (
          <article key={item.status} className="rounded-xl border border-[#3f4b59] p-4 shadow-sm">
            <span className="mb-2 block text-slate-300">{item.status}</span>
            <strong className="text-2xl text-slate-100">{item.total}</strong>
          </article>
        ))}
      </section>
      <AppointmentView {...props} />
    </div>
  );
}