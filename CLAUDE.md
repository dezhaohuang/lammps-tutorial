# LAMMPS 教学网站 — 运行文档

> 线上地址：https://www.whu-atmes.com/tutorial
> 架构：Vite + React SPA → 阿里云 OSS（香港） → Cloudflare CDN
> GitHub：https://github.com/dezhaohuang/lammps-tutorial

---

## 一、日常更新流程（改完代码后执行）

### 第 1 步：构建

```bash
cd "D:/Dropbox/03-Code/2026-课题组研究上手教程网站/lammps-tutorial"
rm -rf dist/public 2>/dev/null
MSYS_NO_PATHCONV=1 VITE_BASE_PATH=/tutorial/ pnpm exec vite build
cp dist/public/index.html dist/public/404.html
```

> 如果报错找不到模块，先运行 `pnpm install`。

### 第 2 步：上传到 OSS

> **OSS 凭证**：`$OSS_AK` 和 `$OSS_SK` 的实际值见 `D:/Dropbox/03-Code/2026-website/atmes-lab-website/DEPLOYMENT.md`。
> 使用 Claude 时可以直接说"参考主站 DEPLOYMENT.md 里的凭证"。

```bash
MSYS_NO_PATHCONV=1 \
OSS_ACCESS_KEY_ID=$OSS_AK \
OSS_ACCESS_KEY_SECRET=$OSS_SK \
/tmp/ossutil2/ossutil-2.2.1-windows-amd64/ossutil.exe cp dist/public/ oss://whu-atmes-hk/tutorial/ \
  --recursive --force --region cn-hongkong
```

### 第 3 步：修复 /tutorial 入口的 Content-Type

```bash
MSYS_NO_PATHCONV=1 \
OSS_ACCESS_KEY_ID=$OSS_AK \
OSS_ACCESS_KEY_SECRET=$OSS_SK \
/tmp/ossutil2/ossutil-2.2.1-windows-amd64/ossutil.exe api put-object \
  --bucket whu-atmes-hk --key tutorial --region cn-hongkong \
  --content-type "text/html; charset=utf-8" \
  --body "file://dist/public/index.html"
```

> **为什么需要这一步？** OSS 的 `cp` 命令上传没有扩展名的对象（`tutorial`）时，会把 Content-Type 设为 `application/octet-stream`，导致浏览器下载文件而不是显示网页。这一步用 API 单独上传并显式指定 `text/html`。

### 第 4 步：Git 提交（可选但推荐）

```bash
git add -A
git commit -m "描述你的修改"
git push origin main
```

### 一键合并命令（复制即用）

```bash
cd "D:/Dropbox/03-Code/2026-课题组研究上手教程网站/lammps-tutorial" && \
rm -rf dist/public 2>/dev/null; \
MSYS_NO_PATHCONV=1 VITE_BASE_PATH=/tutorial/ pnpm exec vite build && \
cp dist/public/index.html dist/public/404.html && \
MSYS_NO_PATHCONV=1 \
OSS_ACCESS_KEY_ID=$OSS_AK \
OSS_ACCESS_KEY_SECRET=$OSS_SK \
/tmp/ossutil2/ossutil-2.2.1-windows-amd64/ossutil.exe cp dist/public/ oss://whu-atmes-hk/tutorial/ \
  --recursive --force --region cn-hongkong && \
MSYS_NO_PATHCONV=1 \
OSS_ACCESS_KEY_ID=$OSS_AK \
OSS_ACCESS_KEY_SECRET=$OSS_SK \
/tmp/ossutil2/ossutil-2.2.1-windows-amd64/ossutil.exe api put-object \
  --bucket whu-atmes-hk --key tutorial --region cn-hongkong \
  --content-type "text/html; charset=utf-8" \
  --body "file://dist/public/index.html"
```

---

## 二、部署后验证

部署完成后，通过以下方式确认：

```bash
# 确认 Content-Type 正确（应为 text/html）
curl -sI "https://www.whu-atmes.com/tutorial" | grep Content-Type

# 确认引用的 JS 文件名与本地一致
curl -s "https://www.whu-atmes.com/tutorial" | grep -o 'index-[^"]*\.js' | head -1
ls dist/public/assets/*.js
```

如果浏览器仍显示旧版：
- 电脑：Ctrl+Shift+R 强制刷新
- 手机：在 URL 后加 `?v=时间戳` 绕过缓存，例如 `https://www.whu-atmes.com/tutorial?v=20260403`
- 彻底清除：Cloudflare 控制台 → Caching → Purge Everything

---

## 三、项目结构

```
lammps-tutorial/
├── client/
│   ├── index.html                ← HTML 入口
│   └── src/
│       ├── pages/
│       │   └── Home.tsx          ← 主页面（所有章节内容，约 2500 行）
│       ├── components/
│       │   ├── Sidebar.tsx       ← 左侧导航栏（章节目录 + 案例序号）
│       │   ├── CodeBlock.tsx     ← 终端代码块（含 LAMMPS/Bash/Python 语法高亮）
│       │   ├── AnnotatedCode.tsx ← 逐行注释代码块（鼠标悬停显示注释）
│       │   ├── SectionHeading.tsx← 章节标题（badge + 渐变下划线）
│       │   ├── StepIndicator.tsx ← 步骤指示器（编号 + 连接线）
│       │   ├── InfoCard.tsx      ← 信息卡片（优点/局限双栏布局）
│       │   ├── WarningBox.tsx    ← 提示/警告/注意框
│       │   ├── ScrollReveal.tsx  ← 滚动渐入动画
│       │   ├── ReadingProgress.tsx ← 顶部阅读进度条
│       │   ├── BackToTop.tsx     ← 回到顶部按钮
│       │   └── MoleculeDecoration.tsx ← 分子轨迹装饰 SVG
│       └── index.css             ← 全局样式、动画、语法高亮色
├── vite.config.ts                ← Vite 配置（base path 由 VITE_BASE_PATH 控制）
├── package.json                  ← 依赖管理（pnpm）
├── .github/workflows/            ← GitHub Actions 自动部署到 GitHub Pages（备用）
└── CLAUDE.md                     ← 本文件
```

### 页面章节结构（Home.tsx）

| 序号 | Section ID | 内容 |
|------|-----------|------|
| 1 | hero | 首屏：标题、实验室信息、CTA 按钮 |
| 2 | why-lammps | 为什么学 LAMMPS：应用场景、三张卡片 |
| 3 | windows-install | Windows 安装：预编译包 / WSL2 两条路线 |
| 4 | macos-install | macOS 安装：Homebrew / 源码编译 |
| 5 | hpc-guide | 超算/集群：Slurm 概念、sbatch 脚本、完整流程 |
| 6 | input-file | 第一份输入文件：LJ 液体逐行注释 |
| 7 | parallel-run | 本地与并行运行：串行/MPI/Slurm 对比 |
| 8 | case-lj-thermal | 案例 01：LJ 液体热导率（NEMD / Green-Kubo） |
| 9 | case-spce-water | 案例 02：SPC/E 液态水（NPT 平衡、RDF、扩散系数） |
| 10 | case-nano-channel | 案例 03：纳米通道水流动（Poiseuille 流、滑移长度） |
| 11 | case-interface-resistance | 案例 04：固-液界面热阻（Kapitza 电阻） |
| 12 | case-sam-gold | 案例 05：SAM-Au-水界面 NVT 平衡（真实科研案例） |
| 13 | troubleshooting | 常见问题排查：6 类报错 + 解决方法 |
| 14 | roadmap | 学习路线图：5 步进阶 |
| 15 | faq | FAQ：8 个问题，支持搜索 |

---

## 四、关键技术细节

### 为什么 URL 是 /tutorial 而不是 /tutorial/

- `/tutorial`（无斜杠）：对应 OSS 对象 key `tutorial`，Content-Type 必须手动设为 `text/html`（部署第 3 步）
- `/tutorial/`（有斜杠）：OSS 子目录默认不返回 index.html，已开启 `SupportSubDir` 但 Cloudflare 代理层可能仍返回 404
- `/tutorial/index.html`：始终可用
- 结论：**对外链接统一使用 `https://www.whu-atmes.com/tutorial`**（无斜杠）

### MSYS_NO_PATHCONV=1

Git Bash（MSYS2）在 Windows 上会自动把 `/tutorial/` 转换成 `C:/Program Files/Git/tutorial/`。加这个环境变量禁用路径转换。在 CMD 或 PowerShell 中不需要。

### Base Path

- `VITE_BASE_PATH=/tutorial/` → Vite 构建时设置 `base: "/tutorial/"`
- 所有 JS/CSS/图片引用会变成 `/tutorial/assets/...`
- 不设置此变量时默认为 `/`（本地开发用）

### 与主站的关系

- 主站 `whu-atmes.com` 和教程 `whu-atmes.com/tutorial` 共用同一个 OSS Bucket（`whu-atmes-hk`）
- 主站文件在 Bucket 根路径，教程文件在 `tutorial/` 前缀下
- 两者互不影响，可以独立部署
- 主站部署文档：`D:/Dropbox/03-Code/2026-website/atmes-lab-website/DEPLOYMENT.md`

---

## 五、关键信息速查

| 项目 | 值 |
|------|------|
| 线上地址 | https://www.whu-atmes.com/tutorial |
| GitHub 仓库 | https://github.com/dezhaohuang/lammps-tutorial |
| OSS Bucket | whu-atmes-hk |
| OSS 地域 | cn-hongkong |
| OSS 路径 | oss://whu-atmes-hk/tutorial/ |
| OSS AccessKey ID | 见主站 DEPLOYMENT.md |
| CDN | Cloudflare Free 计划（与主站共用） |
| 构建工具 | Vite 7.x + pnpm |
| Node.js | v20+（GitHub Actions） / v24（本地） |
| 构建输出 | dist/public/ |
| Base Path | VITE_BASE_PATH=/tutorial/ |
| ossutil (Windows) | /tmp/ossutil2/ossutil-2.2.1-windows-amd64/ossutil.exe |
| ossutil (macOS) | /tmp/ossutil2/ossutil-2.2.1-mac-arm64/ossutil |
| Git 用户 | Dezhao Huang <dhuang2@whu.edu.cn> |

---

## 六、换电脑 / 首次使用

```bash
# 1. 克隆仓库（如果不是从 Dropbox 同步）
git clone https://github.com/dezhaohuang/lammps-tutorial.git

# 2. 安装依赖
cd lammps-tutorial
pnpm install

# 3. 本地开发
pnpm exec vite --host

# 4. 配置 Git（仅首次）
git config user.email "dhuang2@whu.edu.cn"
git config user.name "Dezhao Huang"

# 5. 确保 ossutil 可用
# Windows: 下载 https://gosspublic.alicdn.com/ossutil/v2/2.2.1/ossutil-2.2.1-windows-amd64.zip
# macOS:   下载 https://gosspublic.alicdn.com/ossutil/v2/2.2.1/ossutil-2.2.1-mac-arm64.zip
# 解压到 /tmp/ossutil2/ 目录
```

---

## 七、常见问题

| 问题 | 原因 | 解决 |
|------|------|------|
| 浏览器访问 /tutorial 下载文件 | Content-Type 为 octet-stream | 执行部署第 3 步（api put-object） |
| 手机看到旧版本 | 浏览器/CDN 缓存 | URL 末尾加 `?v=时间戳` |
| `pnpm exec vite build` 报错 | 依赖未安装 | `pnpm install` |
| Git Bash 路径被转换 | MSYS2 自动转换 | 命令前加 `MSYS_NO_PATHCONV=1` |
| push 被 GitHub 拒绝（secret） | 提交中含 OSS 密钥 | 不要在 Git 跟踪的文件中写明文密钥 |
| `/tutorial/` 返回 404 | OSS 子目录限制 | 对外链接用 `/tutorial`（无斜杠） |
