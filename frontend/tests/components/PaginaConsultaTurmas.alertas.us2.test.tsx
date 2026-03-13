import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PaginaConsultaTurmas } from "../../src/pages/PaginaConsultaTurmas";

vi.mock("../../src/hooks/useConsultaTurmas", () => ({
  useConsultaTurmas: () => ({
    disciplinaNome: "Calculo",
    carregando: false,
    erro: null,
    linhas: [
      {
        id: "1",
        nome: "Ana",
        status: "ativo",
        coeficienteRendimento: 8,
        percentualPresenca: 95,
        alertas: []
      }
    ]
  })
}));

describe("PaginaConsultaTurmas US2", () => {
  it("nao renderiza badges quando nao ha alertas", () => {
    const { queryByText } = render(<PaginaConsultaTurmas disciplinaId="d1" token="t" />);

    expect(queryByText("CR BAIXA")).not.toBeInTheDocument();
    expect(queryByText("FALTAS")).not.toBeInTheDocument();
  });
});
