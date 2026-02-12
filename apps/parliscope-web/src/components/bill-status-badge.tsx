import { Badge } from "@ojpp/ui";

const STATUS_MAP: Record<string, { label: string; variant: "default" | "success" | "warning" | "danger" | "info" }> = {
  SUBMITTED: { label: "提出", variant: "default" },
  COMMITTEE: { label: "委員会審議中", variant: "info" },
  PLENARY: { label: "本会議審議中", variant: "info" },
  PASSED_LOWER: { label: "衆院可決", variant: "warning" },
  PASSED_UPPER: { label: "参院可決", variant: "warning" },
  ENACTED: { label: "成立", variant: "success" },
  REJECTED: { label: "否決", variant: "danger" },
  WITHDRAWN: { label: "撤回", variant: "danger" },
};

export function BillStatusBadge({ status }: { status: string }) {
  const config = STATUS_MAP[status] ?? { label: status, variant: "default" as const };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
