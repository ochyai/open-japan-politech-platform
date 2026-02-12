interface PartyChipProps {
  name: string;
  color?: string | null;
  href?: string;
}

export function PartyChip({ name, color, href }: PartyChipProps) {
  const style = color
    ? { borderColor: color, color: color }
    : {};

  const className =
    "inline-flex items-center rounded-full border-2 px-3 py-1 text-sm font-medium transition-colors hover:opacity-80";

  if (href) {
    return (
      <a href={href} className={className} style={style}>
        {color && (
          <span
            className="mr-1.5 inline-block h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: color }}
          />
        )}
        {name}
      </a>
    );
  }

  return (
    <span className={className} style={style}>
      {color && (
        <span
          className="mr-1.5 inline-block h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: color }}
        />
      )}
      {name}
    </span>
  );
}
