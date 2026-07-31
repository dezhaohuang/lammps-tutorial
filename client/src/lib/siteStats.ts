const STATS_API = "https://www.whu-atmes.com/api/tutorial-stats";

export interface TutorialStats {
  pv: number;
  uv: number;
}

let statsPromise: Promise<TutorialStats | null> | null = null;

// 整个页面生命周期只 POST 一次：hub 与 /lammps 共享同一次计数，路由往返不会重复累加
export function getTutorialStats(): Promise<TutorialStats | null> {
  statsPromise ??= fetch(STATS_API, { method: "POST" })
    .then((r) => r.json() as Promise<TutorialStats>)
    .catch(() => null);
  return statsPromise;
}
