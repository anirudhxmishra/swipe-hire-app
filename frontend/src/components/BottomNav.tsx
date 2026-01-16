import { useNavigate, useLocation } from "react-router-dom";
import { Home, Briefcase, MessageSquare, User, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
}

const navItems: NavItem[] = [
  { icon: Home, label: "Home", path: "/feed" },
  { icon: Briefcase, label: "Applied", path: "/applications" },
  { icon: MessageSquare, label: "Alerts", path: "/notifications" },
  { icon: User, label: "Profile", path: "/profile" },
    {icon:LogOut, label:"Logout", path:"/"}
];

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      {/* Spacer to prevent content being hidden behind nav */}
      <div className="h-20 sm:h-24" />

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:backdrop-blur-lg">
        <div className="max-w-md mx-auto px-2 py-2">
          <div className="flex justify-around items-center">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={cn(
                    "relative flex flex-col items-center justify-center gap-1 p-2 w-16 rounded-xl transition-all duration-200 ease-in-out",
                    isActive
                      ? "text-primary bg-primary/10 shadow-sm scale-105"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/20"
                  )}
                  aria-label={item.label}
                >
                  <Icon
                    className={cn(
                      "w-6 h-6 transition-all",
                      isActive && "text-primary drop-shadow-[0_0_6px_rgba(15,107,104,0.4)]"
                    )}
                  />
                  <span
                    className={cn(
                      "text-[11px] font-medium tracking-tight",
                      isActive ? "font-semibold text-primary" : ""
                    )}
                  >
                    {item.label}
                  </span>
                  {isActive && (
                    <div className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
};

export default BottomNav;
