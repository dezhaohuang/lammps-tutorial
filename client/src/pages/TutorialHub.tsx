import { useEffect, useLayoutEffect } from "react";
import { Link, useLocation } from "wouter";
import { Atom, ChevronRight, Gauge, GraduationCap } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import { sections } from "@/components/Sidebar";

// 旧版深链接（/tutorial#windows-install 等）到达 hub 时重定向进 LAMMPS 教程
const SECTION_IDS = new Set(sections.map((s) => s.id));

const cardShell: React.CSSProperties = {
  background: "oklch(1 0 0 / 0.08)",
  border: "1px solid oklch(1 0 0 / 0.14)",
  backdropFilter: "blur(16px) saturate(1.4)",
  boxShadow: "0 4px 24px oklch(0 0 0 / 0.1), inset 0 1px 0 oklch(1 0 0 / 0.1)",
};

function TutorialCardBody({
  icon,
  title,
  subtitle,
  tags,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  tags: string[];
}) {
  return (
    <>
      <div
        className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.5 0.14 195 / 0.25), oklch(0.72 0.1 175 / 0.18))",
          color: "oklch(0.84 0.08 195)",
        }}
      >
        {icon}
      </div>
      <h2 className="mb-2 text-xl font-bold text-white">{title}</h2>
      <p className="mb-5 text-sm leading-relaxed" style={{ color: "oklch(0.72 0.02 200)" }}>
        {subtitle}
      </p>
      <div className="mb-6 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full px-3 py-1 text-xs"
            style={{
              background: "oklch(1 0 0 / 0.08)",
              color: "oklch(0.78 0.02 200)",
              border: "1px solid oklch(1 0 0 / 0.10)",
            }}
          >
            {tag}
          </span>
        ))}
      </div>
      <div
        className="inline-flex items-center gap-1.5 text-sm font-semibold transition-transform duration-300 group-hover:translate-x-1"
        style={{ color: "oklch(0.80 0.12 195)" }}
      >
        进入教程
        <ChevronRight size={16} />
      </div>
    </>
  );
}

export default function TutorialHub() {
  const [, navigate] = useLocation();

  useLayoutEffect(() => {
    const id = window.location.hash.slice(1);
    if (id && SECTION_IDS.has(id)) {
      navigate(`/lammps${window.location.hash}`, { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    document.title = "教程中心 | 武汉大学 ATMES Lab";
  }, []);

  const cardClass =
    "group block h-full rounded-3xl p-7 sm:p-8 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl";

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{ background: "linear-gradient(180deg, oklch(0.12 0.05 260), oklch(0.16 0.04 235))" }}
    >
      {/* 环境光斑 */}
      <div
        className="pointer-events-none absolute -left-24 -top-32 h-96 w-96 rounded-full"
        style={{ background: "oklch(0.5 0.14 195 / 0.16)", filter: "blur(90px)" }}
      />
      <div
        className="pointer-events-none absolute -bottom-40 -right-24 h-[28rem] w-[28rem] rounded-full"
        style={{ background: "oklch(0.45 0.12 260 / 0.20)", filter: "blur(100px)" }}
      />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-4xl flex-col px-5 py-14 sm:px-6 sm:py-20">
        <header className="text-center">
          <ScrollReveal>
            <a
              href="https://www.whu-atmes.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="group mb-6 inline-flex max-w-full items-center gap-2 rounded-full px-4 py-2.5 transition-all duration-300 hover:scale-[1.03] hover:shadow-lg sm:gap-3 sm:px-6 sm:py-3"
              style={{
                background: "oklch(1 0 0 / 0.08)",
                backdropFilter: "blur(16px) saturate(1.4)",
                border: "1px solid oklch(1 0 0 / 0.12)",
                boxShadow: "0 4px 24px oklch(0 0 0 / 0.1), inset 0 1px 0 oklch(1 0 0 / 0.1)",
              }}
            >
              <div
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full sm:h-7 sm:w-7"
                style={{ background: "oklch(0.55 0.15 195 / 0.2)" }}
              >
                <GraduationCap size={14} style={{ color: "oklch(0.80 0.12 195)" }} />
              </div>
              <span
                className="truncate text-xs font-semibold tracking-wide group-hover:underline sm:text-sm"
                style={{ color: "oklch(0.92 0.02 200)" }}
              >
                武汉大学 · 先进热管理及储能技术实验室
              </span>
            </a>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <h1
              className="mb-3 text-3xl font-black leading-tight sm:text-4xl md:text-5xl"
              style={{
                color: "white",
                letterSpacing: "0.02em",
                textShadow: "0 2px 30px oklch(0.35 0.10 260 / 0.5)",
              }}
            >
              课题组教程中心
            </h1>
            <p className="shimmer-text mb-6 text-sm font-medium tracking-wide sm:text-base md:text-lg">
              研究上手 · 从零开始的入门指南
            </p>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <p
              className="mx-auto max-w-2xl text-sm leading-relaxed sm:text-base"
              style={{ color: "oklch(0.78 0.02 200)" }}
            >
              为课题组同学准备的系列上手教程，选择一个主题开始学习。
            </p>
          </ScrollReveal>
        </header>

        <main className="mt-12 grid gap-6 md:grid-cols-2">
          <ScrollReveal delay={100} className="h-full">
            <Link href="/lammps" className={cardClass} style={cardShell}>
              <TutorialCardBody
                icon={<Atom size={22} />}
                title="LAMMPS 入门教学"
                subtitle="零基础分子动力学模拟上手指南：从安装配置、输入文件到超算提交，五个热输运案例逐行讲解。"
                tags={["分子动力学", "Windows / macOS / 超算", "15 章节 · 5 案例"]}
              />
            </Link>
          </ScrollReveal>

          <ScrollReveal delay={200} className="h-full">
            <a
              href={`${import.meta.env.BASE_URL}heat-balance.html`}
              className={cardClass}
              style={cardShell}
            >
              <TutorialCardBody
                icon={<Gauge size={22} />}
                title="汽轮机热平衡图互动教程"
                subtitle="以宁德核电 100% TMCR 工况为例，跟着蒸汽走一圈，逐设备读懂热平衡图上的每一个数字。"
                tags={["核电汽轮机", "热平衡图", "互动图解"]}
              />
            </a>
          </ScrollReveal>
        </main>

        <footer
          className="mt-auto pt-16 text-center text-xs"
          style={{ color: "oklch(1 0 0 / 0.40)" }}
        >
          © 2026 武汉大学 · 先进热管理及储能技术实验室（ATMES Lab）
        </footer>
      </div>
    </div>
  );
}
