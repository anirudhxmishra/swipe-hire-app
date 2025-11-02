// src/components/JobCard.tsx
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
import {
  formatSalary,
  getCompanyColorStyle,
  getCompanyInitials,
} from "@/utils/jobUtils";
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
  const [swipeDirection, setSwipeDirection] = useState<
    "left" | "right" | null
  >(null);

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

  // Mouse Events
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

  // Touch Events
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
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center font-bold text-xl sm:text-2xl text-white flex-shrink-0 shadow-md overflow-hidden">
                {job.companyLogo ? (
                  <img
                    src={job.companyLogo}
                    alt={job.company}
                    className="w-full h-full object-cover rounded-xl"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.style.display = "none";
                      const fallback = target.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = "flex";
                    }}
                  />
                ) : null}

                {/* Gradient fallback initials */}
                <div
                  className="absolute inset-0 flex items-center justify-center uppercase"
                  style={getCompanyColorStyle(job.company)}
                >
                  {getCompanyInitials(job.company)}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-lg sm:text-xl font-semibold mb-1 line-clamp-2 leading-tight">
                  {job.title}
                </h3>
                <p className="text-muted-foreground text-sm truncate flex items-center gap-1">
                  <Building className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{job.company}</span>
                </p>
              </div>

              <Badge className="bg-primary/10 text-primary border-primary/20 text-[11px] sm:text-sm mt-8 sm:mt-10 px-2 sm:px-3 py-0.5 sm:py-1 rounded-md flex-shrink-0">
                <Star className="h-3 w-3 mr-1 inline-block" />{" "}
                {job.rating.toFixed(1)}
              </Badge>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4">
              <div className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{job.location}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground">
                <IndianRupee className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{formatSalary(job.salary)}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground">
                <Briefcase className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{job.jobType}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground">
                <Clock className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{job.postedAgo}</span>
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
            <div className="flex items-center gap-2 sm:gap-3 mb-8 sm:mb-6">
              <Button
                variant={liked ? "default" : "outline"}
                size="sm"
                className="flex-1 py-2 sm:py-3"
                onClick={() => {
                  setLiked(!liked);
                  onSave();
                }}
              >
                <Heart
                  className={cn(
                    "h-4 w-4 mr-2",
                    liked && "fill-current text-destructive"
                  )}
                />
                {liked ? "Saved" : "Save"}
              </Button>
              <Button
                size="sm"
                className="flex-1 py-2 sm:py-3"
                onClick={onViewDetails}
              >
                <Info className="h-4 w-4 mr-2" />
                Details
              </Button>
            </div>

            {/* Drag instruction */}
            {!isDragging && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] sm:text-xs text-muted-foreground text-center whitespace-nowrap pointer-events-none">
                Drag or swipe to interact
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default JobCard;
