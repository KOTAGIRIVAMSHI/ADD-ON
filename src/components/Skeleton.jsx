const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-white/10 rounded-lg ${className}`} />
);

export const ListingCardSkeleton = () => (
  <div className="card-glass p-4 flex gap-4">
    <Skeleton className="w-24 h-24 rounded-xl flex-shrink-0" />
    <div className="flex-1 space-y-3">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-1/4" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  </div>
);

export const EventCardSkeleton = () => (
  <div className="card-glass overflow-hidden flex flex-col md:flex-row">
    <Skeleton className="md:w-64 h-48 md:h-auto" />
    <div className="p-6 space-y-3 flex-1">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/4" />
      <div className="flex gap-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-32" />
      </div>
      <Skeleton className="h-4 w-full" />
    </div>
  </div>
);

export const RideCardSkeleton = () => (
  <div className="card-glass p-6 space-y-4">
    <div className="flex justify-between">
      <div className="flex gap-4">
        <Skeleton className="w-12 h-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
      <Skeleton className="h-6 w-16" />
    </div>
    <div className="space-y-2 pl-8">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
    <div className="flex justify-between">
      <div className="flex gap-4">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-20" />
      </div>
      <Skeleton className="h-10 w-24" />
    </div>
  </div>
);

export const MaterialCardSkeleton = () => (
  <div className="card-glass p-4 flex justify-between items-center">
    <div className="space-y-2 flex-1">
      <Skeleton className="h-5 w-3/4" />
      <div className="flex gap-3">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-12" />
      </div>
    </div>
    <Skeleton className="h-10 w-10" />
  </div>
);

export const ProfileSkeleton = () => (
  <div className="card-glass p-8">
    <div className="flex flex-col md:flex-row gap-8">
      <Skeleton className="w-32 h-32 rounded-3xl" />
      <div className="flex-1 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
        <div className="flex gap-3">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </div>
    </div>
  </div>
);

export const ChatListSkeleton = () => (
  <div className="flex gap-3 p-4 border-b border-white/5">
    <Skeleton className="w-11 h-11 rounded-full" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-3 w-48" />
    </div>
  </div>
);

export default Skeleton;
