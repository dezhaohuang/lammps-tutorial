/**
 * 阅读进度条 — 固定在页面顶部，显示当前阅读进度
 * 设计风格：科研笔记本 / 科技青渐变 + 发光效果
 */

import { useState, useEffect } from "react";

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        setProgress(Math.min((scrollTop / docHeight) * 100, 100));
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-[3px]" style={{ background: "oklch(0.95 0.005 90 / 0.5)" }}>
      <div
        className="h-full transition-[width] duration-150 ease-out relative"
        style={{
          width: `${progress}%`,
          background: "linear-gradient(90deg, oklch(0.55 0.15 195), oklch(0.50 0.14 230), oklch(0.45 0.12 260))",
        }}
      >
        {/* Glow tip */}
        {progress > 0 && (
          <div
            className="absolute right-0 top-1/2 -translate-y-1/2 w-16 h-[6px] rounded-full"
            style={{
              background: "linear-gradient(90deg, transparent, oklch(0.65 0.15 195 / 0.8))",
              filter: "blur(3px)",
            }}
          />
        )}
      </div>
    </div>
  );
}
