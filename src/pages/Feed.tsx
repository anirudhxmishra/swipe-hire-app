import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import { Settings, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import JobCard from "@/components/JobCard";
import JobDetailsModal from "@/components/JobDetailsModal";
import FilterButton from "@/components/FilterButton";
import SkeletonCard from "@/components/SkeletonCard";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import logo from "@/assets/logo.png";
import { cn } from "@/lib/utils";
import { Job } from "@/types/jobs";
import { mockJobs } from "@/constant";

/** ✅ Main Feed Component */
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

  // Initial load
  useEffect(() => {
    setDisplayedJobs(jobs.slice(0, 2));
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
    setTimeout(() => {
      const nextBatch = jobs.slice(
        displayedJobs.length,
        displayedJobs.length + 2
      );
      setDisplayedJobs((prev) => [...prev, ...nextBatch]);
      setIsLoading(false);
    }, 600);
  };

  /** ✅ Swipe, Save & Modal Logic */
  const handleSwipe = (job: Job, direction: "left" | "right") => {
    if (direction === "right") {
      setShowConfetti(true);
      toast.success(`Applied to ${job.title}!`, {
        description: "Your application is being processed.",
      });
      setTimeout(() => setShowConfetti(false), 2500);
      // TODO: call apply API
    } else {
      toast.info("Job skipped.");
    }
  };

  const handleSave = (job: Job) => {
    toast.success(`Saved ${job.title}`, {
      description: "You can find it in your saved jobs.",
    });
    // TODO: persist saved job
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
    if (selectedJob) handleSave(selectedJob);
  };

  // Safe confetti dimensions
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
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/settings")}
            aria-label="Settings"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Main Feed */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        <div className="space-y-4">
          {displayedJobs.map((job, index) => (
            <div
              key={job.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
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

          {/* Infinite Scroll Trigger */}
          {displayedJobs.length < jobs.length && (
            <div ref={loadMoreRef} className="h-16 flex items-center justify-center">
              <p className="text-sm text-muted-foreground">Loading more jobs...</p>
            </div>
          )}

          {/* All Caught Up */}
          {displayedJobs.length >= jobs.length && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="text-center py-14 sm:py-20 px-6"
            >
              <div
                className={cn(
                  "w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 rounded-full",
                  "bg-gradient-to-br from-primary/90 to-accent/90 flex items-center justify-center",
                  "shadow-[0_0_25px_-5px_rgba(var(--primary-rgb),0.4)]"
                )}
              >
                <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-white drop-shadow-md" />
              </div>

              <h2 className="text-xl sm:text-2xl font-semibold mb-3 text-foreground tracking-tight">
                You’re All Caught Up
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto mb-8 leading-relaxed">
                You’ve seen all available job matches for now.
                We’ll notify you when new opportunities appear.
              </p>

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
