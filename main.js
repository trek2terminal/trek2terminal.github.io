(() => {
  'use strict';

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const formEndpoint = 'https://formspree.io/f/REPLACE_WITH_YOUR_ID'; // Replace with your Formspree endpoint ID.

  const renderIcons = () => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    renderIcons();
    initLoader();
    initTheme();
    initNav();
    initRevealObserver();
    initHeroTypewriter();
    initCounters();
    initSkillTabs();
    initSkillBars();
    initModals();
    initContactForm();
    initScrollProgress();
    initCustomCursor();
  });

  function initLoader() {
    const delay = prefersReducedMotion ? 250 : 2000;
    window.setTimeout(() => {
      document.body.classList.add('loaded');
    }, delay);
  }

  function initTheme() {
    const button = $('#themeToggle');
    if (!button) return;

    const apply = (theme) => {
      document.documentElement.dataset.theme = theme;
      localStorage.setItem('theme', theme);
      button.setAttribute('aria-pressed', String(theme === 'light'));
      button.setAttribute('aria-label', theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode');
      button.innerHTML = `<i data-lucide="${theme === 'light' ? 'sun' : 'moon'}" aria-hidden="true"></i>`;
      renderIcons();
    };

    apply(document.documentElement.dataset.theme || 'dark');

    button.addEventListener('click', () => {
      const next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
      apply(next);
    });
  }

  function initNav() {
    const header = $('#siteHeader');
    const menuToggle = $('#menuToggle');
    const mobileMenu = $('#mobileMenu');
    const navLinks = $$('[data-nav-link]');
    const mobileLinks = $$('[data-mobile-link]');
    const sections = navLinks
      .map((link) => document.getElementById(link.getAttribute('href').slice(1)))
      .filter(Boolean);

    const setMenu = (open) => {
      if (!menuToggle || !mobileMenu) return;
      menuToggle.classList.toggle('is-open', open);
      mobileMenu.classList.toggle('is-open', open);
      menuToggle.setAttribute('aria-expanded', String(open));
      menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    };

    const closeMenu = () => setMenu(false);

    menuToggle?.addEventListener('click', (event) => {
      event.stopPropagation();
      setMenu(!mobileMenu.classList.contains('is-open'));
    });

    mobileLinks.forEach((link) => link.addEventListener('click', closeMenu));

    document.addEventListener('click', (event) => {
      if (!mobileMenu?.classList.contains('is-open')) return;
      if (mobileMenu.contains(event.target) || menuToggle?.contains(event.target)) return;
      closeMenu();
    });

    const updateHeader = () => {
      header?.classList.toggle('scrolled', window.scrollY > 80);
    };
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });

    if (sections.length) {
      const observer = new IntersectionObserver((entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visible) return;

        navLinks.forEach((link) => {
          const active = link.getAttribute('href') === `#${visible.target.id}`;
          link.classList.toggle('active', active);
        });
      }, {
        threshold: [0.15, 0.35, 0.6],
        rootMargin: '-20% 0px -55% 0px'
      });

      sections.forEach((section) => observer.observe(section));
    }

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu();
    });
  }

  function initRevealObserver() {
    const reveals = $$('.reveal, .reveal-left, .reveal-right');
    if (!reveals.length) return;

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.15 });

    reveals.forEach((item) => observer.observe(item));
  }

  function initHeroTypewriter() {
    const target = $('#heroTypewriter');
    if (!target) return;

    const words = ['AI/ML Engineer', 'HPC-AI Practitioner', 'Applied ML Builder'];
    let wordIndex = 0;
    let charIndex = 0;
    let deleting = false;

    const tick = () => {
      const word = words[wordIndex];
      target.textContent = word.slice(0, charIndex);

      if (!deleting && charIndex < word.length) {
        charIndex += 1;
        window.setTimeout(tick, 80);
        return;
      }

      if (!deleting && charIndex === word.length) {
        deleting = true;
        window.setTimeout(tick, 1300);
        return;
      }

      if (deleting && charIndex > 0) {
        charIndex -= 1;
        window.setTimeout(tick, 42);
        return;
      }

      deleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      window.setTimeout(tick, 220);
    };

    if (prefersReducedMotion) {
      target.textContent = words[0];
    } else {
      tick();
    }
  }

  function initCounters() {
    const stats = $('#heroStats');
    const counters = $$('[data-counter]', stats || document);
    if (!stats || !counters.length) return;

    const animateCounter = (el) => {
      const target = Number(el.dataset.counter || 0);
      const duration = 1500;
      const start = performance.now();

      const frame = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = String(Math.round(target * eased));

        if (progress < 1) {
          requestAnimationFrame(frame);
        } else {
          el.textContent = String(target);
        }
      };

      requestAnimationFrame(frame);
    };

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        counters.forEach(animateCounter);
        obs.disconnect();
      });
    }, { threshold: 0.45 });

    observer.observe(stats);
  }

  function initSkillTabs() {
    const tabs = $$('[data-skill-tab]');
    const panels = $$('[data-skill-panel]');
    if (!tabs.length || !panels.length) return;

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const key = tab.dataset.skillTab;

        tabs.forEach((item) => {
          const active = item === tab;
          item.classList.toggle('active', active);
          item.setAttribute('aria-selected', String(active));
        });

        panels.forEach((panel) => {
          panel.classList.toggle('active', panel.dataset.skillPanel === key);
        });
      });
    });
  }

  function initSkillBars() {
    const container = $('#skillBars');
    const bars = $$('[data-progress]', container || document);
    if (!container || !bars.length) return;

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        bars.forEach((bar) => {
          bar.style.setProperty('--progress', `${bar.dataset.progress}%`);
        });
        obs.disconnect();
      });
    }, { threshold: 0.35 });

    observer.observe(container);
  }

  function initModals() {
    const openers = $$('[data-open-modal]');
    const overlays = $$('.modal-overlay');
    let lastFocused = null;

    const focusableSelector = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

    const getFocusable = (modal) => $$(focusableSelector, modal).filter((node) => node.offsetParent !== null);

    const closeModal = (overlay) => {
      if (!overlay || overlay.hidden) return;
      overlay.hidden = true;
      document.body.style.overflow = '';
      lastFocused?.focus?.();
    };

    const openModal = (overlay) => {
      if (!overlay) return;
      lastFocused = document.activeElement;
      overlay.hidden = false;
      document.body.style.overflow = 'hidden';
      const focusables = getFocusable(overlay);
      (focusables[0] || overlay).focus?.();
    };

    openers.forEach((opener) => {
      opener.addEventListener('click', () => {
        openModal(document.getElementById(opener.dataset.openModal));
      });
    });

    overlays.forEach((overlay) => {
      overlay.addEventListener('click', (event) => {
        if (event.target === overlay || event.target.closest('[data-close-modal]')) {
          closeModal(overlay);
        }
      });

      overlay.addEventListener('keydown', (event) => {
        if (event.key !== 'Tab') return;
        const focusables = getFocusable(overlay);
        if (!focusables.length) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      });
    });

    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') return;
      overlays.forEach(closeModal);
    });
  }

  function initContactForm() {
    const form = $('#contactForm');
    if (!form) return;

    const fields = $$('input, textarea', form);
    const submit = $('.submit-button', form);
    const banner = $('.success-banner', form);

    fields.forEach((field) => {
      const sync = () => field.closest('.field')?.classList.toggle('filled', field.value.trim().length > 0);
      field.addEventListener('input', () => {
        sync();
        field.closest('.field')?.classList.remove('invalid');
      });
      sync();
    });

    const validate = () => {
      let ok = true;

      fields.forEach((field) => {
        const wrapper = field.closest('.field');
        const valid = field.value.trim().length > 0 && (field.type !== 'email' || field.validity.valid);
        wrapper?.classList.toggle('invalid', !valid);
        if (!valid) ok = false;
      });

      return ok;
    };

    const postForm = async () => {
      if (formEndpoint.includes('REPLACE_WITH_YOUR_ID')) {
        await new Promise((resolve) => window.setTimeout(resolve, 1500));
        return;
      }

      const response = await fetch(formEndpoint, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form)
      });

      if (!response.ok) {
        throw new Error('Form submission failed');
      }
    };

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      banner?.classList.remove('show');

      if (!validate()) {
        fields.find((field) => field.closest('.field')?.classList.contains('invalid'))?.focus();
        return;
      }

      submit?.classList.add('loading');
      submit?.setAttribute('disabled', 'true');

      try {
        await postForm();
        form.reset();
        fields.forEach((field) => field.closest('.field')?.classList.remove('filled'));
        banner?.classList.add('show');
        window.setTimeout(() => banner?.classList.remove('show'), 4000);
      } catch (error) {
        console.error(error);
        banner.textContent = 'Message could not be sent. Please email me directly.';
        banner?.classList.add('show');
      } finally {
        submit?.classList.remove('loading');
        submit?.removeAttribute('disabled');
      }
    });
  }

  function initScrollProgress() {
    const bar = $('#scrollProgress');
    if (!bar) return;

    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? (window.scrollY / max) * 100 : 0;
      bar.style.width = `${Math.min(progress, 100)}%`;
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
  }

  function initCustomCursor() {
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const dot = $('.cursor-dot');
    const ring = $('.cursor-ring');
    if (!dot || !ring) return;

    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;

    window.addEventListener('mousemove', (event) => {
      document.body.classList.add('cursor-ready');
      mouseX = event.clientX;
      mouseY = event.clientY;
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    }, { passive: true });

    const animate = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      requestAnimationFrame(animate);
    };
    animate();

    const interactive = 'a, button, input, textarea, [role="tab"]';
    document.addEventListener('mouseover', (event) => {
      if (event.target.closest(interactive)) document.body.classList.add('cursor-active');
    });
    document.addEventListener('mouseout', (event) => {
      if (event.target.closest(interactive)) document.body.classList.remove('cursor-active');
    });
  }
})();
