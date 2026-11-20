# LEONIDA — GTA VI Trophy Guide & Tracker

[![GTA 6 Trophy Guide](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![Rank](https://make.fun/badge/gta6-trophy-guide-01/Hendr1010/gta6-trophy-guide-entry/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![Reward](https://make.fun/badge/gta6-trophy-guide-01/Hendr1010/gta6-trophy-guide-entry/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

An offline web app that guides and tracks all 55 PlayStation 5 trophies of Grand Theft Auto VI — built for the [gta6-trophy-guide-01](https://make.fun/bounty/gta6-trophy-guide-01) bounty on make.fun.

## What it is

- **Checklist tracker** — every trophy with its official name, description and grade (1 platinum, 2 gold, 6 silver, 46 bronze). Tick one off and it stays ticked in localStorage; export your progress to a file and import it back, or reset it.
- **Filters** — search by name, filter by kind (story, missable, collectibles, activities, online) and by grade, hide earned trophies.
- **Spoiler mode (on by default)** — the 28 hidden story trophies stay masked until you earn them.
- **Platinum Roadmap** — six stages in order: story, side strands, missables, collectibles, activities, then cleanup and the platinum.
- **Missables** — the 12 trophies tied to one-time moments or choices, flagged with a warning to do them before they pass.
- **A guide to each trophy, in our own words, with its sources named** — Exophase and PSNProfiles for the official list, plus GTA Wiki, PowerPyx and TrueTrophies where the guide draws on them. A place or step is not pinned down where it has not been checked in the game.

## Use it

Serve `app/` with any static file server and open `app/index.html` in desktop Chrome. It works with the network off — it loads nothing over the network.

```sh
python3 -m http.server 8080 --directory app
```

Then open http://localhost:8080.

## Hand it in

`main.ts` (Node 22, standard library only) copies `app/` and `screenshots/` to `/output` and writes `/output/dossier.json` with the vendored make.fun library:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## Notes

Unofficial fan guide. Not affiliated with Rockstar Games, Sony or PlayStation. No Rockstar logo, official artwork, box art or game screenshots are used. MIT licensed.
