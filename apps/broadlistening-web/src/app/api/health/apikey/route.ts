import { handleApiError, jsonResponse } from "@ojpp/api";
import type { NextRequest } from "next/server";
import { extractApiKey, validateApiKey } from "@/lib/llm/client";

export async function GET(request: NextRequest) {
  try {
    const apiKey = extractApiKey(request);
    if (!apiKey) {
      return jsonResponse({ valid: false, error: "API key is required" }, 400);
    }

    const valid = await validateApiKey(apiKey);
    if (!valid) {
      return jsonResponse({ valid: false, error: "Invalid Anthropic API key" }, 401);
    }

    return jsonResponse({ valid: true }, 200);
  } catch (error) {
    return handleApiError(error);
  }
}
