import { useState } from "react";
import { Check, Copy } from "lucide-react";

interface Line {
  code: string;
  comment?: string;
}

interface AnnotatedCodeProps {
  lines: Line[];
  title?: string;
}

export default function AnnotatedCode({ lines, title }: AnnotatedCodeProps) {
  const [hoveredLine, setHoveredLine] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const fullCode = lines.map((l) => l.code).join("\n");

  const handleCopy = () => {
    navigator.clipboard.writeText(fullCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="terminal-block my-6 group">
      <div className="terminal-header">
        <div className="terminal-dot" style={{ background: "#ff5f57" }} />
        <div className="terminal-dot" style={{ background: "#febc2e" }} />
        <div className="terminal-dot" style={{ background: "#28c840" }} />
        {title && (
          <span className="ml-2 text-xs" style={{ color: "oklch(0.65 0.02 260)" }}>{title}</span>
        )}
        <button onClick={handleCopy} className="ml-auto p-1.5 rounded-md hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" title="复制代码">
          {copied ? <Check size={14} style={{ color: "#28c840" }} /> : <Copy size={14} style={{ color: "oklch(0.65 0.02 260)" }} />}
        </button>
      </div>
      <div className="overflow-x-auto">
        <div className="p-4 space-y-0">
          {lines.map((line, i) => (
            <div
              key={i}
              className="flex items-start gap-4 px-2 py-1 rounded-md transition-all duration-200 cursor-default"
              style={{
                background: hoveredLine === i ? "oklch(0.25 0.03 200 / 0.5)" : "transparent",
              }}
              onMouseEnter={() => setHoveredLine(i)}
              onMouseLeave={() => setHoveredLine(null)}
            >
              <span className="text-xs shrink-0 w-5 text-right select-none pt-0.5 tabular-nums"
                style={{ color: hoveredLine === i ? "oklch(0.65 0.10 195)" : "oklch(0.40 0.02 260)", fontFamily: "'JetBrains Mono', monospace", transition: "color 0.2s" }}>
                {i + 1}
              </span>
              <code className="text-sm flex-1" style={{ color: "oklch(0.88 0.04 195)", fontFamily: "'JetBrains Mono', monospace" }}>
                {line.code || "\u00A0"}
              </code>
              {line.comment && hoveredLine === i && (
                <span className="text-xs shrink-0 max-w-[280px] px-3 py-1.5 rounded-lg animate-in fade-in slide-in-from-right-2 duration-200"
                  style={{ background: "oklch(0.28 0.06 195)", color: "oklch(0.88 0.02 195)", boxShadow: "0 2px 8px oklch(0 0 0 / 0.2)" }}>
                  {line.comment}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
