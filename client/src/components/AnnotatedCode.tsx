interface AnnotatedLine {
  code: string;
  comment: string;
}

interface AnnotatedCodeProps {
  title?: string;
  lines: AnnotatedLine[];
}

export default function AnnotatedCode({
  title,
  lines,
}: AnnotatedCodeProps) {
  return (
    <div className="overflow-hidden rounded-[28px] border border-border bg-card shadow-sm">
      {title ? (
        <div
          className="border-b border-border px-5 py-4 font-semibold"
          style={{ color: "oklch(0.25 0.05 260)" }}
        >
          {title}
        </div>
      ) : null}

      <div className="divide-y divide-border">
        {lines.map((line, index) => (
          <div
            key={`${index}-${line.code}-${line.comment}`}
            className="grid gap-3 px-4 py-3 transition-colors hover:bg-muted/50 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]"
          >
            <div className="flex gap-3 overflow-x-auto font-mono text-[13px] leading-6">
              <span className="select-none text-muted-foreground">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="whitespace-pre text-slate-800">
                {line.code || " "}
              </span>
            </div>
            <div
              className="text-sm leading-6"
              style={{ color: "oklch(0.46 0.02 250)" }}
            >
              {line.comment || " "}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
