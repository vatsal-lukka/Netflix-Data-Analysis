# Netflix Analytics Dashboard

A portfolio-ready analytics dashboard for the Netflix Titles dataset. The project combines Python data preprocessing with a modern Next.js 15 interface, interactive Plotly visualizations, animated UI states, and responsive filtering.

## Features

- Netflix-inspired dark theme with polished cards, glass surfaces, hover states, and Framer Motion animations.
- Python preprocessing pipeline using Pandas and NumPy.
- KPI cards for total titles, movies, TV shows, countries, genres, and directors.
- Professional filter sidebar for content type, country, genre, rating, release year, director, and instant search.
- Interactive Plotly charts for catalog mix, yearly additions, release years, countries, genres, ratings, duration, seasons, directors, actors, and monthly additions.
- Automatically generated insight cards that update with filters.
- Searchable movie and TV catalog cards with description, country, genre, rating, release year, cast, and director.
- SEO metadata, Open Graph, Twitter Cards, strict TypeScript, and Vercel-ready configuration.

## Technology Stack

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- shadcn/ui-inspired reusable primitives
- Framer Motion
- Plotly.js
- Python, Pandas, NumPy
- Lucide React
- Vercel

## Screenshots

Add screenshots to the `screenshots/` folder after running the app locally.

## Installation

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Python Preprocessing

Run the data pipeline from the project root:

```bash
python python/preprocess.py
```

The script loads `netflix_titles.csv`, removes duplicate rows and duplicate `show_id` records, normalizes missing text fields, converts `date_added` to datetime, extracts `year_added`, `month_added`, and `day_added`, derives `movie_duration` and `tv_seasons`, splits `country`, `listed_in`, `director`, and `cast` into arrays, computes summary statistics, and writes `public/netflix.json`.

## Folder Structure

```text
Netflix-Analytics-Dashboard/
├── app/
├── components/
│   ├── Charts/
│   └── ui/
├── lib/
├── public/
├── python/
├── screenshots/
├── netflix_titles.csv
├── package.json
├── requirements.txt
└── README.md
```

## Deployment on Vercel

1. Push the repository to GitHub.
2. Import the project in Vercel.
3. Use the default Next.js build command: `npm run build`.
4. Keep `public/netflix.json` committed so the dashboard deploys without a Python runtime.

## Future Improvements

- Add poster image enrichment from a movie metadata API.
- Add saved filter presets and shareable dashboard URLs.
- Add downloadable CSV exports for filtered results.
- Add time-series forecasting for future content additions.

## License

MIT

## Author

Your Name
