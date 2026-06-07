(() => {
  'use strict';

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
    initModals();
    initContactForm();
    initScrollProgress();
    initBackToTop();
  });

  function initLoader() {
    const delay = prefersReducedMotion ? 250 : 2000;
    window.setTimeout(() => {
      document.body.classList.add('loaded');
      document.dispatchEvent(new Event('portfolio:loaded'));
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
    const navShell = $('#primaryNav');
    const menuToggle = $('#menuToggle');
    const mobileMenu = $('#mobileMenu');
    const navLinks = $$('[data-nav-link]');
    const mobileLinks = $$('[data-mobile-link]');
    const allNavLinks = [...navLinks, ...mobileLinks];
    const sections = navLinks
      .map((link) => document.getElementById(link.getAttribute('href').slice(1)))
      .filter(Boolean);

    const setMenu = (open) => {
      if (!menuToggle || !mobileMenu) return;
      navShell?.classList.toggle('menu-open', open);
      menuToggle.classList.toggle('is-open', open);
      mobileMenu.classList.toggle('is-open', open);
      menuToggle.setAttribute('aria-expanded', String(open));
      menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    };

    const closeMenu = () => setMenu(false);

    menuToggle?.addEventListener('click', (event) => {
      event.stopPropagation();
      setMenu(!navShell?.classList.contains('menu-open'));
    });

    allNavLinks.forEach((link) => link.addEventListener('click', closeMenu));

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

        allNavLinks.forEach((link) => {
          const active = link.getAttribute('href') === `#${visible.target.id}`;
          link.classList.toggle('nav-active', active);
        });
      }, {
        threshold: 0.4
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
    const hero = $('#home');
    const stats = $('#heroStats');
    const counters = $$('[data-counter]', stats || document);
    if (!hero || !stats || !counters.length) return;

    let started = false;
    let heroVisible = false;

    const animateCounter = (el) => {
      const target = Number(el.dataset.counter || 0);
      const duration = 1500;
      const start = performance.now();

      const frame = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = progress * (2 - progress);
        el.textContent = String(Math.round(target * eased));

        if (progress < 1) {
          requestAnimationFrame(frame);
        } else {
          el.textContent = String(target);
        }
      };

      requestAnimationFrame(frame);
    };

    const startCounters = () => {
      if (started || !heroVisible || !document.body.classList.contains('loaded')) return;
      started = true;
      counters.forEach((counter) => {
        counter.textContent = '0';
        animateCounter(counter);
      });
    };

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        heroVisible = entry.isIntersecting;
        if (!heroVisible) return;
        startCounters();
        if (started) obs.disconnect();
      });
    }, { threshold: 0.4 });

    document.addEventListener('portfolio:loaded', startCounters, { once: true });
    observer.observe(hero);
  }

  function initModals() {
    const openers = $$('[data-open-modal]');
    const modals = $$('.modal');
    let lastFocused = null;

    const focusableSelector = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

    const getFocusable = (modal) => $$(focusableSelector, modal).filter((node) => node.offsetParent !== null);

    const closeModal = (modal) => {
      if (!modal || !modal.classList.contains('is-open')) return;
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      lastFocused?.focus?.();
    };

    const openModal = (modal) => {
      if (!modal) return;
      lastFocused = document.activeElement;
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      const focusables = getFocusable(modal);
      (focusables[0] || modal).focus?.();
    };

    openers.forEach((opener) => {
      opener.addEventListener('click', () => {
        openModal(document.getElementById(opener.dataset.openModal));
      });
    });

    modals.forEach((modal) => {
      modal.addEventListener('click', (event) => {
        if (event.target.closest('[data-close-modal]')) {
          closeModal(modal);
        }
      });

      modal.addEventListener('keydown', (event) => {
        if (event.key !== 'Tab') return;
        const focusables = getFocusable(modal);
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
      modals.forEach(closeModal);
    });
  }

  function initContactForm() {
    const form = $('#contactForm');
    if (!form) return;

    const fields = $$('input, textarea', form);
    const submit = $('.submit-button', form);
    const banner = $('.form-success', form);
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    fields.forEach((field) => {
      const sync = () => field.closest('.field')?.classList.toggle('filled', field.value.trim().length > 0);
      field.addEventListener('input', () => {
        sync();
        const wrapper = field.closest('.field');
        wrapper?.classList.remove('error');
        const error = $('.field-error', wrapper || form);
        if (error) error.textContent = '';
      });
      sync();
    });

    const validate = () => {
      let ok = true;

      fields.forEach((field) => {
        const wrapper = field.closest('.field');
        const error = $('.field-error', wrapper || form);
        const value = field.value.trim();
        let message = '';

        if (!value) {
          message = 'This field is required.';
        } else if (field.type === 'email' && !emailPattern.test(value)) {
          message = 'Enter a valid email address.';
        }

        wrapper?.classList.toggle('error', Boolean(message));
        if (error) error.textContent = message;
        if (message) ok = false;
      });

      return ok;
    };

    const postForm = async () => {
      const endpoint = form.getAttribute('action') || '';

      if (endpoint.includes('REPLACE_WITH_YOUR_FORMSPREE_ID')) {
        await new Promise((resolve) => window.setTimeout(resolve, 1500));
        return;
      }

      const response = await fetch(endpoint, {
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
        fields.find((field) => field.closest('.field')?.classList.contains('error'))?.focus();
        return;
      }

      submit?.classList.add('loading');
      submit?.setAttribute('disabled', 'true');

      try {
        await postForm();
        form.reset();
        fields.forEach((field) => {
          const wrapper = field.closest('.field');
          wrapper?.classList.remove('filled', 'error');
          const error = $('.field-error', wrapper || form);
          if (error) error.textContent = '';
        });
        banner?.classList.add('show');
        window.setTimeout(() => banner?.classList.remove('show'), 5000);
      } catch {
        const message = $('.field-error', fields[2]?.closest('.field') || form);
        if (message) message.textContent = 'Message could not be sent. Please email me directly.';
        fields[2]?.closest('.field')?.classList.add('error');
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

  function initBackToTop() {
    const button = $('#backToTop');
    if (!button) return;

    const update = () => {
      button.classList.toggle('visible', window.scrollY > 300);
    };

    button.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    update();
    window.addEventListener('scroll', update, { passive: true });
  }
})();
