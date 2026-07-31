import ErrorBoundary from "@/components/ErrorBoundary";
import Home from "@/pages/Home";
import NotFound from "@/pages/NotFound";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { Route, Switch, Router } from "wouter";

const base = import.meta.env.VITE_BASE_PATH
  ? import.meta.env.VITE_BASE_PATH.replace(/\/$/, "")
  : "";

export default function App() {
  return (
    <ThemeProvider defaultTheme="light" switchable={false}>
      <ErrorBoundary>
        <Router base={base}>
          <Switch>
            <Route path="/" component={Home} />
            <Route>
              <NotFound />
            </Route>
          </Switch>
        </Router>
      </ErrorBoundary>
    </ThemeProvider>
  );
}
