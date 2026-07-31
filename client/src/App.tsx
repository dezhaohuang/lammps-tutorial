import { lazy, Suspense, useEffect } from "react";
import ErrorBoundary from "@/components/ErrorBoundary";
import NotFound from "@/pages/NotFound";
import TutorialHub from "@/pages/TutorialHub";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { getTutorialStats } from "@/lib/siteStats";
import { Route, Switch, Router } from "wouter";

// LAMMPS 正文约占 bundle 大头，懒加载让教程中心落地页只装很小的 JS
const Home = lazy(() => import("@/pages/Home"));

// BASE_URL 在三种环境下都正确：本地 "/"、OSS "/tutorial/"、GH Pages "/lammps-tutorial/"
const base = import.meta.env.BASE_URL.replace(/\/$/, "");

function RouteFallback() {
  return (
    <div
      className="flex min-h-screen items-center justify-center"
      style={{ background: "linear-gradient(180deg, oklch(0.12 0.05 260), oklch(0.16 0.04 235))" }}
    >
      <div className="text-sm" style={{ color: "oklch(0.72 0.02 200)" }}>
        加载中…
      </div>
    </div>
  );
}

export default function App() {
  // 访客计数在应用层触发一次：落在 hub 的访问也被统计
  useEffect(() => {
    getTutorialStats();
  }, []);

  return (
    <ThemeProvider defaultTheme="light" switchable={false}>
      <ErrorBoundary>
        <Router base={base}>
          <Suspense fallback={<RouteFallback />}>
            <Switch>
              <Route path="/" component={TutorialHub} />
              <Route path="/index.html" component={TutorialHub} />
              <Route path="/lammps" component={Home} />
              <Route>
                <NotFound />
              </Route>
            </Switch>
          </Suspense>
        </Router>
      </ErrorBoundary>
    </ThemeProvider>
  );
}
