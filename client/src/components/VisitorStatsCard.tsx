import { Activity, Eye, RadioTower, Users } from "lucide-react";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import type { SiteStatsSnapshot } from "@shared/site-stats";

const numberFormatter = new Intl.NumberFormat("zh-CN");

const statItems = [
  {
    key: "totalVisitors",
    label: "累计访客",
    description: "按匿名设备去重",
    icon: Users,
  },
  {
    key: "totalVisits",
    label: "累计访问",
    description: "页面总访问次数",
    icon: Eye,
  },
  {
    key: "todayVisitors",
    label: "今日访客",
    description: "按北京时间统计",
    icon: Activity,
  },
] as const;

function formatNumber(value?: number) {
  if (typeof value !== "number") {
    return "—";
  }

  return numberFormatter.format(value);
}

function formatLastUpdated(lastUpdatedAt?: string) {
  if (!lastUpdatedAt) {
    return "正在同步统计数据";
  }

  const date = new Date(lastUpdatedAt);
  if (Number.isNaN(date.getTime())) {
    return "统计数据已更新";
  }

  const delta = Date.now() - date.getTime();
  if (delta < 60_000) {
    return "刚刚更新";
  }

  if (delta < 3_600_000) {
    return `${Math.max(1, Math.floor(delta / 60_000))} 分钟前更新`;
  }

  return new Intl.DateTimeFormat("zh-CN", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default function VisitorStatsCard() {
  const [stats, setStats] = useState<SiteStatsSnapshot | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let disposed = false;

    const requestStats = async (method: "GET" | "POST") => {
      try {
        const response = await fetch("/api/stats/visits", {
          method,
          credentials: "same-origin",
          headers: {
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Failed with ${response.status}`);
        }

        const payload = (await response.json()) as SiteStatsSnapshot;
        if (disposed) {
          return;
        }

        setStats(payload);
        setStatus("ready");
      } catch {
        if (disposed) {
          return;
        }

        setStatus((current) => (current === "loading" ? "error" : current));
      }
    };

    void requestStats("POST");

    const timer = window.setInterval(() => {
      void requestStats("GET");
    }, 60_000);

    return () => {
      disposed = true;
      window.clearInterval(timer);
    };
  }, []);

  const isLoading = status === "loading" && !stats;

  return (
    <div
      className="relative overflow-hidden rounded-[30px] border px-5 py-5 text-left shadow-2xl sm:px-6 sm:py-6"
      style={{
        background:
          "linear-gradient(135deg, oklch(1 0 0 / 0.08), oklch(0.55 0.15 195 / 0.11))",
        backdropFilter: "blur(22px) saturate(1.25)",
        borderColor: "oklch(1 0 0 / 0.14)",
        boxShadow:
          "0 22px 70px oklch(0 0 0 / 0.22), inset 0 1px 0 oklch(1 0 0 / 0.12)",
      }}
    >
      <div
        className="pointer-events-none absolute -right-12 -top-16 h-36 w-36 rounded-full"
        style={{
          background: "oklch(0.68 0.12 185 / 0.16)",
          filter: "blur(34px)",
        }}
      />
      <div
        className="pointer-events-none absolute -bottom-16 left-0 h-28 w-36 rounded-full"
        style={{
          background: "oklch(0.52 0.11 240 / 0.16)",
          filter: "blur(40px)",
        }}
      />

      <div className="relative z-10">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-2xl"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.58 0.15 195 / 0.18), oklch(0.68 0.12 175 / 0.15))",
                color: "oklch(0.88 0.04 190)",
              }}
            >
              <RadioTower size={18} />
            </div>
            <div>
              <div
                className="text-[11px] font-semibold uppercase tracking-[0.3em]"
                style={{ color: "oklch(0.7 0.04 195)" }}
              >
                Live Site Stats
              </div>
              <h3 className="mt-1 text-base font-bold text-white sm:text-lg">
                访问统计
              </h3>
            </div>
          </div>

          <div
            className="hidden rounded-full px-3 py-1 text-[11px] font-medium sm:block"
            style={{
              background: "oklch(1 0 0 / 0.08)",
              color: "oklch(0.82 0.02 195)",
            }}
          >
            教学站点实时热度
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {statItems.map((item) => {
            const Icon = item.icon;
            const value = stats?.[item.key];

            return (
              <div
                key={item.key}
                className="rounded-2xl border px-4 py-4"
                style={{
                  background: "oklch(1 0 0 / 0.06)",
                  borderColor: "oklch(1 0 0 / 0.12)",
                }}
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  <span
                    className="text-xs font-medium tracking-[0.14em] uppercase"
                    style={{ color: "oklch(0.82 0.02 200)" }}
                  >
                    {item.label}
                  </span>
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-xl"
                    style={{
                      background: "oklch(1 0 0 / 0.08)",
                      color: "oklch(0.84 0.08 195)",
                    }}
                  >
                    <Icon size={15} />
                  </div>
                </div>

                {isLoading ? (
                  <div className="h-8 w-20 animate-pulse rounded-xl bg-white/10" />
                ) : (
                  <div className="text-2xl font-black tracking-tight text-white sm:text-3xl">
                    {formatNumber(value)}
                  </div>
                )}

                <p
                  className="mt-2 text-xs leading-5"
                  style={{ color: "oklch(0.72 0.02 200)" }}
                >
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex flex-col gap-2 text-xs sm:flex-row sm:items-center sm:justify-between">
          <div className="inline-flex items-center gap-2">
            <span
              className={cn(
                "h-2.5 w-2.5 rounded-full",
                status === "error" ? "bg-rose-300" : "bg-emerald-300",
              )}
            />
            <span style={{ color: "oklch(0.78 0.02 200)" }}>
              {status === "error"
                ? "统计服务暂时不可用"
                : formatLastUpdated(stats?.lastUpdatedAt)}
            </span>
          </div>

          <span style={{ color: "oklch(0.62 0.02 200)" }}>
            采用匿名 Cookie 去重，不记录个人身份信息
          </span>
        </div>
      </div>
    </div>
  );
}
