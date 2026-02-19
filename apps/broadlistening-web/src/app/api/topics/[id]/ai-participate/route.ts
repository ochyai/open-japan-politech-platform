export const dynamic = 'force-dynamic'
import { jsonResponse } from "@ojpp/api";
import { prisma } from "@ojpp/db";
import { complete, extractApiKey } from "@/lib/llm/client";

const SYSTEM_PROMPT = `あなたは政策議論に参加するAIエージェントです。
与えられたトピックについて、多角的な視点から意見を生成してください。
各意見は独立した論点を持ち、既存の意見と重複しないようにしてください。
意見は日本語で、100〜200文字程度で簡潔かつ具体的に述べてください。`;

interface GeneratedOpinion {
  content: string;
  stance: "FOR" | "AGAINST" | "NEUTRAL";
  perspective: string;
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: topicId } = await params;
  const apiKey = extractApiKey(request);

  try {
    const topic = await prisma.bLTopic.findUnique({
      where: { id: topicId },
      include: {
        opinions: { select: { content: true, stance: true }, take: 50 },
      },
    });

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

    const body = await request.json().catch(() => ({}));
    const perspectives = Math.min(body.perspectives ?? 3, 5);

    const existingOpinions = topic.opinions.map((o) => `[${o.stance}] ${o.content}`).join("\n");

    const prompt = `## トピック
タイトル: ${topic.title}
説明: ${topic.description}

## 既存の意見
${existingOpinions || "(まだ意見はありません)"}

## タスク
上記トピックについて、${perspectives}つの異なる視点から意見を生成してください。
既存の意見と重複しない新しい論点を提示してください。
賛成(FOR)・反対(AGAINST)・中立(NEUTRAL)をバランスよく含めてください。

以下のJSON形式で回答してください:
[
  { "content": "意見内容", "stance": "FOR|AGAINST|NEUTRAL", "perspective": "視点の説明" }
]

JSONのみを出力してください。`;

    const response = await complete(SYSTEM_PROMPT, prompt, apiKey);

    let generated: GeneratedOpinion[];
    try {
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      generated = JSON.parse(jsonMatch?.[0] ?? "[]");
    } catch {
      return new Response(JSON.stringify({ error: "Failed to parse AI response" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const createdOpinions = await Promise.all(
      generated.map(async (gen) => {
        const opinion = await prisma.bLOpinion.create({
          data: {
            content: gen.content,
            stance: gen.stance,
            authorId: `ai-agent`,
            topicId,
            fitness: 0,
          },
        });

        await prisma.bLPheromone.create({
          data: {
            intensity: 0.5,
            quality: 0.5,
            decayRate: 0.01,
            opinionId: opinion.id,
          },
        });

        return opinion;
      }),
    );

    return jsonResponse({ opinions: createdOpinions });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
