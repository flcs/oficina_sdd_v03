export class ClienteHttpBase {
  public constructor(private readonly baseUrl: string) {}

  public async get<T>(path: string, token?: string): Promise<T> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json"
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseUrl}${path}`, {
      method: "GET",
      headers
    });

    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as { message?: string } | null;
      throw new Error(data?.message ?? "Servidor OFF");
    }

    return (await response.json()) as T;
  }
}
