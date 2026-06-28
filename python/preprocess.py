"""Clean the Netflix titles dataset and export dashboard-ready JSON.

Run from the project root:
    python python/preprocess.py
"""

import json
from pathlib import Path

import numpy as np
import pandas as pd


ROOT = Path(__file__).resolve().parents[1]
CSV_PATH = ROOT / "netflix_titles.csv"
OUTPUT_PATH = ROOT / "public" / "netflix.json"


def split_list(value: object) -> list[str]:
    if pd.isna(value) or str(value).strip() == "":
        return []
    return [item.strip() for item in str(value).split(",") if item.strip()]


def parse_duration(row: pd.Series) -> tuple[int | None, int | None]:
    duration = str(row.get("duration", "")).strip().lower()
    if not duration:
        return None, None

    number = pd.to_numeric(duration.split(" ")[0], errors="coerce")
    if pd.isna(number):
        return None, None

    if row.get("type") == "Movie" and "min" in duration:
        return int(number), None
    if row.get("type") == "TV Show" and "season" in duration:
        return None, int(number)
    return None, None


def clean_netflix_titles() -> pd.DataFrame:
    df = pd.read_csv(CSV_PATH)
    df = df.drop_duplicates().drop_duplicates(subset=["show_id"], keep="first")

    text_columns = [
        "type",
        "title",
        "director",
        "cast",
        "country",
        "rating",
        "duration",
        "listed_in",
        "description",
    ]
    for column in text_columns:
        df[column] = df[column].fillna("").astype(str).str.strip()

    df["director"] = df["director"].replace("", "Unknown")
    df["cast"] = df["cast"].replace("", "Unknown")
    df["country"] = df["country"].replace("", "Unknown")
    df["rating"] = df["rating"].replace("", "Unrated")
    df["duration"] = df["duration"].replace("", "Unknown")
    df["description"] = df["description"].replace("", "No description available.")

    df["date_added"] = pd.to_datetime(df["date_added"], errors="coerce", format="mixed")
    fallback_date = pd.to_datetime(df["release_year"].astype(str) + "-01-01", errors="coerce")
    df["date_added"] = df["date_added"].fillna(fallback_date)

    df["year_added"] = df["date_added"].dt.year.fillna(df["release_year"]).astype(int)
    df["month_added"] = df["date_added"].dt.month.fillna(1).astype(int)
    df["day_added"] = df["date_added"].dt.day.fillna(1).astype(int)
    df["date_added"] = df["date_added"].dt.strftime("%Y-%m-%d")

    durations = df.apply(parse_duration, axis=1, result_type="expand")
    df["movie_duration"] = durations[0]
    df["tv_seasons"] = durations[1]

    df["countries"] = df["country"].apply(split_list)
    df["genres"] = df["listed_in"].apply(split_list)
    df["directors"] = df["director"].apply(split_list)
    df["cast_members"] = df["cast"].apply(split_list)

    df = df.replace({np.nan: None})
    return df.sort_values(["year_added", "title"], ascending=[False, True]).reset_index(drop=True)


def summary_statistics(df: pd.DataFrame) -> dict[str, object]:
    exploded_countries = df.explode("countries")
    exploded_genres = df.explode("genres")
    exploded_directors = df.explode("directors")

    return {
        "total_titles": int(len(df)),
        "movies": int((df["type"] == "Movie").sum()),
        "tv_shows": int((df["type"] == "TV Show").sum()),
        "countries": int(exploded_countries["countries"].replace("Unknown", pd.NA).dropna().nunique()),
        "genres": int(exploded_genres["genres"].dropna().nunique()),
        "directors": int(exploded_directors["directors"].replace("Unknown", pd.NA).dropna().nunique()),
        "average_movie_duration": round(float(df["movie_duration"].dropna().mean()), 1),
        "average_tv_seasons": round(float(df["tv_seasons"].dropna().mean()), 1),
        "year_range": [
            int(df["release_year"].min()),
            int(df["release_year"].max()),
        ],
    }


def main() -> None:
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    df = clean_netflix_titles()
    payload = {
        "generated_at": pd.Timestamp.now("UTC").isoformat(),
        "summary": summary_statistics(df),
        "titles": df.to_dict(orient="records"),
    }
    OUTPUT_PATH.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Wrote {len(df):,} cleaned titles to {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
