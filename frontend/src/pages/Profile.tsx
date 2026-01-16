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
  FileText,
  LogOut,
  Settings,
  Camera,
  Plus,
  Trash2,
  ExternalLink,
} from "lucide-react";
// Import the helper functions and skills list
import { skillSuggestions, getSocialIcon, getSocialLabel } from "../constant";
import { useAuth } from "@/context/AuthContext";

const API_BASE_URL = "http://localhost:8096";

interface UserProfile {
  fullName: string;
  email: string;
  phoneNumber: string;
  targetRole: string;
  experienceYears: number;
  bio: string;
  skills: string[];
  preferredLocation: string;
  socialLinks: string[]; // Dynamic list of links
  profilePictureUrl: string;
  resumeUrl: string;
  minSalary?: number;
  remoteOnly?: boolean;
}

const Profile = () => {

  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeModal, setActiveModal] = useState<null | "profile" | "skills" | "links" | "resume" | "photo">(null);
  const [editData, setEditData] = useState<Partial<UserProfile>>({});
  const [newLinkInput, setNewLinkInput] = useState("");



  //  Gkrrr Way for making authorization
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    toast.error("Please log in.");
    navigate("/login");
  }



  // === Fetch profile ===
  const fetchProfileData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/profile/me`, { credentials: "include" });
      if (response.ok) {
        const data = await response.json();
        if (!data.skills) data.skills = [];
        if (!data.socialLinks) data.socialLinks = [];
        setUser(data);
      } else {
        toast.error("Please log in.");
        navigate("/login");
      }
    } catch {
      toast.error("Server error.");
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => { fetchProfileData(); }, [navigate]);

  // === Helper: Construct robust Image / file URL ===
  const getFullUrl = (path: string | undefined) => {
    if (!path) return "";
    const t = (typeof path === "string") ? path.trim() : "";
    if (!t) return "";
    if (t.startsWith("http://") || t.startsWith("https://")) return t;
    // Ensure single leading slash
    if (!t.startsWith("/")) return `${API_BASE_URL}/${t}`;
    return `${API_BASE_URL}${t}`;
  };

  // sanitize a url for display / labeling
  const normalizeLinkForDisplay = (raw: string) => {
    if (!raw) return "";
    let link = raw.trim();
    link = link.replace(/^https?:\/\//i, "");
    link = link.replace(/^www\./i, "");
    return link;
  };

  // === File Upload Logic ===
  const uploadFile = async (file: File, endpoint: string, fieldToUpdate: "profilePictureUrl" | "resumeUrl") => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${API_BASE_URL}/api/profile/${endpoint}`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (response.ok) {
        // backend may return plain text path or json
        const text = await response.text();
        // clean quotes if present
        const fileUrl = text.replace(/^"|"$/g, "");
        setUser((prev) => prev ? ({ ...prev, [fieldToUpdate]: fileUrl }) : null);
        toast.success("Upload successful!");
        setActiveModal(null);
      } else {
        toast.error("Upload failed.");
      }
    } catch (e) {
      toast.error("Server error.");
    }
  };

  // === Save Logic ===
  const handleSave = async () => {
    if (!user) return;
    try {
      // auto-add unsaved link if present
      let finalLinks = editData.socialLinks || [];
      if (activeModal === "links" && newLinkInput.trim()) {
        finalLinks = [...finalLinks, newLinkInput.trim()];
      }

      const payload = {
        ...editData,
        experienceYears: Number(editData.experienceYears || 0),
        minSalary: Number(editData.minSalary || 0),
        socialLinks: finalLinks,
      };

      const response = await fetch(`${API_BASE_URL}/api/profile/setup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success("Profile updated!");
        setActiveModal(null);
        setNewLinkInput("");
        fetchProfileData();
      } else {
        toast.error("Failed to update.");
      }
    } catch {
      toast.error("Error connecting.");
    }
  };

  const handleSignOut = async () => {
    await fetch(`${API_BASE_URL}/logout`, { method: "POST", credentials: "include" });
    navigate("/");
  };

  const openModal = (type: typeof activeModal) => {
    if (user) setEditData({ ...user });
    setNewLinkInput("");
    setActiveModal(type);
  };

  const handleSkillToggle = (skill: string) => {
    setEditData((prev) => {
      const skills = prev?.skills || [];
      return { ...prev, skills: skills.includes(skill) ? skills.filter(s => s !== skill) : [...skills, skill] };
    });
  };

  // === Link Management ===
  const handleAddLink = () => {
    const trimmed = newLinkInput.trim();
    if (!trimmed) return;
    setEditData((prev) => ({
      ...prev,
      socialLinks: [...(prev.socialLinks || []), trimmed],
    }));
    setNewLinkInput("");
  };

  const handleRemoveLink = (linkToRemove: string) => {
    setEditData((prev) => ({
      ...prev,
      socialLinks: (prev.socialLinks || []).filter(l => l !== linkToRemove),
    }));
  };

  // Small helper used to open external links safely
  const openExternal = (link: string) => {
    if (!link) return;
    const target = link.startsWith("http") ? link : `https://${link}`;
    window.open(target, "_blank", "noopener,noreferrer");
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  if (!user) return <div className="flex justify-center items-center min-h-screen">No Profile Found</div>;

  return (
    <div className="min-h-screen bg-slate-50 pb-28 md:pb-20">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Logo" className="w-8 h-8" />
            <h1 className="text-lg md:text-xl font-semibold">Profile</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => navigate("/settings")} aria-label="Settings">
              <Settings className="h-5 w-5" />
            </Button>
            {/* <Button variant="ghost" size="icon" onClick={() => openModal("profile")} aria-label="Edit profile">
              <Edit className="h-5 w-5" />
            </Button> */}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* DETAILS CARD */}
        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>Details</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => openModal("profile")}><Edit className="w-4 h-4" /></Button>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
              <div className="relative group">
                <button
                  onClick={() => openModal("photo")}
                  className="relative rounded-full overflow-hidden w-24 h-24 sm:w-28 sm:h-28 border-2 border-slate-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary"
                  aria-label="Change photo"
                >
                  <Avatar className="w-full h-full">
                    <AvatarImage
                      key={user.profilePictureUrl}
                      src={getFullUrl(user.profilePictureUrl)}
                      className="object-cover w-full h-full"
                    />
                    <AvatarFallback className="text-2xl bg-primary text-white">
                      {user.fullName?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera className="text-white w-5 h-5" />
                  </div>
                </button>
              </div>

              <div className="text-center sm:text-left flex-1">
                <h2 className="text-xl md:text-2xl font-bold truncate">{user.fullName}</h2>
                <p className="text-slate-600">{user.targetRole}</p>
                <p className="text-sm text-slate-500 mt-2 line-clamp-3">{user.bio}</p>
                <div className="flex flex-wrap justify-center sm:justify-start gap-3 mt-4 text-sm text-slate-600">
                  <div className="flex items-center gap-1"><MapPin className="w-4 h-4" />{user.preferredLocation || <span className="text-slate-400">Not set</span>}</div>
                  <div className="flex items-center gap-1"><Briefcase className="w-4 h-4" />{user.experienceYears ?? 0} Years</div>
                  <div className="flex items-center gap-1"><Mail className="w-4 h-4" />{user.email}</div>
                  <div className="flex items-center gap-1"><Phone className="w-4 h-4" />{user.phoneNumber || <span className="text-slate-400">Not set</span>}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SKILLS CARD */}
        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>Skills</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => openModal("skills")}><Edit className="w-4 h-4" /></Button>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {(user.skills && user.skills.length > 0) ? user.skills.map(s => <Badge key={s} variant="secondary">{s}</Badge>) : <p className="text-sm text-slate-400">No skills added.</p>}
            </div>
          </CardContent>
        </Card>

        {/* SOCIAL LINKS CARD */}
        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>Social Links</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => openModal("links")}><Edit className="w-4 h-4" /></Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {user.socialLinks && user.socialLinks.length > 0 ? (
              <div className="grid grid-cols-1 gap-2">
                {user.socialLinks.map((link, i) => {
                  const Icon = getSocialIcon(link);
                  const label = getSocialLabel(link) || normalizeLinkForDisplay(link);
                  return (
                    <button
                      key={i}
                      onClick={() => openExternal(link)}
                      className="w-full px-3 py-2 flex items-center gap-3 border rounded-md bg-white hover:shadow-sm text-left"
                    >
                      <Icon className="w-5 h-5 text-slate-600" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{label}</div>
                        <div className="text-xs text-slate-400 truncate">{normalizeLinkForDisplay(link)}</div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-slate-400" />
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-slate-400">No links added.</p>
            )}
          </CardContent>
        </Card>

        {/* RESUME CARD */}
        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>Resume</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => openModal("resume")}><Edit className="w-4 h-4" /></Button>
          </CardHeader>
          <CardContent>
            {user.resumeUrl ? (
              <div className="flex items-center gap-3 p-3 border rounded-md bg-slate-50">
                <FileText className="w-5 h-5 text-primary" />
                <span className="text-sm truncate flex-1">Resume Uploaded</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.open(getFullUrl(user.resumeUrl), "_blank")}
                >
                  Download / View
                </Button>
              </div>
            ) : <p className="text-sm text-slate-400">No resume uploaded.</p>}
          </CardContent>
        </Card>

        <Button variant="destructive" className="w-full" onClick={handleSignOut}><LogOut className="w-4 h-4 mr-2" />Sign Out</Button>
      </main>

      {/* === MODALS === */}

      {/* Edit Profile Modal */}
      <Dialog open={activeModal === "profile"} onOpenChange={() => setActiveModal(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 py-4">
            <Input placeholder="Full Name" value={editData.fullName ?? ""} onChange={e => setEditData({ ...editData, fullName: e.target.value })} />
            <Input placeholder="Role" value={editData.targetRole ?? ""} onChange={e => setEditData({ ...editData, targetRole: e.target.value })} />
            <Textarea placeholder="Bio" value={editData.bio ?? ""} onChange={e => setEditData({ ...editData, bio: e.target.value })} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input placeholder="Phone" value={editData.phoneNumber ?? ""} onChange={e => setEditData({ ...editData, phoneNumber: e.target.value })} />
              <Input placeholder="Location" value={editData.preferredLocation ?? ""} onChange={e => setEditData({ ...editData, preferredLocation: e.target.value })} />
            </div>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Exp (Years)"
                value={editData.experienceYears ?? ""}
                onChange={e => setEditData({ ...editData, experienceYears: Number(e.target.value) })}
              />
              <Input
                type="number"
                placeholder="Min Salary"
                value={editData.minSalary ?? ""}
                onChange={e => setEditData({ ...editData, minSalary: Number(e.target.value) })}
              />
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row sm:justify-end gap-2">
            <Button variant="outline" onClick={() => setActiveModal(null)}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Skills Modal */}
      <Dialog open={activeModal === "skills"} onOpenChange={() => setActiveModal(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Skills</DialogTitle>
          </DialogHeader>
          <div className="flex flex-wrap gap-2 py-4 max-h-[300px] overflow-y-auto">
            {skillSuggestions.map(s => {
              const selected = editData.skills?.includes(s);
              return (
                <button
                  key={s}
                  onClick={() => handleSkillToggle(s)}
                  className={`px-3 py-1 rounded-full text-sm border ${selected ? "bg-primary text-white" : "bg-white text-slate-700"}`}
                >
                  {s}
                </button>
              );
            })}
          </div>
          <DialogFooter className="flex-col sm:flex-row sm:justify-end gap-2">
            <Button variant="outline" onClick={() => setActiveModal(null)}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Links Modal - improved mobile UI */}
      <Dialog open={activeModal === "links"} onOpenChange={() => setActiveModal(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Manage Links</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-3">
            {/* On small screens stack input and button; on larger screens keep in row */}
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                placeholder="Add URL (e.g. github.com/user)"
                value={newLinkInput}
                onChange={(e) => setNewLinkInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddLink()}
              />
              <Button onClick={handleAddLink} size="icon" aria-label="Add link" className="sm:w-auto">
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-2 max-h-[260px] overflow-y-auto">
              {(editData.socialLinks && editData.socialLinks.length > 0) ? (
                editData.socialLinks.map((link, i) => {
                  const Icon = getSocialIcon(link);
                  return (
                    <div key={i} className="flex items-center justify-between p-2 border rounded-md bg-white">
                      <div className="flex items-center gap-3 min-w-0">
                        <Icon className="w-5 h-5 text-slate-600 flex-shrink-0" />
                        <div className="min-w-0">
                          <div className="text-sm truncate">{getSocialLabel(link) || normalizeLinkForDisplay(link)}</div>
                          <div className="text-xs text-slate-400 truncate">{normalizeLinkForDisplay(link)}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => openExternal(link)} aria-label="Open link">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleRemoveLink(link)} aria-label="Remove link">
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-center text-sm text-slate-400">No links added.</p>
              )}
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row sm:justify-end gap-2">
            <Button variant="outline" onClick={() => setActiveModal(null)}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Resume Modal */}
      <Dialog open={activeModal === "resume"} onOpenChange={() => setActiveModal(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Upload Resume</DialogTitle></DialogHeader>
          <div className="py-3">
            <label className="flex flex-col gap-2">
              <span className="text-sm text-slate-500">Accepted: .pdf, .docx</span>
              <Input
                type="file"
                accept=".pdf,.docx"
                onChange={e => { if (e.target.files?.[0]) uploadFile(e.target.files[0], "upload-resume", "resumeUrl"); }}
              />
            </label>
          </div>
          <DialogFooter><Button onClick={() => setActiveModal(null)}>Close</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Photo Modal */}
      <Dialog open={activeModal === "photo"} onOpenChange={() => setActiveModal(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Update Photo</DialogTitle></DialogHeader>
          <div className="py-3">
            <label className="flex flex-col gap-2">
              <span className="text-sm text-slate-500">Choose an image</span>
              <Input
                type="file"
                accept="image/*"
                onChange={e => { if (e.target.files?.[0]) uploadFile(e.target.files[0], "upload-photo", "profilePictureUrl"); }}
              />
            </label>
          </div>
          <DialogFooter><Button onClick={() => setActiveModal(null)}>Close</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* bottom spacing for mobile - sticky footer style save (optional) */}
      <div className="fixed left-0 right-0 bottom-0 bg-white/80 backdrop-blur-md border-t p-3 md:hidden">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => navigate("/")}>Back</Button>
            <Button className="flex-1" onClick={() => toast("Tip: edit a section and press Save in the modal")}>Help</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
