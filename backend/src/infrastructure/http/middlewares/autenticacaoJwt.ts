import jwt from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";

interface JwtPayload {
  professorId: string;
}

const isJwtPayload = (value: unknown): value is JwtPayload => {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const maybe = value as Record<string, unknown>;
  return typeof maybe.professorId === "string";
};

export const autenticacaoJwt = (request: Request, response: Response, next: NextFunction): void => {
  const authHeader = request.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    response.status(401).json({ message: "Token de autenticação ausente ou inválido." });
    return;
  }

  const token = authHeader.slice("Bearer ".length).trim();
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    response.status(503).json({ message: "Servidor OFF" });
    return;
  }

  try {
    const decoded = jwt.verify(token, secret);

    if (!isJwtPayload(decoded)) {
      response.status(401).json({ message: "Token de autenticação ausente ou inválido." });
      return;
    }

    response.locals.professorId = decoded.professorId;
    next();
  } catch {
    response.status(401).json({ message: "Token de autenticação ausente ou inválido." });
  }
};
