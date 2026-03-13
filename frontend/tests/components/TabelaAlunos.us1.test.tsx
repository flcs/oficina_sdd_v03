import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PaginaConsultaTurmas } from "../../src/pages/PaginaConsultaTurmas";

vi.mock("../../src/hooks/useConsultaTurmas", () => ({
  useConsultaTurmas: () => ({
    disciplinaNome: "Calculo",
    carregando: false,
    erro: null,
    linhas: [
      { id: "1", nome: "Ana", status: "ativo", coeficienteRendimento: 8, percentualPresenca: 90, alertas: [] },
      { id: "2", nome: "Bruno", status: "ativo", coeficienteRendimento: 7, percentualPresenca: 85, alertas: [] }
    ]
  })
}));

describe("PaginaConsultaTurmas", () => {
  it("renderiza tabela de alunos", () => {
    const { getByText } = render(<PaginaConsultaTurmas disciplinaId="d1" token="t" />);

    expect(getByText("Consulta de Turmas")).toBeInTheDocument();
    expect(getByText("Ana")).toBeInTheDocument();
    expect(getByText("Bruno")).toBeInTheDocument();
  });
});
