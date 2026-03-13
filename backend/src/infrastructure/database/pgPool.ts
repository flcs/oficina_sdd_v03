import { Pool } from "pg";

let pool: Pool | null = null;

export const getPgPool = (): Pool => {
  if (pool) {
    return pool;
  }

  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL não configurada");
  }

  pool = new Pool({ connectionString });
  return pool;
};
