(() => {
  "use strict";

  const content = window.SITE_CONTENT;
  if (!content) return;

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.addEventListener("DOMContentLoaded", () => {
    renderSite();
    initNavbar();
    initMobileMenu();
    initActiveLinks();
    initScrollProgress();
    initCounters();
    initRotatingTitle();
    initSectionAnimations();
    initContactForm();
    initBackToTop();
  });

  function el(tag, className = "", attrs = {}) {
    const node = document.createElement(tag);
    if (className) node.className = className;

    Object.entries(attrs).forEach(([key, value]) => {
      if (value === null || value === undefined || value === false) return;
      if (key === "text") {
        node.textContent = value;
        return;
      }
      if (key === "html") {
        node.innerHTML = value;
        return;
      }
      node.setAttribute(key, value === true ? "" : value);
    });

    return node;
  }

  function append(parent, ...children) {
    children.flat().filter(Boolean).forEach((child) => parent.append(child));
    return parent;
  }

  function externalize(anchor) {
    const href = anchor.getAttribute("href") || "";
    if (/^https?:\/\//.test(href)) {
      anchor.setAttribute("target", "_blank");
      anchor.setAttribute("rel", "noopener noreferrer");
    }
    return anchor;
  }

  function renderSite() {
    renderNav();
    renderHero();
    renderAbout();
    renderSkills();
    renderProjects();
    renderProcess();
    renderExperience();
    renderCertifications();
    renderContact();
    renderFooter();
  }

  function renderNav() {
    const nav = $("#navbar");
    const inner = el("div", "container nav-inner");
    const brand = el("a", "nav-brand", { href: "#home", "aria-label": "Subradeep Das home" });
    append(brand, el("span", "nav-logo-circle", { text: content.meta.initials }), el("span", "nav-brand-text", { text: content.meta.name }));

    const links = el("div", "nav-links", { "aria-label": "Section links" });
    content.nav.forEach((item) => {
      links.append(el("a", "", { href: item.href, text: item.label, "data-nav-link": "true" }));
    });

    const actions = el("div", "nav-actions");
    append(
      actions,
      el("a", "btn-hire", { href: "#contact", text: "Hire Me" }),
      append(el("button", "hamburger", { id: "menu-toggle", type: "button", "aria-label": "Open menu", "aria-expanded": "false" }), el("span"), el("span"), el("span"))
    );

    const mobile = el("div", "mobile-menu", { id: "mobile-menu" });
    content.nav.forEach((item) => {
      mobile.append(el("a", "", { href: item.href, text: item.label, "data-mobile-link": "true" }));
    });
    mobile.append(el("a", "mobile-hire", { href: "#contact", text: "Hire Me", "data-mobile-link": "true" }));

    append(inner, brand, links, actions);
    append(nav, inner, mobile);
  }

  function sectionHeader(label, title, subtitle = "") {
    const header = el("div", "section-header");
    append(header, el("span", "section-label", { text: label }), el("h2", "section-title", { text: title }));
    if (subtitle) header.append(el("p", "section-subtitle", { text: subtitle }));
    return header;
  }

  function renderHero() {
    const section = $("#home");
    const inner = el("div", "container hero-content");
    const layout = el("div", "hero-layout");
    const copy = el("div", "hero-copy");

    const badge = el("div", "hero-badge", { text: "Available for opportunities" });
    const name = el("h1", "hero-name");
    append(name, document.createTextNode("Subradeep"), el("br"), el("span", "gradient-text", { text: "Das" }));

    const title = el("div", "hero-title-wrapper");
    append(title, el("span", "hero-title-static", { text: "Project Coordinator " }), el("span", "hero-title-rotating"));

    const desc = el("p", "hero-desc");
    append(
      desc,
      el("span", "hero-desc-desktop", { text: content.meta.subTagline }),
      el("span", "hero-desc-mobile", { text: "ECE Graduate | C-DAC HPC-AI Certified | Practical AI and delivery work." })
    );
    const ctas = el("div", "hero-ctas");
    append(
      ctas,
      el("a", "btn-primary", { href: "#projects", text: "View My Work" }),
      el("a", "btn-secondary", { href: content.meta.resume, download: "Subradeep_Das_Resume.pdf", text: "Download CV" })
    );

    const stats = el("div", "hero-stats", { id: "hero-stats", "aria-label": "Portfolio statistics" });
    content.heroStats.forEach((stat) => {
      const item = el("div", "stat");
      append(
        item,
        append(el("div", "stat-value"), el("span", "stat-num", { "data-target": stat.value, text: "0" }), stat.suffix ? el("span", "stat-plus", { text: stat.suffix }) : null),
        el("p", "", { text: stat.label })
      );
      stats.append(item);
    });

    append(copy, badge, name, title, desc, ctas, stats);

    const visual = el("aside", "hero-visual section-animate", { "aria-label": "Professional profile visual" });
    append(
      visual,
      append(el("div", "portrait-frame"), el("img", "portrait", { src: content.meta.avatar, alt: "Portrait of Subradeep Das", width: "420", height: "520" })),
      append(
        el("div", "profile-card"),
        el("span", "profile-card-label", { text: "Current focus" }),
        el("strong", "", { text: "AI-aware project delivery" }),
        el("p", "", { text: "Coordinating people, data, and engineering decisions into shipped outcomes." })
      ),
      append(el("div", "orbit-tags"), el("span", "tag", { text: "AI/ML" }), el("span", "tag", { text: "HPC-AI" }), el("span", "tag", { text: "ECE" }))
    );

    append(layout, copy, visual);
    append(inner, layout);
    section.replaceChildren(el("div", "hero-bg-glow"), inner);
  }

  function renderAbout() {
    const section = $("#about");
    const inner = el("div", "container");
    const grid = el("div", "about-grid");
    const left = el("div", "about-copy section-animate");

    content.about.intro.forEach((paragraph) => left.append(el("p", "", { text: paragraph })));
    const quick = el("div", "quick-info");
    content.about.quickInfo.forEach((item) => {
      const row = item.href ? el("a", "quick-row", { href: item.href }) : el("div", "quick-row");
      externalize(row);
      append(row, el("span", "quick-label", { text: item.label }), el("strong", "", { text: item.value }));
      quick.append(row);
    });
    left.append(quick);

    const right = el("div", "expertise-grid");
    content.about.expertise.forEach((item) => {
      const card = el("article", "expertise-card section-animate");
      append(card, el("span", "icon", { text: item.icon }), el("h4", "", { text: item.title }), el("p", "", { text: item.text }));
      right.append(card);
    });

    append(grid, left, right);
    append(inner, sectionHeader("About", "Where management meets machine intelligence", "A practical mix of coordination, engineering fundamentals, and AI curiosity."), grid);
    section.replaceChildren(inner);
  }

  function renderSkills() {
    const section = $("#skills");
    const inner = el("div", "container");
    const grid = el("div", "skills-grid");

    content.skills.forEach((group) => {
      const card = el("article", "skill-group section-animate");
      const badges = el("div", "skill-badges");
      group.items.forEach((skill) => badges.append(el("span", "skill-badge", { text: skill })));
      append(card, el("h3", "skill-group-title", { text: group.title }), badges);
      grid.append(card);
    });

    append(inner, sectionHeader("Skills", "Tools, methods, and domains", "Grouped by how I actually use them across AI, data, deployment, and coordination."), grid);
    section.replaceChildren(inner);
  }

  function renderProjects() {
    const section = $("#projects");
    const inner = el("div", "container");
    const list = el("div", "projects-list");

    content.projects.forEach((project) => {
      const card = el("article", "project-card section-animate");
      const side = el("div", "project-side");
      append(side, el("span", "project-num", { text: project.number }));

      const body = el("div", "project-body");
      const stack = el("div", "project-stack");
      project.stack.forEach((tech) => stack.append(el("span", "skill-badge", { text: tech })));

      const actions = el("div", "project-actions");
      project.links.forEach((link) => actions.append(externalize(el("a", "btn-secondary btn-small", { href: link.href, text: link.label }))));

      append(
        body,
        append(el("div", "project-meta"), el("span", "", { text: project.period })),
        el("h3", "project-title", { text: project.title }),
        el("p", "project-desc", { text: project.description }),
        stack,
        actions
      );
      append(card, side, body);
      list.append(card);
    });

    append(inner, sectionHeader("Projects", "Selected work with real technical substance", "Two projects that connect applied ML, deployment thinking, and ECE research."), list);
    section.replaceChildren(inner);
  }

  function renderProcess() {
    const section = $("#process");
    const inner = el("div", "container");
    const grid = el("div", "process-grid");

    content.process.forEach((step, index) => {
      const card = el("article", "process-step section-animate");
      append(card, el("span", "step-number", { text: String(index + 1).padStart(2, "0") }), el("span", "step-icon", { text: step.icon }), el("h3", "", { text: step.title }), el("p", "", { text: step.text }));
      grid.append(card);
    });

    append(inner, sectionHeader("Process", "How I Work", "A structured approach to delivering results at the crossroads of technology and coordination."), grid);
    section.replaceChildren(inner);
  }

  function renderExperience() {
    const section = $("#experience");
    const inner = el("div", "container");
    const timeline = el("div", "timeline");

    content.experience.forEach((item) => {
      const card = el("article", "timeline-item section-animate");
      const title = el("h3", "");
      append(title, document.createTextNode(item.role), item.current ? el("span", "badge-current", { text: "CURRENT" }) : null);
      const bullets = el("ul", "");
      item.bullets.forEach((bullet) => bullets.append(el("li", "", { text: bullet })));
      append(card, title, el("p", "timeline-company", { text: item.company }), el("p", "timeline-meta", { text: `${item.period} | ${item.location}` }), bullets);
      timeline.append(card);
    });

    append(inner, sectionHeader("Experience", "Work that joins delivery and research", "Current coordination work plus the photonics research foundation that shaped my engineering thinking."), timeline);
    section.replaceChildren(inner);
  }

  function renderCertifications() {
    const section = $("#certifications");
    const inner = el("div", "container");
    const grid = el("div", "cert-grid");

    content.certifications.forEach((cert) => {
      const card = el("article", "cert-card section-animate");
      append(
        card,
        el("p", "cert-issuer", { text: cert.issuer }),
        el("h3", "cert-title", { text: cert.title }),
        el("p", "cert-date", { text: cert.date }),
        el("p", "cert-id", { text: `ID: ${cert.id}` }),
        externalize(el("a", "cert-link", { href: cert.link, text: "View credential" }))
      );
      grid.append(card);
    });

    append(inner, sectionHeader("Certifications", "Verified learning milestones", "Recent certificates across quantum computing, remote sensing, geodata, and professional skills."), grid);
    section.replaceChildren(inner);
  }

  function renderContact() {
    const section = $("#contact");
    const inner = el("div", "container");
    const grid = el("div", "contact-grid");
    const info = el("div", "contact-info section-animate");
    const cards = el("div", "contact-cards");

    [
      { label: "Email", value: content.meta.email, href: `mailto:${content.meta.email}` },
      { label: "LinkedIn", value: "linkedin.com/in/subradeepdas02", href: content.meta.linkedin },
      { label: "GitHub", value: "github.com/trek2terminal", href: content.meta.github }
    ].forEach((item) => {
      cards.append(externalize(append(el("a", "contact-card", { href: item.href }), el("span", "contact-label", { text: item.label }), el("strong", "", { text: item.value }))));
    });

    append(info, sectionHeader("Contact", "Let's get in touch", "Have a project, role, collaboration, or AI workflow idea? Send a note and I will respond directly."), cards);

    const form = el("form", "contact-form section-animate", { id: "contact-form", novalidate: true });
    append(
      form,
      el("input", "form-input", { id: "name", name: "name", type: "text", placeholder: "Name", autocomplete: "name", required: true, "aria-label": "Name" }),
      el("input", "form-input", { id: "email", name: "email", type: "email", placeholder: "Email", autocomplete: "email", required: true, "aria-label": "Email" }),
      el("textarea", "form-textarea", { id: "message", name: "message", placeholder: "Message", required: true, "aria-label": "Message" }),
      el("p", "form-error", { id: "form-error", role: "alert" }),
      el("button", "btn-primary", { type: "submit", text: "Send Message" })
    );

    append(grid, info, form);
    section.replaceChildren(append(inner, grid));
  }

  function renderFooter() {
    const footer = $("#footer");
    const inner = el("div", "container footer-inner");
    const grid = el("div", "footer-grid");

    const brand = el("div", "footer-col footer-brand");
    append(
      brand,
      append(el("div", "footer-logo-row"), el("span", "nav-logo-circle", { text: content.meta.initials }), el("strong", "", { text: content.meta.name })),
      el("p", "", { text: content.meta.tagline }),
      append(el("div", "footer-socials"), externalize(el("a", "", { href: content.meta.github, text: "GitHub" })), externalize(el("a", "", { href: content.meta.linkedin, text: "LinkedIn" })), el("a", "", { href: `mailto:${content.meta.email}`, text: "Email" }))
    );

    const nav = el("div", "footer-col");
    append(nav, el("h3", "", { text: "Navigation" }));
    content.nav.forEach((item) => nav.append(el("a", "", { href: item.href, text: item.label })));

    const skills = el("div", "footer-col");
    append(skills, el("h3", "", { text: "Skills" }));
    content.footerSkills.forEach((item) => skills.append(el("span", "", { text: item })));

    const location = el("div", "footer-col");
    append(location, el("h3", "", { text: "Location" }), el("p", "", { text: content.meta.location }), el("p", "", { text: "Open to Remote & Hybrid" }));

    append(grid, brand, nav, skills, location);
    append(inner, grid, el("div", "footer-bottom", { text: `Copyright ${new Date().getFullYear()} ${content.meta.name}. All rights reserved. - Crafted with HTML, CSS & JavaScript` }));
    footer.replaceChildren(inner);
  }

  function initNavbar() {
    const navbar = $("#navbar");
    const update = () => navbar.classList.toggle("scrolled", window.scrollY > 80);
    update();
    window.addEventListener("scroll", update, { passive: true });
  }

  function initMobileMenu() {
    const navbar = $("#navbar");
    const toggle = $("#menu-toggle");
    const links = $$("[data-mobile-link]");

    const setOpen = (open) => {
      navbar.classList.toggle("menu-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    };

    toggle.addEventListener("click", () => setOpen(!navbar.classList.contains("menu-open")));
    links.forEach((link) => link.addEventListener("click", () => setOpen(false)));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") setOpen(false);
    });
  }

  function initActiveLinks() {
    const links = $$("[data-nav-link]");
    const sections = content.nav.map((item) => $(item.href)).filter(Boolean);
    if (!("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver((entries) => {
      const active = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!active) return;
      links.forEach((link) => {
        const activeLink = link.getAttribute("href") === `#${active.target.id}`;
        link.classList.toggle("active", activeLink);
      });
    }, { threshold: 0.32, rootMargin: "-120px 0px -35% 0px" });

    sections.forEach((section) => observer.observe(section));
  }

  function initScrollProgress() {
    const progress = $("#scroll-progress");
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const percent = max > 0 ? (window.scrollY / max) * 100 : 0;
      progress.style.width = `${Math.min(percent, 100)}%`;
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
  }

  function initCounters() {
    const counters = $$(".stat-num");
    const run = () => {
      counters.forEach((node) => {
        const target = Number(node.dataset.target || 0);
        if (reducedMotion) {
          node.textContent = String(target);
          return;
        }
        let count = 0;
        const step = Math.max(1, Math.ceil(target / 40));
        const timer = window.setInterval(() => {
          count = Math.min(count + step, target);
          node.textContent = String(count);
          if (count >= target) window.clearInterval(timer);
        }, 40);
      });
    };

    run();
  }

  function initRotatingTitle() {
    const target = $(".hero-title-rotating");
    const roles = content.meta.roles || [];
    if (!target || !roles.length) return;
    let index = 0;

    const rotate = () => {
      target.style.opacity = "0";
      window.setTimeout(() => {
        target.textContent = roles[index % roles.length];
        target.style.opacity = "1";
        index += 1;
      }, reducedMotion ? 0 : 300);
    };

    target.style.transition = "opacity 0.3s ease";
    rotate();
    if (!reducedMotion) window.setInterval(rotate, 2800);
  }

  function initSectionAnimations() {
    const items = $$(".section-animate");
    if (!("IntersectionObserver" in window) || reducedMotion) {
      items.forEach((item) => item.classList.add("visible"));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.1 });

    items.forEach((item) => observer.observe(item));
  }

  function initContactForm() {
    const form = $("#contact-form");
    const error = $("#form-error");
    if (!form || !error) return;

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const name = $("#name").value.trim();
      const email = $("#email").value.trim();
      const message = $("#message").value.trim();

      if (!name || !email || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        error.textContent = "Please enter your name, a valid email, and a message.";
        return;
      }

      error.textContent = "";
      const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
      const body = encodeURIComponent(`${message}\n\nFrom: ${name}\nEmail: ${email}`);
      window.location.href = `mailto:${content.meta.email}?subject=${subject}&body=${body}`;
      form.reset();
    });
  }

  function initBackToTop() {
    const button = $("#back-to-top");
    const update = () => button.classList.toggle("visible", window.scrollY > 600);
    button.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" }));
    update();
    window.addEventListener("scroll", update, { passive: true });
  }
})();
