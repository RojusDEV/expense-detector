import TrendsGraph from "@/components/TrendsGraph";
import type { monthlyTrends } from "@/shared/types/types";

const MonthlyTrendsGraph = ({ monthlyTrends }: monthlyTrends) => {
  return (
    <div className="flex h-full w-full flex-col rounded-[10px] bg-(--card-background) px-[18.8px] py-[16.8px] outline-1 outline-(--content-outline)">
      <span className="font-outfit pb-4 text-sm font-semibold text-(--label-gray-300)">
        Pajamos ir išlaidos
      </span>
      <div className="relative min-h-0 flex-1">
        <TrendsGraph monthlyTrends={monthlyTrends}/>
      </div>
    </div>
  );
};

export default MonthlyTrendsGraph;
