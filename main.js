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
const themeMeta = document.querySelector('meta[name="theme-color"]');
function applyTheme(t) {
  const next = t === 'light' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  try {
    localStorage.setItem('theme', next);
  } catch (e) {}
  if (themeMeta) {
    themeMeta.setAttribute('content', next === 'dark' ? '#070d1a' : '#f7fbff');
  }
  const themeUse = themeBtn.querySelector('.theme-icon use');
  if (themeUse) themeUse.setAttribute('href', next === 'dark' ? '#icon-moon' : '#icon-sun');
}
themeBtn.addEventListener('click', () => {
  applyTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
});
// Apply saved theme icon on load
let savedTheme = 'dark';
try {
  const saved = localStorage.getItem('theme');
  if (saved === 'light' || saved === 'dark') savedTheme = saved;
} catch (e) {}
applyTheme(savedTheme);

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
    'Technical Project Coordinator',
    'ML Systems Builder',
    'Data Science Practitioner',
    'HPC-AI Graduate',
    'Python + TensorFlow Developer',
    'Research-to-Delivery Thinker',
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
  const formFields = document.querySelectorAll('.form-in, .form-ta');
  const typingState = document.getElementById('typing-state');
  const messageCount = document.getElementById('message-count');
  const lastLengths = new WeakMap();
  const timers = new WeakMap();

  function updateComposerState(mode = '') {
    const hasDraft = Array.from(formFields).some(f => f.value.trim());
    form.classList.toggle('is-composing', hasDraft || mode === 'typing' || mode === 'deleting');
    form.classList.toggle('is-typing', mode === 'typing');
    form.classList.toggle('is-deleting', mode === 'deleting');
    if (!typingState) return;
    if (mode === 'typing') typingState.textContent = 'Typing...';
    else if (mode === 'deleting') typingState.textContent = 'Editing...';
    else if (hasDraft) typingState.textContent = 'Draft in progress';
    else typingState.textContent = 'Ready when you are';
  }

  function resetFieldMotion(field) {
    const wrap = field.closest('.smart-field');
    if (!wrap) return;
    wrap.classList.remove('is-typing', 'is-deleting');
    wrap.classList.toggle('has-value', !!field.value.trim());
  }

  formFields.forEach(field => {
    lastLengths.set(field, field.value.length);
    field.addEventListener('focus', () => {
      field.closest('.smart-field')?.classList.add('is-active');
      updateComposerState(field.value ? '' : 'typing');
    });
    field.addEventListener('blur', () => {
      field.closest('.smart-field')?.classList.remove('is-active');
      resetFieldMotion(field);
      updateComposerState();
    });
    field.addEventListener('input', () => {
      field.classList.remove('err');
      const wrap = field.closest('.smart-field');
      const prev = lastLengths.get(field) || 0;
      const now = field.value.length;
      const mode = now < prev ? 'deleting' : 'typing';
      lastLengths.set(field, now);
      if (messageCount && field.id === 'cf-message') {
        messageCount.textContent = now;
      }
      if (wrap) {
        wrap.classList.remove('is-typing', 'is-deleting');
        void wrap.offsetWidth;
        wrap.classList.add(mode === 'deleting' ? 'is-deleting' : 'is-typing');
        wrap.classList.toggle('has-value', !!field.value.trim());
      }
      updateComposerState(mode);
      clearTimeout(timers.get(field));
      timers.set(field, setTimeout(() => {
        resetFieldMotion(field);
        updateComposerState();
      }, mode === 'deleting' ? 460 : 720));
    });
  });

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
    formFields.forEach(f => {
      lastLengths.set(f, 0);
      resetFieldMotion(f);
    });
    if (messageCount) messageCount.textContent = '0';
    updateComposerState();
    setTimeout(() => succ.classList.remove('show'), 5000);
  });
}

/* ── FOOTER YEAR ────────────────────────── */
const yr = document.getElementById('yr');
if (yr) yr.textContent = new Date().getFullYear();
