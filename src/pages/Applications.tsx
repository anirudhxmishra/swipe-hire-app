import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Download, Filter } from "lucide-react";
import logo from "@/assets/logo.png";

interface Application {
  id: string;
  jobTitle: string;
  company: string;
  appliedDate: string;
  status: "applied" | "viewed" | "interview" | "offer" | "rejected";
}

const mockApplications: Application[] = [
  { id: "1", jobTitle: "Senior Full Stack Developer", company: "TechCorp", appliedDate: "2024-01-15", status: "interview" },
  { id: "2", jobTitle: "Product Designer", company: "DesignHub", appliedDate: "2024-01-14", status: "viewed" },
  { id: "3", jobTitle: "DevOps Engineer", company: "CloudScale", appliedDate: "2024-01-12", status: "applied" },
  { id: "4", jobTitle: "Frontend Developer", company: "WebSolutions", appliedDate: "2024-01-10", status: "offer" },
  { id: "5", jobTitle: "Backend Developer", company: "ServerTech", appliedDate: "2024-01-08", status: "rejected" },
];

const statusConfig = {
  applied: { label: "Applied", color: "bg-secondary text-secondary-foreground" },
  viewed: { label: "Viewed", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" },
  interview: { label: "Interview", color: "bg-primary/10 text-primary" },
  offer: { label: "Offer", color: "bg-success/10 text-success" },
  rejected: { label: "Rejected", color: "bg-destructive/10 text-destructive" },
};

const Applications = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [applications] = useState(mockApplications);

  const filteredApplications = applications.filter(
    (app) =>
      app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: applications.length,
    interviews: applications.filter((a) => a.status === "interview").length,
    offers: applications.filter((a) => a.status === "offer").length,
  };

  return (
    <div className="min-h-screen gradient-subtle pb-24">
      {/* Header */}
      <header className="sticky top-0 z-50 glass backdrop-blur-xl border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          {/* Logo + Title + Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3 sm:gap-0">
            <div className="flex items-center gap-3">
              <img src={logo} alt="SwipeHire" className="w-8 h-8" />
              <h1 className="text-lg sm:text-xl font-bold">Applications</h1>
            </div>

            <div className="flex flex-wrap gap-2 justify-center sm:justify-end">
              <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            <div className="gradient-card rounded-xl p-3 sm:p-4 text-center">
              <div className="text-xl sm:text-2xl font-bold text-primary">{stats.total}</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Total</div>
            </div>
            <div className="gradient-card rounded-xl p-3 sm:p-4 text-center">
              <div className="text-xl sm:text-2xl font-bold text-primary">{stats.interviews}</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Interviews</div>
            </div>
            <div className="gradient-card rounded-xl p-3 sm:p-4 text-center">
              <div className="text-xl sm:text-2xl font-bold text-success">{stats.offers}</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Offers</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search applications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 text-sm sm:text-base"
            />
          </div>
        </div>

        {/* List */}
        <div className="space-y-4">
          {filteredApplications.length > 0 ? (
            filteredApplications.map((app) => (
              <div
                key={app.id}
                className="gradient-card rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
                onClick={() => navigate(`/application/${app.id}`)}
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="text-base sm:text-lg font-semibold">{app.jobTitle}</h3>
                      <Badge className={statusConfig[app.status].color}>
                        {statusConfig[app.status].label}
                      </Badge>
                    </div>
                    <p className="text-sm sm:text-base text-muted-foreground">{app.company}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                      Applied on {new Date(app.appliedDate).toLocaleDateString()}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" className="w-full sm:w-auto">
                    View Details
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 sm:py-20">
              <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 rounded-full gradient-subtle flex items-center justify-center">
                <span className="text-3xl sm:text-4xl">📭</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">No applications found</h2>
              <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-0">
                {searchQuery ? "Try adjusting your search" : "Start swiping to apply for jobs!"}
              </p>
              {!searchQuery && (
                <Button className="mt-4 sm:mt-6 w-full sm:w-auto" onClick={() => navigate("/feed")}>
                  Browse Jobs
                </Button>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Applications;
