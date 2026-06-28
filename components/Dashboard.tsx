"use client";

import { useMemo, useState } from "react";
import { Database, Filter, Rows3 } from "lucide-react";
import { motion } from "framer-motion";
import { Hero } from "@/components/Hero";
import { Navbar } from "@/components/Navbar";
import { KPISection } from "@/components/KPISection";
import { Filters } from "@/components/Filters";
import { NetflixCharts } from "@/components/Charts/NetflixCharts";
import { Statistics } from "@/components/Statistics";
import { MovieCard } from "@/components/MovieCard";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { filterTitles, formatNumber, initialFilters, NetflixPayload, uniqueOptions } from "@/lib/helpers";

export function Dashboard({ data }: { data: NetflixPayload }) {
  const [filters, setFilters] = useState(initialFilters);

  const titles = data.titles;
  const filteredTitles = useMemo(() => filterTitles(titles, filters), [titles, filters]);

  const options = useMemo(
    () => ({
      types: ["All", "Movie", "TV Show"],
      countries: uniqueOptions(titles, (item) => item.countries),
      genres: uniqueOptions(titles, (item) => item.genres),
      ratings: uniqueOptions(titles, (item) => item.rating),
      years: ["All", ...Array.from(new Set(titles.map((item) => String(item.release_year)))).sort((a, b) => Number(b) - Number(a))],
      directors: uniqueOptions(titles, (item) => item.directors).slice(0, 650)
    }),
    [titles]
  );

  return (
    <>
      <Navbar />
      <Hero />
      <KPISection titles={titles} />
      <main className="mx-auto grid max-w-7xl gap-6 px-4 pb-16 sm:px-6 lg:grid-cols-[320px_1fr] lg:px-8">
        <aside>
          <Filters filters={filters} options={options} onChange={setFilters} />
        </aside>
        <div className="min-w-0 space-y-10">
          <section className="grid gap-4 md:grid-cols-3">
            {[
              { label: "Filtered Titles", value: filteredTitles.length, icon: Filter },
              { label: "Dataset Rows", value: titles.length, icon: Rows3 },
              { label: "Generated JSON", value: Math.round(JSON.stringify(data).length / 1024), suffix: "KB", icon: Database }
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
              >
                <Card className="p-5">
                  <item.icon className="mb-4 h-5 w-5 text-netflix" />
                  <p className="text-sm text-white/50">{item.label}</p>
                  <p className="mt-2 text-3xl font-black text-white">
                    {formatNumber(item.value)}
                    {item.suffix ? <span className="ml-1 text-base text-white/45">{item.suffix}</span> : null}
                  </p>
                </Card>
              </motion.div>
            ))}
          </section>

          <Statistics titles={filteredTitles} />
          <NetflixCharts titles={filteredTitles} />

          <section id="dataset" className="space-y-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-netflix">Dataset</p>
                <h2 className="mt-2 text-3xl font-black text-white">Searchable title catalog</h2>
              </div>
              <p className="text-sm text-white/48">Showing {Math.min(filteredTitles.length, 12)} of {formatNumber(filteredTitles.length)} matches</p>
            </div>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredTitles.slice(0, 12).map((title, index) => (
                <MovieCard key={title.show_id} title={title} index={index} />
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
