import { PrismaClient } from "../prisma/generated";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    // Vercel サーバーレス: Supabase Pooler (pgbouncer) 経由の接続制限
    datasources: {
      db: { url: process.env.DATABASE_URL },
    },
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export type * from "../prisma/generated";
export { PrismaClient } from "../prisma/generated";
