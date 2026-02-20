export const dynamic = "force-dynamic";

import { handleApiError, jsonResponse } from "@ojpp/api";
import { prisma } from "@ojpp/db";

export async function GET() {
  try {
    const parties = await prisma.party.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: { policies: true },
        },
      },
      orderBy: { name: "asc" },
    });

    return jsonResponse({ data: parties });
  } catch (error) {
    return handleApiError(error);
  }
}
