export const dynamic = 'force-dynamic'
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
    const year = url.searchParams.get("year");
    const prefectureCode = url.searchParams.get("prefecture");

    const where: Record<string, unknown> = {};
    if (category) where.category = category;
    if (year) where.fiscalYear = Number(year);
    if (prefectureCode) where.prefecture = { code: prefectureCode };

    const [data, total] = await Promise.all([
      prisma.welfareStat.findMany({
        where,
        include: { prefecture: true },
        orderBy: [{ fiscalYear: "desc" }, { prefecture: { code: "asc" } }],
        skip,
        take: limit,
      }),
      prisma.welfareStat.count({ where }),
    ]);

    return jsonResponse(
      serializeBigInt(buildPaginatedResponse(data, total, { page, limit, skip })),
    );
  } catch (error) {
    return handleApiError(error);
  }
}
