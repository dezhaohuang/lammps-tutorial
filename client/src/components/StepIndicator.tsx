interface StepIndicatorProps {
  number: number;
  title: string;
  children: React.ReactNode;
}

export default function StepIndicator({
  number,
  title,
  children,
}: StepIndicatorProps) {
  return (
    <div className="relative pl-14 pb-8 last:pb-0">
      <div
        className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-2xl text-sm font-bold shadow-sm"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.52 0.15 195), oklch(0.38 0.1 240))",
          color: "white",
        }}
      >
        {number}
      </div>

      <div
        className="absolute left-[19px] top-12 bottom-0 w-px last:hidden"
        style={{ background: "linear-gradient(oklch(0.85 0.03 210), transparent)" }}
      />

      <div>
        <h4
          className="pt-1 text-base font-bold"
          style={{ color: "oklch(0.25 0.05 260)" }}
        >
          {title}
        </h4>
        <div
          className="mt-3 space-y-3 text-sm leading-7"
          style={{ color: "oklch(0.38 0.02 250)" }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
