import { CheckCircle, XCircle, User } from "lucide-react";

interface InfoCardProps {
  title: string;
  audience: string;
  pros: string[];
  cons: string[];
  children?: React.ReactNode;
}

export default function InfoCard({ title, audience, pros, cons, children }: InfoCardProps) {
  return (
    <div className="bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
      <div className="p-5 md:p-6 border-b border-border relative overflow-hidden" style={{ background: "oklch(0.97 0.005 200)" }}>
        {/* Subtle gradient accent */}
        <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg, oklch(0.55 0.15 195), oklch(0.35 0.10 260))" }} />
        <h4 className="text-lg font-bold" style={{ color: "oklch(0.25 0.08 260)" }}>{title}</h4>
        <div className="flex items-start gap-2 mt-2">
          <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: "oklch(0.94 0.04 195)" }}>
            <User size={12} style={{ color: "oklch(0.45 0.12 195)" }} />
          </div>
          <span className="text-sm" style={{ color: "oklch(0.45 0.03 260)" }}>{audience}</span>
        </div>
      </div>
      <div className="p-5 md:p-6 space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg" style={{ background: "oklch(0.97 0.01 150 / 0.5)" }}>
            <h5 className="text-sm font-semibold mb-2.5 flex items-center gap-1.5" style={{ color: "oklch(0.40 0.12 150)" }}>
              <CheckCircle size={14} />
              优点
            </h5>
            <ul className="space-y-2">
              {pros.map((p, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: "oklch(0.55 0.15 150)" }} />
                  <span style={{ color: "oklch(0.35 0.02 260)" }}>{p}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="p-4 rounded-lg" style={{ background: "oklch(0.97 0.01 30 / 0.5)" }}>
            <h5 className="text-sm font-semibold mb-2.5 flex items-center gap-1.5" style={{ color: "oklch(0.55 0.15 30)" }}>
              <XCircle size={14} />
              局限
            </h5>
            <ul className="space-y-2">
              {cons.map((c, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: "oklch(0.65 0.15 30)" }} />
                  <span style={{ color: "oklch(0.35 0.02 260)" }}>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
