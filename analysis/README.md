# Analysis

Python analysis for the course. This is not part of the site build; it produces
the datasets and charts the site consumes.

## Contents

- `export.py` — reads `data/` and writes normalized CSVs to `web/public/data/`
  and static charts to `assets/charts/`. Standard library only for the CSV
  export; chart generation uses matplotlib when installed.
- `fetch_transcripts.py` — fetches YouTube transcripts for the lecture list in
  `content/lectures.txt` into `content/transcripts/`. Requires
  `youtube-transcript-api`.
- `interest-rate-vs-money-supply/` — the original interest-rate versus money
  supply study: monthly chart scripts and the source CSV.

## Running

From the repository root:

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r analysis/requirements.txt

npm run data:export      # or: python3 analysis/export.py
```

## Adding a dataset

1. Put the canonical CSV in `data/`.
2. Copy/transform it in `export.py` so it lands in `web/public/data/`.
3. Load it in the site with `web/src/lib/csv.ts` rather than hardcoding numbers.
