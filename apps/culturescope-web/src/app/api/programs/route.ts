export const dynamic = "force-dynamic";

import {
  buildPaginatedResponse,
  handleApiError,
  jsonResponse,
  parsePagination,
  serializeBigInt,
} from "@ojpp/api";
import { prisma } from "@ojpp/db";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { page, limit, skip } = parsePagination(request);

    const url = new URL(request.url);
    const category = url.searchParams.get("category");
    const active = url.searchParams.get("active");

    const where: Record<string, unknown> = {};
    if (category) where.category = category;
    if (active !== null) where.isActive = active === "true";

    const [programs, total] = await Promise.all([
      prisma.culturalProgram.findMany({
        where,
        orderBy: [{ isActive: "desc" }, { budget: "desc" }],
        skip,
        take: limit,
      }),
      prisma.culturalProgram.count({ where }),
    ]);

    const response = buildPaginatedResponse(serializeBigInt(programs), total, {
      page,
      limit,
      skip,
    });
    return jsonResponse(response);
  } catch (error) {
    return handleApiError(error);
  }
}
