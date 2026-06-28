"use client";

import { motion } from "framer-motion";
import { Brain, Clock, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { average, countBy, NetflixTitle, topEntries } from "@/lib/helpers";

export function Statistics({ titles }: { titles: NetflixTitle[] }) {
  const typeCounts = countBy(titles.map((item) => item.type));
  const genre = topEntries(countBy(titles.flatMap((item) => item.genres)), 1)[0]?.[0] ?? "No genre";
  const country = topEntries(countBy(titles.flatMap((item) => item.countries)), 1)[0]?.[0] ?? "No country";
  const movieAverage = average(titles.map((item) => item.movie_duration));

  const yearly = topEntries(countBy(titles.map((item) => item.year_added)), 100);
  const strongestYear = yearly.sort((a, b) => b[1] - a[1])[0]?.[0] ?? "n/a";
  const dominantType = (typeCounts.Movie ?? 0) >= (typeCounts["TV Show"] ?? 0) ? "Movies" : "TV Shows";

  const insights = [
    {
      icon: Brain,
      title: "Catalog Mix",
      text: `Most Netflix titles in this slice are ${dominantType.toLowerCase()}, with ${typeCounts.Movie ?? 0} movies and ${typeCounts["TV Show"] ?? 0} TV shows.`
    },
    {
      icon: TrendingUp,
      title: "Growth Signal",
      text: `${strongestYear} is the strongest add-year in the filtered dataset, highlighting the platform's expansion rhythm.`
    },
    {
      icon: Clock,
      title: "Content Pattern",
      text: `${genre} leads genres, ${country} contributes the most titles, and average movie duration is ${movieAverage.toFixed(1)} minutes.`
    }
  ];

  return (
    <section id="insights" className="space-y-5">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-netflix">Insights</p>
        <h2 className="mt-2 text-3xl font-black text-white">Automatically generated signals</h2>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {insights.map((insight, index) => (
          <motion.div
            key={insight.title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ delay: index * 0.07, duration: 0.45 }}
          >
            <Card className="h-full p-5">
              <insight.icon className="mb-5 h-6 w-6 text-netflix" />
              <h3 className="text-lg font-bold text-white">{insight.title}</h3>
              <p className="mt-3 text-sm leading-6 text-white/60">{insight.text}</p>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
