export class CargaHoraria {
  public constructor(private readonly valorInterno: number) {
    if (!Number.isInteger(valorInterno) || valorInterno < 0) {
      throw new Error("Carga horária inválida");
    }
  }

  public valor(): number {
    return this.valorInterno;
  }

  public ehZero(): boolean {
    return this.valorInterno === 0;
  }
}
