"use client";

import { Calendar, Film, MapPin, Star, UserRound } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { NetflixTitle } from "@/lib/helpers";

export function MovieCard({ title, index }: { title: NetflixTitle; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: Math.min(index * 0.03, 0.24), duration: 0.35 }}
    >
      <Card className="flex h-full flex-col overflow-hidden transition hover:-translate-y-1 hover:border-netflix/50">
        <div className="flex aspect-[16/9] items-center justify-center bg-[linear-gradient(135deg,#2a2a2a,#111)]">
          <div className="flex h-16 w-16 items-center justify-center rounded-md bg-netflix text-white shadow-glow">
            <Film className="h-8 w-8" />
          </div>
        </div>
        <div className="flex flex-1 flex-col p-5">
          <div className="mb-3 flex items-start justify-between gap-3">
            <h3 className="line-clamp-2 text-lg font-bold leading-tight text-white">{title.title}</h3>
            <span className="shrink-0 rounded-md bg-white/8 px-2 py-1 text-xs font-semibold text-white/72">{title.type}</span>
          </div>
          <p className="line-clamp-3 text-sm leading-6 text-white/58">{title.description}</p>
          <div className="mt-4 grid gap-2 text-xs text-white/55">
            <span className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-netflix" />
              {title.country}
            </span>
            <span className="flex items-center gap-2">
              <Star className="h-3.5 w-3.5 text-netflix" />
              {title.rating} · {title.listed_in}
            </span>
            <span className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 text-netflix" />
              Released {title.release_year}
            </span>
            <span className="flex items-center gap-2">
              <UserRound className="h-3.5 w-3.5 text-netflix" />
              {title.director}
            </span>
          </div>
          <p className="mt-4 line-clamp-2 text-xs leading-5 text-white/42">{title.cast}</p>
        </div>
      </Card>
    </motion.article>
  );
}
