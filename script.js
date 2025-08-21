// Theme toggle with persistence
const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('theme');
if (savedTheme) root.classList.toggle('light', savedTheme === 'light');
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const isLight = root.classList.toggle('light');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    themeToggle.textContent = isLight ? '☀' : '☾';
  });
  themeToggle.textContent = root.classList.contains('light') ? '☀' : '☾';
}

// Year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// helper selectors
const $all = (sel, ctx=document) => Array.from((ctx||document).querySelectorAll(sel));
const $ = (sel, ctx=document) => (ctx||document).querySelector(sel);

// Reveal on scroll (stagger nested reveals)
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const nested = el.querySelectorAll ? el.querySelectorAll('.reveal') : [];
      if (nested && nested.length > 1) {
        nested.forEach((c, i) => setTimeout(()=> c.classList.add('visible'), i * 80));
      } else {
        el.classList.add('visible');
      }
      observer.unobserve(el);
    }
  });
}, { threshold: 0.12 });

// Observe every .reveal item
$all('.reveal').forEach(el => observer.observe(el));

// --- Ensure reveal elements already in view at load get shown immediately ---
function revealOnLoadFallback() {
  document.querySelectorAll('.reveal').forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) {
      el.classList.add('visible');
    }
  });
}
// run after a small delay so layout stabilizes across browsers
setTimeout(revealOnLoadFallback, 80);

// Magnetic buttons micro-interaction
$all('.magnetic').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x / 12}px, ${y / 12}px)`;
  });
  btn.addEventListener('mouseleave', () => btn.style.transform = '');
});

// Count-up metrics
function animateCount(el) {
  const target = +el.dataset.count || 0;
  const duration = 900;
  const start = performance.now();
  function tick(now) {
    const p = Math.min((now - start) / duration, 1);
    el.textContent = Math.floor(target * (0.15 + 0.85 * p));
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
$all('.metric span').forEach(el => animateCount(el));

// Nebula parallax
const nebula = document.querySelector('.neon-nebula');
if (nebula) window.addEventListener('scroll', () => {
  const y = window.scrollY * 0.12;
  nebula.style.transform = `translateY(${y}px)`;
}, { passive: true });

// Modal logic with focus trap
function showDialog(modal) {
  if (!modal) return;
  if (!modal.open) modal.showModal();
  const closeBtn = modal.querySelector('[data-close]');
  closeBtn?.focus();

  function trap(e) {
    if (e.key === 'Tab') {
      const nodes = Array.from(modal.querySelectorAll('button, a[href], input, textarea, [tabindex]:not([tabindex="-1"])')).filter(n => !n.disabled);
      if (!nodes.length) return;
      const first = nodes[0], last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    } else if (e.key === 'Escape') closeDialog(modal);
  }

  modal.addEventListener('keydown', trap);

  const outside = (e) => {
    const rect = modal.getBoundingClientRect();
    const inside = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
    if (!inside) { closeDialog(modal); modal.removeEventListener('click', outside); }
  };
  modal.addEventListener('click', outside);
}

function closeDialog(modal) {
  if (!modal) return;
  modal.classList.add('closing');
  modal.addEventListener('animationend', () => {
    modal.classList.remove('closing');
    try { modal.close(); } catch (e) {}
  }, { once: true });
}

// bind modal triggers
[
  'modal-irctc','modal-mzi','modal-btech','modal-12th','modal-10th',
  'modal-geodata','modal-lwcs','modal-nielit','modal-quantum','modal-tcs','modal-aiml'
].forEach(id => {
  $all(`[data-modal="${id}"]`).forEach(btn => {
    const modal = document.getElementById(id);
    if (!modal) return;
    btn.addEventListener('click', () => showDialog(modal));
  });
  const modal = document.getElementById(id);
  modal?.querySelector('[data-close]')?.addEventListener('click', () => closeDialog(modal));
});

// Starfield / constellation canvas (robust & complete)
(function starfield() {
  const canvas = document.getElementById('constellation');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w = 0, h = 0, dpr = 1;
  let points = [];
  let mouse = { x: -9999, y: -9999 };
  let raf = null;

  function createPoints() {
    points = [];
    const area = (w * h) / 100000;
    const count = Math.max(20, Math.min(220, Math.floor(area * 60)));
    for (let i = 0; i < count; i++) {
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
    for (let p of points) {
      p.tw += 0.02 + Math.random() * 0.01;
      const tw = 0.45 + Math.sin(p.tw) * 0.55;
      const alpha = Math.max(0.05, Math.min(1, p.alpha * tw));
      ctx.globalAlpha = alpha * 0.95;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'white';
      ctx.fill();
      ctx.globalAlpha = 1;
      p.x += p.vx; p.y += p.vy;
      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;
      if (p.y < -10) p.y = h + 10;
      if (p.y > h + 10) p.y = -10;
    }

    const maxDist = Math.max(80, Math.min(160, (w + h) / 14));
    ctx.lineWidth = 0.9;
    for (let i = 0; i < points.length; i++) {
      const a = points[i];
      for (let j = i + 1; j < points.length; j++) {
        const b = points[j];
        const dx = a.x - b.x, dy = a.y - b.y, d2 = dx * dx + dy * dy;
        if (d2 < maxDist * maxDist) {
          const alpha = 0.12 * (1 - (Math.sqrt(d2) / maxDist));
          ctx.beginPath();
          ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
      const mdx = a.x - mouse.x, mdy = a.y - mouse.y, md2 = mdx * mdx + mdy * mdy;
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

  function loop() { draw(); raf = requestAnimationFrame(loop); }

  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 120);
  });

  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  window.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });

  resize();
  loop();
})();

// Floating back-to-top button controls
const toTop = document.getElementById('toTopBtn');
if (toTop) {
  toTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    toTop.classList.remove('show');
  });
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) toTop.classList.add('show');
    else toTop.classList.remove('show');
  });
  if (window.scrollY > 600) toTop.classList.add('show');
}

/* ---------------------------
   Contact form integration
   --------------------------- */

/*
  Uses Formspree endpoint: https://formspree.io/f/xblkvvap
  Submits with fetch, shows animated button states and toast messages.
*/

(function contactFormHandler() {
  const form = document.querySelector('.contact-form');
  if (!form) return;
  const url = form.getAttribute('action') || 'https://formspree.io/f/xblkvvap';
  const nameEl = form.querySelector('#cf-name');
  const emailEl = form.querySelector('#cf-email');
  const msgEl = form.querySelector('#cf-message');
  const submitBtn = form.querySelector('.submit-btn');
  const submitText = submitBtn.querySelector('.submit-text');
  const spinner = submitBtn.querySelector('.spinner');
  const check = submitBtn.querySelector('.check');

  // helper: set field .has-value when input has content
  function refreshFieldState(el) {
    const parent = el.closest('.field');
    if (!parent) return;
    if (String(el.value).trim().length) parent.classList.add('has-value');
    else parent.classList.remove('has-value');
  }
  [nameEl, emailEl, msgEl].forEach(i => {
    i && i.addEventListener('input', () => refreshFieldState(i));
    // initialize on load
    if (i) refreshFieldState(i);
  });

  // Create toast
  function showToast(text, success = true) {
    const t = document.createElement('div');
    t.className = 'form-toast';
    t.textContent = text;
    if (!success) t.style.background = 'linear-gradient(90deg,#ff6b6b,#ff5252)';
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 3500);
  }

  // simple validation
  function validate() {
    let ok = true;
    [nameEl, emailEl, msgEl].forEach(el => {
      const parent = el.closest('.field');
      parent && parent.classList.remove('error');
      if (!el.value || !String(el.value).trim()) {
        parent && parent.classList.add('error');
        ok = false;
      }
    });
    // basic email pattern
    if (emailEl && !/^\S+@\S+\.\S+$/.test(emailEl.value)) {
      emailEl.closest('.field')?.classList.add('error');
      ok = false;
    }
    return ok;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validate()) {
      showToast('Please fill all required fields correctly.', false);
      return;
    }

    // button loading state
    submitBtn.classList.add('loading');
    submitText.textContent = 'Sending...';

    try {
      const formData = new FormData(form);
      // Formspree accepts form data via POST
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: formData
      });

      submitBtn.classList.remove('loading');

      if (res.ok) {
        // success state
        submitBtn.classList.add('success');
        submitText.textContent = 'Sent';
        // small visual check; keep for a moment then reset
        showToast('Message sent — thanks. I will reply within 48 hours.');

        setTimeout(() => {
          submitBtn.classList.remove('success');
          submitText.textContent = 'Send message';
        }, 2000);

        form.reset();
        [nameEl, emailEl, msgEl].forEach(i => refreshFieldState(i));
      } else {
        // parse error message if possible
        let payload;
        try { payload = await res.json(); } catch (e) { payload = null; }
        const err = payload && payload.error ? payload.error : 'Something went wrong.';
        showToast('Send failed — ' + err, false);
        submitText.textContent = 'Send message';
      }
    } catch (err) {
      submitBtn.classList.remove('loading');
      showToast('Network error. Try again later.', false);
      submitText.textContent = 'Send message';
      console.error('Contact send error', err);
    }
  });

  // keyboard: Enter on textarea should not submit unintentionally; keep normal behavior
  // Accessibility: allow Enter on focused submit
})();

/* End contact form integration */

/* Skills: tooltip + animated bar + subtle scaling (unchanged) */
(function skillsUI() {
  const chips = $all('.chip[data-percent]');
  if (!chips.length) return;
  let tt = null;

  function createTooltip() {
    tt = document.createElement('div');
    tt.className = 'skill-tooltip';
    tt.innerHTML = `<span class="label"></span><div class="bar"><i></i></div><span class="pct"></span>`;
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

    requestAnimationFrame(() => {
      inner.style.width = pct + '%';
    });
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

// Close modals on global Escape
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') document.querySelectorAll('dialog[open]').forEach(d => closeDialog(d));
});
