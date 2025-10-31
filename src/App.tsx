import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Splash from "./components/Splash";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Onboarding from "./components/Onboarding";
import Feed from "./pages/Feed";
import Applications from "./pages/Applications";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import BottomNav from "./components/BottomNav";
import Notifications from "./pages/Notifications";

const LayoutWithNav = ({ children }: { children: React.ReactNode }) => (
  <>
    {children}
    <BottomNav />
  </>
);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/feed" element={<LayoutWithNav><Feed /></LayoutWithNav>} />
          <Route path="/applications" element={<LayoutWithNav><Applications /></LayoutWithNav>} />
          <Route path="/notifications" element={<LayoutWithNav><Notifications /></LayoutWithNav>} />
          <Route path="/profile" element={<LayoutWithNav><Profile /></LayoutWithNav>} />
          <Route path="/settings" element={<Settings />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
