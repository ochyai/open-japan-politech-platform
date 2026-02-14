import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@ojpp/ui"],
  serverExternalPackages: ["@prisma/client"],
  outputFileTracingRoot: path.join(__dirname, "../../"),
};

export default nextConfig;
