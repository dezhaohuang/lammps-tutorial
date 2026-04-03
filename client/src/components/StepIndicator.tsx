interface StepProps {
  number: number;
  title: string;
  children: React.ReactNode;
}

export default function StepIndicator({ number, title, children }: StepProps) {
  return (
    <div className="flex gap-4 md:gap-6 group/step">
      <div className="flex flex-col items-center shrink-0">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold relative transition-shadow duration-300 group-hover/step:shadow-lg"
          style={{
            background: "linear-gradient(135deg, oklch(0.35 0.10 260), oklch(0.50 0.14 200))",
            color: "white",
            boxShadow: "0 2px 8px oklch(0.35 0.10 260 / 0.25)",
          }}
        >
          {number}
        </div>
        <div className="w-px flex-1 mt-2 relative overflow-hidden" style={{ background: "oklch(0.90 0.01 200)" }}>
          <div
            className="absolute inset-x-0 top-0 w-full opacity-0 group-hover/step:opacity-100 transition-opacity duration-500"
            style={{
              height: "100%",
              background: "linear-gradient(180deg, oklch(0.55 0.15 195 / 0.6), transparent)",
            }}
          />
        </div>
      </div>
      <div className="pb-8 flex-1">
        <h4 className="text-base font-bold mb-2 group-hover/step:translate-x-0.5 transition-transform duration-200" style={{ color: "oklch(0.25 0.06 260)" }}>{title}</h4>
        <div className="text-sm leading-relaxed" style={{ color: "oklch(0.40 0.02 260)" }}>
          {children}
        </div>
      </div>
    </div>
  );
}
