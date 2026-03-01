import type { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";

import { checkRateLimit } from "../rate-limit";

function createRequest(ip: string): NextRequest {
  return {
    headers: new Headers({ "x-forwarded-for": ip }),
  } as unknown as NextRequest;
}

describe("checkRateLimit", () => {
  it("制限内のリクエストで null を返す", () => {
    const request = createRequest("10.0.0.1");
    const result = checkRateLimit(request, { limit: 10, windowMs: 60_000 });
    expect(result).toBeNull();
  });

  it("制限を超えたリクエストで 429 レスポンスを返す", () => {
    const request = createRequest("10.0.0.2");
    const config = { limit: 2, windowMs: 60_000 };

    checkRateLimit(request, config); // 1
    checkRateLimit(request, config); // 2
    const result = checkRateLimit(request, config); // 3 → 超過

    expect(result).not.toBeNull();
    expect(result!.status).toBe(429);
  });

  it("429 レスポンスに Retry-After ヘッダーが含まれる", () => {
    const request = createRequest("10.0.0.3");
    const config = { limit: 1, windowMs: 60_000 };

    checkRateLimit(request, config); // 1
    const result = checkRateLimit(request, config); // 2 → 超過

    expect(result).not.toBeNull();
    expect(result!.headers.get("Retry-After")).toBeTruthy();
  });
});
