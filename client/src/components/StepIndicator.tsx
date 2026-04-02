interface StepProps {
  number: number;
  title: string;
  children: React.ReactNode;
}

export default function StepIndicator({ number, title, children }: StepProps) {
  return (
    <div className="flex gap-4 md:gap-6">
      <div className="flex flex-col items-center shrink-0">
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
          style={{ background: "linear-gradient(135deg, oklch(0.35 0.10 260), oklch(0.55 0.15 195))", color: "white" }}>
          {number}
        </div>
        <div className="w-px flex-1 mt-2" style={{ background: "oklch(0.88 0.01 200)" }} />
      </div>
      <div className="pb-8 flex-1">
        <h4 className="text-base font-bold mb-2" style={{ color: "oklch(0.25 0.06 260)" }}>{title}</h4>
        <div className="text-sm leading-relaxed" style={{ color: "oklch(0.40 0.02 260)" }}>
          {children}
        </div>
      </div>
    </div>
  );
}
