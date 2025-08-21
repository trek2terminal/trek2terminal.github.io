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

// Simple helper to safely query
const $all = (sel) => Array.from(document.querySelectorAll(sel));

// Reveal on scroll with small stagger
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const el = entry.target;
      // apply small stagger if element contains multiple reveal children
      const children = el.querySelectorAll ? el.querySelectorAll('.reveal') : [];
      if (children.length > 1) {
        children.forEach((c, i) => {
          setTimeout(() => c.classList.add('visible'), i * 80);
        });
      } else {
        el.classList.add('visible');
      }
      observer.unobserve(el);
    }
  });
}, { threshold: 0.12 });

// Observe every .reveal item (root-level and nested)
$all('.reveal').forEach((el) => observer.observe(el));

// Magnetic button micro-interaction (gentle)
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

// Gentle parallax on nebula
const nebula = document.querySelector('.neon-nebula');
if (nebula) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY * 0.12;
    nebula.style.transform = `translateY(${y}px)`;
  }, { passive: true });
}

// Modals with animation + focus trap
function showDialog(modal) {
  if (!modal) return;
  if (!modal.open) modal.showModal();
  const closeBtn = modal.querySelector('[data-close]');
  closeBtn?.focus();

  function trap(e) {
    if (e.key === 'Tab') {
      const nodes = Array.from(modal.querySelectorAll('button, a[href], input, textarea, [tabindex]:not([tabindex="-1"])')).filter(el => !el.disabled);
      if (!nodes.length) return;
      const first = nodes[0], last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    } else if (e.key === 'Escape') {
      closeDialog(modal);
    }
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
    try { modal.close(); } catch (e) { /* ignore */ }
  }, { once: true });
}

// Bind data-modal triggers and add close handlers
['modal-irctc','modal-mzi','modal-btech','modal-12th','modal-10th','modal-geodata','modal-lwcs','modal-nielit','modal-quantum','modal-tcs','modal-aiml'].forEach(id => {
  $all(`[data-modal="${id}"]`).forEach(btn => {
    const modal = document.getElementById(id);
    if (!modal) return;
    btn.addEventListener('click', () => showDialog(modal));
  });
  const modal = document.getElementById(id);
  modal?.querySelector('[data-close]')?.addEventListener('click', () => closeDialog(modal));
});

// Interactive starfield (robust)
(function starfield() {
  const canvas = document.getElementById('constellation');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w = 0, h = 0, dpr = 1;
  let points = [];
  let mouse = { x: -9999, y: -9999 };
  let raf = null;
  const maxPointsPer100k = 60; // density

  function createPoints() {
    points = [];
    const area = (w * h) / 100000;
    const count = Math.max(20, Math.min(220, Math.floor(area * maxPointsPer100k)));
    for (let i = 0; i < count; i++) {
      points.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.5 + Math.random() * 1.6,
        alpha: 0.12 + Math.random() * 0.85,
        tw: Math.random() * Math.PI * 2,
        vx: (Math.random() - 0.5) * 0.07,
        vy: (Math.random() - 0.5) * 0.07
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
    for (let p of points) {
      p.tw += 0.02 + Math.random() * 0.01;
      const twinkle = 0.45 + Math.sin(p.tw) * 0.55;
      const alpha = Math.max(0.05, Math.min(1, p.alpha * twinkle));
      ctx.beginPath();
      ctx.globalAlpha = alpha * 0.95;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'white';
      ctx.fill();
      ctx.globalAlpha = 1;
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;
      if (p.y < -10) p.y = h + 10;
      if (p.y > h + 10) p.y = -10;
    }

    // draw lines
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

  // throttle resize
  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 120);
  });

  // mouse tracking
  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  window.addEventListener('mouseleave', () => {
    mouse.x = -9999;
    mouse.y = -9999;
  });

  // initialize
  resize();
  loop();
})();

// Optional: ensure modals close on ESC from anywhere
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('dialog[open]').forEach(d => closeDialog(d));
  }
});
