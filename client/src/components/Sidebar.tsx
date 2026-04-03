import { useState, useEffect } from "react";
import { Menu, X, Atom, GraduationCap, BookOpen, Monitor, Terminal, FlaskConical, HelpCircle } from "lucide-react";

interface SectionItem {
  id: string;
  label: string;
}

interface SectionGroup {
  group: string;
  icon: typeof BookOpen;
  items: SectionItem[];
}

const sectionGroups: SectionGroup[] = [
  {
    group: "入门",
    icon: BookOpen,
    items: [
      { id: "hero", label: "首页" },
      { id: "why-lammps", label: "为什么学 LAMMPS" },
    ],
  },
  {
    group: "环境搭建",
    icon: Monitor,
    items: [
      { id: "windows-install", label: "Windows 安装" },
      { id: "macos-install", label: "macOS 安装" },
      { id: "hpc-guide", label: "超算 / 集群" },
    ],
  },
  {
    group: "基础教程",
    icon: Terminal,
    items: [
      { id: "input-file", label: "第一份输入文件" },
      { id: "parallel-run", label: "本地与并行运行" },
    ],
  },
  {
    group: "案例实战",
    icon: FlaskConical,
    items: [
      { id: "case-lj-thermal", label: "LJ 液体热导率" },
      { id: "case-nano-channel", label: "纳米通道水流动" },
      { id: "case-interface-resistance", label: "固-液界面热阻" },
      { id: "case-sam-gold", label: "SAM-Au-水界面平衡" },
    ],
  },
  {
    group: "参考",
    icon: HelpCircle,
    items: [
      { id: "troubleshooting", label: "常见问题排查" },
      { id: "roadmap", label: "学习路线图" },
      { id: "faq", label: "FAQ" },
    ],
  },
];

const allSections = sectionGroups.flatMap((g) => g.items);

export default function Sidebar() {
  const [active, setActive] = useState("hero");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          const top = visible.reduce((a, b) =>
            Math.abs(a.boundingClientRect.top) < Math.abs(b.boundingClientRect.top) ? a : b
          );
          setActive(top.target.id);
        }
      },
      { rootMargin: "-10% 0px -60% 0px", threshold: 0.1 }
    );

    allSections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        setScrollProgress(Math.min((scrollTop / docHeight) * 100, 100));
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 rounded-xl shadow-lg border border-border backdrop-blur-md"
        style={{ background: "oklch(1 0 0 / 0.85)" }}
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-30 bg-black/20 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-64 border-r border-border transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ background: "oklch(0.99 0.002 90 / 0.95)", backdropFilter: "blur(12px)" }}
      >
        {/* Header */}
        <div className="p-5 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center relative"
              style={{ background: "linear-gradient(135deg, oklch(0.35 0.10 260), oklch(0.50 0.14 195))" }}>
              <Atom size={18} color="white" />
            </div>
            <div>
              <h1 className="text-sm font-bold" style={{ color: "oklch(0.22 0.06 260)" }}>LAMMPS 教学</h1>
              <p className="text-xs" style={{ color: "oklch(0.55 0.02 260)" }}>入门指南</p>
            </div>
          </div>
          <a
            href="https://www.whu-atmes.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 mt-3 pt-3 border-t border-border group"
          >
            <GraduationCap size={14} style={{ color: "oklch(0.50 0.08 195)" }} />
            <span className="text-xs group-hover:underline" style={{ color: "oklch(0.45 0.04 260)" }}>
              WHU ATMES Lab
            </span>
          </a>
        </div>

        {/* Scroll progress bar in sidebar */}
        <div className="h-[2px] mx-4" style={{ background: "oklch(0.92 0.005 200)" }}>
          <div
            className="h-full rounded-full transition-[width] duration-150 ease-out"
            style={{
              width: `${scrollProgress}%`,
              background: "linear-gradient(90deg, oklch(0.55 0.15 195), oklch(0.45 0.12 260))",
            }}
          />
        </div>

        <nav className="p-3 overflow-y-auto" style={{ maxHeight: "calc(100vh - 140px)" }}>
          {sectionGroups.map((group) => {
            const GroupIcon = group.icon;
            return (
              <div key={group.group} className="mb-3">
                <div
                  className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-widest flex items-center gap-2"
                  style={{ color: "oklch(0.50 0.04 195)" }}
                >
                  <GroupIcon size={12} strokeWidth={2.5} />
                  {group.group}
                </div>
                <div className="space-y-0.5">
                  {group.items.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => scrollTo(s.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-[13px] transition-all duration-200 relative ${
                        active === s.id ? "font-semibold" : "hover:bg-accent/50"
                      }`}
                      style={
                        active === s.id
                          ? {
                              background: "oklch(0.94 0.04 195)",
                              color: "oklch(0.28 0.10 200)",
                              boxShadow: "inset 3px 0 0 oklch(0.55 0.15 195)",
                            }
                          : { color: "oklch(0.45 0.02 260)" }
                      }
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
