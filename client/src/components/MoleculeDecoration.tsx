/**
 * 分子轨迹装饰 — 用 SVG 绘制轻量级的分子/原子装饰图案
 * 放置在某些章节背景中增加学术感
 */

export function MoleculeDecoration({ className = "", variant = "left" }: { className?: string; variant?: "left" | "right" }) {
  if (variant === "right") {
    return (
      <svg className={className} width="320" height="320" viewBox="0 0 320 320" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="260" cy="60" r="6" fill="oklch(0.65 0.15 195 / 0.12)" />
        <circle cx="200" cy="120" r="10" fill="oklch(0.55 0.15 195 / 0.08)" />
        <circle cx="280" cy="160" r="4" fill="oklch(0.45 0.12 260 / 0.10)" />
        <circle cx="240" cy="220" r="8" fill="oklch(0.65 0.15 195 / 0.10)" />
        <circle cx="300" cy="260" r="5" fill="oklch(0.55 0.12 260 / 0.08)" />
        <line x1="260" y1="60" x2="200" y2="120" stroke="oklch(0.65 0.15 195 / 0.08)" strokeWidth="1.5" />
        <line x1="200" y1="120" x2="280" y2="160" stroke="oklch(0.55 0.12 260 / 0.06)" strokeWidth="1" />
        <line x1="280" y1="160" x2="240" y2="220" stroke="oklch(0.65 0.15 195 / 0.08)" strokeWidth="1.5" />
        <line x1="240" y1="220" x2="300" y2="260" stroke="oklch(0.55 0.12 260 / 0.06)" strokeWidth="1" />
        <circle cx="160" cy="40" r="3" fill="oklch(0.78 0.15 75 / 0.10)" />
        <circle cx="180" cy="280" r="3" fill="oklch(0.78 0.15 75 / 0.08)" />
        <line x1="160" y1="40" x2="260" y2="60" stroke="oklch(0.78 0.15 75 / 0.06)" strokeWidth="1" strokeDasharray="4 4" />
      </svg>
    );
  }

  return (
    <svg className={className} width="320" height="320" viewBox="0 0 320 320" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="8" fill="oklch(0.65 0.15 195 / 0.12)" />
      <circle cx="120" cy="140" r="12" fill="oklch(0.55 0.15 195 / 0.08)" />
      <circle cx="40" cy="200" r="5" fill="oklch(0.45 0.12 260 / 0.10)" />
      <circle cx="100" cy="260" r="7" fill="oklch(0.65 0.15 195 / 0.10)" />
      <circle cx="20" cy="300" r="4" fill="oklch(0.55 0.12 260 / 0.08)" />
      <line x1="60" y1="60" x2="120" y2="140" stroke="oklch(0.65 0.15 195 / 0.08)" strokeWidth="1.5" />
      <line x1="120" y1="140" x2="40" y2="200" stroke="oklch(0.55 0.12 260 / 0.06)" strokeWidth="1" />
      <line x1="40" y1="200" x2="100" y2="260" stroke="oklch(0.65 0.15 195 / 0.08)" strokeWidth="1.5" />
      <line x1="100" y1="260" x2="20" y2="300" stroke="oklch(0.55 0.12 260 / 0.06)" strokeWidth="1" />
      <circle cx="160" cy="100" r="3" fill="oklch(0.78 0.15 75 / 0.10)" />
      <circle cx="80" cy="320" r="3" fill="oklch(0.78 0.15 75 / 0.08)" />
      <line x1="160" y1="100" x2="120" y2="140" stroke="oklch(0.78 0.15 75 / 0.06)" strokeWidth="1" strokeDasharray="4 4" />
    </svg>
  );
}
