import { Skeleton } from "@/components/ui/skeleton";

const SkeletonCard = () => {
  return (
    <div className="glass-strong rounded-2xl p-6 animate-float-up">
      <div className="flex items-start gap-4 mb-4">
        <Skeleton className="w-16 h-16 rounded-xl shimmer" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-6 w-3/4 shimmer" />
          <Skeleton className="h-4 w-1/2 shimmer" />
        </div>
        <Skeleton className="h-6 w-20 rounded-full shimmer" />
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-5 w-full shimmer" />
        ))}
      </div>

      <div className="flex gap-2 mb-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-7 w-20 rounded-full shimmer" />
        ))}
      </div>

      <Skeleton className="h-16 w-full mb-6 shimmer" />

      <div className="flex gap-3">
        <Skeleton className="h-14 flex-1 rounded-xl shimmer" />
        <Skeleton className="h-14 w-14 rounded-xl shimmer" />
        <Skeleton className="h-14 w-14 rounded-xl shimmer" />
        <Skeleton className="h-14 flex-1 rounded-xl shimmer" />
      </div>
    </div>
  );
};

export default SkeletonCard;
