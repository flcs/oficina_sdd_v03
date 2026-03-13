import { NotaProva } from "../valueObjects/NotaProva.js";

export class NotasAvaliacao {
  public constructor(private readonly p1: NotaProva, private readonly p2: NotaProva) {}

  public p1Valor(): number | null {
    return this.p1.valor();
  }

  public p2Valor(): number | null {
    return this.p2.valor();
  }

  public ambosPresentes(): boolean {
    return !this.p1.estaPendente() && !this.p2.estaPendente();
  }
}
