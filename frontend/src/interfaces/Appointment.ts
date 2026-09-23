export type Status =
  | "RECEBIDA"
  | "EM_ANALISE"
  | "AGENDADA"
  | "CONCLUIDA"
  | "CANCELADA";
export type Priority = "BAIXA" | "MEDIA" | "ALTA" | "URGENTE";
export type Category = "CONSULTA" | "EXAME" | "VACINACAO" | "OUTRO";

export type Appointment = {
  id: number;
  protocolo: string;
  nome_solicitante: string;
  categoria: Category;
  prioridade: Priority;
  status: Status;
  descricao: string;
  justificativa_prioridade?: string;
  data_criacao: string;
  data_atualizacao: string;
};

export type AppointmentFilters = {
  status?: Status;
  categoria?: Category;
  prioridade?: Priority;
  pagina?: number;
};

export type FilterValue<T> = T | "";

export type PaginatedResponse<T> = {
  dados: T[];
  pagina_atual: number;
  ultima_pagina: number;
  itens_por_pagina: number;
  total: number;
};

export type AppointmentForm = {
  nome_solicitante: string;
  categoria: Category;
  prioridade: Priority;
  descricao: string;
  justificativa_prioridade: string;
};
