// script.js — fully updated and copy-paste ready
// Features:
// - Theme toggle (persisted)
// - Mobile menu / hamburger
// - Reveal-on-scroll (stagger for nested reveals)
// - Magnetic buttons
// - Metric count-up
// - Nebula parallax
// - Accessible modal dialogs (focus trap + outside click + ESC close + animation)
// - Starfield/constellation canvas (performance-minded, pause when hidden / small screens)
// - Floating back-to-top button
// - Contact form integration (Formspree) with loading / success states + toast + validation
// - Contact grid drag-to-resize (pointer events) with responsive fallback
// - Skills tooltip with animated bars
// - Global Escape to close dialogs
// Single IIFE, assumes script is loaded with `defer`.

(() => {
  'use strict';

  /* -----------------------
     Helpers + DOM shorteners
     ----------------------- */
  const $ = (sel, ctx = document) => (ctx || document).querySelector(sel);
  const $all = (sel, ctx = document) => Array.from((ctx || document).querySelectorAll(sel));

  /* -----------------------
     Theme toggle + persistence
     ----------------------- */
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    root.classList.toggle('light', savedTheme === 'light');
  } else {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      root.classList.add('light');
    }
  }
  if (themeToggle) {
    const reflect = () => (themeToggle.textContent = root.classList.contains('light') ? '☀' : '☾');
    themeToggle.addEventListener('click', () => {
      const isLight = root.classList.toggle('light');
      localStorage.setItem('theme', isLight ? 'light' : 'dark');
      reflect();
    });
    reflect();
  }

  /* -----------------------
     Remove leftover inline transform on avatar-card (cleanup)
     ----------------------- */
  (function cleanupAvatarInlineStyle() {
    const avatar = document.querySelector('.avatar-card');
    if (!avatar) return;
    // Remove transform property if present; keep other inline styles if any.
    try {
      if (avatar.style && avatar.style.transform) {
        avatar.style.removeProperty('transform');
      }
      // If the element only had a style attribute with whitespace now, remove attribute.
      if (avatar.getAttribute('style') && avatar.getAttribute('style').trim() === '') {
        avatar.removeAttribute('style');
      }
    } catch (err) {
      // non-fatal
      console.warn('Avatar cleanup error', err);
    }
  })();

  /* -----------------------
     Year element
     ----------------------- */
  (function setYear() {
    const el = document.getElementById('year');
    if (el) el.textContent = String(new Date().getFullYear());
  })();

  /* -----------------------
     Mobile menu / hamburger
     ----------------------- */
  (function mobileMenu() {
    const hamburger = $('#hamburger');
    const mobileMenu = $('#mobileMenu');
    if (!hamburger || !mobileMenu) return;

    const setOpen = (open) => {
      mobileMenu.hidden = !open;
      hamburger.setAttribute('aria-expanded', String(!!open));
      if (open) {
        // focus first focusable item
        const firstLink = mobileMenu.querySelector('a, button, [tabindex]');
        firstLink?.focus();
        document.documentElement.style.overflow = 'hidden';
      } else {
        hamburger.focus();
        document.documentElement.style.overflow = '';
      }
    };

    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      setOpen(!mobileMenu.hidden);
    });

    mobileMenu.addEventListener('click', (e) => {
      const a = e.target.closest('a');
      if (a) setOpen(false);
    });

    // close clicking outside
    document.addEventListener('click', (e) => {
      if (!mobileMenu.hidden) {
        const path = e.composedPath ? e.composedPath() : (e.path || []);
        const inside = path.includes(mobileMenu) || path.includes(hamburger);
        if (!inside) setOpen(false);
      }
    });

    // close on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !mobileMenu.hidden) setOpen(false);
    });

    // initial state for small screens
    if (window.matchMedia('(max-width: 920px)').matches) {
      mobileMenu.hidden = true;
      hamburger.setAttribute('aria-expanded', 'false');
    }
  })();

  /* -----------------------
     Reveal on scroll (with nested staggering)
     ----------------------- */
  (function revealOnScroll() {
    const options = { threshold: 0.12 };
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        // If element contains multiple .reveal children, stagger them
        const nested = el.querySelectorAll ? el.querySelectorAll('.reveal') : [];
        if (nested && nested.length > 1) {
          nested.forEach((child, i) => {
            setTimeout(() => child.classList.add('visible'), i * 80);
          });
        } else {
          el.classList.add('visible');
        }
        obs.unobserve(el);
      });
    }, options);

    const reveals = $all('.reveal');
    reveals.forEach((r) => observer.observe(r));

    // fallback for in-view on load
    setTimeout(() => {
      $all('.reveal').forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) el.classList.add('visible');
      });
    }, 80);
  })();

  /* -----------------------
     Magnetic button micro-interaction
     ----------------------- */
  (function magneticButtons() {
    $all('.magnetic').forEach(btn => {
      let mouseLeaveTimeout = null;
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x / 12}px, ${y / 12}px)`;
        btn.style.transition = 'transform .08s linear';
        if (mouseLeaveTimeout) clearTimeout(mouseLeaveTimeout);
      });
      btn.addEventListener('mouseleave', () => {
        mouseLeaveTimeout = setTimeout(() => { btn.style.transform = ''; }, 60);
      });
      btn.addEventListener('focus', () => { btn.style.transform = 'translateY(-4px)'; });
      btn.addEventListener('blur', () => { btn.style.transform = ''; });
    });
  })();

  /* -----------------------
     Count-up metrics
     ----------------------- */
  (function metricCountUp() {
    function animateCount(el) {
      const target = Math.max(0, +el.dataset.count || 0);
      const duration = 900;
      const start = performance.now();
      function tick(now) {
        const p = Math.min((now - start) / duration, 1);
        const eased = 0.15 + 0.85 * p;
        const value = Math.floor(target * eased);
        el.textContent = String(value);
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = String(target); // ensure exact at end
      }
      requestAnimationFrame(tick);
    }

    $all('.metric span').forEach(span => {
      const io = new IntersectionObserver((entries, ob) => {
        entries.forEach(en => {
          if (en.isIntersecting) {
            animateCount(span);
            ob.disconnect();
          }
        });
      }, { threshold: 0.25 });
      io.observe(span);
    });
  })();

  /* -----------------------
     Nebula parallax (subtle)
     ----------------------- */
  (function nebulaParallax() {
    const nebula = document.querySelector('.neon-nebula');
    if (!nebula) return;
    const onNebula = () => {
      const y = Math.round(window.scrollY * 0.12);
      nebula.style.transform = `translateY(${y}px)`;
    };
    window.addEventListener('scroll', onNebula, { passive: true });
    onNebula();
  })();

  /* -----------------------
     Accessible modal/dialog helpers
     ----------------------- */
  (function modals() {
    // utility: get all focusable nodes inside element
    const focusableSelector = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';
    function focusables(container) {
      return Array.from(container.querySelectorAll(focusableSelector))
        .filter(n => n.offsetParent !== null);
    }

    function showDialog(modal) {
      if (!modal) return;
      try {
        if (typeof modal.showModal === 'function') modal.showModal();
        else modal.setAttribute('open', '');
      } catch (e) {
        // fallback for non-supported environments
        modal.setAttribute('open', '');
      }

      // focus best candidate
      const focusable = focusables(modal);
      if (focusable.length) focusable[0].focus();
      else modal.querySelector('[data-close], .modal__close')?.focus();

      // trap keyboard focus inside modal
      const trap = (e) => {
        if (e.key !== 'Tab') return;
        const nodes = focusables(modal);
        if (!nodes.length) return;
        const first = nodes[0], last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      };

      // outside click detection via document listener (robust)
      const outsideClick = (e) => {
        const path = e.composedPath ? e.composedPath() : (e.path || []);
        // if the modal itself is not in the path, ignore
        if (!path.includes(modal)) return;
        // if click target is the <dialog> backdrop area (some browsers include dialog in path on backdrop click),
        // compute client coordinates to check if it was outside the modal bounds
        const rect = modal.getBoundingClientRect();
        if (e.clientX === 0 && e.clientY === 0) {
          // some synthetic events have 0 coords; ignore
          return;
        }
        const inside = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
        if (!inside) {
          closeDialog(modal);
        }
      };

      // store handlers so we can remove later
      modal.__dialogTrap = trap;
      modal.__dialogOutside = outsideClick;

      modal.addEventListener('keydown', trap);
      // attach outside click to document, but only when modal open
      document.addEventListener('pointerdown', outsideClick);
      // also a click listener to cover older browsers
      document.addEventListener('click', outsideClick);
    }

    function closeDialog(modal) {
      if (!modal) return;
      // cleanup listeners
      if (modal.__dialogTrap) modal.removeEventListener('keydown', modal.__dialogTrap);
      if (modal.__dialogOutside) {
        document.removeEventListener('pointerdown', modal.__dialogOutside);
        document.removeEventListener('click', modal.__dialogOutside);
      }
      // play closing animation
      modal.classList.add('closing');
      const onEnd = () => {
        modal.classList.remove('closing');
        try {
          if (typeof modal.close === 'function') modal.close();
          else modal.removeAttribute('open');
        } catch (e) {
          modal.removeAttribute('open');
        }
        modal.removeEventListener('animationend', onEnd);
      };
      modal.addEventListener('animationend', onEnd);
      // safety: if no animation occurs, ensure close after small timeout
      setTimeout(() => {
        if (!modal.hasAttribute('open') && typeof modal.close === 'function') return;
      }, 400);
    }

    const modalIds = [
      'modal-irctc','modal-mzi','modal-btech','modal-12th','modal-10th',
      'modal-geodata','modal-lwcs','modal-nielit','modal-quantum','modal-tcs','modal-aiml'
    ];

    modalIds.forEach(id => {
      const modal = document.getElementById(id);
      if (!modal) return;
      // bind openers
      $all(`[data-modal="${id}"]`).forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          showDialog(modal);
        });
      });
      // closers inside modal
      modal.querySelectorAll('[data-close], .modal__close').forEach(b => {
        b.addEventListener('click', (evt) => {
          evt.preventDefault();
          closeDialog(modal);
        });
      });
    });

    // close dialogs on global Escape (also mark closing animation)
    window.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      document.querySelectorAll('dialog[open]').forEach(d => {
        try { d.classList.add('closing'); } catch (err) {}
        try { d.close(); } catch (err) { d.removeAttribute('open'); }
      });
    });
  })();

  /* -----------------------
     Starfield / Constellation Canvas
     ----------------------- */
  (function starfield() {
    const canvas = document.getElementById('constellation');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let dpr = 1;
    let w = 0, h = 0;
    let points = [];
    let raf = null;
    let mouse = { x: -9999, y: -9999 };

    function createPoints() {
      points = [];
      const area = (w * h);
      // density tuned to viewport area
      const density = Math.max(20, Math.min(220, Math.floor(area / 90000 * 60)));
      for (let i = 0; i < density; i++) {
        points.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: 0.5 + Math.random() * 1.6,
          alpha: 0.12 + Math.random() * 0.85,
          tw: Math.random() * Math.PI * 2,
          vx: (Math.random() - 0.5) * 0.08,
          vy: (Math.random() - 0.5) * 0.08
        });
      }
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      w = Math.max(300, rect.width);
      h = Math.max(200, rect.height);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      createPoints();
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      // draw points
      for (const p of points) {
        p.tw += 0.02 + Math.random() * 0.01;
        const tw = 0.45 + Math.sin(p.tw) * 0.55;
        const alpha = Math.max(0.05, Math.min(1, p.alpha * tw));
        ctx.globalAlpha = alpha * 0.95;
        ctx.beginPath();
        ctx.fillStyle = '#fff';
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        p.x += p.vx; p.y += p.vy;
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;
      }

      // connect near points
      const maxDist = Math.max(80, Math.min(160, (w + h) / 14));
      ctx.lineWidth = 0.9;
      for (let i = 0; i < points.length; i++) {
        const a = points[i];
        for (let j = i + 1; j < points.length; j++) {
          const b = points[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < maxDist * maxDist) {
            const alpha = 0.12 * (1 - (Math.sqrt(d2) / maxDist));
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
        // draw link to mouse when near
        const mdx = a.x - mouse.x, mdy = a.y - mouse.y;
        const md2 = mdx * mdx + mdy * mdy;
        if (mouse.x > -9000 && md2 < (maxDist * 1.6) * (maxDist * 1.6)) {
          const alpha = 0.18 * (1 - (Math.sqrt(md2) / (maxDist * 1.6)));
          ctx.beginPath();
          ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }
    }

    function loop() {
      draw();
      raf = requestAnimationFrame(loop);
    }

    function visibilityHandler() {
      if (document.hidden || window.innerWidth < 720) {
        if (raf) cancelAnimationFrame(raf);
        raf = null;
      } else if (!raf) {
        loop();
      }
    }

    // events
    let resizeTimer = null;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => { resize(); visibilityHandler(); }, 120);
    }, { passive: true });
    document.addEventListener('visibilitychange', visibilityHandler);

    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });
    canvas.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });

    // initialize
    resize();
    if (window.innerWidth >= 720 && !document.hidden) loop();
  })();

  /* -----------------------
     Floating back-to-top
     ----------------------- */
  (function backToTop() {
    const toTop = document.getElementById('toTopBtn');
    if (!toTop) return;
    const toggle = () => {
      if (window.scrollY > 600) toTop.classList.add('show');
      else toTop.classList.remove('show');
    };
    toTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      toTop.classList.remove('show');
    });
    window.addEventListener('scroll', toggle, { passive: true });
    toggle();
  })();

  /* -----------------------
     Contact form (Formspree) + validation + toast
     ----------------------- */
  (function contactFormHandler() {
    const form = document.querySelector('.contact-form');
    if (!form) return;
    const url = form.getAttribute('action') || 'https://formspree.io/f/xblkvvap';
    const nameEl = form.querySelector('#cf-name');
    const emailEl = form.querySelector('#cf-email');
    const msgEl = form.querySelector('#cf-message');
    const submitBtn = form.querySelector('.submit-btn');
    const submitText = submitBtn ? submitBtn.querySelector('.submit-text') : null;

    function refreshFieldState(el) {
      const parent = el?.closest('.field');
      if (!parent) return;
      if (String(el.value).trim().length) parent.classList.add('has-value');
      else parent.classList.remove('has-value');
    }
    [nameEl, emailEl, msgEl].forEach(i => {
      if (!i) return;
      i.addEventListener('input', () => refreshFieldState(i));
      refreshFieldState(i);
    });

    function showToast(text, success = true) {
      const t = document.createElement('div');
      t.className = 'form-toast';
      t.textContent = text;
      if (!success) t.style.background = 'linear-gradient(90deg,#ff6b6b,#ff5252)';
      document.body.appendChild(t);
      setTimeout(() => {
        try { t.remove(); } catch (e) {}
      }, 3500);
    }

    function validate() {
      let ok = true;
      [nameEl, emailEl, msgEl].forEach(el => {
        if (!el) return;
        const parent = el.closest('.field');
        parent && parent.classList.remove('error');
        if (!String(el.value || '').trim()) { parent && parent.classList.add('error'); ok = false; }
      });
      if (emailEl && !/^\S+@\S+\.\S+$/.test(emailEl.value)) { emailEl.closest('.field')?.classList.add('error'); ok = false; }
      return ok;
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!validate()) {
        showToast('Please fill all required fields correctly.', false);
        return;
      }
      if (submitBtn) submitBtn.classList.add('loading');
      if (submitText) submitText.textContent = 'Sending...';

      try {
        const formData = new FormData(form);
        const res = await fetch(url, { method: 'POST', headers: { 'Accept': 'application/json' }, body: formData });

        if (submitBtn) submitBtn.classList.remove('loading');

        if (res.ok) {
          if (submitBtn) submitBtn.classList.add('success');
          if (submitText) submitText.textContent = 'Sent';
          showToast('Message sent — thanks. I will reply within 48 hours.');
          setTimeout(() => {
            if (submitBtn) submitBtn.classList.remove('success');
            if (submitText) submitText.textContent = 'Send message';
          }, 2000);
          form.reset();
          [nameEl, emailEl, msgEl].forEach(i => i && refreshFieldState(i));
        } else {
          let payload = null;
          try { payload = await res.json(); } catch (err) { payload = null; }
          const err = payload && payload.error ? payload.error : 'Something went wrong.';
          showToast('Send failed — ' + err, false);
          if (submitText) submitText.textContent = 'Send message';
        }
      } catch (err) {
        if (submitBtn) submitBtn.classList.remove('loading');
        showToast('Network error. Try again later.', false);
        if (submitText) submitText.textContent = 'Send message';
        console.error('Contact send error', err);
      }
    });
  })();

  /* -----------------------
     Contact grid drag-to-resize
     ----------------------- */
  (function gridResize() {
    const grid = document.getElementById('contactGrid');
    const handle = document.getElementById('gridHandle');
    if (!grid || !handle) return;

    if (window.matchMedia('(max-width:920px)').matches) {
      handle.style.display = 'none';
      grid.style.gridTemplateColumns = '1fr';
      return;
    }

    let dragging = false;
    let startX = 0;
    let startLeft = 0;
    let startRight = 0;

    function getCols() {
      const style = window.getComputedStyle(grid);
      const cols = style.gridTemplateColumns.split(' ').map(s => s.trim());
      if (cols.length >= 3 && cols[0].endsWith('px') && cols[2].endsWith('px')) {
        return [parseFloat(cols[0]), parseFloat(cols[1]) || 12, parseFloat(cols[2])];
      }
      const left = grid.children[0].getBoundingClientRect().width;
      const right = grid.children[2].getBoundingClientRect().width;
      const handleW = handle.getBoundingClientRect().width;
      return [left, handleW, right];
    }

    handle.addEventListener('pointerdown', (e) => {
      dragging = true;
      handle.setPointerCapture(e.pointerId);
      document.documentElement.style.userSelect = 'none';
      startX = e.clientX;
      const cols = getCols();
      startLeft = cols[0];
      startRight = cols[2];
    });

    function onPointerMove(e) {
      if (!dragging) return;
      const delta = e.clientX - startX;
      const minLeft = 260;
      const maxLeft = Math.min(window.innerWidth - 280, startLeft + startRight - 200);
      let newLeft = Math.max(minLeft, Math.min(maxLeft, startLeft + delta));
      let newRight = Math.max(240, startLeft + startRight - newLeft);
      grid.style.gridTemplateColumns = `${Math.round(newLeft)}px 12px ${Math.round(newRight)}px`;
    }

    function stopDrag(e) {
      if (!dragging) return;
      dragging = false;
      document.documentElement.style.userSelect = '';
      try { handle.releasePointerCapture(e.pointerId); } catch (err) {}
    }

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', stopDrag);
    window.addEventListener('pointercancel', stopDrag);

    window.addEventListener('resize', () => {
      if (window.matchMedia('(max-width:920px)').matches) {
        handle.style.display = 'none';
        grid.style.gridTemplateColumns = '1fr';
      } else {
        handle.style.display = '';
        const current = window.getComputedStyle(grid).gridTemplateColumns;
        if (current === '1fr') grid.style.gridTemplateColumns = 'minmax(300px, 1fr) 12px minmax(280px, 420px)';
      }
    });
  })();

  /* -----------------------
     Skills tooltip + animated bars
     ----------------------- */
  (function skillsUI() {
    const chips = $all('.chip[data-percent]');
    if (!chips.length) return;
    let tt = null;

    function createTooltip() {
      tt = document.createElement('div');
      tt.className = 'skill-tooltip';
      tt.style.position = 'fixed';
      tt.style.zIndex = 2200;
      tt.style.minWidth = '160px';
      tt.style.pointerEvents = 'none';
      tt.style.padding = '8px 10px';
      tt.style.borderRadius = '10px';
      tt.style.background = 'linear-gradient(180deg, rgba(6,12,30,0.9), rgba(10,18,36,0.95))';
      tt.style.color = '#fff';
      tt.style.boxShadow = '0 12px 48px rgba(6,12,30,0.6)';
      tt.innerHTML = `<div class="label" style="font-weight:800;margin-bottom:8px;"></div><div class="bar" style="height:8px;border-radius:8px;background:rgba(255,255,255,0.06);overflow:hidden"><i style="display:block;height:100%;width:0%;background:linear-gradient(90deg,var(--primary),var(--primary-2));transition:width .6s cubic-bezier(.2,.9,.3,1)"></i></div><div class="pct" style="font-weight:800;margin-top:6px;text-align:right;font-size:13px"></div>`;
      document.body.appendChild(tt);
      return tt;
    }

    function show(el) {
      if (!tt) createTooltip();
      const name = el.textContent.trim();
      const pct = Math.max(0, Math.min(100, parseInt(el.dataset.percent || 0)));
      tt.querySelector('.label').textContent = name;
      tt.querySelector('.pct').textContent = pct + '%';
      const inner = tt.querySelector('.bar > i');
      inner.style.width = '0%';

      const rect = el.getBoundingClientRect();
      const left = Math.min(window.innerWidth - 180, Math.max(8, rect.left + rect.width / 2 - 80));
      const top = Math.max(8, rect.top - 78);
      tt.style.left = left + 'px';
      tt.style.top = top + 'px';

      requestAnimationFrame(() => { inner.style.width = pct + '%'; });
      const scale = 1 + (pct / 1200);
      el.style.transform = `scale(${scale})`;
      el.style.boxShadow = '0 18px 46px rgba(78,163,255,.12)';
    }

    function hide(el) {
      if (!tt) return;
      try { tt.remove(); } catch (e) {}
      tt = null;
      el.style.transform = '';
      el.style.boxShadow = '';
    }

    chips.forEach(ch => {
      ch.addEventListener('mouseenter', () => show(ch));
      ch.addEventListener('mouseleave', () => hide(ch));
      ch.addEventListener('focus', () => show(ch));
      ch.addEventListener('blur', () => hide(ch));
      ch.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (!document.body.contains(tt)) show(ch); else hide(ch);
        }
      });
    });
  })();

  /* -----------------------
     Global Escape: close native dialogs gracefully
     ----------------------- */
  window.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    document.querySelectorAll('dialog[open]').forEach(d => {
      try { d.classList.add('closing'); } catch (err) {}
      try { d.close(); } catch (err) { d.removeAttribute('open'); }
    });
  });

  // done
})();
