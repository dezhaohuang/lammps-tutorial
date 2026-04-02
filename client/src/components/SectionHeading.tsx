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
        <span className="inline-block text-xs font-medium tracking-wider uppercase px-3 py-1 rounded-full mb-4"
          style={{ background: "oklch(0.94 0.04 195)", color: "oklch(0.35 0.10 195)" }}>
          {badge}
        </span>
      )}
      <h2 id={id} className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight"
        style={{ color: "oklch(0.22 0.06 260)" }}>
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-base md:text-lg leading-relaxed" style={{ color: "oklch(0.45 0.02 260)" }}>
          {subtitle}
        </p>
      )}
      <div className="mt-4 w-16 h-1 rounded-full" style={{ background: "linear-gradient(90deg, oklch(0.65 0.15 195), oklch(0.35 0.10 260))" }} />
    </div>
  );
}
