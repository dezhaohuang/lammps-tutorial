import { AlertTriangle, Info, Lightbulb } from "lucide-react";

type WarningType = "info" | "warning" | "tip";

interface WarningBoxProps {
  type?: WarningType;
  title: string;
  children: React.ReactNode;
}

const typeConfig = {
  info: {
    icon: Info,
    background: "oklch(0.98 0.01 220)",
    border: "oklch(0.9 0.02 220)",
    accent: "oklch(0.48 0.12 220)",
  },
  warning: {
    icon: AlertTriangle,
    background: "oklch(0.985 0.012 45)",
    border: "oklch(0.91 0.018 45)",
    accent: "oklch(0.61 0.14 45)",
  },
  tip: {
    icon: Lightbulb,
    background: "oklch(0.985 0.012 175)",
    border: "oklch(0.9 0.02 175)",
    accent: "oklch(0.5 0.12 175)",
  },
} as const;

export default function WarningBox({
  type = "info",
  title,
  children,
}: WarningBoxProps) {
  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <div
      className="mt-5 rounded-2xl border px-4 py-4"
      style={{ background: config.background, borderColor: config.border }}
    >
      <div className="flex gap-3">
        <div
          className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl"
          style={{ background: `${config.accent}20`, color: config.accent }}
        >
          <Icon size={16} />
        </div>
        <div className="min-w-0">
          <h5
            className="text-sm font-semibold"
            style={{ color: "oklch(0.27 0.04 250)" }}
          >
            {title}
          </h5>
          <div
            className="mt-2 space-y-2 text-sm leading-7"
            style={{ color: "oklch(0.39 0.02 240)" }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
