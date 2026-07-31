import { Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";

interface CodeBlockProps {
  title?: string;
  language?: string;
  code: string;
}

export default function CodeBlock({
  title,
  language = "text",
  code,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) {
      return;
    }

    const timer = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-lg">
      <div className="flex items-center justify-between border-b border-white/8 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            {["#ff5f57", "#febc2e", "#28c840"].map((color) => (
              <span
                key={color}
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: color }}
              />
            ))}
          </div>
          <div>
            {title ? (
              <div className="text-xs font-semibold text-slate-100">{title}</div>
            ) : null}
            <div className="text-[11px] uppercase tracking-[0.2em] text-slate-400">
              {language}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-slate-300 transition-colors hover:bg-white/10"
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
          {copied ? "已复制" : "复制"}
        </button>
      </div>

      <pre className="overflow-x-auto px-4 py-4 text-[13px] leading-6 text-slate-100">
        <code>{code}</code>
      </pre>
    </div>
  );
}
