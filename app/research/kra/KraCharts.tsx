"use client";

import Highcharts from "highcharts";
import dynamic from "next/dynamic";

const HighchartsReact = dynamic(() => import("highcharts-react-official"), {
  ssr: false,
});

type RevenueSeries = {
  categories: string[];
  data: number[];
};

type DeclarationPiePoint = {
  name: string;
  y: number;
};

type KraChartsProps = {
  revenue: RevenueSeries;
  declarationTypes: DeclarationPiePoint[];
};

export default function KraCharts({ revenue, declarationTypes }: KraChartsProps) {
  const revenueOptions: Highcharts.Options = {
    chart: {
      type: "column",
      borderRadius: 16,
      backgroundColor: "#FFFFFF",
      spacing: [16, 16, 16, 16],
    },
    title: {
      text: "Revenue by Month",
      style: {
        color: "#18181B",
        fontWeight: "700",
      },
    },
    xAxis: {
      categories: revenue.categories,
      title: { text: "Month" },
    },
    yAxis: {
      min: 0,
      title: { text: "FOB Value" },
      labels: {
        formatter() {
          return new Intl.NumberFormat().format(Number(this.value));
        },
      },
    },
    tooltip: {
      pointFormatter() {
        return `<b>KES ${new Intl.NumberFormat().format(Number(this.y))}</b>`;
      },
    },
    series: [
      {
        type: "column",
        name: "FOB Revenue",
        data: revenue.data,
        color: "#193C8D",
      },
    ],
    credits: { enabled: false },
    legend: { enabled: false },
  };

  const declarationOptions: Highcharts.Options = {
    chart: {
      type: "pie",
      borderRadius: 16,
      backgroundColor: "#FFFFFF",
      spacing: [16, 16, 16, 16],
    },
    title: {
      text: "Declaration Types",
      style: {
        color: "#18181B",
        fontWeight: "700",
      },
    },
    tooltip: {
      pointFormat: "<b>{point.y}</b> declarations ({point.percentage:.1f}%)",
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: true,
          format: "{point.name}: {point.y}",
        },
      },
    },
    series: [
      {
        type: "pie",
        name: "Declarations",
        data: declarationTypes,
      },
    ],
    credits: { enabled: false },
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm">
        <HighchartsReact highcharts={Highcharts} options={revenueOptions} />
      </div>
      <div className="rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm">
        <HighchartsReact highcharts={Highcharts} options={declarationOptions} />
      </div>
    </div>
  );
}
