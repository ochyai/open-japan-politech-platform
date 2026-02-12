import { Card, Badge } from "@ojpp/ui";

interface PolicyCardProps {
  id: string;
  title: string;
  category: string;
  partyName?: string;
  partyColor?: string | null;
  status: string;
  contentPreview?: string;
}

export function PolicyCard({
  id,
  title,
  category,
  partyName,
  partyColor,
  status,
  contentPreview,
}: PolicyCardProps) {
  const statusVariant = status === "PUBLISHED"
    ? "success"
    : status === "DRAFT"
      ? "warning"
      : "default";

  return (
    <a href={`/policy/${id}`} className="block transition-shadow hover:shadow-md">
      <Card padding="sm" className="h-full">
        <div className="mb-2 flex items-center justify-between gap-2">
          <Badge variant="info">{category}</Badge>
          <Badge variant={statusVariant}>{status}</Badge>
        </div>
        {partyName && (
          <div className="mb-2 flex items-center gap-1.5">
            {partyColor && (
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: partyColor }}
              />
            )}
            <span className="text-xs font-medium text-gray-600">{partyName}</span>
          </div>
        )}
        <h3 className="mb-2 text-sm font-bold leading-snug">{title}</h3>
        {contentPreview && (
          <p className="line-clamp-2 text-xs text-gray-500">{contentPreview}</p>
        )}
      </Card>
    </a>
  );
}
