"use client";

import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
};

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/45" />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search by title, cast, director or description"
        className="h-12 w-full rounded-md border border-white/10 bg-white/7 px-10 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-netflix/70 focus:ring-2 focus:ring-netflix/20"
      />
      {value ? (
        <Button variant="ghost" className="absolute right-1 top-1/2 h-9 w-9 -translate-y-1/2 px-0" onClick={() => onChange("")}>
          <X className="h-4 w-4" />
        </Button>
      ) : null}
    </div>
  );
}
