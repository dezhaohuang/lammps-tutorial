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
    border: "oklch(0.80 0.12 75)",
    iconBg: "oklch(0.92 0.06 75)",
    iconColor: "oklch(0.60 0.16 75)",
    titleColor: "oklch(0.45 0.10 75)",
  },
  info: {
    icon: Info,
    bg: "oklch(0.96 0.02 240)",
    border: "oklch(0.78 0.10 240)",
    iconBg: "oklch(0.92 0.04 240)",
    iconColor: "oklch(0.50 0.14 240)",
    titleColor: "oklch(0.35 0.10 240)",
  },
  tip: {
    icon: Lightbulb,
    bg: "oklch(0.96 0.02 150)",
    border: "oklch(0.78 0.10 150)",
    iconBg: "oklch(0.92 0.04 150)",
    iconColor: "oklch(0.45 0.14 150)",
    titleColor: "oklch(0.35 0.10 150)",
  },
};

export default function WarningBox({ type = "warning", title, children }: WarningBoxProps) {
  const c = config[type];
  const Icon = c.icon;
  return (
    <div className="rounded-xl p-4 my-4 border-l-4" style={{ background: c.bg, borderLeftColor: c.border }}>
      <div className="flex items-start gap-3">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
          style={{ background: c.iconBg }}>
          <Icon size={15} style={{ color: c.iconColor }} />
        </div>
        <div className="flex-1">
          {title && <p className="font-semibold text-sm mb-1.5" style={{ color: c.titleColor }}>{title}</p>}
          <div className="text-sm leading-relaxed" style={{ color: "oklch(0.35 0.02 260)" }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
