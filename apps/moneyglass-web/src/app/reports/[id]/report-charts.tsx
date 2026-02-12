"use client";

import { CategoryPieChart } from "@/components/fund-chart";

interface Props {
  type: "income" | "expenditure";
  data: { name: string; value: number }[];
}

export function ReportCharts({ data }: Props) {
  return <CategoryPieChart data={data} />;
}
