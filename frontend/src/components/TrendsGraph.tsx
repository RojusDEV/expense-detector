import type { monthlyTrends } from "@/shared/types/types";
import { Bar } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const TrendsGraph = ({ monthlyTrends }: monthlyTrends) => {
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
  return <Bar options={options} data={chartData} />;
};

export default TrendsGraph;
