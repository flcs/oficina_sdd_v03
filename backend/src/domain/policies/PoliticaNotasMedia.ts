import { NotasAvaliacao } from "../entities/NotasAvaliacao.js";
import { CoeficienteRendimento } from "../valueObjects/CoeficienteRendimento.js";

export class PoliticaNotasMedia {
  public calcular(notas: NotasAvaliacao): CoeficienteRendimento {
    if (!notas.ambosPresentes()) {
      return new CoeficienteRendimento(null);
    }

    const p1 = notas.p1Valor() ?? 0;
    const p2 = notas.p2Valor() ?? 0;
    return new CoeficienteRendimento(Number(((p1 + p2) / 2).toFixed(2)));
  }
}
