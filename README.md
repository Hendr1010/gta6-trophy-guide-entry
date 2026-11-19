# Palm & Platinum — GTA VI Trophy Guide & Tracker

[![gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/Hendr1010/gta6-trophy-guide-entry/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/Hendr1010/gta6-trophy-guide-entry/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

An offline web app that is the best guide and tracker for all **55 PlayStation 5 trophies** of Grand Theft Auto VI — built for the [make.fun bounty](https://make.fun/bounty/gta6-trophy-guide-01).

## What it does

- **Every trophy, official and exact** — all 55 names, descriptions and grades exactly as PlayStation publishes them (1 platinum, 2 gold, 6 silver, 46 bronze; 28 hidden).
- **A guide to each trophy, in the author's own words, with its source cited** — what to do, where and how, and when it can be missed. Sources (Exophase, PSNProfiles, GTA Wiki, PowerPyx, TrueTrophies) are named and linked beside each guide; their text is never copied.
- **Checklist tracker** — tick trophies off; progress is saved in the browser (localStorage) and can be **exported to a .json file and imported back**.
- **Filters by kind** — story, missable, collectibles, activities, online — plus grade filter, search, earned-only and hide-earned.
- **Spoiler mode** — hides story trophies' names, descriptions and guides until you earn them.
- **Platinum roadmap** — the order to earn them in, in 6 stages: story first, missables before the finale, strangers, activities, collectibles, then 100% and the platinum.
- **Missables flagged** — 12 trophies tied to one-time moments or choices, with their own page and warnings.

## Run it offline

No build step, no network. Serve `app/` with any static server and open `index.html`:

```sh
cd app && python3 -m http.server 8080
# open http://localhost:8080
```

Or open `app/index.html` directly from disk via a local server of your choice. The app loads only its own local files (`app.js`, `style.css`, `data/trophies.json`) and makes no network requests.

## Handing it in

`main.ts` (Node 22+, standard library only) copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the kit's `vendor/makefun-frontend.ts`:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## License

MIT — see [LICENSE](LICENSE). Unofficial fan guide; not affiliated with Rockstar Games, Take-Two Interactive or PlayStation. No official artwork or logos are used.
