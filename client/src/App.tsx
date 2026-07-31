import ErrorBoundary from "@/components/ErrorBoundary";
import Home from "@/pages/Home";
import NotFound from "@/pages/NotFound";
import TutorialHub from "@/pages/TutorialHub";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { Route, Switch, Router } from "wouter";

// BASE_URL 在三种环境下都正确：本地 "/"、OSS "/tutorial/"、GH Pages "/lammps-tutorial/"
const base = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function App() {
  return (
    <ThemeProvider defaultTheme="light" switchable={false}>
      <ErrorBoundary>
        <Router base={base}>
          <Switch>
            <Route path="/" component={TutorialHub} />
            <Route path="/index.html" component={TutorialHub} />
            <Route path="/lammps" component={Home} />
            <Route>
              <NotFound />
            </Route>
          </Switch>
        </Router>
      </ErrorBoundary>
    </ThemeProvider>
  );
}
