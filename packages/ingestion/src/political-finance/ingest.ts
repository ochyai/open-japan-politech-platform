/**
 * 政治資金データの取り込みメインスクリプト
 *
 * 11政党 x (政党支部 + 資金管理団体) x 3年分 = 66件の報告書を生成
 */

import { prisma } from "@ojpp/db";
import { getParties, getOrganizations, getReportsWithDetails } from "./client";
import {
  transformOrganization,
  transformReport,
  transformIncome,
  transformExpenditure,
} from "./transform";

export async function ingestPoliticalFinance(): Promise<void> {
  console.log("[ingest] 政治資金データの取り込みを開始...");

  // 1. 政党をupsert
  const partyData = getParties();
  const partyMap = new Map<string, string>();

  for (const p of partyData) {
    const party = await prisma.party.upsert({
      where: { name: p.name },
      update: {
        shortName: p.shortName,
        color: p.color,
        website: p.website,
        isActive: p.isActive,
      },
      create: {
        name: p.name,
        shortName: p.shortName,
        color: p.color,
        website: p.website,
        founded: new Date(p.founded),
        isActive: p.isActive,
      },
    });
    partyMap.set(p.name, party.id);
    console.log(`[ingest] 政党: ${p.name} (${party.id})`);
  }

  // 2. 政治団体をupsert
  const rawOrgs = getOrganizations();
  const orgMap = new Map<string, string>();

  for (const rawOrg of rawOrgs) {
    const transformed = transformOrganization(rawOrg);
    const partyId = partyMap.get(rawOrg.partyName);
    if (!partyId) continue;

    const existing = await prisma.politicalOrganization.findFirst({
      where: { name: transformed.name, partyId },
    });

    let org;
    if (existing) {
      org = await prisma.politicalOrganization.update({
        where: { id: existing.id },
        data: {
          type: transformed.type,
          address: transformed.address,
          representative: transformed.representative,
          treasurer: transformed.treasurer,
        },
      });
    } else {
      org = await prisma.politicalOrganization.create({
        data: {
          name: transformed.name,
          type: transformed.type,
          partyId,
          address: transformed.address,
          representative: transformed.representative,
          treasurer: transformed.treasurer,
        },
      });
    }
    orgMap.set(rawOrg.name, org.id);
    console.log(`[ingest] 団体: ${rawOrg.name} (${org.id})`);
  }

  // 3. 報告書と収支明細を生成
  const { reports, incomes, expenditures } = getReportsWithDetails();

  for (const rawReport of reports) {
    const organizationId = orgMap.get(rawReport.organizationName);
    if (!organizationId) continue;

    const transformed = transformReport(rawReport);

    const report = await prisma.fundReport.upsert({
      where: {
        organizationId_fiscalYear: {
          organizationId,
          fiscalYear: transformed.fiscalYear,
        },
      },
      update: {
        reportingBody: transformed.reportingBody,
        totalIncome: transformed.totalIncome,
        totalExpenditure: transformed.totalExpenditure,
        balance: transformed.balance,
        status: transformed.status,
      },
      create: {
        organizationId,
        fiscalYear: transformed.fiscalYear,
        reportingBody: transformed.reportingBody,
        totalIncome: transformed.totalIncome,
        totalExpenditure: transformed.totalExpenditure,
        balance: transformed.balance,
        status: transformed.status,
      },
    });

    // Delete existing incomes and expenditures for this report
    await prisma.fundIncome.deleteMany({ where: { reportId: report.id } });
    await prisma.fundExpenditure.deleteMany({ where: { reportId: report.id } });

    // Insert incomes
    const reportIncomes = incomes.filter(
      (i) =>
        i.organizationName === rawReport.organizationName &&
        i.fiscalYear === rawReport.fiscalYear,
    );
    for (const rawIncome of reportIncomes) {
      const ti = transformIncome(rawIncome);
      await prisma.fundIncome.create({
        data: {
          reportId: report.id,
          category: ti.category,
          subcategory: ti.subcategory,
          source: ti.source,
          amount: ti.amount,
          date: ti.date,
          description: ti.description,
        },
      });
    }

    // Insert expenditures
    const reportExpenditures = expenditures.filter(
      (e) =>
        e.organizationName === rawReport.organizationName &&
        e.fiscalYear === rawReport.fiscalYear,
    );
    for (const rawExp of reportExpenditures) {
      const te = transformExpenditure(rawExp);
      await prisma.fundExpenditure.create({
        data: {
          reportId: report.id,
          category: te.category,
          subcategory: te.subcategory,
          recipient: te.recipient,
          amount: te.amount,
          date: te.date,
          description: te.description,
        },
      });
    }

    console.log(
      `[ingest] 報告書: ${rawReport.organizationName} ${rawReport.fiscalYear}年 ` +
        `収入=${transformed.totalIncome} 支出=${transformed.totalExpenditure}`,
    );
  }

  console.log("[ingest] 政治資金データの取り込みが完了しました。");
}

// CLI実行
if (process.argv[1]?.includes("political-finance/ingest")) {
  ingestPoliticalFinance()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
