import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import logo from "@/assets/logo.png";

const Splash = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [hasAuth, setHasAuth] = useState(false);

  useEffect(() => {
    // Simulate checking for auth token
    const timer = setTimeout(() => {
      const authToken = localStorage.getItem("auth_token");
      setHasAuth(!!authToken);
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleGetStarted = () => {
    navigate("/login");
  };

  const handleContinue = () => {
    navigate("/feed");
  };

  return (
    <div className="min-h-screen gradient-subtle flex items-center justify-center p-6">
      <div className="text-center animate-fade-in-scale">
        {/* Logo */}
        <div className="mb-8 animate-bounce-subtle">
          <img
            src={logo}
            alt="SwipeHire - Find your dream job"
            className="w-32 h-32 mx-auto drop-shadow-lg"
          />
        </div>

        {/* Brand Name */}
        <h1 className="text-5xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-glow bg-[length:200%_auto] animate-[gradient_3s_ease_infinite]">
          SwipeHire
        </h1>

        {/* Tagline */}
        <p className="text-xl italic text-muted-foreground mb-12 tracking-wide animate-slide-up font-[Poppins]">
          Swipe. Match. <span className="text-primary italic">Get Hired.</span>
        </p>


        {/* Loading / CTA */}
        {loading ? (
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm">Loading your experience...</span>
          </div>
        ) : (
          <div className="space-y-4 animate-fade-in">
            {hasAuth ? (
              <Button
                size="lg"
                onClick={handleContinue}
                className="w-full max-w-xs"
              >
                Continue to Feed
              </Button>
            ) : (
              <Button
                size="lg"
                onClick={handleGetStarted}
                className="w-full max-w-xs"
              >
                Get Started
              </Button>
            )}
          </div>
        )}

        {/* Accessibility text */}
        <p className="sr-only">
          SwipeHire - An AI-powered job application platform. Swipe through personalized job matches
          and apply with tailored resumes and cover letters. Start your career journey today.
        </p>
      </div>
    </div>
  );
};

export default Splash;
