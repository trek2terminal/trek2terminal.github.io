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
const mobileQuery = window.matchMedia('(max-width: 768px)');

let countersStarted = false;
let roleRotationStarted = false;
let mobileAccordions = [];

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

let scrollTicking = false;

function updateScrollUI() {
  navbar?.classList.toggle('scrolled', window.scrollY > 60);
  backToTop?.classList.toggle('show', window.scrollY > 400);
  updateProgressBar();
  updateTimelineProgress();
  updateMobileBottomNav();
}

function scheduleScrollUI() {
  if (scrollTicking) return;
  scrollTicking = true;
  window.requestAnimationFrame(() => {
    updateScrollUI();
    scrollTicking = false;
  });
}

window.addEventListener('scroll', scheduleScrollUI, { passive: true });
window.addEventListener('resize', scheduleScrollUI);
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
    '.gh-card.fade-up, .note-card.fade-up, .cc.fade-up, .open-to.fade-up'
  ).forEach(card => card.classList.add('reveal-scale'));

  [
    '.expertise-grid',
    '.skills-grid',
    '.proof-wall',
    '.workflow-track',
    '.process-grid',
    '.proc-extras',
    '.gh-grid',
    '.notes-grid',
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

function updateMobileBottomNav() {
  const links = [...document.querySelectorAll('.mobile-bottom-link')];
  if (!links.length) return;

  const sectionIds = links
    .map(link => link.getAttribute('href'))
    .filter(Boolean)
    .map(href => href.slice(1));

  const current = sectionIds
    .map(id => document.getElementById(id))
    .filter(Boolean)
    .map(section => ({
      id: section.id,
      top: Math.abs(section.getBoundingClientRect().top - 96)
    }))
    .sort((a, b) => a.top - b.top)[0];

  if (!current) return;

  links.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current.id}`);
  });
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
  animateCounters(prefersReducedMotion ? 0 : 1500);
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
    openMobileSection(target.id);
    window.scrollTo({
      top: target.getBoundingClientRect().top + window.scrollY - 72,
      behavior: prefersReducedMotion ? 'auto' : 'smooth'
    });
  });
});

function setMobilePanel(button, open, closeOthers = true) {
  const panelId = button.getAttribute('aria-controls');
  const panel = panelId ? document.getElementById(panelId) : null;
  if (!panel) return;

  if (open && closeOthers) {
    mobileAccordions.forEach(other => {
      if (other !== button) setMobilePanel(other, false, false);
    });
  }

  button.classList.toggle('is-open', open);
  button.setAttribute('aria-expanded', String(open));
  panel.classList.toggle('is-open', open);

  if (!mobileQuery.matches) {
    panel.style.maxHeight = '';
    return;
  }

  if (open) {
    panel.style.maxHeight = `${panel.scrollHeight}px`;
  } else {
    panel.style.maxHeight = '0px';
  }
}

function refreshMobilePanels() {
  mobileAccordions.forEach(button => {
    const panel = document.getElementById(button.getAttribute('aria-controls'));
    if (!panel) return;

    if (!mobileQuery.matches) {
      panel.style.maxHeight = '';
      return;
    }

    if (button.classList.contains('is-open')) {
      panel.style.maxHeight = `${panel.scrollHeight}px`;
    } else {
      panel.style.maxHeight = '0px';
    }
  });
}

function openMobileSection(sectionId) {
  if (!mobileQuery.matches) return;
  const section = document.getElementById(sectionId);
  const button = section?.querySelector('[data-mobile-accordion]');
  if (button) {
    window.requestAnimationFrame(() => setMobilePanel(button, true));
  }
}

function initMobileAccordions() {
  mobileAccordions = [...document.querySelectorAll('[data-mobile-accordion]')];
  if (!mobileAccordions.length) return;

  document.body.classList.add('mobile-enhanced');

  mobileAccordions.forEach(button => {
    button.addEventListener('click', () => {
      setMobilePanel(button, !button.classList.contains('is-open'));
    });
  });

  window.addEventListener('resize', refreshMobilePanels);
  mobileQuery.addEventListener?.('change', refreshMobilePanels);

  if (window.location.hash) {
    openMobileSection(window.location.hash.slice(1));
  }

  refreshMobilePanels();
}

function fallbackCopy(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  textarea.style.pointerEvents = 'none';
  document.body.appendChild(textarea);
  textarea.select();

  let copied = false;
  try {
    copied = document.execCommand('copy');
  } catch (e) {
    copied = false;
  }

  textarea.remove();
  return copied;
}

async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return true;
  }

  return fallbackCopy(text);
}

let copyToastTimer;

function showCopyToast(message) {
  const toast = document.getElementById('copy-toast');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(copyToastTimer);
  copyToastTimer = window.setTimeout(() => {
    toast.classList.remove('show');
  }, 2200);
}

function initCopyButtons() {
  document.querySelectorAll('[data-copy-value]').forEach(button => {
    button.addEventListener('click', async () => {
      const value = button.getAttribute('data-copy-value') || '';
      const label = button.getAttribute('data-copy-label') || 'Text';
      if (!value) return;

      try {
        const copied = await copyText(value);
        showCopyToast(copied ? `${label} copied` : `Copy ${label.toLowerCase()} manually`);
      } catch (e) {
        showCopyToast(`Copy ${label.toLowerCase()} manually`);
      }
    });
  });
}

function initSwipeRails() {
  const rails = document.querySelectorAll(
    '.proof-strip, .hero-stats, .projects-list, .proof-wall, .workflow-track, .cert-grid'
  );

  rails.forEach(rail => {
    let isPointerDown = false;
    let startX = 0;
    let startY = 0;
    let startScrollLeft = 0;
    let suppressClick = false;

    rail.addEventListener('pointerdown', event => {
      if (!mobileQuery.matches || event.button > 0) return;

      isPointerDown = true;
      startX = event.clientX;
      startY = event.clientY;
      startScrollLeft = rail.scrollLeft;
      rail.style.scrollBehavior = 'auto';
      try {
        rail.setPointerCapture?.(event.pointerId);
      } catch (e) {
        // Some browsers do not allow capture for every pointer state.
      }
    });

    rail.addEventListener('pointermove', event => {
      if (!isPointerDown) return;

      const deltaX = event.clientX - startX;
      const deltaY = event.clientY - startY;
      const horizontalIntent = Math.abs(deltaX) > 6 && Math.abs(deltaX) > Math.abs(deltaY);

      if (!horizontalIntent) return;

      suppressClick = true;
      rail.classList.add('is-dragging');
      const maxScrollLeft = Math.max(rail.scrollWidth - rail.clientWidth, 0);
      rail.scrollLeft = clamp(startScrollLeft - deltaX, 0, maxScrollLeft);
      event.preventDefault();
    });

    function stopDragging(event) {
      if (!isPointerDown) return;

      isPointerDown = false;
      rail.classList.remove('is-dragging');
      rail.style.scrollBehavior = '';
      const edgeSnap = 28;
      const maxScrollLeft = Math.max(rail.scrollWidth - rail.clientWidth, 0);

      if (rail.scrollLeft < edgeSnap) {
        rail.scrollTo({ left: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      } else if (maxScrollLeft - rail.scrollLeft < edgeSnap) {
        rail.scrollTo({ left: maxScrollLeft, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      }

      try {
        rail.releasePointerCapture?.(event.pointerId);
      } catch (e) {
        // Capture may already be released by the browser.
      }

      if (suppressClick) {
        window.setTimeout(() => {
          suppressClick = false;
        }, 120);
      }
    }

    rail.addEventListener('pointerup', stopDragging);
    rail.addEventListener('pointercancel', stopDragging);
    rail.addEventListener('pointerleave', stopDragging);

    rail.addEventListener('click', event => {
      if (!suppressClick) return;
      event.preventDefault();
      event.stopPropagation();
    }, true);
  });
}

function showGitHubStatsError() {
  const container = document.getElementById('github-stats');
  const grid = container?.querySelector('.gh-grid');
  if (!grid) return;

  grid.innerHTML = '<p class="gh-error">Live GitHub data is temporarily unavailable. Visit my GitHub profile directly to see my latest work.</p>';
}

function formatGitHubTime(dateValue) {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return 'recently';

  const diffDays = Math.floor((Date.now() - date) / 86400000);
  if (diffDays <= 0) return 'today';
  if (diffDays === 1) return '1 day ago';
  return `${diffDays} days ago`;
}

function isValidGitHubStatsData(data) {
  return Boolean(
    data &&
    typeof data === 'object' &&
    data.user &&
    typeof data.user === 'object' &&
    typeof data.user.created_at === 'string' &&
    !Number.isNaN(Date.parse(data.user.created_at)) &&
    Array.isArray(data.repos)
  );
}

function renderGitHubStats(data) {
  if (!isValidGitHubStatsData(data)) {
    showGitHubStatsError();
    return;
  }

  const { user, repos } = data;
  const sinceNum = document.getElementById('gh-since');
  const followersNum = document.getElementById('gh-followers');
  const starsNum = document.getElementById('gh-stars');
  const langBars = document.getElementById('gh-lang-bars');
  const signalList = document.getElementById('gh-signals');

  if (sinceNum) {
    const createdAt = new Date(user.created_at);
    sinceNum.textContent = String(createdAt.getFullYear());
  }
  if (followersNum) followersNum.textContent = String(Number.isFinite(user.followers) ? user.followers : 0);

  const totalStars = repos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);
  if (starsNum) starsNum.textContent = String(totalStars);

  const langCounts = {};
  repos.forEach(repo => {
    if (repo.language) langCounts[repo.language] = (langCounts[repo.language] || 0) + 1;
  });

  if (langBars) {
    const totalLangRepos = Object.values(langCounts).reduce((a, b) => a + b, 0) || 1;
    const topLangs = Object.entries(langCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    langBars.innerHTML = '';

    if (!topLangs.length) {
      const empty = document.createElement('p');
      empty.className = 'gh-error';
      empty.textContent = 'Language data is not available yet.';
      langBars.appendChild(empty);
    } else {
      topLangs.forEach(([lang, count]) => {
        const pct = Math.round((count / totalLangRepos) * 100);
        const row = document.createElement('div');
        row.className = 'gh-lang-row';

        const head = document.createElement('div');
        head.className = 'gh-lang-head';

        const label = document.createElement('span');
        label.textContent = lang;
        const value = document.createElement('span');
        value.textContent = `${pct}%`;

        const track = document.createElement('div');
        track.className = 'gh-lang-track';
        const fill = document.createElement('div');
        fill.className = 'gh-lang-fill';
        fill.dataset.pct = String(pct);

        head.append(label, value);
        track.appendChild(fill);
        row.append(head, track);
        langBars.appendChild(row);
      });
    }
  }

  if (signalList) {
    const publicRepos = repos.filter(repo => !repo.fork);
    const latestPublicPush = publicRepos
      .map(repo => repo.pushed_at)
      .filter(Boolean)
      .sort((a, b) => new Date(b) - new Date(a))[0];

    const signals = [
      ['Latest public activity', latestPublicPush ? formatGitHubTime(latestPublicPush) : 'No public push yet'],
      ['Language mix', `${Object.keys(langCounts).length || 0} stacks`],
      ['Data scope', 'Public API only']
    ];

    signalList.innerHTML = '';

    signals.forEach(([name, value]) => {
      const item = document.createElement('li');
      item.className = 'gh-signal-item';

      const label = document.createElement('span');
      label.className = 'gh-signal-name';
      label.textContent = name;

      const meta = document.createElement('span');
      meta.className = 'gh-signal-value';
      meta.textContent = value;

      item.append(label, meta);
      signalList.appendChild(item);
    });
  }

  const fillBars = () => {
    document.querySelectorAll('.gh-lang-fill').forEach(bar => {
      bar.style.width = `${bar.dataset.pct || 0}%`;
    });
  };

  if (prefersReducedMotion || typeof IntersectionObserver === 'undefined') {
    fillBars();
    return;
  }

  const ghSection = document.getElementById('github-stats');
  if (!ghSection) {
    fillBars();
    return;
  }

  const langObserver = new IntersectionObserver(entries => {
    if (!entries.some(entry => entry.isIntersecting)) return;
    fillBars();
    langObserver.disconnect();
  }, { threshold: 0.2 });

  langObserver.observe(ghSection);
}

async function loadGitHubStats() {
  const username = 'trek2terminal';
  const cacheKey = 'gh_stats_cache_v2';
  const legacyCacheKey = 'gh_stats_cache';
  const cacheTTL = 1000 * 60 * 60;
  let staleData = null;

  try {
    let cached = null;
    try {
      localStorage.removeItem(legacyCacheKey);
      cached = JSON.parse(localStorage.getItem(cacheKey) || 'null');
    } catch (e) {
      cached = null;
    }

    if (cached && isValidGitHubStatsData(cached.data)) {
      staleData = cached.data;
    } else if (cached) {
      try {
        localStorage.removeItem(cacheKey);
      } catch (e) {
        // Ignore storage cleanup failures.
      }
    }

    if (cached && staleData && Date.now() - cached.ts < cacheTTL) {
      renderGitHubStats(cached.data);
      return;
    }

    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`),
      fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`)
    ]);

    if (!userRes.ok || !reposRes.ok) throw new Error('GitHub API error');

    const user = await userRes.json();
    const repos = await reposRes.json();
    const data = { user, repos };

    if (!isValidGitHubStatsData(data)) throw new Error('Invalid GitHub API payload');

    try {
      localStorage.setItem(cacheKey, JSON.stringify({ ts: Date.now(), data }));
    } catch (e) {
      // Cache can fail in private or restricted browser modes.
    }

    renderGitHubStats(data);
  } catch (err) {
    if (staleData) {
      renderGitHubStats(staleData);
      return;
    }

    try {
      localStorage.removeItem(cacheKey);
    } catch (e) {
      // Ignore storage cleanup failures.
    }

    showGitHubStatsError();
  }
}

function initNotes() {
  document.querySelectorAll('.note-toggle').forEach(button => {
    button.addEventListener('click', () => {
      const card = button.closest('.note-card');
      const body = card?.querySelector('.note-body');
      if (!body) return;

      const expanded = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!expanded));
      button.textContent = expanded ? 'Read more' : 'Show less';
      body.style.maxHeight = expanded ? '0px' : `${body.scrollHeight}px`;
    });
  });
}

function refreshOpenNotes() {
  document.querySelectorAll('.note-toggle[aria-expanded="true"]').forEach(button => {
    const body = button.closest('.note-card')?.querySelector('.note-body');
    if (body) body.style.maxHeight = `${body.scrollHeight}px`;
  });
}

function initResumeModal() {
  const resumeButtons = document.querySelectorAll('.btn-nav-cv, .mob-cv');
  const resumeModal = document.getElementById('resume-modal');
  const resumeTemplate = document.getElementById('resume-template');
  const downloadButton = document.getElementById('resume-download-btn');
  const closeButton = document.getElementById('resume-close-btn');
  if (!resumeModal || !resumeTemplate) return;

  function openResumeModal() {
    resumeModal.classList.add('modal-open');
    resumeModal.setAttribute('aria-hidden', 'false');
    resumeTemplate.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    downloadButton?.focus({ preventScroll: true });
  }

  function closeResumeModal() {
    resumeModal.classList.remove('modal-open');
    resumeModal.setAttribute('aria-hidden', 'true');
    resumeTemplate.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  resumeButtons.forEach(button => {
    button.addEventListener('click', event => {
      event.preventDefault();
      openResumeModal();
    });
  });

  downloadButton?.addEventListener('click', () => {
    const pdfExporter = window.html2pdf || (typeof html2pdf === 'function' ? html2pdf : null);

    if (!pdfExporter) {
      const originalText = downloadButton.textContent;
      downloadButton.textContent = 'PDF tool unavailable';
      window.setTimeout(() => {
        downloadButton.textContent = originalText;
      }, 2200);
      return;
    }

    const options = {
      margin: 0.3,
      filename: 'Subradeep_Das_Resume.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    pdfExporter().set(options).from(resumeTemplate).save();
  });

  closeButton?.addEventListener('click', closeResumeModal);

  resumeModal.addEventListener('click', event => {
    if (event.target === resumeModal) closeResumeModal();
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && resumeModal.classList.contains('modal-open')) {
      closeResumeModal();
    }
  });
}

function resetHeroProofRail() {
  const proofStrip = document.querySelector('.proof-strip');
  if (!proofStrip || !mobileQuery.matches) return;
  proofStrip.scrollLeft = 0;
}

function trackEvent(name, props = {}) {
  if (typeof window.plausible === 'function') {
    window.plausible(name, { props });
  }

  if (typeof window.gtag === 'function') {
    window.gtag('event', name.toLowerCase().replace(/\s+/g, '_'), props);
  }
}

function initAnalyticsEvents() {
  const viewedSections = new Set();

  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting || viewedSections.has(entry.target.id)) return;
      viewedSections.add(entry.target.id);
      trackEvent('Section View', { section: entry.target.id });
    });
  }, {
    threshold: 0.55
  });

  document.querySelectorAll('main section[id]').forEach(section => {
    sectionObserver.observe(section);
  });

  document.querySelectorAll('a[href$=".pdf"], a[download]').forEach(link => {
    link.addEventListener('click', () => {
      trackEvent('Resume Or Proof Click', {
        label: link.textContent.trim() || link.getAttribute('href'),
        href: link.getAttribute('href')
      });
    });
  });

  document.querySelectorAll('a[href^="mailto:"], a[href^="tel:"], .mobile-copy-btn').forEach(link => {
    link.addEventListener('click', () => {
      trackEvent('Contact Click', {
        label: link.textContent.trim() || link.getAttribute('aria-label') || 'contact'
      });
    });
  });
}

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
    const success = document.getElementById('form-success');
    const errorBox = document.getElementById('form-error');
    let valid = true;

    success?.classList.remove('show');
    errorBox?.classList.remove('show');

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

    const endpoint = form.getAttribute('action') || '';
    const endpointReady = endpoint && !endpoint.includes('REPLACE_WITH_YOUR_FORMSPREE_ID');

    if (!endpointReady) {
      if (errorBox) {
        errorBox.textContent = 'Formspree endpoint is not configured yet. Replace the placeholder action URL first.';
      }
      errorBox?.classList.add('show');
      submitBtn?.classList.remove('loading');
      submitBtn?.removeAttribute('disabled');
      trackEvent('Contact Form Error', { reason: 'missing_formspree_endpoint' });
      return;
    }

    window.setTimeout(async () => {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          body: new FormData(form),
          headers: {
            Accept: 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`Formspree response ${response.status}`);
        }

        success?.classList.add('show');
        trackEvent('Contact Form Submitted', { status: 'success' });
        form.reset();

        formFields.forEach(field => {
          lastLengths.set(field, 0);
          resetFieldMotion(field);
        });

        if (messageCount) messageCount.textContent = '0';
        updateComposerState();
        window.setTimeout(() => success?.classList.remove('show'), 5000);
      } catch (error) {
        if (errorBox) {
          errorBox.textContent = 'Message could not be sent. Please check the Formspree endpoint or email me directly.';
        }
        errorBox?.classList.add('show');
        trackEvent('Contact Form Error', { reason: 'submit_failed' });
      } finally {
        submitBtn?.classList.remove('loading');
        submitBtn?.removeAttribute('disabled');
      }
    }, prefersReducedMotion ? 0 : 650);
  });
}

const year = document.getElementById('yr');
if (year) year.textContent = new Date().getFullYear();

prepareRevealMotion();
initRevealObserver();
initActiveNavObserver();
initMobileAccordions();
initCopyButtons();
initSwipeRails();
initNotes();
initResumeModal();
initAnalyticsEvents();
loadGitHubStats();
resetHeroProofRail();
window.addEventListener('resize', resetHeroProofRail);
window.addEventListener('resize', refreshOpenNotes);
