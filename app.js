/* 塔罗之路 · 应用逻辑 */
const KEY = 'tarot-path-v2';
const DEFAULTS = {
  xp: 0, gems: 120, hearts: 5, streak: 0, lastDate: null,
  completed: {}, wrongCards: [], sound: true, dailyXp: 0, dailyDate: null, chapter: 0, storyIndex: 0
};

function loadState() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : { ...DEFAULTS };
  } catch (e) { return { ...DEFAULTS }; }
}
function save() { localStorage.setItem(KEY, JSON.stringify(state)); }
let state = loadState();
let ctx = { level: null, questions: [], idx: 0, correct: 0, answered: false, lastResult: null };

const $ = (id) => document.getElementById(id);
const today = () => dstr(new Date());
function dstr(d) { return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; }
function yesterdayStr() { const d = new Date(); d.setDate(d.getDate() - 1); return dstr(d); }
function toast(msg) {
  const el = $('toast');
  el.textContent = msg; el.classList.add('show');
  clearTimeout(toast.t);
  toast.t = setTimeout(() => el.classList.remove('show'), 2200);
}
let audioCtx;
function playSound(ok) {
  if (!state.sound) return;
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const o = audioCtx.createOscillator(), g = audioCtx.createGain();
    o.type = 'sine'; o.frequency.value = ok ? 680 : 210;
    g.gain.setValueAtTime(0.07, audioCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.18);
    o.connect(g); g.connect(audioCtx.destination);
    o.start(); o.stop(audioCtx.currentTime + 0.2);
  } catch (e) { /* 静默失败 */ }
}
function cardImg(id, cls = '', reversed = false) {
  return `<img class="card-img ${cls} ${reversed ? 'reversed-img' : ''}" src="${cardImage(id)}" alt="塔罗牌" loading="lazy">`;
}
function stars(n) { return '★'.repeat(n) + '☆'.repeat(3 - n); }
function firstIncomplete() {
  const i = LEVELS.findIndex(l => !state.completed[l.id]);
  return i === -1 ? LEVELS.length - 1 : i;
}
function chapterUnlocked(ci) {
  if (ci === 0 || (UNITS[ci] && UNITS[ci].reverse)) return true;
  const prevBoss = LEVELS.find(l => l.chapter === ci - 1 && l.kind === 'boss');
  return !!state.completed[prevBoss.id];
}

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => {
    const wasActive = s.classList.contains('active');
    s.classList.toggle('active', s.id === id);
    if (!wasActive && s.id === id) s.classList.remove('screen-in'), void s.offsetWidth, s.classList.add('screen-in');
  });
  const tab = id === 'homeScreen' ? 'home' : id === 'cardsScreen' ? 'cards' : id === 'storiesScreen' ? 'stories' : id === 'profileScreen' ? 'profile' : null;
  if (tab) document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
  document.querySelectorAll('.scroll-area').forEach(el => { el.scrollTop = 0; });
}

/* ---------- 首页：章节地图 ---------- */
function renderTop() {
  $('statStreak').textContent = state.streak;
  $('statGems').textContent = state.gems;
  $('statHearts').textContent = state.hearts;
}
function renderDaily() {
  if (state.dailyDate !== today()) { state.dailyXp = 0; state.dailyDate = today(); save(); }
  const goal = 40;
  const pct = Math.min(100, Math.round(state.dailyXp / goal * 100));
  $('dailyCard').innerHTML = `
    <div class="daily-top"><span>今日目标 · ${state.dailyXp >= goal ? '已达成 ✦' : '再学一点点'}</span><span>🔥 ${state.streak} 天</span></div>
    <div class="daily-goal">${state.dailyXp} / ${goal} XP</div>
    <div class="daily-bar"><i style="width:${pct}%"></i></div>
    <div class="daily-foot"><span>每天一点点，愚者也会走到世界</span><span>${state.dailyXp >= goal ? '太棒了' : `还差 ${goal - state.dailyXp} XP`}</span></div>`;
}
function renderChapterSwitch() {
  const currentChapter = LEVELS[firstIncomplete()].chapter;
  $('chapterSwitch').innerHTML = UNITS.map((u, i) => {
    const done = LEVELS.filter(l => l.chapter === i && state.completed[l.id]).length;
    const total = LEVELS.filter(l => l.chapter === i).length;
    const unlocked = chapterUnlocked(i);
    return `<button class="chapter-chip ${i === state.chapter ? 'active' : ''} ${unlocked ? '' : 'locked'} ${done === total ? 'finished' : ''}" data-chapter="${i}">
      <span class="cc-num">${i + 1}</span>
      <span class="cc-text"><b>${u.title.split(' · ')[0]}</b><small>${done}/${total} 关</small></span>
      ${unlocked ? '' : '<span class="cc-lock">🔒</span>'}
    </button>`;
  }).join('');
  $('chapterSwitch').querySelectorAll('.chapter-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      const ci = Number(btn.dataset.chapter);
      if (!chapterUnlocked(ci)) { toast('完成上一章的挑战后解锁'); return; }
      state.chapter = ci; save();
      renderChapterSwitch(); renderMap();
      $('mapWrap').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
  const active = $('chapterSwitch').querySelector('.chapter-chip.active');
  if (active) active.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
}
function renderMap() {
  const ci = state.chapter;
  const unit = UNITS[ci];
  const levels = LEVELS.filter(l => l.chapter === ci);
  const currentIndex = firstIncomplete();
  const chapterCurrent = levels.findIndex(l => !state.completed[l.id]);
  const doneCount = levels.filter(l => state.completed[l.id]).length;
  $('mapChapterLabel').innerHTML = `
    <span class="map-label-pill" style="background:${unit.color}">第 ${ci + 1} 章</span>
    <div><h2>${unit.title.split(' · ')[1] || unit.title}</h2><p>${unit.sub} · ${doneCount}/${levels.length} 关 · ${ci === 0 ? '旅程开始' : '继续前进'}</p></div>`;

  let html = '';
  levels.forEach((level, j) => {
    const done = !!state.completed[level.id];
    const isCurrent = unit.reverse
      ? j === (chapterCurrent === -1 ? levels.length - 1 : chapterCurrent)
      : level.index === currentIndex;
    const locked = !unit.reverse && !done && !isCurrent;
    const side = j % 2 === 0 ? 'ml' : 'mr';
    const phaseClass = level.phase.includes('记忆') ? 'memory' : level.phase.includes('练习') ? 'practice' : 'challenge';
    html += `<div class="map-step ${side} ${phaseClass}">
      <button class="map-node ${done ? 'done' : isCurrent ? 'current' : 'locked'} ${level.kind === 'boss' || level.final ? 'boss-node' : ''} ${isCurrent ? 'pulse' : ''}"
        data-level="${level.id}" aria-label="${level.title}">
        <span class="mn-icon">${done ? '✓' : locked ? '🔒' : level.icon}</span>
        ${isCurrent ? '<span class="mn-flag">开始</span>' : ''}
      </button>
      <div class="map-meta">
        <span class="map-phase">${level.phase}</span>
        <b>${level.title}</b>
        <span class="map-stars">${done ? stars(state.completed[level.id].stars) : '☆☆☆'}</span>
      </div>
    </div>`;
    if (unit.reverse && j === 2) html += '<div class="map-zone"><span>✦ 记住倒过来的牌 · 再读它的故事 ✦</span></div>';
    if (!unit.reverse && j === 3) html += '<div class="map-zone"><span>✦ 记忆完成 · 进入练习区 ✦</span></div>';
    if (!unit.reverse && j === 6) html += '<div class="map-zone boss-zone"><span>👑 前方是本章挑战</span></div>';
  });
  html += `<div class="map-end"><span>✧ 第 ${ci + 1} 章终点 ✧</span></div>`;
  $('pathContainer').innerHTML = html;
  $('pathContainer').querySelectorAll('.map-node').forEach(btn => {
    btn.addEventListener('click', () => {
      const level = LEVELS.find(l => l.id === btn.dataset.level);
      if (!level) return;
      if (!level.reverse && level.index > currentIndex && !state.completed[level.id]) {
        toast('先完成前面的关卡吧 ✦');
        playSound(false);
        return;
      }
      startLevel(level);
    });
  });
}
function renderReviewBanner() {
  const n = state.wrongCards.length;
  $('reviewBanner').innerHTML = `
    <div class="rb-ico">${n ? '🧠' : '✨'}</div>
    <div><h3>${n ? `错题复习 · ${n} 张待巩固` : '错题本空空的'}</h3>
    <p>${n ? '把答错的牌再练一遍，记得更牢' : '先去闯关，答错的牌会自动收集到这里'}</p></div>
    <button id="reviewGo">${n ? '开始复习' : '去学习'}</button>`;
  $('reviewGo').addEventListener('click', () => n ? startReview() : showScreen('homeScreen'));
}
function renderHome() {
  $('pathHeadSub').textContent = `${UNITS.length} 个章节 · ${LEVELS.length} 个关卡 · 先看图记住，再练习读懂`;
  renderTop(); renderDaily(); renderChapterSwitch(); renderMap(); renderReviewBanner();
}

/* ---------- 关卡流程 ---------- */
const LEVEL_PLAN = {
  imageName: { types: ['name'], count: 6 },
  nameImage: { types: ['imageChoice'], count: 6 },
  imageKeyword: { types: ['keyword'], count: 6 },
  reversed: { types: ['reversed'], count: 6 },
  symbol: { types: ['symbol'], count: 5 },
  scenario: { types: ['scenario', 'judge'], count: 6 },
  boss: { types: ['name', 'imageChoice', 'keyword', 'reversed', 'symbol', 'journey', 'judge', 'scenario', 'order'], count: 10 },
  final: { types: ['name', 'imageChoice', 'keyword', 'reversed', 'symbol', 'journey', 'judge', 'scenario', 'order'], count: 12 },
  reverseImageName: { types: ['reverseName'], count: 8 },
  reverseKeyword: { types: ['reverseReversed'], count: 8 },
  reverseScenario: { types: ['reverseScenario', 'reverseReversed'], count: 8 },
  reverseBoss: { types: ['reverseName', 'reverseImageChoice', 'reverseReversed', 'reverseScenario', 'name', 'imageChoice', 'reversed'], count: 12 },
  review: { types: ['name', 'imageChoice', 'keyword', 'reversed', 'scenario'], count: 6 },
  custom: { types: ['name', 'imageChoice', 'keyword', 'reversed', 'scenario'], count: 4 }
};
function startLevel(level) {
  ctx.level = level;
  ctx.idx = 0; ctx.correct = 0; ctx.answered = false;
  $('lessonTitle').textContent = level.title;
  $('lessonHearts').textContent = state.hearts;
  $('lessonProgress').style.width = '0%';
  if (level.kind === 'study' || level.kind === 'reverseStudy') renderStudy(level);
  else {
    const plan = LEVEL_PLAN[level.kind] || LEVEL_PLAN.boss;
    ctx.questions = buildQuestions(level.cards, plan.count, plan.types);
    renderQuestion();
  }
  showScreen('lessonScreen');
}
function renderStudy(level) {
  let i = 0, flipped = false;
  const rev = !!level.reverse;
  function draw() {
    const c = byId(level.cards[i]);
    const dots = level.cards.map((_, k) => `<i class="${k === i ? 'on' : ''}"></i>`).join('');
    $('lessonProgress').style.width = `${(i + 1) / level.cards.length * 100}%`;
    $('lessonBody').innerHTML = `
      <div class="study-head"><h2>${rev ? '倒过来的牌，也有话要说' : '先看图，记住它'}</h2><p>${rev ? '点牌面翻到背面，读一读它的逆位故事' : '点击牌面翻到背面，看看它的关键词'}</p></div>
      <div class="flip-stage">
        <div class="flip-card ${flipped ? 'flipped' : ''}" id="flipCard">
          <div class="flip-inner">
            <div class="flip-face flip-front">${cardImg(c.id, 'study-img', rev)}<span class="flip-hint">点击翻面 ↻</span></div>
            <div class="flip-face flip-back ${rev ? 'reverse-back' : ''}">
              <span class="fb-num">${rev ? '逆位 · ' : ''}${c.num}</span>
              <h3>${c.name} <small>${c.en}</small></h3>
              <div class="fb-kw ${rev ? 'rev-only' : 'rev'}"><b>${rev ? '逆位含义' : '逆位'}</b> ${c.reversed.join(' · ')}</div>
              ${rev ? '' : `<div class="fb-kw"><b>正位</b> ${c.upright.join(' · ')}</div>`}
              <p>${rev ? STORIES[c.id].reversed : c.story}</p>
              <span class="flip-hint">再点一下回到牌面 ↺</span>
            </div>
          </div>
        </div>
      </div>
      <div class="study-dots">${dots}</div>
      <div class="study-actions">
        <button class="secondary-btn" id="prevCard" ${i === 0 ? 'disabled' : ''}>← 上一张</button>
        <button class="primary-btn" id="nextCard">${i === level.cards.length - 1 ? '记住了，完成 ✓' : '下一张 →'}</button>
      </div>`;
    $('flipCard').addEventListener('click', () => { flipped = !flipped; $('flipCard').classList.toggle('flipped', flipped); playSound(true); });
    $('prevCard').addEventListener('click', () => { if (i > 0) { i--; flipped = false; draw(); } });
    $('nextCard').addEventListener('click', () => {
      if (i < level.cards.length - 1) { i++; flipped = false; draw(); }
      else {
        ctx.questions = new Array(level.cards.length).fill(null);
        ctx.correct = ctx.questions.length;
        finishLesson();
      }
    });
  }
  draw();
}
function renderQuestion() {
  hideFeedback();
  ctx.answered = false;
  const q = ctx.questions[ctx.idx];
  $('lessonHearts').textContent = state.hearts;
  $('lessonProgress').style.width = `${Math.round((ctx.idx + 1) / ctx.questions.length * 100)}%`;
  let html = `<div class="q-tag">${q.tag}</div>`;
  if (q.showCard) html += `<div class="q-card-wrap">${cardImg(q.cardId, 'question-img', q.reversed)}</div>`;
  html += `<h2 class="q-prompt">${q.prompt}</h2>`;
  if (q.type === 'imageChoice') {
    html += `<div class="image-options">${q.images.map(id => `<button class="image-option" data-id="${id}">${cardImg(id, '', q.reversed)}</button>`).join('')}</div>`;
  } else if (q.type === 'order') {
    html += `<div class="order-answer" id="orderAnswer"><span class="order-placeholder">依次点击下面的牌，排出正确顺序</span></div>
      <div class="order-bank" id="orderBank">${q.items.map((id, i) => `<button class="order-chip" data-i="${i}" data-id="${id}">${cardImg(id, 'chip-img')}<span>${byId(id).name}</span></button>`).join('')}</div>`;
  } else {
    const keys = ['A', 'B', 'C', 'D'];
    html += `<div class="options">${q.options.map((o, i) => `<button class="option" data-i="${i}"><span class="key">${keys[i]}</span><span>${o.text}</span></button>`).join('')}</div>`;
  }
  $('lessonBody').innerHTML = html;
  $('lessonBody').scrollTop = 0;

  if (q.type === 'imageChoice') {
    $('lessonBody').querySelectorAll('.image-option').forEach(btn => {
      btn.addEventListener('click', () => answerImageChoice(q, Number(btn.dataset.id)));
    });
  } else if (q.type === 'order') {
    let picked = [];
    $('orderBank').querySelectorAll('.order-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        if (ctx.answered) return;
        const id = Number(chip.dataset.id);
        picked.push(id); chip.classList.add('used');
        $('orderAnswer').innerHTML = picked.map((x, i) => `<span class="order-slot"><small>${i + 1}</small>${byId(x).name}</span>`).join('');
        if (picked.length === q.items.length) checkOrder(q, picked);
      });
    });
  } else {
    $('lessonBody').querySelectorAll('.option').forEach(btn => {
      btn.addEventListener('click', () => answerChoice(q, Number(btn.dataset.i)));
    });
  }
}
function answerChoice(q, idx) {
  if (ctx.answered) return;
  ctx.answered = true;
  const ok = !!q.options[idx].ok;
  if (ok) ctx.correct++; else registerMistake(q.cardId);
  $('lessonBody').querySelectorAll('.option').forEach((b, i) => {
    b.disabled = true;
    if (q.options[i].ok) b.classList.add('correct');
    else if (i === idx) b.classList.add('wrong'), b.classList.add('shake');
    else b.classList.add('dim');
  });
  finishAnswer(ok, q.explanation);
}
function answerImageChoice(q, id) {
  if (ctx.answered) return;
  ctx.answered = true;
  const ok = id === q.cardId;
  if (ok) ctx.correct++; else registerMistake(q.cardId);
  $('lessonBody').querySelectorAll('.image-option').forEach(btn => {
    const bid = Number(btn.dataset.id);
    btn.disabled = true;
    if (bid === q.cardId) btn.classList.add('correct');
    else if (bid === id) btn.classList.add('wrong', 'shake');
    else btn.classList.add('dim');
  });
  finishAnswer(ok, q.explanation);
}
function checkOrder(q, picked) {
  if (ctx.answered) return;
  ctx.answered = true;
  const ok = picked.join(',') === q.answer.join(',');
  if (ok) ctx.correct++; else registerMistake(q.cardId);
  $('orderAnswer').insertAdjacentHTML('afterend', `<div class="order-result ${ok ? '' : 'bad'}">${ok ? '✓ 顺序正确' : `✗ 正确顺序：${q.answer.map(id => byId(id).name).join(' → ')}`}</div>`);
  finishAnswer(ok, q.explanation);
}
function registerMistake(cardId) {
  state.hearts = Math.max(0, state.hearts - 1);
  if (!state.wrongCards.includes(cardId)) state.wrongCards.push(cardId);
  save(); renderTop();
  const h = document.querySelector('.lesson-hearts');
  if (h) h.classList.add('shake');
  setTimeout(() => h && h.classList.remove('shake'), 450);
}
function finishAnswer(ok, desc) {
  $('lessonHearts').textContent = state.hearts;
  showFeedback(ok, desc);
  playSound(ok);
}
function showFeedback(ok, desc) {
  const fb = $('feedback');
  fb.className = `feedback show ${ok ? 'good' : 'bad'}`;
  $('fbIcon').textContent = ok ? '✅' : '❌';
  $('fbTitle').textContent = ok ? ['漂亮！', '答对了！', '就是这样！'][Math.floor(Math.random() * 3)] : '再想一想';
  $('fbDesc').textContent = ok ? '' : desc;
  $('fbDesc').style.display = ok ? 'none' : 'block';
}
function hideFeedback() { $('feedback').className = 'feedback'; }
function nextQuestion() {
  hideFeedback();
  ctx.idx++;
  if (ctx.idx >= ctx.questions.length) finishLesson();
  else {
    renderQuestion();
    const body = $('lessonBody');
    body.classList.remove('question-in'); void body.offsetWidth; body.classList.add('question-in');
  }
}
function finishLesson() {
  const total = ctx.questions.length;
  const ratio = total ? ctx.correct / total : 1;
  const gotStars = ratio === 1 ? 3 : ratio >= 0.7 ? 2 : 1;
  const kind = ctx.level.kind;
  const base = kind === 'final' ? 50 : ['boss', 'reverseBoss'].includes(kind) ? 30 : ['study', 'reverseStudy'].includes(kind) ? 10 :
    ['scenario', 'symbol', 'reversed', 'reverseScenario'].includes(kind) ? 20 : kind === 'review' || kind === 'custom' ? 10 : 15;
  const xp = base + (gotStars === 3 ? 5 : 0);
  const gems = 10 + (gotStars === 3 ? 10 : 0);
  state.xp += xp; state.gems += gems;
  if (state.dailyDate !== today()) { state.dailyXp = 0; state.dailyDate = today(); }
  state.dailyXp += xp;
  if (state.lastDate !== today()) {
    state.streak = state.lastDate === yesterdayStr() ? state.streak + 1 : 1;
    state.lastDate = today();
  }
  if (!['review', 'custom'].includes(kind) && !String(ctx.level.id).startsWith('card-')) {
    const prev = state.completed[ctx.level.id];
    if (!prev || gotStars > prev.stars) state.completed[ctx.level.id] = { stars: gotStars, accuracy: Math.round(ratio * 100) };
  }
  if (!ctx.level.reverse) {
    const next = LEVELS[firstIncomplete()];
    if (next) state.chapter = next.chapter;
  }
  save();
  ctx.lastResult = { level: ctx.level, gotStars, xp, gems, accuracy: Math.round(ratio * 100) };
  renderResult(); confetti(); showScreen('resultScreen');
}
function renderResult() {
  const r = ctx.lastResult;
  $('resultIcon').textContent = r.gotStars === 3 ? '🌟' : r.gotStars === 2 ? '🎉' : '✦';
  $('resultTitle').textContent = r.gotStars === 3 ? '完美通关！' : '完成一关！';
  $('resultStars').textContent = stars(r.gotStars);
  $('resultStats').innerHTML = `
    <div class="rs-row"><span>正确率</span><b>${r.accuracy}%</b></div>
    <div class="rs-row"><span>获得经验</span><b>+${r.xp} XP</b></div>
    <div class="rs-row"><span>宝石奖励</span><b>+${r.gems} 💎</b></div>
    <div class="rs-row"><span>连续学习</span><b>${state.streak} 天</b></div>`;
}
function restartLesson() {
  const level = ctx.lastResult && ctx.lastResult.level;
  if (level) startLevel(level); else showScreen('homeScreen');
}

/* ---------- 复习 / 单牌练习 ---------- */
function startReview() {
  if (!state.wrongCards.length) { toast('还没有错题，继续闯关吧！'); return; }
  const cards = state.wrongCards.slice(0, 8);
  const level = { id: 'review', kind: 'review', title: '错题复习', cards };
  ctx.level = level; ctx.idx = 0; ctx.correct = 0; ctx.answered = false;
  ctx.questions = buildQuestions(cards, Math.min(6, Math.max(3, cards.length)), LEVEL_PLAN.review.types);
  $('lessonTitle').textContent = level.title;
  $('lessonHearts').textContent = state.hearts;
  $('lessonProgress').style.width = '0%';
  renderQuestion(); showScreen('lessonScreen');
}
function startCardPractice(id) {
  const c = byId(id);
  const level = { id: `card-${id}`, kind: 'custom', title: `练习 · ${c.name}`, cards: [id] };
  ctx.level = level; ctx.idx = 0; ctx.correct = 0; ctx.answered = false;
  ctx.questions = buildQuestions([id], 4, LEVEL_PLAN.custom.types);
  $('lessonTitle').textContent = level.title;
  $('lessonHearts').textContent = state.hearts;
  $('lessonProgress').style.width = '0%';
  renderQuestion(); showScreen('lessonScreen');
}

/* ---------- 牌库 ---------- */
function renderCards(filter = '') {
  const f = filter.trim().toLowerCase();
  const list = CARDS.filter(c => !f || c.name.toLowerCase().includes(f) || c.en.toLowerCase().includes(f) ||
    c.upright.concat(c.reversed).some(k => k.toLowerCase().includes(f)));
  $('cardGrid').innerHTML = list.length ? list.map(c => `
    <button class="grid-card" data-id="${c.id}">
      ${cardImg(c.id, 'grid-img')}
      <div><h4>${c.num} ${c.name}</h4><p>${c.upright.slice(0, 2).join(' · ')}</p></div>
    </button>`).join('') : '<div class="empty-grid">没有找到相关的牌</div>';
  $('cardGrid').querySelectorAll('.grid-card').forEach(b => {
    b.addEventListener('click', () => openCardModal(byId(Number(b.dataset.id))));
  });
}
function renderStories() {
  const c = byId(state.storyIndex);
  $('storyStrip').innerHTML = CARDS.map(x => `
    <button class="story-chip ${x.id === c.id ? 'active' : ''}" data-id="${x.id}">
      ${cardImg(x.id, 'strip-img')}<span>${x.name}</span>
    </button>`).join('');
  $('storyStrip').querySelectorAll('.story-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      state.storyIndex = Number(btn.dataset.id); save(); renderStories();
    });
  });
  $('storyBook').innerHTML = `
    <div class="story-head"><span class="story-num">${c.num}</span><h2>${c.name}</h2><p>${c.en} · ${c.element}</p></div>
    <article class="story-card up">
      <div class="story-card-top">${cardImg(c.id, 'story-img')}
        <div><span class="story-badge up">正位</span><h3>光的一面</h3><small>${c.upright.join(' · ')}</small></div>
      </div>
      <p>${STORIES[c.id].upright}</p>
    </article>
    <article class="story-card rev">
      <div class="story-card-top">${cardImg(c.id, 'story-img', true)}
        <div><span class="story-badge rev">逆位</span><h3>影的一面</h3><small>${c.reversed.join(' · ')}</small></div>
      </div>
      <p>${STORIES[c.id].reversed}</p>
    </article>`;
}
function openCardModal(c) {
  let rev = false;
  function draw() {
    const kws = rev ? c.reversed : c.upright;
    $('cardModalBody').innerHTML = `
      <div class="modal-hero">
        ${cardImg(c.id, 'modal-img', rev)}
        <div><h2>${c.num} · ${c.name}</h2><p>${c.en} · ${c.element}</p>
          <div class="orient-toggle">
            <button id="orientUp" class="${rev ? '' : 'on'}">正位</button>
            <button id="orientRev" class="${rev ? 'on' : ''}">逆位</button>
          </div>
        </div>
      </div>
      <div class="modal-section"><h3>${rev ? '逆位关键词' : '正位关键词'}</h3>
        <div class="pill-list">${kws.map(k => `<span class="pill ${rev ? 'rev' : ''}">${k}</span>`).join('')}</div></div>
      <div class="modal-section"><h3>${rev ? '逆位故事 · 影的一面' : '正位故事 · 光的一面'}</h3>
        <div class="modal-note">${rev ? STORIES[c.id].reversed : STORIES[c.id].upright}</div></div>
      <div class="modal-section"><h3>画面意象</h3><div class="modal-note">${c.symbol}</div></div>
      <div class="modal-section"><button class="primary-btn big" id="practiceCard">练习这张牌 →</button>
        <button class="text-btn" id="toStory">在故事馆读两个故事 →</button></div>`;
    $('orientUp').addEventListener('click', () => { rev = false; draw(); });
    $('orientRev').addEventListener('click', () => { rev = true; draw(); });
    $('practiceCard').addEventListener('click', () => {
      $('cardModal').classList.remove('show');
      startCardPractice(c.id);
    });
    $('toStory').addEventListener('click', () => {
      $('cardModal').classList.remove('show');
      state.storyIndex = c.id; save(); renderStories(); showScreen('storiesScreen');
    });
  }
  draw();
  $('cardModal').classList.add('show');
}

/* ---------- 我的 ---------- */
function renderProfile() {
  const lessons = Object.keys(state.completed).length;
  const mastered = Object.values(state.completed).filter(v => v.stars === 3).length;
  $('profileStats').innerHTML = `
    <div class="stat-box"><b>${state.xp}</b><span>累计经验 XP</span></div>
    <div class="stat-box"><b>${state.streak} 天</b><span>连续学习</span></div>
    <div class="stat-box"><b>${lessons} / ${LEVELS.length}</b><span>已完成关卡</span></div>
    <div class="stat-box"><b>${mastered}</b><span>三星关卡</span></div>`;
  $('soundToggle').classList.toggle('on', state.sound);
  renderTop();
}
function confetti() {
  const wrap = $('confetti');
  const colors = ['#FFC93C', '#6C5CE7', '#58CC02', '#FF6B9D', '#4FC3F7'];
  let html = '';
  for (let i = 0; i < 52; i++) {
    html += `<i style="left:${Math.random() * 100}%;background:${colors[i % colors.length]};animation-delay:${(Math.random() * 0.6).toFixed(2)}s;transform:rotate(${Math.random() * 360}deg)"></i>`;
  }
  wrap.innerHTML = html;
  setTimeout(() => { wrap.innerHTML = ''; }, 3200);
}

/* ---------- 事件绑定 ---------- */
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const t = tab.dataset.tab;
    if (t === 'home') { renderHome(); showScreen('homeScreen'); }
    else if (t === 'cards') { renderCards($('cardSearch').value); showScreen('cardsScreen'); }
    else if (t === 'review') startReview();
    else if (t === 'stories') { renderStories(); showScreen('storiesScreen'); }
    else if (t === 'profile') { renderProfile(); showScreen('profileScreen'); }
  });
});
$('storyPrev').addEventListener('click', () => {
  state.storyIndex = (state.storyIndex + CARDS.length - 1) % CARDS.length;
  save(); renderStories();
});
$('storyNext').addEventListener('click', () => {
  state.storyIndex = (state.storyIndex + 1) % CARDS.length;
  save(); renderStories();
});
$('storyPractice').addEventListener('click', () => startCardPractice(state.storyIndex));
$('lessonClose').addEventListener('click', () => {
  hideFeedback();
  state.hearts = Math.max(1, state.hearts);
  save(); renderHome(); showScreen('homeScreen');
  toast('已退出，本次进度未保存');
});
$('fbNext').addEventListener('click', () => {
  if (state.hearts <= 0) $('heartsModal').classList.add('show');
  else nextQuestion();
});
$('refillGems').addEventListener('click', () => {
  if (state.gems < 50) { toast('宝石不够啦，先完成几关吧'); return; }
  state.gems -= 50; state.hearts = 5; save();
  $('heartsModal').classList.remove('show');
  renderTop(); nextQuestion();
});
$('refillFree').addEventListener('click', () => {
  state.hearts = Math.max(2, state.hearts); save();
  $('heartsModal').classList.remove('show');
  renderTop(); nextQuestion();
});
$('quitLesson').addEventListener('click', () => {
  state.hearts = Math.max(1, state.hearts); save();
  $('heartsModal').classList.remove('show');
  renderHome(); showScreen('homeScreen');
});
$('resultContinue').addEventListener('click', () => { renderHome(); showScreen('homeScreen'); });
$('resultAgain').addEventListener('click', restartLesson);
$('cardSearch').addEventListener('input', e => renderCards(e.target.value));
document.querySelectorAll('[data-close="cardModal"]').forEach(el => {
  el.addEventListener('click', () => $('cardModal').classList.remove('show'));
});
$('soundToggle').addEventListener('click', () => {
  state.sound = !state.sound; save(); renderProfile();
  if (state.sound) playSound(true);
});
let resetArmed = false;
$('resetBtn').addEventListener('click', (e) => {
  if (!resetArmed) {
    resetArmed = true;
    e.target.textContent = '再点一次，确认清空';
    setTimeout(() => {
      resetArmed = false;
      $('resetBtn').textContent = '重置学习进度';
    }, 4000);
    return;
  }
  resetArmed = false;
  state = { ...DEFAULTS };
  save(); renderHome(); renderCards(); renderStories(); renderProfile();
  $('resetBtn').textContent = '重置学习进度';
  toast('进度已重置，重新开始愚者之旅');
});

renderHome();
renderCards();
renderStories();
renderProfile();
