import type { Priority, Status } from "../interfaces/Appointment";

export const nextStatuses: Record<Status, Status[]> = {
  RECEBIDA: ["EM_ANALISE", "CANCELADA"],
  EM_ANALISE: ["AGENDADA", "CANCELADA"],
  AGENDADA: ["CONCLUIDA", "CANCELADA"],
  CONCLUIDA: [],
  CANCELADA: [],
};

export const statusLabels: Record<Status, string> = {
  RECEBIDA: "Recebida",
  EM_ANALISE: "Iniciar análise",
  AGENDADA: "Agendar",
  CONCLUIDA: "Concluir",
  CANCELADA: "Cancelar solicitação",
};

export const statusBadgeClasses: Record<Status, string> = {
  RECEBIDA: "border-slate-500 bg-slate-700 text-slate-100",
  EM_ANALISE: "border-amber-400/50 bg-amber-400/15 text-amber-200",
  AGENDADA: "border-blue-400/50 bg-blue-500/20 text-blue-200",
  CONCLUIDA: "border-emerald-400/50 bg-emerald-500/20 text-emerald-200",
  CANCELADA: "border-slate-600 bg-slate-800 text-slate-400",
};

export const priorityBadgeClasses = {
  BAIXA: "border-slate-600 bg-slate-800 text-slate-300",
  MEDIA: "border-sky-500/50 bg-sky-500/15 text-sky-200",
  ALTA: "border-orange-400/50 bg-orange-400/15 font-semibold text-orange-200",
  URGENTE: "border-red-400/50 bg-red-400/15 font-semibold text-red-200",
} as const;

export const categoryBadgeClass =
  "border-slate-600 bg-slate-800 text-slate-300";

export const priorityLabels: Record<Priority, string> = {
  BAIXA: "Baixa",
  MEDIA: "Média",
  ALTA: "Alta",
  URGENTE: "Urgente",
};

export const priorityBorderClasses: Record<Priority, string> = {
  BAIXA: "border-l-slate-500",
  MEDIA: "border-l-sky-500",
  ALTA: "border-l-orange-500",
  URGENTE: "border-l-red-500",
};

export const statusActionClasses: Record<Status, string> = {
  RECEBIDA: "bg-slate-600 text-white hover:bg-slate-500",
  EM_ANALISE: "bg-blue-600 text-white hover:bg-blue-700",
  AGENDADA: "bg-blue-600 text-white hover:bg-blue-700",
  CONCLUIDA: "bg-emerald-600 text-white hover:bg-emerald-700",
  CANCELADA:
    "border border-red-400/70 bg-transparent text-red-300 hover:bg-red-400/10",
};
