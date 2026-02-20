export const dynamic = "force-dynamic";

import { buildPaginatedResponse, handleApiError, jsonResponse, parsePagination } from "@ojpp/api";
import { prisma } from "@ojpp/db";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { page, limit, skip } = parsePagination(request);
    const url = new URL(request.url);
    const phase = url.searchParams.get("phase");

    const where: Record<string, unknown> = {};
    if (phase) where.phase = phase;

    const sort = url.searchParams.get("sort"); // "hot" | "new" | "opinions"

    // Build orderBy based on sort parameter
    let orderBy: Record<string, unknown>[];
    switch (sort) {
      case "hot":
        // Hot = most opinions, then newest
        orderBy = [{ opinions: { _count: "desc" } }, { createdAt: "desc" }];
        break;
      case "opinions":
        orderBy = [{ opinions: { _count: "desc" } }];
        break;
      case "new":
      default:
        orderBy = [{ createdAt: "desc" }];
        break;
    }

    const [topics, total] = await Promise.all([
      prisma.bLTopic.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          bill: { select: { id: true, title: true } },
          _count: { select: { opinions: true, clusters: true } },
        },
      }),
      prisma.bLTopic.count({ where }),
    ]);

    return jsonResponse(buildPaginatedResponse(topics, total, { page, limit, skip }));
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, billId, quorumThreshold } = body;

    if (!title || !description) {
      return new Response(JSON.stringify({ error: "title and description are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const topic = await prisma.bLTopic.create({
      data: {
        title,
        description,
        billId: billId || undefined,
        quorumThreshold: quorumThreshold ?? 0.6,
      },
    });

    return new Response(JSON.stringify(topic), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
