export class CategoriaAlerta {
  public constructor(private readonly valorInterno: "CR" | "FALTAS") {}

  public valor(): "CR" | "FALTAS" {
    return this.valorInterno;
  }
}
