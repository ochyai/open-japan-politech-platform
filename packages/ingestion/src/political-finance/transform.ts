/**
 * Raw APIデータ → Prismaモデルへの変換
 */

import type {
  RawOrganization,
  RawFundReport,
  RawIncome,
  RawExpenditure,
} from "./client";

import type {
  OrgType,
  IncomeCategory,
  ExpenditureCategory,
  ReportStatus,
} from "@ojpp/db";

export interface TransformedOrganization {
  name: string;
  type: OrgType;
  address: string | null;
  representative: string | null;
  treasurer: string | null;
}

export interface TransformedReport {
  fiscalYear: number;
  reportingBody: string;
  totalIncome: bigint;
  totalExpenditure: bigint;
  balance: bigint;
  status: ReportStatus;
}

export interface TransformedIncome {
  category: IncomeCategory;
  subcategory: string | null;
  source: string | null;
  amount: bigint;
  date: Date | null;
  description: string | null;
}

export interface TransformedExpenditure {
  category: ExpenditureCategory;
  subcategory: string | null;
  recipient: string | null;
  amount: bigint;
  date: Date | null;
  description: string | null;
}

export function transformOrganization(raw: RawOrganization): TransformedOrganization {
  return {
    name: raw.name,
    type: raw.type as OrgType,
    address: raw.address || null,
    representative: raw.representative || null,
    treasurer: raw.treasurer || null,
  };
}

export function transformReport(raw: RawFundReport): TransformedReport {
  return {
    fiscalYear: raw.fiscalYear,
    reportingBody: raw.reportingBody,
    totalIncome: raw.totalIncome,
    totalExpenditure: raw.totalExpenditure,
    balance: raw.balance,
    status: "PUBLISHED" as ReportStatus,
  };
}

export function transformIncome(raw: RawIncome): TransformedIncome {
  return {
    category: raw.category as IncomeCategory,
    subcategory: raw.subcategory || null,
    source: raw.source || null,
    amount: raw.amount,
    date: raw.date ? new Date(raw.date) : null,
    description: raw.description || null,
  };
}

export function transformExpenditure(raw: RawExpenditure): TransformedExpenditure {
  return {
    category: raw.category as ExpenditureCategory,
    subcategory: raw.subcategory || null,
    recipient: raw.recipient || null,
    amount: raw.amount,
    date: raw.date ? new Date(raw.date) : null,
    description: raw.description || null,
  };
}
