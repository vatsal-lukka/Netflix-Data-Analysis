"""
Clean the Netflix titles dataset and export dashboard-ready JSON.

Run from the project root:
    python python/preprocess.py
"""

import json
from pathlib import Path
import datetime

import numpy as np
import pandas as pd


ROOT = Path(__file__).resolve().parents[1]
CSV_PATH = ROOT / "netflix_titles.csv"
OUTPUT_PATH = ROOT / "public" / "netflix.json"


def split_list(value):
    """Split a comma-separated string into a list of stripped items."""
    if pd.isna(value) or str(value).strip() == "":
        return []
    items = str(value).split(",")
    result = []
    for item in items:
        item = item.strip()
        if item:
            result.append(item)
    return result


def parse_duration(row):
    """Return (movie_duration, tv_seasons) or (None, None)."""
    duration = str(row.get("duration", "")).strip().lower()
    if not duration:
        return None, None

    parts = duration.split(" ")
    if len(parts) == 0:
        return None, None
    try:
        number = int(parts[0])
    except (ValueError, IndexError):
        return None, None

    if row.get("type") == "Movie" and "min" in duration:
        return number, None
    if row.get("type") == "TV Show" and "season" in duration:
        return None, number
    return None, None


def parse_date(date_str, release_year):
    """Try to parse a date string, fallback to release_year-01-01."""
    if pd.isna(date_str) or str(date_str).strip() == "":
        return None
    formats = ["%B %d, %Y", "%Y-%m-%d", "%m/%d/%Y"]
    for fmt in formats:
        try:
            return datetime.datetime.strptime(str(date_str).strip(), fmt)
        except ValueError:
            continue
    # if nothing worked, use release year
    if not pd.isna(release_year):
        try:
            return datetime.datetime(int(release_year), 1, 1)
        except (ValueError, TypeError):
            pass
    return None


def clean_netflix_titles():
    # 1. Read CSV and drop duplicates
    df = pd.read_csv(CSV_PATH)
    df = df.drop_duplicates()
    df = df.drop_duplicates(subset=["show_id"], keep="first")

    # 2. Fill missing text columns with empty strings
    text_columns = [
        "type", "title", "director", "cast", "country",
        "rating", "duration", "listed_in", "description"
    ]
    for col in text_columns:
        df[col] = df[col].fillna("").astype(str).str.strip()

    # 3. Replace empty strings with readable defaults
    df["director"] = df["director"].replace("", "Unknown")
    df["cast"] = df["cast"].replace("", "Unknown")
    df["country"] = df["country"].replace("", "Unknown")
    df["rating"] = df["rating"].replace("", "Unrated")
    df["duration"] = df["duration"].replace("", "Unknown")
    df["description"] = df["description"].replace("", "No description available.")

    # 4. Parse dates and add year/month/day columns
    years = []
    months = []
    days = []
    date_strings = []
    for idx, row in df.iterrows():
        date_obj = parse_date(row["date_added"], row["release_year"])
        if date_obj is None:
            # ultimate fallback
            if not pd.isna(row["release_year"]):
                try:
                    fallback_year = int(row["release_year"])
                    date_obj = datetime.datetime(fallback_year, 1, 1)
                except (ValueError, TypeError):
                    date_obj = datetime.datetime(1970, 1, 1)
            else:
                date_obj = datetime.datetime(1970, 1, 1)

        years.append(date_obj.year)
        months.append(date_obj.month)
        days.append(date_obj.day)
        date_strings.append(date_obj.strftime("%Y-%m-%d"))

    df["year_added"] = years
    df["month_added"] = months
    df["day_added"] = days
    df["date_added"] = date_strings

    # 5. Parse duration into movie_duration and tv_seasons
    movie_durations = []
    tv_seasons_list = []
    for idx, row in df.iterrows():
        md, ts = parse_duration(row)
        movie_durations.append(md)
        tv_seasons_list.append(ts)
    df["movie_duration"] = movie_durations
    df["tv_seasons"] = tv_seasons_list

    # 6. Create list columns by splitting
    countries_list = []
    genres_list = []
    directors_list = []
    cast_list = []
    for idx, row in df.iterrows():
        countries_list.append(split_list(row["country"]))
        genres_list.append(split_list(row["listed_in"]))
        directors_list.append(split_list(row["director"]))
        cast_list.append(split_list(row["cast"]))

    df["countries"] = countries_list
    df["genres"] = genres_list
    df["directors"] = directors_list
    df["cast_members"] = cast_list

    # 7. Replace NaN with None (for clean JSON)
    df = df.replace({np.nan: None})

    # 8. Sort by year_added descending, then title ascending
    df = df.sort_values(["year_added", "title"], ascending=[False, True])
    df = df.reset_index(drop=True)

    return df


def summary_statistics(df):
    total = len(df)
    movies = int((df["type"] == "Movie").sum())
    tv_shows = int((df["type"] == "TV Show").sum())

    # Unique values by expanding lists manually
    all_countries = []
    all_genres = []
    all_directors = []
    for lst in df["countries"]:
        if lst:
            for c in lst:
                if c and c != "Unknown":
                    all_countries.append(c)
    for lst in df["genres"]:
        if lst:
            all_genres.extend([g for g in lst if g])
    for lst in df["directors"]:
        if lst:
            for d in lst:
                if d and d != "Unknown":
                    all_directors.append(d)

    unique_countries = len(set(all_countries))
    unique_genres = len(set(all_genres))
    unique_directors = len(set(all_directors))

    # Average durations
    movie_durs = df["movie_duration"].dropna()
    avg_movie = round(float(movie_durs.mean()), 1) if len(movie_durs) > 0 else 0
    tv_seas = df["tv_seasons"].dropna()
    avg_tv = round(float(tv_seas.mean()), 1) if len(tv_seas) > 0 else 0

    # Year range
    years = df["release_year"].dropna().astype(int)
    year_range = [int(years.min()), int(years.max())] if len(years) > 0 else [0, 0]

    return {
        "total_titles": total,
        "movies": movies,
        "tv_shows": tv_shows,
        "countries": unique_countries,
        "genres": unique_genres,
        "directors": unique_directors,
        "average_movie_duration": avg_movie,
        "average_tv_seasons": avg_tv,
        "year_range": year_range,
    }


def main():
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    df = clean_netflix_titles()

    payload = {
        "generated_at": pd.Timestamp.now("UTC").isoformat(),
        "summary": summary_statistics(df),
        "titles": df.to_dict(orient="records"),
    }
    OUTPUT_PATH.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2),
        encoding="utf-8"
    )
    print(f"Wrote {len(df):,} cleaned titles to {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
