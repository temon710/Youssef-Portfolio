import { Switch, Route } from "wouter";
import { AppProvider } from "@/context/AppContext";
import { Toaster } from "@/components/ui/toaster";
import Home from "@/pages/Home";
import Login from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/admin" component={AdminDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <AppProvider>
      <Router />
      <Toaster />
    </AppProvider>
  );
}

export default App;
