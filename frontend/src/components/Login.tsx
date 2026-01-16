import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Mail, Lock, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import logo from "@/assets/logo.png";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "@/hooks/useAuth";

interface GoogleUser {
  name?: string;
  email?: string;
  picture?: string;
  sub?: string;
}

interface ValidationErrors {
  email?: string;
  password?: string;
}

const Login = () => {
  const navigate = useNavigate();
  const { handleLoginSuccess } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Validation functions
  const validateEmail = (email: string): string | undefined => {
    if (!email) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return undefined;
  };

  const validatePassword = (password: string): string | undefined => {
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters long";
    return undefined;
  };

  // Validate all fields
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {
      email: validateEmail(email),
      password: validatePassword(password),
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== undefined);
  };

  // Handle field blur for real-time validation
  const handleBlur = (field: "email" | "password") => {
    setTouched({ ...touched, [field]: true });
    
    let error: string | undefined;
    if (field === "email") {
      error = validateEmail(email);
    } else if (field === "password") {
      error = validatePassword(password);
    }
    
    setErrors({ ...errors, [field]: error });
  };

 const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setLoading(true);
    const body = new URLSearchParams();
    body.append("username", email);
    body.append("password", password);
    body.append("remember-me", String(rememberMe));

    console.log("Attempting login:", body.toString());

    try {
      const response = await fetch("http://localhost:8096/login", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
        credentials: "include",
      });

      console.log("Server responded with:", response.status, response.statusText);

      if (response.ok) {
        toast.success("Welcome back!");
        const hasOnboarded = localStorage.getItem("onboarding_completed");
        const user = { id: "1", name: "User", email };
        handleLoginSuccess("backend_token", user);
        navigate(hasOnboarded ? "/feed" : "/onboarding");
      } else {
        toast.error("Login failed: Invalid email or password.");
      }
    } catch (err) {
      console.error("Network/CORS error:", err);
      toast.error("Login failed. Server not reachable (CORS or network issue).");
    } finally {
      setLoading(false);
    }
  };
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8096/oauth2/authorization/google";
  };
  
  //   const handleGoogleLogin = (response: CredentialResponse) => {
  //   try {
  //     if (!response.credential) throw new Error("Missing Google credential");
  //     const decoded = jwtDecode<GoogleUser>(response.credential);
  //     const user = {
  //       id: decoded.sub || "unknown",
  //       name: decoded.name || "User",
  //       email: decoded.email || "unknown",
  //       avatar: decoded.picture,
  //     };
  //     handleLoginSuccess(response.credential, user);
  //     toast.success(`Welcome back, ${user.name}!`);
      
  //     const hasOnboarded = localStorage.getItem("onboarding_completed");
  //     navigate(hasOnboarded ? "/feed" : "/onboarding");
  //   } catch (err) {
  //     console.error("Google login error:", err);
  //     toast.error("Google login failed. Please try again.");
  //   }
  // };



  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-5 py-8 gradient-subtle">
      <div className="w-full max-w-sm sm:max-w-md">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 animate-fade-in">
          <img
            src={logo}
            alt="SwipeHire"
            className="w-14 h-14 sm:w-20 sm:h-20 mx-auto mb-4 drop-shadow-md"
          />
          <h1 className="text-2xl sm:text-3xl font-bold">Welcome back</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Continue your job search journey
          </p>
        </div>

        {/* Form */}
        <div className="bg-card/60 backdrop-blur-md rounded-2xl p-5 sm:p-8 shadow-lg border border-border animate-fade-in-scale">
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
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
                  onBlur={() => handleBlur("email")}
                  className={`pl-10 text-sm ${touched.email && errors.email ? 'border-red-500' : ''}`}
                  required
                />
                {touched.email && errors.email && (
                  <div className="flex items-center gap-1 mt-1 text-xs text-red-500">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.email}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Password */}
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
                  onBlur={() => handleBlur("password")}
                  className={`pl-10 pr-10 text-sm ${touched.password && errors.password ? 'border-red-500' : ''}`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
                {touched.password && errors.password && (
                  <div className="flex items-center gap-1 mt-1 text-xs text-red-500">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.password}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(c) => setRememberMe(c as boolean)}
                />
                <Label htmlFor="remember" className="cursor-pointer">
                  Remember me
                </Label>
              </div>
              <Button variant="link" className="h-auto p-0 text-xs sm:text-sm">
                Forgot password?
              </Button>
            </div>

            {/* Submit */}
            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          {/* Google Login */}
          <div className="flex justify-center mt-4">
            <Button
              variant="outline"
              className="w-full flex items-center gap-2"
              onClick={handleGoogleLogin}
            >
              Continue with Google
            </Button>
          </div>

          {/* Footer */}
          <p className="text-center text-xs sm:text-sm text-muted-foreground mt-6">
            Don't have an account?{" "}
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