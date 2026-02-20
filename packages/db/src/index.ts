import { PrismaClient } from "../prisma/generated";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const createPrismaClient = () =>
  new PrismaClient({
    // Vercel サーバーレス: Supabase Pooler (pgbouncer) 経由の接続制限
    datasources: {
      db: { url: process.env.DATABASE_URL },
    },
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

// 遅延初期化: ビルド時のモジュール評価で DATABASE_URL を要求しないよう Proxy を使用
let _client: PrismaClient | undefined;
export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    if (!_client) {
      _client = globalForPrisma.prisma ?? createPrismaClient();
      if (process.env.NODE_ENV !== "production") {
        globalForPrisma.prisma = _client;
      }
    }
    return Reflect.get(_client, prop, receiver);
  },
});

export type * from "../prisma/generated";
export { PrismaClient } from "../prisma/generated";
