export const dynamic = 'force-dynamic'
import { handleApiError, jsonResponse } from "@ojpp/api";
import { prisma } from "@ojpp/db";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: topicId } = await params;

    const topic = await prisma.bLTopic.findUnique({
      where: { id: topicId },
      select: { id: true, phase: true, quorumThreshold: true },
    });

    if (!topic) {
      return jsonResponse({ error: "Topic not found" }, 404);
    }

    const [opinions, clusters, snapshots] = await Promise.all([
      prisma.bLOpinion.findMany({
        where: { topicId },
        include: {
          _count: { select: { supports: true } },
          cluster: { select: { id: true, label: true, color: true } },
          pheromones: { take: 1, orderBy: { lastUpdated: "desc" } },
          arguments: {
            include: {
              outEdges: { include: { target: true } },
              inEdges: { include: { source: true } },
            },
          },
        },
        orderBy: { fitness: "desc" },
      }),
      prisma.bLCluster.findMany({
        where: { topicId },
        include: { _count: { select: { opinions: true } } },
      }),
      prisma.bLEcosystemSnapshot.findMany({
        where: { topicId },
        orderBy: { createdAt: "desc" },
        take: 50,
      }),
    ]);

    // Build argument graph
    const argumentNodes = opinions.flatMap((o) =>
      o.arguments.map((a) => ({
        id: a.id,
        type: a.type,
        content: a.content,
        confidence: a.confidence,
        opinionId: o.id,
      })),
    );

    const argumentEdges = opinions.flatMap((o) =>
      o.arguments.flatMap((a) =>
        a.outEdges.map((e) => ({
          id: e.id,
          sourceId: e.sourceId,
          targetId: e.targetId,
          relation: e.relation,
          weight: e.weight,
        })),
      ),
    );

    // Build ecosystem view data
    const opinionNodes = opinions.map((o, i) => {
      const pheromone = o.pheromones[0];
      // Simple 2D layout: spread opinions in a grid-like pattern
      const cols = Math.ceil(Math.sqrt(opinions.length));
      return {
        id: o.id,
        x: ((i % cols) + 0.5) / cols,
        y: (Math.floor(i / cols) + 0.5) / Math.ceil(opinions.length / cols),
        fitness: o.fitness,
        supportCount: o._count.supports,
        clusterId: o.cluster?.id ?? "",
        clusterLabel: o.cluster?.label ?? "",
        clusterColor: o.cluster?.color ?? "#666",
        content: o.content,
        pheromoneIntensity: pheromone?.intensity ?? 0,
        pheromoneQuality: pheromone?.quality ?? 0.5,
        stance: o.stance,
        embedding: o.embedding.length > 0 ? o.embedding : null,
      };
    });

    const clusterRegions = clusters.map((c) => {
      // Calculate cluster center from member positions
      const members = opinionNodes.filter((o) => o.clusterId === c.id);
      const centerX =
        members.length > 0 ? members.reduce((s, m) => s + m.x, 0) / members.length : 0.5;
      const centerY =
        members.length > 0 ? members.reduce((s, m) => s + m.y, 0) / members.length : 0.5;
      return {
        id: c.id,
        label: c.label,
        centerX,
        centerY,
        radius: Math.max(0.1, Math.sqrt(c._count.opinions / opinions.length) * 0.3),
        color: c.color ?? "#10b981",
        size: c._count.opinions,
      };
    });

    return jsonResponse({
      topic,
      ecosystem: {
        opinions: opinionNodes,
        clusters: clusterRegions,
      },
      argumentGraph: {
        nodes: argumentNodes,
        edges: argumentEdges,
      },
      pheromone: {
        sources: opinionNodes.map((o) => ({
          id: o.id,
          x: o.x,
          y: o.y,
          intensity: o.pheromoneIntensity,
          quality: o.pheromoneQuality,
          content: o.content,
          stance: o.stance,
        })),
      },
      history: snapshots,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
