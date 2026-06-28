"use client";

import { useEffect, useRef } from "react";
import { Skeleton } from "@/components/ui/skeleton";

type PlotlyChartProps = {
  data: unknown[];
  layout: Record<string, unknown>;
  config?: Record<string, unknown>;
};

export default function PlotlyChart({ data, layout, config }: PlotlyChartProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let mounted = true;
    const chartNode = ref.current;

    async function renderChart() {
      const Plotly = await import("plotly.js-dist-min");
      if (!mounted || !chartNode) return;

      await Plotly.newPlot(chartNode, data, layout, {
        responsive: true,
        displaylogo: false,
        modeBarButtonsToRemove: ["lasso2d", "select2d"],
        ...config
      });
    }

    renderChart();

    return () => {
      mounted = false;
      if (chartNode) {
        import("plotly.js-dist-min").then((Plotly) => Plotly.purge(chartNode));
      }
    };
  }, [data, layout, config]);

  return (
    <div className="relative min-h-[330px]">
      <Skeleton className="absolute inset-0 -z-10 h-full w-full" />
      <div ref={ref} className="h-[330px] w-full" />
    </div>
  );
}
