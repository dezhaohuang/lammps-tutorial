interface SectionHeadingProps {
  id: string;
  title: string;
  subtitle?: string;
  badge?: string;
}

export default function SectionHeading({ id, title, subtitle, badge }: SectionHeadingProps) {
  return (
    <div className="mb-8 md:mb-10">
      {badge && (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase px-3.5 py-1.5 rounded-full mb-4"
          style={{
            background: "linear-gradient(135deg, oklch(0.94 0.04 195), oklch(0.96 0.02 220))",
            color: "oklch(0.30 0.10 195)",
            boxShadow: "0 1px 4px oklch(0.55 0.15 195 / 0.12)",
          }}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: "oklch(0.55 0.15 195)" }} />
          {badge}
        </span>
      )}
      <h2 id={id} className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight"
        style={{ color: "oklch(0.22 0.06 260)" }}>
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-base md:text-lg leading-relaxed max-w-3xl" style={{ color: "oklch(0.45 0.02 260)" }}>
          {subtitle}
        </p>
      )}
      <div className="mt-5 flex items-center gap-2">
        <div className="w-12 h-1 rounded-full" style={{ background: "linear-gradient(90deg, oklch(0.55 0.15 195), oklch(0.35 0.10 260))" }} />
        <div className="w-2 h-2 rounded-full" style={{ background: "oklch(0.65 0.15 195)" }} />
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: "oklch(0.55 0.12 260 / 0.5)" }} />
      </div>
    </div>
  );
}
