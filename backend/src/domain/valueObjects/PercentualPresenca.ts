export class PercentualPresenca {
  public constructor(private readonly valorInterno: number | null) {}

  public valor(): number | null {
    return this.valorInterno;
  }
}
