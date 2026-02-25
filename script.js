lucide.createIcons();

document.addEventListener('selectstart', e => e.preventDefault());
document.addEventListener('copy', e => e.preventDefault());
document.addEventListener('contextmenu', e => e.preventDefault());
document.documentElement.style.userSelect = 'none';
document.documentElement.style.webkitUserSelect = 'none';

gsap.registerPlugin(ScrollTrigger);

const lenis = new Lenis({
  duration: 1.4,
  easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  wheelMultiplier: 0.9,
  touchMultiplier: 1.8,
});
gsap.ticker.add(time => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
lenis.on('scroll', ScrollTrigger.update);

document.querySelectorAll('[data-scroll-to]').forEach(el => {
  el.addEventListener('click', e => {
    e.preventDefault();
    const target = el.dataset.scrollTo;
    const ease = t => Math.min(1, 1.001 - Math.pow(2, -10 * t));
    if (target === 'top') {
      lenis.scrollTo(0, { duration: 1.6, easing: ease });
    } else {
      const section = document.getElementById(target);
      if (section) lenis.scrollTo(section, { offset: -60, duration: 1.6, easing: ease });
    }
    document.getElementById('hbg')?.classList.remove('open');
    document.getElementById('mmenu')?.classList.remove('open');
    document.body.style.overflow = '';
  });
});

function setupMarquee(id, speed, dir) {
  const track = document.getElementById(id);
  if (!track) return;
  const orig = Array.from(track.children);
  const passes = Math.ceil((window.innerWidth * 5) / Math.max(track.scrollWidth, 1)) + 4;
  for (let i = 0; i < passes; i++) orig.forEach(el => track.appendChild(el.cloneNode(true)));
  let x = dir < 0 ? 0 : -(track.scrollWidth / 2);
  gsap.ticker.add(() => {
    const half = track.scrollWidth / 2;
    x += dir * speed;
    if (dir < 0 && x <= -half) x += half;
    if (dir > 0 && x >= 0) x -= half;
    gsap.set(track, { x, force3D: true });
  });
}
window.addEventListener('load', () => {
  setupMarquee('mt1', 0.9, -1);
  setupMarquee('mt2', 0.9, 1);
});

(function () {
  const lc = document.getElementById('lc');
  const lb = document.getElementById('lb');
  const loader = document.getElementById('loader');
  let c = 0;
  setTimeout(() => lb.classList.add('go'), 80);
  const iv = setInterval(() => {
    lc.textContent = String(++c).padStart(3, '0');
    if (c >= 100) {
      clearInterval(iv);
      setTimeout(() => {
        gsap.to(loader, { yPercent: -100, duration: 1, ease: 'power4.inOut', onComplete: () => loader.remove() });
        gsap.from('.htitle .li', { yPercent: 110, stagger: 0.08, duration: 1, ease: 'power4.out', delay: 0.1 });
      }, 200);
    }
  }, 18);
})();

const cur = document.getElementById('cursor');
let cx = 0, cy = 0, mx = 0, my = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
(function animC() { cx += (mx - cx) * .12; cy += (my - cy) * .12; cur.style.left = cx + 'px'; cur.style.top = cy + 'px'; requestAnimationFrame(animC); })();
document.querySelectorAll('a,button,.card').forEach(el => {
  el.addEventListener('mouseenter', () => cur.classList.add('big'));
  el.addEventListener('mouseleave', () => cur.classList.remove('big'));
});

document.querySelectorAll('.mag').forEach(el => {
  el.addEventListener('mousemove', e => {
    const r = el.getBoundingClientRect();
    el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .25}px,${(e.clientY - r.top - r.height / 2) * .25}px)`;
  });
  el.addEventListener('mouseleave', () => { el.style.transform = ''; });
});

const hbg = document.getElementById('hbg');
const mm = document.getElementById('mmenu');
if (hbg) {
  hbg.addEventListener('click', () => {
    hbg.classList.toggle('open');
    mm.classList.toggle('open');
    document.body.style.overflow = mm.classList.contains('open') ? 'hidden' : '';
  });
}

const revealIO = new IntersectionObserver((entries) => {
  entries.forEach(en => {
    if (!en.isIntersecting) return;
    en.target.classList.add('vis');
    revealIO.unobserve(en.target);
  });
}, { threshold: 0, rootMargin: '0px 0px -60px 0px' });
document.querySelectorAll('.ru, .rl').forEach(el => revealIO.observe(el));

const statIO = new IntersectionObserver((entries) => {
  entries.forEach(en => {
    if (!en.isIntersecting) return;
    const cells = [...document.querySelectorAll('.sanim')];
    const i = cells.indexOf(en.target);
    setTimeout(() => en.target.classList.add('on'), i * 130);
    statIO.unobserve(en.target);
  });
}, { threshold: 0.1 });
document.querySelectorAll('.sanim').forEach(el => statIO.observe(el));

const vel = document.getElementById('svouching');
if (vel) {
  const vio = new IntersectionObserver(en => {
    if (!en[0].isIntersecting) return;
    let c = 0;
    const t = setInterval(() => { vel.textContent = ++c; if (c >= 5) clearInterval(t); }, 200);
    vio.unobserve(vel);
  }, { threshold: 0.5 });
  vio.observe(vel);
}

document.querySelectorAll('.skbf').forEach(bar => {
  ScrollTrigger.create({
    trigger: bar, start: 'top 85%', once: true,
    onEnter: () => { bar.style.width = bar.dataset.w + '%'; }
  });
});

const hNoise = document.querySelector('.hnoise');
const hGrid = document.querySelector('.hgrid');
lenis.on('scroll', ({ scroll }) => {
  if (hNoise) hNoise.style.transform = `translateY(${scroll * .3}px)`;
  if (hGrid) hGrid.style.transform = `translateY(${scroll * .15}px)`;
});
