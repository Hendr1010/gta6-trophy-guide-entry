// Palm & Platinum — GTA VI trophy guide and tracker.
// Loads app/data/trophies.json (same origin, no network), renders the checklist,
// the platinum roadmap and the missables page, and saves progress in localStorage.
// Everything runs offline: no request leaves the browser.

const EARNED_KEY = 'palm-platinum-earned';
const SPOILER_KEY = 'palm-platinum-spoiler';
const STAGES = [
  { n: 1, title: 'Stage 1 — Story first, chapters 1 to 4', blurb: 'Play the story in order. Every chapter and mission trophy lands here, and none of them can be missed.' },
  { n: 2, title: 'Stage 2 — Before the finale: the missables', blurb: 'Twelve trophies tied to one-time moments, partner missions or choices. Do them all before the final mission.' },
  { n: 3, title: 'Stage 3 — Strangers & side stories', blurb: 'Eight stranger mission strands, including the five named character finales, the unique-animal hunt and the fishing rivalry.' },
  { n: 4, title: 'Stage 4 — Activities, skills & open-world chaos', blurb: 'Shooting range gold, stunts, races, robberies, laundering and the 50 challenges. The long grind lives here.' },
  { n: 5, title: 'Stage 5 — Collectibles & exploring Leonida', blurb: 'Cards, WAiNK spots, vehicles, garages and the full map. Best done while travelling between other goals.' },
  { n: 6, title: 'Stage 6 — Cleanup: 100% and the platinum', blurb: 'Check the in-game stats for what is left, finish 100% completion, and the platinum pops on its own.' },
];
const KIND_LABELS = { story: 'Story', missable: 'Missable', collectibles: 'Collectibles', activities: 'Activities', online: 'Online' };

const params = new URLSearchParams(location.search);
let earned = new Set(JSON.parse(localStorage.getItem(EARNED_KEY) ?? '[]'));
let spoiler = params.get('spoiler') === 'on' ? true : localStorage.getItem(SPOILER_KEY) === '1';
let kind = 'all';
let grade = 'all';
let query = '';
let earnedOnly = false;
let hideEarned = false;
let openId = params.get('open') ? Number(params.get('open')) : null;

const doc = await (await fetch('data/trophies.json')).json();
const trophies = doc.trophies.slice().sort((a, b) => a.id - b.id);
const byId = new Map(trophies.map((t) => [t.id, t]));

function saveEarned() {
  localStorage.setItem(EARNED_KEY, JSON.stringify([...earned].sort((a, b) => a - b)));
}

function saveSpoiler() {
  localStorage.setItem(SPOILER_KEY, spoiler ? '1' : '0');
}

function gradeIcon(g) {
  return { platinum: '◆', gold: '●', silver: '●', bronze: '●' }[g] ?? '●';
}

function isHiddenBySpoiler(t) {
  return spoiler && t.kind === 'story' && !earned.has(t.id);
}

function el(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
}

function trophyCard(t) {
  const card = el('article', 'trophy' + (earned.has(t.id) ? ' is-earned' : ''));
  card.dataset.id = String(t.id);
  const masked = isHiddenBySpoiler(t);

  const head = el('div', 'trophy-head');
  const box = document.createElement('input');
  box.type = 'checkbox';
  box.checked = earned.has(t.id);
  box.setAttribute('aria-label', 'Mark ' + t.name + ' earned');
  box.addEventListener('change', () => {
    if (box.checked) earned.add(t.id);
    else earned.delete(t.id);
    saveEarned();
    renderAll();
  });
  head.append(box);

  const titleBox = el('div', 'trophy-titles');
  const name = el('h3', 'trophy-name', masked ? 'Hidden Trophy' : t.name);
  const desc = el('p', 'trophy-desc', masked ? 'A story trophy. Earn it to reveal its name and description.' : t.description);
  titleBox.append(name, desc);
  head.append(titleBox);

  const badges = el('div', 'badges');
  const g = el('span', 'badge grade-' + t.grade, gradeIcon(t.grade) + ' ' + t.grade);
  badges.append(g);
  // For missable trophies the red flag IS the kind badge — no duplicate label.
  if (t.kind !== 'missable') badges.append(el('span', 'badge kind', KIND_LABELS[t.kind] ?? t.kind));
  if (t.missable) badges.append(el('span', 'badge missable', '⚠ Missable'));
  if (t.hidden) badges.append(el('span', 'badge hidden', 'Hidden on PSN'));
  head.append(badges);
  card.append(head);

  if (masked) {
    card.append(el('p', 'spoiler-note', 'Spoiler mode is on: the guide for this story trophy stays hidden until you earn it.'));
  } else {
    const toggle = el('button', 'guide-toggle', openId === t.id ? 'Hide guide ▲' : 'Read the guide ▼');
    toggle.type = 'button';
    toggle.addEventListener('click', () => {
      openId = openId === t.id ? null : t.id;
      renderAll();
    });
    card.append(toggle);
    if (openId === t.id) {
      const guide = el('div', 'guide');
      guide.append(el('p', 'guide-text', t.guide));
      const src = el('p', 'guide-source', 'Source: ');
      const a = document.createElement('a');
      a.href = t.sourceUrl;
      a.textContent = t.source;
      a.target = '_blank';
      a.rel = 'noopener';
      src.append(a);
      guide.append(src);
      if (t.missable) {
        guide.append(el('p', 'missable-note', 'Missable: this trophy is tied to a one-time moment or choice. Do it before the final mission — see the Missables tab.'));
      }
      guide.append(el('p', 'roadmap-note', 'Roadmap: stage ' + t.roadmapStage + ', step ' + t.roadmapOrder + ' of 55.'));
      card.append(guide);
    }
  }
  return card;
}

function filtered() {
  const q = query.trim().toLowerCase();
  return trophies.filter((t) => {
    if (kind !== 'all' && t.kind !== kind) return false;
    if (grade !== 'all' && t.grade !== grade) return false;
    if (earnedOnly && !earned.has(t.id)) return false;
    if (hideEarned && earned.has(t.id)) return false;
    if (q) {
      const hay = (t.name + ' ' + t.description + ' ' + t.guide).toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

function renderProgress() {
  const total = trophies.length;
  const n = earned.size;
  document.getElementById('earnedCount').textContent = String(n);
  document.getElementById('barFill').style.width = ((n / total) * 100).toFixed(1) + '%';
  const byGrade = (g) => trophies.filter((t) => t.grade === g && earned.has(t.id)).length;
  const totals = (g) => trophies.filter((t) => t.grade === g).length;
  document.getElementById('progressSub').textContent =
    'Platinum ' + byGrade('platinum') + '/' + totals('platinum') +
    ' · Gold ' + byGrade('gold') + '/' + totals('gold') +
    ' · Silver ' + byGrade('silver') + '/' + totals('silver') +
    ' · Bronze ' + byGrade('bronze') + '/' + totals('bronze');
  const miss = trophies.filter((t) => t.missable);
  document.getElementById('missableSub').textContent =
    'Missables secured ' + miss.filter((t) => earned.has(t.id)).length + '/' + miss.length;
  document.getElementById('missableTabCount').textContent = String(miss.length - miss.filter((t) => earned.has(t.id)).length);
}

function renderChecklist() {
  const list = document.getElementById('trophyList');
  const rows = filtered();
  list.replaceChildren(...rows.map(trophyCard));
  document.getElementById('emptyMsg').hidden = rows.length !== 0;
  document.getElementById('listMeta').textContent =
    'Showing ' + rows.length + ' of ' + trophies.length + ' trophies' +
    (kind !== 'all' ? ' · ' + KIND_LABELS[kind] : '') +
    (grade !== 'all' ? ' · ' + grade : '') +
    (query ? ' · matching "' + query + '"' : '');
}

function renderRoadmap() {
  const wrap = document.getElementById('roadmapStages');
  wrap.replaceChildren();
  const ordered = trophies.slice().sort((a, b) => a.roadmapOrder - b.roadmapOrder);
  for (const stage of STAGES) {
    const members = ordered.filter((t) => t.roadmapStage === stage.n);
    const done = members.filter((t) => earned.has(t.id)).length;
    const section = el('section', 'stage');
    const head = el('div', 'stage-head');
    head.append(el('h3', null, stage.title));
    head.append(el('span', 'stage-count', done + '/' + members.length + ' done'));
    section.append(head, el('p', 'stage-blurb', stage.blurb));
    const ol = el('ol', 'stage-list');
    for (const t of members) {
      const li = el('li', earned.has(t.id) ? 'done' : '');
      const label = el('span', 'stage-step', 'Step ' + t.roadmapOrder + ' — ');
      const nm = el('strong', null, isHiddenBySpoiler(t) ? 'Hidden Trophy' : t.name);
      li.append(label, nm);
      if (t.missable) li.append(el('span', 'badge missable', '⚠ Missable'));
      li.append(el('span', 'stage-grade', ' ' + t.grade));
      ol.append(li);
    }
    section.append(ol);
    wrap.append(section);
  }
}

function renderMissables() {
  const list = document.getElementById('missableList');
  const rows = trophies.filter((t) => t.missable).sort((a, b) => a.roadmapOrder - b.roadmapOrder);
  list.replaceChildren(...rows.map(trophyCard));
}

function setView(view) {
  for (const btn of document.querySelectorAll('.tab')) {
    btn.classList.toggle('active', btn.dataset.view === view);
  }
  document.getElementById('view-checklist').hidden = view !== 'checklist';
  document.getElementById('view-roadmap').hidden = view !== 'roadmap';
  document.getElementById('view-missables').hidden = view !== 'missables';
  document.getElementById('checklistControls').style.display = view === 'checklist' ? '' : 'none';
  if (view === 'roadmap') renderRoadmap();
  if (view === 'missables') renderMissables();
}

function renderAll() {
  renderProgress();
  renderChecklist();
}

for (const btn of document.querySelectorAll('.tab')) {
  btn.addEventListener('click', () => setView(btn.dataset.view));
}
for (const chip of document.querySelectorAll('#kindChips .chip')) {
  chip.addEventListener('click', () => {
    kind = chip.dataset.kind;
    for (const c of document.querySelectorAll('#kindChips .chip')) c.classList.toggle('active', c === chip);
    renderChecklist();
  });
}
document.getElementById('gradeFilter').addEventListener('change', (e) => {
  grade = e.target.value;
  renderChecklist();
});
document.getElementById('search').addEventListener('input', (e) => {
  query = e.target.value;
  renderChecklist();
});
document.getElementById('earnedOnly').addEventListener('change', (e) => {
  earnedOnly = e.target.checked;
  renderChecklist();
});
document.getElementById('hideEarned').addEventListener('change', (e) => {
  hideEarned = e.target.checked;
  renderChecklist();
});
const spoilerBox = document.getElementById('spoilerMode');
spoilerBox.checked = spoiler;
spoilerBox.addEventListener('change', () => {
  spoiler = spoilerBox.checked;
  saveSpoiler();
  renderAll();
});
document.getElementById('exportBtn').addEventListener('click', () => {
  const payload = { app: 'palm-and-platinum', version: 1, earned: [...earned].sort((a, b) => a - b) };
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }));
  a.download = 'gta6-trophy-progress.json';
  a.click();
  URL.revokeObjectURL(a.href);
});
document.getElementById('importFile').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    const ids = Array.isArray(data) ? data : data.earned;
    const valid = new Set(ids.filter((id) => byId.has(id)));
    earned = valid;
    saveEarned();
    renderAll();
    document.getElementById('savedNote').textContent = 'Imported ' + valid.size + ' earned trophies.';
  } catch {
    document.getElementById('savedNote').textContent = 'That file could not be read as trophy progress.';
  }
  e.target.value = '';
});
document.getElementById('resetBtn').addEventListener('click', () => {
  if (!confirm('Clear all earned trophies? This cannot be undone (export first if you want a backup).')) return;
  earned = new Set();
  saveEarned();
  renderAll();
});

const startView = params.get('view');
setView(startView === 'roadmap' || startView === 'missables' ? startView : 'checklist');
renderAll();
