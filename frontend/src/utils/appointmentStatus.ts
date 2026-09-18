import type { Status } from '../interfaces/Appointment';

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