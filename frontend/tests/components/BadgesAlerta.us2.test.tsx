import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BadgeAlerta } from "../../src/components/badges/BadgeAlerta";

describe("BadgeAlerta", () => {
  it("renderiza badge de CR vermelho", () => {
    const { getByText } = render(<BadgeAlerta alerta={{ categoria: "CR", severidade: "VERMELHO", rotulo: "BAIXA" }} />);
    const badge = getByText("CR BAIXA");
    expect(badge).toHaveAttribute("data-severidade", "VERMELHO");
  });

  it("renderiza badge de faltas amarelo", () => {
    const { getByText } = render(
      <BadgeAlerta alerta={{ categoria: "FALTAS", severidade: "AMARELO", rotulo: "FALTAS" }} />
    );
    const badge = getByText("FALTAS");
    expect(badge).toHaveAttribute("data-severidade", "AMARELO");
  });
});
