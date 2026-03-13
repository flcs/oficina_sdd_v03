import { describe, expect, it } from "vitest";
import { GeradorAlertasCR } from "../../../../src/domain/services/GeradorAlertasCR.js";

describe("GeradorAlertasCR", () => {
  const gerador = new GeradorAlertasCR();

  it("gera alerta vermelho para CR menor que 6", () => {
    const alertas = gerador.gerar(5.99);
    expect(alertas).toHaveLength(1);
    expect(alertas[0]).toEqual({ categoria: "CR", severidade: "VERMELHO", rotulo: "BAIXA" });
  });

  it("gera alerta amarelo para CR entre 6.0 e 6.9", () => {
    const alertas = gerador.gerar(6.5);
    expect(alertas).toHaveLength(1);
    expect(alertas[0]).toEqual({ categoria: "CR", severidade: "AMARELO", rotulo: "BAIXA" });
  });

  it("nao gera alerta para CR nulo ou acima de 6.9", () => {
    expect(gerador.gerar(null)).toEqual([]);
    expect(gerador.gerar(7.0)).toEqual([]);
  });
});
