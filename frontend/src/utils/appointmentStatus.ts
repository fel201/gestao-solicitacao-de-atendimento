import type { Priority, Status } from '../interfaces/Appointment';

export const nextStatuses: Record<Status, Status[]> = {
  RECEBIDA: ['EM_ANALISE', 'CANCELADA'],
  EM_ANALISE: ['AGENDADA', 'CANCELADA'],
  AGENDADA: ['CONCLUIDA', 'CANCELADA'],
  CONCLUIDA: [],
  CANCELADA: [],
};

export const statusLabels: Record<Status, string> = {
  RECEBIDA: 'Recebida',
  EM_ANALISE: 'Em análise',
  AGENDADA: 'Agendar',
  CONCLUIDA: 'Concluir',
  CANCELADA: 'Cancelar',
};

export const statusBadgeClasses: Record<Status, string> = {
  RECEBIDA: 'border-slate-500 bg-slate-700 text-slate-100',
  EM_ANALISE: 'border-amber-400/50 bg-amber-400/15 text-amber-200',
  AGENDADA: 'border-blue-400/50 bg-blue-500/20 text-blue-200',
  CONCLUIDA: 'border-emerald-400/50 bg-emerald-500/20 text-emerald-200',
  CANCELADA: 'border-slate-600 bg-slate-800 text-slate-400',
};

export const priorityBadgeClasses = {
  BAIXA: 'text-slate-400',
  MEDIA: 'text-slate-300',
  ALTA: 'font-semibold text-orange-300',
  URGENTE: 'font-semibold text-red-300',
} as const;

export const priorityBorderClasses: Record<Priority, string> = {
  BAIXA: 'border-l-slate-500',
  MEDIA: 'border-l-sky-500',
  ALTA: 'border-l-orange-500',
  URGENTE: 'border-l-red-500',
};