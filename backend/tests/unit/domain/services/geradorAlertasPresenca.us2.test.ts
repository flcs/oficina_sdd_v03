import { describe, expect, it } from "vitest";
import { GeradorAlertasPresenca } from "../../../../src/domain/services/GeradorAlertasPresenca.js";

describe("GeradorAlertasPresenca", () => {
  const gerador = new GeradorAlertasPresenca();

  it("gera alerta vermelho para presenca menor que 75", () => {
    const alertas = gerador.gerar(74.99);
    expect(alertas).toHaveLength(1);
    expect(alertas[0]).toEqual({ categoria: "FALTAS", severidade: "VERMELHO", rotulo: "FALTAS" });
  });

  it("gera alerta amarelo para presenca entre 75 e 84", () => {
    const alertas = gerador.gerar(80);
    expect(alertas).toHaveLength(1);
    expect(alertas[0]).toEqual({ categoria: "FALTAS", severidade: "AMARELO", rotulo: "FALTAS" });
  });

  it("nao gera alerta para presenca nula ou acima de 84", () => {
    expect(gerador.gerar(null)).toEqual([]);
    expect(gerador.gerar(84.01)).toEqual([]);
  });
});
