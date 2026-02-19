export const dynamic = 'force-dynamic'
import { ApiError, handleApiError, jsonResponse, serializeBigInt } from "@ojpp/api";
import { prisma } from "@ojpp/db";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const report = await prisma.fundReport.findUnique({
      where: { id },
      include: {
        organization: { include: { party: true } },
        incomes: { orderBy: { amount: "desc" } },
        expenditures: { orderBy: { amount: "desc" } },
      },
    });

    if (!report) {
      throw ApiError.notFound("報告書が見つかりません");
    }

    return jsonResponse(serializeBigInt(report));
  } catch (error) {
    return handleApiError(error);
  }
}
