"use client";

import { YearlyBarChart } from "@/components/fund-chart";

interface Props {
  yearlyStats: {
    year: number;
    totalIncome: string | number;
    totalExpenditure: string | number;
  }[];
}

export function PartyDetailCharts({ yearlyStats }: Props) {
  return <YearlyBarChart data={yearlyStats} />;
}
