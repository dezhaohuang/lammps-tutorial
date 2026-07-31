import { CheckCircle2, CircleAlert, Users } from "lucide-react";

interface InfoCardProps {
  title: string;
  audience?: string;
  pros?: string[];
  cons?: string[];
  children: React.ReactNode;
}

export default function InfoCard({
  title,
  audience,
  pros = [],
  cons = [],
  children,
}: InfoCardProps) {
  return (
    <article className="rounded-[28px] border border-border bg-card p-6 shadow-sm sm:p-7">
      <div className="flex flex-col gap-4 border-b border-border pb-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3
              className="font-serif text-2xl font-bold"
              style={{ color: "oklch(0.24 0.05 260)" }}
            >
              {title}
            </h3>
            {audience ? (
              <p
                className="mt-3 text-sm leading-7"
                style={{ color: "oklch(0.46 0.02 250)" }}
              >
                {audience}
              </p>
            ) : null}
          </div>

          <div
            className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold"
            style={{
              background: "oklch(0.95 0.02 230)",
              color: "oklch(0.43 0.08 230)",
            }}
          >
            <Users size={14} />
            适用人群
          </div>
        </div>

        {(pros.length > 0 || cons.length > 0) && (
          <div className="grid gap-4 md:grid-cols-2">
            <div
              className="rounded-2xl border p-4"
              style={{
                background: "oklch(0.985 0.01 180)",
                borderColor: "oklch(0.9 0.02 180)",
              }}
            >
              <div
                className="mb-3 flex items-center gap-2 text-sm font-semibold"
                style={{ color: "oklch(0.42 0.11 180)" }}
              >
                <CheckCircle2 size={16} />
                优点
              </div>
              <ul className="space-y-2">
                {pros.map((item) => (
                  <li
                    key={item}
                    className="text-sm leading-6"
                    style={{ color: "oklch(0.36 0.02 240)" }}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div
              className="rounded-2xl border p-4"
              style={{
                background: "oklch(0.988 0.012 35)",
                borderColor: "oklch(0.91 0.018 35)",
              }}
            >
              <div
                className="mb-3 flex items-center gap-2 text-sm font-semibold"
                style={{ color: "oklch(0.55 0.12 35)" }}
              >
                <CircleAlert size={16} />
                注意点
              </div>
              <ul className="space-y-2">
                {cons.map((item) => (
                  <li
                    key={item}
                    className="text-sm leading-6"
                    style={{ color: "oklch(0.36 0.02 240)" }}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6">{children}</div>
    </article>
  );
}
