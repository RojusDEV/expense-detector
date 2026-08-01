import { useQuery } from "@tanstack/react-query";
import CategoriesTable from "./CategoriesTable";
import Card from "./StatCard";
import {
  getBalanceStats,
  getLatestTransactions,
  getMonthlyTrends,
  getTransactionsSummary,
} from "@/shared/api/transactionsApi";
import { LatestTransactionsTable } from "./LatestTransactionsTable";
import MonthlyTrendsGraph from "./MonthlyTrendsGraph";

const Dashboard = () => {
  const { data: categoryStats } = useQuery({
    queryKey: ["categoryStats"],
    queryFn: getTransactionsSummary,
  });

  const { data: latestTransactions } = useQuery({
    queryKey: ["latestTransactions"],
    queryFn: getLatestTransactions,
  });

  const { data: balanceStats } = useQuery({
    queryKey: ["balanceStats"],
    queryFn: getBalanceStats,
  });

  const { data: monthlyTrends } = useQuery({
    queryKey: ["monthlyTrends"],
    queryFn: getMonthlyTrends,
  });

  return (
    <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
      {balanceStats &&
        (() => {
          const { income, expense, balance, subscriptions } =
            balanceStats.balanceStatsDTO;
          return (
            <>
              <Card label="Pajamos" type="income" value={income} />
              <Card label="Išlaidos" type="expense" value={expense} />
              <Card label="Balansas" type="balance" value={balance} />
              <Card
                label="Prenumeratos"
                type="subscriptions"
                value={subscriptions}
              />
            </>
          );
        })()}

      <div className="col-span-full lg:col-span-2">
        {categoryStats && (
          <CategoriesTable
            transactionsSummary={categoryStats.transactionsSummary}
          />
        )}
      </div>

      <div className="col-span-full lg:col-span-2">
        {monthlyTrends && (
          <MonthlyTrendsGraph monthlyTrends={monthlyTrends?.monthlyTrends} />
        )}
      </div>

      <div className="col-span-full">
        {latestTransactions && (
          <LatestTransactionsTable
            latestTransactions={latestTransactions?.latestTransactions}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
