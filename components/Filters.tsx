"use client";

import { SlidersHorizontal } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FilterState, initialFilters } from "@/lib/helpers";
import { SearchBar } from "@/components/SearchBar";

type FilterOptions = {
  types: string[];
  countries: string[];
  genres: string[];
  ratings: string[];
  years: string[];
  directors: string[];
};

type FiltersProps = {
  filters: FilterState;
  options: FilterOptions;
  onChange: (filters: FilterState) => void;
};

function SelectControl({
  label,
  value,
  values,
  onChange
}: {
  label: string;
  value: string;
  values: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="space-y-2">
      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/44">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-md border border-white/10 bg-[#191919] px-3 text-sm text-white outline-none transition focus:border-netflix/70 focus:ring-2 focus:ring-netflix/20"
      >
        {values.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </label>
  );
}

export function Filters({ filters, options, onChange }: FiltersProps) {
  const setFilter = (key: keyof FilterState, value: string) => onChange({ ...filters, [key]: value });

  return (
    <Card className="sticky top-20 p-5">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-white">Filters</p>
          <p className="text-xs text-white/45">Refine charts instantly</p>
        </div>
        <SlidersHorizontal className="h-5 w-5 text-netflix" />
      </div>
      <div className="space-y-4">
        <SearchBar value={filters.search} onChange={(value) => setFilter("search", value)} />
        <SelectControl label="Content Type" value={filters.type} values={options.types} onChange={(value) => setFilter("type", value)} />
        <SelectControl label="Country" value={filters.country} values={options.countries} onChange={(value) => setFilter("country", value)} />
        <SelectControl label="Genre" value={filters.genre} values={options.genres} onChange={(value) => setFilter("genre", value)} />
        <SelectControl label="Rating" value={filters.rating} values={options.ratings} onChange={(value) => setFilter("rating", value)} />
        <SelectControl label="Release Year" value={filters.year} values={options.years} onChange={(value) => setFilter("year", value)} />
        <SelectControl label="Director" value={filters.director} values={options.directors} onChange={(value) => setFilter("director", value)} />
        <Button variant="outline" className="w-full" onClick={() => onChange(initialFilters)}>
          Reset Filters
        </Button>
      </div>
    </Card>
  );
}
