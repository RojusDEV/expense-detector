import type { latestTransactions } from "@/shared/types/types";
import { colors } from "@/lib/utils";

const CategoryBadge = ({ category }: { category: string }) => {
  const style = colors[category] ?? colors["kitos išlaidos"];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${style}`}
    >
      {category}
    </span>
  );
};

const formatAmount = (value: number, expense?: boolean) => {
  const formatted = new Intl.NumberFormat("lt-LT", {
    minimumFractionDigits: 2,
  }).format(Math.abs(value));

  if (expense) return `€${formatted}`;
  return `${value >= 0 ? "+" : "-"}€${formatted}`;
};

export const LatestTransactionsTable = ({
  latestTransactions,
}: latestTransactions) => {
  return (
    <div className="col-span-4 rounded-[10px] bg-(--card-background) px-[18.8px] py-[16.8px] text-left outline-1 outline-(--content-outline)">
      <h3 className="mb-3 text-sm font-medium text-white/70">
        Naujausios transakcijos
      </h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs text-white/40">
            <th className="pb-2 font-normal">Data</th>
            <th className="pb-2 font-normal">Prekybininkas</th>
            <th className="pb-2 font-normal">Kategorija</th>
            <th className="pb-2 text-right font-normal">Suma</th>
          </tr>
        </thead>
        <tbody>
          {latestTransactions.map((t) => (
            <tr key={t.id} className="border-t border-white/5">
              <td className="py-3 text-white/50">
                {t.transactionDate.toString()}
              </td>
              <td className="py-3 text-white">{t.merchantName}</td>
              <td className="py-3">
                <CategoryBadge category={t.categoryName} />
              </td>
              <td
                className={`py-3 text-right font-medium ${
                  t.isExpense ? "text-red-400" : "text-green-400"
                }`}
              >
                {formatAmount(t.amount, t.isExpense)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
