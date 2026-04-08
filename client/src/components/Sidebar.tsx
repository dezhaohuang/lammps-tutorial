import { ChevronRight, FlaskConical, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const sections = [
  { id: "hero", label: "首页导览" },
  { id: "why-lammps", label: "为什么学习" },
  { id: "windows-install", label: "Windows 安装" },
  { id: "macos-install", label: "macOS 安装" },
  { id: "hpc-guide", label: "超算教程" },
  { id: "input-file", label: "输入文件" },
  { id: "parallel-run", label: "运行与并行" },
  { id: "case-lj-thermal", label: "案例一：LJ热导率" },
  { id: "case-spce-water", label: "案例二：SPC/E水" },
  { id: "case-nano-channel", label: "案例三：纳米通道" },
  { id: "case-interface-resistance", label: "案例四：界面热阻" },
  { id: "case-sam-gold", label: "案例五：SAM-Au" },
  { id: "troubleshooting", label: "常见报错" },
  { id: "roadmap", label: "学习路线图" },
  { id: "faq", label: "FAQ" },
];

function NavItems({
  activeId,
  clickedId,
  onItemClick,
}: {
  activeId: string;
  clickedId: string | null;
  onItemClick: (id: string) => void;
}) {
  return (
    <ul className="space-y-1.5">
      {sections.map((section) => {
        const isActive = activeId === section.id;
        return (
          <li key={section.id}>
            <button
              type="button"
              onClick={() => onItemClick(section.id)}
              className="group flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm"
              style={{
                transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                background: isActive
                  ? "linear-gradient(135deg, oklch(0.52 0.15 195 / 0.22), oklch(0.38 0.1 240 / 0.18))"
                  : clickedId === section.id
                    ? "oklch(0.52 0.15 195 / 0.12)"
                    : "transparent",
                color: isActive ? "white" : "oklch(0.78 0.02 200)",
                border: isActive
                  ? "1px solid oklch(0.78 0.08 195 / 0.16)"
                  : "1px solid transparent",
                transform: clickedId === section.id ? "scale(0.97)" : "scale(1)",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "oklch(1 0 0 / 0.06)";
                  e.currentTarget.style.color = "oklch(0.92 0.04 195)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "oklch(0.78 0.02 200)";
                }
              }}
            >
              <span
                style={{
                  transition: "transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                  transform: isActive ? "translateX(2px)" : "translateX(0)",
                  display: "inline-block",
                }}
              >
                {section.label}
              </span>
              <ChevronRight
                size={14}
                style={{
                  transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                  opacity: isActive ? 0.9 : 0.35,
                  transform: isActive ? "translateX(3px)" : "translateX(0)",
                }}
                className="group-hover:opacity-70"
              />
            </button>
          </li>
        );
      })}
    </ul>
  );
}

export default function Sidebar() {
  const [activeId, setActiveId] = useState("hero");
  const [clickedId, setClickedId] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const clickTimeout = useRef<ReturnType<typeof setTimeout>>();

  const handleClick = (id: string) => {
    setClickedId(id);
    clearTimeout(clickTimeout.current);
    clickTimeout.current = setTimeout(() => setClickedId(null), 400);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  useEffect(() => {
    const targets = sections
      .map((section) => document.getElementById(section.id))
      .filter((node): node is HTMLElement => Boolean(node));

    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visibleEntries[0]) setActiveId(visibleEntries[0].target.id);
      },
      { rootMargin: "-15% 0px -60% 0px", threshold: [0.15, 0.35, 0.6] },
    );

    for (const target of targets) observer.observe(target);
    return () => observer.disconnect();
  }, []);

  const sidebarBg = "linear-gradient(180deg, oklch(0.12 0.05 260), oklch(0.16 0.04 235))";
  const activeLabel = sections.find((s) => s.id === activeId)?.label ?? "";

  return (
    <>
      {/* ── Mobile: floating bar ── */}
      <div
        className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3 lg:hidden"
        style={{
          background: "oklch(0.13 0.05 260 / 0.92)",
          backdropFilter: "blur(16px) saturate(1.4)",
          borderBottom: "1px solid oklch(1 0 0 / 0.08)",
        }}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl"
            style={{
              background: "linear-gradient(135deg, oklch(0.5 0.14 195 / 0.22), oklch(0.72 0.1 175 / 0.18))",
              color: "oklch(0.84 0.08 195)",
            }}
          >
            <FlaskConical size={15} />
          </div>
          <span className="text-xs font-medium truncate" style={{ color: "oklch(0.70 0.02 200)" }}>
            {activeLabel}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex h-9 w-9 items-center justify-center rounded-xl"
          style={{ color: "oklch(0.85 0.04 195)", background: "oklch(1 0 0 / 0.06)" }}
          aria-label="切换目录"
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* ── Mobile: backdrop ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{ background: "oklch(0 0 0 / 0.5)" }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Mobile: drawer ── */}
      <div
        className="fixed inset-y-0 left-0 z-50 w-72 flex flex-col border-r border-white/10 lg:hidden"
        style={{
          background: sidebarBg,
          transform: mobileOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <div className="flex items-center justify-between border-b border-white/8 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl"
              style={{
                background: "linear-gradient(135deg, oklch(0.5 0.14 195 / 0.22), oklch(0.72 0.1 175 / 0.18))",
                color: "oklch(0.84 0.08 195)",
              }}
            >
              <FlaskConical size={17} />
            </div>
            <div className="text-sm font-semibold text-white">LAMMPS Tutorial</div>
          </div>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-lg"
            style={{ color: "oklch(0.7 0.02 200)", background: "oklch(1 0 0 / 0.06)" }}
          >
            <X size={16} />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <NavItems activeId={activeId} clickedId={clickedId} onItemClick={handleClick} />
        </nav>
      </div>

      {/* ── Desktop: fixed sidebar ── */}
      <aside
        className="fixed inset-y-0 left-0 z-30 hidden w-72 flex-col border-r border-white/10 lg:flex"
        style={{ background: sidebarBg }}
      >
        <div className="border-b border-white/8 px-6 py-7">
          <div className="flex items-center gap-3">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-2xl"
              style={{
                background: "linear-gradient(135deg, oklch(0.5 0.14 195 / 0.22), oklch(0.72 0.1 175 / 0.18))",
                color: "oklch(0.84 0.08 195)",
              }}
            >
              <FlaskConical size={20} />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">LAMMPS Tutorial</div>
              <div className="text-xs text-white/55">Academic Notebook</div>
            </div>
          </div>
          <p className="mt-5 text-sm leading-7 text-white/68">
            从安装、输入文件到超算提交，按章节逐步完成分子动力学入门。
          </p>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-5">
          <NavItems activeId={activeId} clickedId={clickedId} onItemClick={handleClick} />
        </nav>

        <a
          href="https://www.whu-atmes.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="block border-t border-white/8 px-6 py-5 text-xs transition-colors duration-200"
          style={{ color: "oklch(1 0 0 / 0.48)" }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "oklch(0.80 0.10 195)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "oklch(1 0 0 / 0.48)"; }}
        >
          Wuhan University · ATMES Lab
        </a>
      </aside>
    </>
  );
}
