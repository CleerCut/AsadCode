import PropTypes from "prop-types";
import { Skeleton, SkeletonCardGrid } from "@/common/components/loader/skeleton-loader.component";
import { CREATOR_CARD_GRID_CLASS } from "@/common/constants/creator-card-layout.constant";

const ROOT_DEFAULT =
  "flex min-h-0 flex-1 flex-col overflow-hidden border-r border-gray-200 bg-gradient-to-b from-gray-100 to-gray-50/80";
const ROOT_EMBEDDED =
  "flex h-full min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden bg-gradient-to-b from-gray-100 to-gray-50/80";
const ROOT_APPLICATIONS =
  "flex min-h-0 min-w-0 w-full flex-1 flex-col border-r border-gray-200 bg-white p-3 sm:p-4";

function CreatorProgressRowSkeleton() {
  return (
    <div>
      <div className="flex items-start gap-3 rounded-xl border border-gray-100 bg-white p-3 shadow-sm sm:gap-4 sm:p-4 md:hidden">
        <Skeleton className="h-24 w-16 shrink-0 rounded-lg sm:h-28 sm:w-20" />
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-24" />
          <div className="grid grid-cols-1 gap-2 pt-2">
            <Skeleton className="h-8 w-full rounded-lg" />
            <Skeleton className="h-8 w-full rounded-lg" />
          </div>
        </div>
      </div>
      <div className="hidden items-start space-x-4 rounded-lg border border-gray-100 bg-white p-4 shadow-sm md:flex">
        <Skeleton circle className="h-20 w-20 shrink-0" />
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-6 w-20 rounded-lg" />
          </div>
          <Skeleton className="h-4 w-32" />
          <div className="grid grid-cols-2 gap-2 pt-2 lg:grid-cols-3">
            <Skeleton className="h-8 w-full rounded-lg" />
            <Skeleton className="h-8 w-full rounded-lg" />
            <Skeleton className="h-8 w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MiddlePaneSkeleton({ variant = "default", embedded = false }) {
  if (variant === "applications") {
    return (
      <div className={ROOT_APPLICATIONS}>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
          <div className="h-10 w-full max-w-[10rem] animate-pulse rounded bg-gray-200 sm:w-32" />
        </div>
        <SkeletonCardGrid count={6} gridClass={CREATOR_CARD_GRID_CLASS} />
      </div>
    );
  }

  const rootClassName = embedded ? ROOT_EMBEDDED : ROOT_DEFAULT;

  return (
    <div className={rootClassName}>
      <div className="z-10 shrink-0 border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur-sm">
        <div className="p-2.5 sm:p-4">
          <div className="mb-2 space-y-1.5 sm:mb-3">
            <Skeleton className="h-5 w-36 sm:h-6 sm:w-44" />
            <Skeleton className="h-3 w-56 sm:h-4 sm:w-72" />
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
            <Skeleton className="h-9 w-full sm:max-w-xs md:max-w-sm" />
            <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:flex-wrap sm:justify-end">
              <Skeleton className="h-9 w-full rounded-md sm:w-28" />
              <Skeleton className="h-9 w-full rounded-md sm:w-24" />
              <Skeleton className="h-9 w-full rounded-md sm:w-28" />
              <Skeleton className="h-9 w-full rounded-md sm:w-32" />
            </div>
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-3 sm:p-4">
        <div className="mx-auto max-w-5xl space-y-3 sm:space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <CreatorProgressRowSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

MiddlePaneSkeleton.propTypes = {
  variant: PropTypes.oneOf(["default", "applications"]),
  embedded: PropTypes.bool,
};
