import { capitalize, formatDate } from "@/lib/utils";
import { getSubscriptionsRequest } from "@/shared/api/subsriptionsApi";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

const SubscriptonsPage = () => {
  const {
    isError,
    isLoading,
    data: subscriptions,
  } = useQuery({
    queryKey: ["subscriptions"],
    queryFn: getSubscriptionsRequest,
    staleTime: 1000 * 60 * 5,
  });

  const monthlySum = useMemo(() => {
    if (!subscriptions) return 0;
    return subscriptions.reduce((acc, item) => {
      const monthlyAmount = (item.amount * 30) / item.frequency_days;
      return acc + monthlyAmount;
    }, 0);
  }, [subscriptions]);

  if (isError) {
    return (
      <span className="font-bold text-red-500">
        Failed fetching subscriptions
      </span>
    );
  }

  if (isLoading) {
    return (
      <span className="font-bold text-yellow-300">
        Loading subscriptions...
      </span>
    );
  }

  return (
    <div className="w-full bg-(--bg-primary-dashboard) px-8 py-7">
      <h1 className="font-playfair text-2xl leading-[120%] font-medium text-(--text-primary-white)">
        Prenumeratos
      </h1>
      <h2 className="mt-2 mb-5 font-normal text-(--text-gray-400)">
        Automatiškai aptiktos pasikartojančios transakcijos
      </h2>
      <div className="grid justify-center rounded-md border border-(--border-amber-clr) bg-[#101214] py-5 text-center">
        <span className="font-semibold text-(--primary-amber-clr)">
          Bendra prenumeratų kaina
        </span>
        <span className="font-brains text-3xl font-bold text-(--primary-amber-clr)">
          €{monthlySum.toFixed(2)}
          <span className="text-sm text-(--text-gray-400)">/mėn.</span>
        </span>
        <span className="text-[0.75rem] text-(--text-gray-400)">
          €{(monthlySum * 12).toFixed(2)} per metus
        </span>
      </div>
      <ul className="mt-5 grid gap-4 rounded-md border border-(--input-outline) bg-(--card-background) p-5">
        {subscriptions &&
          subscriptions.map((sub) => (
            <li className="font-outfit flex justify-between border-b border-(--sidebar-outline) pb-4">
              <div className="flex flex-col">
                <span className="text-sm font-medium">
                  {capitalize(sub.merchantName)}
                </span>
                <span className="text-[0.6875rem] font-medium text-(--text-gray-400)">
                  {" "}
                  · Nuo {formatDate(new Date(sub.from_date))}
                </span>
              </div>
              <div className="">
                <span className="font-brains text-sm font-bold">
                  €{sub.amount}
                </span>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default SubscriptonsPage;
