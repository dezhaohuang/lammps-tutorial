import { AlertTriangle, Info, Lightbulb } from "lucide-react";

interface WarningBoxProps {
  type?: "warning" | "info" | "tip";
  title?: string;
  children: React.ReactNode;
}

const config = {
  warning: {
    icon: AlertTriangle,
    bg: "oklch(0.97 0.03 75)",
    border: "oklch(0.85 0.10 75)",
    iconColor: "oklch(0.65 0.15 75)",
    titleColor: "oklch(0.45 0.10 75)",
  },
  info: {
    icon: Info,
    bg: "oklch(0.96 0.02 240)",
    border: "oklch(0.82 0.08 240)",
    iconColor: "oklch(0.55 0.12 240)",
    titleColor: "oklch(0.35 0.10 240)",
  },
  tip: {
    icon: Lightbulb,
    bg: "oklch(0.96 0.02 150)",
    border: "oklch(0.82 0.08 150)",
    iconColor: "oklch(0.50 0.12 150)",
    titleColor: "oklch(0.35 0.10 150)",
  },
};

export default function WarningBox({ type = "warning", title, children }: WarningBoxProps) {
  const c = config[type];
  const Icon = c.icon;
  return (
    <div className="rounded-lg p-4 my-4 border-l-4" style={{ background: c.bg, borderLeftColor: c.border }}>
      <div className="flex items-start gap-3">
        <Icon size={18} className="mt-0.5 shrink-0" style={{ color: c.iconColor }} />
        <div className="flex-1">
          {title && <p className="font-semibold text-sm mb-1" style={{ color: c.titleColor }}>{title}</p>}
          <div className="text-sm leading-relaxed" style={{ color: "oklch(0.35 0.02 260)" }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
