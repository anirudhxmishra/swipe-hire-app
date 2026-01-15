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
import { Job } from "@/types/jobs";

/* ---------------------------------------------------------
   API CONFIG
--------------------------------------------------------- */
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8096";

/* ---------------------------------------------------------
   TYPES
--------------------------------------------------------- */
interface JobFullDescription {
  category: string;
  stipend: string;
  duration: string;
  workMode: string;
  description: string[];
  requirements: string[];
}

interface ApiJob
  extends Omit<Job, "benefits" | "qualifications" | "fullDescription"> {
  benefits: string;
  qualifications: string;
  fullDescription: string;
}

/* ---------------------------------------------------------
   HELPERS
--------------------------------------------------------- */
/**
 * Safely parses JSON strings from the backend. 
 * If the DB contains plain text instead of JSON, it catches the error 
 * and uses the fallback value to prevent the app from crashing.
 */
const safeJsonParse = <T,>(value: string | T, fallback: T, fieldName: string): T => {
  if (typeof value !== "string") return value;
  if (!value || value === "null") return fallback;
  try {
    return JSON.parse(value) as T;
  } catch (err) {
    console.warn(`⚠️ [JSON Parse Error] Field "${fieldName}" failed to parse. Received:`, value);
    return fallback;
  }
};

/* ---------------------------------------------------------
   FEED COMPONENT
--------------------------------------------------------- */
const Feed = () => {
  const navigate = useNavigate();

  // State Management
  const [jobs, setJobs] = useState<Job[]>([]);
  const [displayedJobs, setDisplayedJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Infinite Scroll Hook
  const { ref: loadMoreRef, inView } = useInView({ threshold: 0.6 });
  const mountedRef = useRef(false);

  /* ---------------------------------------------------------
     FETCH JOBS (AUTO RUN ON MOUNT)
  --------------------------------------------------------- */
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoading(true);
        console.log("🚀 [Step 1] Triggering n8n external fetch via Backend...");
        
        // 1. Sync data from n8n to Database
        const syncRes = await fetch(`${API_URL}/api/jobs/fetch-external`);
        console.log("📡 [Sync Request Status]:", syncRes.status);

        if (syncRes.status === 401) {
          console.error("⛔ [Auth Error] 401 Unauthorized. Check SecurityConfig.java permitAll rules.");
        }

        // 2. Load the newly synced jobs from the Database
        console.log("🚀 [Step 2] Fetching list from local database...");
        const response = await fetch(`${API_URL}/api/jobs`);
        
        if (!response.ok) {
          console.error("❌ [HTTP Error] Jobs fetch failed with status:", response.status);
          throw new Error(`Failed to fetch jobs: ${response.status}`);
        }

        const rawData = (await response.json()) as ApiJob[];
        console.log("📦 [Raw Data Received from DB]:", rawData);

        if (!Array.isArray(rawData) || rawData.length === 0) {
          console.warn("⚠️ [Data Warning] No jobs returned from database.");
        }

        // 3. Map and Parse JSON strings
        const parsedData: Job[] = rawData.map((job, index) => ({
          ...job,
          benefits: safeJsonParse<string[]>(job.benefits, [], `job[${index}].benefits`),
          qualifications: safeJsonParse<string[]>(job.qualifications, [], `job[${index}].qualifications`),
          fullDescription: safeJsonParse<JobFullDescription>(
            job.fullDescription,
            {
              category: "",
              stipend: "",
              duration: "",
              workMode: "",
              description: [],
              requirements: [],
            },
            `job[${index}].fullDescription`
          ),
        }));

        console.log("✅ [Final Parsed Data Ready for UI]:", parsedData);
        setJobs(parsedData);
        setDisplayedJobs(parsedData.slice(0, 5));
        mountedRef.current = true;

      } catch (error) {
        console.error("🔴 [Critical Component Error]:", error);
        toast.error("Could not load jobs from server.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  /* ---------------------------------------------------------
     INFINITE SCROLL LOGIC
  --------------------------------------------------------- */
  useEffect(() => {
    if (!mountedRef.current) return;
    if (inView && !isLoading && displayedJobs.length < jobs.length) {
      loadMoreJobs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  const loadMoreJobs = () => {
    setIsLoading(true);
    console.log("🔄 Loading next batch of 5 jobs...");
    setTimeout(() => {
      const nextBatch = jobs.slice(
        displayedJobs.length,
        displayedJobs.length + 5
      );
      setDisplayedJobs((prev) => [...prev, ...nextBatch]);
      setIsLoading(false);
    }, 600);
  };

  /* ---------------------------------------------------------
     USER ACTIONS
  --------------------------------------------------------- */
  const handleSwipe = (job: Job, direction: "left" | "right") => {
    if (direction === "right") {
      setShowConfetti(true);
      toast.success(`Applied to ${job.title}!`);
      setTimeout(() => setShowConfetti(false), 2500);
    } else {
      toast.info("Job skipped.");
    }
  };

  const handleSave = (job: Job) => {
    toast.success(`Saved ${job.title}`);
  };

  const handleViewDetails = (job: Job) => {
    setSelectedJob(job);
    setModalOpen(true);
  };

  /* ---------------------------------------------------------
     UI RENDER
  --------------------------------------------------------- */
  return (
    <div className="min-h-screen bg-surface pb-safe-6">
      {/* STICKY HEADER */}
      <header className="sticky top-0 z-50 backdrop-blur-sm border-b bg-white/60">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="SwipeHire" className="w-8 h-8" />
            <h1 className="text-lg font-semibold">Discover Jobs</h1>
          </div>
          <Button variant="ghost" size="icon" onClick={() => navigate("/settings")}>
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* FEED CONTENT */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        <div className="space-y-4">
          {displayedJobs.map((job, index) => (
            <div key={job.id || `job-${index}`} style={{ animationDelay: `${index * 0.05}s` }}>
              <JobCard
                job={job}
                onSwipe={(direction) => handleSwipe(job, direction)}
                onSave={() => handleSave(job)}
                onViewDetails={() => handleViewDetails(job)}
              />
            </div>
          ))}

          {/* SKELETON LOADERS */}
          {isLoading && (
            <>
              <SkeletonCard />
              <SkeletonCard />
            </>
          )}

          {/* INFINITE SCROLL TARGET */}
          {displayedJobs.length < jobs.length && (
            <div ref={loadMoreRef} className="h-16 flex justify-center items-center">
              <p className="text-sm text-muted-foreground">Loading more jobs…</p>
            </div>
          )}

          {/* EMPTY STATES */}
          {displayedJobs.length >= jobs.length && jobs.length > 0 && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="text-center py-20"
            >
              <CheckCircle2 className="w-12 h-12 mx-auto text-green-500" />
              <h2 className="text-xl font-semibold mt-4">You’re All Caught Up</h2>
            </motion.div>
          )}

          {jobs.length === 0 && !isLoading && (
            <div className="text-center py-20">
              <p className="text-muted-foreground">No jobs found in the database.</p>
              <Button 
                variant="link" 
                onClick={() => window.location.reload()}
              >
                Try refreshing
              </Button>
            </div>
          )}
        </div>
      </main>

      <FilterButton />

      {/* MODAL VIEW */}
      <JobDetailsModal
        job={selectedJob}
        open={modalOpen}
        onOpenChange={setModalOpen}
        onApply={() => selectedJob && handleSwipe(selectedJob, "right")}
        onSave={() => selectedJob && handleSave(selectedJob)}
      />
    </div>
  );
};

export default Feed;