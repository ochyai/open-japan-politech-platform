export const dynamic = "force-dynamic";

import { handleApiError, jsonResponse } from "@ojpp/api";
import { prisma } from "@ojpp/db";
import type { NextRequest } from "next/server";
import { calculateFitness } from "@/lib/algorithms/fitness";
import { autoKMeans } from "@/lib/algorithms/kmeans";
import { convergenceScore, determinePhase, shannonDiversity } from "@/lib/algorithms/quorum";
import { extractArguments } from "@/lib/llm/argument-extractor";
import { extractApiKey } from "@/lib/llm/client";
import { generateEmbeddings } from "@/lib/llm/embeddings";
import { generateClusterLabel } from "@/lib/llm/label-generator";

export async function POST(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: topicId } = await params;
    const apiKey = extractApiKey(_request);

    const topic = await prisma.bLTopic.findUnique({
      where: { id: topicId },
      include: {
        opinions: {
          include: {
            supports: true,
            arguments: true,
            pheromones: true,
          },
        },
      },
    });

    if (!topic) {
      return jsonResponse({ error: "Topic not found" }, 404);
    }

    // Step 1: Extract arguments from opinions that don't have them yet
    // Limit batch size to avoid timeout (max 6 opinions per call, processed in parallel)
    const BATCH_SIZE = 6;
    const CONCURRENCY = 3;
    const unanalyzed = topic.opinions.filter((o) => o.arguments.length === 0).slice(0, BATCH_SIZE);

    // Process in parallel with concurrency limit
    async function processOpinion(opinion: (typeof unanalyzed)[0]) {
      try {
        const result = await extractArguments(opinion.content, apiKey);
        const allArgs: { type: "CLAIM" | "PREMISE" | "EVIDENCE" | "REBUTTAL"; content: string }[] =
          [
            ...result.claims.map((c) => ({ type: "CLAIM" as const, content: c })),
            ...result.premises.map((p) => ({ type: "PREMISE" as const, content: p })),
            ...result.evidence.map((e) => ({ type: "EVIDENCE" as const, content: e })),
            ...result.rebuttals.map((r) => ({ type: "REBUTTAL" as const, content: r })),
          ];
        for (const arg of allArgs) {
          await prisma.bLArgument.create({
            data: {
              opinionId: opinion.id,
              type: arg.type,
              content: arg.content,
              confidence: 0.7,
            },
          });
        }
        const createdArgs = await prisma.bLArgument.findMany({
          where: { opinionId: opinion.id },
        });
        for (const rel of result.relations) {
          if (createdArgs[rel.source] && createdArgs[rel.target]) {
            await prisma.bLArgumentEdge
              .create({
                data: {
                  sourceId: createdArgs[rel.source].id,
                  targetId: createdArgs[rel.target].id,
                  relation: rel.type,
                },
              })
              .catch(() => {});
          }
        }
      } catch {
        // Skip failed extractions
      }
    }

    // Run in batches of CONCURRENCY
    for (let i = 0; i < unanalyzed.length; i += CONCURRENCY) {
      const batch = unanalyzed.slice(i, i + CONCURRENCY);
      await Promise.all(batch.map(processOpinion));
    }

    // Step 2: Generate embeddings for opinions without them
    const noEmbedding = topic.opinions.filter((o) => o.embedding.length === 0);
    if (noEmbedding.length > 0) {
      const texts = noEmbedding.map((o) => o.content);
      const allTexts = topic.opinions.map((o) => o.content);
      const embeddings = generateEmbeddings(texts, allTexts);
      for (let i = 0; i < noEmbedding.length; i++) {
        await prisma.bLOpinion.update({
          where: { id: noEmbedding[i].id },
          data: { embedding: embeddings[i] },
        });
      }
    }

    // Step 3: Cluster opinions
    const allOpinions = await prisma.bLOpinion.findMany({
      where: { topicId, embedding: { isEmpty: false } },
      include: { supports: true, pheromones: true },
    });

    if (allOpinions.length >= 3) {
      const points = allOpinions.map((o) => o.embedding);
      const clusterResult = autoKMeans(points);

      // Delete old clusters for this topic
      await prisma.bLCluster.deleteMany({ where: { topicId } });

      const CLUSTER_COLORS = [
        "#10b981",
        "#6366f1",
        "#f59e0b",
        "#ef4444",
        "#8b5cf6",
        "#06b6d4",
        "#ec4899",
        "#84cc16",
      ];

      // Create new clusters with LLM labels
      const clusterIds: string[] = [];
      for (let c = 0; c < clusterResult.k; c++) {
        const memberIndices = clusterResult.assignments
          .map((a, i) => (a === c ? i : -1))
          .filter((i) => i >= 0);
        const memberTexts = memberIndices.map((i) => allOpinions[i].content).slice(0, 5);

        let label: string;
        try {
          label = await generateClusterLabel(memberTexts, apiKey);
        } catch {
          label = `クラスタ ${c + 1}`;
        }

        const cluster = await prisma.bLCluster.create({
          data: {
            topicId,
            label,
            centroid: clusterResult.centroids[c],
            size: memberIndices.length,
            color: CLUSTER_COLORS[c % CLUSTER_COLORS.length],
          },
        });
        clusterIds.push(cluster.id);
      }

      // Assign opinions to clusters
      for (let i = 0; i < allOpinions.length; i++) {
        await prisma.bLOpinion.update({
          where: { id: allOpinions[i].id },
          data: { clusterId: clusterIds[clusterResult.assignments[i]] },
        });
      }
    }

    // Step 4: Calculate fitness
    const now = Date.now();
    for (const opinion of allOpinions) {
      const pheromone = opinion.pheromones[0];
      const args = await prisma.bLArgument.findMany({ where: { opinionId: opinion.id } });
      const rebuttals = args.filter((a) => a.type === "REBUTTAL");
      const avgConfidence =
        args.length > 0 ? args.reduce((s, a) => s + a.confidence, 0) / args.length : 0.5;
      const pheromoneIntensity = pheromone
        ? pheromone.intensity *
          Math.exp(-pheromone.decayRate * ((now - pheromone.lastUpdated.getTime()) / 3600000))
        : 0;

      const fitness = calculateFitness({
        supportCount: opinion.supports.length,
        argumentStrength: avgConfidence,
        rebuttalCount: rebuttals.length,
        ageHours: (now - opinion.createdAt.getTime()) / 3600000,
        pheromoneIntensity,
      });

      await prisma.bLOpinion.update({
        where: { id: opinion.id },
        data: { fitness },
      });
    }

    // Step 5: Quorum sensing — check phase transition
    const clusters = await prisma.bLCluster.findMany({ where: { topicId } });
    const clusterSizes = clusters.map((c) => c.size);
    const totalSupports = allOpinions.reduce((s, o) => s + o.supports.length, 0);
    const avgPheromone =
      allOpinions.length > 0
        ? allOpinions.reduce((s, o) => {
            const p = o.pheromones[0];
            return s + (p ? p.intensity : 0);
          }, 0) / allOpinions.length
        : 0;

    const convScore = convergenceScore(clusterSizes);
    const newPhase = determinePhase(
      {
        phase: topic.phase as "OPEN" | "DELIBERATION" | "CONVERGENCE" | "CLOSED",
        totalOpinions: allOpinions.length,
        totalSupports,
        clusterSizes,
        avgPheromone,
        convergenceScore: convScore,
      },
      topic.quorumThreshold,
    );

    if (newPhase !== topic.phase) {
      await prisma.bLTopic.update({
        where: { id: topicId },
        data: { phase: newPhase },
      });
    }

    // Step 6: Save ecosystem snapshot
    const shannonIdx = shannonDiversity(clusterSizes);
    const avgFitness =
      allOpinions.length > 0
        ? allOpinions.reduce((s, o) => s + (o.fitness || 0), 0) / allOpinions.length
        : 0;

    await prisma.bLEcosystemSnapshot.create({
      data: {
        topicId,
        phase: newPhase,
        totalOpinions: allOpinions.length,
        totalSupports,
        shannonIndex: shannonIdx,
        dominantCluster:
          clusters.length > 0 ? clusters.sort((a, b) => b.size - a.size)[0].label : null,
        avgFitness,
        avgPheromone,
      },
    });

    const totalUnanalyzed = topic.opinions.filter((o) => o.arguments.length === 0).length;
    const remaining = Math.max(0, totalUnanalyzed - BATCH_SIZE);

    return jsonResponse({
      status: remaining > 0 ? "partial" : "complete",
      phase: newPhase,
      opinionCount: allOpinions.length,
      clusterCount: clusters.length,
      shannonIndex: shannonIdx,
      convergenceScore: convScore,
      analyzedThisBatch: Math.min(unanalyzed.length, BATCH_SIZE),
      remainingUnanalyzed: remaining,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
