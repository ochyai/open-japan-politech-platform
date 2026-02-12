"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = [
  "#3B82F6",
  "#EF4444",
  "#10B981",
  "#F59E0B",
  "#8B5CF6",
  "#EC4899",
  "#06B6D4",
  "#F97316",
];

interface YearlyData {
  year: number;
  totalIncome: string | number;
  totalExpenditure: string | number;
}

export function YearlyBarChart({ data }: { data: YearlyData[] }) {
  const chartData = data.map((d) => ({
    year: `${d.year}年`,
    収入: Number(d.totalIncome) / 100_000_000,
    支出: Number(d.totalExpenditure) / 100_000_000,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="year" />
        <YAxis
          tickFormatter={(v: number) => `${v.toFixed(0)}億`}
        />
        <Tooltip
          formatter={(value: number) => [`${value.toFixed(1)}億円`]}
        />
        <Legend />
        <Bar dataKey="収入" fill="#3B82F6" />
        <Bar dataKey="支出" fill="#EF4444" />
      </BarChart>
    </ResponsiveContainer>
  );
}

interface PieData {
  name: string;
  value: number;
}

export function CategoryPieChart({ data }: { data: PieData[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={100}
          dataKey="value"
          label={({ name, percent }: { name: string; percent: number }) =>
            `${name} ${(percent * 100).toFixed(0)}%`
          }
        >
          {data.map((_entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number) => [
            `${(value / 100_000_000).toFixed(1)}億円`,
          ]}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

interface PartyBarData {
  name: string;
  color: string;
  totalIncome: string | number;
  totalExpenditure: string | number;
}

export function PartyComparisonChart({ data }: { data: PartyBarData[] }) {
  const chartData = data.map((d) => ({
    name: d.name,
    収入: Number(d.totalIncome) / 100_000_000,
    支出: Number(d.totalExpenditure) / 100_000_000,
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={chartData} layout="vertical" margin={{ left: 80 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          type="number"
          tickFormatter={(v: number) => `${v.toFixed(0)}億`}
        />
        <YAxis type="category" dataKey="name" width={80} />
        <Tooltip
          formatter={(value: number) => [`${value.toFixed(1)}億円`]}
        />
        <Legend />
        <Bar dataKey="収入" fill="#3B82F6" />
        <Bar dataKey="支出" fill="#EF4444" />
      </BarChart>
    </ResponsiveContainer>
  );
}
