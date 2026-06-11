'use strict';

const root = document.documentElement;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const loader = document.getElementById('loader');
const navbar = document.getElementById('navbar');
const themeBtn = document.getElementById('theme-toggle');
const themeMeta = document.querySelector('meta[name="theme-color"]');
const burger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
const backToTop = document.getElementById('btt');
const scrollProgress = document.getElementById('scroll-progress');

let countersStarted = false;
let roleRotationStarted = false;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function easeOutQuad(value) {
  return value * (2 - value);
}

function revealHero() {
  document.querySelectorAll('.fade-hero').forEach(el => el.classList.add('on'));
}

function startPage() {
  if (loader) loader.classList.add('out');
  revealHero();
  initHeroCounters();
  startRotation();
  updateScrollUI();
}

window.addEventListener('load', () => {
  window.setTimeout(startPage, prefersReducedMotion ? 250 : 1650);
});

function applyTheme(theme) {
  const next = theme === 'light' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);

  try {
    localStorage.setItem('theme', next);
  } catch (e) {
    // Storage can be unavailable in strict privacy modes.
  }

  if (themeMeta) {
    themeMeta.setAttribute('content', next === 'dark' ? '#070d1a' : '#f7fbff');
  }

  const themeUse = themeBtn?.querySelector('.theme-icon use');
  if (themeUse) themeUse.setAttribute('href', next === 'dark' ? '#icon-moon' : '#icon-sun');
}

let savedTheme = 'dark';
try {
  const saved = localStorage.getItem('theme');
  if (saved === 'light' || saved === 'dark') savedTheme = saved;
} catch (e) {
  savedTheme = 'dark';
}
applyTheme(savedTheme);

themeBtn?.addEventListener('click', () => {
  applyTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
});

function setMobileMenu(open) {
  if (!burger || !mobileMenu) return;
  burger.classList.toggle('open', open);
  mobileMenu.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', String(open));
  mobileMenu.setAttribute('aria-hidden', String(!open));
  document.body.style.overflow = open ? 'hidden' : '';
}

burger?.addEventListener('click', () => {
  setMobileMenu(!burger.classList.contains('open'));
});

document.querySelectorAll('.mob-link, .mob-cv').forEach(link => {
  link.addEventListener('click', () => setMobileMenu(false));
});

document.addEventListener('click', event => {
  if (!mobileMenu?.classList.contains('open')) return;
  if (!mobileMenu.contains(event.target) && !burger?.contains(event.target)) {
    setMobileMenu(false);
  }
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') setMobileMenu(false);
});

function updateProgressBar() {
  if (!scrollProgress) return;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  scrollProgress.style.width = `${clamp(progress, 0, 100)}%`;
}

function updateTimelineProgress() {
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

  document.querySelectorAll('.timeline').forEach(timeline => {
    const rect = timeline.getBoundingClientRect();
    const start = viewportHeight * 0.78;
    const end = viewportHeight * 0.22;
    const distance = rect.height + start - end;
    const progressed = start - rect.top;
    const percent = distance > 0 ? (progressed / distance) * 100 : 0;

    timeline.style.setProperty('--timeline-progress', `${clamp(percent, 0, 100)}%`);
  });
}

function updateScrollUI() {
  navbar?.classList.toggle('scrolled', window.scrollY > 60);
  backToTop?.classList.toggle('show', window.scrollY > 400);
  updateProgressBar();
  updateTimelineProgress();
}

window.addEventListener('scroll', updateScrollUI, { passive: true });
window.addEventListener('resize', updateScrollUI);
updateScrollUI();

backToTop?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
});

function prepareRevealMotion() {
  document.querySelectorAll('.proj-card.fade-up').forEach((card, index) => {
    card.classList.add(index % 2 === 0 ? 'reveal-left' : 'reveal-right');
  });

  document.querySelectorAll('.tl-item.fade-up').forEach((item, index) => {
    item.classList.add(index % 2 === 0 ? 'reveal-left' : 'reveal-right');
  });

  document.querySelectorAll(
    '.exp-card.fade-up, .skill-box.fade-up, .proof-card.fade-up, .workflow-card.fade-up, ' +
    '.proc-card.fade-up, .proc-extra.fade-up, .edu-card.fade-up, .cert-card.fade-up, ' +
    '.cc.fade-up, .open-to.fade-up'
  ).forEach(card => card.classList.add('reveal-scale'));

  [
    '.expertise-grid',
    '.skills-grid',
    '.proof-wall',
    '.workflow-track',
    '.process-grid',
    '.proc-extras',
    '.edu-grid',
    '.cert-grid'
  ].forEach(selector => {
    document.querySelectorAll(`${selector} > .fade-up`).forEach((item, index) => {
      item.style.setProperty('--reveal-delay', `${Math.min(index * 0.08, 0.4)}s`);
    });
  });

  document.querySelectorAll('.badges .badge, .ot-chips .ot-chip').forEach((chip, index) => {
    chip.style.setProperty('--chip-index', index % 12);
  });
}

function initRevealObserver() {
  const revealItems = document.querySelectorAll('.fade-up');

  if (prefersReducedMotion) {
    revealItems.forEach(item => item.classList.add('on'));
    return;
  }

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('on');
      revealObserver.unobserve(entry.target);
    });
  }, {
    threshold: 0.14,
    rootMargin: '0px 0px -6% 0px'
  });

  revealItems.forEach(item => revealObserver.observe(item));
}

function initActiveNavObserver() {
  const links = [...document.querySelectorAll('.nav-link')];
  const sections = [...document.querySelectorAll('main section[id]')];
  if (!links.length || !sections.length) return;

  const setActive = id => {
    links.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
    });
  };

  const navObserver = new IntersectionObserver(entries => {
    const visible = entries
      .filter(entry => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (visible) setActive(visible.target.id);
  }, {
    threshold: [0.28, 0.4, 0.58],
    rootMargin: '-20% 0px -45% 0px'
  });

  sections.forEach(section => navObserver.observe(section));
}

function animateCounters(duration = 1500) {
  const counters = document.querySelectorAll('.stat-num[data-target]');
  if (!counters.length) return;

  countersStarted = true;

  if (prefersReducedMotion || duration <= 0) {
    counters.forEach(counter => {
      counter.textContent = counter.dataset.target || '0';
    });
    return;
  }

  const startedAt = performance.now();

  function tick(now) {
    const progress = clamp((now - startedAt) / duration, 0, 1);
    const eased = easeOutQuad(progress);

    counters.forEach(counter => {
      const target = Number.parseInt(counter.dataset.target, 10) || 0;
      counter.textContent = String(Math.round(target * eased));
    });

    if (progress < 1) {
      window.requestAnimationFrame(tick);
    } else {
      counters.forEach(counter => {
        counter.textContent = counter.dataset.target || '0';
      });
    }
  }

  window.requestAnimationFrame(tick);
}

function initHeroCounters() {
  const hero = document.getElementById('home');
  if (!hero || countersStarted) return;

  if (prefersReducedMotion) {
    animateCounters(0);
    return;
  }

  const counterObserver = new IntersectionObserver(entries => {
    if (!entries.some(entry => entry.isIntersecting)) return;
    animateCounters(1500);
    counterObserver.disconnect();
  }, {
    threshold: 0.35
  });

  counterObserver.observe(hero);
}

function startRotation() {
  if (roleRotationStarted) return;
  roleRotationStarted = true;

  const roles = [
    'Technical Project Coordinator',
    'ML Systems Builder',
    'Data Science Practitioner',
    'HPC-AI Graduate',
    'Python + TensorFlow Developer',
    'Research-to-Delivery Thinker'
  ];
  const role = document.getElementById('rotating-role');
  if (!role || prefersReducedMotion) return;

  let index = 0;
  role.style.transition = 'opacity 0.3s ease';

  window.setInterval(() => {
    role.style.opacity = '0';
    window.setTimeout(() => {
      index = (index + 1) % roles.length;
      role.textContent = roles[index];
      role.style.opacity = '1';
    }, 320);
  }, 2800);
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', event => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;

    event.preventDefault();
    setMobileMenu(false);
    window.scrollTo({
      top: target.getBoundingClientRect().top + window.scrollY - 72,
      behavior: prefersReducedMotion ? 'auto' : 'smooth'
    });
  });
});

const form = document.getElementById('contact-form');
if (form) {
  const formFields = document.querySelectorAll('.form-in, .form-ta');
  const typingState = document.getElementById('typing-state');
  const messageCount = document.getElementById('message-count');
  const submitBtn = document.getElementById('submit-btn');
  const lastLengths = new WeakMap();
  const timers = new WeakMap();

  function updateComposerState(mode = '') {
    const hasDraft = Array.from(formFields).some(field => field.value.trim());
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
      const previousLength = lastLengths.get(field) || 0;
      const nextLength = field.value.length;
      const mode = nextLength < previousLength ? 'deleting' : 'typing';

      lastLengths.set(field, nextLength);

      if (messageCount && field.id === 'cf-message') {
        messageCount.textContent = String(nextLength);
      }

      if (wrap) {
        wrap.classList.remove('is-typing', 'is-deleting');
        void wrap.offsetWidth;
        wrap.classList.add(mode === 'deleting' ? 'is-deleting' : 'is-typing');
        wrap.classList.toggle('has-value', !!field.value.trim());
      }

      updateComposerState(mode);
      window.clearTimeout(timers.get(field));
      timers.set(field, window.setTimeout(() => {
        resetFieldMotion(field);
        updateComposerState();
      }, mode === 'deleting' ? 460 : 720));
    });
  });

  form.addEventListener('submit', event => {
    event.preventDefault();

    const name = document.getElementById('cf-name');
    const email = document.getElementById('cf-email');
    const message = document.getElementById('cf-message');
    let valid = true;

    [name, email, message].forEach(field => {
      field.classList.remove('err');
      if (!field.value.trim()) {
        field.classList.add('err');
        valid = false;
      }
    });

    if (email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      email.classList.add('err');
      valid = false;
    }

    if (!valid) return;

    submitBtn?.classList.add('loading');
    submitBtn?.setAttribute('disabled', 'true');

    window.setTimeout(() => {
      const subject = encodeURIComponent(`Portfolio Inquiry from ${name.value}`);
      const body = encodeURIComponent(
        `Hi Subradeep,\n\n${message.value}\n\nFrom: ${name.value}\nEmail: ${email.value}`
      );
      const success = document.getElementById('form-success');

      window.location.href = `mailto:subradeepdas24@gmail.com?subject=${subject}&body=${body}`;
      success?.classList.add('show');
      form.reset();

      formFields.forEach(field => {
        lastLengths.set(field, 0);
        resetFieldMotion(field);
      });

      if (messageCount) messageCount.textContent = '0';
      updateComposerState();
      submitBtn?.classList.remove('loading');
      submitBtn?.removeAttribute('disabled');

      window.setTimeout(() => success?.classList.remove('show'), 5000);
    }, prefersReducedMotion ? 0 : 650);
  });
}

const year = document.getElementById('yr');
if (year) year.textContent = new Date().getFullYear();

prepareRevealMotion();
initRevealObserver();
initActiveNavObserver();
