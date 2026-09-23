import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import AppointmentActions from "./AppointmentActions";

describe("AppointmentActions", () => {
  it("só atualiza o status depois da confirmação", async () => {
    const user = userEvent.setup();
    const onUpdateStatus = vi.fn().mockResolvedValue(undefined);

    render(
      <AppointmentActions
        status="RECEBIDA"
        appointmentId={42}
        onUpdateStatus={onUpdateStatus}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Iniciar análise" }));

    expect(onUpdateStatus).not.toHaveBeenCalled();
    const dialog = screen.getByRole("dialog", { name: "Iniciar análise?" });

    await user.click(
      within(dialog).getByRole("button", { name: "Iniciar análise" }),
    );

    await waitFor(() => {
      expect(onUpdateStatus).toHaveBeenCalledWith(42, "EM_ANALISE");
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("mantém a confirmação aberta e exibe o erro quando a atualização falha", async () => {
    const user = userEvent.setup();
    const onUpdateStatus = vi
      .fn()
      .mockRejectedValue(new Error("Não foi possível cancelar."));

    render(
      <AppointmentActions
        status="RECEBIDA"
        appointmentId={7}
        onUpdateStatus={onUpdateStatus}
      />,
    );

    await user.click(
      screen.getByRole("button", { name: "Cancelar solicitação" }),
    );
    const dialog = screen.getByRole("dialog", {
      name: "Cancelar solicitação?",
    });

    await user.click(
      within(dialog).getByRole("button", { name: "Cancelar solicitação" }),
    );

    expect(
      await screen.findByRole("alert", {
        name: "",
      }),
    ).toHaveTextContent("Não foi possível cancelar.");
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("não oferece ações para uma solicitação concluída", () => {
    const { container } = render(
      <AppointmentActions
        status="CONCLUIDA"
        appointmentId={1}
        onUpdateStatus={vi.fn()}
      />,
    );

    expect(container).toBeEmptyDOMElement();
  });
});
