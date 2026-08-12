// ============================================================
//  ASET SVG UNTUK WORKSHEET "AKU CINTA ISLAM"
//  Semua ikon flat & ramah anak. Adegan mewarnai pakai stroke
//  tebal agar mudah diwarnai anak.
// ============================================================

// ---------- Ikon instruksi kecil (stroke, currentColor) ----------
const ico = {
  write: `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h4L19 9l-4-4L4 16v4z"/><path d="M13.5 6.5l4 4"/></svg>`,
  cut: `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="6" cy="6" r="2.6"/><circle cx="6" cy="18" r="2.6"/><path d="M8.6 7.6L20 18M8.6 16.4L20 6"/></svg>`,
  color: `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3s6.2 7.2 6.2 11a6.2 6.2 0 0 1-12.4 0C5.8 10.2 12 3 12 3z"/><circle cx="12" cy="14.2" r="1.6" fill="currentColor" stroke="none"/></svg>`,
  match: `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="5" cy="6" r="2.4"/><circle cx="19" cy="18" r="2.4"/><path d="M7.2 7.2l9.6 9.6M5 9v3a4 4 0 0 0 4 4h3"/></svg>`,
  count: `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><text x="12" y="16.5" text-anchor="middle" font-size="11" font-weight="800" fill="currentColor" stroke="none" font-family="Nunito, Arial">123</text></svg>`,
  order: `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="4" width="6" height="6" rx="1.5"/><rect x="3" y="14" width="6" height="6" rx="1.5"/><path d="M12 7h9M12 17h9"/></svg>`,
  glue: `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="2.5" width="8" height="4" rx="1"/><path d="M9 6.5v4L5 20h14l-4-9.5V6.5"/></svg>`,
  find: `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="6"/><path d="M15 15l5 5"/></svg>`,
  star: `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"><path d="M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6L3.3 9.3l6.1-.7L12 3z"/></svg>`,
  drop: `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3s6.5 8 6.5 12.2a6.5 6.5 0 0 1-13 0C5.5 11 12 3 12 3z"/></svg>`
};

// ---------- Ikon besar tema (flat, filled) ----------
function bigMosque() {
  return `<svg class="big" viewBox="0 0 120 90" aria-hidden="true">
    <path fill="#c9a24a" d="M18 20h84l-6 52H24z"/>
    <path fill="#0f766e" d="M30 20h60l-4.5 52h-51z"/>
    <path fill="#f9f3e3" d="M38 33h44l-2.6 39h-38.8z"/>
    <path fill="#0f766e" d="M60 4c0 0-10 9-10 16a10 10 0 0 0 20 0c0-7-10-16-10-16z"/>
    <path fill="#c9a24a" d="M60 0l2 5h-4z"/>
    <path fill="#0f766e" d="M6 24h8v44H6zM106 24h8v44h-8z"/>
    <path fill="#c9a24a" d="M4 24h12v6H4zM104 24h12v6h-12z"/>
    <path fill="#f9f3e3" d="M60 34v-5"/><path fill="#0f766e" d="M50 52h20v14H50z"/>
    <path fill="#c9a24a" d="M46 72h28l-2 12H48z"/>
    <circle cx="10" cy="13" r="2.4" fill="#c9a24a"/><circle cx="110" cy="13" r="2.4" fill="#c9a24a"/>
  </svg>`;
}

function bigKaaba() {
  return `<svg class="big" viewBox="0 0 120 90" aria-hidden="true">
    <path fill="#f0e7d0" d="M12 72h96l-6 14H18z"/>
    <path fill="#2b3440" d="M30 16h60v56H30z"/>
    <rect x="30" y="34" width="60" height="10" fill="#c9a24a"/>
    <path fill="#c9a24a" d="M54 46h12v26H54z"/>
    <rect x="30" y="56" width="60" height="7" fill="#8a6d2f"/>
    <path fill="#4b5a68" d="M42 16h8v56h-8zM70 16h8v56h-8z"/>
    <path fill="#c9a24a" d="M60 4l2.4 5h-4.8z"/>
    <path fill="none" stroke="#c9a24a" stroke-width="2" stroke-linecap="round" d="M18 26c8 6 76 6 84 0M16 34c10 7 78 7 88 0"/>
  </svg>`;
}

function bigPrayer() {
  return `<svg class="big" viewBox="0 0 120 90" aria-hidden="true">
    <rect x="30" y="70" width="60" height="8" rx="4" fill="#c9a24a"/>
    <circle cx="60" cy="16" r="8" fill="#f4b183"/>
    <path fill="#0f766e" d="M60 26c-14 0-24 12-26 26l-4 26h60l-4-26c-2-14-12-26-26-26z"/>
    <path fill="#f4b183" d="M42 30l-16-6M78 30l16-6"/>
    <path fill="#0f766e" d="M34 40c0-8 6-14 14-16M86 40c0-8-6-14-14-16"/>
    <circle cx="60" cy="52" r="3" fill="#f9f3e3"/>
    <path fill="#c9a24a" d="M55 63h10v11H55z"/>
  </svg>`;
}

function bigMoonDates() {
  return `<svg class="big" viewBox="0 0 120 90" aria-hidden="true">
    <path fill="#c9a24a" d="M86 10a30 30 0 1 0 0 44 34 34 0 0 1-12-44 34 34 0 0 0 12 0z"/>
    <circle cx="26" cy="18" r="2.4" fill="#c9a24a"/><circle cx="34" cy="30" r="1.8" fill="#c9a24a"/>
    <circle cx="94" cy="52" r="2.2" fill="#c9a24a"/>
    <path fill="#0f766e" d="M20 46h26l-3 6h-20z"/>
    <ellipse cx="36" cy="62" rx="18" ry="9" fill="#f0e7d0"/>
    <ellipse cx="36" cy="58" rx="16" ry="7" fill="#8a5a2b"/>
    <ellipse cx="30" cy="57" rx="4" ry="2.6" fill="#6b4119"/>
    <ellipse cx="39" cy="55" rx="4" ry="2.6" fill="#6b4119"/>
    <ellipse cx="34" cy="61" rx="4" ry="2.6" fill="#6b4119"/>
    <ellipse cx="43" cy="60" rx="3.4" ry="2.2" fill="#6b4119"/>
  </svg>`;
}

function bigCoins() {
  return `<svg class="big" viewBox="0 0 120 90" aria-hidden="true">
    <circle cx="46" cy="46" r="20" fill="#c9a24a"/>
    <circle cx="46" cy="46" r="15" fill="#e6c878"/>
    <text x="46" y="51" text-anchor="middle" font-size="15" font-weight="800" fill="#8a6d2f" font-family="Nunito, Arial">Z</text>
    <circle cx="76" cy="56" r="16" fill="#d8b55c"/>
    <circle cx="76" cy="56" r="12" fill="#eed48a"/>
    <text x="76" y="60" text-anchor="middle" font-size="12" font-weight="800" fill="#8a6d2f" font-family="Nunito, Arial">Z</text>
    <circle cx="62" cy="30" r="12" fill="#b8913c"/>
    <circle cx="62" cy="30" r="9" fill="#dcc26e"/>
    <path fill="#0f766e" d="M14 74h92l-4 10H18z"/>
    <path fill="#f4b183" d="M22 64h12v12H22zM86 64h12v12H86z"/>
  </svg>`;
}

function bigHeart() {
  return `<svg class="big" viewBox="0 0 120 90" aria-hidden="true">
    <path fill="#e07a5f" d="M60 78S18 52 18 33c0-12 9-20 20-20 8 0 15 4 22 12 7-8 14-12 22-12 11 0 20 8 20 20 0 19-42 45-42 45z"/>
    <path fill="#f9f3e3" d="M60 30l3.2 6.8 7.4 1-5.3 5.3 1.3 7.4-6.6-3.6-6.6 3.6 1.3-7.4-5.3-5.3 7.4-1z"/>
  </svg>`;
}

function bigDrop() {
  return `<svg class="big" viewBox="0 0 120 90" aria-hidden="true">
    <path fill="#3b82c4" d="M60 8s28 34 28 50a28 28 0 0 1-56 0c0-16 28-50 28-50z"/>
    <path fill="#bfe0f5" d="M60 24s16 21 16 31a16 16 0 0 1-32 0c0-10 16-31 16-31z"/>
    <circle cx="60" cy="66" r="3" fill="#1d5f94"/>
  </svg>`;
}

function bigSyahadat() {
  return `<svg class="big" viewBox="0 0 120 90" aria-hidden="true">
    <path fill="#f9f3e3" d="M60 6a26 26 0 0 1 26 26v22c0 14-11 26-26 26s-26-12-26-26V32a26 26 0 0 1 26-26z"/>
    <path fill="#0f766e" d="M60 12a20 20 0 0 1 20 20v22c0 11-9 20-20 20s-20-9-20-20V32a20 20 0 0 1 20-20z"/>
    <path fill="#c9a24a" d="M60 24l2.8 6 6.4.8-4.6 4.5 1.1 6.4L60 39l-5.7 3.2 1.1-6.4-4.6-4.5 6.4-.8z"/>
    <circle cx="96" cy="20" r="3" fill="#c9a24a"/><circle cx="12" cy="30" r="2.4" fill="#c9a24a"/>
    <circle cx="100" cy="52" r="2" fill="#c9a24a"/><circle cx="20" cy="66" r="2.2" fill="#c9a24a"/>
  </svg>`;
}

function bigBook() {
  return `<svg class="big" viewBox="0 0 120 90" aria-hidden="true">
    <path fill="#0f766e" d="M12 18c14-4 30 0 48 8v52c-18-8-34-12-48-8z"/>
    <path fill="#115e59" d="M108 18c-14-4-30 0-48 8v52c18-8 34-12 48-8z"/>
    <path fill="#c9a24a" d="M60 26v52"/>
    <path fill="#f9f3e3" d="M26 30h20v6H26zM26 42h20v6H26zM26 54h14v6H26z"/>
    <path fill="#f9f3e3" d="M74 30h20v6H74zM74 42h20v6H74zM74 54h14v6H74z"/>
  </svg>`;
}

function bigDoor() {
  return `<svg class="big" viewBox="0 0 120 90" aria-hidden="true">
    <rect x="30" y="10" width="60" height="66" rx="6" fill="#b8913c"/>
    <rect x="36" y="16" width="48" height="54" rx="4" fill="#0f766e"/>
    <path fill="#f9f3e3" d="M52 20h16v8H52z"/>
    <circle cx="76" cy="46" r="2.6" fill="#c9a24a"/>
    <path fill="#115e59" d="M52 46h16v30H52z"/>
    <rect x="30" y="76" width="60" height="8" rx="3" fill="#8a6d2f"/>
    <path fill="#c9a24a" d="M60 2l2.4 5h-4.8z"/>
  </svg>`;
}

// ---------- Adegan mewarnai (stroke tebal, tanpa isi) ----------
function sceneMasjid() {
  return `<svg class="scene" viewBox="0 0 300 190" fill="none" stroke="#3a4a4a" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
    <path d="M60 150h180l-8 26H68z"/>
    <path d="M80 150V72h140v78"/>
    <path d="M100 96h100l-6 54h-88z"/>
    <path d="M150 22c0 0-14 13-14 22a14 14 0 0 0 28 0c0-9-14-22-14-22z"/>
    <path d="M150 16l3 6h-6z"/>
    <path d="M30 150V96h16v54M254 150V96h16v54"/>
    <path d="M26 96h24v8H26zM250 96h24v8h-24z"/>
    <circle cx="40" cy="40" r="3"/><circle cx="60" cy="24" r="2.4"/><circle cx="250" cy="36" r="3"/>
    <circle cx="232" cy="22" r="2.4"/><circle cx="270" cy="60" r="2.2"/>
    <path d="M150 34v-6M140 52h20v34h-20z"/>
    <path d="M262 150h30M8 150h30"/>
  </svg>`;
}

function sceneIftar() {
  return `<svg class="scene" viewBox="0 0 300 190" fill="none" stroke="#3a4a4a" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
    <path d="M30 150h240l-8 24H38z"/>
    <path d="M60 150v-34c0-30 24-54 54-54h72c30 0 54 24 54 54v34"/>
    <path d="M114 62c0-8 7-14 15-14"/>
    <path d="M80 150v-20M100 150v-26M200 150v-26M220 150v-20"/>
    <path d="M120 118a30 30 0 0 1 60 0"/>
    <path d="M126 118h48l-4 18h-40z"/>
    <ellipse cx="150" cy="150" rx="34" ry="10"/>
    <path d="M136 140a7 7 0 0 1 14 0M150 138a7 7 0 0 1 14 0M128 146a6 6 0 0 1 12 0M160 145a6 6 0 0 1 12 0"/>
    <path d="M222 60c-8-4-14-10-16-18 8 4 14 10 16 18z"/>
    <path d="M228 66c-9-3-16-9-19-17 9 3 16 9 19 17z"/>
    <path d="M228 66l10-6M222 60l-12-5"/>
    <path d="M40 30c12-6 20-14 24-24 12 6 20 14 24 24-12 6-20 14-24 24-4-10-12-18-24-24z"/>
    <circle cx="262" cy="34" r="3"/><circle cx="246" cy="52" r="2.4"/>
  </svg>`;
}

function sceneSedekah() {
  return `<svg class="scene" viewBox="0 0 300 190" fill="none" stroke="#3a4a4a" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
    <path d="M40 150h220l-6 24H46z"/>
    <path d="M80 150v-36a60 60 0 0 1 120 0v36"/>
    <path d="M150 150v-26"/>
    <path d="M150 30v24M138 42h24"/>
    <circle cx="150" cy="58" r="6"/>
    <path d="M150 66c-14 0-24 10-26 24h52c-2-14-12-24-26-24z"/>
    <path d="M100 150v-24c0-12 8-22 20-24M200 150v-24c0-12-8-22-20-24"/>
    <path d="M120 150v-20M180 150v-20"/>
    <circle cx="150" cy="116" r="8"/>
    <path d="M150 126v8"/>
    <circle cx="150" cy="140" r="3.4"/>
    <path d="M66 150v-12M234 150v-12"/>
    <circle cx="60" cy="30" r="3"/><circle cx="240" cy="30" r="3"/><circle cx="240" cy="52" r="2.4"/>
    <path d="M258 80c-6-2-11-6-13-11 6 2 11 6 13 11z"/>
  </svg>`;
}

function sceneKaaba() {
  return `<svg class="scene" viewBox="0 0 300 190" fill="none" stroke="#3a4a4a" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
    <path d="M40 150h220l-8 24H48z"/>
    <path d="M70 150V60h160v90"/>
    <path d="M150 150V36"/>
    <rect x="70" y="96" width="160" height="22"/>
    <path d="M130 118v32M170 118v32"/>
    <path d="M110 60h8v90h-8zM182 60h8v90h-8z"/>
    <path d="M150 26l4 8h-8z"/>
    <path d="M120 150v-16c0-12 8-22 20-24M180 150v-16c0-12-8-22-20-24"/>
    <path d="M96 150v-12M204 150v-12"/>
    <circle cx="60" cy="36" r="3"/><circle cx="240" cy="36" r="3"/><circle cx="52" cy="58" r="2.4"/><circle cx="248" cy="58" r="2.4"/>
    <path d="M52 44v-8M64 44v-8M236 44v-8M248 44v-8"/>
  </svg>`;
}

// ---------- Maze generator (recursive backtracker, seed tetap) ----------
function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function generateMaze(cols, rows, seed) {
  const rnd = mulberry32(seed);
  const cells = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      cells.push({ r, c, walls: { N: true, S: true, E: true, W: true }, visited: false });
    }
  }
  const key = (r, c) => r * cols + c;
  const at = (r, c) => (r < 0 || c < 0 || r >= rows || c >= cols ? null : cells[key(r, c)]);
  const stack = [cells[0]];
  cells[0].visited = true;
  while (stack.length) {
    const cur = stack[stack.length - 1];
    const neighbors = [];
    const dirs = [
      { d: 'N', dr: -1, dc: 0, opp: 'S' },
      { d: 'S', dr: 1, dc: 0, opp: 'N' },
      { d: 'E', dr: 0, dc: 1, opp: 'W' },
      { d: 'W', dr: 0, dc: -1, opp: 'E' }
    ];
    for (const dir of dirs) {
      const nb = at(cur.r + dir.dr, cur.c + dir.dc);
      if (nb && !nb.visited) neighbors.push({ nb, dir });
    }
    if (neighbors.length) {
      const { nb, dir } = neighbors[Math.floor(rnd() * neighbors.length)];
      cur.walls[dir.d] = false;
      nb.walls[dir.opp] = false;
      nb.visited = true;
      stack.push(nb);
    } else {
      stack.pop();
    }
  }
  return { cells, cols, rows };
}

function mazeSvg({ cols, rows, seed, cell = 34, ox = 24, oy = 26, start = { r: 0, c: 0 }, goal, goalIcon = 'mosque' }) {
  const { cells } = generateMaze(cols, rows, seed);
  const w = cols * cell;
  const h = rows * cell;
  const goalCell = goal || { r: rows - 1, c: cols - 1 };
  let walls = '';
  cells.forEach((cellData) => {
    const x = ox + cellData.c * cell;
    const y = oy + cellData.r * cell;
    if (cellData.walls.N) walls += `<line x1="${x}" y1="${y}" x2="${x + cell}" y2="${y}"/>`;
    if (cellData.walls.S) walls += `<line x1="${x}" y1="${y + cell}" x2="${x + cell}" y2="${y + cell}"/>`;
    if (cellData.walls.W) walls += `<line x1="${x}" y1="${y}" x2="${x}" y2="${y + cell}"/>`;
    if (cellData.walls.E) walls += `<line x1="${x + cell}" y1="${y}" x2="${x + cell}" y2="${y + cell}"/>`;
  });
  const sx = ox + start.c * cell + cell / 2;
  const sy = oy + start.r * cell + cell / 2;
  const gx = ox + goalCell.c * cell + cell / 2;
  const gy = oy + goalCell.r * cell + cell / 2;
  const totalW = w + ox * 2;
  const totalH = h + oy * 2;
  const goalSvg = goalIcon === 'kaaba'
    ? `<g transform="translate(${gx - 20} ${gy - 22})">
        <rect x="6" y="10" width="28" height="32" rx="2" fill="#2b3440" stroke="#a8761f" stroke-width="2"/>
        <rect x="6" y="22" width="28" height="5" fill="#c9a24a" stroke="#a8761f" stroke-width="1.5"/>
        <rect x="16" y="27" width="8" height="15" fill="#c9a24a" stroke="#a8761f" stroke-width="1.5"/>
        <path d="M20 4l3 5h-6z" fill="#f2c14e" stroke="#a8761f" stroke-width="2"/>
        <rect x="4" y="42" width="32" height="5" rx="2" fill="#d8b55c" stroke="#a8761f" stroke-width="1.5"/>
      </g>`
    : `<g transform="translate(${gx - 22} ${gy - 24})">
        <path fill="#f2c14e" stroke="#a8761f" stroke-width="3" d="M20 16c-8 0-12 6-13 14l-7 22h40l-7-22c-1-8-5-14-13-14z"/>
        <path d="M20 6c0 0-4 3-4 6a4 4 0 0 0 8 0c0-3-4-6-4-6z"/>
        <path d="M20 3l1.5 3h-3z"/>
      </g>`;
  return `<svg class="maze" viewBox="0 0 ${totalW} ${totalH}" fill="none" stroke="#3a4a4a" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">
    <rect x="${ox - 14}" y="${oy - 14}" width="${w + 28}" height="${h + 28}" rx="18" stroke="#0f766e" stroke-width="3.5" stroke-dasharray="10 7"/>
    <circle cx="${sx}" cy="${sy}" r="11" fill="#f2c14e" stroke="#a8761f" stroke-width="3"/>
    <path d="M${sx} ${sy - 4}l3.4 3.4-3.4 3.4-3.4-3.4z" fill="#a8761f" stroke="none"/>
    ${walls}
    ${goalSvg}
  </svg>`;
}

module.exports = { ico, bigMosque, bigKaaba, bigPrayer, bigMoonDates, bigCoins, bigHeart, bigDrop, bigSyahadat, bigBook, bigDoor, sceneMasjid, sceneIftar, sceneSedekah, sceneKaaba, mazeSvg };
