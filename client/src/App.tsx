import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import Dashboard from "@/pages/Dashboard";
import Hiragana from "@/pages/Hiragana";
import Katakana from "@/pages/Katakana";
import Vocabulary from "@/pages/Vocabulary";
import Kanji from "@/pages/Kanji";
import Grammar from "@/pages/Grammar";
import Reading from "@/pages/Reading";
import Practice from "@/pages/Practice";
import N4StudyPlan from "@/pages/N4StudyPlan";
import NotFound from "@/pages/not-found";

const pageConfig = {
  '/': { title: 'Dashboard', subtitle: 'Continue your Japanese learning journey' },
  '/hiragana': { title: 'Hiragana', subtitle: 'Master the basic Japanese syllabary' },
  '/katakana': { title: 'Katakana', subtitle: 'Learn katakana for foreign words' },
  '/vocabulary': { title: 'Vocabulary', subtitle: 'Build your Japanese word bank' },
  '/kanji': { title: 'Kanji', subtitle: 'Master Japanese characters' },
  '/grammar': { title: 'Grammar', subtitle: 'Learn Japanese sentence structures' },
  '/reading': { title: 'Reading', subtitle: 'Practice comprehension skills' },
  '/practice': { title: 'Practice', subtitle: 'Gamified learning exercises' },
  '/n4-study-plan': { title: 'JLPT N4 Study Plan', subtitle: 'Your comprehensive N4 preparation guide' },
};

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/hiragana" component={Hiragana} />
      <Route path="/katakana" component={Katakana} />
      <Route path="/vocabulary" component={Vocabulary} />
      <Route path="/kanji" component={Kanji} />
      <Route path="/grammar" component={Grammar} />
      <Route path="/reading" component={Reading} />
      <Route path="/practice" component={Practice} />
      <Route path="/n4-study-plan" component={N4StudyPlan} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Switch>
          {Object.entries(pageConfig).map(([path, config]) => (
            <Route key={path} path={path}>
              <Header title={config.title} subtitle={config.subtitle} />
            </Route>
          ))}
          <Route>
            <Header title="Page Not Found" subtitle="The requested page could not be found" />
          </Route>
        </Switch>
        <Router />
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AppLayout />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
