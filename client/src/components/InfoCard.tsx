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
      <div className="p-5 md:p-6 border-b border-border" style={{ background: "oklch(0.97 0.005 200)" }}>
        <h4 className="text-lg font-bold" style={{ color: "oklch(0.25 0.08 260)" }}>{title}</h4>
        <div className="flex items-start gap-2 mt-2">
          <User size={16} className="mt-0.5 shrink-0" style={{ color: "oklch(0.55 0.10 195)" }} />
          <span className="text-sm" style={{ color: "oklch(0.45 0.03 260)" }}>{audience}</span>
        </div>
      </div>
      <div className="p-5 md:p-6 space-y-4">
        <div>
          <h5 className="text-sm font-semibold mb-2" style={{ color: "oklch(0.40 0.12 150)" }}>优点</h5>
          <ul className="space-y-1.5">
            {pros.map((p, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <CheckCircle size={15} className="mt-0.5 shrink-0" style={{ color: "oklch(0.55 0.15 150)" }} />
                <span style={{ color: "oklch(0.35 0.02 260)" }}>{p}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h5 className="text-sm font-semibold mb-2" style={{ color: "oklch(0.55 0.15 30)" }}>局限</h5>
          <ul className="space-y-1.5">
            {cons.map((c, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <XCircle size={15} className="mt-0.5 shrink-0" style={{ color: "oklch(0.65 0.15 30)" }} />
                <span style={{ color: "oklch(0.35 0.02 260)" }}>{c}</span>
              </li>
            ))}
          </ul>
        </div>
        {children}
      </div>
    </div>
  );
}
