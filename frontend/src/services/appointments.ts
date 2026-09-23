import type {
  Appointment,
  AppointmentFilters,
  AppointmentForm,
  PaginatedResponse,
  Status,
} from "../interfaces/Appointment";

const API_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:8000/api/v1";

type ErrorResponse = {
  message?: unknown;
  code?: unknown;
  errors?: Record<string, unknown>;
};

const SERVER_ERROR_MESSAGES: Record<number, string> = {
  500: "Não foi possível concluir a operação. Tente novamente.",
  502: "O serviço está temporariamente indisponível. Tente novamente em instantes.",
  503: "O serviço está temporariamente indisponível. Tente novamente em instantes.",
  504: "O serviço demorou para responder. Tente novamente.",
};

function firstValidationMessage(body: ErrorResponse | null): string | null {
  if (!body?.errors || typeof body.errors !== "object") return null;

  for (const value of Object.values(body.errors)) {
    if (Array.isArray(value)) {
      const message = value.find((item): item is string => typeof item === "string");
      if (message) return message;
    }

    if (typeof value === "string") return value;
  }

  return null;
}

function getErrorMessage(response: Response, body: ErrorResponse | null): string {
  // Never render a server-provided 5xx message: it may contain stack traces,
  // SQL statements or infrastructure details from a misconfigured API/proxy.
  if (response.status >= 500) {
    return SERVER_ERROR_MESSAGES[response.status] ?? SERVER_ERROR_MESSAGES[500];
  }

  if (response.status === 422) {
    const validationMessage = firstValidationMessage(body);
    if (validationMessage) return validationMessage;
  }

  if (typeof body?.message === "string" && body.message.trim()) {
    return body.message;
  }

  if (response.status === 404) return "O recurso solicitado não foi encontrado.";
  if (response.status === 401 || response.status === 403) {
    return "Você não tem permissão para realizar esta operação.";
  }

  return "Não foi possível concluir a operação.";
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: {
        Accept: "application/json",
        ...init?.headers,
      },
    });
  } catch {
    throw new Error(
      "Não foi possível conectar ao serviço. Verifique sua conexão e tente novamente.",
    );
  }

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(getErrorMessage(response, body as ErrorResponse | null));
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

export function getAppointmentSummary(filters: AppointmentFilters) {
  const params = new URLSearchParams();
  if (filters.status) params.set("status", filters.status);
  if (filters.categoria) params.set("categoria", filters.categoria);
  if (filters.prioridade) params.set("prioridade", filters.prioridade);

  const query = params.toString();
  return request<Array<{ status: Status; total: number }>>(
    `/appointments/summary${query ? `?${query}` : ""}`,
  );
}

export function getAppointment(id: number) {
  return request<Appointment>(`/appointments/${id}`);
}

export function createAppointment(form: AppointmentForm) {
  return request<Appointment>("/appointments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(form),
  });
}

export function updateAppointmentStatus(id: number, status: Status) {
  return request<Appointment>(`/appointments/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
}
