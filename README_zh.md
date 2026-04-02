# LAMMPS 入门教学网站 — 运行指南

## 项目简介

基于 React + Vite + Tailwind CSS 的 LAMMPS 分子动力学模拟入门教学网站，采用「科研笔记本」设计风格。

**技术栈**：React 19 / Vite 7 / Tailwind CSS 4 / TypeScript / Express

## 环境要求

- **Node.js** >= 18（推荐 v20+）
- **pnpm** >= 10（包管理器）

## 快速开始

### 1. 安装 pnpm（如尚未安装）

```bash
npm install -g pnpm
```

### 2. 安装依赖

```bash
cd lammps-tutorial
pnpm install
```

### 3. 启动开发服务器

```bash
pnpm dev
```

浏览器访问 **http://localhost:3000/** 即可看到网站。

开发服务器支持热更新（HMR），修改代码后页面会自动刷新。

## 生产部署

### 构建

```bash
pnpm build
```

构建产物输出到 `dist/` 目录：
- `dist/public/` — 前端静态文件
- `dist/index.js` — Express 服务端入口

### 运行生产版本

```bash
pnpm start
```

默认监听端口 3000，可通过环境变量 `PORT` 修改：

```bash
PORT=8080 pnpm start
```

## 常用命令

| 命令 | 说明 |
|------|------|
| `pnpm dev` | 启动开发服务器（支持热更新） |
| `pnpm build` | 构建生产版本 |
| `pnpm start` | 运行生产服务器 |
| `pnpm preview` | 预览构建产物 |
| `pnpm check` | TypeScript 类型检查 |
| `pnpm format` | 用 Prettier 格式化代码 |

## 项目结构

```
lammps-tutorial/
├── client/               # 前端代码
│   ├── src/
│   │   ├── pages/        # 页面组件
│   │   ├── components/   # 可复用组件
│   │   ├── hooks/        # 自定义 hooks
│   │   ├── contexts/     # React context
│   │   └── lib/          # 工具函数
│   ├── public/           # 静态资源
│   └── index.html        # HTML 入口
├── server/               # Express 后端（生产部署用）
│   └── index.ts
├── shared/               # 前后端共享代码
├── vite.config.ts        # Vite 配置
├── package.json
└── tsconfig.json
```
