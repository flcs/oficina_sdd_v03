export class QuantidadeFaltas {
  public constructor(private readonly valorInterno: number) {
    if (!Number.isInteger(valorInterno) || valorInterno < 0) {
      throw new Error("Quantidade de faltas inválida");
    }
  }

  public valor(): number {
    return this.valorInterno;
  }
}
