"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "outline";
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded-md px-5 text-sm font-semibold transition duration-200 focus:outline-none focus:ring-2 focus:ring-netflix/70 disabled:pointer-events-none disabled:opacity-50",
        variant === "primary" && "bg-netflix text-white shadow-glow hover:bg-accent",
        variant === "ghost" && "bg-transparent text-white hover:bg-white/10",
        variant === "outline" && "border border-white/15 bg-white/5 text-white hover:border-netflix/60 hover:bg-netflix/10",
        className
      )}
      {...props}
    />
  );
}
