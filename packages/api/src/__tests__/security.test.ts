import { describe, expect, it } from "vitest";

import { safeEqual } from "../security";

describe("safeEqual", () => {
  it("同じ文字列で true を返す", () => {
    expect(safeEqual("hello", "hello")).toBe(true);
  });

  it("異なる文字列で false を返す", () => {
    expect(safeEqual("hello", "world")).toBe(false);
  });

  it("空文字列同士で true を返す", () => {
    expect(safeEqual("", "")).toBe(true);
  });

  it("長さが異なる文字列で false を返す", () => {
    expect(safeEqual("short", "much longer string")).toBe(false);
  });
});
