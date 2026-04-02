import { useState, useCallback } from "react";
import { Check, Copy } from "lucide-react";

interface CodeBlockProps {
  code: string;
  title?: string;
  language?: string;
}

export default function CodeBlock({ code, title, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  return (
    <div className="terminal-block my-4 group">
      <div className="terminal-header">
        <div className="terminal-dot" style={{ background: "#ff5f57" }} />
        <div className="terminal-dot" style={{ background: "#febc2e" }} />
        <div className="terminal-dot" style={{ background: "#28c840" }} />
        {title && (
          <span className="ml-2 text-xs" style={{ color: "oklch(0.65 0.02 260)" }}>
            {title}
          </span>
        )}
        {language && (
          <span className="ml-auto text-xs px-2 py-0.5 rounded" style={{ color: "oklch(0.55 0.10 195)", background: "oklch(0.25 0.02 260)" }}>
            {language}
          </span>
        )}
        <button
          onClick={handleCopy}
          className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-white/10"
          title="复制代码"
        >
          {copied ? (
            <Check size={14} style={{ color: "#28c840" }} />
          ) : (
            <Copy size={14} style={{ color: "oklch(0.65 0.02 260)" }} />
          )}
        </button>
      </div>
      <div className="terminal-body">
        <pre className="whitespace-pre-wrap break-words">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}
