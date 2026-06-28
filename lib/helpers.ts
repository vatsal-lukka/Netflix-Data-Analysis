export type NetflixTitle = {
  show_id: string;
  type: "Movie" | "TV Show";
  title: string;
  director: string;
  cast: string;
  country: string;
  date_added: string;
  release_year: number;
  rating: string;
  duration: string;
  listed_in: string;
  description: string;
  year_added: number;
  month_added: number;
  day_added: number;
  movie_duration: number | null;
  tv_seasons: number | null;
  countries: string[];
  genres: string[];
  directors: string[];
  cast_members: string[];
};

export type NetflixPayload = {
  generated_at: string;
  summary: Record<string, number | string | number[]>;
  titles: NetflixTitle[];
};

export type FilterState = {
  type: string;
  country: string;
  genre: string;
  rating: string;
  year: string;
  director: string;
  search: string;
};

export const initialFilters: FilterState = {
  type: "All",
  country: "All",
  genre: "All",
  rating: "All",
  year: "All",
  director: "All",
  search: ""
};

export function uniqueOptions(titles: NetflixTitle[], selector: (item: NetflixTitle) => string | string[]) {
  const values = titles.flatMap((title) => selector(title)).filter(Boolean);
  return ["All", ...Array.from(new Set(values)).sort((a, b) => a.localeCompare(b))];
}

export function filterTitles(titles: NetflixTitle[], filters: FilterState) {
  const search = filters.search.trim().toLowerCase();
  return titles.filter((title) => {
    const matchesSearch =
      !search ||
      title.title.toLowerCase().includes(search) ||
      title.description.toLowerCase().includes(search) ||
      title.cast.toLowerCase().includes(search) ||
      title.director.toLowerCase().includes(search);

    return (
      (filters.type === "All" || title.type === filters.type) &&
      (filters.country === "All" || title.countries.includes(filters.country)) &&
      (filters.genre === "All" || title.genres.includes(filters.genre)) &&
      (filters.rating === "All" || title.rating === filters.rating) &&
      (filters.year === "All" || String(title.release_year) === filters.year) &&
      (filters.director === "All" || title.directors.includes(filters.director)) &&
      matchesSearch
    );
  });
}

export function countBy<T extends string | number>(items: T[]) {
  return items.reduce<Record<string, number>>((acc, item) => {
    const key = String(item || "Unknown");
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});
}

export function topEntries(counts: Record<string, number>, limit = 10) {
  return Object.entries(counts)
    .filter(([name]) => name && name !== "Unknown")
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);
}

export function average(values: Array<number | null>) {
  const valid = values.filter((value): value is number => typeof value === "number" && Number.isFinite(value));
  return valid.length ? valid.reduce((sum, value) => sum + value, 0) / valid.length : 0;
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(Math.round(value));
}

export function monthName(month: number) {
  return new Date(2024, month - 1, 1).toLocaleString("en-US", { month: "short" });
}
