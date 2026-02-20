export const dynamic = "force-dynamic";

import { handleApiError, jsonResponse } from "@ojpp/api";
import { prisma } from "@ojpp/db";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const topic = await prisma.bLTopic.findUnique({
      where: { id },
      include: {
        bill: { select: { id: true, title: true, summary: true } },
        opinions: {
          include: {
            supports: true,
            arguments: {
              include: {
                outEdges: true,
                inEdges: true,
              },
            },
            pheromones: true,
          },
          orderBy: { fitness: "desc" },
        },
        clusters: {
          include: { _count: { select: { opinions: true } } },
        },
        snapshots: {
          orderBy: { createdAt: "desc" },
          take: 20,
        },
      },
    });

    if (!topic) {
      return jsonResponse({ error: "Topic not found" }, 404);
    }

    return jsonResponse(topic);
  } catch (error) {
    return handleApiError(error);
  }
}
