# LAMMPS Tutorial Website — Setup Guide

## Overview

A LAMMPS molecular dynamics simulation tutorial website built with React + Vite + Tailwind CSS, featuring an "Academic Notebook" design style.

**Tech stack**: React 19 / Vite 7 / Tailwind CSS 4 / TypeScript / Express

## Prerequisites

- **Node.js** >= 18 (v20+ recommended)
- **pnpm** >= 10 (package manager)

## Quick Start

### 1. Install pnpm (if not already installed)

```bash
npm install -g pnpm
```

### 2. Install dependencies

```bash
cd lammps-tutorial
pnpm install
```

### 3. Start the development server

```bash
pnpm dev
```

Open **http://localhost:3000/** in your browser. The dev server supports hot module replacement (HMR).

## Production Deployment

### Build

```bash
pnpm build
```

Output goes to `dist/`:
- `dist/public/` — frontend static assets
- `dist/index.js` — Express server entry point

### Run in production

```bash
pnpm start
```

Listens on port 3000 by default. Override with the `PORT` environment variable:

```bash
PORT=8080 pnpm start
```

## Available Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server with HMR |
| `pnpm build` | Build for production |
| `pnpm start` | Run production server |
| `pnpm preview` | Preview production build |
| `pnpm check` | TypeScript type checking |
| `pnpm format` | Format code with Prettier |

## Project Structure

```
lammps-tutorial/
├── client/               # Frontend
│   ├── src/
│   │   ├── pages/        # Page components
│   │   ├── components/   # Reusable components
│   │   ├── hooks/        # Custom hooks
│   │   ├── contexts/     # React context
│   │   └── lib/          # Utilities
│   ├── public/           # Static assets
│   └── index.html        # HTML entry
├── server/               # Express backend (production)
│   └── index.ts
├── shared/               # Shared code
├── vite.config.ts        # Vite config
├── package.json
└── tsconfig.json
```
