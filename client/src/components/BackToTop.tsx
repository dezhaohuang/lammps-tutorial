/**
 * 回到顶部浮动按钮 — 滚动超过一屏后显示
 * 设计风格：科研笔记本 / 脉冲光环 + 科技青
 */

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 800);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="fixed bottom-8 right-8 z-50" style={{ opacity: visible ? 1 : 0, pointerEvents: visible ? "auto" : "none", transition: "opacity 0.3s ease, transform 0.3s ease", transform: visible ? "translateY(0)" : "translateY(16px)" }}>
      {/* Pulse ring */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: "oklch(0.55 0.15 195 / 0.15)",
          animation: visible ? "pulse-ring 2s ease-out infinite" : "none",
        }}
      />
      <button
        onClick={scrollToTop}
        aria-label="回到顶部"
        className="relative w-11 h-11 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
        style={{
          background: "linear-gradient(135deg, oklch(0.55 0.15 195), oklch(0.40 0.12 230))",
          color: "white",
        }}
      >
        <ArrowUp size={18} />
      </button>
    </div>
  );
}
