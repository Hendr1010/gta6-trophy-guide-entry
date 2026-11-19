[![GTA 6 Trophy Guide](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![Rank](https://make.fun/badge/gta6-trophy-guide-01/Hendr1010/gta6-trophy-guide-entry/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![Reward](https://make.fun/badge/gta6-trophy-guide-01/Hendr1010/gta6-trophy-guide-entry/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

# Leonida — GTA VI Trophy Guide & Tracker

The complete guide and tracker for all **55 PlayStation 5 trophies** of Grand Theft Auto VI: every official name, description and grade, a guide to each trophy in our own words with its source cited, a checklist that saves in your browser, a six-stage roadmap to the platinum, and a missables list so a one-time moment never costs you a second playthrough.

## What it does

- **Checklist** — tick trophies off as you earn them; progress saves in the browser (localStorage). Search, filter by kind (story / missable / collectibles / activities / online) and grade, show earned-only or hide earned.
- **Spoiler-safe mode** — on by default: hidden story trophies stay masked (name, description and guide) until you earn them.
- **Platinum Roadmap** — the 55 trophies in six stages, in the order to earn them: story, strangers, activities, collectibles, heists, then the one-time moments and the 100% cleanup.
- **Missables** — the 12 one-time trophies, with a warning to do them before they pass. Read this tab before you start the story.
- **Export / import** — download your progress as JSON and import it back on any machine. Reset clears every tick.
- **Every guide cites its source** — Exophase, PSNProfiles, GTA Wiki, PowerPyx and TrueTrophies, named beside each guide. Trophy names and descriptions are shown exactly as PlayStation publishes them; the guides themselves are written in our own words.

## Run it offline

No build step, no network requests, no account. Open `app/index.html` in a browser, or serve the `app/` folder:

```sh
python3 -m http.server --directory app 8080
# then open http://localhost:8080
```

## Hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
# out/ holds app/, screenshots/ and dossier.json
```

## Files

- `main.ts` — copies `app/` and `screenshots/` to the output dir and writes `dossier.json` (Node 22, standard library only).
- `app/index.html`, `app/app.js`, `app/style.css` — the guide itself.
- `app/data/trophies.json` — the 55 trophies with official names/descriptions/grades, kinds, hidden flags, missable flags, roadmap order, guides and sources.
- `screenshots/` — four real renders of the app (checklist, trophy detail, roadmap, missables).
- `vendor/makefun-frontend.ts` — the kit's dossier library, unchanged.

Unofficial fan guide. Not affiliated with Rockstar Games or Sony Interactive Entertainment.
