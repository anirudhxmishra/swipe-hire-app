import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Mail, Lock, User as UserIcon, Phone } from "lucide-react";
import { toast } from "sonner";
import logo from "@/assets/logo.png";

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Map to your JSON schema → user_profile.basic_info
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
    confirm_password: "",
    accept_terms: false,
  });

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirm_password) {
      toast.error("Passwords do not match");
      return;
    }

    if (!formData.accept_terms) {
      toast.error("Please accept the Terms & Privacy Policy");
      return;
    }

    // Construct the initial user_profile object
    const userProfile = {
      user_id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      onboarding_step: "basic_info",
      basic_info: {
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        signup_method: "email",
      },
      metadata: {
        profile_completion: 25,
        steps_completed: ["basic_info"],
        device_type: /Mobi|Android/i.test(navigator.userAgent)
          ? "mobile"
          : "desktop",
        user_agent: navigator.userAgent,
        ip_address: "auto-fetch-in-backend",
        referral_source: "organic",
      },
    };

    // Example: send this to n8n or backend
    try {
      setLoading(true);
      // Replace with your API endpoint or n8n webhook URL
      // await fetch("https://n8n.yourdomain.com/webhook/signup", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ user_profile: userProfile }),
      // });

      console.log("🧠 Signup Data:", userProfile);
      toast.success("Account created successfully!");
      navigate("/onboarding"); // Move to next onboarding step
    } catch (err) {
      toast.error("Signup failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthSignup = (provider: string) => {
    toast.info(`${provider} signup coming soon!`);
  };

  return (
    <div className="min-h-screen gradient-subtle flex items-center justify-center px-5 py-10">
      <div className="w-full max-w-sm sm:max-w-md">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <img
            src={logo}
            alt="SwipeHire"
            className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 drop-shadow-md"
          />
          <h1 className="text-2xl sm:text-3xl font-bold">Create your account</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Start your job search journey today
          </p>
        </div>

        {/* Form */}
        <div className="bg-card/60 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-lg border border-border animate-fade-in-scale">
          <form onSubmit={handleSignup} className="space-y-5">
            {/* Full Name */}
            <div>
              <Label htmlFor="full_name">Full Name</Label>
              <div className="relative mt-1">
                <UserIcon className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  id="full_name"
                  placeholder="John Doe"
                  value={formData.full_name}
                  onChange={(e) =>
                    setFormData({ ...formData, full_name: e.target.value })
                  }
                  className="pl-10 text-sm"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="pl-10 text-sm"
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative mt-1">
                <Phone className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 234 567 890"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="pl-10 text-sm"
                  required
                />
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
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="pl-10 pr-10 text-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <Label htmlFor="confirm_password">Confirm Password</Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  id="confirm_password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.confirm_password}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirm_password: e.target.value,
                    })
                  }
                  className="pl-10 pr-10 text-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-2 text-sm">
              <Checkbox
                id="terms"
                checked={formData.accept_terms}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, accept_terms: checked as boolean })
                }
                className="mt-1"
              />
              <Label htmlFor="terms" className="leading-relaxed">
                I agree to the{" "}
                <Button variant="link" className="h-auto p-0 text-sm">
                  Terms
                </Button>{" "}
                &{" "}
                <Button variant="link" className="h-auto p-0 text-sm">
                  Privacy Policy
                </Button>
              </Label>
            </div>

            {/* Submit */}
            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? "Creating Account..." : "Sign Up"}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or sign up with
              </span>
            </div>
          </div>

          {/* OAuth */}
          <div className="flex flex-col gap-3">
            <Button
              variant="outline"
              onClick={() => handleOAuthSignup("Google")}
              className="w-full"
            >
              Google
            </Button>
            <Button
              variant="outline"
              onClick={() => handleOAuthSignup("LinkedIn")}
              className="w-full"
            >
              LinkedIn
            </Button>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Button
              variant="link"
              className="h-auto p-0"
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
