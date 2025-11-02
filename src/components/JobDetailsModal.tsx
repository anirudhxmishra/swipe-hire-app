// src/components/JobDetailsModal.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Briefcase,
  Clock,
  Building,
  Sparkles,
  IndianRupee,
  Star,
  Layers,
  Timer,
  Laptop,
  ClipboardList,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatSalary } from "@/utils/jobUtils";
import { Job } from "@/types/jobs";

interface JobDetailsModalProps {
  job: Job | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: () => void;
  onSave: () => void;
}

const JobDetailsModal = ({
  job,
  open,
  onOpenChange,
  onApply,
  onSave,
}: JobDetailsModalProps) => {
  if (!job) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal>
      <DialogContent className="glass-strong max-w-3xl w-[95%] sm:w-auto max-h-[90vh] p-0 border-2 rounded-2xl overflow-hidden">
        <ScrollArea className="max-h-[75vh]">
          <div className="p-4 sm:p-6">
            {/* Header */}
            <DialogHeader className="mb-6">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-secondary flex items-center justify-center text-2xl sm:text-3xl font-bold text-primary shadow-glow">
                  {job.companyLogo ? (
                    <img
                      src={job.companyLogo}
                      alt={job.company}
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  ) : (
                    job.company.charAt(0)
                  )}
                </div>

                <div className="flex-1">
                  <DialogTitle className="text-xl sm:text-3xl mb-2">
                    {job.title}
                  </DialogTitle>
                  <p className="text-sm sm:text-lg text-muted-foreground flex items-center gap-2">
                    <Building className="h-4 w-4 sm:h-5 sm:w-5" />
                    {job.company}
                  </p>
                </div>

                <Badge className="self-start sm:self-center bg-primary/10 text-primary border-primary/20 text-sm sm:text-base px-3 py-1">
                  <Star className="h-3 w-3 mr-1 inline-block" />{" "}
                  {job.rating.toFixed(1)}
                </Badge>
              </div>
            </DialogHeader>

            {/* --- Job Summary Info --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6">
              <div className="glass p-3 sm:p-4 rounded-xl">
                <div className="flex items-center gap-2 text-muted-foreground text-xs sm:text-sm mb-1">
                  <MapPin className="h-4 w-4" />
                  <span className="font-medium">Location</span>
                </div>
                <p className="font-semibold text-sm sm:text-base">
                  {job.location}
                </p>
              </div>
              <div className="glass p-3 sm:p-4 rounded-xl">
                <div className="flex items-center gap-2 text-muted-foreground text-xs sm:text-sm mb-1">
                  <IndianRupee className="h-4 w-4" />
                  <span className="font-medium">Salary</span>
                </div>
                <p className="font-semibold text-sm sm:text-base">
                  {formatSalary(job.salary)}
                </p>
              </div>
              <div className="glass p-3 sm:p-4 rounded-xl">
                <div className="flex items-center gap-2 text-muted-foreground text-xs sm:text-sm mb-1">
                  <Briefcase className="h-4 w-4" />
                  <span className="font-medium">Job Type</span>
                </div>
                <p className="font-semibold text-sm sm:text-base">
                  {job.jobType}
                </p>
              </div>
              <div className="glass p-3 sm:p-4 rounded-xl">
                <div className="flex items-center gap-2 text-muted-foreground text-xs sm:text-sm mb-1">
                  <Clock className="h-4 w-4" />
                  <span className="font-medium">Posted</span>
                </div>
                <p className="font-semibold text-sm sm:text-base">
                  {job.postedAgo}
                </p>
              </div>
            </div>

            {/* --- Benefits --- */}
            {job.benefits.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Benefits
                </h3>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {job.benefits.map((benefit) => (
                    <Badge
                      key={benefit}
                      variant="secondary"
                      className="text-xs sm:text-sm py-1"
                    >
                      {benefit}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* --- Qualifications --- */}
            {job.qualifications.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base flex items-center gap-2">
                  <ClipboardList className="h-4 w-4" />
                  Qualifications
                </h3>
                <ul className="list-disc list-inside text-xs sm:text-sm text-muted-foreground space-y-1">
                  {job.qualifications.map((q) => (
                    <li key={q}>{q}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* --- Full Description --- */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base flex items-center gap-2">
                <Layers className="h-4 w-4" />
                Role Details
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3 text-xs sm:text-sm text-muted-foreground">
                <p className="flex items-center gap-1">
                  <Sparkles className="h-3 w-3" /> {job.fullDescription.category}
                </p>
                <p className="flex items-center gap-1">
                  <Timer className="h-3 w-3" /> {job.fullDescription.duration}
                </p>
                <p className="flex items-center gap-1">
                  <Laptop className="h-3 w-3" /> {job.fullDescription.workMode}
                </p>
                <p className="flex items-center gap-1">
                  <IndianRupee className="h-3 w-3" /> {job.fullDescription.stipend}
                </p>
              </div>

              <div className="prose prose-sm max-w-none text-muted-foreground">
                {job.fullDescription.description.map((d, i) => (
                  <p key={i} className="mb-2">
                    {d}
                  </p>
                ))}
                <h4 className="mt-3 font-semibold text-foreground">
                  Requirements:
                </h4>
                <ul className="list-disc list-inside space-y-1">
                  {job.fullDescription.requirements.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Bottom Buttons */}
        <div className="flex gap-2 sm:gap-3 sticky bottom-0 bg-card/95 backdrop-blur-lg py-3 sm:py-4 px-4 sm:px-6 border-t rounded-b-2xl">
          <Button
            size="sm"
            variant="outline"
            className="flex-1 text-sm sm:text-base py-2 sm:py-3"
            onClick={onSave}
          >
            Save
          </Button>
          <Button
            size="sm"
            className="flex-1 text-sm sm:text-base py-2 sm:py-3"
            onClick={() => window.open(job.applyUrl, "_blank")}
          >
            Apply Now
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JobDetailsModal;
