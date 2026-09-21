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

export type AppointmentListItem = Pick<
  Appointment,
  | "id"
  | "protocolo"
  | "nome_solicitante"
  | "categoria"
  | "prioridade"
  | "status"
  | "descricao"
>;

export type AppointmentFilters = {
  status?: string;
  categoria?: string;
  prioridade?: string;
  page?: number;
};

export type PaginatedResponse<T> = {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

export type AppointmentForm = {
  nome_solicitante: string;
  categoria: Category;
  prioridade: Priority;
  descricao: string;
  justificativa_prioridade: string;
};
