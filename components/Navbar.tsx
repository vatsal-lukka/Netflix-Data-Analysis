"use client";

import { Github, LayoutDashboard } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const links = [
  ["Overview", "#overview"],
  ["Insights", "#insights"],
  ["Visualizations", "#visualizations"],
  ["Dataset", "#dataset"]
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-background/82 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="#" className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-netflix shadow-glow">
            <LayoutDashboard className="h-5 w-5" />
          </span>
          <Image src="/netflix_logo.png" alt="Netflix" width={116} height={40} className="h-auto w-24" />
        </a>
        <div className="hidden items-center gap-6 md:flex">
          {links.map(([label, href]) => (
            <a key={label} href={href} className="text-sm font-medium text-white/68 transition hover:text-white">
              {label}
            </a>
          ))}
        </div>
        <Button variant="outline" className="h-10 px-3 sm:px-4" onClick={() => window.open("https://github.com/", "_blank")}>
          <Github className="h-4 w-4" />
          <span className="hidden sm:inline">GitHub</span>
        </Button>
      </nav>
    </header>
  );
}
