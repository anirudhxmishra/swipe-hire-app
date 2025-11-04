import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Mail, Lock, User as UserIcon, Phone, AlertCircle } from "lucide-react";
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
  full_name?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirm_password?: string;
}

const Signup = () => {
  const navigate = useNavigate();
  const { handleLoginSuccess } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
    confirm_password: "",
    accept_terms: false,
  });

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

  const validateConfirmPassword = (confirmPassword: string, password: string): string | undefined => {
    if (!confirmPassword) return "Please confirm your password";
    if (confirmPassword !== password) return "Passwords do not match";
    return undefined;
  };

  const validatePhone = (phone: string): string | undefined => {
    if (!phone) return "Phone number is required";
    const phoneRegex = /^\+91\d{10}$/;
    if (!phoneRegex.test(phone)) {
      return "Phone must start with +91 followed by 10 digits (e.g., +919876543210)";
    }
    return undefined;
  };

  const validateFullName = (name: string): string | undefined => {
    if (!name) return "Full name is required";
    if (name.trim().length < 2) return "Name must be at least 2 characters";
    return undefined;
  };

  // Validate all fields
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {
      full_name: validateFullName(formData.full_name),
      email: validateEmail(formData.email),
      phone: validatePhone(formData.phone),
      password: validatePassword(formData.password),
      confirm_password: validateConfirmPassword(formData.confirm_password, formData.password),
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== undefined);
  };

  const handleBlur = (field: keyof typeof formData) => {
    setTouched({ ...touched, [field]: true });

    let error: string | undefined;
    switch (field) {
      case "full_name":
        error = validateFullName(formData.full_name);
        break;
      case "email":
        error = validateEmail(formData.email);
        break;
      case "phone":
        error = validatePhone(formData.phone);
        break;
      case "password":
        error = validatePassword(formData.password);
        break;
      case "confirm_password":
        error = validateConfirmPassword(formData.confirm_password, formData.password);
        break;
    }

    setErrors({ ...errors, [field]: error });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    setTouched({
      full_name: true,
      email: true,
      phone: true,
      password: true,
      confirm_password: true,
    });

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    if (!formData.accept_terms) {
      toast.error("Please accept the Terms & Privacy Policy");
      return;
    }

    // ✅ Backend DTO
    const registrationDto = {
      fullName: formData.full_name,
      email: formData.email,
      phoneNumber: formData.phone,
      password: formData.password,
      confirmPassword: formData.confirm_password,
    };

    try {
      setLoading(true);

      const response = await fetch("http://localhost:8096/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registrationDto),
        credentials: "include", // ✅ ensures cookies (like JSESSIONID) are stored
      });

      if (response.ok) {
        toast.success("Account created successfully!");
        navigate("/onboarding");
      } else {
        const errorText = await response.text();
        toast.error(`Signup failed: ${errorText}`);
      }
    } catch (err) {
      toast.error("Signup failed. Server not reachable.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = (response: CredentialResponse) => {
    try {
      if (!response.credential) throw new Error("Missing Google credential");
      const decoded = jwtDecode<GoogleUser>(response.credential);
      const user = {
        id: decoded.sub || "unknown",
        name: decoded.name || "User",
        email: decoded.email || "unknown",
        avatar: decoded.picture,
      };
      handleLoginSuccess(response.credential, user);
      toast.success(`Welcome, ${user.name}!`);
      navigate("/onboarding");
    } catch (err) {
      console.error("Google signup error:", err);
      toast.error("Google signup failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen gradient-subtle flex items-center justify-center px-4 sm:px-5 py-8">
      <div className="w-full max-w-sm sm:max-w-md">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 animate-fade-in">
          <img
            src={logo}
            alt="SwipeHire"
            className="w-14 h-14 sm:w-20 sm:h-20 mx-auto mb-4 drop-shadow-md"
          />
          <h1 className="text-2xl sm:text-3xl font-bold">Create your account</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Start your job search journey today
          </p>
        </div>

        {/* Form */}
        <div className="bg-card/60 backdrop-blur-md rounded-2xl p-5 sm:p-8 shadow-lg border border-border animate-fade-in-scale">
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
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  onBlur={() => handleBlur("full_name")}
                  className={`pl-10 text-sm ${
                    touched.full_name && errors.full_name ? "border-red-500" : ""
                  }`}
                  required
                />
                {touched.full_name && errors.full_name && (
                  <div className="flex items-center gap-1 mt-1 text-xs text-red-500">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.full_name}</span>
                  </div>
                )}
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
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  onBlur={() => handleBlur("email")}
                  className={`pl-10 text-sm ${
                    touched.email && errors.email ? "border-red-500" : ""
                  }`}
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

            {/* Phone */}
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative mt-1">
                <Phone className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+919876543210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  onBlur={() => handleBlur("phone")}
                  className={`pl-10 text-sm ${
                    touched.phone && errors.phone ? "border-red-500" : ""
                  }`}
                  required
                />
                {touched.phone && errors.phone && (
                  <div className="flex items-center gap-1 mt-1 text-xs text-red-500">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.phone}</span>
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
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  onBlur={() => handleBlur("password")}
                  className={`pl-10 pr-10 text-sm ${
                    touched.password && errors.password ? "border-red-500" : ""
                  }`}
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
                    setFormData({ ...formData, confirm_password: e.target.value })
                  }
                  onBlur={() => handleBlur("confirm_password")}
                  className={`pl-10 pr-10 text-sm ${
                    touched.confirm_password && errors.confirm_password
                      ? "border-red-500"
                      : ""
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
                {touched.confirm_password && errors.confirm_password && (
                  <div className="flex items-center gap-1 mt-1 text-xs text-red-500">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.confirm_password}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-2 text-xs sm:text-sm">
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
                <Button variant="link" className="h-auto p-0 text-xs sm:text-sm">
                  Terms of Service
                </Button>{" "}
                and{" "}
                <Button variant="link" className="h-auto p-0 text-xs sm:text-sm">
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

          {/* Google Signup */}
          <div className="flex justify-center mt-4">
            <GoogleLogin
              onSuccess={handleGoogleSignup}
              onError={() => toast.error("Google signup failed")}
              shape="pill"
              width="280"
            />
          </div>

          {/* Footer */}
          <p className="text-center text-xs sm:text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Button variant="link" className="h-auto p-0" onClick={() => navigate("/login")}>
              Login
            </Button>
          </p>

          {/* Professional Terms Footer */}
          <div className="text-center mt-6 text-[11px] sm:text-xs text-muted-foreground">
            By signing up, you acknowledge that you have read and agree to our{" "}
            <Button variant="link" className="h-auto p-0 text-[11px] sm:text-xs">
              Terms of Service
            </Button>{" "}
            and{" "}
            <Button variant="link" className="h-auto p-0 text-[11px] sm:text-xs">
              Privacy Policy
            </Button>
            . Your personal data will be handled responsibly in accordance with our policies.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
