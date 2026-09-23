import { beforeEach, describe, expect, it, vi } from "vitest";
import type { AppointmentForm } from "../interfaces/Appointment";
import {
  createAppointment,
  getAppointment,
  listAppointments,
  updateAppointmentStatus,
} from "./appointments";

const API_URL = "http://localhost:8000/api/v1";
const fetchMock = vi.fn();

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

beforeEach(() => {
  vi.stubGlobal("fetch", fetchMock);
});

describe("appointments service", () => {
  it("envia os filtros preenchidos na query da listagem", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({
        data: [],
        current_page: 2,
        last_page: 2,
        per_page: 15,
        total: 16,
      }),
    );

    await listAppointments({
      status: "RECEBIDA",
      categoria: "EXAME",
      prioridade: "ALTA",
      page: 2,
    });

    expect(fetchMock).toHaveBeenCalledWith(
      `${API_URL}/appointments?status=RECEBIDA&categoria=EXAME&prioridade=ALTA&page=2`,
      expect.objectContaining({
        headers: { Accept: "application/json" },
      }),
    );
  });

  it("não envia justificativa para uma solicitação que não é urgente", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ id: 1 }, 201));
    const form: AppointmentForm = {
      nome_solicitante: "Maria Silva",
      categoria: "CONSULTA",
      prioridade: "MEDIA",
      descricao: "Consulta de rotina.",
      justificativa_prioridade: "Este texto não deve ser enviado.",
    };

    await createAppointment(form);

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe(`${API_URL}/appointments`);
    expect(init.method).toBe("POST");
    expect(init.headers).toEqual({
      Accept: "application/json",
      "Content-Type": "application/json",
    });
    expect(JSON.parse(String(init.body))).toEqual({
      nome_solicitante: "Maria Silva",
      categoria: "CONSULTA",
      prioridade: "MEDIA",
      descricao: "Consulta de rotina.",
    });
  });

  it("envia a transição de status no endpoint correspondente", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ id: 15, status: "AGENDADA" }));

    await updateAppointmentStatus(15, "AGENDADA");

    expect(fetchMock).toHaveBeenCalledWith(
      `${API_URL}/appointments/15/status`,
      expect.objectContaining({
        method: "PATCH",
        body: JSON.stringify({ status: "AGENDADA" }),
      }),
    );
  });

  it("apresenta a primeira mensagem de validação devolvida pela API", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse(
        {
          message: "Os dados são inválidos.",
          errors: { descricao: ["A descrição é obrigatória."] },
        },
        422,
      ),
    );

    await expect(getAppointment(1)).rejects.toThrow(
      "A descrição é obrigatória.",
    );
  });

  it("não expõe mensagens internas em erros do servidor", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({ message: "SQLSTATE: detalhes internos" }, 500),
    );

    await expect(getAppointment(1)).rejects.toThrow(
      "Não foi possível concluir a operação. Tente novamente.",
    );
  });

  it("apresenta uma mensagem compreensível quando não consegue conectar", async () => {
    fetchMock.mockRejectedValue(new TypeError("Failed to fetch"));

    await expect(getAppointment(1)).rejects.toThrow(
      "Não foi possível conectar ao serviço. Verifique sua conexão e tente novamente.",
    );
  });
});
