export class SeveridadeAlerta {
  public constructor(private readonly valorInterno: "VERMELHO" | "AMARELO") {}

  public valor(): "VERMELHO" | "AMARELO" {
    return this.valorInterno;
  }
}
