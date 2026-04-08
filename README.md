# LAMMPS 入门教学

> **零基础分子动力学模拟上手指南**
>
> 从安装配置到超算提交，覆盖 Windows、macOS 和 Linux 三大平台，帮助课题组同学跨过分子动力学模拟的第一道坎。

**在线访问：[www.whu-atmes.com/tutorial](https://www.whu-atmes.com/tutorial)**

---

## 内容概览

| 章节 | 内容 |
|------|------|
| 为什么学 LAMMPS | 分子动力学简介、能源与动力领域典型应用 |
| Windows 安装 | 预编译安装包（下载即用） / WSL2 路线（完整 Linux 环境） |
| macOS 安装 | Homebrew 一键安装 / 源码编译 |
| 超算 / 集群 | Slurm 概念、sbatch 脚本模板、完整提交流程 |
| 第一份输入文件 | LJ 液体逐行注释，关键命令详解 |
| 本地与并行运行 | 串行 / MPI / Slurm 三种运行方式对比 |
| **案例 01** | LJ 液体热导率 — NEMD / Green-Kubo 方法 `入门` |
| **案例 02** | SPC/E 液态水 — NPT 平衡、RDF、扩散系数 `入门` |
| **案例 03** | 纳米通道水流动 — Poiseuille 流、滑移长度 `进阶` |
| **案例 04** | 固-液界面热阻 — Kapitza 电阻、EAM 势 `进阶` |
| **案例 05** | SAM-Au-水界面 NVT 平衡 — 真实科研案例 `科研级` |
| 常见问题排查 | 6 类常见报错 + 解决方法（按安装/运行/超算分类） |
| 学习路线图 | 5 步进阶路线 |
| FAQ | 8 个常见问题，支持搜索 |

## 技术栈

- **框架**：React 19 + TypeScript + Vite 7
- **样式**：Tailwind CSS 4 + oklch 色彩系统
- **UI 组件**：Radix UI (Accordion, Tabs, Tooltip 等)
- **字体**：Noto Serif SC（标题） + Noto Sans SC（正文） + JetBrains Mono（代码）
- **部署**：阿里云 OSS（香港） + Cloudflare CDN
- **包管理**：pnpm

## 本地开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm exec vite --host

# 构建（本地预览用，base path 为 /）
pnpm exec vite build
```

## 部署到线上

详见 [CLAUDE.md](./CLAUDE.md) 中的完整部署文档。简要流程：

```bash
# 1. 构建（base path 设为 /tutorial/）
VITE_BASE_PATH=/tutorial/ pnpm exec vite build

# 2. 上传到 OSS
ossutil cp dist/public/ oss://whu-atmes-hk/tutorial/ --recursive --force

# 3. 修复 /tutorial 入口的 Content-Type
ossutil api put-object --bucket whu-atmes-hk --key tutorial \
  --content-type "text/html; charset=utf-8" --body "file://dist/public/index.html"
```

## 项目结构

```
client/
  src/
    pages/Home.tsx            ← 主页面（所有章节内容）
    components/
      Sidebar.tsx             ← 左侧导航栏（深色主题、案例编号）
      CodeBlock.tsx           ← 终端风格代码块
      AnnotatedCode.tsx       ← 逐行注释代码块（悬停显示注释）
      SectionHeading.tsx      ← 章节标题（badge + 阅读时间）
      StepIndicator.tsx       ← 步骤指示器（编号 + 连接线）
      InfoCard.tsx            ← 信息卡片（优点/局限双栏）
      WarningBox.tsx          ← 提示/警告/注意框
      ScrollReveal.tsx        ← 滚动渐入动画
      ReadingProgress.tsx     ← 顶部阅读进度条
      BackToTop.tsx           ← 回到顶部按钮
    index.css                 ← 全局样式、动画、自定义滚动条
  index.html                  ← HTML 入口
vite.config.ts                ← Vite 配置
CLAUDE.md                     ← 部署与运维文档
```

## 贡献

欢迎提交 Issue 或 Pull Request 来改进教程内容。如果你发现：

- 某个概念解释不够清楚
- 代码示例有错误
- 想增加新的案例

请直接在 [Issues](https://github.com/dezhaohuang/lammps-tutorial/issues) 中提出。

## 关于

本站由 [武汉大学 先进热管理及储能技术实验室（ATMES Lab）](https://www.whu-atmes.com/) 维护，作者黄德钊。

LAMMPS 是 [Sandia National Laboratories](https://www.lammps.org/) 的开源项目，本站内容仅供学习参考。
