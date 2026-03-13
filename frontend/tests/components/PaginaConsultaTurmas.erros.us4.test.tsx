import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PaginaConsultaTurmas } from "../../src/pages/PaginaConsultaTurmas";

const mockUseConsultaTurmas = vi.fn();

vi.mock("../../src/hooks/useConsultaTurmas", () => ({
  useConsultaTurmas: (...args: unknown[]) => mockUseConsultaTurmas(...args)
}));

describe("PaginaConsultaTurmas erros US4", () => {
  it("renderiza mensagem de acesso negado", () => {
    mockUseConsultaTurmas.mockReturnValueOnce({
      disciplinaNome: "",
      carregando: false,
      erro: "Você não possui tal disciplina",
      linhas: []
    });

    const { getByText } = render(<PaginaConsultaTurmas disciplinaId="d1" token="t" />);

    expect(getByText("Você não possui tal disciplina")).toBeInTheDocument();
  });

  it("renderiza mensagem Servidor OFF", () => {
    mockUseConsultaTurmas.mockReturnValueOnce({
      disciplinaNome: "",
      carregando: false,
      erro: "Servidor OFF",
      linhas: []
    });

    const { getByText } = render(<PaginaConsultaTurmas disciplinaId="d1" token="t" />);

    expect(getByText("Servidor OFF")).toBeInTheDocument();
  });
});
