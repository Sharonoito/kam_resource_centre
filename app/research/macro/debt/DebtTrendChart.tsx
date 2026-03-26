"use client";

import Highcharts from "highcharts";
import dynamic from "next/dynamic";

const HighchartsReact = dynamic(() => import("highcharts-react-official"), {
  ssr: false,
});

type DebtTrendChartProps = {
  categories: string[];
  data: number[];
};

export default function DebtTrendChart({ categories, data }: DebtTrendChartProps) {
  const options: Highcharts.Options = {
    chart: {
      type: "line",
      borderRadius: 16,
      backgroundColor: "#FFFFFF",
      spacing: [16, 16, 16, 16],
    },
    title: {
      text: "Debt Trend",
      style: {
        color: "#18181B",
        fontWeight: "700",
      },
    },
    xAxis: {
      categories,
      title: { text: "Year" },
    },
    yAxis: {
      min: 0,
      title: { text: "Debt Value" },
      labels: {
        formatter() {
          return `${Number(this.value).toFixed(2)}%`;
        },
      },
    },
    tooltip: {
      pointFormatter() {
        return `<b>${Number(this.y).toFixed(2)}%</b>`;
      },
    },
    series: [
      {
        type: "line",
        name: "Debt",
        data,
        color: "#1e3a8a",
      },
    ],
    credits: { enabled: false },
    legend: { enabled: false },
  };

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm">
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
}
