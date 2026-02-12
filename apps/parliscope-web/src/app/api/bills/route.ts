import { prisma } from "@ojpp/db";
import { parsePagination, buildPaginatedResponse, handleApiError, jsonResponse } from "@ojpp/api";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { page, limit, skip } = parsePagination(request);
    const url = new URL(request.url);
    const status = url.searchParams.get("status");
    const sessionId = url.searchParams.get("sessionId");
    const category = url.searchParams.get("category");

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (sessionId) where.sessionId = sessionId;
    if (category) where.category = category;

    const [bills, total] = await Promise.all([
      prisma.bill.findMany({
        where,
        skip,
        take: limit,
        orderBy: { submittedAt: "desc" },
        include: {
          session: true,
          _count: { select: { votes: true, discussions: true } },
        },
      }),
      prisma.bill.count({ where }),
    ]);

    return jsonResponse(buildPaginatedResponse(bills, total, { page, limit, skip }));
  } catch (error) {
    return handleApiError(error);
  }
}
