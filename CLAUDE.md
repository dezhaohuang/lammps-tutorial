# 课题组教程中心网站 — 运行文档

> 线上地址：https://www.whu-atmes.com/tutorial （教程中心落地页）
> ├─ https://www.whu-atmes.com/tutorial/lammps — LAMMPS 教程（SPA 路由）
> └─ https://www.whu-atmes.com/tutorial/heat-balance.html — 汽轮机热平衡图互动教程（独立静态页）
> 架构：Vite + React SPA（hub + LAMMPS）+ 独立单文件 HTML（热平衡图） → 阿里云 OSS（香港） → Cloudflare CDN
> GitHub：https://github.com/dezhaohuang/lammps-tutorial
> 热平衡图教程源文件在 `D:/Dropbox/01-Research/应用-透平传热传质/学习/热平衡图互动教程.html`，
> 更新后复制为 `client/public/heat-balance.html`（配图 `client/public/pages/p06-100tmcr.jpg`）再走部署流程。

---

## 一、日常更新流程（改完代码后执行）

### 推荐：一键部署脚本

```powershell
$env:OSS_AK = "<AK 见主站 DEPLOYMENT.md>"
$env:OSS_SK = "<SK 见主站 DEPLOYMENT.md>"
pnpm deploy      # = pwsh scripts/deploy.ps1
```

脚本完成：构建（base=/tutorial/）→ 404.html 复制 → ossutil 上传（自动跳过 downloads/ 的 221MB 大文件）→ 两个无扩展名对象的 Content-Type 修复 → Cloudflare 清缓存（需另设 `$env:CF_API_TOKEN` + `$env:CF_ZONE_ID`，否则打印手动清单）→ 线上 HEAD 验证。

以下手动步骤仅作备份参考。注意 `pnpm run build` 现在就是纯 `vite build`（旧的 esbuild server 步骤已移除，`pnpm start` 随之弃用——本站是纯静态部署，从未用到那个 server bundle）。

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
"$HOME/tools/ossutil2/ossutil.exe" cp dist/public/ oss://whu-atmes-hk/tutorial/ \
  --recursive --force --region cn-hongkong --exclude "downloads/*"
```

> `--exclude "downloads/*"`：`client/public/downloads/` 里 221MB 的安装包和案例文件线上已有且从不变动，重复上传纯属浪费。首次部署或 downloads 内容变动时去掉此参数补传一次。

### 第 3 步：修复无扩展名入口对象的 Content-Type（两个）

```bash
MSYS_NO_PATHCONV=1 \
OSS_ACCESS_KEY_ID=$OSS_AK \
OSS_ACCESS_KEY_SECRET=$OSS_SK \
"$HOME/tools/ossutil2/ossutil.exe" api put-object \
  --bucket whu-atmes-hk --key tutorial --region cn-hongkong \
  --content-type "text/html; charset=utf-8" \
  --body "file://dist/public/index.html"

MSYS_NO_PATHCONV=1 \
OSS_ACCESS_KEY_ID=$OSS_AK \
OSS_ACCESS_KEY_SECRET=$OSS_SK \
"$HOME/tools/ossutil2/ossutil.exe" api put-object \
  --bucket whu-atmes-hk --key tutorial/lammps --region cn-hongkong \
  --content-type "text/html; charset=utf-8" \
  --body "file://dist/public/index.html"
```

> **为什么需要这一步？** OSS 的 `cp` 命令上传没有扩展名的对象（`tutorial`、`tutorial/lammps`）时，会把 Content-Type 设为 `application/octet-stream`，导致浏览器下载文件而不是显示网页。这一步用 API 单独上传并显式指定 `text/html`。`tutorial/lammps` 对象让用户直接访问 /tutorial/lammps 时不依赖 404 回退。
> `heat-balance.html` 带 `.html` 扩展名，`cp` 会自动设对 Content-Type，无需处理。

### 第 4 步：Cloudflare 缓存清除（Purge by URL）

Cloudflare 控制台 → whu-atmes.com → Caching → Custom Purge，逐条输入：

```
https://www.whu-atmes.com/tutorial
https://www.whu-atmes.com/tutorial/lammps
https://www.whu-atmes.com/tutorial/index.html
https://www.whu-atmes.com/tutorial/404.html
https://www.whu-atmes.com/tutorial/heat-balance.html
```

> `assets/` 下的 JS/CSS 文件名含内容哈希，天然免缓存问题，无需 purge。

### 第 5 步：Git 提交（可选但推荐）

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
"$HOME/tools/ossutil2/ossutil.exe" cp dist/public/ oss://whu-atmes-hk/tutorial/ \
  --recursive --force --region cn-hongkong --exclude "downloads/*" && \
MSYS_NO_PATHCONV=1 \
OSS_ACCESS_KEY_ID=$OSS_AK \
OSS_ACCESS_KEY_SECRET=$OSS_SK \
"$HOME/tools/ossutil2/ossutil.exe" api put-object \
  --bucket whu-atmes-hk --key tutorial --region cn-hongkong \
  --content-type "text/html; charset=utf-8" \
  --body "file://dist/public/index.html" && \
MSYS_NO_PATHCONV=1 \
OSS_ACCESS_KEY_ID=$OSS_AK \
OSS_ACCESS_KEY_SECRET=$OSS_SK \
"$HOME/tools/ossutil2/ossutil.exe" api put-object \
  --bucket whu-atmes-hk --key tutorial/lammps --region cn-hongkong \
  --content-type "text/html; charset=utf-8" \
  --body "file://dist/public/index.html"
```

最后按第 4 步在 Cloudflare 控制台 purge 五个 URL。

---

## 二、部署后验证

部署完成后，通过以下方式确认：

```bash
# 确认 Content-Type 正确（三个入口都应为 text/html）
curl -sI "https://www.whu-atmes.com/tutorial" | grep -i Content-Type
curl -sI "https://www.whu-atmes.com/tutorial/lammps" | grep -i Content-Type
curl -sI "https://www.whu-atmes.com/tutorial/heat-balance.html" | grep -i Content-Type

# 确认引用的 JS 文件名与本地一致
curl -s "https://www.whu-atmes.com/tutorial" | grep -o 'index-[^"]*\.js' | head -1
ls dist/public/assets/*.js

# 确认热平衡图教程的配图可达（应为 200）
curl -sI "https://www.whu-atmes.com/tutorial/pages/p06-100tmcr.jpg" | head -1
```

如果浏览器仍显示旧版：
- 电脑：Ctrl+Shift+R 强制刷新
- 手机：在 URL 后加 `?v=时间戳` 绕过缓存，例如 `https://www.whu-atmes.com/tutorial?v=20260403`
- 彻底清除：Cloudflare 控制台 → Caching → Purge Everything

---

## 三、项目结构

### 路由结构（App.tsx，wouter，base 取自 import.meta.env.BASE_URL）

| 路由 | 页面 | 说明 |
|------|------|------|
| `/` | TutorialHub.tsx | 教程中心落地页（两张教程卡片） |
| `/index.html` | TutorialHub.tsx | 兼容"始终可用"的 /tutorial/index.html |
| `/lammps` | Home.tsx | LAMMPS 教程全文 |
| 其他 | NotFound.tsx | 兜底 |

旧版深链接 `/tutorial#章节id` 到达 hub 时会自动重定向到 `/lammps#章节id`（TutorialHub 里的 useLayoutEffect，白名单来自 Sidebar 导出的 `sections`）。

```
lammps-tutorial/
├── scripts/deploy.ps1            ← 一键部署脚本（pnpm deploy）
├── client/
│   ├── index.html                ← HTML 入口（含 SEO/OG 元信息、非阻塞字体加载）
│   ├── public/
│   │   ├── favicon.svg           ← 站点图标
│   │   ├── images/               ← 自托管配图（LAMMPS 页 5 张 webp + og-hub.png 分享图）
│   │   ├── heat-balance.html     ← 汽轮机热平衡图互动教程（独立单文件，源在 Dropbox 学习文件夹）
│   │   └── pages/                ← 热平衡图配图 p06-100tmcr.jpg + og-heat-balance.png 分享图
│   └── src/
│       ├── lib/siteStats.ts      ← 访客统计（App 层触发，整页只计一次）
│       ├── pages/
│       │   ├── TutorialHub.tsx   ← 教程中心落地页
│       │   └── Home.tsx          ← LAMMPS 主页面（React.lazy 懒加载，约 2800 行）
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

### 为什么需要 tutorial/lammps 无扩展名对象

`/tutorial/lammps` 是 SPA 路由，OSS 上本没有这个对象。直接访问（刷新、分享链接）时若依赖 404.html 回退，经 Cloudflare 可能不稳定。因此部署第 3 步同时 put 一个 `tutorial/lammps` 对象（index.html 的拷贝，Content-Type text/html），让直接访问必定命中。若未来新增 SPA 路由，需照此为每个路由 put 一个对象。

### 热平衡图教程为什么不进 SPA

`heat-balance.html` 是完全自包含的手写单文件应用（零依赖、内联全部 CSS/JS），作为 `client/public/` 静态文件原样拷贝进 `dist/public/`，构建零成本、互不影响。它引用相对路径 `pages/p06-100tmcr.jpg`，部署后解析为 `/tutorial/pages/p06-100tmcr.jpg`。hub 卡片用普通 `<a>` 指向 `${import.meta.env.BASE_URL}heat-balance.html` 以绕过 SPA 路由。

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
| 线上地址 | https://www.whu-atmes.com/tutorial （hub）/ /tutorial/lammps / /tutorial/heat-balance.html |
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
| ossutil (Windows) | `~/tools/ossutil2/ossutil.exe`（持久位置；/tmp 会被系统清理，勿放那里） |
| ossutil (macOS) | `~/tools/ossutil2/ossutil` |
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
# 解压到 ~/tools/ossutil2/（持久位置；不要放 /tmp，系统清理后会丢失）
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
| 访问 /tutorial/lammps 下载文件或 404 | 无扩展名对象缺失/Content-Type 错误 | 执行部署第 3 步的 `tutorial/lammps` put-object |
| 热平衡图教程原图加载失败 | `pages/p06-100tmcr.jpg` 未上传 | 确认 `client/public/pages/` 里有该图后重新构建上传 |
