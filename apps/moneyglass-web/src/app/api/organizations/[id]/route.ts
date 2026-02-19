export const dynamic = "force-dynamic";

import { ApiError, handleApiError, jsonResponse, serializeBigInt } from "@ojpp/api";
import { prisma } from "@ojpp/db";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const org = await prisma.politicalOrganization.findUnique({
      where: { id },
      include: {
        party: true,
        fundReports: {
          orderBy: { fiscalYear: "desc" },
        },
      },
    });

    if (!org) {
      throw ApiError.notFound("団体が見つかりません");
    }

    return jsonResponse(serializeBigInt(org));
  } catch (error) {
    return handleApiError(error);
  }
}
