export const dynamic = "force-dynamic";

import { handleApiError, jsonResponse } from "@ojpp/api";
import { prisma } from "@ojpp/db";
import type { NextRequest } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; opinionId: string }> },
) {
  try {
    const { opinionId } = await params;
    const body = await request.json();
    const { userId, weight } = body;

    if (!userId) {
      return new Response(JSON.stringify({ error: "userId is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Upsert support
    const support = await prisma.bLSupport.upsert({
      where: { opinionId_userId: { opinionId, userId } },
      create: {
        opinionId,
        userId,
        weight: weight ?? 1.0,
      },
      update: {
        weight: weight ?? 1.0,
      },
    });

    // Reinforce pheromone
    const pheromone = await prisma.bLPheromone.findFirst({
      where: { opinionId },
    });
    if (pheromone) {
      const elapsed = (Date.now() - pheromone.lastUpdated.getTime()) / (1000 * 60 * 60);
      const currentIntensity = pheromone.intensity * Math.exp(-pheromone.decayRate * elapsed);
      const newIntensity = currentIntensity + pheromone.quality * (weight ?? 1.0);

      await prisma.bLPheromone.update({
        where: { id: pheromone.id },
        data: {
          intensity: newIntensity,
          lastUpdated: new Date(),
        },
      });
    }

    return jsonResponse(support, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
