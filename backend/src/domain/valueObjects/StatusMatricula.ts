export class StatusMatricula {
  public constructor(private readonly valorInterno: "ativo" | "trancado") {}

  public estaTrancado(): boolean {
    return this.valorInterno === "trancado";
  }

  public valor(): "ativo" | "trancado" {
    return this.valorInterno;
  }
}
