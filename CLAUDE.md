# LAMMPS 教学网站 — 快速操作指南

> 域名：whu-atmes.com/tutorial | 架构：Vite + React SPA → 阿里云 OSS（香港） → Cloudflare CDN
> 主站仓库：`D:/Dropbox/03-Code/2026-website/atmes-lab-website`（同一 OSS Bucket，根路径）

---

## 一键构建 + 部署

每次修改代码后，运行以下命令即可上线：

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

> **OSS 凭证**：`OSS_AK` 和 `OSS_SK` 的实际值见主站部署文档 `D:/Dropbox/03-Code/2026-website/atmes-lab-website/DEPLOYMENT.md`，或在 Claude 对话中直接引用该文件。
>
> **最后一步 `api put-object`**：OSS 的 `cp` 命令上传无扩展名对象时会设成 `application/octet-stream`，导致浏览器下载而不是显示网页。必须用 `api put-object --content-type "text/html"` 单独上传 `/tutorial` 对象。

> **Windows 注意**：必须加 `MSYS_NO_PATHCONV=1`，否则 Git Bash 会把 `/tutorial/` 转换成 Windows 路径。
> 如果构建报错找不到模块，先运行 `pnpm install`。
> 部署后通常几分钟 Cloudflare CDN 缓存自动更新，如需立即生效可 Ctrl+Shift+R 或在 Cloudflare 控制台 Purge Cache。

---

## Git 版本控制

```bash
# 配置（已设置，仅首次需要）
git config user.email "dhuang2@whu.edu.cn"
git config user.name "Dezhao Huang"

# 提交 + 推送
git add -A
git commit -m "描述你的修改"
git push origin main
```

> GitHub 仓库：https://github.com/dezhaohuang/lammps-tutorial
> push 到 main 也会触发 GitHub Pages 部署（备用），但线上网站以 OSS 部署为准。

---

## 项目结构

```
client/
  src/
    pages/Home.tsx          ← 主页面（所有章节内容）
    components/
      Sidebar.tsx           ← 左侧导航栏
      CodeBlock.tsx          ← 终端代码块（含语法高亮）
      AnnotatedCode.tsx      ← 逐行注释代码块
      SectionHeading.tsx     ← 章节标题
      StepIndicator.tsx      ← 步骤指示器
      InfoCard.tsx           ← 信息卡片（优点/局限）
      WarningBox.tsx         ← 提示/警告框
      ScrollReveal.tsx       ← 滚动渐入动画
      ReadingProgress.tsx    ← 顶部阅读进度条
      BackToTop.tsx          ← 回到顶部按钮
      MoleculeDecoration.tsx ← 分子装饰 SVG
    index.css               ← 全局样式、动画、语法高亮色
  index.html                ← HTML 入口
vite.config.ts              ← Vite 配置（base path 由 VITE_BASE_PATH 控制）
```

---

## 关键信息速查

| 项目 | 值 |
|------|------|
| 线上地址 | https://www.whu-atmes.com/tutorial |
| GitHub 仓库 | https://github.com/dezhaohuang/lammps-tutorial |
| OSS Bucket | whu-atmes-hk |
| OSS 地域 | cn-hongkong |
| OSS 路径 | oss://whu-atmes-hk/tutorial/ |
| CDN | Cloudflare（Free 计划，与主站共用） |
| 构建工具 | Vite 7.x + pnpm |
| 构建输出 | dist/public/ |
| Base Path 环境变量 | VITE_BASE_PATH=/tutorial/ |
| ossutil 路径 (Windows) | /tmp/ossutil2/ossutil-2.2.1-windows-amd64/ossutil.exe |
| ossutil 路径 (macOS) | /tmp/ossutil2/ossutil-2.2.1-mac-arm64/ossutil |
| Git 用户 | Dezhao Huang <dhuang2@whu.edu.cn> |

---

## 注意事项

- **与主站共用 OSS Bucket**：主站在根路径 `/`，教程在 `/tutorial/`，互不影响
- **SPA 路由**：404.html 是 index.html 的副本，确保客户端路由正常工作
- **Dropbox 冲突**：`node_modules` 和 `dist` 已在 .gitignore 中，换电脑需运行 `pnpm install`
- **GitHub Pages**：push 到 main 会自动触发 GitHub Actions 部署到 GitHub Pages（备用渠道）
