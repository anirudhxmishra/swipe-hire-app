import { Job } from "@/components/JobCard";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Briefcase, Clock, Building, Sparkles, IndianRupee } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";

interface JobDetailsModalProps {
  job: Job | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: () => void;
  onSave: () => void;
}

// ✅ Helper for clean date formatting
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const JobDetailsModal = ({ job, open, onOpenChange, onApply, onSave }: JobDetailsModalProps) => {
  if (!job) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal>
      <DialogContent className="glass-strong max-w-3xl w-[95%] sm:w-auto max-h-[90vh] p-0 border-2 rounded-2xl z-[9999] overflow-hidden">
        {/* Scrollable Body */}
        <div className="max-h-[75vh] overflow-y-auto">
          <ScrollArea>
            <div className="p-4 sm:p-6">
              <DialogHeader className="mb-4 sm:mb-6">
                <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-secondary flex items-center justify-center text-2xl sm:text-3xl font-bold text-primary shadow-glow">
                    {job.companyLogo ? (
                      <img src={job.companyLogo} alt={job.company} className="w-full h-full object-cover rounded-2xl" />
                    ) : (
                      job.company.charAt(0)
                    )}
                  </div>
                  <div className="flex-1">
                    <DialogTitle className="text-xl sm:text-3xl mb-1 sm:mb-2">{job.title}</DialogTitle>
                    <p className="text-sm sm:text-lg text-muted-foreground flex items-center gap-2">
                      <Building className="h-4 w-4 sm:h-5 sm:w-5" />
                      {job.company}
                    </p>
                  </div>
                  <Badge className="self-start sm:self-center bg-success/10 text-success hover:bg-success/20 border-success/20 text-xs sm:text-lg px-3 sm:px-4 py-1 sm:py-2">
                    {job.matchScore}% Match
                  </Badge>
                </div>
              </DialogHeader>

              {/* AI Match */}
              <div className="mb-4 sm:mb-6 p-3 sm:p-4 glass rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  <span className="font-semibold text-sm sm:text-base">AI Resume Match Score</span>
                </div>
                <Progress value={job.matchScore} className="h-2 sm:h-3 mb-1" />
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Your profile matches {job.matchScore}% of the requirements for this role.
                </p>
              </div>

              {/* Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                {[
                  { icon: <MapPin className="h-4 w-4" />, label: "Location", value: job.location },
                  { icon: <IndianRupee className="h-4 w-4" />, label: "Salary Range", value: job.salaryRange },
                  { icon: <Briefcase className="h-4 w-4" />, label: "Job Type", value: job.jobType },
                  { icon: <Clock className="h-4 w-4" />, label: "Posted", value: formatDate(job.postedDate) },
                ].map((item) => (
                  <div key={item.label} className="glass p-3 sm:p-4 rounded-xl">
                    <div className="flex items-center gap-2 text-muted-foreground text-xs sm:text-sm mb-1">
                      {item.icon}
                      <span className="font-medium">{item.label}</span>
                    </div>
                    <p className="font-semibold text-sm sm:text-base">{item.value}</p>
                  </div>
                ))}
              </div>

              {/* Skills */}
              <div className="mb-4 sm:mb-6">
                <h3 className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Required Skills</h3>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {job.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs sm:text-sm py-1">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="mb-4 sm:mb-6 prose prose-sm max-w-none text-muted-foreground">
                <p>{job.description}</p>
                <p className="mt-3 sm:mt-4">
                  You'll collaborate with a passionate team using modern technologies to build amazing products.
                </p>
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* Fixed Bottom Buttons */}
        <div className="flex gap-2 sm:gap-3 sticky bottom-0 bg-card/95 backdrop-blur-lg py-3 sm:py-4 px-4 sm:px-6 border-t rounded-b-2xl">
          <Button size="sm" variant="outline" className="flex-1 text-sm sm:text-base py-2 sm:py-3" onClick={onSave}>
            Save
          </Button>
          <Button size="sm" className="flex-1 text-sm sm:text-base py-2 sm:py-3" onClick={onApply}>
            Apply Now
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JobDetailsModal;
