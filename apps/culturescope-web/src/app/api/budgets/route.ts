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
    const fiscalYear = url.searchParams.get("fiscalYear");
    const category = url.searchParams.get("category");

    const where: Record<string, unknown> = {};
    if (fiscalYear) where.fiscalYear = Number(fiscalYear);
    if (category) where.category = category;

    const [budgets, total] = await Promise.all([
      prisma.culturalBudget.findMany({
        where,
        orderBy: [{ fiscalYear: "desc" }, { category: "asc" }],
        skip,
        take: limit,
      }),
      prisma.culturalBudget.count({ where }),
    ]);

    const response = buildPaginatedResponse(serializeBigInt(budgets), total, { page, limit, skip });
    return jsonResponse(response);
  } catch (error) {
    return handleApiError(error);
  }
}
