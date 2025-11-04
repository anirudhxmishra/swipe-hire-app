import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import logo from "@/assets/logo.png";
import {
  Edit,
  MapPin,
  Briefcase,
  Mail,
  Phone,
  Github,
  Linkedin,
  FileText,
  LogOut,
  Settings,
  Plus,
  Instagram,
  Code2,
} from "lucide-react";
import { skillSuggestions } from "../constant";

interface UserProfile {
  fullName: string;
  email: string;
  phoneNumber: string;
  targetRole: string;
  experienceYears: number;
  bio: string;
  skills: string[];
  preferredLocation: string;
  githubProfile: string;
  linkedinProfile: string;
  profilePictureUrl: string;
  resumeUrl: string;
}

const Profile = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeModal, setActiveModal] = useState<null | "profile" | "skills" | "links" | "resume">(null);
  const [editData, setEditData] = useState<Partial<UserProfile>>({});

  // === Fetch profile from backend ===
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch("http://localhost:8096/api/profile/me", {
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          toast.error("Please log in to view your profile.");
          navigate("/login");
        }
      } catch {
        toast.error("Could not connect to the server.");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, [navigate]);

  // === Logout (backend) ===
  const handleSignOut = async () => {
    try {
      const response = await fetch("http://localhost:8096/logout", {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        toast.success("Signed out successfully");
        navigate("/");
      } else {
        toast.error("Logout failed.");
      }
    } catch {
      toast.error("Logout failed. Server not reachable.");
    }
  };

  const getInitials = (name: string) =>
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  const openModal = (type: typeof activeModal) => {
    if (user) setEditData(user);
    setActiveModal(type);
  };

  const handleSave = () => {
    if (!user) return;
    setUser((prev) => ({ ...prev!, ...editData }));
    toast.success("Profile updated!");
    setActiveModal(null);
  };

  const handleSkillToggle = (skill: string) => {
    setEditData((prev) => {
      const skills = prev.skills?.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...(prev.skills || []), skill];
      return { ...prev, skills };
    });
  };

  const handleResumeUpload = (file: File) => {
    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!validTypes.includes(file.type)) {
      toast.error("Only PDF or DOCX files allowed");
      return;
    }
    setUser((prev) => ({ ...prev!, resumeUrl: file.name }));
    toast.success("Resume uploaded successfully!");
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading profile...
      </div>
    );

  if (!user)
    return (
      <div className="flex justify-center items-center min-h-screen">
        Could not load profile.
      </div>
    );

  return (
    <div className="min-h-screen gradient-subtle pb-20">
      {/* HEADER */}
      <header className="sticky top-0 z-50 glass backdrop-blur-xl border-b">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={logo} alt="SwipeHire" className="w-7 h-7 sm:w-8 sm:h-8" />
            <h1 className="text-base sm:text-xl font-semibold">Profile</h1>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/settings")}
            className="h-9 w-9"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* PROFILE DETAILS */}
        <Card className="glass-strong animate-fade-in">
          <CardHeader className="flex flex-row justify-between items-center px-4 py-3 sm:px-6 sm:py-4">
            <CardTitle className="text-base sm:text-lg">Profile Details</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => openModal("profile")} className="h-8 w-8 p-0">
              <Edit className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="px-4 pb-4 sm:px-6 sm:pb-5 space-y-4">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-5">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24">
                <Avatar className="w-full h-full">
                  <AvatarImage src={user.profilePictureUrl} alt={user.fullName} />
                  <AvatarFallback className="text-xl sm:text-2xl font-semibold gradient-primary text-white">
                    {getInitials(user.fullName)}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="text-center sm:text-left flex-1 w-full">
                <h2 className="text-lg sm:text-xl font-bold">{user.fullName}</h2>
                <p className="text-sm sm:text-base text-muted-foreground mt-0.5">{user.targetRole}</p>
                <p className="text-xs sm:text-sm mt-2 leading-relaxed">{user.bio}</p>
                <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-3 mt-3 text-xs sm:text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span>{user.preferredLocation}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-primary" />
                    <span>{user.experienceYears} years</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-4 h-4 text-primary" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-primary" />
                    <span>{user.phoneNumber}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SKILLS */}
        <Card className="glass-strong animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <CardHeader className="flex flex-row items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
            <CardTitle className="text-base sm:text-lg">Skills</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => openModal("skills")} className="h-8 w-8 p-0">
              <Edit className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="px-4 pb-4 sm:px-6 sm:pb-5">
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {user.skills.map((s) => (
                <Badge key={s} variant="secondary" className="text-xs sm:text-sm px-2 py-1">
                  {s}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* LINKS */}
        <Card className="glass-strong animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <CardHeader className="flex flex-row items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
            <CardTitle className="text-base sm:text-lg">Links</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 sm:px-6 sm:pb-5 space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start gap-2 h-10 text-sm"
              onClick={() => window.open(user.githubProfile, "_blank")}
            >
              <Github className="w-4 h-4 flex-shrink-0" />
              <span>{user.githubProfile}</span>
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-2 h-10 text-sm"
              onClick={() => window.open(user.linkedinProfile, "_blank")}
            >
              <Linkedin className="w-4 h-4 flex-shrink-0" />
              <span>{user.linkedinProfile}</span>
            </Button>
          </CardContent>
        </Card>

        {/* RESUME */}
        <Card className="glass-strong animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <CardHeader className="flex flex-row items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
            <CardTitle className="text-base sm:text-lg">Resume</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 sm:px-6 sm:pb-5">
            {user.resumeUrl ? (
              <div className="flex gap-2 items-center">
                <FileText className="w-4 h-4 text-primary" />
                <span className="text-sm truncate flex-1">{user.resumeUrl}</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.open(user.resumeUrl, "_blank")}
                  className="h-8 text-xs sm:text-sm"
                >
                  View
                </Button>
              </div>
            ) : (
              <p className="text-muted-foreground text-xs sm:text-sm">No resume uploaded yet.</p>
            )}
          </CardContent>
        </Card>

        {/* SIGN OUT */}
        <Button
          variant="outline"
          className="w-full text-destructive hover:bg-destructive/10 text-sm h-10 sm:h-11 animate-fade-in"
          onClick={handleSignOut}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </main>

      {/* ==== MODALS (same UI logic) ==== */}
      {/* Profile Edit */}
      <Dialog open={activeModal === "profile"} onOpenChange={() => setActiveModal(null)}>
        <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Profile Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-3">
            <Input
              placeholder="Full Name"
              value={editData.fullName ?? ""}
              onChange={(e) => setEditData({ ...editData, fullName: e.target.value })}
            />
            <Input
              placeholder="Role/Designation"
              value={editData.targetRole ?? ""}
              onChange={(e) => setEditData({ ...editData, targetRole: e.target.value })}
            />
            <Textarea
              placeholder="Short Bio"
              value={editData.bio ?? ""}
              onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
            />
            <Input
              placeholder="Contact Number"
              value={editData.phoneNumber ?? ""}
              onChange={(e) => setEditData({ ...editData, phoneNumber: e.target.value })}
            />
            <Input
              placeholder="Email Address"
              value={editData.email ?? ""}
              onChange={(e) => setEditData({ ...editData, email: e.target.value })}
            />
            <Input
              placeholder="Location"
              value={editData.preferredLocation ?? ""}
              onChange={(e) => setEditData({ ...editData, preferredLocation: e.target.value })}
            />
            <Input
              placeholder="Experience (years)"
              value={String(editData.experienceYears ?? "")}
              onChange={(e) => setEditData({ ...editData, experienceYears: Number(e.target.value) })}
            />
          </div>
          <DialogFooter className="mt-4 flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setActiveModal(null)}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Skills Edit */}
      <Dialog open={activeModal === "skills"} onOpenChange={() => setActiveModal(null)}>
        <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Skills</DialogTitle>
          </DialogHeader>
          <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-3 max-h-[300px] overflow-y-auto">
            {skillSuggestions.map((s) => (
              <Badge
                key={s}
                variant={editData.skills?.includes(s) ? "default" : "outline"}
                className="cursor-pointer select-none text-xs sm:text-sm px-2 py-1"
                onClick={() => handleSkillToggle(s)}
              >
                {s}
              </Badge>
            ))}
          </div>
          <DialogFooter className="mt-4 flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setActiveModal(null)}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Resume Upload */}
      <Dialog open={activeModal === "resume"} onOpenChange={() => setActiveModal(null)}>
        <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Upload Resume</DialogTitle>
          </DialogHeader>
          <div className="mt-3">
            <Input
              type="file"
              accept=".pdf,.docx"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleResumeUpload(file);
              }}
            />
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setActiveModal(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;
