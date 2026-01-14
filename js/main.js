/* =========================
   基本設定
========================= */

// ===== Build / Version =====
const BUILD_INFO = 'pages-split-2026-01-14-r1';
// (Pages反映確認用) 起動時にログへ出します
function logBuildInfo(){
  try { logSkill(`【BUILD】${BUILD_INFO}`); } catch(e) { /* ignore */ }
  try { console.log('[BUILD]', BUILD_INFO); } catch(e) { /* ignore */ }
}

const CONFIG = { rows: 9, cols: 11, cellW: 34, cellH: 40 }; // ★cols=11
const FLASH_LIMIT_MS = 3000;
const LOG_MODE = 'skills';

/* =========================
   グレード規約
========================= */
function inferGrade(symbol, isBoss=false) {
  if (isBoss) return 0;
  if (symbol === '兵' || symbol === '卒') return 1;
  if (symbol === '将' || symbol === '盾' || symbol === '勇' || symbol === '時') return 3;
  return 2;
}

/* =========================
   ユニット定義
========================= */
const UNIT_TYPES = [
  { id:0,  name:'兵', symbol:'兵', normalType:'melee',  skillType:'poke',      laneSkillType:'poke',  baseHp:4, baseAtk:1, baseSkillCd:4, grade: inferGrade('兵') },

  { id:1,  name:'銃', symbol:'銃', normalType:'ranged', skillType:'multi',     laneSkillType:'multi', baseHp:5, baseAtk:1, baseSkillCd:3, grade: inferGrade('銃') },
  { id:2,  name:'砲', symbol:'砲', normalType:'ranged', skillType:'beam',      laneSkillType:'beam',  baseHp:5, baseAtk:1, baseSkillCd:3, grade: inferGrade('砲') },
  { id:3,  name:'癒', symbol:'癒', normalType:'healMelee',  skillType:'heal',      laneSkillType:'heal',  baseHp:6, baseAtk:1, baseSkillCd:3, grade: inferGrade('癒') },
  { id:4,  name:'勇', symbol:'勇', normalType:'melee',  skillType:'flash',     laneSkillType:'flash', baseHp:7, baseAtk:2, baseSkillCd:5, grade: inferGrade('勇') },
  { id:5,  name:'魔', symbol:'魔', normalType:'ranged', skillType:'wide',      laneSkillType:'wide',  baseHp:5, baseAtk:1, baseSkillCd:4, grade: inferGrade('魔') },
  { id:6,  name:'雷', symbol:'雷', normalType:'ranged', skillType:'chain',     laneSkillType:'chain', baseHp:5, baseAtk:1, baseSkillCd:3, grade: inferGrade('雷') },
  { id:7,  name:'盾', symbol:'盾', normalType:'buff',   skillType:'guard',     laneSkillType:'guard', baseHp:5, baseAtk:1, baseSkillCd:3, grade: inferGrade('盾') },
  { id:8,  name:'押', symbol:'押', normalType:'ranged', skillType:'knock',     laneSkillType:'knock', baseHp:5, baseAtk:1, baseSkillCd:3, grade: inferGrade('押') },

  { id:9,  name:'剣', symbol:'剣', normalType:'sword',  skillType:'slashAoe',  laneSkillType:'wide',  baseHp:5, baseAtk:2, baseSkillCd:3, grade: inferGrade('剣') },
  { id:10, name:'薙', symbol:'薙', normalType:'nagi',   skillType:'nagiCone',  laneSkillType:'wide',  baseHp:6, baseAtk:2, baseSkillCd:4, grade: inferGrade('薙') },
  { id:11, name:'堅', symbol:'堅', normalType:'tank',   skillType:'tankFull',  laneSkillType:'guard', baseHp:8, baseAtk:1, baseSkillCd:5, grade: inferGrade('堅') },
  { id:12, name:'弓', symbol:'弓', normalType:'bow',    skillType:'bowMulti3', laneSkillType:'multi', baseHp:4, baseAtk:2, baseSkillCd:3, grade: inferGrade('弓') },
  { id:13, name:'爆', symbol:'爆', normalType:'bomb',   skillType:'bombAoe2',  laneSkillType:'wide',  baseHp:5, baseAtk:2, baseSkillCd:4, grade: inferGrade('爆') },

  { id:14, name:'卒', symbol:'卒', normalType:'melee',  skillType:'poke',      laneSkillType:'poke',  baseHp:5, baseAtk:2, baseSkillCd:4, grade: inferGrade('卒') }, // 強化対象外
  { id:15, name:'時', symbol:'時', normalType:'ranged', skillType:'timedWide', laneSkillType:'wide',  baseHp:5, baseAtk:1, baseSkillCd:4, grade: inferGrade('時') },
  { id:16, name:'将', symbol:'将', normalType:'melee',  skillType:'marshal',   laneSkillType:'guard', baseHp:7, baseAtk:1, baseSkillCd:6, grade: inferGrade('将') },
{ id:28, name:'列', symbol:'列', normalType:'melee',  skillType:'columnize', laneSkillType:null, baseHp:5, baseAtk:1, baseSkillCd:5, playerOnly:true, grade: inferGrade('列') },

  { id:29, name:'衛', symbol:'衛', normalType:'melee',  skillType:'defenseField', laneSkillType:'defenseField', baseHp:6, baseAtk:1, baseSkillCd:4, playerOnly:true, grade: 2 },

  { id:30, name:'援', symbol:'援', normalType:'melee',  skillType:'supportField', laneSkillType:'supportField', baseHp:6, baseAtk:1, baseSkillCd:4, playerOnly:true, grade: 2 },


  
  // --- ヒーローユニット（通常生成では出現しない / 初期配置固定） ---
  { id:100, name:'竜', symbol:'竜', isHero:true, moveType:'static',
    normalType:'dragonColumnBottom', skillType:'dragonWide', laneSkillType:'dragonAll',
    narikomiNormalAction:'dragonColumnBottom',
    baseHp:12, baseAtk:3, baseSkillCd:5, grade:5, playerOnly:true },

  { id:101, name:'突', symbol:'突', isHero:true, moveType:'forward',
    normalType:'front10', skillType:'rowWide', laneSkillType:'rowWide',
    narikomiNormalAction:'rowDamage2',
    baseHp:8, baseAtk:0, baseSkillCd:4, grade:5, playerOnly:true },

  { id:102, name:'僧', symbol:'僧', isHero:true, moveType:'static',
    normalType:'healRadius3', skillType:'healColumns', laneSkillType:'healAll',
    narikomiNormalAction:'healRadius3',
    baseHp:9, baseAtk:0, baseSkillCd:5, grade:5, playerOnly:true },

// --- 敵専用（グレード2 / スキル無し） ---
  { id:17, name:'狙', symbol:'狙', normalType:'sniper',  skillType:null, laneSkillType:null, baseHp:4, baseAtk:2, baseSkillCd:0, enemyOnly:true, grade: inferGrade('狙') },
  { id:18, name:'掃', symbol:'掃', normalType:'sweep3',  skillType:null, laneSkillType:null, baseHp:6, baseAtk:1, baseSkillCd:0, enemyOnly:true, grade: inferGrade('掃') },
  { id:19, name:'斜', symbol:'斜', normalType:'diag2',   skillType:null, laneSkillType:null, baseHp:5, baseAtk:2, baseSkillCd:0, enemyOnly:true, grade: inferGrade('斜') },
  { id:20, name:'吸', symbol:'吸', normalType:'vamp',    skillType:null, laneSkillType:null, baseHp:6, baseAtk:1, baseSkillCd:0, enemyOnly:true, grade: inferGrade('吸') },
  { id:21, name:'散', symbol:'散', normalType:'scatter', skillType:null, laneSkillType:null, baseHp:5, baseAtk:1, baseSkillCd:0, enemyOnly:true, grade: inferGrade('散') },

  // --- 敵専用（グレード3 / スキル無し / HP基準=8） ---
  { id:22, name:'鬼', symbol:'鬼', normalType:'vamp',    skillType:null, laneSkillType:null, baseHp:8, baseAtk:2, baseSkillCd:0, enemyOnly:true, grade: 3 },
  { id:23, name:'鎧', symbol:'鎧', normalType:'sweep3',  skillType:null, laneSkillType:null, baseHp:8, baseAtk:2, baseSkillCd:0, enemyOnly:true, grade: 3 },
  { id:24, name:'弩', symbol:'弩', normalType:'sniper',  skillType:null, laneSkillType:null, baseHp:8, baseAtk:3, baseSkillCd:0, enemyOnly:true, grade: 3 },
  { id:25, name:'爪', symbol:'爪', normalType:'diag2',   skillType:null, laneSkillType:null, baseHp:8, baseAtk:3, baseSkillCd:0, enemyOnly:true, grade: 3 },
  { id:26, name:'瘴', symbol:'瘴', normalType:'scatter', skillType:null, laneSkillType:null, baseHp:8, baseAtk:2, baseSkillCd:0, enemyOnly:true, grade: 3 },
  { id:27, name:'給', symbol:'給', normalType:'none', skillType:null, laneSkillType:null, baseHp:10, baseAtk:0, baseSkillCd:0, enemyOnly:true, grade: 1, fixedWeight: 1, energyDrop: 10, energyCost: 0 }
];

;
// --- normalize: unit -> pointers (unit data stays lean, behavior lives in SKILLS/NORMAL_ACTIONS/LANE_SKILLS)
for (const t of UNIT_TYPES) {
  if (t.normalAction == null) t.normalAction = t.normalType;
  if (t.skillId == null) t.skillId = t.skillType;
  if (t.laneSkillId == null) t.laneSkillId = t.laneSkillType;

  // movement type (default = forward)
  if (t.moveType == null) t.moveType = 'forward'; // 'forward' | 'static'
  // narikomi normal action (optional)
  if (t.narikomiNormalAction == null) t.narikomiNormalAction = null;
  // hero flag (default false)
  if (t.isHero == null) t.isHero = false;
}


const TYPE_BY_ID = new Map(UNIT_TYPES.map(t => [t.id, t]));
const ALL_TYPE_IDS = UNIT_TYPES.map(t => t.id);

// energyCost / energyDrop（所持エネルギー）: 既存ユニットはグレードと同値をデフォルト
for (const t of UNIT_TYPES) {
  if (t.energyCost == null) t.energyCost = (t.grade ?? 1);
  if (t.energyDrop == null) t.energyDrop = (t.grade ?? 1);
}

// 強化候補から完全除外（敵味方とも）
const EXCLUDED_FROM_UPGRADES = new Set([0, 14]); // 兵, 卒

/* =========================
   盤面可変
========================= */
let ROWS = CONFIG.rows;
let COLS = CONFIG.cols;
let MAX_UNITS = ROWS * COLS * 2;

/* =========================
   ステージ/強化（敵味方別）
========================= */
let stage = 1;
let battleCount = 1;
let rewardPicks = 1;
const sideParams = { player: new Map(), enemy: new Map() };

// 敵重みの「古い順」管理（重み減衰に使う）
let enemyWeightOrder = []; // typeIdの配列（追加された順）

function initSideParamsToDefaults() {
  sideParams.player.clear();
  sideParams.enemy.clear();
  for (const t of UNIT_TYPES) {
    const base = { weight: 0, atk: t.baseAtk, maxHp: t.baseHp, skillCdMax: t.baseSkillCd };
    sideParams.player.set(t.id, { ...base });
    sideParams.enemy.set(t.id,  { ...base });
  }
  // ★「兵」だけ開始時重み10（敵味方）
  sideParams.player.get(0).weight = 10;
  sideParams.enemy.get(0).weight  = 10;

  enemyWeightOrder = [0];
}

/* =========================
   ゲーム状態
========================= */
let phase = 'idle';
let laneOwners = [];
let terrain = []; // null | 'defense' | 'support'
let gameOver = false;
let isAnimating = false;

let autoMode = false;
let _autoTickScheduled = false;


let cells = [];
let units = [];
let turn = 0;
let nextUnitId = 1;
let decisionStartTime = 0;

// Last skill message (for in-game message window)
let LAST_SKILL_LOG = '';

// =========================
// ヒーロー配置（加入時に決定 → 以降バトル開始時に固定配置）
// =========================
const HERO_TYPE_IDS = [100, 101, 102]; // 竜, 突, 僧
let heroPlacements = new Map(); // typeId -> {row,col}（配置済みヒーローのみ）
let heroRecruited = new Set(); // typeId（加入済み）
let heroPlacingTypeId = null;  // 現在配置中のヒーロー typeId
let heroPlacementResume = null; // {picksLeft,isFirstPickThisStage,finalize} 三択に戻る/完了用


let heroPlaceAllowed = new Set(); // "r,c"
function heroKey(r,c){ return `${r},${c}`; }
function heroIsPlaced(typeId){ return heroPlacements.has(typeId); }
function isHeroPlaceCellAllowed(r,c){
  return heroPlaceAllowed.has(heroKey(r,c));
}



/* =========================
   ENG（エネルギー）
========================= */
let ENG = 0;
const ENERGY_BAR_SCALE = 40; // ゲージ満タン相当（±）

function setENG(v){ ENG = v; updateEnergyHud(); }
function addENG(delta, row=null, col=null){
  ENG += delta;
  if (row != null && col != null && delta !== 0) addEngEffect(row, col, delta);
  updateEnergyHud();
}


/* =========================
   ボス（3戦ごと）
========================= */
let boss = null; // { r,c,w:2,h:2,hp,maxHp,atk,name,symbol,grade:0 }
function isBossBattle() { return (battleCount % 3 === 0); }
function bossExists() { return boss && boss.hp > 0; }
function isBossCell(r,c){ return bossExists() && r>=boss.r && r<boss.r+boss.h && c>=boss.c && c<boss.c+boss.w; }
function bossAnchor(){ return { row: boss.r, col: boss.c }; }

/* =========================
   DOM
========================= */
const boardWrapperEl = document.getElementById('boardWrapper');
const boardEl = document.getElementById('board');
const fxCanvas = document.getElementById('fx');
const overlayEl = document.getElementById('overlay');
const fxCtx = fxCanvas.getContext('2d');

const logEl = document.getElementById('log');
const statusEl = document.getElementById('status');

const resetBtn = document.getElementById('resetBtn');
const passBtn = document.getElementById('passBtn');
const autoBtn = document.getElementById('autoBtn');

const rowsInput = document.getElementById('rowsInput');
const colsInput = document.getElementById('colsInput');
const applySizeBtn = document.getElementById('applySizeBtn');

const modalBackdrop = document.getElementById('modalBackdrop');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modalTitle');
const choicesEl = document.getElementById('choices');
const msgWinEl = document.getElementById('msgWin');
const energyHudEl = document.getElementById('energyHud');

/* =========================
   ログ
========================= */
function addLog(message) { logEl.textContent += message + '\n'; logEl.scrollTop = logEl.scrollHeight; }
function logSkill(message) {
  LAST_SKILL_LOG = message;
  addLog(message);
}

/* =========================
   FX（攻撃線：飛翔アニメ→線が残る）
========================= */
let effects = [];
let fxTickerOn = false;

/* ---- Numeric FX queue (damage/heal shown sequentially per cell) ---- */
const numericFxQueues = new Map();  // key "r,c" -> [{kind,value}, ...]
const numericFxShowing = new Set(); // key "r,c"

function numericFxKey(row, col){ return `${row},${col}`; }

function clearNumericFxQueues(){
  numericFxQueues.clear();
  numericFxShowing.clear();
}

function enqueueNumericFx(row, col, kind, value){
  const key = numericFxKey(row, col);
  if (!numericFxQueues.has(key)) numericFxQueues.set(key, []);
  numericFxQueues.get(key).push({ kind, value });
  if (!numericFxShowing.has(key)) playNextNumericFx(row, col);
}

function playNextNumericFx(row, col){
  const key = numericFxKey(row, col);
  const q = numericFxQueues.get(key);
  if (!q || q.length === 0){
    numericFxQueues.delete(key);
    numericFxShowing.delete(key);
    return;
  }
  numericFxShowing.add(key);
  const { kind, value } = q.shift();

  effects.push({
    from: { row, col },
    to:   { row, col },
    kind,
    isSkill: true,
    style: null,
    createdAt: performance.now(),
    animDone: false,
    value,
    __notifyDone: false,
    onDone: () => { playNextNumericFx(row, col); }
  });

  startFxTicker();
  drawEffects();
}

const FX_FLY_MS = 280; // 飛翔時間
function clearEffects() { effects = []; clearNumericFxQueues(); drawEffects(); stopFxTickerIfIdle(); }

function updateCanvasSize() {
  fxCanvas.width = boardEl.scrollWidth;
  fxCanvas.height = boardEl.scrollHeight;
  overlayEl.style.width = fxCanvas.width + 'px';
  overlayEl.style.height = fxCanvas.height + 'px';
  drawEffects();
}
function getCellCenter(row, col) {
  const cell = cells[row][col];
  const rect = cell.getBoundingClientRect();
  const boardRect = boardEl.getBoundingClientRect();
  return { x: rect.left - boardRect.left + rect.width / 2, y: rect.top - boardRect.top + rect.height / 2 };
}
function normalizePoint(p) {
  return { row: p.row, col: p.col };
}

function addEffect(fromUnitOrPos, toUnitOrPos, kind, isSkill, style) {
  if (!fromUnitOrPos || !toUnitOrPos) return;
  const from = normalizePoint(fromUnitOrPos);
  const to   = normalizePoint(toUnitOrPos);

  effects.push({
    from, to, kind, isSkill, style: style || null,
    createdAt: performance.now(),
    animDone: false
  });

  startFxTicker();
  drawEffects();
}

function addSpawnEffect(unit) {
  effects.push({
    from: { row: unit.row, col: unit.col },
    to:   { row: unit.row, col: unit.col },
    kind: 'spawn', isSkill: true, style: null,
    createdAt: performance.now(),
    animDone: true
  });
  drawEffects();
}
function addEngEffect(row, col, amount) {
  if (amount === 0 || amount == null) return;
  enqueueNumericFx(row, col, 'eng', amount);
}

function addDmgEffect(row, col, amount) {
  // amount: positive number (damage)
  if (!amount || amount <= 0) return;
  enqueueNumericFx(row, col, 'dmg', amount);
}

function addHealEffect(row, col, amount) {
  // amount: positive number (healing)
  if (!amount || amount <= 0) return;
  enqueueNumericFx(row, col, 'healNum', amount);
}


function addDeathEffect(row, col) {
  effects.push({
    from: { row, col },
    to:   { row, col },
    kind: 'death', isSkill: true, style: null,
    createdAt: performance.now(),
    animDone: true
  });
  drawEffects();
}
function addMoveEffect(fromRow, fromCol, toRow, toCol) {
  effects.push({
    from: { row: fromRow, col: fromCol },
    to:   { row: toRow,   col: toCol   },
    kind: 'move', isSkill: false, style: null,
    createdAt: performance.now(),
    animDone: true
  });
  drawEffects();
}

function startFxTicker() {
  if (fxTickerOn) return;
  fxTickerOn = true;
  requestAnimationFrame(fxTick);
}
function stopFxTickerIfIdle() {
  if (effects.some(e => !e.animDone)) return;
  fxTickerOn = false;
}
function fxTick() {
  if (!fxTickerOn) return;
  drawEffects();

  // notify per-effect completion (used for numeric FX queue)
  for (const e of effects) {
    if (e.animDone && e.onDone && !e.__notifyDone) {
      e.__notifyDone = true;
      try { e.onDone(); } catch(_){}
    }
  }

  // Remove finished *numeric* effects only.
  // (Other FX may use animDone=true as a "static" render flag and should remain.)
  const beforeLen = effects.length;
  effects = effects.filter(e => !(e.animDone && (e.kind === 'dmg' || e.kind === 'eng' || e.kind === 'healNum')));
  if (effects.length !== beforeLen) {
    // Re-draw once so removals take effect immediately (prevents lingering text)
    drawEffects();
  }

  if (effects.some(e => !e.animDone)) {
    requestAnimationFrame(fxTick);
  } else {
    fxTickerOn = false;
  }
}

function drawEffects() {
  // --- ALERT text on canvas (enemy near breakthrough) ---
  const ALERT_INTRO_MS = 450;
  function drawTargetScope(x, y, t01) {
    // t01: 0 -> start (large), 1 -> end (small)
    const r = 22 - 16 * t01;
    const a = 0.95 - 0.25 * t01;
    fxCtx.save();
    fxCtx.strokeStyle = `rgba(255,0,0,${a})`;
    fxCtx.lineWidth = 2;
    fxCtx.beginPath();
    fxCtx.arc(x, y, r, 0, Math.PI * 2);
    fxCtx.stroke();
    const gap = r * 0.35;
    const len = r * 0.65;
    fxCtx.beginPath();
    fxCtx.moveTo(x - len, y);
    fxCtx.lineTo(x - gap, y);
    fxCtx.moveTo(x + gap, y);
    fxCtx.lineTo(x + len, y);
    fxCtx.moveTo(x, y - len);
    fxCtx.lineTo(x, y - gap);
    fxCtx.moveTo(x, y + gap);
    fxCtx.lineTo(x, y + len);
    fxCtx.stroke();
    fxCtx.restore();
  }

  function drawAlertText() {
    fxCtx.save();
    fxCtx.font = 'bold 12px sans-serif';
    fxCtx.textAlign = 'right';
    fxCtx.textBaseline = 'top';
    const now = performance.now();
    for (const u of units) {
      if (u.side !== 'enemy') continue;
      const dist = (ROWS - 1) - u.row;
      if (dist > 2) { u._alertSeen = false; continue; } // start from ROWS-3
      const pos = getCellCenter(u.row, u.col);

      // Intro scope animation (only when entering alert zone)
      if (u._alertSeen !== true) {
        u._alertSeen = true;
        u._alertIntroStart = now;
      }
      const introElapsed = (u._alertIntroStart != null) ? (now - u._alertIntroStart) : 9999;
      if (introElapsed >= 0 && introElapsed < ALERT_INTRO_MS) {
        const t01 = Math.min(1, introElapsed / ALERT_INTRO_MS);
        drawTargetScope(pos.x, pos.y, t01);
      }
      let alpha = 0.9;
      if (dist <= 1) { // blink at ROWS-2 or below
        alpha = 0.4 + 0.6 * Math.abs(Math.sin(now / 200));
      }
      fxCtx.fillStyle = `rgba(255,0,0,${alpha})`;
      fxCtx.fillText('ALERT', pos.x + 14, pos.y - 18);
    }
    fxCtx.restore();
  }

  fxCtx.clearRect(0, 0, fxCanvas.width, fxCanvas.height);
  if (effects.length === 0) { drawAlertText(); return; }

  const now = performance.now();

  for (const e of effects) {
    const fromPos = getCellCenter(e.from.row, e.from.col);
    const toPos   = getCellCenter(e.to.row,   e.to.col);
    const fromX = fromPos.x, fromY = fromPos.y;
    const toX   = toPos.x,   toY   = toPos.y;

    if (e.kind === 'spawn') {
      const cell = cells[e.to.row][e.to.col];
      const radius = Math.min(cell.clientWidth, cell.clientHeight) * 0.4;
      fxCtx.strokeStyle = '#ffffff';
      fxCtx.lineWidth = 3;
      fxCtx.beginPath(); fxCtx.moveTo(toX, toY - radius); fxCtx.lineTo(toX, toY + radius); fxCtx.stroke();
      fxCtx.beginPath(); fxCtx.moveTo(toX - radius, toY); fxCtx.lineTo(toX + radius, toY); fxCtx.stroke();
      continue;
    }
    if (e.kind === 'eng') {
      // Numeric text: rise a little, hold, then disappear (no fade-out)
      const MOVE_MS = 240;
      const HOLD_MS = 520;
      const elapsed = now - e.createdAt;
      const moveT = Math.min(1, Math.max(0, elapsed / MOVE_MS));
      if (elapsed >= (MOVE_MS + HOLD_MS)) e.animDone = true;
      const lift = 9 * moveT; // half of previous distance
      const alpha = 1;
      const txt = (e.value >= 0 ? `+${e.value}` : `${e.value}`);
      fxCtx.fillStyle = `rgba(30,136,229,${alpha})`;
      fxCtx.font = 'bold 14px sans-serif';
      fxCtx.textAlign = 'center';
      fxCtx.textBaseline = 'middle';
      fxCtx.fillText(txt, toX, toY - lift);
      continue;
    }

    if (e.kind === 'healNum') {
      // Heal number: rise a little, hold, then disappear (no fade-out)
      const MOVE_MS = 220;
      const HOLD_MS = 520;
      const elapsed = now - e.createdAt;
      const moveT = Math.min(1, Math.max(0, elapsed / MOVE_MS));
      if (elapsed >= (MOVE_MS + HOLD_MS)) e.animDone = true;
      const lift = 10 * moveT;
      const alpha = 1;
      const txt = `+${e.value}`;
      fxCtx.fillStyle = `rgba(0,170,0,${alpha})`;
      fxCtx.font = 'bold 16px sans-serif';
      fxCtx.textAlign = 'center';
      fxCtx.textBaseline = 'middle';
      fxCtx.fillText(txt, toX, toY - lift);
      fxCtx.fillStyle = `rgba(0,0,0,${0.14*alpha})`;
      fxCtx.fillText(txt, toX + 1, toY - lift + 1);
      continue;
    }

    if (e.kind === 'dmg') {
      // Damage number: rise a little, hold, then disappear (no fade-out)
      const MOVE_MS = 220;
      const HOLD_MS = 520;
      const elapsed = now - e.createdAt;
      const moveT = Math.min(1, Math.max(0, elapsed / MOVE_MS));
      if (elapsed >= (MOVE_MS + HOLD_MS)) e.animDone = true;
      const lift = 10 * moveT;
      const alpha = 1;
      const txt = `-${e.value}`;
      fxCtx.fillStyle = `rgba(220,0,0,${alpha})`;
      fxCtx.font = 'bold 16px sans-serif';
      fxCtx.textAlign = 'center';
      fxCtx.textBaseline = 'middle';
      fxCtx.fillText(txt, toX, toY - lift);
      fxCtx.fillStyle = `rgba(0,0,0,${0.18*alpha})`;
      fxCtx.fillText(txt, toX + 1, toY - lift + 1);
      continue;
    }

if (e.kind === 'death') {
      const cell = cells[e.to.row][e.to.col];
      const radius = Math.min(cell.clientWidth, cell.clientHeight) * 0.35;
      fxCtx.strokeStyle = '#222222';
      fxCtx.lineWidth = 5;
      fxCtx.beginPath(); fxCtx.moveTo(toX - radius, toY - radius); fxCtx.lineTo(toX + radius, toY + radius); fxCtx.stroke();
      fxCtx.beginPath(); fxCtx.moveTo(toX - radius, toY + radius); fxCtx.lineTo(toX + radius, toY - radius); fxCtx.stroke();
      continue;
    }

    let stroke = '#888';
    if (e.kind === 'move') stroke = 'rgba(120,120,120,0.8)';
    else if (e.kind === 'attack') stroke = e.isSkill ? '#ff3333' : '#dd6666';
    else if (e.kind === 'heal')   stroke = e.isSkill ? '#33cc33' : '#66dd66';
    else if (e.kind === 'buff')   stroke = e.isSkill ? '#3399ff' : '#66bbff';
    if (e.style === 'flash') stroke = '#ffeb3b';

    const baseW = (e.kind === 'move') ? 1 : (e.isSkill ? 4 : 2);
    const lineW = (e.style === 'flash') ? 5 : baseW;

    const flyEligible = (e.kind==='attack' || e.kind==='heal' || e.kind==='buff');
    if (flyEligible && !e.animDone) {
      const t = Math.min(1, (now - e.createdAt) / FX_FLY_MS);
      if (t >= 1) e.animDone = true;

      const ix = fromX + (toX - fromX) * t;
      const iy = fromY + (toY - fromY) * t;

      fxCtx.strokeStyle = stroke;
      fxCtx.lineWidth = lineW;
      fxCtx.beginPath();
      fxCtx.moveTo(fromX, fromY);
      fxCtx.lineTo(ix, iy);
      fxCtx.stroke();

      fxCtx.fillStyle = stroke;
      fxCtx.beginPath();
      fxCtx.arc(ix, iy, Math.max(3, lineW * 0.9), 0, Math.PI * 2);
      fxCtx.fill();

      fxCtx.fillStyle = 'rgba(0,0,0,0.12)';
      fxCtx.beginPath();
      fxCtx.arc(ix + 1.2, iy + 1.2, Math.max(3, lineW * 0.9), 0, Math.PI * 2);
      fxCtx.fill();

      continue;
    }

    fxCtx.strokeStyle = stroke;
    fxCtx.lineWidth = lineW;
    fxCtx.beginPath();
    fxCtx.moveTo(fromX, fromY);
    fxCtx.lineTo(toX, toY);
    fxCtx.stroke();

    if (flyEligible) {
      fxCtx.fillStyle = stroke;
      fxCtx.beginPath();
      fxCtx.arc(toX, toY, Math.max(2.5, lineW * 0.7), 0, Math.PI * 2);
      fxCtx.fill();
    }
  }
}

/* =========================
   盤面ユーティリティ
========================= */
function isInside(row, col) { return row >= 0 && row < ROWS && col >= 0 && col < COLS; }
function getUnitAt(row, col) { return units.find(u => u.row === row && u.col === col); }
function isBlocked(row, col) { return !!getUnitAt(row,col) || isBossCell(row,col); }

/* =========================
   sideParams参照
========================= */
function getParams(side, typeId) { return sideParams[side].get(typeId); }
function getAtk(unit) { return getParams(unit.side, unit.typeId).atk + unit.atkBuff; }
function getMaxHp(unit) { return getParams(unit.side, unit.typeId).maxHp; }
function getSkillCdMax(unit) { return getParams(unit.side, unit.typeId).skillCdMax; }


function isOnSupportTerrain(unit){
  if (!unit) return false;
  if (unit.side !== 'player') return false;
  const tr = terrain?.[unit.row]?.[unit.col] ?? null;
  return tr === 'support';
}
function canUseSkillNow(unit){
  const cdMax = getSkillCdMax(unit);
  if (cdMax <= 0) return false;
  return (unit.skillCooldown <= 0) || isOnSupportTerrain(unit);
}


function clampCooldowns() {
  for (const u of units) {
    const m = getSkillCdMax(u);
    if (u.skillCooldown > m) u.skillCooldown = m;
    if (u.skillCooldown < 0) u.skillCooldown = 0;
  }
}

function killUnit(unit) {
  if (unit && unit.side === 'enemy') {
    const t = TYPE_BY_ID.get(unit.typeId);
    const gain = t ? (t.energyDrop || 0) : 0;
    if (gain) addENG(gain, unit.row, unit.col);
  }
  addDeathEffect(unit.row, unit.col);
  units = units.filter(u => u !== unit);
}
function damageUnit(target, amount) {
  if (!target) return;

  // Terrain: defense field reduces damage to allies by 1 (min 0)
  if (amount > 0 && target.side === 'player') {
    const tr = terrain?.[target.row]?.[target.col] ?? null;
    if (tr === 'defense') amount = Math.max(0, amount - 1);
  }

  if (amount > 0) addDmgEffect(target.row, target.col, amount);
  target.hp -= amount;
  if (target.hp <= 0) killUnit(target);
}
function healUnit(target, amount) {
  if (!target) return;
  const before = target.hp;
  const maxHp = getMaxHp(target);
  target.hp = Math.min(maxHp, target.hp + amount);
  const healed = target.hp - before;
  if (healed > 0) addHealEffect(target.row, target.col, healed);
}

/* =========================
   ボスへのダメージ
========================= */
function damageBoss(amount, fromUnit=null) {
  if (!bossExists()) return;
  if (amount > 0) addDmgEffect(boss.r, boss.c, amount);
  boss.hp -= amount;
  if (boss.hp < 0) boss.hp = 0;

  if (fromUnit) addEffect(fromUnit, bossAnchor(), 'attack', true);
  else addEffect(bossAnchor(), bossAnchor(), 'attack', true);

  if (boss.hp === 0) {
    for (let rr=boss.r; rr<boss.r+boss.h; rr++) for (let cc=boss.c; cc<boss.c+boss.w; cc++) addDeathEffect(rr,cc);
  }
}

/* =========================
   列占拠（成りスキル用：味方のみ）
========================= */
function updateLaneOwners() {
  for (let c = 0; c < COLS; c++) {
    const hasPlayerAtTop = units.some(u => u.side === 'player' && u.col === c && u.row === 0);
    laneOwners[c] = hasPlayerAtTop ? 'player' : null;
  }
}
function laneIsControlledBy(unit) { return laneOwners[unit.col] === 'player' && unit.side === 'player'; }

/* =========================
   勝敗条件
========================= */
function anyEnemyBreakthrough() { return units.some(u => u.side === 'enemy' && u.row === ROWS - 1); }
function anyEnemyAlive() { return units.some(u => u.side === 'enemy'); }

function onWin() {
  gameOver = true;
  // Battle-only auto ends with the battle.
  setAutoMode(false);

  if (isBossBattle()) {
    logSkill(`*** 勝利！ボス撃破！（戦闘${battleCount}）***`);
    addMoney(500);
    rewardPicks = 1;
  } else {
    logSkill(`*** 勝利！敵全滅！（戦闘${battleCount}）***`);
    addMoney(300);
    rewardPicks = 1;
  }

  stage++;
  setENG(0); // ENG reset per stage

  battleCount++;
  // 次の戦闘に向けて敵の新ユニット種類を1つ解禁
  applyEnemyAddUnitUpgrade('敵強化');
  setTimeout(() => startStageFlow(true), 0);
}
function onLose() {
  gameOver = true;
  // Battle-only auto ends with the battle.
  setAutoMode(false);
  logSkill(`*** 敗北…（突破された） 強化を初期化して最初から ***`);
  setTimeout(() => hardResetAll(), 0);
}
function checkBattleEnd() {
  if (gameOver) return;
  if (anyEnemyBreakthrough()) return onLose();

  if (isBossBattle()) {
    if (!bossExists()) return onWin();
  } else {
    if (!anyEnemyAlive()) return onWin();
  }
}

/* =========================
   フェーズ制御
========================= */
function enterAttackWaitPhase() {
  phase = 'attack_wait';
  overlayEl.style.display = 'block';
  renderBoard();
  updateCanvasSize();

  // Auto: treat the "tap to move" wait as immediately tapped.
  if (autoMode) scheduleAutoTick();
}

function setAutoMode(on){
  autoMode = !!on;
  if (autoBtn) {
    autoBtn.textContent = autoMode ? 'オート:ON' : 'オート:OFF';
    // Toggle is always allowed. Turning OFF stops at the next tick check.
    autoBtn.disabled = false;
  }
  if (autoMode) scheduleAutoTick();
}

function scheduleAutoTick(){
  if (!autoMode) return;
  if (_autoTickScheduled) return;
  _autoTickScheduled = true;

  setTimeout(() => {
    _autoTickScheduled = false;
    if (!autoMode) return;

    // Pause automation while modal choices are shown, but keep polling.
    if (modalBackdrop && modalBackdrop.style.display === 'flex') {
      scheduleAutoTick();
      return;
    }

    if (gameOver) return;

    // If we are waiting for "tap to move", immediately proceed to move.
    if (phase === 'attack_wait') {
      startMovePhase();
      return; // endMovePhase() will schedule next tick if still ON
    }

    // If idle, just pass turn.
    if (phase === 'idle' && !isAnimating) {
      doPass();
      return;
    }

    // Otherwise, try again soon.
    scheduleAutoTick();
  }, 30);
}



function endMovePhase() {
  phase = 'idle';
  overlayEl.style.display = 'none';

  clearEffects();
  updateLaneOwners();

  // 生成（移動の後）
  // 味方：ENGが1以上なら毎ターン最下段に生成（生成ごとにENG消費。マイナス可）
  playerSpawnByEnergy();
  // 敵：従来通り 2ターンに1回
  if (turn % 2 === 0) autoSpawn();

  clampCooldowns();
  renderBoard();
  updateCanvasSize();

  decisionStartTime = performance.now();
  isAnimating = false;

  checkBattleEnd();
  updateStatus();

  if (autoMode) scheduleAutoTick();
}

/* =========================
   通常攻撃（攻撃のみ。移動は後で一括）
========================= */
function normalMeleeAttackOnly(unit) {
  const dir = unit.side === 'player' ? -1 : 1;
  const r = unit.row + dir, c = unit.col;
  if (!isInside(r, c)) return;

  if (isBossCell(r,c) && unit.side === 'player') { damageBoss(getAtk(unit), unit); return; }

  const t = getUnitAt(r, c);
  if (t && t.side !== unit.side) { damageUnit(t, getAtk(unit)); addEffect(unit, t, 'attack', false); }
}
function normalHealMeleeAttackOnly(unit) {
  // ① 通常の近接攻撃（既存の挙動）
  normalMeleeAttackOnly(unit);

  // ② 上下左右の味方をHP+1回復（自分は回復しない）
  const dirs = [{dr:-1, dc:0}, {dr:1, dc:0}, {dr:0, dc:-1}, {dr:0, dc:1}];
  for (const d of dirs) {
    const r = unit.row + d.dr, c = unit.col + d.dc;
    if (!isInside(r, c)) continue;
    const a = getUnitAt(r, c);
    if (!a) continue;
    if (a.side !== unit.side) continue;
    if (a === unit) continue;
    const before = a.hp;
    healUnit(a, 1);
    if (a.hp > before) addEffect(unit, a, 'heal', false);
  }
}

function normalRangedAttackOnly(unit) {
  const dir = unit.side === 'player' ? -1 : 1;
  for (let dist = 1; dist <= 3; dist++) {
    const r = unit.row + dir * dist, c = unit.col;
    if (!isInside(r, c)) break;

    if (unit.side === 'player' && isBossCell(r,c)) { damageBoss(getAtk(unit), unit); return; }

    const t = getUnitAt(r, c);
    if (t && t.side !== unit.side) { damageUnit(t, getAtk(unit)); addEffect(unit, t, 'attack', false); return; }
  }
  normalMeleeAttackOnly(unit);
}
// 盾の通常：上下左右の味方に攻+1(最大+2)
function normalBuffAttackOnly(unit) {
  const dirs = [{dr:-1, dc:0}, {dr:1, dc:0}, {dr:0, dc:-1}, {dr:0, dc:1}];
  for (const d of dirs) {
    const r = unit.row + d.dr, c = unit.col + d.dc;
    if (!isInside(r,c)) continue;
    const a = getUnitAt(r,c);
    if (a && a.side === unit.side) {
      const before = a.atkBuff;
      a.atkBuff = Math.min(2, a.atkBuff + 1);
      if (a.atkBuff > before) addEffect(unit, a, 'buff', false);
    }
  }
}
function normalSwordAttackOnly(unit) {
  const dir = unit.side==='player' ? -1 : 1;
  const targets=[];
  const f={r:unit.row+dir,c:unit.col};
  if (isInside(f.r,f.c)) {
    if (unit.side==='player' && isBossCell(f.r,f.c)) {
      damageBoss(getAtk(unit), unit);
    } else {
      const t=getUnitAt(f.r,f.c);
      if (t && t.side!==unit.side) targets.push(t);
    }
  }
  for (const dc of [-1,+1]) {
    const r=unit.row, c=unit.col+dc;
    if (!isInside(r,c)) continue;
    const t=getUnitAt(r,c);
    if (t && t.side!==unit.side && !targets.includes(t)) targets.push(t);
  }
  for (const t of targets) { damageUnit(t, getAtk(unit)); addEffect(unit,t,'attack',false); }
}
function normalNagiAttackOnly(unit) {
  const dir = unit.side==='player' ? -1 : 1;
  const r=unit.row+dir;
  if (!isInside(r,unit.col)) return;
  for (let dc=-1; dc<=1; dc++) {
    const c=unit.col+dc;
    if (!isInside(r,c)) continue;
    if (unit.side==='player' && isBossCell(r,c)) { damageBoss(getAtk(unit), unit); continue; }
    const t=getUnitAt(r,c);
    if (t && t.side!==unit.side) { damageUnit(t,getAtk(unit)); addEffect(unit,t,'attack',false); }
  }
}
function normalTankAttackOnly(unit) {
  normalMeleeAttackOnly(unit);
  const before = unit.hp;
  healUnit(unit, 1);
  if (unit.hp > before) addEffect(unit, unit, 'heal', false);
}
function normalBowAttackOnly(unit) {
  let candidates=[];
  for (const u of units) {
    if (u.side===unit.side) continue;
    const dist=Math.abs(u.row-unit.row)+Math.abs(u.col-unit.col);
    if (dist>0 && dist<=3) candidates.push({u,dist});
  }
  if (unit.side==='player' && bossExists()) {
    let inRange=false;
    for (let rr=boss.r; rr<boss.r+boss.h; rr++) for (let cc=boss.c; cc<boss.c+boss.w; cc++) {
      const dist=Math.abs(rr-unit.row)+Math.abs(cc-unit.col);
      if (dist>0 && dist<=3) inRange=true;
    }
    if (inRange) candidates.push({u:{__boss:true,row:boss.r,col:boss.c}, dist:2.5});
  }
  if (!candidates.length) return;
  candidates.sort((a,b)=>a.dist-b.dist);
  const t=candidates[0].u;
  if (t.__boss) { damageBoss(getAtk(unit), unit); return; }
  damageUnit(t, getAtk(unit));
  addEffect(unit,t,'attack',false);
}

/* ---- 敵専用：通常行動バリエーション ---- */
function normalSniperAttackOnly(unit) {
  const dir = unit.side === 'player' ? -1 : 1;
  for (let dist = 1; dist <= 5; dist++) {
    const r = unit.row + dir * dist, c = unit.col;
    if (!isInside(r, c)) break;
    const t = getUnitAt(r, c);
    if (t && t.side !== unit.side) { damageUnit(t, getAtk(unit)); addEffect(unit, t, 'attack', false); return; }
  }
  normalMeleeAttackOnly(unit);
}
function normalSweep3AttackOnly(unit) {
  const dir = unit.side === 'player' ? -1 : 1;
  const r = unit.row + dir;
  if (!isInside(r, unit.col)) return;
  for (let dc = -1; dc <= 1; dc++) {
    const c = unit.col + dc;
    if (!isInside(r, c)) continue;
    const t = getUnitAt(r, c);
    if (t && t.side !== unit.side) { damageUnit(t, getAtk(unit)); addEffect(unit, t, 'attack', false); }
  }
}
function normalDiag2AttackOnly(unit) {
  const dir = unit.side === 'player' ? -1 : 1;
  const targets = [
    { r: unit.row + dir, c: unit.col - 1 },
    { r: unit.row + dir, c: unit.col + 1 },
    { r: unit.row + dir, c: unit.col     },
  ];
  for (const p of targets) {
    if (!isInside(p.r, p.c)) continue;
    const t = getUnitAt(p.r, p.c);
    if (t && t.side !== unit.side) { damageUnit(t, getAtk(unit)); addEffect(unit, t, 'attack', false); return; }
  }
}
function normalVampAttackOnly(unit) {
  const dir = unit.side === 'player' ? -1 : 1;
  const r = unit.row + dir, c = unit.col;
  if (!isInside(r, c)) return;
  const t = getUnitAt(r, c);
  if (t && t.side !== unit.side) {
    damageUnit(t, getAtk(unit));
    addEffect(unit, t, 'attack', false);
    const before = unit.hp;
    healUnit(unit, 1);
    if (unit.hp > before) addEffect(unit, unit, 'heal', false);
  }
}
function normalScatterAttackOnly(unit) {
  const dir = unit.side === 'player' ? -1 : 1;
  for (let dist = 1; dist <= 2; dist++) {
    const r = unit.row + dir * dist;
    if (!isInside(r, unit.col)) continue;
    for (let dc = -1; dc <= 1; dc++) {
      const c = unit.col + dc;
      if (!isInside(r, c)) continue;
      const t = getUnitAt(r, c);
      if (t && t.side !== unit.side) { damageUnit(t, getAtk(unit)); addEffect(unit, t, 'attack', false); }
    }
  }
}

const NORMAL_ACTIONS = {
  ranged:  normalRangedAttackOnly,
  buff:    normalBuffAttackOnly,
  melee:   normalMeleeAttackOnly,
  healMelee: normalHealMeleeAttackOnly,
  sword:   normalSwordAttackOnly,
  nagi:    normalNagiAttackOnly,
  tank:    normalTankAttackOnly,
  bow:     normalBowAttackOnly,
  bomb:    normalMeleeAttackOnly,

  // enemy-only normals
  sniper:  normalSniperAttackOnly,
  sweep3:  normalSweep3AttackOnly,
  diag2:   normalDiag2AttackOnly,
  vamp:    normalVampAttackOnly,
  scatter: normalScatterAttackOnly,

  none:    () => {},
};

// --- HERO NORMAL ACTIONS: register into NORMAL_ACTIONS (v36 fix2 -> v37) ---
NORMAL_ACTIONS.dragonColumnBottom = function(unit){

    const atk = getAtk(unit);
    const cols = [unit.col-1, unit.col, unit.col+1];
    for (const c of cols) {
      if (c < 0 || c >= COLS) continue;
      for (let r = ROWS - 1; r >= 0; r--) {
        if (isBossCell(r,c)) continue;
        const t = getUnitAt(r, c);
        if (t && t.side !== unit.side) {
          damageUnit(t, atk);
          addEffect(unit, t, 'attack', false);
          break;
        }
      }
    }
};

NORMAL_ACTIONS.front10 = function(unit){

    const dir = (unit.side === 'player') ? -1 : 1;
    const r = unit.row + dir, c = unit.col;
    if (!isInside(r,c)) return;
    if (isBossCell(r,c)) { damageBoss(10, unit); return; }
    const t = getUnitAt(r,c);
    if (t && t.side !== unit.side) {
      damageUnit(t, 10);
      addEffect(unit, t, 'attack', false);
    }
};

NORMAL_ACTIONS.rowDamage2 = function(unit){

    for (const t of units) {
      if (t.side === unit.side) continue;
      if (t.row !== unit.row) continue;
      damageUnit(t, 2);
      addEffect(unit, t, 'attack', true);
    }
    // boss on same row
    if (boss && boss.hp > 0 && boss.r === unit.row) {
      damageBoss(2, unit);
    }
};

NORMAL_ACTIONS.healRadius3 = function(unit){

    const amount = 2;
    for (const t of units) {
      if (t.side !== unit.side) continue;
      const dist = Math.abs(t.row - unit.row) + Math.abs(t.col - unit.col);
      if (dist <= 3) {
        healUnit(t, amount);
        addEffect(unit, t, 'heal', false);
      }
    }
};
// --- end HERO NORMAL ACTIONS ---

// --- Normal action side-transform hook (将/列) ---
function applyNormalSideTransform(unit) {
  const type = TYPE_BY_ID.get(unit.typeId);
  if (!type) return;

  let fromId = null;
  let toId   = null;

  // 将：左右の兵 → 卒
  if (type.symbol === '将') {
    fromId = 0;   // 兵
    toId   = 14;  // 卒
  }

  // 列：左右の兵 → 列
  if (type.symbol === '列') {
    fromId = 0;   // 兵
    toId   = 28;  // 列
  }

  if (fromId == null) return;

  for (const dc of [-1, +1]) {
    const r = unit.row;
    const c = unit.col + dc;
    if (!isInside(r, c)) continue;

    const u = getUnitAt(r, c);
    if (!u) continue;
    if (u.side !== unit.side) continue;
    if (u.typeId !== fromId) continue;

    u.typeId = toId;
    u.hp = Math.min(u.hp, getMaxHp(u));
    addEffect(unit, u, 'buff', false);
  }
}

function normalAttackOnly(unit) {
  // ★通常行動時の左右変化（将/列）
  applyNormalSideTransform(unit);

  const type = TYPE_BY_ID.get(unit.typeId);

  const isNarikomi = (unit.side === 'player' && laneOwners[unit.col] === 'player');
  const actionId = (isNarikomi && type.narikomiNormalAction) ? type.narikomiNormalAction : type.normalAction;

  const fn = NORMAL_ACTIONS[actionId]
         || NORMAL_ACTIONS[type.normalType]
         || NORMAL_ACTIONS.melee;
  fn(unit);
}


/* =========================
   スキル（ここは前版と同じ：省略せず全て入れてあります）
========================= */

// --- shared helper: 兵スキル相当（前方2マス以内の敵に(攻+1)ダメ） ---
// doLog=true の場合、【Xスキル】突き：... のログを出す（兵/卒用）
function fireSoldierPoke(unit, doLog=false) {
  const dir = unit.side==='player' ? -1 : 1;

  for (let dist=1; dist<=2; dist++) {
    const r=unit.row+dir*dist, c=unit.col;
    if (!isInside(r,c)) break;

    if (unit.side==='player' && isBossCell(r,c)) {
      const dmg = getAtk(unit) + 1;
      if (doLog) logSkill(`【${TYPE_BY_ID.get(unit.typeId).symbol}スキル】突き：前方2マス以内のボスに(攻+1)=${dmg}ダメ。`);
      damageBoss(dmg, unit);
      return true;
    }

    const t=getUnitAt(r,c);
    if (t && t.side!==unit.side) {
      const dmg = getAtk(unit) + 1;
      if (doLog) logSkill(`【${TYPE_BY_ID.get(unit.typeId).symbol}スキル】突き：前方2マス以内の敵1体に(攻+1)=${dmg}ダメ。`);
      damageUnit(t, dmg);
      addEffect(unit,t,'attack',true);
      return true;
    }
  }

  if (doLog) logSkill(`【${TYPE_BY_ID.get(unit.typeId).symbol}スキル】突き：不発（前方2マスに敵なし）。`);
  return false;
}

// --- helper: 同一行の左右連結（空白 or 許可外ユニットで打ち切り） ---
function collectLinkedRowUnits(row, col, side, allowedTypeIds) {
  const results = [];
  // left
  for (let c=col-1; c>=0; c--) {
    const u = getUnitAt(row, c);
    if (!u) break;
    if (u.side !== side) break;
    if (!allowedTypeIds.includes(u.typeId)) break;
    results.push(u);
  }
  // right
  for (let c=col+1; c<COLS; c++) {
    const u = getUnitAt(row, c);
    if (!u) break;
    if (u.side !== side) break;
    if (!allowedTypeIds.includes(u.typeId)) break;
    results.push(u);
  }
  return results;
}

// --- 列スキル：左右の連結した兵を列へ（列も連結として許可）。変換後、連結した列全員が兵スキル攻撃を即時発動 ---
function skillColumnize(unit) {
  const SOLDIER_ID = 0; // 兵
  const COLUMN_ID  = 28; // 列

  // 連結判定は「兵 or 列」だけ通す（空白/他ユニットで打ち切り）。変換対象は「兵」のみ。
  const linked = collectLinkedRowUnits(unit.row, unit.col, unit.side, [SOLDIER_ID, COLUMN_ID]);
  const toConvert = linked.filter(u => u.typeId === SOLDIER_ID);

  // ① 兵→列 へ変換（対象がいなくても“連携突き”は発動する）
  if (toConvert.length) {
    for (const u of toConvert) {
      u.typeId = COLUMN_ID;
      u.hp = Math.min(u.hp, getMaxHp(u));
      addEffect(unit, u, 'buff', true);
    }
    logSkill(`【列スキル】展開：連結した兵${toConvert.length}体を列に変更。`);
  } else {
    logSkill('【列スキル】展開：変換なし（連結した兵がいない）。');
  }

  // ② 変換後：左右で連結している「列」全員（元々列だったユニットも含む）
  //    ただし、スキルリキャスト中（skillCooldown>0）の列は攻撃効果を発動しない。
  const linkedColumns = collectLinkedRowUnits(unit.row, unit.col, unit.side, [COLUMN_ID]);
  const all = [unit, ...linkedColumns];

  // 重複排除（安全のため）
  const uniq = [];
  const seen = new Set();
  for (const u of all) {
    if (!u) continue;
    if (seen.has(u.id)) continue;
    seen.add(u.id);
    uniq.push(u);
  }

  const ready = uniq.filter(cu => canUseSkillNow(cu));
  const skipped = uniq.length - ready.length;

  let hitCount = 0;
  for (const cu of ready) {
    if (fireSoldierPoke(cu, false)) hitCount++;
  }

  // ③ スキル効果を発動した列ユニットは全員「スキル発動済み」扱い（=CD最大値にリセット）
  for (const cu of ready) {
    cu.skillCooldown = getSkillCdMax(cu);
  }
  clampCooldowns();

  if (ready.length === 0) {
    logSkill(`【列スキル】連携突き：発動者なし（全員リキャスト中）。`);
  } else if (hitCount > 0) {
    logSkill(`【列スキル】連携突き：連結列${uniq.length}体中${ready.length}体が発動（命中${hitCount}回）${skipped ? ` / リキャスト中${skipped}体は不発動` : ''}。`);
  } else {
    logSkill(`【列スキル】連携突き：連結列${uniq.length}体中${ready.length}体が発動（全て不発）${skipped ? ` / リキャスト中${skipped}体は不発動` : ''}。`);
  }
}

function skillPoke(unit) {
  fireSoldierPoke(unit, true);
}

function skillBeam(unit) {
  const dir = unit.side==='player' ? -1 : 1;
  for (let dist=1; dist<=4; dist++) {
    const r=unit.row+dir*dist, c=unit.col;
    if (!isInside(r,c)) break;

    if (unit.side==='player' && isBossCell(r,c)) { logSkill(`【砲スキル】ビーム：前方4マス以内のボスに4ダメ。`); damageBoss(4, unit); return; }

    const t=getUnitAt(r,c);
    if (t && t.side!==unit.side) { logSkill(`【砲スキル】ビーム：前方4マス以内の敵1体に4ダメ。`); damageUnit(t,4); addEffect(unit,t,'attack',true); return; }
  }
  logSkill('【砲スキル】ビーム：不発（前方4マスに敵なし）。');
}

function skillMulti(unit) {
  const dir = unit.side==='player' ? -1 : 1;
  let hit=0;
  for (let dist=1; dist<=4; dist++) {
    const r=unit.row+dir*dist, c=unit.col;
    if (!isInside(r,c)) break;

    if (unit.side==='player' && isBossCell(r,c)) { damageBoss(2, unit); hit++; continue; }

    const t=getUnitAt(r,c);
    if (t && t.side!==unit.side) { damageUnit(t,2); addEffect(unit,t,'attack',true); hit++; }
  }
  if (hit>0) logSkill(`【銃スキル】列ビーム：前方4マスの自列上の敵（＋ボス）計${hit}ヒットに2ダメ。`);
  else logSkill('【銃スキル】列ビーム：不発（前方4マスの自列上に敵なし）。');
}

function skillWide(unit) {
  const dir = unit.side==='player' ? -1 : 1;
  let center=null;

  for (let dist=1; dist<=4; dist++) {
    const r=unit.row+dir*dist, c=unit.col;
    if (!isInside(r,c)) break;

    if (unit.side==='player' && isBossCell(r,c)) { center={row:r,col:c}; break; }

    const t=getUnitAt(r,c);
    if (t && t.side!==unit.side) { center={row:t.row,col:t.col}; break; }
  }
  if (!center) { logSkill('【魔スキル】範囲爆撃：不発（中心となる敵がいない）。'); return; }

  logSkill('【魔スキル】範囲爆撃：中心を含む3×3内の敵（＋ボス）全員に2ダメ。');
  for (let dr=-1; dr<=1; dr++) for (let dc=-1; dc<=1; dc++) {
    const r=center.row+dr, c=center.col+dc;
    if (!isInside(r,c)) continue;

    if (unit.side==='player' && isBossCell(r,c)) { damageBoss(2, unit); continue; }

    const t=getUnitAt(r,c);
    if (t && t.side!==unit.side) { damageUnit(t,2); addEffect(unit,t,'attack',true); }
  }
}

function skillTimedWide(unit, weak) {
  const dir = unit.side === 'player' ? -1 : 1;
  let center = null;

  for (let dist = 1; dist <= 4; dist++) {
    const r = unit.row + dir * dist, c = unit.col;
    if (!isInside(r, c)) break;

    if (unit.side==='player' && isBossCell(r,c)) { center={row:r,col:c}; break; }

    const t = getUnitAt(r, c);
    if (t && t.side !== unit.side) { center = { row: t.row, col: t.col }; break; }
  }

  if (!center) { logSkill('【時スキル】時限十字：不発（前方4マスに敵なし）。'); return; }

  const range = weak ? 1 : 2;
  const dmg   = weak ? 2 : 3;

  logSkill(weak
    ? `【時スキル(減衰)】時限十字：中心から十字射程${range}に${dmg}ダメ（3秒超過）。`
    : `【時スキル】時限十字：中心から十字射程${range}に${dmg}ダメ（3秒以内）。`
  );

  const targets = [];
  targets.push({ r: center.row, c: center.col });
  for (let d = 1; d <= range; d++) {
    targets.push({ r: center.row - d, c: center.col });
    targets.push({ r: center.row + d, c: center.col });
    targets.push({ r: center.row, c: center.col - d });
    targets.push({ r: center.row, c: center.col + d });
  }

  let hit = 0;
  for (const p of targets) {
    if (!isInside(p.r, p.c)) continue;

    if (unit.side==='player' && isBossCell(p.r,p.c)) { damageBoss(dmg, unit); hit++; continue; }

    const t = getUnitAt(p.r, p.c);
    if (t && t.side !== unit.side) {
      damageUnit(t, dmg);
      addEffect(unit, t, 'attack', true);
      hit++;
    }
  }
  if (hit === 0) logSkill('【時スキル】時限十字：効果なし（十字範囲に敵なし）。');
}

function skillHeal(unit) {
  let healed=0;
  for (let dr=-1; dr<=1; dr++) for (let dc=-1; dc<=1; dc++) {
    const r=unit.row+dr, c=unit.col+dc;
    if (!isInside(r,c)) continue;
    const a=getUnitAt(r,c);
    if (a && a.side===unit.side) {
      const before=a.hp;
      healUnit(a, 3);
      if (a.hp>before) { healed++; addEffect(unit,a,'heal',true); }
    }
  }
  if (healed>0) logSkill(`【癒スキル】回復：周囲3×3の味方${healed}体にHP+3（最大HPまで）。`);
  else logSkill('【癒スキル】回復：効果なし（周囲に味方がいない）。');
}

// =========================
// HERO SKILLS (竜 / 突 / 僧)
// =========================
function skillDragonWide(unit){
  const atk = getAtk(unit);
  for (const t of units) {
    if (t.side === unit.side) continue;
    if (Math.abs(t.col - unit.col) <= 1) {
      damageUnit(t, atk);
      addEffect(unit, t, 'attack', true);
    }
  }
}

function skillRowWide(unit){
  const atk = getAtk(unit);
  for (const t of units) {
    if (t.side === unit.side) continue;
    if (t.row === unit.row) {
      damageUnit(t, atk);
      addEffect(unit, t, 'attack', true);
    }
  }
  if (boss && boss.hp > 0 && boss.r === unit.row) {
    damageBoss(atk, unit);
  }
}

function skillHealColumns(unit){
  const amount = 3;
  for (const t of units) {
    if (t.side !== unit.side) continue;
    if (Math.abs(t.col - unit.col) <= 1) {
      healUnit(t, amount);
      addEffect(unit, t, 'heal', true);
    }
  }
}


function skillKnock(unit) {
  const dir = unit.side==='player' ? -1 : 1;
  for (let dist=1; dist<=3; dist++) {
    const r=unit.row+dir*dist, c=unit.col;
    if (!isInside(r,c)) break;

    if (unit.side==='player' && isBossCell(r,c)) {
      logSkill('【押スキル】ノックバック：前方3マス以内のボスに3ダメ（押しは無効）。');
      damageBoss(3, unit);
      return;
    }

    const t=getUnitAt(r,c);
    if (t && t.side!==unit.side) {
      logSkill('【押スキル】ノックバック：前方3マス以内の敵1体に3ダメ＋1マス押し。');
      damageUnit(t,3); addEffect(unit,t,'attack',true);
      const nr=t.row+dir, nc=t.col;
      if (t.hp>0 && isInside(nr,nc) && !isBlocked(nr,nc)) { t.row=nr; t.col=nc; }
      return;
    }
  }
  logSkill('【押スキル】ノックバック：不発（前方3マスに敵なし）。');
}

function skillChain(unit) {
  const dir = unit.side==='player' ? -1 : 1;
  let first=null;

  for (let dist=1; dist<=4; dist++) {
    const r=unit.row+dir*dist, c=unit.col;
    if (!isInside(r,c)) break;

    if (unit.side==='player' && isBossCell(r,c)) { first={__boss:true,row:r,col:c}; break; }

    const t=getUnitAt(r,c);
    if (t && t.side!==unit.side) { first=t; break; }
  }
  if (!first) { logSkill('【雷スキル】チェイン雷：不発（最初の敵がいない）。'); return; }

  logSkill('【雷スキル】チェイン雷：敵1体に2ダメ＋周囲2マス以内の敵最大2体に1ダメ連鎖（ボスにも当たる）。');

  if (first.__boss) { damageBoss(2, unit); addEffect(unit, first, 'attack', true); }
  else { damageUnit(first,2); addEffect(unit,first,'attack',true); }

  const origin = {row:first.row,col:first.col};
  const chain = units
    .filter(u => u.side!==unit.side && (!first.__boss ? u!==first : true) && (Math.abs(u.row-origin.row)+Math.abs(u.col-origin.col)<=2))
    .slice(0,2);

  for (const t of chain) { damageUnit(t,1); addEffect(origin,t,'attack',true); }

  if (unit.side==='player' && bossExists()) {
    let distMin = Infinity;
    for (let rr=boss.r; rr<boss.r+boss.h; rr++) for (let cc=boss.c; cc<boss.c+boss.w; cc++) {
      distMin = Math.min(distMin, Math.abs(rr-origin.row)+Math.abs(cc-origin.col));
    }
    if (distMin <= 2) damageBoss(1, unit);
  }
}

// 成りスキル用：左右ビーム（砲）
function skillBeamLR(unit) {
  const maxDist = 4;

  function shot(dc) {
    for (let dist=1; dist<=maxDist; dist++) {
      const r = unit.row, c = unit.col + dc*dist;
      if (!isInside(r,c)) break;

      if (unit.side==='player' && isBossCell(r,c)) {
        damageBoss(4, unit);
        addEffect(unit, {__boss:true,row:r,col:c}, 'attack', true);
        return true;
      }

      const t = getUnitAt(r,c);
      if (t && t.side!==unit.side) {
        damageUnit(t,4);
        addEffect(unit,t,'attack',true);
        return true;
      }
    }
    return false;
  }

  const hitL = shot(-1);
  const hitR = shot(+1);

  if (hitL || hitR) {
    logSkill('【砲スキル（成り）】左右ビーム：左右それぞれ最大4マス以内の敵（各1体）に4ダメ。');
  } else {
    logSkill('【砲スキル（成り）】左右ビーム：不発（左右4マスに敵なし）。');
  }
}

// 成りスキル用：左右チェイン雷（雷）
function skillChainLR(unit) {
  const maxDist = 4;

  function findFirst(dc) {
    for (let dist=1; dist<=maxDist; dist++) {
      const r = unit.row, c = unit.col + dc*dist;
      if (!isInside(r,c)) break;

      if (unit.side==='player' && isBossCell(r,c)) return {__boss:true,row:r,col:c};

      const t = getUnitAt(r,c);
      if (t && t.side!==unit.side) return t;
    }
    return null;
  }

  function doChain(first) {
    if (!first) return false;

    const origin = {row:first.row, col:first.col};

    if (first.__boss) { damageBoss(2, unit); addEffect(unit, first, 'attack', true); }
    else { damageUnit(first,2); addEffect(unit, first, 'attack', true); }

    const chainTargets = units
      .filter(u => u.side!==unit.side && (!first.__boss ? u!==first : true) && (Math.abs(u.row-origin.row)+Math.abs(u.col-origin.col)<=2))
      .slice(0,2);

    for (const t of chainTargets) { damageUnit(t,1); addEffect(origin,t,'attack',true); }

    if (unit.side==='player' && bossExists()) {
      let distMin = Infinity;
      for (let rr=boss.r; rr<boss.r+boss.h; rr++) for (let cc=boss.c; cc<boss.c+boss.w; cc++) {
        distMin = Math.min(distMin, Math.abs(rr-origin.row)+Math.abs(cc-origin.col));
      }
      if (distMin <= 2) damageBoss(1, unit);
    }
    return true;
  }

  const firstL = findFirst(-1);
  const firstR = findFirst(+1);

  const didL = doChain(firstL);
  const didR = doChain(firstR);

  if (didL || didR) {
    logSkill('【雷スキル（成り）】左右チェイン雷：左右それぞれ最初の敵に2ダメ＋周囲2マス以内の敵最大2体に1ダメ連鎖（ボスにも当たる）。');
  } else {
    logSkill('【雷スキル（成り）】左右チェイン雷：不発（左右に最初の敵がいない）。');
  }
}


function skillGuard(unit) {
  let cnt=0;
  for (let dr=-1; dr<=1; dr++) for (let dc=-1; dc<=1; dc++) {
    const r=unit.row+dr, c=unit.col+dc;
    if (!isInside(r,c)) continue;
    const a=getUnitAt(r,c);
    if (a && a.side===unit.side) {
      const beforeHp=a.hp;
      const beforeBuff=a.atkBuff;
      a.atkBuff = Math.min(2, a.atkBuff + 1);
      healUnit(a, 1);
      if (a.atkBuff>beforeBuff || a.hp>beforeHp) addEffect(unit,a,'buff',true);
      cnt++;
    }
  }
  if (cnt>0) logSkill(`【盾スキル】守護：周囲3×3の味方${cnt}体に攻+1（最大+2）＆HP+1。`);
  else logSkill('【盾スキル】守護：効果なし（周囲に味方がいない）。');
}

function skillFlash(unit, weak) {
  const dir = unit.side==='player' ? -1 : 1;
  const dmg = weak ? 5 : 10;
  for (let dist=1; dist<=2; dist++) {
    const r=unit.row+dir*dist, c=unit.col;
    if (!isInside(r,c)) break;

    if (unit.side==='player' && isBossCell(r,c)) {
      logSkill(weak
        ? '【勇スキル(減衰)】必殺斬り：前方2マスのボスに5ダメ（3秒超過）。'
        : '【勇スキル】必殺斬り：前方2マスのボスに10ダメ（3秒以内）。'
      );
      damageBoss(dmg, unit);
      addEffect(unit, {row:r,col:c}, 'attack', true, 'flash');
      return;
    }

    const t=getUnitAt(r,c);
    if (t && t.side!==unit.side) {
      logSkill(weak
        ? '【勇スキル(減衰)】必殺斬り：前方2マスの敵1体に5ダメ（3秒超過）。'
        : '【勇スキル】必殺斬り：前方2マスの敵1体に10ダメ（3秒以内）。'
      );
      damageUnit(t,dmg); addEffect(unit,t,'attack',true,'flash'); return;
    }
  }
  logSkill(weak ? '【勇スキル(減衰)】必殺斬り：不発（前方2マスに敵なし）。'
               : '【勇スキル】必殺斬り：不発（前方2マスに敵なし）。');
}

function skillSlashAoe(unit) {
  let hit=0;
  for (let dr=-1; dr<=1; dr++) for (let dc=-1; dc<=1; dc++) {
    if (dr===0 && dc===0) continue;
    const r=unit.row+dr, c=unit.col+dc;
    if (!isInside(r,c)) continue;

    if (unit.side==='player' && isBossCell(r,c)) { damageBoss(2, unit); hit++; continue; }

    const t=getUnitAt(r,c);
    if (t && t.side!==unit.side) { damageUnit(t,2); addEffect(unit,t,'attack',true); hit++; }
  }
  if (hit>0) logSkill(`【剣スキル】八方斬り：周囲8マスの敵（＋ボス）計${hit}ヒットに2ダメ。`);
  else logSkill('【剣スキル】八方斬り：不発（周囲に敵なし）。');
}

function skillNagiCone(unit) {
  const dir = unit.side==='player' ? -1 : 1;
  let hit=0;
  for (let dist=1; dist<=2; dist++) {
    const r=unit.row+dir*dist;
    if (!isInside(r,unit.col)) continue;
    for (let dc=-1; dc<=1; dc++) {
      const c=unit.col+dc;
      if (!isInside(r,c)) continue;

      if (unit.side==='player' && isBossCell(r,c)) { damageBoss(2, unit); hit++; continue; }

      const t=getUnitAt(r,c);
      if (t && t.side!==unit.side) { damageUnit(t,2); addEffect(unit,t,'attack',true); hit++; }
    }
  }
  if (hit>0) logSkill(`【薙スキル】前方2列×横3：敵（＋ボス）計${hit}ヒットに2ダメ。`);
  else logSkill('【薙スキル】前方2列×横3：不発（範囲内に敵なし）。');
}

function skillTankFull(unit) {
  const before=unit.hp;
  unit.hp = Math.min(getMaxHp(unit), Math.max(unit.hp, 10));
  addEffect(unit,unit,'heal',true);
  logSkill(`【堅スキル】完全防御：自分のHPを10にする（${before}→${unit.hp} / 最大${getMaxHp(unit)}）。`);
}

function skillBowMulti3(unit) {
  let candidates=[];
  for (const u of units) {
    if (u.side===unit.side) continue;
    const dist=Math.abs(u.row-unit.row)+Math.abs(u.col-unit.col);
    if (dist>0 && dist<=3) candidates.push({u,dist});
  }
  if (unit.side==='player' && bossExists()) {
    let inRange=false;
    for (let rr=boss.r; rr<boss.r+boss.h; rr++) for (let cc=boss.c; cc<boss.c+boss.w; cc++) {
      const dist=Math.abs(rr-unit.row)+Math.abs(cc-unit.col);
      if (dist>0 && dist<=3) inRange=true;
    }
    if (inRange) candidates.push({u:{__boss:true,row:boss.r,col:boss.c}, dist:2.5});
  }

  if (!candidates.length) { logSkill('【弓スキル】三連射：不発（射程3以内に敵なし）。'); return; }
  candidates.sort((a,b)=>a.dist-b.dist);
  const targets=candidates.slice(0,3).map(x=>x.u);
  const dmg = getAtk(unit);
  logSkill(`【弓スキル】三連射：射程3以内の敵（＋ボス）最大3対象へ${dmg}ダメ。`);

  for (const t of targets) {
    if (t.__boss) damageBoss(dmg, unit);
    else { damageUnit(t,dmg); addEffect(unit,t,'attack',true); }
  }
}

function skillBombAoe2(unit) {
  let hit=0;
  if (unit.side==='player' && bossExists()) {
    let near=false;
    for (let rr=boss.r; rr<boss.r+boss.h; rr++) for (let cc=boss.c; cc<boss.c+boss.w; cc++) {
      const dist=Math.abs(rr-unit.row)+Math.abs(cc-unit.col);
      if (dist>0 && dist<=2) near=true;
    }
    if (near) { damageBoss(2, unit); hit++; }
  }
  for (const t of units) {
    if (t.side===unit.side) continue;
    const dist=Math.abs(t.row-unit.row)+Math.abs(t.col-unit.col);
    if (dist>0 && dist<=2) { damageUnit(t,2); addEffect(unit,t,'attack',true); hit++; }
  }
  if (hit>0) logSkill(`【爆スキル】近距離爆撃：距離2以内の敵（＋ボス）計${hit}ヒットに2ダメ。`);
  else logSkill('【爆スキル】近距離爆撃：不発（距離2以内に敵なし）。');
}

function skillMarshal(unit) {
  const FROM_ID = 0;   // 兵
  const TO_ID   = 14;  // 卒
  let changed = 0;
  for (const u of units) {
    if (u.side !== unit.side) continue;
    if (u.row !== unit.row) continue;
    if (u.typeId !== FROM_ID) continue;
    u.typeId = TO_ID;
    u.hp = Math.min(u.hp, getMaxHp(u));
    addEffect(unit, u, 'buff', true);
    changed++;
  }
  if (changed > 0) logSkill(`【将スキル】督戦：横一列の味方「兵」${changed}体を「卒」にクラスチェンジ。`);
  else logSkill('【将スキル】督戦：不発（同じ横一列に変換対象の兵がいない）。');
}


function skillDefenseField(unit) {
  let changed = 0;
  for (let dr = -2; dr <= 2; dr++) {
    for (let dc = -2; dc <= 2; dc++) {
      if (Math.abs(dr) + Math.abs(dc) > 2) continue; // Manhattan radius 2
      const r = unit.row + dr;
      const c = unit.col + dc;
      if (!isInside(r, c)) continue;
      if (isBossCell(r, c)) continue;
      if (!terrain[r]) continue;
      terrain[r][c] = 'defense';
      changed++;
    }
  }
  logSkill(`【${TYPE_BY_ID.get(unit.typeId).symbol}スキル】防衛陣地：周囲2マス以内を防衛陣地に変化（${changed}マス）。`);
}


function skillSupportField(unit) {
  let changed = 0;
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (Math.abs(dr) + Math.abs(dc) > 1) continue; // Manhattan radius 1
      const r = unit.row + dr;
      const c = unit.col + dc;
      if (!isInside(r, c)) continue;
      if (isBossCell(r, c)) continue;
      if (!terrain[r]) continue;
      terrain[r][c] = 'support';
      changed++;
    }
  }
  logSkill(`【援スキル】スキル支援陣地：周囲${changed}マスを支援陣地に変化（CT無視でスキル可）。`);
  renderBoard(); updateCanvasSize();
}


/* =========================
   成りスキル（左右同時）
========================= */
function lanePokeDirectional(unit, dr, dc) {
  for (let dist=1; dist<=2; dist++) {
    const r=unit.row+dr*dist, c=unit.col+dc*dist;
    if (!isInside(r,c)) break;

    if (unit.side==='player' && isBossCell(r,c)) {
      const dmg = getAtk(unit)+1;
      damageBoss(dmg, unit);
      return true;
    }

    const t=getUnitAt(r,c);
    if (t && t.side!==unit.side) {
      const dmg = getAtk(unit) + 1;
      damageUnit(t, dmg);
      addEffect(unit,t,'attack',true);
      return true;
    }
  }
  return false;
}
function laneMultiDirectional(unit, dr, dc) {
  let hit=false;
  for (let dist=1; dist<=4; dist++) {
    const r=unit.row+dr*dist, c=unit.col+dc*dist;
    if (!isInside(r,c)) break;

    if (unit.side==='player' && isBossCell(r,c)) { damageBoss(2, unit); hit=true; continue; }

    const t=getUnitAt(r,c);
    if (t && t.side!==unit.side) { damageUnit(t,2); addEffect(unit,t,'attack',true); hit=true; }
  }
  return hit;
}
function laneWideDirectional(unit, dr, dc) {
  let center=null;
  for (let dist=1; dist<=4; dist++) {
    const r=unit.row+dr*dist, c=unit.col+dc*dist;
    if (!isInside(r,c)) break;

    if (unit.side==='player' && isBossCell(r,c)) { center={row:r,col:c}; break; }

    const t=getUnitAt(r,c);
    if (t && t.side!==unit.side) { center={row:t.row,col:t.col}; break; }
  }
  if (!center) return false;
  let hit=false;
  for (let ddr=-1; ddr<=1; ddr++) for (let ddc=-1; ddc<=1; ddc++) {
    const r=center.row+ddr, c=center.col+ddc;
    if (!isInside(r,c)) continue;

    if (unit.side==='player' && isBossCell(r,c)) { damageBoss(2, unit); hit=true; continue; }

    const t=getUnitAt(r,c);
    if (t && t.side!==unit.side) { damageUnit(t,2); addEffect(unit,t,'attack',true); hit=true; }
  }
  return hit;
}
function laneFlashDirectional(unit, dr, dc, weak) {
  const dmg = weak ? 5 : 10;
  for (let dist=1; dist<=2; dist++) {
    const r=unit.row+dr*dist, c=unit.col+dc*dist;
    if (!isInside(r,c)) break;

    if (unit.side==='player' && isBossCell(r,c)) { damageBoss(dmg, unit); addEffect(unit,{row:r,col:c},'attack',true,'flash'); return true; }

    const t=getUnitAt(r,c);
    if (t && t.side!==unit.side) { damageUnit(t,dmg); addEffect(unit,t,'attack',true,'flash'); return true; }
  }
  return false;
}


// ---- Lane-skill extras (auto-mapped for units without explicit laneSkillId, plus overrides) ----

// [成り同一] : lane-controlled -> fire the unit's own normal skill again (no cooldown change here; cooldown is handled in useSkill)
function laneSameSkill(unit, opts={}) {
  const type = TYPE_BY_ID.get(unit.typeId);
  const id = type?.skillId;
  const sk = id ? SKILLS[id] : null;
  if (!sk) return false;
  sk.run(unit, opts);
  return true;
}

// [成り押] : sideways targeting, but knockback direction stays "forward" (player: up / enemy: down)
function laneKnockDirectional(unit, dc) {
  const dir = unit.side==='player' ? -1 : 1;

  for (let dist=1; dist<=3; dist++) {
    const r = unit.row;
    const c = unit.col + dc*dist;
    if (!isInside(r,c)) break;

    if (unit.side==='player' && isBossCell(r,c)) {
      damageBoss(3, unit);
      addEffect(unit, bossAnchor(), 'attack', true);
      return true;
    }

    const t = getUnitAt(r,c);
    if (t && t.side !== unit.side) {
      damageUnit(t, 3);
      addEffect(unit, t, 'attack', true);

      const nr = t.row + dir, nc = t.col; // forward push
      if (t.hp > 0 && isInside(nr,nc) && !isBlocked(nr,nc)) { t.row = nr; t.col = nc; }
      return true;
    }
  }
  return false;
}

// [成り時] : sideways targeting version of 時限十字 (keeps weak/normal behavior)
function laneTimedWideDirectional(unit, dc, weak) {
  let center = null;

  for (let dist=1; dist<=4; dist++) {
    const r = unit.row;
    const c = unit.col + dc*dist;
    if (!isInside(r,c)) break;

    if (unit.side==='player' && isBossCell(r,c)) { center = { __boss:true, row:r, col:c }; break; }

    const t = getUnitAt(r,c);
    if (t && t.side !== unit.side) { center = { row:t.row, col:t.col }; break; }
  }
  if (!center) return false;

  const range = weak ? 1 : 2;
  const dmg   = weak ? 2 : 3;

  const targets = [];
  targets.push({ r:center.row, c:center.col });
  for (let d=1; d<=range; d++) {
    targets.push({ r:center.row - d, c:center.col });
    targets.push({ r:center.row + d, c:center.col });
    targets.push({ r:center.row, c:center.col - d });
    targets.push({ r:center.row, c:center.col + d });
  }

  let hit = 0;
  for (const p of targets) {
    if (!isInside(p.r,p.c)) continue;

    if (unit.side==='player' && isBossCell(p.r,p.c)) {
      damageBoss(dmg, unit);
      addEffect(unit, bossAnchor(), 'attack', true);
      hit++;
      continue;
    }

    const t = getUnitAt(p.r,p.c);
    if (t && t.side !== unit.side) {
      damageUnit(t, dmg);
      addEffect(unit, t, 'attack', true);
      hit++;
    }
  }
  return hit > 0;
}


const LANE_SKILLS = {
  // ---- Specific sideways evolved skills ----
  beamLR: {
    run(unit, opts={}) {
      // 砲：左右ビーム（4ダメ×左右それぞれ最大1体）
      skillBeamLR(unit);
      return true; // logs inside
    }
  },
  chainLR: {
    run(unit, opts={}) {
      // 雷：左右チェイン雷（左右それぞれ最初の敵に2＋連鎖）
      skillChainLR(unit);
      return true; // logs inside
    }
  },


  // auto-mapped special lanes
  sameSkill: {
    run(unit, opts={}) {
      const ok = laneSameSkill(unit, opts);
      if (ok) logSkill(`[成り${TYPE_BY_ID.get(unit.typeId).symbol}] 追撃：通常スキルをもう一度発動。`);
      return !!ok;
    }
  },
  knockLR: {
    run(unit, opts={}) {
      const hit = (laneKnockDirectional(unit,-1) | laneKnockDirectional(unit,+1));
      if (hit) logSkill(`[成り押] 左右ノックバック：左右3マス以内の敵（＋ボス）に3ダメ＋前方へ1マス押し。`);
      return !!hit;
    }
  },
  timedWideLR: {
    run(unit, opts={}) {
      const weak = !!opts.weak;
      const hit = (laneTimedWideDirectional(unit,-1,weak) | laneTimedWideDirectional(unit,+1,weak));
      if (hit) logSkill(weak ? `[成り時(減衰)] 左右時限十字：左右4マス先中心の十字(射程1)に2ダメ。`
                            : `[成り時] 左右時限十字：左右4マス先中心の十字(射程2)に3ダメ。`);
      return !!hit;
    }
  },


  poke: {
    run(unit, opts={}) {
      const weak = !!opts.weak;
      const left={dr:0,dc:-1}, right={dr:0,dc:+1};
      const hit = (lanePokeDirectional(unit,left.dr,left.dc) | lanePokeDirectional(unit,right.dr,right.dc));
      if (hit) logSkill(`[成り${TYPE_BY_ID.get(unit.typeId).symbol}] 左右突き：左右2マス以内の敵（＋ボス）へ(攻+1)ダメ。`);
      return !!hit;
    }
  },
  multi: {
    run(unit, opts={}) {
      const left={dr:0,dc:-1}, right={dr:0,dc:+1};
      const hit = (laneMultiDirectional(unit,left.dr,left.dc) | laneMultiDirectional(unit,right.dr,right.dc));
      if (hit) logSkill(`[成り${TYPE_BY_ID.get(unit.typeId).symbol}] 左右列ビーム：左右4マスの同列上の敵（＋ボス）へ2ダメ。`);
      return !!hit;
    }
  },
  wide: {
    run(unit, opts={}) {
      const left={dr:0,dc:-1}, right={dr:0,dc:+1};
      const hit = (laneWideDirectional(unit,left.dr,left.dc) | laneWideDirectional(unit,right.dr,right.dc));
      if (hit) logSkill(`[成り${TYPE_BY_ID.get(unit.typeId).symbol}] 左右範囲：左右4マスで見つけた敵中心の3×3に2ダメ（ボスも含む）。`);
      return !!hit;
    }
  },
  flash: {
    run(unit, opts={}) {
      const weak = !!opts.weak;
      const left={dr:0,dc:-1}, right={dr:0,dc:+1};
      const hit = (laneFlashDirectional(unit,left.dr,left.dc,weak) | laneFlashDirectional(unit,right.dr,right.dc,weak));
      if (hit) logSkill(weak ? `[成り${TYPE_BY_ID.get(unit.typeId).symbol}(減衰)] 左右必殺：左右2マスに5ダメ（ボス可）。` : `[成り${TYPE_BY_ID.get(unit.typeId).symbol}] 左右必殺：左右2マスに10ダメ（ボス可）。`);
      return !!hit;
    }
  }

  ,
  // ===== HERO NORMAL ACTIONS =====
  // 竜：配置列および左右列の「一番下」の敵に攻撃
  dragonColumnBottom(unit){
    const atk = getAtk(unit);
    const cols = [unit.col-1, unit.col, unit.col+1];
    for (const c of cols) {
      if (c < 0 || c >= COLS) continue;
      for (let r = ROWS - 1; r >= 0; r--) {
        if (isBossCell(r,c)) continue;
        const t = getUnitAt(r, c);
        if (t && t.side !== unit.side) {
          damageUnit(t, atk);
          addEffect(unit, t, 'attack', false);
          break;
        }
      }
    }
  },

  // 突：目の前の敵に10ダメージ（固定）
  front10(unit){
    const dir = (unit.side === 'player') ? -1 : 1;
    const r = unit.row + dir, c = unit.col;
    if (!isInside(r,c)) return;
    if (isBossCell(r,c)) { damageBoss(10, unit); return; }
    const t = getUnitAt(r,c);
    if (t && t.side !== unit.side) {
      damageUnit(t, 10);
      addEffect(unit, t, 'attack', false);
    }
  },

  // 突（成り通常行動）：自分のいる行全体に2ダメージ（敵のみ）
  rowDamage2(unit){
    for (const t of units) {
      if (t.side === unit.side) continue;
      if (t.row !== unit.row) continue;
      damageUnit(t, 2);
      addEffect(unit, t, 'attack', true);
    }
    // boss on same row
    if (boss && boss.hp > 0 && boss.r === unit.row) {
      damageBoss(2, unit);
    }
  },

  // 僧：周囲3マス以内の味方ユニットを回復（マンハッタン距離<=3）
  healRadius3(unit){
    const amount = 2;
    for (const t of units) {
      if (t.side !== unit.side) continue;
      const dist = Math.abs(t.row - unit.row) + Math.abs(t.col - unit.col);
      if (dist <= 3) {
        healUnit(t, amount);
        addEffect(unit, t, 'heal', false);
      }
    }
  },

  // ===== HERO LANE SKILLS =====
  dragonAll: {
    run(unit, opts={}) {
      const atk = getAtk(unit);
      for (const t of units) {
        if (t.side === unit.side) continue;
        damageUnit(t, atk);
        addEffect(unit, t, 'attack', true);
      }
      if (bossExists()) damageBoss(atk, unit);
      logSkill(`【成り竜】敵全体に攻撃。`);
      return true;
    }
  },

  rowWide: {
    run(unit, opts={}) {
      skillRowWide(unit);
      logSkill(`【成り突】同じ行の敵全体に攻撃。`);
      return true;
    }
  },

  healAll: {
    run(unit, opts={}) {
      const amount = 3;
      for (const t of units) {
        if (t.side !== unit.side) continue;
        healUnit(t, amount);
        addEffect(unit, t, 'heal', true);
      }
      logSkill(`【成り僧】味方全員を回復。`);
      return true;
    }
  }

};

const SKILLS = {
  poke:      { supportsWeak:false, run:(unit, opts={}) => skillPoke(unit) },
  multi:     { supportsWeak:false, run:(unit, opts={}) => skillMulti(unit) },
  wide:      { supportsWeak:false, run:(unit, opts={}) => skillWide(unit) },
  timedWide: { supportsWeak:true,  run:(unit, opts={}) => skillTimedWide(unit, !!opts.weak) },
  heal:      { supportsWeak:false, run:(unit, opts={}) => skillHeal(unit) },
  knock:     { supportsWeak:false, run:(unit, opts={}) => skillKnock(unit) },
  chain:     { supportsWeak:false, run:(unit, opts={}) => skillChain(unit) },
  chainLR:   { supportsWeak:false, run:(unit, opts={}) => skillChainLR(unit) },
  guard:     { supportsWeak:false, run:(unit, opts={}) => skillGuard(unit) },
  flash:     { supportsWeak:true,  run:(unit, opts={}) => skillFlash(unit, !!opts.weak) },
  beam:      { supportsWeak:false, run:(unit, opts={}) => skillBeam(unit) },
  beamLR:    { supportsWeak:false, run:(unit, opts={}) => skillBeamLR(unit) },
  slashAoe:  { supportsWeak:false, run:(unit, opts={}) => skillSlashAoe(unit) },
  nagiCone:  { supportsWeak:false, run:(unit, opts={}) => skillNagiCone(unit) },
  tankFull:  { supportsWeak:false, run:(unit, opts={}) => skillTankFull(unit) },
  bowMulti3: { supportsWeak:false, run:(unit, opts={}) => skillBowMulti3(unit) },
  bombAoe2:  { supportsWeak:false, run:(unit, opts={}) => skillBombAoe2(unit) },
  marshal:   { supportsWeak:false, run:(unit, opts={}) => skillMarshal(unit) },
  columnize: { supportsWeak:false, run:(unit, opts={}) => skillColumnize(unit) },
  defenseField: { supportsWeak:false, run:(unit, opts={}) => skillDefenseField(unit) },
  supportField: { supportsWeak:false, run:(unit, opts={}) => skillSupportField(unit) },

  // ===== HERO SKILLS =====
  dragonWide: { supportsWeak:false, run:(unit, opts={}) => skillDragonWide(unit) },
  rowWide:    { supportsWeak:false, run:(unit, opts={}) => skillRowWide(unit) },
  healColumns:{ supportsWeak:false, run:(unit, opts={}) => skillHealColumns(unit) },

};

function skillSupportsWeak(typeId){
  const type = TYPE_BY_ID.get(typeId);
  const id = type?.skillId;
  return !!(id && SKILLS[id] && SKILLS[id].supportsWeak);
}


function inferLaneSkillId(type){
  if (!type) return null;

  // Overrides by unit symbol (game design rules)
  if (type.symbol === '砲') return 'beamLR';                          // sideways beam
  if (type.symbol === '雷') return 'chainLR';                         // sideways chain
  if (type.symbol === '列' || type.symbol === '将') return 'poke';       // normal skill + 左右突き
  if (type.symbol === '弓' || type.symbol === '爆' || type.symbol === '剣') return 'sameSkill'; // same as normal skill
  if (type.symbol === '押') return 'knockLR';                           // sideways target, forward knock
  if (type.symbol === '時') return 'timedWideLR';                       // sideways timed wide (keeps weak)

  // Respect explicit lane skill if set
  if (type.laneSkillId) return type.laneSkillId;

  // Fallback mapping from normal skill kind
  switch (type.skillId) {
    case 'poke': return 'poke';
    case 'multi':
    case 'beam':
    case 'bowMulti3': return 'multi';
    case 'wide':
    case 'slashAoe':
    case 'nagiCone':
    case 'bombAoe2': return 'wide';
    case 'flash': return 'flash';
    default: return null;
  }
}


function useLaneSkill(unit, opts={}) {
  if (!laneIsControlledBy(unit)) return;
  const type = TYPE_BY_ID.get(unit.typeId);
  const laneId = inferLaneSkillId(type);
  const lane = laneId ? LANE_SKILLS[laneId] : null;
  if (!lane) return;
  lane.run(unit, opts);
}

function useSkill(unit, opts={}) {
  const type = TYPE_BY_ID.get(unit.typeId);
  LAST_SKILL_LOG = '';

  const id = type.skillId;
  const skill = id ? SKILLS[id] : null;
  if (skill) skill.run(unit, opts);

  useLaneSkill(unit, opts);

  // Update in-game message window with the last triggered skill description
  if (unit.side === 'player') setGameMessage(formatSkillMessage(LAST_SKILL_LOG));

  unit.skillCooldown = getSkillCdMax(unit);
  clampCooldowns();
}


/* =========================
   生成（重み付き）
========================= */
function randomChoice(array) { return array[Math.floor(Math.random()*array.length)]; }

// 敵専用が出やすい補正（確率側）
const ENEMY_ONLY_WEIGHT_MULT = 2.0;

function weightedPickTypeId(side) {
  const ids = ALL_TYPE_IDS.filter(id => {
    const t = TYPE_BY_ID.get(id);
    if (!t) return false;
    if (t.isHero) return false; // heroes never spawn by normal generation
    if (side === 'player' && t.enemyOnly) return false;
    if (side === 'enemy' && t.playerOnly) return false;
    return true;
  });

  let total = 0;
  for (const id of ids) {
    const t = TYPE_BY_ID.get(id);
    const w = Math.max(0, getParams(side, id).weight);
    const fixed = (side === 'enemy' && t.fixedWeight) ? t.fixedWeight : 0;
    const base = w + fixed;
    const eff = (side === 'enemy' && t.enemyOnly) ? base * ENEMY_ONLY_WEIGHT_MULT : base;
    total += eff;
  }
  if (total <= 0) return null;

  let r = Math.random() * total;
  for (const id of ids) {
    const t = TYPE_BY_ID.get(id);
    const w = Math.max(0, getParams(side, id).weight);
    const fixed = (side === 'enemy' && t.fixedWeight) ? t.fixedWeight : 0;
    const base = w + fixed;
    const eff = (side === 'enemy' && t.enemyOnly) ? base * ENEMY_ONLY_WEIGHT_MULT : base;
    r -= eff;
    if (r <= 0) return id;
  }
  return ids[0] ?? null;
}

function createUnit(side,row,col,typeId){
  return {
    id: nextUnitId++,
    side,row,col,
    typeId,
    hp: getParams(side, typeId).maxHp,
    atkBuff: 0,
    skillCooldown: 0
  };
}

// 補充（移動後。内部順は味方→敵）
function playerSpawnByEnergy() {
  if (ENG < 1) return;
  for (let c=0; c<COLS; c++) {
    if (!isBlocked(ROWS-1,c) && units.length<MAX_UNITS) {
      const typeId = weightedPickTypeId('player');
      if (typeId == null) continue;
      const u = createUnit('player', ROWS-1, c, typeId);
      units.push(u); addSpawnEffect(u);
      const t = TYPE_BY_ID.get(typeId);
      const cost = t ? (t.energyCost || 0) : 0;
      ENG -= cost;
    }
  }
  updateEnergyHud();
}

function autoSpawn() {
  // 味方生成は playerSpawnByEnergy() に移行
  for (let c=0; c<COLS; c++) { /* noop */ }
  for (let c=0; c<COLS; c++) {
    if (!isBlocked(0,c) && units.length<MAX_UNITS) {
      const typeId = weightedPickTypeId('enemy');
      if (typeId == null) continue;
      const u=createUnit('enemy',0,c,typeId);
      units.push(u); addSpawnEffect(u);
    }
  }
}

/* =========================
   敵強化：ユニット追加のみ＆重み総量10維持
========================= */
function sumEnemyWeights() {
  let s=0;
  for (const id of ALL_TYPE_IDS) {
    const t = TYPE_BY_ID.get(id);
    if (t && t.fixedWeight) continue;
    s += Math.max(0, getParams('enemy', id).weight);
  }
  return s;
}
function normalizeEnemyWeightsTo10(excludeId=null) {
  let sum = sumEnemyWeights();
  if (sum <= 10) return;

  for (const id of enemyWeightOrder) {
    if (sum <= 10) break;
    const tt = TYPE_BY_ID.get(id);
    if (tt && tt.fixedWeight) continue;
    if (excludeId != null && id === excludeId) continue;

    const p = getParams('enemy', id);
    if (p.weight <= 0) continue;

    const dec = Math.min(p.weight, sum - 10);
    p.weight -= dec;
    sum -= dec;
  }

  if (sum > 10) {
    for (const id of ALL_TYPE_IDS) {
      if (sum <= 10) break;
      const tt = TYPE_BY_ID.get(id);
    if (tt && tt.fixedWeight) continue;
    if (excludeId != null && id === excludeId) continue;
      const p = getParams('enemy', id);
      if (p.weight <= 0) continue;
      const dec = Math.min(p.weight, sum - 10);
      p.weight -= dec;
      sum -= dec;
    }
  }
}

function pickEnemyAddableTypeIdByRule() {
  const addable = ALL_TYPE_IDS.filter(id => {
    const t = TYPE_BY_ID.get(id);
    if (getParams('enemy', id).weight !== 0) return false;
    if (EXCLUDED_FROM_UPGRADES.has(id)) return false;
    if (t.playerOnly) return false;

    const isLate = (battleCount >= 7);
    if (isLate) return (t.grade === 3);
    return (t.grade <= 2);
  });

  if (!addable.length) return null;

  const enemyOnly = addable.filter(id => TYPE_BY_ID.get(id).enemyOnly);
  if (enemyOnly.length && Math.random() < 0.75) return randomChoice(enemyOnly);

  return randomChoice(addable);
}

function applyEnemyAddUnitUpgrade(labelForLog) {
  const id = pickEnemyAddableTypeIdByRule();
  if (id == null) {
    logSkill(`【${labelForLog}】追加できる新ユニットがありません（ルール制限/候補枯渇）`);
    normalizeEnemyWeightsTo10(null);
    return;
  }

  const t = TYPE_BY_ID.get(id);
  getParams('enemy', id).weight = 1;

  if (!enemyWeightOrder.includes(id)) enemyWeightOrder.push(id);

  normalizeEnemyWeightsTo10(id);

  logSkill(`【${labelForLog}】敵ユニット追加：${t.symbol}（G${t.grade}） 重み0→1 / 以後、総重み=10を維持（古い順に減衰）`);
  logSkill(`【現在】敵重み: ${summarizeWeights('enemy')} / (合計=${sumEnemyWeights()})`);
}

/* =========================
   ターン進行（攻撃フェーズ）
========================= */
function advanceTurnAttackPhase() {
  if (gameOver) return;
  turn++;

  const players = units.filter(u => u.side === 'player');
  const enemies  = units.filter(u => u.side === 'enemy');

  for (const u of players) { if (!units.includes(u)) continue; normalAttackOnly(u); }
  for (const u of enemies) { if (!units.includes(u)) continue; normalAttackOnly(u); }

  if (isBossBattle() && bossExists()) bossAttack();

  for (const u of units) if (u.skillCooldown > 0) u.skillCooldown--;
  clampCooldowns();

  updateLaneOwners();

  renderBoard();
  updateCanvasSize();
  checkBattleEnd();
  updateStatus();
}

/* =========================
   ボス攻撃
========================= */
function bossAttack() {
  const candidates = units.filter(u => u.side==='player' && bossExists() && bossInRange(u.row,u.col,4));
  if (!candidates.length) return;

  const shots = Math.min(2, candidates.length);
  logSkill(`【ボス】${boss.symbol}の攻撃：射程4以内の味方へ${shots}発（各${boss.atk}ダメ）`);
  for (let i=0; i<shots; i++) {
    const t = randomChoice(candidates);
    damageUnit(t, boss.atk);
    addEffect(bossAnchor(), t, 'attack', true);
  }
}
function bossInRange(r,c,range){
  let min = Infinity;
  for (let rr=boss.r; rr<boss.r+boss.h; rr++) for (let cc=boss.c; cc<boss.c+boss.w; cc++) {
    min = Math.min(min, Math.abs(rr-r)+Math.abs(cc-c));
  }
  return min <= range;
}

/* =========================
   移動フェーズ（盤面タップで進む）
========================= */
function startMovePhase() {
  if (phase !== 'attack_wait' || gameOver) return;

  phase = 'move_anim';
  overlayEl.style.display = 'none';
  clearEffects();

  function buildPlansForSide(side) {
    const dir = (side === 'player') ? -1 : 1;
    const movers = units.filter(u => u.side === side);

    const plans = [];
    for (const u of movers) {
      const t = TYPE_BY_ID.get(u.typeId);
      if (t && t.moveType === 'static') continue; // 不動は前進しない

      let nr = u.row + dir;
      const nc = u.col;

      // 味方は「不動」味方ユニットを飛び越えて進める（連続可）
      if (side === 'player') {
        while (isInside(nr, nc)) {
          const blocker = getUnitAt(nr, nc);
          if (!blocker) break;

          // enemy blocks
          if (blocker.side !== side) { nr = null; break; }

          const bt = TYPE_BY_ID.get(blocker.typeId);
          if (bt && bt.moveType === 'static') {
            nr += dir; // jump over static ally
            continue;
          } else {
            nr = null; // normal ally blocks
            break;
          }
        }
        if (nr == null) continue;
      } else {
        // enemy uses normal blocking
        if (!isInside(nr, nc)) continue;
        if (isBlocked(nr, nc)) continue;
      }

      if (!isInside(nr, nc)) continue;
      // final destination must be empty
      if (getUnitAt(nr, nc)) continue;
      if (isBossCell(nr, nc)) continue;

      plans.push({ id: u.id, fr: u.row, fc: u.col, tr: nr, tc: nc });
    }
    return plans;
  }

  const plansP = buildPlansForSide('player');
  for (const p of plansP) addMoveEffect(p.fr, p.fc, p.tr, p.tc);
  renderBoard(); updateCanvasSize();
  for (const p of plansP) {
    const u = units.find(x => x.id === p.id);
    if (!u) continue;
    if (!isBlocked(p.tr, p.tc)) { u.row=p.tr; u.col=p.tc; }
  }

  const plansE = buildPlansForSide('enemy');
  for (const p of plansE) addMoveEffect(p.fr, p.fc, p.tr, p.tc);
  renderBoard(); updateCanvasSize();
  for (const p of plansE) {
    const u = units.find(x => x.id === p.id);
    if (!u) continue;
    if (!isBlocked(p.tr, p.tc)) { u.row=p.tr; u.col=p.tc; }
  }

  endMovePhase();
}

/* =========================
   入力（味方タップ / 敵タップ / パス）
========================= */
function onPlayerTap(unit) {
  const type = TYPE_BY_ID.get(unit.typeId);
  setGameMessage(describeSkill(type, false));

  if (gameOver || isAnimating || phase !== 'idle') return;

  isAnimating = true;
  const now = performance.now();
  const elapsedMs = now - decisionStartTime;

  clearEffects();

  const canSkill = canUseSkillNow(unit);

  if (canSkill) {
    const type = TYPE_BY_ID.get(unit.typeId);
    const weak = elapsedMs > FLASH_LIMIT_MS;
    useSkill(unit, skillSupportsWeak(unit.typeId) ? { weak } : { weak:false });
  } else {
    normalAttackOnly(unit);
  }

  advanceTurnAttackPhase();
  if (!gameOver) enterAttackWaitPhase();
  else { overlayEl.style.display='none'; phase='idle'; isAnimating=false; }
}
function onEnemyTap(unit) {
  if (gameOver || isAnimating || phase !== 'idle') return;

  isAnimating = true;
  const now = performance.now();
  const elapsedMs = now - decisionStartTime;

  logSkill(`敵${TYPE_BY_ID.get(unit.typeId).symbol}タップ → 味方が反応`);

  const ready = units.filter(u => u.side==='player' && canUseSkillNow(u));
  const pool  = units.filter(u => u.side==='player');
  const actor = ready.length ? randomChoice(ready) : randomChoice(pool);

  if (!actor) { logSkill('反応できる味方がいない'); isAnimating=false; return; }

  clearEffects();

  const type = TYPE_BY_ID.get(actor.typeId);
  const weak = elapsedMs > FLASH_LIMIT_MS;
  if (canUseSkillNow(actor)) {
    useSkill(actor, skillSupportsWeak(actor.typeId) ? { weak } : { weak:false });
  } else {
    normalAttackOnly(actor);
  }

  advanceTurnAttackPhase();
  if (!gameOver) enterAttackWaitPhase();
  else { overlayEl.style.display='none'; phase='idle'; isAnimating=false; }
}
function onBossTap() {
  if (gameOver || isAnimating || phase !== 'idle') return;
  isAnimating = true;
  logSkill(`ボス${boss.symbol}タップ → 味方が反応`);
  clearEffects();

  const ready = units.filter(u => u.side==='player' && canUseSkillNow(u));
  const pool  = units.filter(u => u.side==='player');
  const actor = ready.length ? randomChoice(ready) : randomChoice(pool);
  if (!actor) { isAnimating=false; return; }

  const now = performance.now();
  const weak = (now - decisionStartTime) > FLASH_LIMIT_MS;
  const type = TYPE_BY_ID.get(actor.typeId);
  if (canUseSkillNow(actor)) {
    useSkill(actor, skillSupportsWeak(actor.typeId) ? { weak } : { weak:false });
  } else {
    normalAttackOnly(actor);
  }

  advanceTurnAttackPhase();
  if (!gameOver) enterAttackWaitPhase();
  else { overlayEl.style.display='none'; phase='idle'; isAnimating=false; }
}
function doPass() {
  if (gameOver || phase !== 'idle' || isAnimating) return;
  logSkill('【パス】スキルを使わずターン進行。');
  clearEffects();
  isAnimating = true;

  advanceTurnAttackPhase();
  if (!gameOver) enterAttackWaitPhase();
  else { overlayEl.style.display='none'; phase='idle'; isAnimating=false; }
}

/* =========================
   描画
========================= */
function renderBoard() {
  for (let r=0; r<ROWS; r++) for (let c=0; c<COLS; c++) {
    const cell = cells[r][c];
    const unit = getUnitAt(r,c);

    cell.className = 'cell';
    cell.innerHTML = '';

    const owner = laneOwners[c];
    if (owner === 'player') cell.classList.add('lane-player');

    // Hero placement hints
    if (phase === 'hero_place' && !isBossCell(r,c)) {
      const depth = computeInitialDepth();
      const minRow = ROWS - depth;
      const maxRow = ROWS - 2; // exclude bottom spawn row
      const inInitialArea = (r >= minRow && r <= (ROWS - 1));
      if (!unit && inInitialArea && r !== ROWS - 1) {
        if (isHeroPlaceCellAllowed(r,c)) cell.classList.add('hero-place-allowed');
      } else if (inInitialArea && r === ROWS - 1) {
        cell.classList.add('hero-place-forbidden');
      }
    }


    // Terrain
    if (!isBossCell(r,c) && terrain[r]) {
      const tr = terrain[r][c];
      if (tr === 'defense') cell.classList.add('defense-terrain');
      if (tr === 'support') cell.classList.add('support-terrain');
    }

    if (isBossCell(r,c)) {
      cell.classList.add('boss');
      if (r === boss.r && c === boss.c) {
        const sym=document.createElement('div');
        sym.className='boss-symbol';
        sym.textContent=boss.symbol;

        const hpBar=document.createElement('div');
        hpBar.className='hpbar boss big';
        const ratio=Math.max(0, Math.min(1, (boss.hp/boss.maxHp)));
        const fill=document.createElement('div');
        fill.className='fill';
        fill.style.width = `${Math.round(ratio*100)}%`;
        hpBar.appendChild(fill);

        cell.appendChild(sym);
        cell.appendChild(hpBar);
      }
      continue;
    }

    if (unit) {
      cell.classList.add(unit.side === 'player' ? 'player' : 'enemy');

      const cdMax = getSkillCdMax(unit);
      if (unit.skillCooldown>0 && !isOnSupportTerrain(unit)) cell.classList.add('cooldown');

      const t = TYPE_BY_ID.get(unit.typeId);
      if (t && t.isHero) cell.classList.add('hero-unit');

// ---- Enemy breakthrough alert (start at 3rd row from bottom; blink at 2nd row from bottom) ----
if (unit.side === 'enemy') {
  const alertStartRow = ROWS - 3; // 下から3列目
  const blinkRow      = ROWS - 2; // 下から2列目（点滅開始）
  if (unit.row >= alertStartRow) {
    const a = document.createElement('div');
    a.className = 'alert-text' + (unit.row >= blinkRow ? ' blink' : '');
    a.textContent = 'ALERT';
    cell.appendChild(a);
  }
}

      const symbolDiv=document.createElement('div');
      symbolDiv.className='unit-symbol';
      symbolDiv.textContent=t.symbol;

      const hpBar=document.createElement('div');
      hpBar.className='hpbar ' + (unit.side==='player' ? 'player' : 'enemy');

      const maxHp = getMaxHp(unit);
      const ratio=Math.max(0, Math.min(1, (unit.hp/maxHp)));
      const fill=document.createElement('div');
      fill.className='fill';
      fill.style.width = `${Math.round(ratio*100)}%`;
      hpBar.appendChild(fill);

      if (unit.atkBuff>0){
        const buffDiv=document.createElement('div');
        buffDiv.className='buff-icon';
        buffDiv.textContent='★'.repeat(Math.min(unit.atkBuff,2));
        cell.appendChild(buffDiv);
      }

      cell.appendChild(symbolDiv);
      cell.appendChild(hpBar);
    }
  }
  drawEffects();
}

/* =========================
   盤面構築
========================= */
function buildBoard(){
  boardEl.innerHTML='';
  cells=[];

  boardEl.style.gridTemplateColumns = `repeat(${COLS}, ${CONFIG.cellW}px)`;
  boardEl.style.gridAutoRows = `${CONFIG.cellH}px`;

  for (let r=0;r<ROWS;r++){
    const rowArr=[];
    for (let c=0;c<COLS;c++){
      const cell=document.createElement('div');
      cell.className='cell';
      cell.dataset.row=r;
      cell.dataset.col=c;
      rowArr.push(cell);
      boardEl.appendChild(cell);
    }
    cells.push(rowArr);
  }


  // Terrain grid (reset on rebuild)
  terrain = Array.from({length: ROWS}, () => Array(COLS).fill(null));
  boardEl.onclick = (e)=>{
    try {
    if (modalBackdrop.style.display === 'flex' && phase !== 'hero_place') return;

    if (phase === 'hero_place') {
      const cell=e.target.closest('.cell');
      if (!cell) return;
      const row = Number(cell.dataset.row);
      const col = Number(cell.dataset.col);
      // Only allowed empty cells
      if (!isHeroPlaceCellAllowed(row, col)) return;
      // Not allow placing on bottom spawn row even if miscomputed
      if (row === ROWS - 1) return;

      advanceHeroPlacement(row, col);
      renderBoard();
      return;
    }

    if (phase === 'attack_wait') { startMovePhase(); return; }
    if (phase !== 'idle') return;

    const cell=e.target.closest('.cell');
    if (!cell) return;
    const row = Number(cell.dataset.row);
    const col = Number(cell.dataset.col);

    if (isBossCell(row,col)) { onBossTap(); return; }

    const unit = getUnitAt(row, col);
    if (!unit) return;

    if (unit.side === 'player') onPlayerTap(unit);
    else onEnemyTap(unit);
    } catch (err) {
      console.error(err);
      addLog('【ERROR】' + (err && err.message ? err.message : String(err)));
      setGameMessage('ERROR: ' + (err && err.message ? err.message : String(err)));
    }
  };

  requestAnimationFrame(updateCanvasSize);
}

/* =========================
   初期配置（重み付きランダム）
========================= */
function computeInitialDepth() {
  const maxDepth = Math.min(4, Math.floor(ROWS / 2));
  return Math.max(1, maxDepth);
}
function spawnBossIfNeeded() {
  boss = null;
  if (!isBossBattle()) return;

  const w=2, h=2;
  const startCol = Math.max(0, Math.floor(COLS/2)-1);
  const startRow = 0;

  boss = {
    r: startRow,
    c: Math.min(COLS-w, startCol),
    w, h,
    maxHp: 20 + Math.floor(stage/2)*3,
    hp:  20 + Math.floor(stage/2)*3,
    atk: 2 + Math.floor(stage/3),
    name: 'ボス',
    symbol: '王',
    grade: 0
  };

  logSkill(`【ボス戦】ボス出現：${boss.symbol}（2×2 / G${boss.grade}） HP:${boss.hp} ATK:${boss.atk}`);
}

/* =========================
   ヒーロー配置フロー
========================= */
function computeHeroPlaceAllowedCells(){
  heroPlaceAllowed.clear();

  const depth = computeInitialDepth();
  const minRow = ROWS - depth;     // inclusive
  const maxRow = ROWS - 2;         // exclude bottom spawn row (ROWS-1)

  for (let r=minRow; r<=maxRow; r++){
    for (let c=0; c<COLS; c++){
      // cannot place on already-placed hero cells
      let occupiedByHero = false;
      for (const [hid, p] of heroPlacements.entries()){
        if (p.row === r && p.col === c) { occupiedByHero = true; break; }
      }
      if (occupiedByHero) continue;
      heroPlaceAllowed.add(heroKey(r,c));
    }
  }
}

function beginHeroPlacementFor(typeId, resume){
  heroPlacingTypeId = typeId;
  heroPlacementResume = resume || null;

  // Clear previous battle visuals so hero placement screen is not cluttered
  // (DO NOT touch game state beyond visuals)
  units = [];
  effects = [];
  fxTickerOn = false;
  clearNumericFxQueues();
  laneOwners = [];
  try { fxCtx && fxCanvas && fxCtx.clearRect(0,0,fxCanvas.width,fxCanvas.height); } catch(e){}

  phase = 'hero_place';
  computeHeroPlaceAllowedCells();
  renderBoard();
  updateCanvasSize();

  const t = TYPE_BY_ID.get(typeId);
  setGameMessage(`ヒーロー配置：${t?.symbol ?? '?'} を配置してください（最下段は不可）`);
  addLog(`【ヒーロー加入】${t?.symbol ?? '?'}：初期配置エリア内（最下段除く）に配置してください。`);
  showHeroPlacementIntroSingle(typeId);
}

function showHeroPlacementIntroSingle(typeId){
  const t = TYPE_BY_ID.get(typeId);
  const msg =
    `加入したヒーロー（${t?.symbol ?? '?'}）の初期配置を決めます。
` +
    `配置できるのは「初期配置で味方が生成される範囲」の中で、最下段（生成マス）は不可です。
` +
    `盤面の薄いハイライトをタップして配置してください。`;

  const choices = [
    {
      key: 'hero-manual',
      title: 'OK（手動で配置する）',
      desc: msg,
      apply: () => { /* keep phase=hero_place */ }
    },
    {
      key: 'hero-auto',
      title: '自動配置',
      desc: '配置場所をランダムに決めます。',
      apply: () => { autoPlaceHeroSingle(typeId); }
    }
  ];
  showModal(choices, 'ヒーロー配置');
}

function autoPlaceHeroSingle(typeId){
  computeHeroPlaceAllowedCells();
  const arr = Array.from(heroPlaceAllowed).map(k => k.split(',').map(Number));
  if (!arr.length) {
    addLog('【ヒーロー配置】配置可能なマスがありません。');
    phase = 'idle';
    setGameMessage('---');
    return;
  }
  const [r,c] = arr[Math.floor(Math.random()*arr.length)];
  heroPlacements.set(typeId, { row:r, col:c });
  heroRecruited.add(typeId);
  finishHeroPlacement(typeId);
}

function advanceHeroPlacement(row, col){
  const typeId = heroPlacingTypeId;
  const t = TYPE_BY_ID.get(typeId);
  if (!t) return;

  heroPlacements.set(typeId, { row, col });
  heroRecruited.add(typeId);
  finishHeroPlacement(typeId);
}

function finishHeroPlacement(typeId){
  const t = TYPE_BY_ID.get(typeId);
  phase = 'idle';
  addLog(`【ヒーロー配置】${t?.symbol ?? '?'} 配置完了。`);
  setGameMessage('---');
  heroPlacingTypeId = null;

  if (heroPlacementResume) {
    const r = heroPlacementResume;
    heroPlacementResume = null;

    if (typeof r.afterPlacement === 'function') {
      r.afterPlacement();
    } else if (r.finalize) {
      finalizeStageStart();
    } else {
      finalizeStageStart();
    }
  } else {
    setupBattleBoard();
  }
}

function setupBattleBoard() {
  // Battle-only auto: always reset at the start of each battle.
  setAutoMode(false);
  units=[]; nextUnitId=1; turn=0; gameOver=false; isAnimating=false; phase='idle';
  clearEffects();

  // Reset battle terrains (e.g., defense terrain) per battle (not per turn).
  terrain = Array.from({length: ROWS}, () => Array(COLS).fill(null));

  laneOwners=new Array(COLS).fill(null);
  overlayEl.style.display = 'none';

  spawnBossIfNeeded();

  const depth = computeInitialDepth();
  const enemyRows = [];
  const playerRows = [];
  for (let i=0; i<depth; i++) enemyRows.push(i);
  for (let i=0; i<depth; i++) playerRows.push(ROWS-1-i);

  for (let col=0; col<COLS; col++){
    for (const row of enemyRows) {
      if (isBossCell(row,col)) continue;
      const typeId = weightedPickTypeId('enemy') ?? 0;
      units.push(createUnit('enemy',row,col,typeId));
    }
  }
  for (let col=0; col<COLS; col++){
    for (const row of playerRows) {
      // reserve hero placements (hero is fixed and not generated normally)
      let reserved = false;
      for (const [hid, p] of heroPlacements.entries()){
        if (p.row === row && p.col === col) { reserved = true; break; }
      }
      if (reserved) continue;

      const typeId = weightedPickTypeId('player') ?? 0;
      units.push(createUnit('player',row,col,typeId));
    }
  }

  // place heroes (fixed)
  for (const [hid, p] of heroPlacements.entries()){
    // safety: remove any unit already there
    const existing = getUnitAt(p.row, p.col);
    if (existing) removeUnit(existing);
    units.push(createUnit('player', p.row, p.col, hid));
  }

  updateLaneOwners();
  clampCooldowns();
  renderBoard();
  requestAnimationFrame(updateCanvasSize);

  decisionStartTime=performance.now();
  checkBattleEnd();
  updateStatus();
}

/* =========================
   モーダル
========================= */
function showModal(choices, title) {
  modalTitle.textContent = title;
  choicesEl.innerHTML = '';
  for (const ch of choices) {
    const btn = document.createElement('button');
    btn.className = 'choiceBtn';
    btn.innerHTML = `<div><b>${ch.title}</b></div><div class="mono">${ch.desc}</div>`;
    btn.onclick = () => { hideModal(); ch.apply(); };
    choicesEl.appendChild(btn);
  }
  modalBackdrop.style.display = 'flex';
}
function hideModal() { modalBackdrop.style.display = 'none'; }

/* =========================
   強化（味方：既存重み+1も候補に含める）
========================= */
function summarizeWeights(side) {
  const arr = [];
  for (const id of ALL_TYPE_IDS) {
    const p = getParams(side, id);
    if (p.weight > 0) arr.push(`${TYPE_BY_ID.get(id).symbol}:${p.weight}`);
  }
  return arr.length ? arr.join(' ') : '(なし)';
}

/*
  ★変更点：
  - weightPlus は「全upgradeable」からではなく、まず「既存(重み>=1)」を優先し、
    既存が無い時だけ0のユニットも混ぜる（= 既存重みアップがちゃんと出る）。
*/
function makeUpgradeCore(side, opts = {}) {
  const forceNewUnit = !!opts.forceNewUnit;
  const preferNewUnit = !!opts.preferNewUnit;
  const mode = opts.mode || 'any';

  const upgradeableIds = ALL_TYPE_IDS.filter(id => {
    if (EXCLUDED_FROM_UPGRADES.has(id)) return false;
    const t = TYPE_BY_ID.get(id);
    if (!t) return false;
    if (t.isHero) return false; // heroes are not handled by normal upgrades
    if (side === 'player' && t.enemyOnly) return false;
    if (side === 'enemy' && t.playerOnly) return false;
    return true;
  });

  const addable = upgradeableIds.filter(id => getParams(side, id).weight === 0);
  const weighted = upgradeableIds.filter(id => getParams(side, id).weight >= 1);
  const cooldownable = weighted.filter(id => getParams(side, id).skillCdMax >= 2); // 最低1までなので2以上のみ
  function makeAddNewUnit() {
    const heroAddable = (side === 'player') ? HERO_TYPE_IDS.filter(hid => !heroRecruited.has(hid)) : [];
    const pool = addable.concat(heroAddable);
    if (!pool.length) return null;

    const pickId = randomChoice(pool);
    const t = TYPE_BY_ID.get(pickId);

    // Hero recruit behaves like "add new unit", but requires placement.
    if (t && t.isHero) {
      return {
        key: `hero-${pickId}`,
        kind: 'newHero',
        side,
        heroId: pickId,
        title: `新ユニット追加（ヒーロー）`,
        desc: `${t.symbol} が加入。配置場所を決めると以後のバトルで固定配置されます（通常生成では出ません）`,
        applyOnly: () => { heroRecruited.add(pickId); }
      };
    }

    return {
      key: `new-${side}-${pickId}`,
      kind: 'newUnit',
      side,
      pickId,
      title: `新ユニット追加（${side === 'player' ? '味方' : '敵'}）`,
      desc: `${t.symbol} の生成重みを 0 → 1（このユニットが新たに出現する）`,
      applyOnly: () => { getParams(side, pickId).weight = 1; }
    };
  }


  // forceNewUnit: 「新ユニット追加」を必ず候補に入れる（ヒーロー加入も同時に候補化可能）
  // 以前はここで即returnしていたため、ヒーロー加入候補が出ない不具合が発生していた
  const forcedNewU = forceNewUnit ? makeAddNewUnit() : null;
  if (forceNewUnit && !forcedNewU) return null;

  const candidates = [];

  if (forcedNewU) candidates.push(forcedNewU);

  const newU = forceNewUnit ? null : makeAddNewUnit();
  if (newU) candidates.push(newU);

  // ヒーロー加入は「新ユニット追加」と同じ抽選プールに統合（makeAddNewUnit内で扱う）

  // ★生成頻度+1：既存(>=1)優先で選ぶ（=「既存ユニットの重みも選ばれる」）
  if (upgradeableIds.length) {
    const pool = (weighted.length ? weighted : upgradeableIds);
    const id = randomChoice(pool);
    const t = TYPE_BY_ID.get(id);
    candidates.push({
      key: `k1-${side}-${id}-${getParams(side, id).weight}`,
      kind: 'weightPlus',
      side,
      typeId: id,
      title: `生成頻度 +1（${side === 'player' ? '味方' : '敵'}）`,
      desc: `${t.symbol} の生成重み +1（${getParams(side, id).weight} → ${getParams(side, id).weight + 1}）`,
      applyOnly: () => { getParams(side, id).weight += 1; }
    });
  }

  if (weighted.length) {
    const id = randomChoice(weighted);
    const t = TYPE_BY_ID.get(id);
    candidates.push({
      key: `k2-${side}-${id}-${getParams(side, id).atk}`,
      kind: 'atkPlus',
      side,
      typeId: id,
      title: `攻撃力 +1（${side === 'player' ? '味方' : '敵'}）`,
      desc: `重み>=1の ${t.symbol} の攻撃 +1（${getParams(side, id).atk} → ${getParams(side, id).atk + 1}）`,
      applyOnly: () => { getParams(side, id).atk += 1; }
    });
  }

  if (weighted.length) {
    const id = randomChoice(weighted);
    const t = TYPE_BY_ID.get(id);
    candidates.push({
      key: `k3-${side}-${id}-${getParams(side, id).maxHp}`,
      kind: 'hpPlus',
      side,
      typeId: id,
      title: `最大HP +1（${side === 'player' ? '味方' : '敵'}）`,
      desc: `重み>=1の ${t.symbol} の最大HP +1（${getParams(side, id).maxHp} → ${getParams(side, id).maxHp + 1}）`,
      applyOnly: () => { getParams(side, id).maxHp += 1; }
    });
  }

  if (cooldownable.length) {
    const id = randomChoice(cooldownable);
    const t = TYPE_BY_ID.get(id);
    const before = getParams(side, id).skillCdMax;
    const after = Math.max(1, before - 1);
    if (after !== before) {
      candidates.push({
        key: `k4-${side}-${id}-${before}`,
        kind: 'ctMinus',
        side,
        typeId: id,
        title: `スキルCT -1（${side === 'player' ? '味方' : '敵'}）`,
        desc: `重み>=1の ${t.symbol} のスキルCT -1（${before} → ${after} / 最低1）`,
        applyOnly: () => { getParams(side, id).skillCdMax = after; }
      });
    }
  }

  if (!candidates.length) return null;

  if (mode === 'param') {
    const paramOnly = candidates.filter(x => x.kind === 'atkPlus' || x.kind === 'hpPlus' || x.kind === 'ctMinus');
    if (paramOnly.length) return randomChoice(paramOnly);
  }

  if (preferNewUnit) {
    const pick = candidates.find(x => x.kind === 'newUnit');
    if (pick) return pick;
  }

  return randomChoice(candidates);
}

/* =========================
   ステージ開始前：三択強化（ショップ式：複数購入/リロール）
========================= */

let money = 1000;                 // 初期貨幣
let rerollCost = 200;             // 選択肢リセット費用（200→400→800上限）
const upgradeCostCount = new Map(); // key -> 購入回数（費用倍増）

function getMoney(){ return money; }
function setMoney(v){
  money = Math.max(0, Math.floor(v||0));
  updateStatus();
}
function addMoney(v){
  setMoney(money + (v||0));
}

// 強化費用：最初は grade×200、同じ値を2回目以降は倍、上限 grade×800
function getUpgradeCost(grade, key){
  const base = grade * 200;
  const cap  = grade * 800;
  const n = upgradeCostCount.get(key) || 0; // 0回目=ベース
  const cost = Math.min(cap, base * (2 ** n));
  return { cost, nextN: n + 1, cap, base };
}
function bumpUpgradeCost(key){
  upgradeCostCount.set(key, (upgradeCostCount.get(key) || 0) + 1);
}

function getRerollCost(){ return rerollCost; }
function bumpRerollCost(){ rerollCost = Math.min(800, rerollCost * 2); }

function gradeOfUpgrade(core){
  const id = (core && (core.typeId ?? core.pickId ?? core.heroId));
  if (id != null) {
    const t = TYPE_BY_ID.get(id);
    return t ? (t.grade || 1) : 1;
  }
  return 1;
}
function costKeyOfUpgrade(core){
  // 費用の倍化は「ユニットごと × パラメータごと」に管理する
  // 例：同じユニットの重みは連続で倍化するが、別ユニットや別パラメータは初期価格から開始
  const side = core.side || 'player';
  const typeId = core.typeId || core.pickId || core.heroId || 'na';

  // kind -> parameter name mapping
  const kindParam = {
    weightPlus: 'weight',
    hpPlus: 'maxHp',
    atkPlus: 'atk',
    ctMinus: 'skillCdMax',
    newUnit: 'addUnit',
    newHero: 'recruitHero'
  };
  const param = core.param || kindParam[core.kind] || core.kind;

  return `u:${side}:${typeId}:${param}`;
}
function attachPrice(core){
  const grade = gradeOfUpgrade(core);
  const priceKey = costKeyOfUpgrade(core);
  const { cost } = getUpgradeCost(grade, priceKey);
  return { ...core, grade, priceKey, price: cost };
}

// 三択を作る（価格付き）
function makeUpgradeChoicesForShop(isFirstPickThisStage){
  // 初回強化の重み3倍ボーナスは削除（optsは通常）
  const opts = { mode:'any' };
  if (isFirstPickThisStage) opts.preferNewUnit = true;

  const arr = [
    attachPrice(makeUpgradeCore('player', opts)),
    attachPrice(makeUpgradeCore('player', opts)),
    attachPrice(makeUpgradeCore('player', opts)),
  ];

  // 重複しないように軽くリロール（最大数回）
  for(let i=0;i<6;i++){
    const keys = arr.map(x=>x.key);
    const dupIdx = keys.findIndex((k,idx)=>keys.indexOf(k)!==idx);
    if(dupIdx < 0) break;
    arr[dupIdx] = attachPrice(makeUpgradeCore('player', opts));
  }
  return arr;
}

let shopChoices = [];
let shopFirstPickFlag = true;

function ensureUpgradeFooter(){
  let footer = document.getElementById('upgradeFooter');
  if (footer) return footer;
  footer = document.createElement('div');
  footer.id = 'upgradeFooter';
  footer.style.marginTop = '10px';
  footer.style.display = 'flex';
  footer.style.gap = '8px';
  footer.style.justifyContent = 'center';
  footer.style.flexWrap = 'wrap';
  modal.appendChild(footer);
  return footer;
}

function renderUpgradeShop(){
  modalTitle.textContent = `ステージ${stage}：開始前の強化（所持金：${money}）`;

  // 選択肢
  choicesEl.innerHTML = '';
  shopChoices.forEach((c) => {
    const btn = document.createElement('button');
    btn.className = 'choice';

    const t = document.createElement('div');
    t.className = 'choiceTitle';
    t.textContent = c.title;

    const d = document.createElement('div');
    d.className = 'choiceDesc';
    d.textContent = c.desc;

    const p = document.createElement('div');
    p.className = 'choicePrice';

    if (c.purchased) {
      btn.disabled = true;
      btn.classList.add('purchased');
      p.textContent = '購入済み';
    } else {
      p.textContent = `費用：${c.price}（G${c.grade}）`;
      btn.addEventListener('click', () => buyUpgrade(c));
    }

    btn.appendChild(t);
    btn.appendChild(d);
    btn.appendChild(p);
    choicesEl.appendChild(btn);
  });

  // フッター（次へ / 選択肢リセット）
  const footer = ensureUpgradeFooter();
  footer.innerHTML = '';

  const nextBtn = document.createElement('button');
  nextBtn.className = 'choice';
  nextBtn.style.maxWidth = '220px';
  nextBtn.innerHTML = `<div class="choiceTitle">次へ</div><div class="choiceDesc">強化を終えて戦闘へ</div>`;
  nextBtn.addEventListener('click', () => {
    hideModal();
    finalizeStageStart();
  });

  const rrBtn = document.createElement('button');
  rrBtn.className = 'choice';
  rrBtn.style.maxWidth = '260px';
  rrBtn.innerHTML = `<div class="choiceTitle">選択肢リセット</div>
    <div class="choiceDesc">費用を払って3択を再抽選</div>
    <div class="choicePrice">費用：${getRerollCost()}</div>`;
  rrBtn.addEventListener('click', () => rerollShopChoices(true));

  footer.appendChild(nextBtn);
  footer.appendChild(rrBtn);

  modalBackdrop.style.display = 'flex';
}

function rerollShopChoices(isPaid){
  if (isPaid){
    const cost = getRerollCost();
    if (money < cost) {
      logSkill(`所持金不足：リセット費用 ${cost} が払えません（所持金 ${money}）`);
      flashMoney();
      return;
    }
    setMoney(money - cost);
    bumpRerollCost();
  }
  shopChoices = makeUpgradeChoicesForShop(shopFirstPickFlag);
  shopFirstPickFlag = false;
  renderUpgradeShop();
}

function buyUpgrade(choice){
  if (choice && choice.purchased) return;

  const cost = choice.price;
  if (money < cost) {
    logSkill(`所持金不足：強化費用 ${cost} が払えません（所持金 ${money}）`);
    flashMoney();
    return;
  }

  // 支払い＆費用テーブル更新
  setMoney(money - cost);
  bumpUpgradeCost(choice.priceKey);

  // この選択肢は購入済みにする（未購入の他選択肢は維持）
  choice.purchased = true;

  // 強化適用（ヒーロー加入は配置フェーズへ）
  applyUpgradeFromShop(choice, cost);

  // 通常強化の場合はショップを更新表示（選択肢を再抽選しない）
  if (choice.kind !== 'newHero') {
    renderUpgradeShop();
  }
}

function applyUpgradeFromShop(choice, paidCost){
  if (choice.kind === 'newHero') {
    const hid = choice.heroId ?? choice.typeId;
    // 加入だけ先に確定（配置後に盤面へ置く）
    heroRecruited.add(hid);

    // 配置完了後にショップへ戻す（選択肢は維持、再抽選しない）
    beginHeroPlacementFor(hid, {
      afterPlacement: () => {
        renderUpgradeShop();
      }
    });
    return;
  }

  // 通常強化を適用
  if (typeof choice.applyOnly === 'function') choice.applyOnly();
  else if (typeof choice.apply === 'function') choice.apply();

  logSkill(`【購入】${choice.title}（-${paidCost}）`);
}

function flashMoney(){
  updateStatus();
}

// ステージ開始前フロー：ショップを開く

function finalizeStageStart(){
  // ヒーロー加入済みだが未配置のものがあれば、配置フェーズへ
  const pending = [];
  heroRecruited.forEach((hid) => {
    if (!heroPlacements.has(hid)) pending.push(hid);
  });
  if (pending.length){
    // 複数ある場合は順に配置
    const chain = (idx) => {
      if (idx >= pending.length) {
        setupBattleBoard();
        return;
      }
      const hid = pending[idx];
      beginHeroPlacementFor(hid, () => chain(idx + 1));
    };
    chain(0);
    return;
  }
  setupBattleBoard();
}

function startStageFlow(isFirstPickThisStage=true){
  // ステージごとにリセット費用を初期化
  rerollCost = 200;
  shopFirstPickFlag = !!isFirstPickThisStage;
  shopChoices = makeUpgradeChoicesForShop(shopFirstPickFlag);
  rerollShopChoices(false);
}

/* =========================
   盤面サイズ適用
========================= */
function applySize(rows, cols) {
  ROWS = rows;
  COLS = cols;
  MAX_UNITS = ROWS * COLS * 2;

  buildBoard();

  logSkill(`【サイズ変更】${ROWS}×${COLS}`);
  // size change invalidates hero placements
  heroPlacements = new Map();
  heroRecruited = new Set();
  heroPlacingTypeId = null;
  heroPlacementResume = null;
  startStageFlow(true);
  updateStatus();
}

/* =========================
   ステータス
========================= */

function formatSkillMessage(msg) {
  if (!msg) return '---';
  // keep [成りX] but strip 【Xスキル】 prefix for readability
  return String(msg).replace(/^【[^】]+】/, '').trim();
}

function setGameMessage(text) {
  const msg = (text && String(text).trim()) ? String(text) : '---';
  // Prefer direct element reference (robust on iOS/Safari)
  if (typeof msgWinEl !== 'undefined' && msgWinEl) {
    const tEl = msgWinEl.querySelector('#msgWinText') || msgWinEl.querySelector('.text');
    if (tEl) { tEl.textContent = msg; return; }
  }
  const tEl2 = document.getElementById('msgWinText');
  if (tEl2) tEl2.textContent = msg;
}

function describeSkill(type, weak=false) {
  if (!type) return '---';
  const map = {
    poke: '突き（単体）',
    columnize: '展開（列化＋連携突き）',
    defenseField: '防衛陣地',
    supportField: 'スキル支援陣地',
    multi: '連撃（複数）',
    wide: '薙ぎ払い（横）',
    timedWide: weak ? '時限十字（弱）' : '時限十字',
    heal: '回復',
    flash: weak ? '閃光（弱）' : '閃光',
    tank: '防御態勢',
    bomb: '爆発',
    vamp: '吸収',
  };
  const name = type.symbol || type.name || '?';
  const s = type.skillId ? (map[type.skillId] || type.skillId) : '（スキルなし）';
  return `${name}：${s}`;
}

function updateEnergyHud() {
  const vEl = document.getElementById('energyValue');
  const posEl = document.getElementById('energyPos');
  const negEl = document.getElementById('energyNeg');
  if (vEl) vEl.textContent = `ENG: ${ENG}`;
  const clamp = (x)=>Math.max(0, Math.min(1, x));
  const pos = clamp(Math.max(0, ENG) / ENERGY_BAR_SCALE);
  const neg = clamp(Math.max(0, -ENG) / ENERGY_BAR_SCALE);
  if (posEl) posEl.style.width = `${pos * 50}%`;
  if (negEl) negEl.style.width = `${neg * 50}%`;
}

function updateStatus() {
  const enemyAlive = anyEnemyAlive() ? units.filter(u=>u.side==='enemy').length : 0;
  const bossText = isBossBattle() ? (bossExists() ? ` / BossHP:${boss.hp}/${boss.maxHp}` : ` / Boss:DEAD`) : '';
  statusEl.textContent = `Stage:${stage} / Battle:${battleCount}${isBossBattle()?'(BOSS)':''} / Turn:${turn} / Enemy:${enemyAlive}${bossText} / ENG:${ENG} / $:${money}`;
}

/* =========================
   リセット
========================= */
function hardResetAll() {
  logEl.textContent = '';
  stage = 1;
  battleCount = 1;
  rewardPicks = 1;
  boss = null;

  // 貨幣＆ショップ費用を初期化
  money = 1000;
  rerollCost = 200;
  upgradeCostCount.clear();

  setENG(0);
  initSideParamsToDefaults();

  heroPlacements = new Map();
  heroRecruited = new Set();
  heroPlacingTypeId = null;
  heroPlacementResume = null;

  logSkill('【リセット】強化を初期化してステージ1（戦闘1）から開始。');
  logSkill(`【初期】味方重み: ${summarizeWeights('player')}`);
  logSkill(`【初期】敵重み: ${summarizeWeights('enemy')} / (合計=${sumEnemyWeights()})`);

  startStageFlow(true);
}

/* =========================
   初期化
========================= */
function init() {
  logBuildInfo();
  initSideParamsToDefaults();
  buildBoard();

  // Message Window
  if (msgWinEl) {
    msgWinEl.innerHTML = `<div class="label">MESSAGE</div><div class="text" id="msgWinText">---</div>`;
  }
  setGameMessage('ユニットを選択してスキルを発動しよう！');

  // Energy HUD
  if (energyHudEl) {
    energyHudEl.innerHTML = `
      <div id="energyValue">ENG: 0</div>
      <div id="energyBarWrap">
        <div id="energyNeg" class="energyFill"></div>
        <div id="energyPos" class="energyFill"></div>
        <div id="energyZero"></div>
      </div>
      <div style="opacity:.75;">(−は赤 / ＋は緑)</div>
    `;
  }
  updateEnergyHud();


  resetBtn.addEventListener('click', hardResetAll);
  passBtn.addEventListener('click', doPass);
  if (autoBtn) autoBtn.addEventListener('click', () => {
    setAutoMode(!autoMode);
  });

  applySizeBtn.addEventListener('click', () => {
    const r = Math.max(4, Math.min(30, Number(rowsInput.value) || CONFIG.rows));
    const c = Math.max(4, Math.min(30, Number(colsInput.value) || CONFIG.cols));
    rowsInput.value = r;
    colsInput.value = c;
    applySize(r, c);
  });

  window.addEventListener('resize', () => requestAnimationFrame(updateCanvasSize));
  boardWrapperEl.addEventListener('scroll', () => drawEffects(), { passive: true });

  hardResetAll();
}

modalBackdrop.addEventListener('click', (e) => { e.stopPropagation(); });
window.addEventListener('DOMContentLoaded', init);
