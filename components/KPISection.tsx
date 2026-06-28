"use client";

import { motion } from "framer-motion";
import { Clapperboard, Earth, Film, Tags, Tv, UserRoundCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { formatNumber, NetflixTitle } from "@/lib/helpers";

type KPISectionProps = {
  titles: NetflixTitle[];
};

export function KPISection({ titles }: KPISectionProps) {
  const countries = new Set(titles.flatMap((item) => item.countries).filter((item) => item !== "Unknown")).size;
  const genres = new Set(titles.flatMap((item) => item.genres)).size;
  const directors = new Set(titles.flatMap((item) => item.directors).filter((item) => item !== "Unknown")).size;

  const cards = [
    { label: "Total Titles", value: titles.length, icon: Clapperboard },
    { label: "Movies", value: titles.filter((item) => item.type === "Movie").length, icon: Film },
    { label: "TV Shows", value: titles.filter((item) => item.type === "TV Show").length, icon: Tv },
    { label: "Countries", value: countries, icon: Earth },
    { label: "Genres", value: genres, icon: Tags },
    { label: "Directors", value: directors, icon: UserRoundCheck }
  ];

  return (
    <section id="overview" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {cards.map((card, index) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ delay: index * 0.045, duration: 0.45 }}
          >
            <Card className="group overflow-hidden p-5 transition hover:-translate-y-1 hover:border-netflix/50">
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-md bg-netflix/15 text-netflix transition group-hover:bg-netflix group-hover:text-white">
                <card.icon className="h-5 w-5" />
              </div>
              <p className="text-sm text-white/58">{card.label}</p>
              <p className="mt-2 text-3xl font-black text-white">{formatNumber(card.value)}</p>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
