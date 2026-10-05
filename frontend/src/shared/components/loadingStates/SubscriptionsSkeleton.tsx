import { Skeleton } from "@/components/ui/skeleton";

export const SubscriptionsSkeleton = () => {
  return (
    <div className="w-full bg-(--bg-primary-dashboard) px-8 py-7">
      <Skeleton className="h-8 w-36 bg-(--content-outline)" />
      <Skeleton className="mt-3 mb-5 h-5 w-80 max-w-full bg-(--content-outline)" />
      <div className="grid justify-center rounded-md border border-(--border-amber-clr) bg-(--card-background) py-5">
        <Skeleton className="mx-auto h-5 w-44 bg-(--border-amber-clr)" />
        <Skeleton className="mx-auto mt-2 h-9 w-32 bg-(--border-amber-clr)" />
        <Skeleton className="mx-auto mt-2 h-4 w-28 bg-(--content-outline)" />
      </div>
      <ul className="mt-5 grid gap-4 rounded-md border border-(--input-outline) bg-(--card-background) p-5">
        {Array.from({ length: 5 }).map((_, subscriptionIndex) => (
          <li
            className="flex justify-between border-b border-(--sidebar-outline) pb-4 last:border-b-0"
            key={subscriptionIndex}
          >
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-32 bg-(--content-outline)" />
              <Skeleton className="h-3 w-40 bg-(--content-outline)" />
            </div>
            <Skeleton className="h-5 w-16 bg-(--content-outline)" />
          </li>
        ))}
      </ul>
    </div>
  );
};
