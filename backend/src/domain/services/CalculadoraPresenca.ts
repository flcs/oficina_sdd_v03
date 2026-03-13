import { InformacoesPresenca } from "../entities/InformacoesPresenca.js";
import { PercentualPresenca } from "../valueObjects/PercentualPresenca.js";

export class CalculadoraPresenca {
  public calcular(informacoes: InformacoesPresenca): PercentualPresenca {
    if (informacoes.cargaHorariaEhZero()) {
      return new PercentualPresenca(null);
    }

    const percentual = ((informacoes.cargaHorariaValor() - informacoes.faltasValor()) / informacoes.cargaHorariaValor()) * 100;
    return new PercentualPresenca(Number(percentual.toFixed(2)));
  }
}
