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
        <button onClick={handleCopy} className="ml-auto p-1 rounded hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" title="复制代码">
          {copied ? <Check size={14} style={{ color: "#28c840" }} /> : <Copy size={14} style={{ color: "oklch(0.65 0.02 260)" }} />}
        </button>
      </div>
      <div className="overflow-x-auto">
        <div className="p-4 space-y-0">
          {lines.map((line, i) => (
            <div
              key={i}
              className="flex items-start gap-4 px-2 py-1 rounded transition-colors duration-200 cursor-default"
              style={{
                background: hoveredLine === i ? "oklch(0.25 0.03 200 / 0.5)" : "transparent",
              }}
              onMouseEnter={() => setHoveredLine(i)}
              onMouseLeave={() => setHoveredLine(null)}
            >
              <span className="text-xs shrink-0 w-5 text-right select-none pt-0.5"
                style={{ color: "oklch(0.45 0.02 260)", fontFamily: "'JetBrains Mono', monospace" }}>
                {i + 1}
              </span>
              <code className="text-sm flex-1" style={{ color: "oklch(0.88 0.04 195)", fontFamily: "'JetBrains Mono', monospace" }}>
                {line.code}
              </code>
              {line.comment && hoveredLine === i && (
                <span className="text-xs shrink-0 max-w-[260px] px-2 py-1 rounded"
                  style={{ background: "oklch(0.30 0.05 195)", color: "oklch(0.85 0.02 195)" }}>
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
