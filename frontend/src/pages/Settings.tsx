import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, Bell, Moon, Brain, Lock } from "lucide-react";
import { toast } from "sonner";
import logo from "@/assets/logo.png";

interface UserSettings {
  notifications: boolean;
  darkMode: boolean;
  aiAssist: boolean;
  autoApply: boolean;
  dailyLimit: number;
}

const Settings = () => {
  const navigate = useNavigate();

  // ✅ Load settings
  const [settings, setSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem("user_settings");
    return (
      JSON.parse(saved || "null") || {
        notifications: true,
        darkMode: false,
        aiAssist: true,
        autoApply: false,
        dailyLimit: 10,
      }
    );
  });

  // ✅ Apply stored dark mode immediately on mount (prevents flicker)
  useEffect(() => {
    const saved = localStorage.getItem("user_settings");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.darkMode) {
        document.documentElement.classList.add("dark");
      }
    }
  }, []);

  // ✅ Persist settings + apply dark mode dynamically
  useEffect(() => {
    localStorage.setItem("user_settings", JSON.stringify(settings));
    const html = document.documentElement;
    if (settings.darkMode) {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  }, [settings]);

  const handleSave = () => {
    toast.success("Settings saved successfully!");
  };

  return (
    <div className="min-h-screen gradient-subtle pb-20 transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-background/80 border-b">
        <div className="max-w-5xl mx-auto px-3 sm:px-4 py-3 flex items-center gap-2 sm:gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/feed")}
            aria-label="Back to feed"
            className="shrink-0 h-9 w-9"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          {/* <img src={logo} alt="SwipeHire" className="w-7 h-7 sm:w-8 sm:h-8" /> */}
          <h1 className="text-base sm:text-lg md:text-xl font-bold">Settings</h1>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-3xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-10 space-y-4 sm:space-y-6">
        {/* Notifications */}
        <section className="gradient-card rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-md transition-colors duration-300">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-full gradient-accent flex items-center justify-center">
              <Bell className="h-5 w-5 text-accent-foreground" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold">Notifications</h2>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex-1 pr-3">
              <Label htmlFor="notifications">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive updates about your applications
              </p>
            </div>
            <Switch
              id="notifications"
              checked={settings.notifications}
              onCheckedChange={(val) =>
                setSettings((prev) => ({ ...prev, notifications: val }))
              }
            />
          </div>
        </section>

        {/* Auto Apply */}
        <section className="gradient-card rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-md transition-colors duration-300">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-full bg-success/10 flex items-center justify-center">
              <Lock className="h-5 w-5 text-success" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold">Auto Apply</h2>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 pr-3">
                <Label htmlFor="auto-apply">Enable Auto Apply</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically apply to jobs matching your profile
                </p>
              </div>
              <Switch
                id="auto-apply"
                checked={settings.autoApply}
                onCheckedChange={(val) =>
                  setSettings((prev) => ({ ...prev, autoApply: val }))
                }
              />
            </div>

            {settings.autoApply && (
              <div className="space-y-3 animate-fade-in">
                <Label htmlFor="daily-limit">
                  Daily Application Limit:{" "}
                  <span className="font-bold text-primary">
                    {settings.dailyLimit}
                  </span>
                </Label>
                <Slider
                  id="daily-limit"
                  min={1}
                  max={50}
                  step={1}
                  value={[settings.dailyLimit]}
                  onValueChange={(val) =>
                    setSettings((prev) => ({ ...prev, dailyLimit: val[0] }))
                  }
                />
                <p className="text-sm text-muted-foreground">
                  Maximum applications per day
                </p>
              </div>
            )}
          </div>
        </section>

        {/* AI Assistance */}
        <section className="gradient-card rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-md transition-colors duration-300">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-full bg-purple-500/10 flex items-center justify-center">
              <Brain className="h-5 w-5 text-purple-500" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold">AI Assistance</h2>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex-1 pr-3">
              <Label htmlFor="ai-assist">Enable AI Job Recommendations</Label>
              <p className="text-sm text-muted-foreground">
                Let SwipeHire suggest jobs that match your career growth
              </p>
            </div>
            <Switch
              id="ai-assist"
              checked={settings.aiAssist}
              onCheckedChange={(val) =>
                setSettings((prev) => ({ ...prev, aiAssist: val }))
              }
            />
          </div>
        </section>

        {/* Appearance */}
        <section className="gradient-card rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-md transition-colors duration-300">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
              <Moon className="h-5 w-5 text-foreground" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold">Appearance</h2>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex-1 pr-3">
              <Label htmlFor="dark-mode">Dark Mode</Label>
              <p className="text-sm text-muted-foreground">
                Switch between light and dark themes
              </p>
            </div>
            <Switch
              id="dark-mode"
              checked={settings.darkMode}
              onCheckedChange={(val) =>
                setSettings((prev) => ({ ...prev, darkMode: val }))
              }
            />
          </div>
        </section>

        {/* Save / Cancel */}
        {/* <div className="flex flex-col sm:flex-row gap-3 justify-end mt-8">
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => navigate("/feed")}
          >
            Cancel
          </Button>
          <Button className="w-full sm:w-auto" onClick={handleSave}>
            Save Changes
          </Button>
        </div> */}
      </main>
    </div>
  );
};

export default Settings;
