import { PrismaClient } from "../generated/prisma/client";

const globalForPrisma = globalThis;

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

// Habilitar foreign keys en SQLite (importante para relaciones)
if (process.env.DATABASE_URL && process.env.DATABASE_URL.includes("sqlite")) {
  prisma.$executeRaw`PRAGMA foreign_keys = ON;`.catch(() => {
    // Ignorar errores si ya está habilitado
  });
}

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;



