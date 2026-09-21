import type {
  Appointment,
  AppointmentFilters,
  AppointmentForm,
  PaginatedResponse,
  Status,
} from "../interfaces/Appointment";

const API_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:8000/api/v1";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, init);
  const body = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(body?.message ?? "Não foi possível concluir a operação.");
  }

  return body as T;
}

export function listAppointments(filters: AppointmentFilters) {
  const params = new URLSearchParams();
  if (filters.status) params.set("status", filters.status);
  if (filters.categoria) params.set("categoria", filters.categoria);
  if (filters.prioridade) params.set("prioridade", filters.prioridade);
  if (filters.page) params.set("page", String(filters.page));

  const query = params.toString();
  return request<PaginatedResponse<Appointment>>(
    `/appointments${query ? `?${query}` : ""}`,
  );
}

export function getAppointment(id: number) {
  return request<Appointment>(`/appointments/${id}`);
}

export function createAppointment(form: AppointmentForm) {
  return request<Appointment>("/appointments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...form,
      justificativa_prioridade:
        form.prioridade === "URGENTE"
          ? form.justificativa_prioridade
          : undefined,
    }),
  });
}

export function updateAppointmentStatus(id: number, status: Status) {
  return request<Appointment>(`/appointments/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
}
