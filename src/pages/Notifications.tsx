// src/pages/Notifications.tsx
import { useState } from "react";
import { Bell, Briefcase, Calendar, Mail, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import logo from "@/assets/logo.png";

interface Notification {
  id: string;
  type: "interview" | "job" | "notifications" | "update";
  title: string;
  description: string;
  timestamp: string;
  unread: boolean;
  icon?: string;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "interview",
    title: "Interview Scheduled",
    description: "TechCorp invited you for an interview next Tuesday at 2:00 PM.",
    timestamp: "2025-10-28T12:00:00Z",
    unread: true,
  },
  {
    id: "2",
    type: "job",
    title: "New Job Match: UI Designer",
    description: "DesignHub has a role matching your preferences.",
    timestamp: "2025-10-27T09:00:00Z",
    unread: false,
  },
  {
    id: "3",
    type: "update",
    title: "Application Viewed",
    description: "Recruiter from DataMinds viewed your application.",
    timestamp: "2025-10-26T15:45:00Z",
    unread: false,
  },
  {
    id: "4",
    type: "notifications",
    title: "New notification from Sarah Johnson",
    description: "We’d like to proceed with the next steps in your application.",
    timestamp: "2025-10-25T18:30:00Z",
    unread: true,
  },
];

const getIcon = (type: string) => {
  switch (type) {
    case "interview":
      return <Calendar className="w-5 h-5 text-blue-500" />;
    case "job":
      return <Briefcase className="w-5 h-5 text-green-500" />;
    case "notifications":
      return <Mail className="w-5 h-5 text-purple-500" />;
    default:
      return <Star className="w-5 h-5 text-yellow-500" />;
  }
};

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/70 dark:bg-black/60 backdrop-blur-md border-b">
        <div className="max-w-2xl mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <img src={logo} alt="SwipeHire" className="w-8 h-8" />
            <h1 className="text-lg font-semibold">Alerts</h1>
          </div>
          <Button size="sm" variant="ghost" onClick={markAllRead}>
            Mark all read
          </Button>
        </div>
      </header>

      {/* Notification list */}
      <main className="max-w-2xl mx-auto px-4 py-5 space-y-4">
        {notifications.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <Bell className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-lg font-semibold mb-1">No new alerts</p>
            <p className="text-sm text-muted-foreground">
              You’re all caught up! Check back later for updates.
            </p>
          </div>
        ) : (
          notifications.map((n) => (
            <Card
              key={n.id}
              className={`transition-all border-l-4 ${
                n.unread ? "border-l-primary bg-muted/30" : "border-l-transparent"
              }`}
            >
              <CardContent className="flex items-start gap-3 p-4">
                <div className="flex-shrink-0">{getIcon(n.type)}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">{n.title}</p>
                  <p className="text-sm text-muted-foreground line-clamp-2">{n.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(n.timestamp).toLocaleString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      day: "numeric",
                      month: "short",
                    })}
                  </p>
                </div>
                {n.unread && <Badge className="text-[10px]">New</Badge>}
              </CardContent>
            </Card>
          ))
        )}
      </main>
    </div>
  );
};

export default Notifications;
