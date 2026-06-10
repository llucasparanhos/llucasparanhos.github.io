/* ══════════════════════════════════════════
   main.js — Lucas de Castro Portfolio

   Sections:
   1. Page navigation (goTo, navScroll)
   2. Carousel (drag, touch, snap)
══════════════════════════════════════════ */

/* ── Navegação entre páginas ── */
const caseNames = {
  wellhub:      'Redesign Check-in / Wellhub',
  credenciados: 'Perfil Credenciados / Kivid',
  checkout:     'Checkout / Kivid',
  nps:          'Avaliação NPS / Kivid',
};

function goTo(page, caseId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + page).classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (page === 'case' && caseId) {
    document.querySelectorAll('[id^="case-"]').forEach(el => el.style.display = 'none');
    document.getElementById('case-' + caseId).style.display = 'block';
    document.getElementById('case-title-bar').textContent = caseNames[caseId] || '';
  }
}

function navScroll(id) {
  if (!document.getElementById('page-home').classList.contains('active')) {
    goTo('home');
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 80);
  } else {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }
}

/* ── Carousel ── */
const track  = document.getElementById('track');
const outer  = document.getElementById('c-outer');
const dotsEl = document.querySelectorAll('.dot');

let dragging = false, startX = 0, curX = 0;
let vel = 0, lastX = 0, lastT = 0, raf, moved = false;

const clamp  = (v,a,b) => Math.max(a, Math.min(b,v));
const getMax = ()      => Math.max(0, track.scrollWidth - outer.clientWidth);
const cw     = ()      => (track.children[0]?.offsetWidth || 280) + 14;

function setX(x, anim) {
  curX = clamp(x, 0, getMax());
  track.style.transition = anim ? 'transform .4s cubic-bezier(.4,0,.2,1)' : 'none';
  track.style.transform  = `translateX(-${curX}px)`;
  const idx = Math.min(Math.round(curX / cw()), dotsEl.length - 1);
  dotsEl.forEach((d,i) => d.classList.toggle('on', i===idx));
}
function snap() { setX(Math.round(curX / cw()) * cw(), true); }

/* mouse */
outer.addEventListener('mousedown', e => {
  dragging = true; moved = false;
  startX = e.clientX + curX; vel = 0; lastX = e.clientX; lastT = Date.now();
  cancelAnimationFrame(raf); e.preventDefault();
});
window.addEventListener('mousemove', e => {
  if (!dragging) return;
  const now = Date.now(), dt = now - lastT || 1;
  vel = (lastX - e.clientX) / dt; lastX = e.clientX; lastT = now;
  if (Math.abs(e.clientX - (startX - curX)) > 4) moved = true;
  setX(startX - e.clientX);
});
window.addEventListener('mouseup', () => {
  if (!dragging) return;
  dragging = false;
  let v = vel * 120;
  const go = () => { if (Math.abs(v) < .5) { snap(); return; } setX(curX + v); v *= .87; raf = requestAnimationFrame(go); };
  go();
});

/* click → open case (só se não arrastou) */
track.querySelectorAll('.card').forEach(card => {
  card.addEventListener('click', () => {
    if (moved) { moved = false; return; }
    const id = card.dataset.case;
    if (id) goTo('case', id);
  });
});

/* touch */
outer.addEventListener('touchstart', e => {
  startX = e.touches[0].clientX + curX; vel = 0;
  lastX = e.touches[0].clientX; lastT = Date.now();
  cancelAnimationFrame(raf);
}, { passive: true });
outer.addEventListener('touchmove', e => {
  const now = Date.now();
  vel = (lastX - e.touches[0].clientX) / (now - lastT || 1);
  lastX = e.touches[0].clientX; lastT = now;
  setX(startX - e.touches[0].clientX);
}, { passive: true });
outer.addEventListener('touchend', () => {
  let v = vel * 120;
  const go = () => { if (Math.abs(v) < .5) { snap(); return; } setX(curX + v); v *= .87; raf = requestAnimationFrame(go); };
  go();
});