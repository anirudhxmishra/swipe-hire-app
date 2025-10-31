// src/pages/Feed.tsx
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import { Settings } from "lucide-react";
import JobCard, { Job } from "@/components/JobCard";
import JobDetailsModal from "@/components/JobDetailsModal";
import FilterButton from "@/components/FilterButton";
import SkeletonCard from "@/components/SkeletonCard";
import { toast } from "sonner";
import logo from "@/assets/logo.png";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";


/** Mock job data */
const mockJobs: Job[] = [
  {
    id: "1",
    title: "Senior Full Stack Developer",
    company: "TechCorp",
    location: "Bengaluru, India",
    postedDate: "2025-10-26T00:00:00Z",
    salaryRange: "₹25L - ₹35L",
    jobType: "Full-time",
    skills: ["React", "Node.js", "TypeScript", "AWS", "MongoDB"],
    matchScore: 95,
    description:
      "We're looking for an experienced full stack developer to join our growing team. You'll work on cutting-edge projects using modern technologies.",
  },
  {
    id: "2",
    title: "Product Designer",
    company: "DesignHub",
    location: "Remote (India)",
    postedDate: "2025-10-23T00:00:00Z",
    salaryRange: "₹18L - ₹25L",
    jobType: "Full-time",
    skills: ["Figma", "UI/UX", "Design Systems", "Prototyping", "User Research"],
    matchScore: 88,
    description:
      "Join our design team to create beautiful, user-centered experiences for millions of users worldwide.",
  },
  {
    id: "3",
    title: "DevOps Engineer",
    company: "CloudScale",
    location: "Hyderabad, India",
    postedDate: "2025-10-19T00:00:00Z",
    salaryRange: "₹22L - ₹30L",
    jobType: "Full-time",
    skills: ["Kubernetes", "Docker", "CI/CD", "AWS", "Terraform"],
    matchScore: 82,
    description:
      "Help us build and maintain scalable infrastructure for our rapidly growing platform.",
  },
  {
    id: "4",
    title: "Data Scientist",
    company: "DataMinds",
    location: "Mumbai, India",
    postedDate: "2025-10-25T00:00:00Z",
    salaryRange: "₹28L - ₹40L",
    jobType: "Full-time",
    skills: ["Python", "Machine Learning", "TensorFlow", "SQL", "Data Visualization"],
    matchScore: 90,
    description:
      "Work with cutting-edge ML models to solve complex business problems and drive insights.",
  },
  {
    id: "5",
    title: "Mobile Developer",
    company: "AppWorks",
    location: "Pune, India",
    postedDate: "2025-10-27T00:00:00Z",
    salaryRange: "₹15L - ₹22L",
    jobType: "Full-time",
    skills: ["React Native", "iOS", "Android", "Swift", "Kotlin"],
    matchScore: 85,
    description:
      "Build beautiful, performant mobile applications used by millions of users.",
  },
];

const Feed = () => {
  const navigate = useNavigate();
  const [jobs] = useState<Job[]>(mockJobs);
  const [displayedJobs, setDisplayedJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const { ref: loadMoreRef, inView } = useInView({ threshold: 0.6 });
  const mountedRef = useRef(false);

  // Initial load (mobile-first: load fewer items)
  useEffect(() => {
    setDisplayedJobs(jobs.slice(0, 3));
    mountedRef.current = true;
  }, [jobs]);

  // Infinite scroll
  useEffect(() => {
    if (!mountedRef.current) return;
    if (inView && !isLoading && displayedJobs.length < jobs.length) {
      loadMoreJobs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  const loadMoreJobs = () => {
    setIsLoading(true);
    // replace setTimeout with real API paging in production
    setTimeout(() => {
      const nextBatch = jobs.slice(displayedJobs.length, displayedJobs.length + 3);
      setDisplayedJobs((prev) => [...prev, ...nextBatch]);
      setIsLoading(false);
    }, 600);
  };

  const handleSwipe = (job: Job, direction: "left" | "right") => {
    if (direction === "right") {
      setShowConfetti(true);
      toast.success(`Applied to ${job.title}!`, {
        description: "Your application is being processed",
      });
      setTimeout(() => setShowConfetti(false), 2500);
      // TODO: call apply API
    } else {
      toast.info("Job skipped");
    }
  };

  const handleSave = (job: Job) => {
    toast.success(`Saved ${job.title}`, {
      description: "You can find it in your saved jobs",
    });
    // TODO: persist saved job in server/local storage
  };

  const handleViewDetails = (job: Job) => {
    setSelectedJob(job);
    setModalOpen(true);
  };

  const handleModalApply = () => {
    if (selectedJob) {
      handleSwipe(selectedJob, "right");
      setModalOpen(false);
    }
  };

  const handleModalSave = () => {
    if (selectedJob) {
      handleSave(selectedJob);
    }
  };

  // compute confetti size safely (guard for SSR)
  const confettiSize = (() => {
    if (typeof window === "undefined") return { w: 360, h: 640 };
    return { w: window.innerWidth, h: window.innerHeight };
  })();

  return (
    <div className="min-h-screen bg-surface pb-safe-6">

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-sm border-b bg-white/60 dark:bg-black/60">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img src={logo} alt="SwipeHire" className="w-8 h-8" />
            <h1 className="text-lg font-semibold">Discover Jobs</h1>
          </div>
          <Button variant="ghost" size="icon" onClick={() => navigate("/settings")} aria-label="Settings">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Main feed */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        <div className="space-y-4">
          {displayedJobs.map((job, index) => (
            <div key={job.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.03}s` }}>
              <JobCard
                job={job}
                onSwipe={(direction) => handleSwipe(job, direction)}
                onSave={() => handleSave(job)}
                onViewDetails={() => handleViewDetails(job)}
              />
            </div>
          ))}

          {isLoading && (
            <div className="space-y-4">
              <SkeletonCard />
              <SkeletonCard />
            </div>
          )}

          {/* Intersection trigger */}
          {displayedJobs.length < jobs.length && (
            <div ref={loadMoreRef} className="h-16 flex items-center justify-center">
              <p className="text-sm text-muted-foreground">Loading more jobs...</p>
            </div>
          )}


          {/* All Caught Up State */}
          {displayedJobs.length >= jobs.length && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="text-center py-14 sm:py-20 px-6"
            >
              {/* Icon Wrapper */}
              <div
                className={cn(
                  "w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 rounded-full",
                  "bg-gradient-to-br from-primary/90 to-accent/90 flex items-center justify-center",
                  "shadow-[0_0_25px_-5px_rgba(var(--primary-rgb),0.4)]"
                )}
              >
                <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-white drop-shadow-md" />
              </div>

              {/* Headline */}
              <h2 className="text-xl sm:text-2xl font-semibold mb-3 text-foreground tracking-tight">
                You’re All Caught Up
              </h2>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto mb-8 leading-relaxed">
                You’ve seen all available job matches for now.
                We’ll notify you when new opportunities appear.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                <Button
                  size="lg"
                  className="w-full sm:w-auto text-sm sm:text-base px-6 py-2 sm:py-3"
                  onClick={() => navigate("/applications")}
                >
                  View My Applications
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto text-sm sm:text-base px-6 py-2 sm:py-3"
                  onClick={() => navigate("/settings")}
                >
                  Update Preferences
                </Button>
              </div>
            </motion.div>
          )}

        </div>

      </main>

      <FilterButton />

      <JobDetailsModal
        job={selectedJob}
        open={modalOpen}
        onOpenChange={setModalOpen}
        onApply={handleModalApply}
        onSave={handleModalSave}
      />
    </div>
  );
};

export default Feed;
