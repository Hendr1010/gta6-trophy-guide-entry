// LEONIDA — GTA VI trophy guide & tracker.
// Checklist saved in localStorage; export/import; filters; spoiler mode; roadmap; missables.
const KEY = 'leonida-gta6-trophies-v1';
const listEl = document.getElementById('list');
const detailEl = document.getElementById('detail');
const searchEl = document.getElementById('search');
const gradeEl = document.getElementById('grade');
const spoilerEl = document.getElementById('spoiler');
const hideEarnedEl = document.getElementById('hide-earned');
const progressFill = document.getElementById('progress-fill');
const progressText = document.getElementById('progress-text');
const countsEl = document.getElementById('counts');
const emptyEl = document.getElementById('empty');

const doc = await (await fetch('data/trophies.json')).json();
const trophies = doc.trophies;
let earned = new Set(JSON.parse(localStorage.getItem(KEY) ?? '[]'));
let kind = 'all';
let selectedId = null;

function save() {
  localStorage.setItem(KEY, JSON.stringify([...earned]));
}

function gradeLabel(t) {
  return t.grade.charAt(0).toUpperCase() + t.grade.slice(1);
}

function isMasked(t) {
  return spoilerEl.checked && t.hidden && !earned.has(t.id);
}

function visibleTrophies() {
  const q = searchEl.value.trim().toLowerCase();
  return trophies.filter((t) => {
    if (kind === 'missable' && !t.missable) return false;
    if (kind !== 'all' && kind !== 'missable' && t.kind !== kind) return false;
    if (kind === 'online') return false;
    if (gradeEl.value !== 'all' && t.grade !== gradeEl.value) return false;
    if (hideEarnedEl.checked && earned.has(t.id)) return false;
    if (q && !(t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q))) return false;
    return true;
  });
}

function sourceLinks(t) {
  return t.sources.map((s) => {
    if (s === 'Exophase') return '<a href="https://www.exophase.com/game/grand-theft-auto-vi-psn/trophies/">Exophase</a>';
    if (s === 'PSNProfiles') return '<a href="https://psnprofiles.com/trophies/43531-grand-theft-auto-vi">PSNProfiles</a>';
    if (s === 'GTA Wiki') return '<a href="https://gta.fandom.com/wiki/Grand_Theft_Auto_VI">GTA Wiki</a>';
    if (s === 'PowerPyx') return '<a href="https://www.powerpyx.com/">PowerPyx</a>';
    return '<a href="https://www.truetrophies.com/">TrueTrophies</a>';
  }).join(' &middot; ');
}

function trophyCard(t, showGuide) {
  const li = document.createElement('li');
  li.className = 'trophy' + (earned.has(t.id) ? ' earned' : '');
  const box = document.createElement('input');
  box.type = 'checkbox';
  box.checked = earned.has(t.id);
  box.setAttribute('aria-label', 'Mark ' + t.name + ' earned');
  box.addEventListener('change', () => {
    if (box.checked) earned.add(t.id);
    else earned.delete(t.id);
    save();
    render();
  });
  li.append(box);
  const body = document.createElement('div');
  const head = document.createElement('div');
  head.className = 'trophy-head';
  const name = document.createElement('span');
  name.className = 'trophy-name' + (isMasked(t) ? ' masked' : '');
  name.textContent = isMasked(t) ? 'Hidden trophy — earn it to reveal' : t.name;
  head.append(name);
  const badge = document.createElement('span');
  badge.className = 'badge ' + t.grade;
  badge.textContent = gradeLabel(t);
  head.append(badge);
  if (t.missable) {
    const flag = document.createElement('span');
    flag.className = 'flag';
    flag.textContent = 'Missable';
    head.append(flag);
  }
  const kindTag = document.createElement('span');
  kindTag.className = 'kind-tag';
  kindTag.textContent = t.kind + ' · stage ' + t.stage;
  head.append(kindTag);
  body.append(head);
  if (!isMasked(t)) {
    const desc = document.createElement('p');
    desc.className = 'trophy-desc';
    desc.textContent = t.description;
    body.append(desc);
  }
  if (showGuide && !isMasked(t)) {
    const guide = document.createElement('p');
    guide.className = 'trophy-guide';
    guide.textContent = t.guide;
    body.append(guide);
    const src = document.createElement('p');
    src.className = 'trophy-sources';
    src.innerHTML = 'Sources: ' + sourceLinks(t);
    body.append(src);
  }
  li.append(body);
  li.addEventListener('click', (e) => {
    if (e.target === box) return;
    selectedId = selectedId === t.id ? null : t.id;
    renderDetail();
    if (selectedId !== null) detailEl.scrollIntoView({ block: 'start' });
  });
  return li;
}

function renderList() {
  listEl.replaceChildren();
  const shown = visibleTrophies();
  emptyEl.hidden = shown.length !== 0;
  if (kind === 'online') {
    emptyEl.hidden = false;
    emptyEl.textContent = 'No online trophies in this list — all 55 are single-player.';
  } else {
    emptyEl.textContent = 'No trophies match these filters.';
  }
  for (const t of shown) listEl.append(trophyCard(t, true));
}

function renderDetail() {
  if (selectedId === null) {
    detailEl.hidden = true;
    detailEl.replaceChildren();
    return;
  }
  const t = trophies.find((x) => x.id === selectedId);
  detailEl.hidden = false;
  detailEl.replaceChildren();
  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'close';
  close.textContent = 'Close';
  close.addEventListener('click', () => { selectedId = null; renderDetail(); });
  detailEl.append(close);
  const h = document.createElement('h3');
  h.textContent = isMasked(t) ? 'Hidden trophy' : t.name;
  detailEl.append(h);
  const meta = document.createElement('p');
  meta.className = 'trophy-desc';
  meta.textContent = gradeLabel(t) + ' · ' + t.kind + (t.missable ? ' · MISSABLE' : '') + ' · roadmap stage ' + t.stage;
  detailEl.append(meta);
  if (!isMasked(t)) {
    const desc = document.createElement('p');
    desc.textContent = 'Official description: ' + t.description;
    detailEl.append(desc);
    const guide = document.createElement('p');
    guide.textContent = t.guide;
    detailEl.append(guide);
    const src = document.createElement('p');
    src.className = 'trophy-sources';
    src.innerHTML = 'Sources: ' + sourceLinks(t);
    detailEl.append(src);
  } else {
    const note = document.createElement('p');
    note.textContent = 'Spoiler mode is on: this story trophy stays hidden until you earn it. Turn spoiler mode off, or tick it earned, to see its name, description and guide.';
    detailEl.append(note);
  }
}

const STAGES = [
  { n: 1, title: 'Play the story', text: 'Chapters 1–4 and the story missions. All 12 of these trophies are unmissable — just follow the missions to the end of each chapter.' },
  { n: 2, title: 'Side strands', text: 'The mission strands for Andy, Kenton, Billy, Randy and Tyrone, plus 8 stranger strands across Leonida. Finish each strand to its final mission.' },
  { n: 3, title: 'Missables — before they pass', text: 'The 12 one-time trophies. Do these now, while their moments are open, or they need a new playthrough.' },
  { n: 4, title: 'Collectibles', text: 'Card sets, WAiNK spots, vehicles, garages, laundered bills and shop spending. Methodical work — clear them area by area.' },
  { n: 5, title: 'Activities & challenges', text: 'Stunts, races, the shooting range, fishing, arcade, meditation, hunting and the 50 challenges. The long grind lives here.' },
  { n: 6, title: 'Cleanup & platinum', text: '100% completion, then the platinum pops on its own. Check the checklist for anything left.' },
];

function renderRoadmap() {
  const ol = document.getElementById('roadmap');
  ol.replaceChildren();
  for (const s of STAGES) {
    const li = document.createElement('li');
    li.className = 'stage';
    const h = document.createElement('h3');
    h.textContent = s.title;
    li.append(h);
    const p = document.createElement('p');
    p.textContent = s.text;
    li.append(p);
    const ul = document.createElement('ul');
    for (const t of trophies.filter((x) => x.stage === s.n)) {
      const item = document.createElement('li');
      if (earned.has(t.id)) item.className = 'earned';
      item.textContent = (earned.has(t.id) ? '✓ ' : '') + (isMasked(t) ? 'Hidden trophy' : t.name) + ' — ' + gradeLabel(t);
      ul.append(item);
    }
    li.append(ul);
    ol.append(li);
  }
}

function renderMissables() {
  const ul = document.getElementById('miss-list');
  ul.replaceChildren();
  for (const t of trophies.filter((x) => x.missable)) ul.append(trophyCard(t, true));
}

function renderProgress() {
  const n = earned.size;
  const total = trophies.length;
  const pct = Math.round((n / total) * 100);
  progressFill.style.width = pct + '%';
  progressText.textContent = n + ' of ' + total + ' earned · ' + pct + '%';
  const byGrade = {};
  for (const t of trophies) {
    byGrade[t.grade] = byGrade[t.grade] || { got: 0, total: 0 };
    byGrade[t.grade].total += 1;
    if (earned.has(t.id)) byGrade[t.grade].got += 1;
  }
  countsEl.textContent = ['platinum', 'gold', 'silver', 'bronze']
    .map((g) => gradeLabel({ grade: g }) + ' ' + byGrade[g].got + '/' + byGrade[g].total)
    .join(' · ') + ' · Missable ' + trophies.filter((t) => t.missable && earned.has(t.id)).length + '/12';
  document.getElementById('miss-count').textContent = trophies.filter((t) => t.missable).length;
}

function render() {
  renderList();
  renderDetail();
  renderRoadmap();
  renderMissables();
  renderProgress();
}

document.querySelectorAll('.tab').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    const view = btn.dataset.view;
    document.getElementById('view-checklist').hidden = view !== 'checklist';
    document.getElementById('view-roadmap').hidden = view !== 'roadmap';
    document.getElementById('view-missables').hidden = view !== 'missables';
  });
});

document.querySelectorAll('#kind-chips .chip').forEach((chip) => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('#kind-chips .chip').forEach((c) => c.classList.remove('active'));
    chip.classList.add('active');
    kind = chip.dataset.kind;
    renderList();
  });
});

searchEl.addEventListener('input', renderList);
gradeEl.addEventListener('change', renderList);
spoilerEl.addEventListener('change', render);
hideEarnedEl.addEventListener('change', renderList);

document.getElementById('export').addEventListener('click', () => {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify([...earned])], { type: 'application/json' }));
  a.download = 'leonida-progress.json';
  a.click();
});

document.getElementById('import').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const ids = JSON.parse(await file.text());
    earned = new Set(ids.filter((id) => trophies.some((t) => t.id === id)));
    save();
    render();
  } catch {
    alert('That file is not a LEONIDA progress export.');
  }
});

document.getElementById('reset').addEventListener('click', () => {
  if (confirm('Reset all progress? This clears every ticked trophy.')) {
    earned = new Set();
    save();
    render();
  }
});

render();
