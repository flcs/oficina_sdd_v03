import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LinhaAluno } from "../../src/components/TabelaAlunos/LinhaAluno";

describe("LinhaAluno trancado", () => {
  it("renderiza badge trancado e placeholder de CR", () => {
    const { getByText, getAllByText } = render(
      <table>
        <tbody>
          <LinhaAluno
            linha={{
              id: "1",
              nome: "Ana",
              status: "trancado",
              coeficienteRendimento: null,
              percentualPresenca: null,
              alertas: []
            }}
          />
        </tbody>
      </table>
    );

    expect(getByText("Trancado")).toBeInTheDocument();
    expect(getAllByText("-")).toHaveLength(2);
  });
});
