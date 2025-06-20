import { Switch, Route, Router as WouterRouter, useLocation } from 'wouter';
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { queryClient } from "./lib/queryClient";
import { AppProvider } from "./contexts/AppContext";
import { BetSlipProvider } from "./contexts/BetSlipContext";
import { BASE_PATH, useNavigation } from "./utils/navigation";

// Pages
import Home from "@/pages/Home";
import Login from "@/pages/Auth/Login";
import Signup from "@/pages/Auth/Signup";
import ForgotPassword from "@/pages/Auth/ForgotPassword";
import CricketBetting from "@/pages/Cricket/CricketBetting";
import AviatorGame from "@/pages/Aviator/AviatorGame";
import ColorTrading from "@/pages/ColorGame/ColorTrading";
import MiniGames from "@/pages/MiniGames/MiniGames";
import Dashboard from "@/pages/Profile/Dashboard";
import Wallet from "@/pages/Wallet/Wallet";
import Settings from "@/pages/Settings/Settings";
import Leaderboard from "@/pages/Leaderboard/Leaderboard";
import NotFound from "@/pages/not-found";

// Components
import Navbar from "@/components/Layout/Navbar";
import MobileNav from "@/components/Layout/MobileNav";
import BetSlip from "@/components/BetSlip/BetSlip";

// Create a custom Link component that handles the base path
const Link = ({ to, children, ...props }: { to: string; children: React.ReactNode; [key: string]: any }) => {
  const { createPath } = useNavigation();
  return (
    <a href={createPath(to)} {...props}>
      {children}
    </a>
  );
};

// Export the Link component and useNavigation hook for use in other components
export { Link, useNavigation };

function Router() {
  return (
    <div className="min-h-screen bg-primary-dark">
      <Navbar />
      <WouterRouter base={BASE_PATH}>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Signup} />
          <Route path="/forgot-password" component={ForgotPassword} />
          <Route path="/cricket" component={CricketBetting} />
          <Route path="/aviator" component={AviatorGame} />
          <Route path="/color-game" component={ColorTrading} />
          <Route path="/mini-games" component={MiniGames} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/wallet" component={Wallet} />
          <Route path="/settings" component={Settings} />
          <Route path="/leaderboard" component={Leaderboard} />
          <Route component={NotFound} />
        </Switch>
      </WouterRouter>
      <MobileNav />
      <BetSlip />
      <Toaster />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppProvider>
          <BetSlipProvider>
            <Toaster />
            <Router />
          </BetSlipProvider>
        </AppProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
