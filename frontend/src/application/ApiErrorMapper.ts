export class ApiErrorMapper {
  public map(error: unknown): string {
    const message = error instanceof Error ? error.message : "Servidor OFF";

    if (message.includes("Você não possui tal disciplina")) {
      return "Você não possui tal disciplina";
    }

    if (message.includes("Token de autenticação")) {
      return "Token de autenticação ausente ou inválido.";
    }

    return "Servidor OFF";
  }
}
