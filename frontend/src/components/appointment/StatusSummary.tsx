import type { Status } from "../../interfaces/Appointment";

type StatusSummaryProps = { summary: Array<{ status: Status; total: number }> };

export default function StatusSummary({ summary }: StatusSummaryProps) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {summary.map((item) => (
        <article
          key={item.status}
          className="rounded-xl border border-[#3f4b59] p-5 shadow-sm"
        >
          <span className="mb-2 block text-slate-300">{item.status}</span>
          <strong className="text-2xl text-slate-100">{item.total}</strong>
        </article>
      ))}
    </section>
  );
}
