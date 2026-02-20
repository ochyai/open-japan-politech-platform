import Anthropic from "@anthropic-ai/sdk";

const defaultClient: Anthropic | null = null;

export function getClient(apiKey?: string): Anthropic {
  const key = apiKey || process.env.ANTHROPIC_API_KEY;
  if (!key) {
    throw new Error(
      "APIキーが設定されていません。右上の「Set API Key」からAnthropicのAPIキーを入力してください。",
    );
  }
  return new Anthropic({ apiKey: key });
}

export async function complete(
  systemPrompt: string,
  userPrompt: string,
  apiKey?: string,
): Promise<string> {
  const anthropic = getClient(apiKey);
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-5-20250929",
    max_tokens: 4096,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });
  const block = response.content[0];
  if (block.type === "text") return block.text;
  return "";
}

/** Extract API key from request header */
export function extractApiKey(request: Request): string | undefined {
  return request.headers.get("x-anthropic-api-key") ?? undefined;
}

/** Validate API key by making a lightweight request to Anthropic */
export async function validateApiKey(apiKey?: string): Promise<boolean> {
  try {
    const client = getClient(apiKey);
    // models.list is a low-cost auth check and does not consume completion tokens.
    await client.models.list();
    return true;
  } catch {
    return false;
  }
}
