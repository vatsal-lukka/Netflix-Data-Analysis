"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { countBy, monthName, NetflixTitle, topEntries } from "@/lib/helpers";

const PlotlyChart = dynamic(() => import("./PlotlyChart"), {
  ssr: false,
  loading: () => <div className="h-[330px] animate-pulse rounded-md bg-white/10" />
});

const baseLayout = {
  paper_bgcolor: "rgba(0,0,0,0)",
  plot_bgcolor: "rgba(0,0,0,0)",
  font: { color: "#f8f8f8", family: "Inter, sans-serif" },
  margin: { l: 48, r: 20, t: 18, b: 48 },
  colorway: ["#E50914", "#B81D24", "#F5F5F1", "#7A1C20", "#8C8C8C"],
  xaxis: { gridcolor: "rgba(255,255,255,0.08)", zerolinecolor: "rgba(255,255,255,0.1)" },
  yaxis: { gridcolor: "rgba(255,255,255,0.08)", zerolinecolor: "rgba(255,255,255,0.1)" },
  showlegend: false
};

function ChartCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export function NetflixCharts({ titles }: { titles: NetflixTitle[] }) {
  const typeCounts = countBy(titles.map((item) => item.type));
  const yearsAdded = Object.entries(countBy(titles.map((item) => item.year_added))).sort(([a], [b]) => Number(a) - Number(b));
  const releaseYears = titles.map((item) => item.release_year);
  const countries = topEntries(countBy(titles.flatMap((item) => item.countries)), 10).reverse();
  const genres = topEntries(countBy(titles.flatMap((item) => item.genres)), 10);
  const ratings = topEntries(countBy(titles.map((item) => item.rating)), 14);
  const movieDurations = titles.map((item) => item.movie_duration).filter((item): item is number => typeof item === "number");
  const tvSeasons = titles.map((item) => item.tv_seasons).filter((item): item is number => typeof item === "number");
  const directors = topEntries(countBy(titles.flatMap((item) => item.directors)), 10);
  const actors = topEntries(countBy(titles.flatMap((item) => item.cast_members)), 10);
  const months = Array.from({ length: 12 }, (_, index) => index + 1);
  const monthlyCounts = countBy(titles.map((item) => item.month_added));

  return (
    <section id="visualizations" className="space-y-5">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-netflix">Visualizations</p>
        <h2 className="mt-2 text-3xl font-black text-white">Interactive Plotly analysis</h2>
      </div>
      <div className="grid gap-5 xl:grid-cols-2">
        <ChartCard title="Movies vs TV Shows">
          <PlotlyChart
            data={[{ type: "pie", labels: Object.keys(typeCounts), values: Object.values(typeCounts), hole: 0.55, marker: { colors: ["#E50914", "#F5F5F1"] } }]}
            layout={{ ...baseLayout, margin: { l: 18, r: 18, t: 18, b: 18 } }}
          />
        </ChartCard>
        <ChartCard title="Content Added by Year">
          <PlotlyChart
            data={[{ type: "scatter", mode: "lines+markers", x: yearsAdded.map(([year]) => year), y: yearsAdded.map(([, value]) => value), line: { color: "#E50914", width: 3 }, fill: "tozeroy" }]}
            layout={baseLayout}
          />
        </ChartCard>
        <ChartCard title="Release Year Distribution">
          <PlotlyChart data={[{ type: "histogram", x: releaseYears, marker: { color: "#E50914" }, nbinsx: 45 }]} layout={baseLayout} />
        </ChartCard>
        <ChartCard title="Top Countries">
          <PlotlyChart data={[{ type: "bar", orientation: "h", x: countries.map(([, value]) => value), y: countries.map(([name]) => name), marker: { color: "#E50914" } }]} layout={baseLayout} />
        </ChartCard>
        <ChartCard title="Top Genres">
          <PlotlyChart data={[{ type: "bar", x: genres.map(([name]) => name), y: genres.map(([, value]) => value), marker: { color: "#B81D24" } }]} layout={baseLayout} />
        </ChartCard>
        <ChartCard title="Ratings Distribution">
          <PlotlyChart data={[{ type: "bar", x: ratings.map(([name]) => name), y: ratings.map(([, value]) => value), marker: { color: "#F5F5F1" } }]} layout={baseLayout} />
        </ChartCard>
        <ChartCard title="Movie Duration">
          <PlotlyChart data={[{ type: "histogram", x: movieDurations, marker: { color: "#E50914" }, nbinsx: 30 }]} layout={baseLayout} />
        </ChartCard>
        <ChartCard title="TV Seasons">
          <PlotlyChart data={[{ type: "histogram", x: tvSeasons, marker: { color: "#B81D24" }, nbinsx: 12 }]} layout={baseLayout} />
        </ChartCard>
        <ChartCard title="Top Directors">
          <PlotlyChart data={[{ type: "bar", x: directors.map(([name]) => name), y: directors.map(([, value]) => value), marker: { color: "#E50914" } }]} layout={baseLayout} />
        </ChartCard>
        <ChartCard title="Top Actors">
          <PlotlyChart data={[{ type: "bar", x: actors.map(([name]) => name), y: actors.map(([, value]) => value), marker: { color: "#F5F5F1" } }]} layout={baseLayout} />
        </ChartCard>
        <div className="xl:col-span-2">
          <ChartCard title="Monthly Content Added">
            <PlotlyChart
              data={[{ type: "scatter", mode: "lines", x: months.map(monthName), y: months.map((month) => monthlyCounts[month] ?? 0), fill: "tozeroy", line: { color: "#E50914", width: 3 } }]}
              layout={baseLayout}
            />
          </ChartCard>
        </div>
      </div>
    </section>
  );
}
