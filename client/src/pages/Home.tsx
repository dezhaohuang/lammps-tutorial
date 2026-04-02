/**
 * LAMMPS 入门教学网站 — 主页面
 * 设计风格：「科研笔记本」Editorial / Academic Modernism
 * - 深靛蓝 + 科技青主色，暖白背景
 * - Noto Serif SC 标题 + Noto Sans SC 正文 + JetBrains Mono 代码
 * - 终端窗口代码块、步骤指示器、分子轨迹装饰线
 * - 交替章节背景、阅读进度条、回到顶部按钮
 */

import { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  ArrowDown,
  Download,
  Play,
  FileText,
  Cpu,
  Server,
  Terminal,
  Apple,
  ChevronRight,
  Search,
  Beaker,
  Zap,
  BookOpen,
  Layers,
  GitBranch,
  ExternalLink,
  Mail,
  Github,
  GraduationCap,
  Globe,
  Flame,
  Droplets,
  ThermometerSun,
  Eye,
  Box,
  Settings,
  BarChart3,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import CodeBlock from "@/components/CodeBlock";
import SectionHeading from "@/components/SectionHeading";
import InfoCard from "@/components/InfoCard";
import StepIndicator from "@/components/StepIndicator";
import WarningBox from "@/components/WarningBox";
import AnnotatedCode from "@/components/AnnotatedCode";
import ScrollReveal from "@/components/ScrollReveal";
import ReadingProgress from "@/components/ReadingProgress";
import BackToTop from "@/components/BackToTop";
import { MoleculeDecoration } from "@/components/MoleculeDecoration";

const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663272597490/GumAK5suDshv7oMR4rddNh/hero-bg-34aTB5CWHf69rctXpAKvad.webp";
const WHY_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663272597490/GumAK5suDshv7oMR4rddNh/why-lammps-NWB5L39WPiUbBt8qeUizCM.webp";
const HPC_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663272597490/GumAK5suDshv7oMR4rddNh/hpc-cluster-fzL6uT37FPhvPrfz6t9S2R.webp";
const INPUT_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663272597490/GumAK5suDshv7oMR4rddNh/input-file-Crr9jDeiULLuhkTZx3FgAL.webp";
const ROADMAP_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663272597490/GumAK5suDshv7oMR4rddNh/roadmap-B3gQsoseoUQijMDtVDAhMg.webp";

/* ─── Inline code badge helper ─── */
const IC = ({ children }: { children: React.ReactNode }) => (
  <code className="px-1.5 py-0.5 rounded text-xs font-mono" style={{ background: "oklch(0.94 0.02 200)", color: "oklch(0.35 0.10 260)" }}>
    {children}
  </code>
);

/* ─── LAMMPS 最小输入文件 逐行注释 ─── */
const inputFileLines = [
  { code: "# 最小 LAMMPS 示例：Lennard-Jones 液体", comment: "注释行，以 # 开头" },
  { code: "", comment: "" },
  { code: "units           lj", comment: "使用 Lennard-Jones 无量纲单位制" },
  { code: "atom_style      atomic", comment: "原子模型，无键、无电荷" },
  { code: "dimension       3", comment: "三维模拟" },
  { code: "boundary        p p p", comment: "三个方向均为周期性边界" },
  { code: "", comment: "" },
  { code: "lattice         fcc 0.8442", comment: "FCC 晶格，密度 0.8442" },
  { code: "region          box block 0 5 0 5 0 5", comment: "定义一个 5×5×5 的模拟盒子" },
  { code: "create_box      1 box", comment: "创建包含 1 种原子类型的盒子" },
  { code: "create_atoms    1 box", comment: "在盒子中填充原子" },
  { code: "mass            1 1.0", comment: "原子类型 1 的质量为 1.0" },
  { code: "", comment: "" },
  { code: "pair_style      lj/cut 2.5", comment: "LJ 势函数，截断半径 2.5" },
  { code: "pair_coeff      1 1 1.0 1.0 2.5", comment: "ε=1.0, σ=1.0, 截断=2.5" },
  { code: "", comment: "" },
  { code: "velocity        all create 1.0 87287", comment: "初始化速度，温度 1.0" },
  { code: "", comment: "" },
  { code: "fix             1 all nve", comment: "NVE 系综（微正则系综）" },
  { code: "fix             2 all langevin 1.0 1.0 0.1 48279", comment: "Langevin 恒温器" },
  { code: "", comment: "" },
  { code: "thermo          100", comment: "每 100 步输出热力学信息" },
  { code: "thermo_style    custom step temp pe ke etotal press", comment: "自定义输出列" },
  { code: "", comment: "" },
  { code: "run             1000", comment: "运行 1000 个时间步" },
];

/* ─── FAQ 数据 ─── */
const faqData = [
  {
    q: "Windows 新手推荐哪条路线？",
    a: "如果你只是想快速跑通一个示例，推荐使用预编译安装包路线，下载即用。如果你后续需要安装额外的 LAMMPS 包（如 MANYBODY、KSPACE），或者需要 MPI 并行，建议直接上 WSL2 路线，一步到位。",
  },
  {
    q: "macOS 用户最省事的方案是什么？",
    a: "使用 Homebrew 安装是最省事的方案：brew install lammps 一条命令搞定。Homebrew 版本已经包含了常用的 LAMMPS 包，对于入门学习完全够用。",
  },
  {
    q: "Slurm 和 MPI 是什么关系？",
    a: "Slurm 是任务调度系统，负责在集群上分配计算资源（节点、核心）。MPI 是并行通信库，负责让多个进程之间传递数据。简单来说：Slurm 决定「在哪里跑」，MPI 决定「怎么并行跑」。在超算上，你用 sbatch 提交任务给 Slurm，Slurm 分配好资源后，用 srun 或 mpirun 启动 MPI 并行的 LAMMPS。",
  },
  {
    q: "什么时候需要源码编译 LAMMPS？",
    a: "以下情况需要源码编译：(1) 你需要的 LAMMPS 包没有被预编译版本包含；(2) 你需要 GPU 加速（KOKKOS、GPU 包）；(3) 你需要自定义修改 LAMMPS 源码；(4) 超算上没有预装 LAMMPS 模块。对于入门学习，通常不需要源码编译。",
  },
  {
    q: "LAMMPS 支持 GPU 加速吗？",
    a: "支持。LAMMPS 有 GPU 包和 KOKKOS 包可以利用 GPU 加速。但 GPU 加速需要源码编译，并且需要安装 CUDA 或 OpenCL。建议先在 CPU 上跑通流程，再考虑 GPU 加速。",
  },
  {
    q: "我的模拟跑得很慢，怎么办？",
    a: "首先检查是否使用了 MPI 并行（单核跑大体系肯定慢）。其次检查 pair_style 的截断半径是否合理（太大会显著增加计算量）。还可以检查 neighbor list 的更新频率。如果体系很大（>100万原子），考虑使用 GPU 加速或更多核心。",
  },
  {
    q: "LAMMPS 的输入文件格式有什么要求？",
    a: "LAMMPS 输入文件是纯文本文件，没有固定的文件扩展名（常用 .in、.lammps、.lmp）。每行一条命令，# 开头的是注释。命令不区分大小写，但文件名和变量名区分。建议使用 UTF-8 编码，避免中文路径。",
  },
  {
    q: "如何可视化 LAMMPS 的模拟结果？",
    a: "常用的可视化工具有：OVITO（推荐，免费版功能够用）、VMD（经典工具，适合生物体系）、VESTA（适合晶体结构）。LAMMPS 通过 dump 命令输出轨迹文件，这些工具都可以直接读取。",
  },
];

/* ─── 搜索过滤的 FAQ ─── */
function FAQSection() {
  const [search, setSearch] = useState("");
  const filtered = faqData.filter(
    (f) =>
      f.q.toLowerCase().includes(search.toLowerCase()) ||
      f.a.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="relative mb-6">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "oklch(0.55 0.02 260)" }} />
        <input
          type="text"
          placeholder="搜索常见问题..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring/30 transition-shadow"
          style={{ background: "oklch(1 0 0)" }}
        />
      </div>
      <Accordion type="multiple" className="space-y-2">
        {filtered.map((f, i) => (
          <AccordionItem key={i} value={`faq-${i}`} className="border border-border rounded-xl overflow-hidden px-0">
            <AccordionTrigger className="px-5 py-4 text-sm font-semibold text-left hover:no-underline"
              style={{ color: "oklch(0.25 0.06 260)" }}>
              {f.q}
            </AccordionTrigger>
            <AccordionContent className="px-5 pb-4 text-sm leading-relaxed"
              style={{ color: "oklch(0.40 0.02 260)" }}>
              {f.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      {filtered.length === 0 && (
        <p className="text-center py-8 text-sm" style={{ color: "oklch(0.55 0.02 260)" }}>
          没有找到匹配的问题，试试其他关键词？
        </p>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   主页面
   ═══════════════════════════════════════════════════════════════ */
export default function Home() {
  return (
    <div className="min-h-screen flex">
      <ReadingProgress />
      <Sidebar />
      <BackToTop />

      {/* Main content area — offset by sidebar on desktop */}
      <main className="flex-1 lg:ml-64">

        {/* ═══════════ 1. Hero 区 ═══════════ */}
        <section
          id="hero"
          className="relative min-h-[92vh] flex items-center justify-center overflow-hidden"
        >
          {/* Background image */}
          <div className="absolute inset-0">
            <img src={HERO_BG} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0" style={{
              background: "linear-gradient(135deg, oklch(0.12 0.06 260 / 0.85), oklch(0.18 0.08 200 / 0.75))"
            }} />
          </div>

          {/* Floating particles decoration */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[
              { x: "10%", y: "20%", size: 6, delay: 0 },
              { x: "80%", y: "15%", size: 4, delay: 1 },
              { x: "25%", y: "70%", size: 5, delay: 2 },
              { x: "70%", y: "60%", size: 3, delay: 0.5 },
              { x: "90%", y: "80%", size: 4, delay: 1.5 },
              { x: "5%", y: "50%", size: 3, delay: 2.5 },
              { x: "50%", y: "10%", size: 5, delay: 0.8 },
              { x: "35%", y: "85%", size: 4, delay: 1.8 },
            ].map((p, i) => (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  left: p.x,
                  top: p.y,
                  width: p.size,
                  height: p.size,
                  background: `oklch(0.75 0.12 195 / ${0.15 + Math.random() * 0.15})`,
                  animation: `float ${3 + i * 0.5}s ease-in-out ${p.delay}s infinite alternate`,
                }}
              />
            ))}
          </div>

          <div className="relative z-10 container max-w-4xl text-center px-6">
            <ScrollReveal>
              <a
                href="https://www.whu-atmes.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full mb-6 group transition-all duration-300 hover:scale-105"
                style={{ background: "oklch(1 0 0 / 0.10)", backdropFilter: "blur(12px)", border: "1px solid oklch(1 0 0 / 0.15)" }}
              >
                <GraduationCap size={18} style={{ color: "oklch(0.75 0.12 195)" }} />
                <span className="text-sm font-semibold tracking-wide group-hover:underline" style={{ color: "oklch(0.92 0.02 200)" }}>
                  武汉大学 · 先进热管理及储能技术实验室
                </span>
              </a>
            </ScrollReveal>

            <ScrollReveal delay={100}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-3" style={{ color: "white", letterSpacing: "0.02em" }}>
                LAMMPS 入门教学
              </h1>
              <p className="text-base md:text-lg mb-8 tracking-wide" style={{ color: "oklch(0.70 0.06 195)" }}>
                零基础分子动力学模拟上手指南
              </p>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <p className="text-base md:text-lg leading-relaxed mb-10 max-w-2xl mx-auto" style={{ color: "oklch(0.78 0.02 200)" }}>
                从安装配置到超算提交，覆盖 Windows、macOS 和 Linux 三大平台，帮助各位同学跨过分子动力学模拟的第一道坎。
              </p>
            </ScrollReveal>

            <ScrollReveal delay={300}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="text-base px-8 py-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
                  style={{ background: "linear-gradient(135deg, oklch(0.55 0.15 195), oklch(0.45 0.12 220))", color: "white" }}
                  onClick={() => document.getElementById("why-lammps")?.scrollIntoView({ behavior: "smooth" })}
                >
                  开始学习
                  <ChevronRight size={18} className="ml-1" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="text-base px-8 py-6 rounded-xl font-semibold transition-all duration-300 hover:-translate-y-0.5"
                  style={{ borderColor: "oklch(1 0 0 / 0.25)", color: "oklch(0.90 0.02 200)", background: "oklch(1 0 0 / 0.08)" }}
                  onClick={() => document.getElementById("windows-install")?.scrollIntoView({ behavior: "smooth" })}
                >
                  直接看安装教程
                </Button>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={400}>
              <p className="mt-8 text-xs tracking-wider" style={{ color: "oklch(0.50 0.02 200)" }}>
                黄德钊 · ATMES Lab · 武汉大学动力与机械学院
              </p>
            </ScrollReveal>

            <ScrollReveal delay={500}>
              <div className="mt-10 animate-bounce">
                <ArrowDown size={24} style={{ color: "oklch(0.70 0.08 195)" }} className="mx-auto" />
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ═══════════ 2. 为什么学习 LAMMPS ═══════════ */}
        <section id="why-lammps" className="py-20 md:py-28 relative overflow-hidden">
          <MoleculeDecoration className="absolute top-0 right-0 opacity-60 hidden lg:block" variant="right" />
          <div className="container max-w-5xl relative z-10">
            <ScrollReveal>
              <SectionHeading
                id="why-lammps-title"
                title="为什么学习 LAMMPS？"
                subtitle="传热、流动、相变、储能——你关心的能源与动力问题，很多都能用分子动力学从微观尺度找到答案。"
                badge="背景知识"
              />
            </ScrollReveal>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <ScrollReveal>
                <div className="rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                  <img src={WHY_IMG} alt="LAMMPS 应用场景" className="w-full h-auto" />
                </div>
              </ScrollReveal>

              <ScrollReveal delay={100}>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold mb-3" style={{ color: "oklch(0.25 0.06 260)" }}>
                      能源与动力领域的典型应用
                    </h3>
                    <ul className="space-y-2.5">
                      {[
                        "纳米尺度热输运：声子色散、界面热阻、热导率预测",
                        "相变储能材料：石蜡/水合盐等 PCM 的熔化-凝固微观机制",
                        "纳米流体与强化换热：纳米颗粒-基液界面热阻与布朗运动",
                        "纳米通道流动：水/离子在碳纳米管及石墨烯通道中的输运",
                        "热电与热管理材料：Bi₂Te₃、SiGe 等材料的声子工程",
                        "表面润湿与沸腾：液滴在纳米结构表面的铺展和气泡成核",
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm leading-relaxed" style={{ color: "oklch(0.38 0.02 260)" }}>
                          <div className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ background: "oklch(0.55 0.15 195)" }} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            <div className="grid sm:grid-cols-3 gap-5">
              {[
                {
                  icon: Layers,
                  title: "连接宏观与微观",
                  desc: "傅里叶定律、牛顿剪切在纳米尺度会失效。分子动力学让你直接看到声子如何散射、液体分子如何在壁面滑移，建立真正的微观物理图像。",
                },
                {
                  icon: GitBranch,
                  title: "开源、成熟、能动友好",
                  desc: "LAMMPS 完全开源，内置 NEMD、Green-Kubo、Müller-Plathe 等热输运分析方法，是计算传热和纳米流体研究中引用最多的 MD 工具。",
                },
                {
                  icon: Zap,
                  title: "本站帮你跨过第一道坎",
                  desc: "从安装、编译、MPI 并行到超算提交，每一步都可能踩坑。本站把这些坑一个个填好，让你把时间留给真正的科学问题。",
                },
              ].map((card, i) => (
                <ScrollReveal key={i} delay={i * 80}>
                  <div className="bg-card rounded-xl border border-border p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 h-full">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                      style={{ background: "oklch(0.94 0.04 195)" }}>
                      <card.icon size={20} style={{ color: "oklch(0.45 0.12 195)" }} />
                    </div>
                    <h4 className="font-bold text-base mb-2" style={{ color: "oklch(0.25 0.06 260)" }}>{card.title}</h4>
                    <p className="text-sm leading-relaxed" style={{ color: "oklch(0.45 0.02 260)" }}>{card.desc}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* ═══════════ 3. Windows 安装教程 ═══════════ */}
        <section id="windows-install" className="py-20 md:py-28 relative" style={{ background: "oklch(0.975 0.003 200 / 0.5)" }}>
          <MoleculeDecoration className="absolute bottom-0 left-0 opacity-40 hidden lg:block" variant="left" />
          <div className="container max-w-5xl relative z-10">
            <ScrollReveal>
              <SectionHeading
                id="windows-install-title"
                title="Windows 安装教程"
                subtitle="Windows 用户有两条路线：预编译安装包（别人已经帮你把源代码编译好的现成程序，下载即用）和 WSL2（在 Windows 里跑一个 Linux 子系统，功能最全）。"
                badge="Windows"
              />
            </ScrollReveal>

            <ScrollReveal>
              <Tabs defaultValue="prebuilt" className="w-full">
                <TabsList className="w-full justify-start mb-6 bg-muted/50 p-1 rounded-xl">
                  <TabsTrigger value="prebuilt" className="rounded-lg data-[state=active]:shadow-sm px-5">
                    <Download size={15} className="mr-2" />
                    预编译安装包
                  </TabsTrigger>
                  <TabsTrigger value="wsl2" className="rounded-lg data-[state=active]:shadow-sm px-5">
                    <Terminal size={15} className="mr-2" />
                    WSL2 路线
                  </TabsTrigger>
                </TabsList>

                {/* ─── 预编译安装包 ─── */}
                <TabsContent value="prebuilt">
                  <InfoCard
                    title="预编译安装包路线"
                    audience="只想快速跑通示例、不需要额外 LAMMPS 包的新手。所谓「预编译安装包」，就是 LAMMPS 官方把源代码编译好后打包成 .exe 安装程序，你只需下载、双击安装，不用自己处理编译环境。"
                    pros={[
                      "下载即用，无需编译",
                      "安装过程不超过 5 分钟",
                      "自带常用势函数文件",
                    ]}
                    cons={[
                      "包含的 LAMMPS 包有限",
                      "不支持 MPI 并行（仅单核运行）",
                      "版本更新可能滞后",
                    ]}
                  >
                    <div className="mt-4 space-y-1">
                      <StepIndicator number={1} title="下载安装包">
                        <p className="mb-3">
                          点击下方按钮直接下载 Windows 64 位预编译安装包：
                        </p>
                        <a
                          href="https://github.com/dezhaohuang/lammps-tutorial/releases/download/v1.0.0/LAMMPS-64bit-latest.exe"
                          download
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 shadow-sm hover:shadow-md"
                          style={{ background: "linear-gradient(135deg, oklch(0.55 0.15 195), oklch(0.45 0.12 220))", color: "white" }}
                        >
                          <Download size={16} />
                          下载 LAMMPS-64bit-latest.exe
                        </a>
                        <p className="mt-3 text-xs" style={{ color: "oklch(0.55 0.02 260)" }}>
                          也可以从官方页面获取其他版本：<a href="https://packages.lammps.org/windows.html" target="_blank" rel="noopener noreferrer" className="underline hover:no-underline" style={{ color: "oklch(0.45 0.12 195)" }}>packages.lammps.org/windows.html</a>
                        </p>
                      </StepIndicator>

                      <StepIndicator number={2} title="安装并配置环境变量">
                        <p className="mb-2">
                          双击安装包，安装过程中勾选 <strong>{'"Add LAMMPS to PATH"'}</strong>，这样你可以在任意命令行窗口中直接使用 <IC>lmp</IC> 命令。
                        </p>
                      </StepIndicator>

                      <StepIndicator number={3} title="验证安装">
                        <p className="mb-2">打开 PowerShell 或 CMD，输入：</p>
                        <CodeBlock title="PowerShell" language="shell" code="lmp -h" />
                        <p className="mt-2">如果看到 LAMMPS 的版本信息和帮助文档，说明安装成功。</p>
                      </StepIndicator>

                      <StepIndicator number={4} title="运行第一个示例">
                        <p className="mb-2">创建一个文件 <IC>in.test</IC>，粘贴本站"第一份输入文件"章节的内容，然后运行：</p>
                        <CodeBlock title="运行示例" language="shell" code="lmp -in in.test" />
                      </StepIndicator>
                    </div>

                    <WarningBox type="warning" title="常见错误：'lmp' 不是内部或外部命令">
                      <p className="mb-3">
                        出现这个提示，说明系统不知道 <IC>lmp</IC> 这个程序在哪里。你需要手动把 LAMMPS 的安装路径告诉系统（即添加到 PATH 环境变量）。按以下步骤操作：
                      </p>
                      <ol className="space-y-3 mb-4 list-none pl-0">
                        <li className="flex items-start gap-2.5">
                          <span className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: "oklch(0.94 0.04 195)", color: "oklch(0.40 0.12 195)" }}>1</span>
                          <span>找到 LAMMPS 的安装目录。默认路径通常是 <IC>{"C:\\Program Files\\LAMMPS"}</IC>，在其中找到包含 <IC>lmp.exe</IC> 的文件夹（一般是 <IC>bin</IC> 子目录）。记下这个完整路径，例如 <IC>{"C:\\Program Files\\LAMMPS\\bin"}</IC>。</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <span className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: "oklch(0.94 0.04 195)", color: "oklch(0.40 0.12 195)" }}>2</span>
                          <span>按 <IC>Win + S</IC> 搜索<strong>「编辑系统环境变量」</strong>（或搜索「环境变量」），点击打开。</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <span className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: "oklch(0.94 0.04 195)", color: "oklch(0.40 0.12 195)" }}>3</span>
                          <span>在弹出的「系统属性」窗口中，点击右下角的<strong>「环境变量」</strong>按钮。</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <span className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: "oklch(0.94 0.04 195)", color: "oklch(0.40 0.12 195)" }}>4</span>
                          <span>在下方的<strong>「系统变量」</strong>列表中，找到名为 <IC>Path</IC> 的变量，选中它，点击<strong>「编辑」</strong>。</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <span className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: "oklch(0.94 0.04 195)", color: "oklch(0.40 0.12 195)" }}>5</span>
                          <span>点击<strong>「新建」</strong>，粘贴你在第 1 步记下的路径（如 <IC>{"C:\\Program Files\\LAMMPS\\bin"}</IC>），然后依次点击「确定」关闭所有窗口。</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <span className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: "oklch(0.94 0.04 195)", color: "oklch(0.40 0.12 195)" }}>6</span>
                          <span><strong>重新打开</strong>一个 PowerShell 或 CMD 窗口（已经打开的窗口不会生效），再次输入 <IC>lmp -h</IC> 验证。</span>
                        </li>
                      </ol>
                    </WarningBox>
                  </InfoCard>
                </TabsContent>

                {/* ─── WSL2 路线 ─── */}
                <TabsContent value="wsl2">
                  <InfoCard
                    title="WSL2（Windows Subsystem for Linux）路线"
                    audience="需要完整 Linux 环境、MPI 并行、或后续要迁移到超算的用户"
                    pros={[
                      "完整的 Linux 环境，与超算体验一致",
                      "支持 MPI 并行运行",
                      "可以通过 apt 或源码编译安装任意 LAMMPS 包",
                      "便于后续迁移到超算集群",
                    ]}
                    cons={[
                      "需要先安装 WSL2（约 10-20 分钟）",
                      "对 Windows 新手有一定学习门槛",
                      "文件系统跨平台访问速度较慢",
                    ]}
                  >
                    <div className="mt-4 space-y-1">
                      <StepIndicator number={1} title="安装 WSL2">
                        <p className="mb-2">以管理员身份打开 PowerShell，运行：</p>
                        <CodeBlock title="PowerShell (管理员)" language="shell" code="wsl --install" />
                        <p className="mt-2">安装完成后重启电脑。默认会安装 Ubuntu 发行版。</p>
                      </StepIndicator>

                      <StepIndicator number={2} title="在 WSL2 中安装 LAMMPS">
                        <p className="mb-2">打开 WSL2 终端（搜索"Ubuntu"），运行：</p>
                        <CodeBlock title="Ubuntu (WSL2)" language="bash" code={`sudo apt update
sudo apt install -y lammps`} />
                      </StepIndicator>

                      <StepIndicator number={3} title="安装 MPI（可选但推荐）">
                        <CodeBlock title="安装 OpenMPI" language="bash" code="sudo apt install -y openmpi-bin libopenmpi-dev" />
                      </StepIndicator>

                      <StepIndicator number={4} title="验证安装">
                        <CodeBlock title="验证" language="bash" code={`lmp -h
# 如果安装了 MPI 版本：
mpirun -np 4 lmp -in in.test`} />
                      </StepIndicator>
                    </div>

                    <WarningBox type="tip" title="建议">
                      WSL2 的文件建议存放在 Linux 文件系统中（如 <IC>~/projects/</IC>），而不是 <IC>/mnt/c/</IC> 下，这样读写速度会快很多。
                    </WarningBox>
                  </InfoCard>
                </TabsContent>
              </Tabs>
            </ScrollReveal>
          </div>
        </section>

        <div className="section-divider" />

        {/* ═══════════ 4. macOS 安装教程 ═══════════ */}
        <section id="macos-install" className="py-20 md:py-28 relative overflow-hidden">
          <MoleculeDecoration className="absolute top-10 right-0 opacity-40 hidden lg:block" variant="right" />
          <div className="container max-w-5xl relative z-10">
            <ScrollReveal>
              <SectionHeading
                id="macos-install-title"
                title="macOS 安装教程"
                subtitle="macOS 用户推荐使用 Homebrew 安装，一条命令搞定。如有特殊需求，也可以源码编译。"
                badge="macOS"
              />
            </ScrollReveal>

            <ScrollReveal>
              <Tabs defaultValue="homebrew" className="w-full">
                <TabsList className="w-full justify-start mb-6 bg-muted/50 p-1 rounded-xl">
                  <TabsTrigger value="homebrew" className="rounded-lg data-[state=active]:shadow-sm px-5">
                    <Apple size={15} className="mr-2" />
                    Homebrew 安装
                  </TabsTrigger>
                  <TabsTrigger value="source" className="rounded-lg data-[state=active]:shadow-sm px-5">
                    <Terminal size={15} className="mr-2" />
                    源码编译
                  </TabsTrigger>
                </TabsList>

                {/* ─── Homebrew ─── */}
                <TabsContent value="homebrew">
                  <InfoCard
                    title="Homebrew 安装路线"
                    audience="大多数 macOS 用户，想快速开始学习 LAMMPS"
                    pros={[
                      "一条命令安装，自动处理依赖",
                      "包含常用 LAMMPS 包",
                      "支持 MPI 并行",
                      "更新方便：brew upgrade lammps",
                    ]}
                    cons={[
                      "不能自定义编译选项",
                      "某些特殊 LAMMPS 包可能未包含",
                    ]}
                  >
                    <div className="mt-4 space-y-1">
                      <StepIndicator number={1} title="安装 Homebrew（如果还没有）">
                        <CodeBlock title="终端" language="bash" code='/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"' />
                      </StepIndicator>

                      <StepIndicator number={2} title="安装 LAMMPS">
                        <CodeBlock title="终端" language="bash" code="brew install lammps" />
                        <p className="mt-2">Homebrew 会自动安装 LAMMPS 及其依赖（包括 OpenMPI）。安装完成后，可执行文件为 <IC>lmp</IC> 或 <IC>lmp_serial</IC>。</p>
                      </StepIndicator>

                      <StepIndicator number={3} title="验证安装">
                        <CodeBlock title="终端" language="bash" code={`lmp -h
# 查看已安装的 LAMMPS 包
lmp -h | grep "Installed packages"`} />
                      </StepIndicator>

                      <StepIndicator number={4} title="运行测试">
                        <CodeBlock title="终端" language="bash" code={`# 串行运行
lmp -in in.test

# MPI 并行运行（4 核）
mpirun -np 4 lmp -in in.test`} />
                      </StepIndicator>
                    </div>
                  </InfoCard>
                </TabsContent>

                {/* ─── 源码编译 ─── */}
                <TabsContent value="source">
                  <InfoCard
                    title="源码编译路线"
                    audience="需要自定义 LAMMPS 包、GPU 加速、或修改源码的高级用户"
                    pros={[
                      "完全自定义编译选项",
                      "可以启用任意 LAMMPS 包",
                      "支持 GPU 加速（KOKKOS）",
                    ]}
                    cons={[
                      "编译过程较复杂，约需 30-60 分钟",
                      "需要安装 CMake、编译器等工具链",
                      "出错时排查难度较高",
                    ]}
                  >
                    <div className="mt-4 space-y-1">
                      <StepIndicator number={1} title="安装依赖">
                        <CodeBlock title="终端" language="bash" code="brew install cmake openmpi" />
                      </StepIndicator>

                      <StepIndicator number={2} title="下载 LAMMPS 源码">
                        <CodeBlock title="终端" language="bash" code={`git clone -b stable https://github.com/lammps/lammps.git
cd lammps`} />
                      </StepIndicator>

                      <StepIndicator number={3} title="CMake 编译">
                        <CodeBlock title="终端" language="bash" code={`mkdir build && cd build
cmake ../cmake -D BUILD_MPI=yes \\
               -D PKG_MANYBODY=yes \\
               -D PKG_KSPACE=yes \\
               -D PKG_MOLECULE=yes
make -j$(sysctl -n hw.ncpu)
sudo make install`} />
                        <WarningBox type="tip" title="提示">
                          <IC>-D PKG_XXX=yes</IC> 用于启用特定的 LAMMPS 包。根据你的研究需求选择需要的包。常用的包包括 MANYBODY（多体势）、KSPACE（长程静电）、MOLECULE（分子键）等。
                        </WarningBox>
                      </StepIndicator>
                    </div>
                  </InfoCard>
                </TabsContent>
              </Tabs>
            </ScrollReveal>
          </div>
        </section>

        <div className="section-divider" />

        {/* ═══════════ 5. 超算 / 集群教程 ═══════════ */}
        <section id="hpc-guide" className="py-20 md:py-28 relative" style={{ background: "oklch(0.975 0.003 200 / 0.5)" }}>
          <div className="container max-w-5xl relative z-10">
            <ScrollReveal>
              <SectionHeading
                id="hpc-guide-title"
                title="超算 / 集群使用教程"
                subtitle="当你的模拟体系变大、需要更多计算资源时，就需要把任务提交到超算集群上运行。本节以 Slurm 调度系统为例。"
                badge="HPC"
              />
            </ScrollReveal>

            <ScrollReveal>
              <div className="rounded-2xl overflow-hidden shadow-md mb-10 hover:shadow-lg transition-shadow duration-300">
                <img src={HPC_IMG} alt="超算集群" className="w-full h-auto" />
              </div>
            </ScrollReveal>

            {/* 基础概念 */}
            <ScrollReveal>
              <div className="grid sm:grid-cols-3 gap-5 mb-10">
                {[
                  {
                    icon: Server,
                    title: "什么是 Slurm？",
                    desc: "Slurm 是目前最主流的超算任务调度系统。它负责管理集群上的计算资源，将用户提交的任务分配到合适的计算节点上执行。你不能直接在登录节点上跑大任务，必须通过 Slurm 提交。",
                  },
                  {
                    icon: Terminal,
                    title: "核心命令",
                    desc: "sbatch：提交批处理任务脚本。srun：在分配的资源上运行命令。squeue：查看任务队列状态。scancel：取消任务。module：加载/卸载软件环境。",
                  },
                  {
                    icon: FileText,
                    title: "工作流程",
                    desc: "① 上传输入文件 → ② 编写 sbatch 脚本 → ③ 提交任务 → ④ 等待调度执行 → ⑤ 查看输出日志 → ⑥ 下载结果。",
                  },
                ].map((card, i) => (
                  <div key={i} className="bg-card rounded-xl border border-border p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                      style={{ background: "oklch(0.94 0.04 195)" }}>
                      <card.icon size={20} style={{ color: "oklch(0.45 0.12 195)" }} />
                    </div>
                    <h4 className="font-bold text-sm mb-2" style={{ color: "oklch(0.25 0.06 260)" }}>{card.title}</h4>
                    <p className="text-sm leading-relaxed" style={{ color: "oklch(0.45 0.02 260)" }}>{card.desc}</p>
                  </div>
                ))}
              </div>
            </ScrollReveal>

            {/* 详细步骤 */}
            <ScrollReveal>
              <div className="bg-card rounded-xl border border-border p-6 md:p-8 shadow-sm">
                <h3 className="text-xl font-bold mb-6" style={{ color: "oklch(0.25 0.06 260)" }}>
                  从上传文件到查看结果：完整流程
                </h3>

                <StepIndicator number={1} title="上传输入文件到集群">
                  <p className="mb-2">使用 <IC>scp</IC> 或 <IC>rsync</IC> 将本地文件上传到集群：</p>
                  <CodeBlock title="本地终端" language="bash" code={`# 上传单个文件
scp in.lammps username@cluster-address:~/projects/

# 上传整个目录
scp -r my_simulation/ username@cluster-address:~/projects/

# 或使用 rsync（推荐，支持断点续传）
rsync -avz my_simulation/ username@cluster-address:~/projects/my_simulation/`} />
                </StepIndicator>

                <StepIndicator number={2} title="加载 LAMMPS 模块">
                  <p className="mb-2">大多数超算中心已经预装了 LAMMPS，通过 <IC>module</IC> 命令加载：</p>
                  <CodeBlock title="集群终端" language="bash" code={`# 查看可用的 LAMMPS 版本
module avail lammps

# 加载指定版本
module load lammps/2024.8.29

# 查看已加载的模块
module list`} />
                  <WarningBox type="info" title="注意">
                    不同超算中心的模块名称可能不同。有的叫 <IC>lammps</IC>，有的叫 <IC>LAMMPS</IC>，有的带版本号。请查阅你所在超算中心的文档，或用 <IC>module avail</IC> 搜索。
                  </WarningBox>
                </StepIndicator>

                <StepIndicator number={3} title="编写 sbatch 提交脚本">
                  <p className="mb-2">创建一个名为 <IC>submit.slurm</IC> 的文件：</p>
                  <CodeBlock title="submit.slurm" language="bash" code={`#!/bin/bash
#SBATCH --job-name=lammps_test      # 任务名称
#SBATCH --partition=compute          # 队列/分区名称（按你的超算修改）
#SBATCH --account=your_account       # 账户名（按你的超算修改）
#SBATCH --nodes=1                    # 申请 1 个节点
#SBATCH --ntasks-per-node=24         # 每节点 24 个 MPI 进程
#SBATCH --time=01:00:00              # 最大运行时间 1 小时
#SBATCH --output=lammps_%j.out       # 标准输出文件（%j 为任务ID）
#SBATCH --error=lammps_%j.err        # 错误输出文件

# 加载环境
module load lammps/2024.8.29

# 进入工作目录
cd $SLURM_SUBMIT_DIR

# 运行 LAMMPS
srun lmp -in in.lammps`} />
                  <WarningBox type="warning" title="必须修改的参数">
                    以上脚本是模板，你需要根据自己超算中心的实际情况修改：<IC>--partition</IC>（队列名）、<IC>--account</IC>（账户名）、<IC>--ntasks-per-node</IC>（每节点核心数）、<IC>module load</IC> 的模块名。这些信息请查阅你所在超算中心的用户手册。
                  </WarningBox>
                </StepIndicator>

                <StepIndicator number={4} title="提交任务">
                  <CodeBlock title="集群终端" language="bash" code={`# 提交任务
sbatch submit.slurm

# 返回类似：Submitted batch job 123456`} />
                </StepIndicator>

                <StepIndicator number={5} title="查看任务状态">
                  <CodeBlock title="集群终端" language="bash" code={`# 查看自己的任务
squeue -u $USER

# 常见状态：
# PD = Pending（排队中）
# R  = Running（运行中）
# CG = Completing（即将完成）

# 取消任务
scancel 123456`} />
                </StepIndicator>

                <StepIndicator number={6} title="查看输出日志">
                  <CodeBlock title="集群终端" language="bash" code={`# 查看标准输出
cat lammps_123456.out

# 实时跟踪输出（任务运行中）
tail -f lammps_123456.out

# 查看错误日志
cat lammps_123456.err`} />
                </StepIndicator>

                <StepIndicator number={7} title="排查任务没有运行的常见原因">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr style={{ background: "oklch(0.96 0.01 200)" }}>
                          <th className="text-left p-3 border border-border font-semibold" style={{ color: "oklch(0.30 0.06 260)" }}>现象</th>
                          <th className="text-left p-3 border border-border font-semibold" style={{ color: "oklch(0.30 0.06 260)" }}>可能原因</th>
                          <th className="text-left p-3 border border-border font-semibold" style={{ color: "oklch(0.30 0.06 260)" }}>解决方法</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          ["一直 PD 排队", "资源不足或队列繁忙", "减少申请的节点数，或换一个空闲队列"],
                          ["提交后立即失败", "脚本格式错误", "检查 #SBATCH 行是否有拼写错误"],
                          ["任务运行但输出为空", "工作目录错误", "确认 cd $SLURM_SUBMIT_DIR 正确"],
                          ["报错 partition 不存在", "队列名写错", "用 sinfo 查看可用队列"],
                          ["报错 account 无效", "账户名写错", "联系超算管理员确认账户"],
                        ].map((row, i) => (
                          <tr key={i} className="hover:bg-muted/30 transition-colors">
                            <td className="p-3 border border-border" style={{ color: "oklch(0.40 0.02 260)" }}>{row[0]}</td>
                            <td className="p-3 border border-border" style={{ color: "oklch(0.40 0.02 260)" }}>{row[1]}</td>
                            <td className="p-3 border border-border" style={{ color: "oklch(0.40 0.02 260)" }}>{row[2]}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </StepIndicator>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <div className="section-divider" />

        {/* ═══════════ 6. 第一份 LAMMPS 输入文件 ═══════════ */}
        <section id="input-file" className="py-20 md:py-28 relative overflow-hidden">
          <MoleculeDecoration className="absolute bottom-10 right-0 opacity-40 hidden lg:block" variant="right" />
          <div className="container max-w-5xl relative z-10">
            <ScrollReveal>
              <SectionHeading
                id="input-file-title"
                title="第一份 LAMMPS 输入文件"
                subtitle="这是一个最小可运行的 LAMMPS 示例——Lennard-Jones 液体模拟。鼠标悬停在每一行上，可以看到逐行解释。"
                badge="核心教程"
              />
            </ScrollReveal>

            <ScrollReveal>
              <div className="grid lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3">
                  <AnnotatedCode lines={inputFileLines} title="in.lj — 最小 LAMMPS 示例" />
                </div>

                <div className="lg:col-span-2 space-y-5">
                  <div className="rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                    <img src={INPUT_IMG} alt="LAMMPS 输入文件" className="w-full h-auto" />
                  </div>

                  <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
                    <h4 className="font-bold text-base mb-4" style={{ color: "oklch(0.25 0.06 260)" }}>
                      关键命令详解
                    </h4>
                    <div className="space-y-4">
                      {[
                        { cmd: "units", desc: "定义模拟使用的单位制。lj 是无量纲的 Lennard-Jones 单位，适合教学。实际研究中常用 metal（金属）、real（实数，常用于有机分子）等。" },
                        { cmd: "atom_style", desc: "定义原子的数据结构。atomic 是最简单的，只有坐标和速度。如果需要键、角、电荷等信息，需要用 full、charge 等。" },
                        { cmd: "pair_style", desc: "定义原子间的相互作用势函数。lj/cut 是截断的 Lennard-Jones 势，2.5 是截断半径。不同的研究体系需要不同的势函数。" },
                        { cmd: "pair_coeff", desc: "设置势函数的参数。对于 LJ 势，参数是 ε（能量深度）和 σ（特征长度）。" },
                        { cmd: "fix", desc: "对原子施加约束或操作。nve 是微正则系综积分器，langevin 是恒温器。fix 是 LAMMPS 中最灵活的命令之一。" },
                        { cmd: "thermo", desc: "控制热力学信息的输出频率。100 表示每 100 步输出一次温度、能量、压力等信息。" },
                        { cmd: "run", desc: "执行模拟。1000 表示运行 1000 个时间步。" },
                      ].map((item, i) => (
                        <div key={i} className="border-l-2 pl-4 hover:border-l-[3px] transition-all" style={{ borderColor: "oklch(0.65 0.15 195)" }}>
                          <code className="text-sm font-semibold" style={{ color: "oklch(0.40 0.12 195)" }}>{item.cmd}</code>
                          <p className="text-sm mt-1 leading-relaxed" style={{ color: "oklch(0.42 0.02 260)" }}>{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <div className="section-divider" />

        {/* ═══════════ 7. 本地运行与并行运行 ═══════════ */}
        <section id="parallel-run" className="py-20 md:py-28 relative" style={{ background: "oklch(0.975 0.003 200 / 0.5)" }}>
          <div className="container max-w-5xl relative z-10">
            <ScrollReveal>
              <SectionHeading
                id="parallel-run-title"
                title="本地运行与并行运行"
                subtitle="LAMMPS 支持串行和 MPI 并行两种运行方式。并行运行可以显著加速大体系的模拟。"
                badge="运行指南"
              />
            </ScrollReveal>

            <ScrollReveal>
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {/* 串行运行 */}
                <div className="bg-card rounded-xl border border-border p-6 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ background: "oklch(0.94 0.04 195)" }}>
                      <Play size={20} style={{ color: "oklch(0.45 0.12 195)" }} />
                    </div>
                    <div>
                      <h4 className="font-bold text-base" style={{ color: "oklch(0.25 0.06 260)" }}>串行运行</h4>
                      <p className="text-xs" style={{ color: "oklch(0.55 0.02 260)" }}>单核，适合小体系和测试</p>
                    </div>
                  </div>
                  <CodeBlock title="所有平台通用" language="shell" code="lmp -in in.lammps" />
                  <p className="text-sm mt-3 leading-relaxed" style={{ color: "oklch(0.42 0.02 260)" }}>
                    串行运行只使用一个 CPU 核心。适合原子数较少（&lt;10000）的体系，或者调试输入文件时使用。
                  </p>
                </div>

                {/* 并行运行 */}
                <div className="bg-card rounded-xl border border-border p-6 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ background: "oklch(0.94 0.03 75)" }}>
                      <Cpu size={20} style={{ color: "oklch(0.55 0.12 75)" }} />
                    </div>
                    <div>
                      <h4 className="font-bold text-base" style={{ color: "oklch(0.25 0.06 260)" }}>MPI 并行运行</h4>
                      <p className="text-xs" style={{ color: "oklch(0.55 0.02 260)" }}>多核，适合大体系和正式计算</p>
                    </div>
                  </div>

                  <Tabs defaultValue="linux" className="w-full">
                    <TabsList className="w-full justify-start mb-3 bg-muted/50 p-1 rounded-lg">
                      <TabsTrigger value="linux" className="rounded-md text-xs px-3">Linux / macOS</TabsTrigger>
                      <TabsTrigger value="windows" className="rounded-md text-xs px-3">Windows</TabsTrigger>
                      <TabsTrigger value="slurm" className="rounded-md text-xs px-3">超算 (Slurm)</TabsTrigger>
                    </TabsList>
                    <TabsContent value="linux">
                      <CodeBlock title="终端" language="bash" code={`# 使用 4 个核心并行运行
mpirun -np 4 lmp -in in.lammps`} />
                    </TabsContent>
                    <TabsContent value="windows">
                      <CodeBlock title="CMD / PowerShell" language="shell" code={`# Windows 使用 mpiexec（需安装 MS-MPI）
mpiexec -np 4 lmp -in in.lammps`} />
                      <WarningBox type="info" title="Windows MPI">
                        Windows 上需要安装 Microsoft MPI（MS-MPI）才能使用 mpiexec。下载地址：<IC>https://learn.microsoft.com/en-us/message-passing-interface/microsoft-mpi</IC>
                      </WarningBox>
                    </TabsContent>
                    <TabsContent value="slurm">
                      <CodeBlock title="sbatch 脚本中" language="bash" code={`# 在 sbatch 脚本中使用 srun
srun lmp -in in.lammps

# srun 会自动使用 Slurm 分配的所有核心
# 不需要手动指定 -np 参数`} />
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
                <h4 className="font-bold text-base mb-4" style={{ color: "oklch(0.25 0.06 260)" }}>
                  mpirun vs mpiexec vs srun 的区别
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr style={{ background: "oklch(0.96 0.01 200)" }}>
                        <th className="text-left p-3 border border-border font-semibold" style={{ color: "oklch(0.30 0.06 260)" }}>命令</th>
                        <th className="text-left p-3 border border-border font-semibold" style={{ color: "oklch(0.30 0.06 260)" }}>平台</th>
                        <th className="text-left p-3 border border-border font-semibold" style={{ color: "oklch(0.30 0.06 260)" }}>说明</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ["mpirun", "Linux / macOS", "OpenMPI 提供的启动命令，最常用。需要手动指定 -np 进程数。"],
                        ["mpiexec", "Windows / 通用", "MPI 标准定义的启动命令。Windows 上安装 MS-MPI 后使用。功能与 mpirun 类似。"],
                        ["srun", "超算 (Slurm)", "Slurm 调度系统的启动命令。自动使用 sbatch 分配的资源，不需要手动指定进程数。推荐在超算上使用。"],
                      ].map((row, i) => (
                        <tr key={i} className="hover:bg-muted/30 transition-colors">
                          <td className="p-3 border border-border font-mono text-xs" style={{ color: "oklch(0.40 0.12 195)" }}>{row[0]}</td>
                          <td className="p-3 border border-border" style={{ color: "oklch(0.40 0.02 260)" }}>{row[1]}</td>
                          <td className="p-3 border border-border" style={{ color: "oklch(0.40 0.02 260)" }}>{row[2]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <div className="section-divider" />

        {/* ═══════════ 案例一：LJ 液体热导率 ═══════════ */}
        <section id="case-lj-thermal" className="py-20 md:py-28 relative" style={{ background: "oklch(0.975 0.003 200 / 0.5)" }}>
          <div className="container max-w-5xl relative z-10">
            <ScrollReveal>
              <SectionHeading
                id="case-lj-thermal-title"
                title="案例一：LJ 液体热导率计算"
                subtitle="用最经典的 Lennard-Jones 体系入手，学习 Green-Kubo 和 NEMD 两种热导率计算方法。"
                badge="案例实战"
              />
            </ScrollReveal>

            <ScrollReveal>
              <div className="mb-10 p-6 rounded-xl border border-border bg-card shadow-sm">
                <h4 className="font-bold text-base mb-3" style={{ color: "oklch(0.25 0.06 260)" }}>
                  为什么从这个案例开始？
                </h4>
                <div className="space-y-2 text-sm leading-relaxed" style={{ color: "oklch(0.40 0.02 260)" }}>
                  <p>
                    热导率是材料最基本的热物性参数之一。在纳米尺度，声子平均自由程可能与体系尺寸相当，宏观 Fourier 定律不再适用，分子动力学模拟成为预测纳米材料热导率的核心手段。
                  </p>
                  <p>
                    LJ 液体是 MD 模拟的「Hello World」——势函数简单、参数明确、无需额外的势函数文件，可以让你把注意力集中在方法本身。掌握 Green-Kubo（平衡态，基于热流自关联函数）和 NEMD（非平衡态，施加温度梯度）两种方法后，可以直接迁移到真实材料体系的热导率计算。
                  </p>
                </div>
              </div>
            </ScrollReveal>

            {/* Workflow steps */}
            <div className="grid sm:grid-cols-5 gap-4 mb-10">
              {[
                { icon: Box, label: "建模", desc: "创建 LJ FCC 晶体结构" },
                { icon: Settings, label: "输入文件", desc: "编写 NEMD / Green-Kubo 脚本" },
                { icon: Play, label: "运行", desc: "串行运行与 MPI 并行" },
                { icon: BarChart3, label: "后处理", desc: "提取热流与温度梯度" },
                { icon: Eye, label: "可视化", desc: "OVITO 查看温度场分布" },
              ].map((step, i) => (
                <ScrollReveal key={i} delay={i * 60}>
                  <div className="text-center p-4 rounded-xl border border-border bg-card hover:shadow-md transition-all duration-300">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-2"
                      style={{ background: "oklch(0.94 0.04 195)" }}>
                      <step.icon size={20} style={{ color: "oklch(0.45 0.12 195)" }} />
                    </div>
                    <div className="text-xs font-bold mb-1" style={{ color: "oklch(0.45 0.10 195)" }}>
                      Step {i + 1}
                    </div>
                    <h4 className="font-bold text-sm mb-1" style={{ color: "oklch(0.25 0.06 260)" }}>{step.label}</h4>
                    <p className="text-xs" style={{ color: "oklch(0.48 0.02 260)" }}>{step.desc}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            <ScrollReveal>
              <div className="space-y-1">
                <StepIndicator number={1} title="搭建结构：FCC 晶格">
                  <p className="mb-2">
                    LJ 液体是 MD 模拟的 "Hello World"。我们从 FCC 晶格出发，通过升温熔化获得液体构型。
                  </p>
                  <CodeBlock title="in.lj-structure" language="lammps" code={`# 创建 LJ FCC 结构
units           lj
atom_style      atomic
boundary        p p p

lattice         fcc 0.8442
region          box block 0 10 0 10 0 10
create_box      1 box
create_atoms    1 box
mass            1 1.0

# 将结构写出供后续使用
write_data      lj_structure.data`} />
                </StepIndicator>

                <StepIndicator number={2} title="编写输入文件：NEMD 方法（Müller-Plathe）">
                  <p className="mb-2">
                    NEMD（Non-Equilibrium MD）通过 <IC>fix thermal/conductivity</IC> 在体系两端施加热流，
                    待温度梯度稳定后由 Fourier 定律 $\kappa = J / (dT/dx)$ 计算热导率。
                  </p>
                  <CodeBlock title="in.lj-nemd" language="lammps" code={`# LJ 液体热导率 — NEMD (Müller-Plathe)
units           lj
atom_style      atomic
boundary        p p p

read_data       lj_structure.data

pair_style      lj/cut 2.5
pair_coeff      1 1 1.0 1.0 2.5

velocity        all create 1.35 87287

# 先平衡
fix             1 all npt temp 1.0 1.0 0.5 iso 0.0 0.0 5.0
run             20000
unfix           1

# NEMD: 沿 z 方向交换动能
fix             1 all nve
fix             2 all thermal/conductivity 100 z 20

# 采样温度分布
compute         chunks all chunk/atom bin/1d z lower 0.05
fix             3 all ave/chunk 10 1000 10000 chunks temp file temp_profile.dat

run             200000`} />
                </StepIndicator>

                <StepIndicator number={3} title="运行模拟">
                  <p className="mb-2">此案例体系较小，单核即可运行；也可用 MPI 加速：</p>
                  <CodeBlock title="终端" language="shell" code={`# 单核运行
lmp -in in.lj-nemd

# 4 核并行
mpirun -np 4 lmp -in in.lj-nemd`} />
                </StepIndicator>

                <StepIndicator number={4} title="后处理：提取热导率">
                  <p className="mb-2">
                    运行结束后，<IC>temp_profile.dat</IC> 记录了沿 z 方向的温度分布。
                    用 Python 拟合线性区域的温度梯度，结合交换的热流即可算出 $\kappa$。
                  </p>
                  <CodeBlock title="post_process.py" language="python" code={`import numpy as np
import matplotlib.pyplot as plt

# 读取温度分布 (跳过文件头)
data = np.loadtxt("temp_profile.dat", skiprows=4)
z = data[:, 1]       # z 坐标
T = data[:, 3]       # 温度

# 拟合线性区域
from scipy.stats import linregress
slope, intercept, r, p, se = linregress(z[5:15], T[5:15])
print(f"温度梯度 dT/dz = {slope:.4f}")

plt.plot(z, T, 'o-')
plt.xlabel("z (reduced units)")
plt.ylabel("T (reduced units)")
plt.title("Temperature Profile (NEMD)")
plt.savefig("temp_profile.png", dpi=150)
plt.show()`} />
                </StepIndicator>

                <StepIndicator number={5} title="OVITO 可视化">
                  <p className="mb-2">
                    用 OVITO 打开 dump 文件，可以直观看到温度场分布：
                  </p>
                  <ul className="space-y-2 mb-3">
                    {[
                      "File → Load File，选择 dump 文件",
                      "在右侧 Pipeline 中添加 Color coding 修改器",
                      "Source property 选择 c_ke（动能）或自定义温度属性",
                      "调整色标范围，观察高温区和低温区的分布",
                      "使用 Slice 修改器切一个截面，更清晰地展示温度梯度",
                    ].map((step, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm" style={{ color: "oklch(0.38 0.02 260)" }}>
                        <div className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ background: "oklch(0.55 0.15 195)" }} />
                        {step}
                      </li>
                    ))}
                  </ul>
                </StepIndicator>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={100}>
              <WarningBox type="tip" title="延伸">
                试着用 Green-Kubo 方法（基于热流自关联函数）计算同一体系的热导率，与 NEMD 结果对比。
                两种方法的一致性是验证模拟可靠性的好方式。
              </WarningBox>
            </ScrollReveal>
          </div>
        </section>

        <div className="section-divider" />

        {/* ═══════════ 案例二：纳米通道水流动 ═══════════ */}
        <section id="case-nano-channel" className="py-20 md:py-28 relative overflow-hidden">
          <MoleculeDecoration className="absolute top-10 right-0 opacity-40 hidden lg:block" variant="right" />
          <div className="container max-w-5xl relative z-10">
            <ScrollReveal>
              <SectionHeading
                id="case-nano-channel-title"
                title="案例二：纳米通道中的水流动"
                subtitle="搭建石墨烯纳米通道，模拟受限水的 Poiseuille 流动，观察纳米尺度下速度滑移现象。"
                badge="案例实战"
              />
            </ScrollReveal>

            <ScrollReveal>
              <div className="mb-10 p-6 rounded-xl border border-border bg-card shadow-sm">
                <h4 className="font-bold text-base mb-3" style={{ color: "oklch(0.25 0.06 260)" }}>
                  研究意义
                </h4>
                <div className="space-y-2 text-sm leading-relaxed" style={{ color: "oklch(0.40 0.02 260)" }}>
                  <p>
                    水在纳米通道中的输运行为与宏观流体力学有本质区别：经典的无滑移边界条件不再成立，壁面处出现显著的速度滑移，流量可以比 Hagen-Poiseuille 方程的预测高出数个量级。这一现象直接关系到纳米流控芯片、海水淡化膜、生物离子通道等前沿应用。
                  </p>
                  <p>
                    MD 模拟是研究纳米受限流动几乎唯一可靠的工具——实验难以直接测量纳米尺度的速度剖面，而连续介质假设在这个尺度已经失效。通过本案例，你将学会如何用外力驱动流动、提取速度剖面、计算滑移长度，这些技能可以直接用于纳米流体输运的研究工作。
                  </p>
                </div>
              </div>
            </ScrollReveal>

            <div className="grid sm:grid-cols-5 gap-4 mb-10">
              {[
                { icon: Box, label: "建模", desc: "石墨烯通道 + SPC/E 水分子" },
                { icon: Settings, label: "输入文件", desc: "势函数与外力驱动流动" },
                { icon: Play, label: "运行", desc: "平衡 + 非平衡采样" },
                { icon: BarChart3, label: "后处理", desc: "速度剖面与滑移长度" },
                { icon: Eye, label: "可视化", desc: "OVITO 观察流动形态" },
              ].map((step, i) => (
                <ScrollReveal key={i} delay={i * 60}>
                  <div className="text-center p-4 rounded-xl border border-border bg-card hover:shadow-md transition-all duration-300">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-2"
                      style={{ background: "oklch(0.93 0.05 220)" }}>
                      <step.icon size={20} style={{ color: "oklch(0.40 0.14 220)" }} />
                    </div>
                    <div className="text-xs font-bold mb-1" style={{ color: "oklch(0.40 0.12 220)" }}>
                      Step {i + 1}
                    </div>
                    <h4 className="font-bold text-sm mb-1" style={{ color: "oklch(0.25 0.06 260)" }}>{step.label}</h4>
                    <p className="text-xs" style={{ color: "oklch(0.48 0.02 260)" }}>{step.desc}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            <ScrollReveal>
              <div className="space-y-1">
                <StepIndicator number={1} title="搭建结构：石墨烯通道 + 水">
                  <p className="mb-2">
                    需要两片平行石墨烯壁面和中间填充的 SPC/E 水分子。
                    可以用 LAMMPS 内置命令创建，也可以用 Moltemplate 或 Python (ASE) 生成。
                  </p>
                  <CodeBlock title="build_channel.py（用 ASE 生成石墨烯）" language="python" code={`from ase.build import graphene_nanoribbon
from ase.io import write
import numpy as np

# 创建石墨烯片层
sheet = graphene_nanoribbon(10, 10, type='armchair', sheet=True, vacuum=0)

# 复制一片作为上壁面，偏移 z 方向
upper = sheet.copy()
upper.positions[:, 2] += 30.0  # 通道宽度 30 Å

# 合并并写出
from ase import Atoms
channel = sheet + upper
channel.cell = [sheet.cell[0,0], sheet.cell[1,1], 60.0]
write("graphene_channel.data", channel, format="lammps-data")`} />
                  <WarningBox type="warning" title="注意">
                    水分子需要单独生成（可用 Packmol 填充），然后与石墨烯 data 文件合并。
                    确保水分子不与壁面重叠。
                  </WarningBox>
                </StepIndicator>

                <StepIndicator number={2} title="编写输入文件">
                  <p className="mb-2">
                    关键点：石墨烯壁面用 <IC>fix setforce 0 0 0</IC> 固定或用弹簧约束；
                    水分子用 SPC/E 模型（<IC>pair_style lj/cut/coul/long</IC>）；
                    用 <IC>fix addforce</IC> 施加外力驱动流动。
                  </p>
                  <CodeBlock title="in.nano-channel" language="lammps" code={`# 纳米通道 Poiseuille 流动
units           real
atom_style      full
boundary        p p f     # z 方向非周期

read_data       channel_with_water.data

# 势函数
pair_style      lj/cut/coul/long 10.0
pair_coeff      1 1 0.00284 3.4      # C-C
pair_coeff      2 2 0.1553 3.166     # O-O (SPC/E)
pair_coeff      1 2 0.0210 3.283     # C-O (混合规则)
kspace_style    pppm 1e-4

bond_style      harmonic
angle_style     harmonic

# 固定壁面
group           wall type 1
group           water type 2 3
fix             freeze wall setforce 0.0 0.0 0.0

# 先平衡
fix             1 water nvt temp 300.0 300.0 100.0
run             50000

# 施加外力驱动流动
fix             drive water addforce 0.005 0.0 0.0

# 采样速度剖面
compute         chunks water chunk/atom bin/1d z lower 1.0
fix             vprofile water ave/chunk 10 1000 50000 chunks vx file velocity_profile.dat

dump            1 all custom 5000 dump.channel id type x y z vx vy vz
run             500000`} />
                </StepIndicator>

                <StepIndicator number={3} title="运行模拟">
                  <p className="mb-2">这个体系含长程静电（PPPM），建议至少 4 核并行：</p>
                  <CodeBlock title="终端" language="shell" code="mpirun -np 4 lmp -in in.nano-channel" />
                </StepIndicator>

                <StepIndicator number={4} title="后处理：速度剖面与滑移长度">
                  <p className="mb-2">
                    从 <IC>velocity_profile.dat</IC> 提取 $v_x(z)$ 剖面，
                    拟合抛物线得到 Poiseuille 流速分布，外推到壁面处计算滑移长度 $l_s$。
                  </p>
                  <CodeBlock title="plot_velocity.py" language="python" code={`import numpy as np
import matplotlib.pyplot as plt

data = np.loadtxt("velocity_profile.dat", skiprows=4)
z = data[:, 1]
vx = data[:, 3]

# 拟合抛物线 vx = a*z^2 + b*z + c
coeffs = np.polyfit(z, vx, 2)
z_fit = np.linspace(z.min(), z.max(), 200)
vx_fit = np.polyval(coeffs, z_fit)

plt.plot(z, vx, 'o', label='MD data')
plt.plot(z_fit, vx_fit, '-', label='Parabolic fit')
plt.xlabel("z (Å)")
plt.ylabel("vx (Å/fs)")
plt.legend()
plt.title("Velocity Profile in Nanochannel")
plt.savefig("velocity_profile.png", dpi=150)
plt.show()`} />
                </StepIndicator>

                <StepIndicator number={5} title="OVITO 可视化">
                  <p className="mb-2">用 OVITO 观察流动形态：</p>
                  <ul className="space-y-2 mb-3">
                    {[
                      "加载 dump.channel，可以看到石墨烯壁面和中间的水分子",
                      "添加 Color coding → 选择 vx，用色标显示流速分布",
                      "添加 Slice 取 xz 截面，直观看到抛物线速度剖面",
                      "使用 Create bonds 修改器给水分子添加 O-H 键以便观察分子取向",
                      "导出动画（File → Export → Animation），观察流动的动态过程",
                    ].map((step, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm" style={{ color: "oklch(0.38 0.02 260)" }}>
                        <div className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ background: "oklch(0.55 0.15 195)" }} />
                        {step}
                      </li>
                    ))}
                  </ul>
                </StepIndicator>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={100}>
              <WarningBox type="tip" title="延伸">
                调整通道宽度（2 nm → 5 nm → 10 nm），观察滑移长度如何随尺度变化。
                当通道足够宽时，速度剖面应趋近经典 Poiseuille 流。
              </WarningBox>
            </ScrollReveal>
          </div>
        </section>

        <div className="section-divider" />

        {/* ═══════════ 案例三：固-液界面热阻 ═══════════ */}
        <section id="case-interface-resistance" className="py-20 md:py-28 relative" style={{ background: "oklch(0.975 0.003 200 / 0.5)" }}>
          <div className="container max-w-5xl relative z-10">
            <ScrollReveal>
              <SectionHeading
                id="case-interface-resistance-title"
                title="案例三：固-液界面热阻（Kapitza 电阻）"
                subtitle="计算金属-水界面的 Kapitza 热阻，理解固液界面热输运的微观机制。"
                badge="案例实战"
              />
            </ScrollReveal>

            <ScrollReveal>
              <div className="mb-10 p-6 rounded-xl border border-border bg-card shadow-sm">
                <h4 className="font-bold text-base mb-3" style={{ color: "oklch(0.25 0.06 260)" }}>
                  研究意义
                </h4>
                <div className="space-y-2 text-sm leading-relaxed" style={{ color: "oklch(0.40 0.02 260)" }}>
                  <p>
                    固-液界面热阻（Kapitza 电阻）是纳米尺度热管理的关键瓶颈。在电子器件散热、纳米流体强化换热、热界面材料等应用中，界面热阻往往是制约整体传热性能的主导因素——材料本体导热再好，如果界面热阻大，热量也传不过去。
                  </p>
                  <p>
                    界面热阻的微观机制至今仍不完全清楚：声子如何跨界面传递？固体表面润湿性与界面热阻是什么关系？表面粗糙度、化学修饰如何影响热输运？这些问题都需要 MD 模拟从原子尺度给出答案。本案例让你掌握 NEMD 方法计算界面热阻的完整流程。
                  </p>
                </div>
              </div>
            </ScrollReveal>

            <div className="grid sm:grid-cols-5 gap-4 mb-10">
              {[
                { icon: Box, label: "建模", desc: "Au (111) 表面 + SPC/E 水" },
                { icon: Settings, label: "输入文件", desc: "NEMD 施加热流" },
                { icon: Play, label: "运行", desc: "平衡 + 非平衡采样" },
                { icon: BarChart3, label: "后处理", desc: "界面温度跳变 → Rk" },
                { icon: Eye, label: "可视化", desc: "OVITO 温度场 + 密度分布" },
              ].map((step, i) => (
                <ScrollReveal key={i} delay={i * 60}>
                  <div className="text-center p-4 rounded-xl border border-border bg-card hover:shadow-md transition-all duration-300">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-2"
                      style={{ background: "oklch(0.94 0.04 30)" }}>
                      <step.icon size={20} style={{ color: "oklch(0.50 0.15 30)" }} />
                    </div>
                    <div className="text-xs font-bold mb-1" style={{ color: "oklch(0.50 0.13 30)" }}>
                      Step {i + 1}
                    </div>
                    <h4 className="font-bold text-sm mb-1" style={{ color: "oklch(0.25 0.06 260)" }}>{step.label}</h4>
                    <p className="text-xs" style={{ color: "oklch(0.48 0.02 260)" }}>{step.desc}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            <ScrollReveal>
              <div className="space-y-1">
                <StepIndicator number={1} title="搭建结构：Au (111) + 水">
                  <p className="mb-2">
                    构建 Au (111) 晶面作为固体壁面，上方填充 SPC/E 水分子。
                    可以用 ASE 生成金表面，Packmol 填充水。
                  </p>
                  <CodeBlock title="build_au_water.py" language="python" code={`from ase.build import fcc111
from ase.io import write

# Au (111) 表面, 6x6 超胞, 8 层原子
slab = fcc111('Au', size=(6, 6, 8), a=4.08, vacuum=40.0)
write("au_slab.data", slab, format="lammps-data")

# 水分子用 Packmol 填充到 slab 上方空间
# 然后合并两个 data 文件`} />
                </StepIndicator>

                <StepIndicator number={2} title="编写输入文件：NEMD 热流法">
                  <p className="mb-2">
                    思路：在 Au 块体内部设置热源，在水的远端设置热汇，
                    热流经过 Au-水界面时产生温度跳变 $\Delta T$，
                    Kapitza 热阻 $R_K = \Delta T / J$。
                  </p>
                  <CodeBlock title="in.kapitza" language="lammps" code={`# Au-水界面 Kapitza 热阻
units           metal
atom_style      full
boundary        p p f

read_data       au_water.data

# 势函数
pair_style      hybrid eam lj/cut/coul/long 10.0
pair_coeff      * * eam Au.eam.alloy    # Au-Au
pair_coeff      2 2 lj/cut/coul/long 0.00674 3.166  # O-O
pair_coeff      1 2 lj/cut/coul/long 0.00520 2.90   # Au-O
kspace_style    pppm 1e-5

# 分组
group           gold type 1
group           water type 2 3

# 平衡
fix             1 all nvt temp 300 300 0.1
run             50000
unfix           1

fix             1 all nve

# 热源（Au 内部）和热汇（水远端）
region          hot block INF INF INF INF 10 15
region          cold block INF INF INF INF 55 60
fix             heat all ehex 1 0.05 region hot
fix             cool all ehex 1 -0.05 region cold

# 温度剖面
compute         layers all chunk/atom bin/1d z lower 1.0
fix             Tprofile all ave/chunk 10 2000 20000 layers temp file temp_kapitza.dat

dump            1 all custom 10000 dump.kapitza id type x y z

run             500000`} />
                </StepIndicator>

                <StepIndicator number={3} title="运行模拟">
                  <CodeBlock title="终端" language="shell" code="mpirun -np 8 lmp -in in.kapitza" />
                  <WarningBox type="warning" title="注意">
                    EAM 势文件（如 <IC>Au.eam.alloy</IC>）需要从 NIST Interatomic Potentials Repository 下载，
                    放在运行目录下。
                  </WarningBox>
                </StepIndicator>

                <StepIndicator number={4} title="后处理：计算界面热阻">
                  <p className="mb-2">
                    从温度剖面中读出界面两侧的温度跳变 $\Delta T$，结合施加的热流密度 $J$，
                    计算 $R_K = \Delta T \cdot A / \dot{"{"}Q{"}"}$。
                  </p>
                  <CodeBlock title="calc_kapitza.py" language="python" code={`import numpy as np
import matplotlib.pyplot as plt

data = np.loadtxt("temp_kapitza.dat", skiprows=4)
z = data[:, 1]
T = data[:, 3]

# 绘制温度剖面，界面处有明显温度跳变
plt.plot(z, T, 'o-', markersize=3)
plt.axvline(x=20.0, color='gray', ls='--', label='Au-water interface')
plt.xlabel("z (Å)")
plt.ylabel("T (K)")
plt.title("Temperature Profile across Au-Water Interface")
plt.legend()
plt.savefig("kapitza_profile.png", dpi=150)
plt.show()

# 计算 ΔT：界面两侧温度差
# (根据实际温度剖面确定界面位置和取值范围)`} />
                </StepIndicator>

                <StepIndicator number={5} title="OVITO 可视化">
                  <p className="mb-2">用 OVITO 观察界面结构和温度分布：</p>
                  <ul className="space-y-2 mb-3">
                    {[
                      "加载 dump.kapitza，可以看到 Au 晶体和上方的水分子",
                      "添加 Expression selection 选中水分子（Type == 2 || Type == 3），单独调整显示",
                      "使用 Coordination analysis 观察界面处水分子的排列方式",
                      "用 Color coding 将温度映射到颜色，直观看到界面处的温度跳变",
                      "导出截面图用于论文插图",
                    ].map((step, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm" style={{ color: "oklch(0.38 0.02 260)" }}>
                        <div className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ background: "oklch(0.55 0.15 195)" }} />
                        {step}
                      </li>
                    ))}
                  </ul>
                </StepIndicator>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={100}>
              <WarningBox type="tip" title="延伸">
                尝试对比光滑表面与粗糙表面（在 Au 表面挖坑或加纳米柱）的界面热阻差异。
                表面形貌如何影响声子-水分子耦合？这是热管理研究的前沿问题之一。
              </WarningBox>
            </ScrollReveal>
          </div>
        </section>

        <div className="section-divider" />

        {/* ═══════════ 案例四：SAM-Au-水界面 NVT 平衡 ═══════════ */}
        <section id="case-sam-gold" className="py-20 md:py-28 relative overflow-hidden">
          <MoleculeDecoration className="absolute top-10 right-0 opacity-40 hidden lg:block" variant="right" />
          <div className="container max-w-5xl relative z-10">
            <ScrollReveal>
              <SectionHeading
                id="case-sam-gold-title"
                title="案例四：SAM-Au-水界面 NVT 平衡"
                subtitle="搭建硫醇自组装单分子层（SC6）修饰的金表面与水的界面体系，完成从能量最小化到 NVT 平衡的完整流程。这是课题组实际使用的建模案例。"
                badge="案例实战"
              />
            </ScrollReveal>

            <ScrollReveal>
              <div className="mb-10 p-6 rounded-xl border border-border bg-card shadow-sm">
                <h4 className="font-bold text-base mb-3" style={{ color: "oklch(0.25 0.06 260)" }}>
                  研究意义
                </h4>
                <div className="space-y-2 text-sm leading-relaxed" style={{ color: "oklch(0.40 0.02 260)" }}>
                  <p>
                    自组装单分子层（SAM）是调控固体表面润湿性和界面热输运的重要手段。通过改变硫醇链的长度（SC6、SC12、SC18）和末端基团（-CH₃ 疏水、-OH 亲水），可以精确调控金属表面的润湿性，进而改变固-液界面热阻。这在微电子散热、微流控器件、生物界面等领域有广泛应用。
                  </p>
                  <p>
                    本案例是一个「真实科研级」的建模流程：涉及多种力场混合（class2 + Morse + LJ）、刚性水模型约束（SHAKE）、盒子变形压缩等操作，比前面的简化案例复杂得多。掌握这个流程后，你就具备了独立搭建复杂界面体系并完成平衡模拟的能力，可以在此基础上继续做热导率、润湿角、界面热阻等后续研究。
                  </p>
                </div>
              </div>
            </ScrollReveal>

            {/* Download button */}
            <ScrollReveal>
              <div className="mb-10 p-5 rounded-xl border border-border bg-card shadow-sm">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-sm mb-1" style={{ color: "oklch(0.25 0.06 260)" }}>
                      下载本案例全部文件
                    </h4>
                    <p className="text-xs" style={{ color: "oklch(0.50 0.02 260)" }}>
                      包含输入文件 in.nvt、势函数参数 pair_coeff、结构文件 lammps.data、Slurm 提交脚本 JOB
                    </p>
                  </div>
                  <a
                    href="https://github.com/dezhaohuang/lammps-tutorial/releases/download/v1.0.0/1-SC6.tar.gz"
                    download
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 shadow-sm hover:shadow-md shrink-0"
                    style={{ background: "linear-gradient(135deg, oklch(0.55 0.15 195), oklch(0.45 0.12 220))", color: "white" }}
                  >
                    <Download size={16} />
                    下载全部文件 (1-SC6.tar.gz)
                  </a>
                </div>
              </div>
            </ScrollReveal>

            {/* Workflow steps */}
            <div className="grid sm:grid-cols-5 gap-4 mb-10">
              {[
                { icon: Box, label: "体系构成", desc: "Au + SC6 硫醇 + TIP3P 水" },
                { icon: Settings, label: "力场设置", desc: "class2 + Morse + LJ 混合力场" },
                { icon: Layers, label: "能量最小化", desc: "消除初始构型的不合理接触" },
                { icon: ThermometerSun, label: "NVT 升温", desc: "10 K → 300 K 缓慢升温" },
                { icon: Eye, label: "平衡验证", desc: "检查能量和结构收敛" },
              ].map((step, i) => (
                <ScrollReveal key={i} delay={i * 60}>
                  <div className="text-center p-4 rounded-xl border border-border bg-card hover:shadow-md transition-all duration-300">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-2"
                      style={{ background: "oklch(0.94 0.04 55)" }}>
                      <step.icon size={20} style={{ color: "oklch(0.50 0.14 55)" }} />
                    </div>
                    <div className="text-xs font-bold mb-1" style={{ color: "oklch(0.50 0.12 55)" }}>
                      Step {i + 1}
                    </div>
                    <h4 className="font-bold text-sm mb-1" style={{ color: "oklch(0.25 0.06 260)" }}>{step.label}</h4>
                    <p className="text-xs" style={{ color: "oklch(0.48 0.02 260)" }}>{step.desc}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            <ScrollReveal>
              <div className="space-y-1">
                <StepIndicator number={1} title="体系结构概览">
                  <p className="mb-3">
                    本案例模拟的是一个典型的 SAM（Self-Assembled Monolayer，自组装单分子层）修饰金表面与水的界面体系：
                  </p>
                  <div className="overflow-x-auto mb-4">
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr style={{ background: "oklch(0.96 0.01 200)" }}>
                          <th className="text-left p-3 border border-border font-semibold" style={{ color: "oklch(0.30 0.06 260)" }}>组分</th>
                          <th className="text-left p-3 border border-border font-semibold" style={{ color: "oklch(0.30 0.06 260)" }}>原子编号</th>
                          <th className="text-left p-3 border border-border font-semibold" style={{ color: "oklch(0.30 0.06 260)" }}>原子数</th>
                          <th className="text-left p-3 border border-border font-semibold" style={{ color: "oklch(0.30 0.06 260)" }}>说明</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          ["SAM (上层)", "1 – 1280", "1280", "SC6 己硫醇分子 (C₆H₁₃S-)"],
                          ["SAM (下层)", "1281 – 2560", "1280", "SC6 己硫醇分子 (镜像对称)"],
                          ["Au (上层)", "2561 – 7360", "4800", "金基底 (上)"],
                          ["Au (下层)", "7361 – 12160", "4800", "金基底 (下)"],
                          ["Water", "12161 – 18160", "6000", "TIP3P 水分子"],
                        ].map((row, i) => (
                          <tr key={i} className="hover:bg-muted/30 transition-colors">
                            <td className="p-3 border border-border font-medium" style={{ color: "oklch(0.35 0.06 260)" }}>{row[0]}</td>
                            <td className="p-3 border border-border font-mono text-xs" style={{ color: "oklch(0.45 0.10 195)" }}>{row[1]}</td>
                            <td className="p-3 border border-border" style={{ color: "oklch(0.40 0.02 260)" }}>{row[2]}</td>
                            <td className="p-3 border border-border" style={{ color: "oklch(0.40 0.02 260)" }}>{row[3]}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-sm" style={{ color: "oklch(0.42 0.02 260)" }}>
                    总计 18160 个原子。结构文件 <IC>lammps.data</IC> 由 Materials Studio (MSL) 生成，包含完整的键、角、二面角和 improper 信息。
                  </p>
                </StepIndicator>

                <StepIndicator number={2} title="力场设置：多力场混合">
                  <p className="mb-3">
                    这个体系的难点在于需要混合多种力场。<IC>pair_style hybrid</IC> 允许对不同原子对使用不同的势函数：
                  </p>
                  <CodeBlock title="in.nvt — 力场设置部分" language="lammps" code={`#---------------Force Field Setup Module---------------
pair_style              hybrid  lj/class2/coul/long 10.0 10.0 \\
                                lj/cut/coul/long 10.0 10.0  morse 8
pair_modify             mix arithmetic
kspace_style            pppm 1.0e-5
bond_style              hybrid  class2  harmonic
angle_style             hybrid  class2  harmonic
dihedral_style          class2
improper_style          class2`} />
                  <div className="mt-4 space-y-3">
                    {[
                      { label: "lj/class2/coul/long", desc: "用于 SAM 分子内部（C、S、H）——PCFF/class2 力场" },
                      { label: "lj/cut/coul/long", desc: "用于 TIP3P 水分子（O*、H*）及跨组分相互作用" },
                      { label: "morse", desc: "用于 Au-Au 和 Au-S 相互作用——描述金属键和化学吸附" },
                    ].map((item, i) => (
                      <div key={i} className="border-l-2 pl-4" style={{ borderColor: "oklch(0.65 0.15 195)" }}>
                        <code className="text-sm font-semibold" style={{ color: "oklch(0.40 0.12 195)" }}>{item.label}</code>
                        <p className="text-sm mt-0.5" style={{ color: "oklch(0.42 0.02 260)" }}>{item.desc}</p>
                      </div>
                    ))}
                  </div>
                  <WarningBox type="info" title="pair_coeff 文件">
                    势函数参数较多，单独放在 <IC>pair_coeff</IC> 文件中，通过 <IC>include &apos;pair_coeff&apos;</IC> 引入。
                    这是大型体系的常见做法，可以让主输入文件保持清晰。
                  </WarningBox>
                </StepIndicator>

                <StepIndicator number={3} title="能量最小化">
                  <p className="mb-3">
                    初始构型可能存在原子重叠或不合理的键长，需要先做能量最小化。
                    最小化时固定 Au 和 S 原子（化学吸附位点），只让其余原子弛豫：
                  </p>
                  <CodeBlock title="in.nvt — 能量最小化部分" language="lammps" code={`#---------------Energy Minimization Module---------------
fix                     freeze  AuS setforce 0.0 0.0 0.0
minimize                0.0 1.0e-8 100000 10000000
unfix                   freeze`} />
                  <div className="mt-3 space-y-2">
                    <p className="text-sm" style={{ color: "oklch(0.42 0.02 260)" }}>
                      <IC>fix setforce 0 0 0</IC> 将 Au 和 S 原子受到的力设为零，等效于固定它们的位置。
                      <IC>minimize</IC> 的四个参数分别是：能量收敛阈值、力收敛阈值、最大迭代次数、最大力评估次数。
                    </p>
                  </div>
                </StepIndicator>

                <StepIndicator number={4} title="NVT 平衡：升温 + 恒温">
                  <p className="mb-3">
                    平衡分两阶段：先从 10 K 缓慢升温到 300 K，再在 300 K 恒温平衡。
                    注意时间步长设为 0.25 fs（比常见的 1 fs 小），因为体系含金属和有机分子，需要更小的步长保证数值稳定性。
                  </p>
                  <CodeBlock title="in.nvt — NVT 平衡部分" language="lammps" code={`#---------------Variable Definition & Initilization Module---------------
variable                vtimpstep   equal   0.25
timestep                \${vtimpstep}
variable                Pdamp       equal   \${vtimpstep}*1000
variable                Tdamp       equal   \${vtimpstep}*100

#---------------Equilibrium Module---------------
velocity                all create 10 4928459 rot yes dist gaussian
fix                     constrain Water shake 1.0e-4 100 0 b 4 a 6

# 阶段 1：10 K → 300 K 升温，同时沿 z 方向压缩盒子
fix                     Nvt1 all nvt temp 10 300.0 \${Tdamp}
fix                     1f all deform 1 z delta 0 -18.68 units box
run                     1000000
unfix                   1f
unfix                   Nvt1

# 阶段 2：300 K 恒温平衡
fix                     Nvt2 all nvt temp 300.0 300.0 \${Tdamp}
run                     1000000
unfix                   Nvt2`} />
                  <div className="mt-4 space-y-3">
                    {[
                      { label: "fix shake", desc: "约束水分子的 O-H 键长和 H-O-H 键角（TIP3P 模型要求刚性水）。b 4 表示第 4 种键类型，a 6 表示第 6 种角类型。" },
                      { label: "fix deform", desc: "在升温阶段沿 z 方向压缩盒子 18.68 Å，使水填满 SAM 与金表面之间的空间，消除真空层。" },
                      { label: "Tdamp", desc: "温度阻尼系数 = 0.25 × 100 = 25 fs。一般取 100 倍时间步长，过小会导致温度振荡，过大则温控太弱。" },
                    ].map((item, i) => (
                      <div key={i} className="border-l-2 pl-4" style={{ borderColor: "oklch(0.65 0.15 195)" }}>
                        <code className="text-sm font-semibold" style={{ color: "oklch(0.40 0.12 195)" }}>{item.label}</code>
                        <p className="text-sm mt-0.5" style={{ color: "oklch(0.42 0.02 260)" }}>{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </StepIndicator>

                <StepIndicator number={5} title="超算提交脚本">
                  <p className="mb-3">
                    本案例包含 18160 个原子、长程静电和复杂力场，推荐在超算上运行。
                    以下是实际使用的 Slurm 提交脚本：
                  </p>
                  <CodeBlock title="JOB" language="bash" code={`#!/bin/bash

#SBATCH --job-name=nvt
#SBATCH -p CLUSTER
#SBATCH --output=%j.out
#SBATCH -N 1
#SBATCH --ntasks-per-node=48
#SBATCH -t 1000:00:00

source /home/fwtop/.bashrc
module purge
module load intel/2019b

ulimit -s unlimited
ulimit -l unlimited

mpirun lmp_intel_cpu_intelmpi -i in.nvt`} />
                  <WarningBox type="warning" title="提交前必须修改">
                    脚本中的 <IC>-p CLUSTER</IC>（队列名）、<IC>source</IC> 路径、<IC>module load</IC> 版本、
                    <IC>lmp_intel_cpu_intelmpi</IC>（可执行文件名）都需要根据你所在超算的实际环境修改。
                  </WarningBox>
                </StepIndicator>

                <StepIndicator number={6} title="平衡验证：检查输出日志">
                  <p className="mb-3">
                    运行结束后，检查 <IC>log.lammps</IC> 或 <IC>.out</IC> 文件中的热力学输出，确认体系已达到平衡：
                  </p>
                  <ul className="space-y-2 mb-4">
                    {[
                      "温度（Temp）：应在 300 K 附近波动，标准差通常在 ±5 K 以内",
                      "总能量（TotEng）：应趋于稳定，不再有持续的上升或下降趋势",
                      "压力（Press）：会有较大波动（这是正常的），但均值应接近零",
                      "盒子尺寸（xlo/xhi 等）：NVT 下应保持不变（除升温阶段的 deform）",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm" style={{ color: "oklch(0.38 0.02 260)" }}>
                        <div className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ background: "oklch(0.55 0.15 195)" }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <CodeBlock title="用 Python 画能量-步数曲线" language="python" code={`import numpy as np
import matplotlib.pyplot as plt

# 从 log.lammps 中提取数据（可用 pizza.py 或手动解析）
# 这里假设已经提取出 step 和 TotEng 两列
data = np.loadtxt("thermo_data.txt", skiprows=1)
step = data[:, 0]
etotal = data[:, 1]

plt.plot(step, etotal)
plt.xlabel("Timestep")
plt.ylabel("Total Energy (kcal/mol)")
plt.title("Energy Convergence — SAM/Au/Water NVT")
plt.savefig("energy_convergence.png", dpi=150)
plt.show()`} />
                </StepIndicator>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={100}>
              <WarningBox type="tip" title="延伸">
                平衡完成后，可以基于 <IC>data.nvtfinal</IC> 继续做 NEMD 热导率计算、
                润湿性分析（接触角）、或界面热阻（Kapitza 电阻）研究。
                SAM 链长（SC6 → SC12 → SC18）对界面热输运有显著影响，是很好的参数研究课题。
              </WarningBox>
            </ScrollReveal>
          </div>
        </section>

        <div className="section-divider" />

        {/* ═══════════ 8. 常见问题与报错排查 ═══════════ */}
        <section id="troubleshooting" className="py-20 md:py-28 relative overflow-hidden">
          <MoleculeDecoration className="absolute top-20 left-0 opacity-40 hidden lg:block" variant="left" />
          <div className="container max-w-5xl relative z-10">
            <ScrollReveal>
              <SectionHeading
                id="troubleshooting-title"
                title="常见问题与报错排查"
                subtitle="整理了新手最常遇到的报错信息和解决方法，遇到问题时可以先在这里查找。"
                badge="排错指南"
              />
            </ScrollReveal>

            <ScrollReveal>
              <Accordion type="multiple" className="space-y-3">
                {[
                  {
                    title: "命令找不到：'lmp' 不是内部或外部命令",
                    content: (
                      <div>
                        <p className="mb-3">这是最常见的问题，说明系统找不到 LAMMPS 的可执行文件。</p>
                        <p className="font-semibold mb-2" style={{ color: "oklch(0.30 0.06 260)" }}>解决方法：</p>
                        <ul className="space-y-2 ml-4">
                          <li className="text-sm"><strong>Windows：</strong>检查 LAMMPS 安装目录是否已添加到系统 PATH 环境变量中。</li>
                          <li className="text-sm"><strong>macOS/Linux：</strong>确认已通过 Homebrew 或 apt 安装，或者源码编译后执行了 <IC>make install</IC>。</li>
                          <li className="text-sm"><strong>超算：</strong>确认已执行 <IC>module load lammps</IC>。</li>
                        </ul>
                        <CodeBlock title="检查 LAMMPS 是否在 PATH 中" language="bash" code={`# Linux / macOS
which lmp

# Windows PowerShell
Get-Command lmp`} />
                      </div>
                    ),
                  },
                  {
                    title: "MPI 启动失败：mpirun / mpiexec 报错",
                    content: (
                      <div>
                        <p className="mb-3">MPI 启动失败通常有以下几种原因：</p>
                        <ul className="space-y-2 ml-4">
                          <li className="text-sm"><strong>未安装 MPI：</strong>Linux 用 <IC>sudo apt install openmpi-bin</IC>，macOS 用 <IC>brew install open-mpi</IC>。</li>
                          <li className="text-sm"><strong>LAMMPS 未编译 MPI 支持：</strong>预编译的 Windows 版本通常不支持 MPI，需要使用 WSL2 路线。</li>
                          <li className="text-sm"><strong>进程数超过核心数：</strong>不要让 <IC>-np</IC> 的值超过你电脑的 CPU 核心数。</li>
                          <li className="text-sm"><strong>以 root 运行：</strong>OpenMPI 默认不允许以 root 身份运行，加 <IC>--allow-run-as-root</IC> 参数。</li>
                        </ul>
                      </div>
                    ),
                  },
                  {
                    title: "势函数文件找不到：Cannot open potential file",
                    content: (
                      <div>
                        <p className="mb-3">LAMMPS 在运行时需要读取势函数参数文件（如 EAM 势的 .eam.alloy 文件）。</p>
                        <p className="font-semibold mb-2" style={{ color: "oklch(0.30 0.06 260)" }}>解决方法：</p>
                        <ul className="space-y-2 ml-4">
                          <li className="text-sm">确认势函数文件存在于当前工作目录，或者在 <IC>pair_coeff</IC> 中使用绝对路径。</li>
                          <li className="text-sm">LAMMPS 安装目录下通常有 <IC>potentials/</IC> 文件夹，包含常用势函数文件。</li>
                          <li className="text-sm">在超算上，势函数文件需要和输入文件一起上传。</li>
                        </ul>
                        <CodeBlock title="使用绝对路径" language="lammps" code={`# 方法1：将势函数文件放在当前目录
pair_coeff * * Cu_zhou.eam.alloy Cu

# 方法2：使用绝对路径
pair_coeff * * /path/to/potentials/Cu_zhou.eam.alloy Cu`} />
                      </div>
                    ),
                  },
                  {
                    title: "Slurm 提交后任务一直排队（PD 状态）",
                    content: (
                      <div>
                        <p className="mb-3">任务一直处于 PD（Pending）状态的常见原因：</p>
                        <ul className="space-y-2 ml-4">
                          <li className="text-sm"><strong>资源不足：</strong>申请的节点数或核心数超过了队列的可用资源。尝试减少申请量。</li>
                          <li className="text-sm"><strong>队列繁忙：</strong>其他用户占用了大量资源。可以用 <IC>sinfo</IC> 查看各队列的空闲状态。</li>
                          <li className="text-sm"><strong>时间限制：</strong>申请的运行时间超过了队列的最大允许时间。</li>
                          <li className="text-sm"><strong>账户余额不足：</strong>部分超算中心按机时收费，余额不足时无法提交。</li>
                        </ul>
                        <CodeBlock title="排查命令" language="bash" code={`# 查看任务排队原因
squeue -u $USER -o "%.18i %.9P %.8j %.8u %.2t %.10M %.6D %R"

# 查看队列空闲状态
sinfo -p compute

# 查看账户余额（不同超算命令不同）
sacctmgr show assoc user=$USER`} />
                      </div>
                    ),
                  },
                  {
                    title: "输出日志为空",
                    content: (
                      <div>
                        <p className="mb-3">提交任务后发现输出文件为空或不存在：</p>
                        <ul className="space-y-2 ml-4">
                          <li className="text-sm"><strong>工作目录错误：</strong>确认 sbatch 脚本中有 <IC>cd $SLURM_SUBMIT_DIR</IC>。</li>
                          <li className="text-sm"><strong>输入文件路径错误：</strong>检查 <IC>-in</IC> 后面的文件名是否正确。</li>
                          <li className="text-sm"><strong>任务还没开始运行：</strong>用 <IC>squeue</IC> 确认任务状态。</li>
                          <li className="text-sm"><strong>LAMMPS 启动就崩溃了：</strong>检查 <IC>.err</IC> 文件中的错误信息。</li>
                        </ul>
                      </div>
                    ),
                  },
                  {
                    title: "路径错误：中文路径 / 空格 / 特殊字符",
                    content: (
                      <div>
                        <p className="mb-3">LAMMPS 对文件路径比较敏感，以下情况容易出错：</p>
                        <ul className="space-y-2 ml-4">
                          <li className="text-sm"><strong>中文路径：</strong>避免在路径中使用中文字符。将项目放在纯英文路径下。</li>
                          <li className="text-sm"><strong>空格：</strong>路径中不要有空格。如果必须有，用引号包裹整个路径。</li>
                          <li className="text-sm"><strong>Windows 反斜杠：</strong>LAMMPS 输入文件中使用正斜杠 <IC>/</IC>，不要用反斜杠 <IC>\</IC>。</li>
                        </ul>
                        <WarningBox type="tip" title="最佳实践">
                          建议将所有模拟文件放在一个简短的英文路径下，如 <IC>~/sim/</IC> 或 <IC>C:\sim\</IC>，避免路径问题。
                        </WarningBox>
                      </div>
                    ),
                  },
                ].map((item, i) => (
                  <AccordionItem key={i} value={`trouble-${i}`} className="border border-border rounded-xl overflow-hidden px-0">
                    <AccordionTrigger className="px-5 py-4 text-sm font-semibold text-left hover:no-underline"
                      style={{ color: "oklch(0.25 0.06 260)" }}>
                      {item.title}
                    </AccordionTrigger>
                    <AccordionContent className="px-5 pb-5 text-sm leading-relaxed"
                      style={{ color: "oklch(0.40 0.02 260)" }}>
                      {item.content}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </ScrollReveal>
          </div>
        </section>

        <div className="section-divider" />

        {/* ═══════════ 9. 学习路线图 ═══════════ */}
        <section id="roadmap" className="py-20 md:py-28 relative" style={{ background: "oklch(0.975 0.003 200 / 0.5)" }}>
          <div className="container max-w-5xl relative z-10">
            <ScrollReveal>
              <SectionHeading
                id="roadmap-title"
                title="学习路线图"
                subtitle="从零开始，按照以下路线一步步进阶，最终掌握在超算上运行大规模分子动力学模拟的能力。"
                badge="进阶路线"
              />
            </ScrollReveal>

            <ScrollReveal>
              <div className="rounded-2xl overflow-hidden shadow-md mb-12 hover:shadow-lg transition-shadow duration-300">
                <img src={ROADMAP_IMG} alt="学习路线图" className="w-full h-auto" />
              </div>
            </ScrollReveal>

            {/* Roadmap with connecting lines */}
            <ScrollReveal>
              <div className="relative">
                {/* Connecting line (desktop) */}
                <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-[2px] -translate-y-1/2 z-0"
                  style={{ background: "linear-gradient(90deg, oklch(0.35 0.10 260), oklch(0.45 0.12 230), oklch(0.50 0.14 200), oklch(0.55 0.15 195), oklch(0.60 0.15 180))" }} />

                <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 relative z-10">
                  {[
                    { step: 1, icon: Download, title: "安装 LAMMPS", desc: "选择适合你平台的安装方式，确保 lmp 命令可用。", color: "oklch(0.35 0.10 260)" },
                    { step: 2, icon: Play, title: "跑通第一个示例", desc: "用最小 LJ 液体示例验证安装，理解输入输出。", color: "oklch(0.45 0.12 230)" },
                    { step: 3, icon: BookOpen, title: "读懂输入脚本", desc: "理解 units、pair_style、fix 等核心命令的含义。", color: "oklch(0.50 0.14 200)" },
                    { step: 4, icon: Cpu, title: "并行运行", desc: "学会用 MPI 多核并行，提升计算效率。", color: "oklch(0.55 0.15 195)" },
                    { step: 5, icon: Server, title: "上超算", desc: "掌握 Slurm 提交任务，处理大规模模拟。", color: "oklch(0.60 0.15 180)" },
                  ].map((item, i) => (
                    <div key={i} className="bg-card rounded-xl border border-border p-5 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-2 text-center">
                      <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 shadow-md"
                        style={{ background: `linear-gradient(135deg, ${item.color}, oklch(0.50 0.10 200))`, color: "white" }}>
                        <item.icon size={24} />
                      </div>
                      <div className="text-xs font-bold mb-1 tracking-wide uppercase" style={{ color: item.color }}>
                        Step {item.step}
                      </div>
                      <h4 className="font-bold text-sm mb-2" style={{ color: "oklch(0.25 0.06 260)" }}>{item.title}</h4>
                      <p className="text-xs leading-relaxed" style={{ color: "oklch(0.48 0.02 260)" }}>{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={100}>
              <div className="mt-10">
                <WarningBox type="tip" title="学习建议">
                  不要试图一次学完所有内容。建议按照路线图的顺序，每完成一步都实际动手操作一遍。遇到问题先查看本站的"常见问题排查"章节，然后再搜索 LAMMPS 官方文档或邮件列表。
                </WarningBox>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <div className="section-divider" />

        {/* ═══════════ 10. FAQ 区 ═══════════ */}
        <section id="faq" className="py-20 md:py-28 relative overflow-hidden">
          <MoleculeDecoration className="absolute bottom-0 right-0 opacity-30 hidden lg:block" variant="right" />
          <div className="container max-w-3xl relative z-10">
            <ScrollReveal>
              <SectionHeading
                id="faq-title"
                title="常见问题 FAQ"
                subtitle="汇总了新手最常问的问题，支持关键词搜索。"
                badge="FAQ"
              />
            </ScrollReveal>

            <ScrollReveal>
              <FAQSection />
            </ScrollReveal>
          </div>
        </section>

        {/* ═══════════ Footer ═══════════ */}
        <footer className="border-t border-border py-14" style={{ background: "oklch(0.16 0.04 260)" }}>
          <div className="container max-w-5xl">
            {/* Lab branding block */}
            <div className="flex flex-col sm:flex-row items-center gap-6 mb-10 pb-8 border-b" style={{ borderColor: "oklch(1 0 0 / 0.08)" }}>
              <a
                href="https://www.whu-atmes.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 group shrink-0"
              >
                <div className="flex items-center justify-center w-14 h-14 rounded-xl"
                  style={{ background: "oklch(1 0 0 / 0.06)", border: "1px solid oklch(1 0 0 / 0.10)" }}>
                  <GraduationCap size={28} style={{ color: "oklch(0.65 0.15 195)" }} />
                </div>
                <div>
                  <div className="font-bold text-base group-hover:underline" style={{ color: "oklch(0.90 0.02 200)" }}>
                    先进热管理及储能技术实验室
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: "oklch(0.55 0.02 200)" }}>
                    ATMES Lab · 武汉大学动力与机械学院
                  </div>
                </div>
              </a>
              <div className="hidden sm:block w-px h-10 mx-2" style={{ background: "oklch(1 0 0 / 0.10)" }} />
              <p className="text-sm leading-relaxed text-center sm:text-left" style={{ color: "oklch(0.55 0.02 200)" }}>
                零基础 LAMMPS 分子动力学模拟入门指南，覆盖 Windows、macOS 和 Linux 三大平台。
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-8 mb-10">
              {/* Quick links */}
              <div>
                <h4 className="font-bold text-sm mb-3" style={{ color: "oklch(0.85 0.02 200)" }}>快速导航</h4>
                <ul className="space-y-2">
                  {[
                    { label: "Windows 安装", id: "windows-install" },
                    { label: "macOS 安装", id: "macos-install" },
                    { label: "超算教程", id: "hpc-guide" },
                    { label: "输入文件详解", id: "input-file" },
                    { label: "常见问题", id: "troubleshooting" },
                  ].map((link) => (
                    <li key={link.id}>
                      <button
                        onClick={() => document.getElementById(link.id)?.scrollIntoView({ behavior: "smooth" })}
                        className="text-sm hover:underline transition-colors"
                        style={{ color: "oklch(0.55 0.02 200)" }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "oklch(0.75 0.12 195)")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "oklch(0.55 0.02 200)")}
                      >
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Resources */}
              <div>
                <h4 className="font-bold text-sm mb-3" style={{ color: "oklch(0.85 0.02 200)" }}>外部资源</h4>
                <ul className="space-y-2">
                  {[
                    { label: "LAMMPS 官方文档", url: "https://docs.lammps.org/" },
                    { label: "LAMMPS GitHub", url: "https://github.com/lammps/lammps" },
                    { label: "OVITO 可视化", url: "https://www.ovito.org/" },
                    { label: "LAMMPS 邮件列表", url: "https://www.lammps.org/mail.html" },
                  ].map((link) => (
                    <li key={link.url}>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm flex items-center gap-1.5 hover:underline transition-colors"
                        style={{ color: "oklch(0.55 0.02 200)" }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "oklch(0.75 0.12 195)")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "oklch(0.55 0.02 200)")}
                      >
                        <ExternalLink size={12} />
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="border-t pt-6" style={{ borderColor: "oklch(1 0 0 / 0.08)" }}>
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                <div className="text-center sm:text-left">
                  <p className="text-xs" style={{ color: "oklch(0.45 0.02 200)" }}>
                    © {new Date().getFullYear()} 武汉大学 先进热管理及储能技术实验室 (ATMES Lab) · 黄德钊 · All rights reserved
                  </p>
                  <p className="text-xs mt-1" style={{ color: "oklch(0.38 0.02 200)" }}>
                    LAMMPS 是 Sandia National Laboratories 的开源项目 · 本站内容仅供学习参考
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <a href="https://www.whu-atmes.com/" target="_blank" rel="noopener noreferrer"
                    className="transition-colors" style={{ color: "oklch(0.45 0.02 200)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "oklch(0.75 0.12 195)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "oklch(0.45 0.02 200)")}
                    title="实验室官网">
                    <Globe size={16} />
                  </a>
                  <a href="https://github.com/lammps/lammps" target="_blank" rel="noopener noreferrer"
                    className="transition-colors" style={{ color: "oklch(0.45 0.02 200)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "oklch(0.75 0.12 195)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "oklch(0.45 0.02 200)")}>
                    <Github size={16} />
                  </a>
                  <a href="https://www.lammps.org/mail.html" target="_blank" rel="noopener noreferrer"
                    className="transition-colors" style={{ color: "oklch(0.45 0.02 200)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "oklch(0.75 0.12 195)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "oklch(0.45 0.02 200)")}>
                    <Mail size={16} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </main>

      {/* Float animation keyframes */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); opacity: 0.3; }
          100% { transform: translateY(-12px); opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}
