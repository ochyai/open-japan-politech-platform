import type { NextRequest } from "next/server";

export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function parsePagination(
  request: NextRequest,
  defaults: { page?: number; limit?: number } = {},
): PaginationParams {
  const url = new URL(request.url);
  const page = Math.max(1, Number(url.searchParams.get("page")) || defaults.page || 1);
  const limit = Math.min(100, Math.max(1, Number(url.searchParams.get("limit")) || defaults.limit || 20));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

export function buildPaginatedResponse<T>(
  data: T[],
  total: number,
  params: PaginationParams,
): PaginatedResponse<T> {
  return {
    data,
    pagination: {
      page: params.page,
      limit: params.limit,
      total,
      totalPages: Math.ceil(total / params.limit),
    },
  };
}
