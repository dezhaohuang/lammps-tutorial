import { useState, useCallback, useMemo } from "react";
import { Check, Copy } from "lucide-react";

interface CodeBlockProps {
  code: string;
  title?: string;
  language?: string;
}

/* ─── Simple syntax highlighter ─── */
function highlightLine(line: string, language?: string): React.ReactNode[] {
  const tokens: React.ReactNode[] = [];
  let remaining = line;
  let key = 0;

  const push = (text: string, cls?: string) => {
    if (!text) return;
    tokens.push(cls ? <span key={key++} className={cls}>{text}</span> : <span key={key++}>{text}</span>);
  };

  // Comment detection
  const commentChar = language === "python" ? "#" : "#";
  const commentIdx = remaining.indexOf(commentChar);
  if (commentIdx >= 0 && (language === "bash" || language === "shell" || language === "python" || language === "lammps")) {
    // Check if # is inside quotes
    const beforeHash = remaining.slice(0, commentIdx);
    const singleQuotes = (beforeHash.match(/'/g) || []).length;
    const doubleQuotes = (beforeHash.match(/"/g) || []).length;
    if (singleQuotes % 2 === 0 && doubleQuotes % 2 === 0) {
      const codePart = remaining.slice(0, commentIdx);
      const commentPart = remaining.slice(commentIdx);
      if (codePart) {
        tokens.push(...highlightCode(codePart, language, key));
        key += 100;
      }
      push(commentPart, "syntax-comment");
      return tokens;
    }
  }

  return highlightCode(remaining, language, key);
}

function highlightCode(code: string, language?: string, startKey = 0): React.ReactNode[] {
  const tokens: React.ReactNode[] = [];
  let key = startKey;

  const push = (text: string, cls?: string) => {
    if (!text) return;
    tokens.push(cls ? <span key={key++} className={cls}>{text}</span> : <span key={key++}>{text}</span>);
  };

  if (!language) {
    push(code);
    return tokens;
  }

  // Regex-based tokenizer
  let patterns: [RegExp, string][] = [];

  if (language === "lammps") {
    patterns = [
      [/^(units|atom_style|dimension|boundary|lattice|region|create_box|create_atoms|mass|pair_style|pair_coeff|pair_modify|kspace_style|bond_style|angle_style|dihedral_style|improper_style|velocity|fix|unfix|compute|dump|undump|thermo|thermo_style|run|minimize|read_data|write_data|group|include|timestep|variable|reset_timestep)\b/, "syntax-keyword"],
      [/"[^"]*"|'[^']*'/, "syntax-string"],
      [/\b\d+\.?\d*([eE][+-]?\d+)?\b/, "syntax-number"],
      [/\$\{?\w+\}?/, "syntax-variable"],
    ];
  } else if (language === "bash" || language === "shell") {
    patterns = [
      [/^(sudo|apt|brew|git|cd|mkdir|make|cmake|module|sbatch|srun|squeue|scancel|sinfo|scp|rsync|cat|tail|mpirun|mpiexec|lmp|lmp_serial|lmp_intel_cpu_intelmpi|wsl|source|ulimit|export|echo|curl|pip|conda|Get-Command|which)\b/, "syntax-command"],
      [/\s(-{1,2}[\w-]+)/, "syntax-flag"],
      [/"[^"]*"|'[^']*'/, "syntax-string"],
      [/\$[\w{}\[\]]+/, "syntax-variable"],
      [/\b\d+\b/, "syntax-number"],
    ];
  } else if (language === "python") {
    patterns = [
      [/\b(import|from|as|def|class|return|if|elif|else|for|while|in|not|and|or|True|False|None|with|try|except|finally|raise|yield|lambda|pass|break|continue|del|assert|global|nonlocal)\b/, "syntax-keyword"],
      [/\b(print|len|range|int|float|str|list|dict|tuple|set|type|isinstance|open|write|read|format|np|plt|linregress)\b/, "syntax-function"],
      [/("""[\s\S]*?"""|'''[\s\S]*?'''|"[^"]*"|'[^']*'|f"[^"]*"|f'[^']*')/, "syntax-string"],
      [/\b\d+\.?\d*([eE][+-]?\d+)?\b/, "syntax-number"],
    ];
  }

  // Simple token-by-token highlighting
  let remaining = code;
  while (remaining.length > 0) {
    let matched = false;
    for (const [pattern, cls] of patterns) {
      const m = remaining.match(pattern);
      if (m && m.index !== undefined) {
        if (m.index > 0) {
          push(remaining.slice(0, m.index));
        }
        push(m[0], cls);
        remaining = remaining.slice(m.index + m[0].length);
        matched = true;
        break;
      }
    }
    if (!matched) {
      // Push one char and continue
      push(remaining[0]);
      remaining = remaining.slice(1);
    }
  }

  return tokens;
}

export default function CodeBlock({ code, title, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  const highlightedLines = useMemo(() => {
    return code.split("\n").map((line, i) => ({
      key: i,
      content: highlightLine(line, language),
    }));
  }, [code, language]);

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
          className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-md hover:bg-white/10"
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
          <code>
            {highlightedLines.map((line, i) => (
              <span key={line.key}>
                {i > 0 && "\n"}
                <span className="inline-block w-8 text-right mr-4 select-none opacity-40 text-xs">{i + 1}</span>
                {line.content}
              </span>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}
