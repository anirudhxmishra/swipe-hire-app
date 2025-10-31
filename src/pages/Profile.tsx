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

type UserLinks = Record<string, string>;

interface User {
  name: string;
  email: string;
  phone: string;
  role: string;
  location: string;
  experience: string;
  avatar: string;
  skills: string[];
  bio: string;
  links: UserLinks;
  resume: string;
}

const Profile = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState<User>(() => {
    const saved = localStorage.getItem("user_profile");
    return (
      JSON.parse(saved || "null") || {
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "+1 (555) 123-4567",
        role: "Senior Full Stack Developer",
        location: "San Francisco, CA",
        experience: "5 years",
        avatar: "",
        skills: ["React", "Node.js", "TypeScript"],
        bio: "Passionate full-stack developer building scalable web apps.",
        links: {
          github: "https://github.com/johndoe",
          linkedin: "https://linkedin.com/in/johndoe",
        },
        resume: "",
      }
    );
  });

  const [activeModal, setActiveModal] = useState<null | "profile" | "skills" | "links" | "resume">(null);
  const [editData, setEditData] = useState<Partial<User>>({});

  useEffect(() => {
    localStorage.setItem("user_profile", JSON.stringify(user));
  }, [user]);

  const handleSignOut = () => {
    localStorage.removeItem("auth_token");
    toast.success("Signed out successfully");
    navigate("/");
  };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  const openModal = (type: typeof activeModal) => {
    setEditData(user);
    setActiveModal(type);
  };

  const handleSave = () => {
    setUser((prev) => ({ ...prev, ...editData }));
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
    setUser((prev) => ({ ...prev, resume: file.name }));
    toast.success("Resume uploaded successfully!");
  };

  return (
    <div className="min-h-screen gradient-subtle pb-20">
      {/* Header */}
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
              <Avatar className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="text-xl sm:text-2xl font-semibold gradient-primary text-white">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="text-center sm:text-left flex-1 w-full">
                <h2 className="text-lg sm:text-xl font-bold">{user.name}</h2>
                <p className="text-sm sm:text-base text-muted-foreground mt-0.5">{user.role}</p>
                <p className="text-xs sm:text-sm mt-2 leading-relaxed">{user.bio}</p>
                <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-3 mt-3 text-xs sm:text-sm text-muted-foreground">
                  <div className="flex items-center justify-center sm:justify-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary flex-shrink-0" />
                    <span className="truncate">{user.location}</span>
                  </div>
                  <div className="flex items-center justify-center sm:justify-start gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary flex-shrink-0" />
                    <span>{user.experience}</span>
                  </div>
                  <div className="flex items-center justify-center sm:justify-start gap-1.5">
                    <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary flex-shrink-0" />
                    <span className="truncate">{user.email}</span>
                  </div>
                  <div className="flex items-center justify-center sm:justify-start gap-1.5">
                    <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary flex-shrink-0" />
                    <span>{user.phone}</span>
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
            <Button variant="ghost" size="sm" onClick={() => openModal("links")} className="h-8 w-8 p-0">
              <Edit className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="px-4 pb-4 sm:px-6 sm:pb-5 space-y-2">
            {Object.entries(user.links).map(([key, value]) => (
              <Button
                key={key}
                variant="outline"
                className="w-full justify-start gap-2 h-10 text-sm"
                onClick={() => window.open(String(value), "_blank")}
              >
                {key === "github" && <Github className="w-4 h-4 flex-shrink-0" />}
                {key === "linkedin" && <Linkedin className="w-4 h-4 flex-shrink-0" />}
                {key === "leetcode" && <Code2 className="w-4 h-4 flex-shrink-0" />}
                {key === "instagram" && <Instagram className="w-4 h-4 flex-shrink-0" />}
                <span className="truncate">{String(value)}</span>
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* RESUME */}
        <Card className="glass-strong animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <CardHeader className="flex flex-row items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
            <CardTitle className="text-base sm:text-lg">Resume</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => openModal("resume")} className="h-8 w-8 p-0">
              <Edit className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="px-4 pb-4 sm:px-6 sm:pb-5">
            {user.resume ? (
              <div className="flex gap-2 sm:gap-3 items-center">
                <FileText className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-sm truncate flex-1">{user.resume}</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toast.info("Viewing resume...")}
                  className="h-8 text-xs sm:text-sm flex-shrink-0"
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

      {/* ======= MODALS ======= */}
      {/* Profile Edit */}
      <Dialog open={activeModal === "profile"} onOpenChange={() => setActiveModal(null)}>
        <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">Edit Profile Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-3">
            <Input
              placeholder="Full Name"
              value={editData.name ?? ""}
              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
              className="text-sm"
            />
            <Input
              placeholder="Role/Designation"
              value={editData.role ?? ""}
              onChange={(e) => setEditData({ ...editData, role: e.target.value })}
              className="text-sm"
            />
            <Textarea
              placeholder="Short Bio"
              value={editData.bio ?? ""}
              onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
              className="text-sm min-h-[80px]"
            />
            <Input
              placeholder="Contact Number"
              value={editData.phone ?? ""}
              onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
              className="text-sm"
            />
            <Input
              placeholder="Email Address"
              value={editData.email ?? ""}
              onChange={(e) => setEditData({ ...editData, email: e.target.value })}
              className="text-sm"
            />
            <Input
              placeholder="Location"
              value={editData.location ?? ""}
              onChange={(e) => setEditData({ ...editData, location: e.target.value })}
              className="text-sm"
            />
            <Input
              placeholder="Experience"
              value={editData.experience ?? ""}
              onChange={(e) => setEditData({ ...editData, experience: e.target.value })}
              className="text-sm"
            />
          </div>
          <DialogFooter className="mt-4 flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setActiveModal(null)} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button onClick={handleSave} className="w-full sm:w-auto">Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Skills Edit */}
      <Dialog open={activeModal === "skills"} onOpenChange={() => setActiveModal(null)}>
        <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">Edit Skills</DialogTitle>
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
            <Button variant="outline" onClick={() => setActiveModal(null)} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button onClick={handleSave} className="w-full sm:w-auto">Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Links Edit */}
      <Dialog open={activeModal === "links"} onOpenChange={() => setActiveModal(null)}>
        <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">Edit Links</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-3">
            {Object.entries(editData.links || {}).map(([key, value]) => (
              <Input
                key={key}
                placeholder={`${key} URL`}
                value={String(value)}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    links: { ...editData.links, [key]: e.target.value },
                  })
                }
                className="text-sm"
              />
            ))}
            <Button
              variant="outline"
              size="sm"
              className="mt-2 flex items-center gap-2 h-9 text-xs sm:text-sm"
              onClick={() =>
                setEditData({
                  ...editData,
                  links: { ...editData.links, new: "" },
                })
              }
            >
              <Plus className="w-4 h-4" /> Add New Link
            </Button>
          </div>
          <DialogFooter className="mt-4 flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setActiveModal(null)} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button onClick={handleSave} className="w-full sm:w-auto">Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Resume Upload */}
      <Dialog open={activeModal === "resume"} onOpenChange={() => setActiveModal(null)}>
        <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">Upload Resume</DialogTitle>
          </DialogHeader>
          <div className="mt-3">
            <Input
              type="file"
              accept=".pdf,.docx"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleResumeUpload(file);
              }}
              className="text-sm"
            />
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setActiveModal(null)} className="w-full sm:w-auto">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;