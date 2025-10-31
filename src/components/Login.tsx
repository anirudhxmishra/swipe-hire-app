import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { toast } from "sonner";
import logo from "@/assets/logo.png";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      if (email && password) {
        const hasOnboarded = localStorage.getItem("onboarding_completed");
        localStorage.setItem("auth_token", "demo_token");
        toast.success("Welcome back!");
        navigate(hasOnboarded ? "/feed" : "/onboarding");
      } else {
        toast.error("Invalid credentials");
      }
      setLoading(false);
    }, 1000);
  };

  const handleOAuthLogin = (provider: string) => {
    toast.info(`${provider} login coming soon!`);
  };

  return (
    <div className="min-h-screen gradient-subtle flex items-center justify-center px-5 py-10">
      <div className="w-full max-w-sm sm:max-w-md">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <img src={logo} alt="SwipeHire" className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 drop-shadow-md" />
          <h1 className="text-2xl sm:text-3xl font-bold">Welcome back</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Continue your job search journey
          </p>
        </div>

        {/* Form */}
        <div className="bg-card/60 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-lg border border-border animate-fade-in-scale">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 text-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Checkbox id="remember" checked={rememberMe} onCheckedChange={(c) => setRememberMe(c as boolean)} />
                <Label htmlFor="remember" className="cursor-pointer">Remember me</Label>
              </div>
              <Button variant="link" className="h-auto p-0 text-sm">
                Forgot password?
              </Button>
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Button variant="outline" onClick={() => handleOAuthLogin("Google")}>Google</Button>
            <Button variant="outline" onClick={() => handleOAuthLogin("LinkedIn")}>LinkedIn</Button>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don’t have an account?{" "}
            <Button variant="link" className="h-auto p-0" onClick={() => navigate("/signup")}>
              Sign up
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
