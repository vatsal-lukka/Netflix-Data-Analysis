"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowDown, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative isolate min-h-[76vh] overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(115deg,rgba(20,20,20,0.96),rgba(20,20,20,0.72)_44%,rgba(229,9,20,0.24)),url('https://images.unsplash.com/photo-1616469829581-73993eb86b02?auto=format&fit=crop&w=2200&q=80')] bg-cover bg-center" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_68%_18%,rgba(229,9,20,0.32),transparent_34%),linear-gradient(to_top,#141414,transparent_35%)]" />
      <motion.div
        className="mx-auto flex min-h-[76vh] max-w-7xl flex-col justify-center px-4 pb-16 pt-24 sm:px-6 lg:px-8"
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-sm text-white/78 backdrop-blur">
          <Play className="h-4 w-4 fill-netflix text-netflix" />
          Python powered entertainment intelligence
        </div>
        <Image src="/netflix_logo.png" alt="Netflix" width={240} height={82} priority className="mb-5 h-auto w-44 sm:w-56" />
        <h1 className="max-w-4xl text-5xl font-black leading-[0.98] tracking-normal text-white sm:text-6xl lg:text-7xl">
          Netflix Analytics Dashboard
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-white/74 sm:text-xl">
          Interactive Data Science Dashboard built with Python, Pandas, Plotly and Next.js.
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Button onClick={() => document.getElementById("overview")?.scrollIntoView({ behavior: "smooth" })}>
            Explore Dashboard
            <ArrowDown className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={() => document.getElementById("dataset")?.scrollIntoView({ behavior: "smooth" })}>
            View Dataset
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
