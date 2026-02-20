export const dynamic = "force-dynamic";

import { buildPaginatedResponse, handleApiError, jsonResponse, parsePagination } from "@ojpp/api";
import { prisma } from "@ojpp/db";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: topicId } = await params;
    const { page, limit, skip } = parsePagination(request);

    const [opinions, total] = await Promise.all([
      prisma.bLOpinion.findMany({
        where: { topicId },
        skip,
        take: limit,
        orderBy: { fitness: "desc" },
        include: {
          _count: { select: { supports: true } },
          cluster: { select: { id: true, label: true, color: true } },
          pheromones: { take: 1, orderBy: { lastUpdated: "desc" } },
        },
      }),
      prisma.bLOpinion.count({ where: { topicId } }),
    ]);

    return jsonResponse(buildPaginatedResponse(opinions, total, { page, limit, skip }));
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: topicId } = await params;
    const body = await request.json();
    const { content, stance, authorId } = body;

    if (!content) {
      return new Response(JSON.stringify({ error: "content is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Check topic exists and is open
    const topic = await prisma.bLTopic.findUnique({ where: { id: topicId } });
    if (!topic) {
      return new Response(JSON.stringify({ error: "Topic not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    if (topic.phase === "CLOSED") {
      return new Response(JSON.stringify({ error: "Topic is closed" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const opinion = await prisma.bLOpinion.create({
      data: {
        topicId,
        content,
        stance: stance || undefined,
        authorId: authorId || undefined,
        embedding: [],
      },
    });

    // Create initial pheromone
    await prisma.bLPheromone.create({
      data: {
        opinionId: opinion.id,
        intensity: 1.0,
        quality: 0.5,
        decayRate: 0.01,
      },
    });

    return jsonResponse(opinion, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
