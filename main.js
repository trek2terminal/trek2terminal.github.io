'use strict';

/* ── LOADER ─────────────────────────────── */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('out');
    // Fire hero animations
    document.querySelectorAll('.fade-hero').forEach(el => el.classList.add('on'));
    // Start counters
    animateCounters();
    // Start rotating subtitle
    startRotation();
  }, 1650);
});

/* ── THEME TOGGLE ───────────────────────── */
const themeBtn = document.getElementById('theme-toggle');
const root = document.documentElement;
function applyTheme(t) {
  root.setAttribute('data-theme', t);
  localStorage.setItem('theme', t);
  themeBtn.querySelector('.theme-icon').textContent = t === 'dark' ? '☾' : '☀';
}
themeBtn.addEventListener('click', () => {
  applyTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
});
// Apply saved theme icon on load
applyTheme(localStorage.getItem('theme') || 'dark');

/* ── NAVBAR SCROLL ──────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  updateActiveLink();
  toggleBTT();
}, { passive: true });

/* ── HAMBURGER ──────────────────────────── */
const burger = document.getElementById('hamburger');
const mob    = document.getElementById('mobile-menu');
burger.addEventListener('click', () => {
  const open = burger.classList.toggle('open');
  mob.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', open);
  mob.setAttribute('aria-hidden', !open);
  document.body.style.overflow = open ? 'hidden' : '';
});
document.querySelectorAll('.mob-link, .mob-cv').forEach(l => {
  l.addEventListener('click', () => {
    burger.classList.remove('open');
    mob.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    mob.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  });
});
document.addEventListener('click', e => {
  if (mob.classList.contains('open') &&
      !mob.contains(e.target) && !burger.contains(e.target)) {
    burger.classList.remove('open');
    mob.classList.remove('open');
    document.body.style.overflow = '';
  }
});

/* ── ACTIVE NAV LINK ────────────────────── */
function updateActiveLink() {
  document.querySelectorAll('section[id]').forEach(sec => {
    const top = sec.offsetTop - 100;
    const bot = top + sec.offsetHeight;
    const lnk = document.querySelector(`.nav-link[href="#${sec.id}"]`);
    if (lnk) lnk.classList.toggle('active', window.scrollY >= top && window.scrollY < bot);
  });
}

/* ── SCROLL FADE-UP ─────────────────────── */
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('on');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.10 });
document.querySelectorAll('.fade-up').forEach(el => io.observe(el));

/* ── COUNTER ANIMATION ──────────────────── */
function animateCounters() {
  document.querySelectorAll('.stat-num[data-target]').forEach(el => {
    const target = parseInt(el.dataset.target, 10);
    const dur = 1400;
    const start = Date.now();
    const timer = setInterval(() => {
      const p = Math.min((Date.now() - start) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(ease * target);
      if (p >= 1) {
        el.textContent = target;
        clearInterval(timer);
      }
    }, 16);
  });
}

/* ── ROTATING SUBTITLE ──────────────────── */
function startRotation() {
  const roles = [
    'AI/ML Engineer',
    'Data Enthusiast',
    'HPC-AI Graduate',
    'Python Developer',
    'Tech Problem Solver',
  ];
  const el = document.getElementById('rotating-role');
  if (!el) return;
  let i = 0;
  el.style.transition = 'opacity 0.3s ease';
  setInterval(() => {
    el.style.opacity = '0';
    setTimeout(() => {
      i = (i + 1) % roles.length;
      el.textContent = roles[i];
      el.style.opacity = '1';
    }, 320);
  }, 2800);
}

/* ── BACK TO TOP ────────────────────────── */
const btt = document.getElementById('btt');
function toggleBTT() {
  btt.classList.toggle('show', window.scrollY > 400);
}
btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ── SMOOTH SCROLL (with nav offset) ───── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) {
      e.preventDefault();
      window.scrollTo({
        top: t.getBoundingClientRect().top + window.scrollY - 72,
        behavior: 'smooth'
      });
    }
  });
});

/* ── CONTACT FORM ───────────────────────── */
const form = document.getElementById('contact-form');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const name    = document.getElementById('cf-name');
    const email   = document.getElementById('cf-email');
    const message = document.getElementById('cf-message');
    let ok = true;
    [name, email, message].forEach(f => {
      f.classList.remove('err');
      if (!f.value.trim()) { f.classList.add('err'); ok = false; }
    });
    if (email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      email.classList.add('err'); ok = false;
    }
    if (!ok) return;
    const sub  = encodeURIComponent(`Portfolio Inquiry from ${name.value}`);
    const body = encodeURIComponent(`Hi Subradeep,\n\n${message.value}\n\nFrom: ${name.value}\nEmail: ${email.value}`);
    window.location.href = `mailto:subradeepdas24@gmail.com?subject=${sub}&body=${body}`;
    const succ = document.getElementById('form-success');
    succ.classList.add('show');
    form.reset();
    setTimeout(() => succ.classList.remove('show'), 5000);
  });
  document.querySelectorAll('.form-in, .form-ta').forEach(f => {
    f.addEventListener('input', () => f.classList.remove('err'));
  });
}

/* ── FOOTER YEAR ────────────────────────── */
const yr = document.getElementById('yr');
if (yr) yr.textContent = new Date().getFullYear();
