import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PaginaConsultaTurmas } from "../../src/pages/PaginaConsultaTurmas";

vi.mock("../../src/hooks/useConsultaTurmas", () => ({
  useConsultaTurmas: () => ({
    disciplinaNome: "Calculo",
    carregando: false,
    erro: null,
    linhas: [
      { id: "1", nome: "Ana", status: "ativo", coeficienteRendimento: 8, percentualPresenca: 90, alertas: [] }
    ]
  })
}));

describe("PaginaConsultaTurmas read-only", () => {
  it("nao renderiza acoes de edicao/insercao/exclusao", () => {
    const { queryByRole } = render(<PaginaConsultaTurmas disciplinaId="d1" token="t" />);

    expect(queryByRole("button", { name: /editar/i })).not.toBeInTheDocument();
    expect(queryByRole("button", { name: /excluir/i })).not.toBeInTheDocument();
    expect(queryByRole("button", { name: /adicionar/i })).not.toBeInTheDocument();
  });
});
