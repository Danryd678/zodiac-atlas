import * as THREE from 'three';

/* Change this to the inbox that should receive consultation questions. */
const CONSULT_EMAIL = 'hello@danielryder.freeddns.org';

const SIGNS = [
  { name:'ARIES', glyph:'♈', dates:'MAR 21 – APR 19', element:'FIRE', color:'#e5484d',
    blurb:'The spark that starts the fire.',
    stars:[[-2,1],[-1,0.3],[0,-0.2],[1,-0.5],[2,-0.3],[1.2,0.8]],
    lines:[[0,1],[1,2],[2,3],[3,4],[2,5]] },
  { name:'TAURUS', glyph:'♉', dates:'APR 20 – MAY 20', element:'EARTH', color:'#f76b15',
    blurb:'Strength that does not hurry.',
    stars:[[-2,1.5],[-1.2,0.5],[-0.4,-0.3],[0.6,-0.5],[1.6,-0.2],[2.2,0.8],[-0.4,1.2]],
    lines:[[0,1],[1,2],[2,3],[3,4],[4,5],[2,6]] },
  { name:'GEMINI', glyph:'♊', dates:'MAY 21 – JUN 20', element:'AIR', color:'#ffd60a',
    blurb:'Two minds, one constellation.',
    stars:[[-1.5,1.5],[-1.5,0],[-1.5,-1.5],[1.5,1.5],[1.5,0],[1.5,-1.5],[-0.5,0.5],[0.5,-0.5]],
    lines:[[0,1],[1,2],[3,4],[4,5],[1,6],[6,7],[7,4]] },
  { name:'CANCER', glyph:'♋', dates:'JUN 21 – JUL 22', element:'WATER', color:'#7dd3fc',
    blurb:'The tide that remembers.',
    stars:[[-1,0.5],[0,1],[1,0.5],[0.5,-0.5],[-0.5,-0.5],[0,0]],
    lines:[[0,5],[1,5],[2,5],[3,5],[4,5]] },
  { name:'LEO', glyph:'♌', dates:'JUL 23 – AUG 22', element:'FIRE', color:'#ff9f1c',
    blurb:'The heart that leads the pride.',
    stars:[[-2,1],[-1,1.2],[0,0.8],[0.5,0],[1.5,-0.5],[2,-1.2],[0.5,-1],[-0.5,-0.8]],
    lines:[[0,1],[1,2],[2,3],[3,4],[4,5],[3,6],[6,7]] },
  { name:'VIRGO', glyph:'♍', dates:'AUG 23 – SEP 22', element:'EARTH', color:'#4ade80',
    blurb:'The harvest in the stars.',
    stars:[[-2,-1],[-1,0],[0,1],[1,0.5],[2,-0.5],[1,-1.5],[-1,-1.5]],
    lines:[[0,1],[1,2],[2,3],[3,4],[1,6],[4,5]] },
  { name:'LIBRA', glyph:'♎', dates:'SEP 23 – OCT 22', element:'AIR', color:'#a78bfa',
    blurb:'Balance, weighed in starlight.',
    stars:[[-2,0.5],[-1,0.5],[0,0.5],[1,0.5],[2,0.5],[-1,-1],[1,-1]],
    lines:[[0,1],[1,2],[2,3],[3,4],[1,5],[3,6]] },
  { name:'SCORPIO', glyph:'♏', dates:'OCT 23 – NOV 21', element:'WATER', color:'#2dd4bf',
    blurb:'The sting at the end of the tail.',
    stars:[[-2,1.5],[-1.5,1],[-1,0.3],[-0.8,-0.5],[-0.3,-1],[0.5,-1.3],[1.3,-1],[1.8,-0.4],[1.5,0.3]],
    lines:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8]] },
  { name:'SAGITTARIUS', glyph:'♐', dates:'NOV 22 – DEC 21', element:'FIRE', color:'#60a5fa',
    blurb:'The arrow aimed at tomorrow.',
    stars:[[-2,-1],[-1,-0.3],[0,0.3],[1,1],[2,1.8],[0.8,0.2],[1.6,-0.6]],
    lines:[[0,1],[1,2],[2,3],[3,4],[2,5],[5,6]] },
  { name:'CAPRICORN', glyph:'♑', dates:'DEC 22 – JAN 19', element:'EARTH', color:'#c084fc',
    blurb:'The climb, one star at a time.',
    stars:[[-2,0.5],[-1,1],[0,0.8],[1,0.2],[2,-0.5],[1,-1],[-1,-1]],
    lines:[[0,1],[1,2],[2,3],[3,4],[4,5],[0,6],[5,6]] },
  { name:'AQUARIUS', glyph:'♒', dates:'JAN 20 – FEB 18', element:'AIR', color:'#818cf8',
    blurb:'Water poured from the sky.',
    stars:[[-2,0.8],[-1,0.2],[0,0.8],[1,0.2],[2,0.8],[-1.5,-1],[0,-1.2],[1.5,-1]],
    lines:[[0,1],[1,2],[2,3],[3,4],[5,6],[6,7]] },
  { name:'PISCES', glyph:'♓', dates:'FEB 19 – MAR 20', element:'WATER', color:'#f472b6',
    blurb:'Two fish, one tide.',
    stars:[[-2,1],[-1,0.5],[-0.5,-0.5],[0.5,-1],[1.5,-0.5],[2,0.5],[0,0]],
    lines:[[0,1],[1,6],[6,2],[2,3],[3,4],[4,5]] },
];

/* ---------- sign grid ---------- */
const grid = document.getElementById('signGrid');
let selected = 7; // Scorpio, like the reference hero

SIGNS.forEach((s, i) => {
  const card = document.createElement('div');
  card.className = 'card' + (i === selected ? ' selected' : '');
  card.innerHTML =
    '<div class="g" style="color:' + s.color + ';border-color:' + s.color + '55;background:' + s.color + '14">' + s.glyph + '</div>' +
    '<h3>' + s.name + '</h3><p>' + s.element + '</p><p>' + s.dates + '</p>';
  card.addEventListener('click', () => selectSign(i));
  grid.appendChild(card);
});

/* ---------- three.js viewer ---------- */
const canvas = document.getElementById('sky');
let renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias:true, alpha:true });
} catch(e) {
  canvas.parentElement.innerHTML = '<p class="lede" style="padding:40px">WebGL is not available on this device, so the 3D sky cannot render. The sign guide below still works.</p>';
  throw e;
}
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 200);
const CAM_HOME = new THREE.Vector3(0, 0.6, 8.5);
camera.position.copy(CAM_HOME);
camera.lookAt(0, 0, 0);

function sizeRenderer(){
  const w = canvas.clientWidth, h = canvas.clientHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}
sizeRenderer();
window.addEventListener('resize', sizeRenderer);

/* starfield */
(function starfield(){
  const N = 1400, pos = new Float32Array(N * 3);
  for (let i = 0; i < N; i++){
    const r = 25 + Math.random() * 45;
    const t = Math.random() * Math.PI * 2;
    const p = Math.acos(2 * Math.random() - 1);
    pos[i*3]   = r * Math.sin(p) * Math.cos(t);
    pos[i*3+1] = r * Math.sin(p) * Math.sin(t);
    pos[i*3+2] = r * Math.cos(p);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  scene.add(new THREE.Points(g, new THREE.PointsMaterial({
    color:0xcfd8ff, size:0.14, sizeAttenuation:true, transparent:true, opacity:0.85
  })));
})();

/* orbit rings */
const rings = new THREE.Group();
[[4.6, 0.5, 0.2],[5.4, -0.35, 1.1]].forEach(([r, tx, tz]) => {
  const pts = [];
  for (let i = 0; i <= 128; i++){
    const a = (i / 128) * Math.PI * 2;
    pts.push(new THREE.Vector3(Math.cos(a) * r, 0, Math.sin(a) * r));
  }
  const ring = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(pts),
    new THREE.LineBasicMaterial({ color:0xc9724b, transparent:true, opacity:0.35 })
  );
  ring.rotation.x = tx; ring.rotation.z = tz;
  rings.add(ring);
});
scene.add(rings);

/* constellation */
const sky = new THREE.Group();
scene.add(sky);

function buildConstellation(sign){
  while (sky.children.length) {
    const c = sky.children.pop();
    c.geometry && c.geometry.dispose();
    c.material && c.material.dispose();
  }
  const col = new THREE.Color(sign.color);
  const pts = sign.stars.map(([x, y]) =>
    new THREE.Vector3(x, y, (Math.sin(x * 3.1) + Math.cos(y * 2.3)) * 0.25));
  const pg = new THREE.BufferGeometry().setFromPoints(pts);
  sky.add(new THREE.Points(pg, new THREE.PointsMaterial({
    color:col, size:0.22, sizeAttenuation:true
  })));
  /* halo */
  sky.add(new THREE.Points(pg.clone(), new THREE.PointsMaterial({
    color:col, size:0.55, sizeAttenuation:true, transparent:true, opacity:0.25
  })));
  const lg = new THREE.BufferGeometry();
  const lp = [];
  sign.lines.forEach(([a, b]) => { lp.push(pts[a], pts[b]); });
  lg.setFromPoints(lp);
  sky.add(new THREE.LineSegments(lg, new THREE.LineBasicMaterial({
    color:col, transparent:true, opacity:0.55
  })));
}

/* ---------- selection + ui ---------- */
const sectorLabel = document.getElementById('sectorLabel');
const badgeGlyph = document.getElementById('badgeGlyph');
const badgeName = document.getElementById('badgeName');
const badgeElem = document.getElementById('badgeElem');
const orbitLabel = document.getElementById('orbitLabel');
const orbitFill = document.getElementById('orbitFill');

function selectSign(i){
  selected = i;
  const s = SIGNS[i];
  document.querySelectorAll('.card').forEach((c, j) =>
    c.classList.toggle('selected', j === i));
  const num = String(i + 1).padStart(2, '0');
  sectorLabel.textContent = 'SECTOR ' + num + ' / ' + s.name;
  badgeGlyph.textContent = s.glyph;
  badgeGlyph.style.borderColor = s.color + '88';
  badgeGlyph.style.background = s.color + '22';
  badgeName.textContent = s.name;
  badgeElem.textContent = s.element + ' · ' + s.dates;
  orbitLabel.textContent = 'ORBIT ' + num + ' / 12';
  orbitFill.style.width = ((i + 1) / 12 * 100) + '%';
  buildConstellation(s);
}
selectSign(selected);

/* ---------- controls ---------- */
let paused = false, ambienceOn = false, audio = null;
const btnPause = document.getElementById('btnPause');
const btnAmbience = document.getElementById('btnAmbience');
const btnReset = document.getElementById('btnReset');

btnPause.addEventListener('click', () => {
  paused = !paused;
  btnPause.textContent = paused ? 'RESUME' : 'PAUSE';
  btnPause.classList.toggle('on', paused);
});
btnReset.addEventListener('click', () => {
  camera.position.copy(CAM_HOME);
  camera.lookAt(0, 0, 0);
  sky.rotation.set(0, 0, 0);
});

function startAmbience(){
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const gain = ctx.createGain();
  gain.gain.value = 0.0;
  gain.connect(ctx.destination);
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass'; filter.frequency.value = 420;
  filter.connect(gain);
  [55, 55.4, 110.2].forEach(f => {
    const o = ctx.createOscillator();
    o.type = 'sine'; o.frequency.value = f;
    o.connect(filter); o.start();
  });
  gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 4);
  return { ctx, gain };
}
btnAmbience.addEventListener('click', () => {
  ambienceOn = !ambienceOn;
  btnAmbience.textContent = ambienceOn ? 'AMBIENCE ON' : 'AMBIENCE OFF';
  btnAmbience.classList.toggle('on', ambienceOn);
  if (ambienceOn && !audio) audio = startAmbience();
  if (audio) {
    if (ambienceOn) { audio.ctx.resume(); audio.gain.gain.linearRampToValueAtTime(0.05, audio.ctx.currentTime + 2); }
    else audio.gain.gain.linearRampToValueAtTime(0.0, audio.ctx.currentTime + 1);
  }
});

/* ---------- loop ---------- */
const clock = new THREE.Clock();
(function tick(){
  requestAnimationFrame(tick);
  const dt = clock.getDelta();
  if (!paused){
    sky.rotation.y += dt * 0.12;
    rings.rotation.y -= dt * 0.02;
  }
  renderer.render(scene, camera);
})();

/* ---------- consult form ---------- */
document.getElementById('consultForm').addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('fName').value.trim();
  const email = document.getElementById('fEmail').value.trim();
  const q = document.getElementById('fQuestion').value.trim();
  const subject = encodeURIComponent('Constellation question from ' + name);
  const body = encodeURIComponent(q + '\n\n— ' + name + ' (' + email + ')');
  window.location.href = 'mailto:' + CONSULT_EMAIL + '?subject=' + subject + '&body=' + body;
  document.getElementById('formNote').textContent =
    'Opening your mail app to send the question…';
});
