import type { monthlyTrends } from "@/shared/types/types";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const MonthlyTrendsGraph = ({ monthlyTrends }: monthlyTrends) => {
  const chartData = {
    labels: monthlyTrends.map((d) =>
      new Date(d.month).toLocaleString("default", {
        month: "short",
        year: "2-digit",
      }),
    ),
    datasets: [
      {
        label: "Pajamos",
        data: monthlyTrends.map((d) => d.income),
        backgroundColor: "#34D399",
        borderRadius: 4,
      },
      {
        label: "Išlaidos",
        data: monthlyTrends.map((d) => d.expense),
        backgroundColor: "#F87171",
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        align: "end" as const,
        labels: {
          boxWidth: 10,
          boxHeight: 10,
          borderRadius: 2,
          useBorderRadius: true,
          textAlign: "left" as const,
          font: {
            size: 10,
          },
        },
      },
      tooltip: { mode: "index" as const, intersect: false },
    },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true },
    },
  };

  return (
    <div className="flex h-full w-full flex-col rounded-[10px] bg-(--card-background) px-[18.8px] py-[16.8px] outline-1 outline-(--content-outline)">
      <span className="font-outfit pb-4 text-sm font-semibold text-(--label-gray-300)">
        Pajamos ir išlaidos
      </span>
      <div className="relative min-h-0 flex-1">
        <Bar options={options} data={chartData} />
      </div>
    </div>
  );
};

export default MonthlyTrendsGraph;
