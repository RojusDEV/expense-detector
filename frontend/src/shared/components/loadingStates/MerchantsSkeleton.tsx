import { Skeleton } from "@/components/ui/skeleton";

export const MerchantsSkeleton = () => {
  return (
    <div>
      <div className="max-w-full bg-(--bg-primary-dashboard) px-8 py-7">
        <Skeleton className="h-8 w-44 bg-(--content-outline)" />
        <Skeleton className="mt-3 mb-5 h-5 w-32 bg-(--content-outline)" />
        <ul className="rounded-lg border border-(--content-outline) bg-(--card-background) p-5">
          {Array.from({ length: 6 }).map((_, merchantIndex) => (
            <li className="mb-8 last:mb-0" key={merchantIndex}>
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-36 bg-(--content-outline)" />
                <Skeleton className="h-4 w-20 bg-(--content-outline)" />
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {Array.from({ length: 3 }).map((_, aliasIndex) => (
                  <Skeleton
                    className="h-8 w-24 rounded-sm bg-(--input-bg-black)"
                    key={aliasIndex}
                  />
                ))}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
