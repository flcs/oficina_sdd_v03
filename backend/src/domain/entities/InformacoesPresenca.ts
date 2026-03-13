import { CargaHoraria } from "../valueObjects/CargaHoraria.js";
import { QuantidadeFaltas } from "../valueObjects/QuantidadeFaltas.js";

export class InformacoesPresenca {
  public constructor(private readonly cargaHoraria: CargaHoraria, private readonly faltas: QuantidadeFaltas) {}

  public cargaHorariaValor(): number {
    return this.cargaHoraria.valor();
  }

  public faltasValor(): number {
    return this.faltas.valor();
  }

  public cargaHorariaEhZero(): boolean {
    return this.cargaHoraria.ehZero();
  }
}
