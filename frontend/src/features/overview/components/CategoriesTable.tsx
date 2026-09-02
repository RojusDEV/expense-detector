import type { TransactionsSummary } from "@/shared/types/types";
import { capitalize } from "@/lib/utils";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const categoryStyles: Record<
  string,
  { bg: string; hex: string; icon?: string }
> = {
  maistas: { bg: "bg-[#E8A03D]", hex: "#E8A03D" },
  būstas: { bg: "bg-[#8B6FD9]", hex: "#8B6FD9" },
  transportas: { bg: "bg-[#3B82C4]", hex: "#3B82C4" },
  pervedimai: { bg: "bg-[#5B6FD9]", hex: "#5B6FD9" },
  pramogos: { bg: "bg-[#D9548B]", hex: "#D9548B" },
  sveikata: { bg: "bg-[#D9484F]", hex: "#D9484F" },
  investavimas: { bg: "bg-[#3BA362]", hex: "#3BA362" },
  "kitos išlaidos": { bg: "bg-[#7C8A9A]", hex: "#7C8A9A" },
  kita: { bg: "bg-[#7C8A9A]", hex: "#7C8A9A" },
  išsilavinimas: { bg: "bg-[#2E9BC7]", hex: "#2E9BC7" },
  kelionės: { bg: "bg-[#2E9B8F]", hex: "#2E9B8F" },
  draudimas: { bg: "bg-[#D9A431]", hex: "#D9A431" },
  apsipirkimas: { bg: "bg-[#D9557A]", hex: "#D9557A" },
  prenumeratos: { bg: "bg-[#1DB954]", hex: "#1DB954" },
};

const CategoryBadge = ({ category }: { category: string }) => {
  const style = categoryStyles[category] ?? categoryStyles.kita;
  return (
    <div className="flex items-center">
      <div className={`h-2 w-2 ${style.bg} rounded-xs`}></div>
      <span className="font-outfit inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-sm">
        {capitalize(category)}
      </span>
    </div>
  );
};

const CategoriesTable = ({ transactionsSummary }: TransactionsSummary) => {
  if (!transactionsSummary || transactionsSummary.length === 0) {
    return (
      <div className="flex h-43.75 flex-col rounded-[10px] bg-(--card-background) px-[18.8px] py-[16.8px] outline-1 outline-(--content-outline)">
        <h3>Išlaidos pagal kategoriją</h3>
        <p className="text-sm text-(--text-gray-400)">Duomenų nėra.</p>
      </div>
    );
  }

  const totalSum = transactionsSummary.reduce(
    (sum, t) => sum + t.totalAmount,
    0,
  );

  const data = {
    datasets: [
      {
        label: "Išlaidos pagal kategoriją",
        data: transactionsSummary.map((t) => t.totalAmount),
        backgroundColor: transactionsSummary.map(
          (t) => (categoryStyles[t.categoryName] ?? categoryStyles.kita).hex,
        ),
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="flex h-full min-h-43.75 flex-col gap-2 overflow-hidden rounded-[10px] bg-(--card-background) px-[18.8px] py-[16.8px] outline-1 outline-(--content-outline)">
      <h3 className="font-outfit shrink-0 text-sm font-semibold text-(--label-gray-300)">
        Išlaidos pagal kategoriją
      </h3>
      <div className="flex items-start gap-4">
        <div className="relative aspect-square h-40 w-40 shrink-0 self-center">
          <Pie data={data} options={{ maintainAspectRatio: false }} />
        </div>
        <div className="h-full flex-1 overflow-y-auto">
          {transactionsSummary.map((t) => (
            <div
              key={t.categoryId}
              className="flex w-full items-center justify-between py-1"
            >
              <CategoryBadge category={t.categoryName} />
              <div className="flex items-center gap-2 tabular-nums">
                <span className="font-brains w-14 text-right text-(--text-primary-white)">
                  €{t.totalAmount.toFixed(0)}
                </span>
                <span className="w-8 text-right font-mono text-(--text-gray-400)">
                  {totalSum > 0
                    ? ((t.totalAmount / totalSum) * 100).toFixed(0)
                    : "0"}
                  %
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoriesTable;
