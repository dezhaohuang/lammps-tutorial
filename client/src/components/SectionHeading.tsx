import { Clock } from "lucide-react";

interface SectionHeadingProps {
  id?: string;
  title: string;
  subtitle?: string;
  badge?: string;
  readingTime?: string;
}

export default function SectionHeading({
  id,
  title,
  subtitle,
  badge,
  readingTime,
}: SectionHeadingProps) {
  return (
    <div className="mb-10 md:mb-12">
      <div className="flex flex-wrap items-center gap-2">
        {badge ? (
          <div
            className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold tracking-[0.24em] uppercase"
            style={{
              background: "oklch(0.96 0.03 195)",
              color: "oklch(0.42 0.12 195)",
            }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: "oklch(0.55 0.15 195)" }}
            />
            {badge}
          </div>
        ) : null}
        {readingTime ? (
          <div
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium"
            style={{
              background: "oklch(0.96 0.01 240)",
              color: "oklch(0.48 0.04 240)",
            }}
          >
            <Clock size={11} />
            {readingTime}
          </div>
        ) : null}
      </div>

      <h2
        id={id}
        className="mt-4 font-serif text-3xl font-black tracking-[0.01em] sm:text-4xl"
        style={{ color: "oklch(0.24 0.05 260)" }}
      >
        {title}
      </h2>

      {subtitle ? (
        <p
          className="mt-4 max-w-3xl text-sm leading-7 sm:text-base"
          style={{ color: "oklch(0.46 0.02 250)" }}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
