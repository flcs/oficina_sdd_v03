import { describe, expect, it } from "vitest";
import { InformacoesPresenca } from "../../../../src/domain/entities/InformacoesPresenca.js";
import { CalculadoraPresenca } from "../../../../src/domain/services/CalculadoraPresenca.js";
import { CargaHoraria } from "../../../../src/domain/valueObjects/CargaHoraria.js";
import { QuantidadeFaltas } from "../../../../src/domain/valueObjects/QuantidadeFaltas.js";

describe("CalculadoraPresenca", () => {
  it("calcula percentual de presenca", () => {
    const info = new InformacoesPresenca(new CargaHoraria(60), new QuantidadeFaltas(6));
    const calculadora = new CalculadoraPresenca();

    expect(calculadora.calcular(info).valor()).toBe(90);
  });

  it("retorna null quando carga horaria e zero", () => {
    const info = new InformacoesPresenca(new CargaHoraria(0), new QuantidadeFaltas(0));
    const calculadora = new CalculadoraPresenca();

    expect(calculadora.calcular(info).valor()).toBeNull();
  });
});
