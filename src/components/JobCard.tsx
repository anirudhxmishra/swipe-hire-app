import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Clock,
  Briefcase,
  Heart,
  Info,
  IndianRupee,
  Building,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatSalary, getCompanyInitials } from "@/utils/jobUtils";
import { Job } from "@/types/jobs";

interface JobCardProps {
  job: Job;
  onSwipe: (direction: "left" | "right") => void;
  onSave: () => void;
  onViewDetails: () => void;
  style?: React.CSSProperties;
}

const JobCard = ({
  job,
  onSwipe,
  onSave,
  onViewDetails,
  style,
}: JobCardProps) => {
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(
    null
  );
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [liked, setLiked] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(
    null
  );

  const triggerVanish = (direction: "left" | "right") => {
    setSwipeDirection(direction);
    setIsVisible(false);
    setTimeout(() => onSwipe(direction), 300);
  };

  const resetPosition = () => {
    setDragStart(null);
    setDragOffset({ x: 0, y: 0 });
    setIsDragging(false);
  };

  const endDrag = () => {
    if (!isDragging) return;
    const threshold = 100;
    if (Math.abs(dragOffset.x) > threshold) {
      const direction = dragOffset.x > 0 ? "right" : "left";
      triggerVanish(direction);
    } else {
      resetPosition();
    }
  };

  // --- Mouse Events ---
  const handleMouseDown = (e: React.MouseEvent) => {
    setDragStart({ x: e.clientX, y: e.clientY });
    setIsDragging(true);
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragStart || !isDragging) return;
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    setDragOffset({ x: deltaX, y: deltaY });
  };
  const handleMouseUp = () => endDrag();

  // --- Touch Events ---
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setDragStart({ x: touch.clientX, y: touch.clientY });
    setIsDragging(true);
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!dragStart || !isDragging) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - dragStart.x;
    const deltaY = touch.clientY - dragStart.y;
    if (Math.abs(deltaY) > Math.abs(deltaX)) {
      resetPosition();
      return;
    }
    setDragOffset({ x: deltaX, y: deltaY });
  };
  const handleTouchEnd = () => endDrag();

  const rotation = dragOffset.x * 0.1;
  const opacity = Math.max(0, Math.min(1, Math.abs(dragOffset.x) / 100));

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key={job.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{
            opacity: 1,
            scale: 1,
            x: dragOffset.x,
            y: dragOffset.y,
            rotate: rotation,
          }}
          exit={{
            x: swipeDirection === "right" ? 400 : -400,
            opacity: 0,
            rotate: swipeDirection === "right" ? 20 : -20,
            transition: { duration: 0.3 },
          }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className={cn(
            "relative glass-strong rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing select-none transition-smooth hover:shadow-xl w-full max-w-md mx-auto touch-none",
            isDragging && "shadow-xl scale-105"
          )}
          style={{ ...style, touchAction: "pan-y" }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Swipe Overlays */}
          <div
            className="swipe-overlay-apply text-2xl sm:text-4xl"
            style={{ opacity: dragOffset.x > 50 ? opacity : 0 }}
          >
            ✓ APPLY
          </div>
          <div
            className="swipe-overlay-skip text-2xl sm:text-4xl"
            style={{ opacity: dragOffset.x < -50 ? opacity : 0 }}
          >
            ✗ SKIP
          </div>

          {/* Card Content */}
          <div className="p-4 sm:p-6">
            {/* Header */}
            <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-secondary flex items-center justify-center text-xl sm:text-2xl font-bold text-primary flex-shrink-0 shadow-md overflow-hidden">
                {job.companyLogo ? (
                  <img
                    src={job.companyLogo}
                    alt={job.company}
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <span className="text-lg sm:text-xl font-semibold text-primary/90">
                    {getCompanyInitials(job.company)}
                  </span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-lg sm:text-xl font-semibold mb-1 truncate">
                  {job.title}
                </h3>
                <p className="text-muted-foreground text-sm truncate flex items-center gap-1">
                  <Building className="h-4 w-4" /> {job.company}
                </p>
              </div>

              <Badge className="bg-primary/10 text-primary border-primary/20 text-xs sm:text-sm">
                <Star className="h-3 w-3 mr-1 inline-block" />{" "}
                {job.rating.toFixed(1)}
              </Badge>
            </div>

            {/* Info */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4">
              <div className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground truncate">
                <MapPin className="h-4 w-4" />
                {job.location}
              </div>
              <div className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground truncate">
                <IndianRupee className="h-4 w-4" />
                {formatSalary(job.salary)}
              </div>
              <div className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground truncate">
                <Briefcase className="h-4 w-4" />
                {job.jobType}
              </div>
              <div className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground truncate">
                <Clock className="h-4 w-4" />
                {job.postedAgo}
              </div>
            </div>

            {/* Benefits & Qualifications */}
            <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4">
              {job.benefits.slice(0, 3).map((benefit) => (
                <Badge
                  key={benefit}
                  variant="secondary"
                  className="text-xs sm:text-sm py-1"
                >
                  {benefit}
                </Badge>
              ))}
              {job.qualifications.length > 0 && (
                <Badge variant="secondary" className="text-xs sm:text-sm py-1">
                  {job.qualifications[0]}
                </Badge>
              )}
            </div>

            {/* Short Description */}
            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3 mb-5">
              {job.fullDescription.description[0]}
            </p>

            {/* Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              <Button
                size="sm"
                variant="outline"
                className="flex-1 text-xs sm:text-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  triggerVanish("left");
                }}
              >
                Skip
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  setLiked(!liked);
                  onSave();
                }}
              >
                <Heart
                  className={cn(
                    "h-4 w-4 sm:h-5 sm:w-5 transition-colors",
                    liked ? "text-red-500 fill-red-500" : "text-muted-foreground"
                  )}
                />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetails();
                }}
              >
                <Info className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
              <Button
                size="sm"
                className="flex-1 text-xs sm:text-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  triggerVanish("right");
                }}
              >
                Apply
              </Button>
            </div>
          </div>

          {!isDragging && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] sm:text-xs text-muted-foreground">
              Drag or swipe to interact
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default JobCard;
