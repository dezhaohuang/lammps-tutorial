import { useEffect, useState } from "react";

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const nextProgress = scrollHeight <= 0 ? 0 : (scrollTop / scrollHeight) * 100;

      setProgress(Math.min(100, Math.max(0, nextProgress)));
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);

    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-50 h-1 bg-white/30">
      <div
        className="h-full transition-[width] duration-150"
        style={{
          width: `${progress}%`,
          background:
            "linear-gradient(90deg, oklch(0.48 0.12 240), oklch(0.58 0.15 195), oklch(0.68 0.12 175))",
          boxShadow: "0 0 18px oklch(0.58 0.15 195 / 0.45)",
        }}
      />
    </div>
  );
}
