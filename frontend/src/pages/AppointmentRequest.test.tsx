import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { AppointmentForm } from "../interfaces/Appointment";
import AppointmentRequest from "./AppointmentRequest";

const validForm: AppointmentForm = {
  nome_solicitante: "Maria Silva",
  categoria: "CONSULTA",
  prioridade: "MEDIA",
  descricao: "Consulta de rotina.",
  justificativa_prioridade: "",
};

function renderForm(form: AppointmentForm) {
  const onSubmit = vi.fn().mockResolvedValue(undefined);

  render(
    <AppointmentRequest
      form={form}
      setForm={vi.fn()}
      onSubmit={onSubmit}
      isSubmitting={false}
      submitSuccess={false}
      submitError={null}
    />,
  );

  return { onSubmit };
}

describe("AppointmentRequest", () => {
  it("não envia o formulário quando os campos de texto obrigatórios estão vazios", async () => {
    const user = userEvent.setup();
    const { onSubmit } = renderForm({
      ...validForm,
      nome_solicitante: " ",
      descricao: "",
    });

    await user.click(
      screen.getByRole("button", { name: "Salvar solicitação" }),
    );

    expect(screen.getByText("Informe o nome do paciente.")).toBeInTheDocument();
    expect(screen.getByText("Descreva a solicitação.")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("exige justificativa quando a prioridade é urgente", async () => {
    const user = userEvent.setup();
    const { onSubmit } = renderForm({
      ...validForm,
      prioridade: "URGENTE",
      justificativa_prioridade: " ",
    });

    await user.click(
      screen.getByRole("button", { name: "Salvar solicitação" }),
    );

    expect(
      screen.getByText("Justificativa é obrigatória para prioridade URGENTE."),
    ).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("envia um formulário válido", async () => {
    const user = userEvent.setup();
    const { onSubmit } = renderForm(validForm);

    await user.click(
      screen.getByRole("button", { name: "Salvar solicitação" }),
    );

    expect(onSubmit).toHaveBeenCalledOnce();
  });
});
