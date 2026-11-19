// Leonida — GTA VI trophy guide & tracker.
// Plain static app: loads data/trophies.json from beside this file, keeps
// the checklist in localStorage, and never talks to the network.

const KEY = 'leonida-gta6-trophy-checklist';
const SPOILER_KEY = 'leonida-gta6-spoiler-safe';

const rowsEl = document.getElementById('rows');
const missableEl = document.getElementById('missable-rows');
const roadmapEl = document.getElementById('roadmap');
const searchEl = document.getElementById('search');
const gradeEl = document.getElementById('grade');
const earnedOnlyEl = document.getElementById('earned-only');
const hideEarnedEl = document.getElementById('hide-earned');
const spoilerEl = document.getElementById('spoiler');
const kindChipsEl = document.getElementById('kind-chips');
const progressTextEl = document.getElementById('progress-text');
const progressPctEl = document.getElementById('progress-pct');
const progressFillEl = document.getElementById('progress-fill');
const gradeChipsEl = document.getElementById('grade-chips');
const resultCountEl = document.getElementById('result-count');
const missableCountEl = document.getElementById('missable-count');

const doc = await (await fetch('data/trophies.json')).json();
const trophies = doc.trophies.slice().sort((a, b) => a.id - b.id);

let earned = new Set(JSON.parse(localStorage.getItem(KEY) ?? '[]'));
let spoilerSafe = (localStorage.getItem(SPOILER_KEY) ?? '1') === '1';
spoilerEl.checked = spoilerSafe;

let activeKind = 'all';
let activeTab = 'checklist';

const KINDS = [
  ['all', 'All kinds'],
  ['story', 'Story'],
  ['missable', 'Missable'],
  ['collectibles', 'Collectibles'],
  ['activities', 'Activities'],
  ['online', 'Online'],
  ['platinum', 'Platinum'],
];

const STAGES = [
  [1, 'Play the story', 'Chapters 1–4 and the finale. The backbone of the platinum — every story trophy is unmissable, so just play.'],
  [2, 'Strangers & side stories', 'The stranger mission strands. Clear them as they appear; eight full strands unlock Strangers & Freaks.'],
  [3, 'Activities & races', 'Stunts, shooting range, drone races, fishing, arcade — the repeatable grind, best done while the map is open.'],
  [4, 'Collectibles & exploration', 'Cards, WAiNK check-ins, vehicles, garages and the full map. One long road trip covers most of this stage.'],
  [5, 'Heists & combat', 'Vaults, armored trucks, gang operations and Combat Focus. Bring a good gun and a faster car.'],
  [6, 'Moments, secrets & platinum', 'The one-time moments first, then the 100% cleanup and the platinum itself.'],
];

function save() {
  localStorage.setItem(KEY, JSON.stringify([...earned]));
  localStorage.setItem(SPOILER_KEY, spoilerSafe ? '1' : '0');
}

function isSpoiled(t) {
  return spoilerSafe && t.hidden && !earned.has(t.name);
}

function gradeLabel(g) {
  return g === 'platinum' ? 'Platinum' : g === 'gold' ? 'Gold' : g === 'silver' ? 'Silver' : 'Bronze';
}

function kindLabel(k) {
  return k === 'platinum' ? 'Platinum' : k.charAt(0).toUpperCase() + k.slice(1);
}

function card(t) {
  const article = document.createElement('article');
  article.className = 'card' + (earned.has(t.name) ? ' earned' : '') + (t.missable ? ' is-missable' : '');
  article.dataset.trophyId = String(t.id);

  const head = document.createElement('div');
  head.className = 'card-head';

  const box = document.createElement('input');
  box.type = 'checkbox';
  box.checked = earned.has(t.name);
  box.setAttribute('aria-label', 'Mark ' + t.name + ' as earned');
  box.addEventListener('change', () => {
    if (box.checked) earned.add(t.name);
    else earned.delete(t.name);
    save();
    render();
  });
  head.append(box);

  const titles = document.createElement('div');
  titles.className = 'titles';
  const name = document.createElement('h3');
  name.textContent = isSpoiled(t) ? 'Hidden trophy' : t.name;
  titles.append(name);
  const desc = document.createElement('p');
  desc.className = 'desc';
  desc.textContent = isSpoiled(t)
    ? 'A hidden trophy — earn it in the game to reveal its name and description.'
    : t.description;
  titles.append(desc);
  head.append(titles);

  const badges = document.createElement('div');
  badges.className = 'badges';
  const grade = document.createElement('span');
  grade.className = 'badge grade-' + t.grade;
  grade.textContent = gradeLabel(t.grade);
  badges.append(grade);
  const kind = document.createElement('span');
  kind.className = 'badge kind';
  kind.textContent = kindLabel(t.kind);
  // Missable trophies already carry the orange Missable badge below, so
  // the kind badge would repeat the word — skip it for them.
  if (t.kind !== 'missable') badges.append(kind);
  if (t.missable) {
    const miss = document.createElement('span');
    miss.className = 'badge missable';
    miss.textContent = 'Missable';
    badges.append(miss);
  }
  if (t.hidden && !earned.has(t.name)) {
    const hid = document.createElement('span');
    hid.className = 'badge hidden-flag';
    hid.textContent = 'Hidden';
    badges.append(hid);
  }
  head.append(badges);
  article.append(head);

  const details = document.createElement('details');
  details.className = 'guide';
  const summary = document.createElement('summary');
  summary.textContent = isSpoiled(t) ? 'Guide (hidden until earned)' : 'How to get it';
  details.append(summary);
  const guide = document.createElement('p');
  guide.textContent = isSpoiled(t)
    ? 'This trophy is hidden on PlayStation until you earn it. Its guide stays hidden here too while spoiler-safe mode is on — turn the mode off to read it, or earn the trophy and tick it off.'
    : t.guide;
  details.append(guide);
  if (!isSpoiled(t) && t.source) {
    const src = document.createElement('p');
    src.className = 'source';
    src.textContent = 'Source: ';
    const a = document.createElement('a');
    a.href = t.source.url;
    a.textContent = t.source.name;
    a.rel = 'noopener';
    a.target = '_blank';
    src.append(a);
    details.append(src);
  }
  article.append(details);

  const meta = document.createElement('p');
  meta.className = 'meta';
  meta.textContent = 'Roadmap: stage ' + t.roadmapStage + ' · step ' + t.roadmapOrder + ' of 55';
  article.append(meta);

  return article;
}

function filtered() {
  const q = searchEl.value.trim().toLowerCase();
  return trophies.filter((t) => {
    if (activeKind !== 'all' && t.kind !== activeKind) return false;
    if (gradeEl.value !== 'all' && t.grade !== gradeEl.value) return false;
    if (earnedOnlyEl.checked && !earned.has(t.name)) return false;
    if (hideEarnedEl.checked && earned.has(t.name)) return false;
    if (q) {
      const hay = (t.name + ' ' + t.description + ' ' + t.guide + ' ' + t.kind).toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

function renderProgress() {
  const total = trophies.length;
  const done = earned.size;
  const pct = Math.round((done / total) * 100);
  progressTextEl.textContent = done + ' of ' + total + ' earned';
  progressPctEl.textContent = pct + '%';
  progressFillEl.style.width = pct + '%';

  const counts = { platinum: 0, gold: 0, silver: 0, bronze: 0 };
  const totals = { platinum: 0, gold: 0, silver: 0, bronze: 0 };
  for (const t of trophies) {
    totals[t.grade] += 1;
    if (earned.has(t.name)) counts[t.grade] += 1;
  }
  gradeChipsEl.replaceChildren();
  for (const g of ['platinum', 'gold', 'silver', 'bronze']) {
    const chip = document.createElement('span');
    chip.className = 'grade-chip grade-' + g;
    chip.textContent = gradeLabel(g) + ' ' + counts[g] + '/' + totals[g];
    gradeChipsEl.append(chip);
  }
  const missTotal = trophies.filter((t) => t.missable).length;
  const missDone = trophies.filter((t) => t.missable && earned.has(t.name)).length;
  missableCountEl.textContent = missDone + '/' + missTotal;
}

function renderChecklist() {
  const list = filtered();
  rowsEl.replaceChildren();
  resultCountEl.textContent = list.length === trophies.length
    ? trophies.length + ' trophies'
    : list.length + ' of ' + trophies.length + ' trophies shown';
  if (list.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'empty';
    empty.textContent = 'No trophies match these filters. Clear the search or pick another kind.';
    rowsEl.append(empty);
    return;
  }
  for (const t of list) rowsEl.append(card(t));
}

function renderRoadmap() {
  roadmapEl.replaceChildren();
  for (const [stage, title, blurb] of STAGES) {
    const block = document.createElement('section');
    block.className = 'stage';
    const h = document.createElement('h3');
    h.textContent = 'Stage ' + stage + ' — ' + title;
    block.append(h);
    const p = document.createElement('p');
    p.className = 'stage-blurb';
    p.textContent = blurb;
    block.append(p);
    const ol = document.createElement('ol');
    ol.className = 'stage-list';
    const items = trophies
      .filter((t) => t.roadmapStage === stage)
      .sort((a, b) => a.roadmapOrder - b.roadmapOrder);
    for (const t of items) {
      const li = document.createElement('li');
      li.className = earned.has(t.name) ? 'done' : '';
      const step = document.createElement('span');
      step.className = 'step';
      step.textContent = 'Step ' + t.roadmapOrder + ': ';
      li.append(step);
      const nm = document.createElement('strong');
      nm.textContent = isSpoiled(t) ? 'Hidden trophy' : t.name;
      li.append(nm);
      const gd = document.createElement('span');
      gd.className = 'badge grade-' + t.grade;
      gd.textContent = gradeLabel(t.grade);
      li.append(document.createTextNode(' '));
      li.append(gd);
      if (t.missable) {
        const m = document.createElement('span');
        m.className = 'badge missable';
        m.textContent = 'Missable';
        li.append(document.createTextNode(' '));
        li.append(m);
      }
      if (earned.has(t.name)) {
        const tick = document.createElement('span');
        tick.className = 'done-mark';
        tick.textContent = ' ✓ earned';
        li.append(tick);
      }
      ol.append(li);
    }
    block.append(ol);
    roadmapEl.append(block);
  }
}

function renderMissables() {
  missableEl.replaceChildren();
  const list = trophies.filter((t) => t.missable).sort((a, b) => a.roadmapOrder - b.roadmapOrder);
  for (const t of list) missableEl.append(card(t));
}

function render() {
  renderProgress();
  renderChecklist();
  renderRoadmap();
  renderMissables();
}

function setTab(tab) {
  activeTab = tab;
  document.querySelectorAll('.tab').forEach((b) => {
    const on = b.dataset.tab === tab;
    b.classList.toggle('active', on);
    b.setAttribute('aria-selected', on ? 'true' : 'false');
  });
  document.querySelectorAll('.panel').forEach((p) => {
    p.classList.toggle('active', p.id === 'tab-' + tab);
  });
}

document.querySelectorAll('.tab').forEach((b) => {
  b.addEventListener('click', () => setTab(b.dataset.tab));
});

for (const [kind, label] of KINDS) {
  const chip = document.createElement('button');
  chip.type = 'button';
  chip.className = 'chip' + (kind === 'all' ? ' active' : '');
  chip.textContent = label;
  chip.addEventListener('click', () => {
    activeKind = kind;
    document.querySelectorAll('#kind-chips .chip').forEach((c) => {
      c.classList.toggle('active', c === chip);
    });
    renderChecklist();
  });
  kindChipsEl.append(chip);
}

searchEl.addEventListener('input', renderChecklist);
gradeEl.addEventListener('change', renderChecklist);
earnedOnlyEl.addEventListener('change', renderChecklist);
hideEarnedEl.addEventListener('change', renderChecklist);
spoilerEl.addEventListener('change', () => {
  spoilerSafe = spoilerEl.checked;
  save();
  render();
});

document.getElementById('export').addEventListener('click', () => {
  const blob = new Blob([JSON.stringify([...earned], null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'gta6-trophy-progress.json';
  a.click();
  URL.revokeObjectURL(a.href);
});

document.getElementById('import').addEventListener('change', async (event) => {
  const file = event.target.files && event.target.files[0];
  if (!file) return;
  try {
    const names = JSON.parse(await file.text());
    if (!Array.isArray(names)) throw new Error('not an array');
    const known = new Set(trophies.map((t) => t.name));
    earned = new Set(names.filter((n) => typeof n === 'string' && known.has(n)));
    save();
    render();
  } catch {
    alert('That file is not a valid progress export.');
  }
  event.target.value = '';
});

document.getElementById('reset').addEventListener('click', () => {
  if (confirm('Clear every tick? Export first if you want a backup.')) {
    earned = new Set();
    save();
    render();
  }
});

render();
