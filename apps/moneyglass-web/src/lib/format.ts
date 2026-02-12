/**
 * 通貨・数値フォーマットユーティリティ
 */

const formatter = new Intl.NumberFormat("ja-JP");

export function formatCurrency(value: string | number | bigint): string {
  const num = typeof value === "bigint" ? Number(value) : Number(value);
  if (num >= 1_000_000_000_000) {
    return `${(num / 1_000_000_000_000).toFixed(1)}兆円`;
  }
  if (num >= 100_000_000) {
    return `${(num / 100_000_000).toFixed(1)}億円`;
  }
  if (num >= 10_000) {
    return `${(num / 10_000).toFixed(0)}万円`;
  }
  return `${formatter.format(num)}円`;
}

export function formatNumber(value: string | number): string {
  return formatter.format(Number(value));
}

export function bigIntToNumber(value: string | number | bigint): number {
  return Number(value);
}

export function formatCurrencyExact(value: string | number | bigint): string {
  return `¥${formatter.format(Number(value))}`;
}
