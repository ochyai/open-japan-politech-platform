import { prisma } from "@ojpp/db";
import { parsePagination, buildPaginatedResponse, handleApiError, jsonResponse } from "@ojpp/api";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { page, limit, skip } = parsePagination(request);

    const [sessions, total] = await Promise.all([
      prisma.dietSession.findMany({
        skip,
        take: limit,
        orderBy: { number: "desc" },
        include: {
          _count: { select: { bills: true } },
        },
      }),
      prisma.dietSession.count(),
    ]);

    return jsonResponse(buildPaginatedResponse(sessions, total, { page, limit, skip }));
  } catch (error) {
    return handleApiError(error);
  }
}
