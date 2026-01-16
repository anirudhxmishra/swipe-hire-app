import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";

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
import { AuthProvider } from "./context/AuthContext";
import OAuthSuccess from "./pages/OAuthSuccess";

const LayoutWithNav = ({ children }: { children: React.ReactNode }) => (
  <>
    {children}
    <BottomNav />
  </>
);

const queryClient = new QueryClient();

const App = () => (
  <AuthProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />

        <Routes>
          {/* OAuth */}
          <Route path="/oauth-success" element={<OAuthSuccess />} />

          {/* Public */}
          <Route path="/" element={<Splash />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/onboarding" element={<Onboarding />} />

          {/* App pages */}
          <Route
            path="/feed"
            element={
              <LayoutWithNav>
                <Feed />
              </LayoutWithNav>
            }
          />
          <Route
            path="/applications"
            element={
              <LayoutWithNav>
                <Applications />
              </LayoutWithNav>
            }
          />
          <Route
            path="/notifications"
            element={
              <LayoutWithNav>
                <Notifications />
              </LayoutWithNav>
            }
          />
          <Route
            path="/profile"
            element={
              <LayoutWithNav>
                <Profile />
              </LayoutWithNav>
            }
          />

          <Route path="/settings" element={<Settings />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </QueryClientProvider>
  </AuthProvider>
);

export default App;
