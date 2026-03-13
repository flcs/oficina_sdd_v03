export class NotaProva {
  public constructor(private readonly valorInterno: number | null) {
    if (valorInterno !== null && (valorInterno < 0 || valorInterno > 10)) {
      throw new Error("Nota inválida");
    }
  }

  public estaPendente(): boolean {
    return this.valorInterno === null;
  }

  public valor(): number | null {
    return this.valorInterno;
  }
}
