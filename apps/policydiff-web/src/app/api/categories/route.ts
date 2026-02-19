export const dynamic = 'force-dynamic'
import { handleApiError, jsonResponse } from "@ojpp/api";
import { prisma } from "@ojpp/db";

export async function GET() {
  try {
    const categories = await prisma.policy.groupBy({
      by: ["category"],
      _count: { id: true },
      orderBy: { category: "asc" },
    });

    const data = categories.map((c) => ({
      name: c.category,
      count: c._count.id,
    }));

    return jsonResponse({ data });
  } catch (error) {
    return handleApiError(error);
  }
}
