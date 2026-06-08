(() => {
  "use strict";

  const content = window.SITE_CONTENT;
  if (!content) return;

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.addEventListener("DOMContentLoaded", () => {
    renderSite();
    initLoader();
    initNavigation();
    initScrollProgress();
    initRevealObserver();
    initHeroTyping();
    initCounters();
    initModals();
    initContactForm();
    initBackToTop();
    initCursorGlow();
    initStarfield();
    renderIcons();
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
      if (key === "style") {
        node.setAttribute("style", value);
        return;
      }
      if (key.startsWith("data") && !key.includes("-")) {
        node.dataset[key.slice(4, 5).toLowerCase() + key.slice(5)] = value;
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

  function icon(name, className = "") {
    return el("i", className, { "data-lucide": name, "aria-hidden": "true" });
  }

  function renderIcons() {
    if (!window.lucide) return;
    window.lucide.createIcons();
    document.body.classList.add("icons-ready");
  }

  function externalize(anchor) {
    const href = anchor.getAttribute("href") || "";
    if (/^https?:\/\//.test(href)) {
      anchor.setAttribute("target", "_blank");
      anchor.setAttribute("rel", "noopener noreferrer");
    }
    return anchor;
  }

  function linkButton(label, href, variant = "primary", iconName = "arrow-right", attrs = {}) {
    const anchor = el("a", `btn btn-${variant}`, { href, ...attrs });
    append(anchor, icon(iconName), el("span", "", { text: label }));
    return externalize(anchor);
  }

  function sectionHeading(title, kicker = "") {
    const heading = el("div", "section-heading reveal");
    if (kicker) heading.append(el("p", "section-kicker", { text: kicker }));
    heading.append(el("h2", "", { text: title }));
    return heading;
  }

  function renderSite() {
    renderMeta();
    renderShellText();
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
    renderBackToTop();
    renderProjectModals();
  }

  function renderMeta() {
    const meta = content.meta;
    const title = `${meta.name} | ${meta.title}`;
    const description = `${meta.name} is a ${meta.title} based in ${meta.location}. ${meta.subTagline}`;

    document.title = title;

    [
      ['meta[name="description"]', description],
      ['meta[property="og:title"]', title],
      ['meta[property="og:description"]', meta.subTagline],
      ['meta[property="og:image"]', meta.avatar],
      ['meta[name="twitter:title"]', title],
      ['meta[name="twitter:description"]', meta.subTagline],
      ['meta[name="twitter:image"]', meta.avatar]
    ].forEach(([selector, value]) => {
      const node = $(selector);
      if (node) node.setAttribute("content", value);
    });

    const favicon = $("#favicon-link");
    if (favicon) favicon.setAttribute("href", meta.favicon);
    const preload = $("#avatar-preload");
    if (preload) preload.setAttribute("href", meta.avatar);
  }

  function renderShellText() {
    const meta = content.meta;
    $("[data-loader-mark]").textContent = meta.initials;
    $("[data-brand-initials]").textContent = meta.initials;
    $("[data-brand-name]").textContent = meta.name;
  }

  function renderNav() {
    const desktop = $("[data-nav-links]");
    const mobile = $("[data-mobile-menu]");
    desktop.replaceChildren();
    mobile.replaceChildren();

    content.nav.forEach((item) => {
      desktop.append(el("a", "", { href: item.href, text: item.label, dataNavLink: "true" }));
      mobile.append(el("a", "", { href: item.href, text: item.label, dataMobileLink: "true" }));
    });
  }

  function renderHero() {
    const meta = content.meta;
    const section = $("#home");
    const inner = el("div", "hero-inner");
    const canvas = el("canvas", "hero-canvas", { id: "hero-canvas", "aria-hidden": "true" });
    const copy = el("div", "hero-copy reveal-left");
    const visual = el("aside", "hero-visual reveal-right", { "aria-label": `${meta.name} portrait and professional focus areas` });

    const badge = el("p", "availability-badge");
    append(badge, el("span", "availability-dot"), el("span", "", { text: content.labels.availability }));

    const title = el("h1", "", { text: meta.name });
    const role = el("p", "hero-role", { text: meta.title });
    const typing = el("p", "typing-line");
    append(typing, el("span", "", { id: "typing-role" }));
    const sub = el("p", "hero-subtagline");
    append(
      sub,
      el("span", "desktop-copy", { text: meta.subTagline }),
      el("span", "mobile-copy", { text: "ECE Graduate | C-DAC HPC-AI Certified | AI, data, and practical problem solving" })
    );

    const actions = el("div", "button-row");
    append(
      actions,
      linkButton(content.labels.viewWork, "#projects", "primary", "briefcase"),
      linkButton(content.labels.downloadResume, meta.resume, "outline", "file-down", { download: "Subradeep_Das_Resume.pdf" }),
      linkButton(content.labels.contactMe, "#contact", "ghost", "send")
    );

    const stats = el("div", "stats-grid", { id: "hero-stats", "aria-label": "Portfolio highlights" });
    content.stats.forEach((stat) => {
      const item = el("article", "stat-card");
      append(
        item,
        el("span", "stat-number", { text: `0${stat.suffix}`, dataCounter: stat.value, dataSuffix: stat.suffix }),
        el("span", "stat-label", { text: stat.label })
      );
      stats.append(item);
    });

    append(copy, badge, title, role, typing, sub, actions, stats);

    const portrait = el("div", "portrait-panel");
    append(
      portrait,
      el("img", "portrait-image", {
        src: meta.avatar,
        alt: meta.avatarAlt,
        width: "420",
        height: "520",
        loading: "eager"
      }),
      append(
        el("div", "portrait-caption"),
        el("span", "", { text: "Current Role" }),
        el("strong", "", { text: "Project Coordinator at Codebucket Solutions" })
      )
    );

    const focus = el("div", "focus-stack");
    ["AI/ML", "HPC-AI", "Project Delivery", "ECE"].forEach((item) => {
      focus.append(el("span", "", { text: item }));
    });

    append(visual, portrait, focus);
    append(inner, canvas, copy, visual);
    section.replaceChildren(inner);
  }

  function renderAbout() {
    const section = $("#about");
    const inner = el("div", "section-inner");
    const layout = el("div", "about-layout");
    const copy = el("div", "about-copy reveal-left");
    const quick = el("aside", "quick-panel reveal-right", { "aria-label": content.labels.quickInfo });

    content.about.intro.forEach((paragraph) => copy.append(el("p", "", { text: paragraph })));
    append(
      copy,
      append(
        el("div", "interest-row"),
        ...content.about.interests.map((item) => el("span", "interest-chip", { text: item }))
      )
    );

    append(quick, el("h3", "", { text: content.labels.quickInfo }));
    content.about.quickInfo.forEach((item) => {
      const tag = item.href ? "a" : "article";
      const card = el(tag, "quick-row", item.href ? { href: item.href } : {});
      externalize(card);
      append(
        card,
        icon(item.icon),
        append(el("span", ""), el("small", "", { text: item.label }), el("strong", "", { text: item.value }))
      );
      quick.append(card);
    });

    append(layout, copy, quick);

    const expertise = el("div", "expertise-grid");
    content.about.expertise.forEach((item, index) => {
      const card = el("article", "expertise-card reveal", { style: `transition-delay: ${index * 60}ms` });
      append(card, icon(item.icon), el("h3", "", { text: item.title }), el("p", "", { text: item.description }));
      expertise.append(card);
    });

    append(inner, sectionHeading(content.sectionTitles.about, "Who I am"), layout, sectionHeading(content.labels.coreExpertise), expertise);
    section.replaceChildren(inner);
  }

  function renderSkills() {
    const section = $("#skills");
    const inner = el("div", "section-inner");
    const grid = el("div", "skills-grid");

    content.skills.forEach((group, index) => {
      const card = el("article", "skill-card reveal", { style: `transition-delay: ${index * 80}ms` });
      const chips = el("div", "chip-row");
      group.items.forEach((skill) => chips.append(el("span", "chip", { text: skill })));
      append(card, append(el("div", "card-title-row"), icon(group.icon), el("h3", "", { text: group.title })), chips);
      grid.append(card);
    });

    append(inner, sectionHeading(content.sectionTitles.skills, "Tools I use"), grid);
    section.replaceChildren(inner);
  }

  function renderProjects() {
    const section = $("#projects");
    const inner = el("div", "section-inner");
    const grid = el("div", "project-grid");

    content.projects.forEach((project, index) => {
      const card = el("article", `project-card ${index % 2 === 0 ? "reveal-left" : "reveal-right"}`);
      const top = el("div", "project-top");
      append(
        top,
        el("span", "project-eyebrow", { text: project.eyebrow }),
        el("span", "project-period", { text: project.period })
      );

      const chips = el("div", "chip-row");
      project.stack.forEach((tech) => chips.append(el("span", "chip tech-chip", { text: tech })));

      const highlights = el("ul", "project-highlights");
      project.highlights.forEach((item) => highlights.append(el("li", "", { text: item })));

      const actions = el("div", "project-actions");
      const caseButton = el("button", "btn btn-primary", { type: "button", dataOpenModal: `modal-${project.id}` });
      append(caseButton, icon("book-open"), el("span", "", { text: content.labels.readCaseStudy }));
      actions.append(caseButton);
      project.links.forEach((link) => actions.append(linkButton(link.label, link.url, "outline", link.icon || "external-link")));

      append(card, top, el("h3", "", { text: project.title }), el("p", "project-summary", { text: project.summary }), chips, highlights, actions);
      grid.append(card);
    });

    append(inner, sectionHeading(content.sectionTitles.projects, "Proof of work"), grid);
    section.replaceChildren(inner);
  }

  function renderProcess() {
    const section = $("#process");
    const inner = el("div", "section-inner");
    const grid = el("div", "process-grid");

    content.process.forEach((step, index) => {
      const card = el("article", "process-card reveal", { style: `transition-delay: ${index * 80}ms` });
      append(card, el("span", "process-number", { text: String(index + 1).padStart(2, "0") }), el("h3", "", { text: step.title }), el("p", "", { text: step.description }));
      grid.append(card);
    });

    append(
      inner,
      sectionHeading(content.sectionTitles.process, "A structured approach to delivering results at the crossroads of technology and coordination"),
      grid
    );
    section.replaceChildren(inner);
  }

  function renderExperience() {
    const section = $("#experience");
    const inner = el("div", "section-inner");
    const work = el("div", "experience-column reveal-left");
    const education = el("div", "education-column reveal-right");

    append(work, append(el("div", "column-heading"), icon("briefcase"), el("h3", "", { text: "Work Experience" })));
    const timeline = el("div", "work-timeline");
    content.experience.forEach((item) => {
      const card = el("article", "experience-card");
      const logo = el("img", "", {
        src: item.logo,
        alt: item.logoAlt,
        width: "56",
        height: "56",
        loading: "lazy"
      });
      const bullets = el("ul", "detail-list");
      item.bullets.forEach((bullet) => bullets.append(el("li", "", { text: bullet })));
      append(
        card,
        append(
          el("header", "experience-header"),
          logo,
          append(
            el("div", ""),
            el("span", "timeline-meta", { text: `${item.period} | ${item.location}` }),
            el("h4", "", { text: item.role }),
            el("p", "", { text: item.company })
          )
        ),
        bullets
      );
      timeline.append(card);
    });
    work.append(timeline);

    append(education, append(el("div", "column-heading"), icon("graduation-cap"), el("h3", "", { text: "Education" })));
    const eduGrid = el("div", "education-list");
    content.education.forEach((item) => {
      const card = el("article", "education-card");
      append(
        card,
        el("span", "timeline-meta", { text: item.year }),
        el("h4", "", { text: item.degree }),
        el("p", "", { text: item.institute }),
        el("strong", "", { text: item.score }),
        item.link ? externalize(el("a", "text-link", { href: item.link, text: "View document" })) : null
      );
      eduGrid.append(card);
    });
    education.append(eduGrid);

    append(inner, sectionHeading(content.sectionTitles.experience, "Work and learning timeline"), append(el("div", "experience-layout"), work, education));
    section.replaceChildren(inner);
  }

  function renderCertifications() {
    const section = $("#certifications");
    const inner = el("div", "section-inner");
    const grid = el("div", "cert-grid");

    content.certifications.forEach((cert, index) => {
      const card = el("article", "cert-card reveal", { style: `transition-delay: ${index * 70}ms` });
      append(
        card,
        append(el("div", "cert-icon"), icon("award")),
        el("span", "cert-date", { text: cert.date }),
        el("h3", "", { text: cert.title }),
        el("p", "", { text: cert.issuer }),
        el("small", "", { text: `Credential ID: ${cert.credentialId}` }),
        externalize(el("a", "text-link", { href: cert.link, text: content.labels.viewCredential }))
      );
      grid.append(card);
    });

    append(inner, sectionHeading(content.sectionTitles.certifications, "Verified learning"), grid);
    section.replaceChildren(inner);
  }

  function renderContact() {
    const section = $("#contact");
    const inner = el("div", "section-inner");
    const grid = el("div", "contact-grid");
    const form = el("form", "contact-form reveal-left", { id: "contact-form", novalidate: true });
    const fields = content.contact.fields;

    append(
      form,
      el("h3", "", { text: "Send a Message" }),
      el("p", "", { text: `I usually respond within ${content.contact.responseTime}.` }),
      el("div", "form-success", { role: "status", "aria-live": "polite" }),
      makeField("name", fields.name, "text", "name"),
      makeField("email", fields.email, "email", "email"),
      makeField("message", fields.message, "textarea"),
      append(el("button", "btn btn-primary submit-button", { type: "submit" }), icon("send"), el("span", "", { text: content.labels.sendMessage }))
    );

    const info = el("aside", "contact-panel reveal-right");
    append(
      info,
      el("h3", "", { text: "Reach Me Directly" }),
      contactLink("mail", "Email", content.meta.email, `mailto:${content.meta.email}`),
      contactLink("phone", "Phone", content.meta.phone, `tel:${content.meta.phone.replace(/[^+\d]/g, "")}`),
      contactLink("linkedin", "LinkedIn", "linkedin.com/in/subradeepdas02", content.meta.linkedin),
      contactLink("github", "GitHub", "github.com/trek2terminal", content.meta.github),
      linkButton(content.labels.downloadResume, content.meta.resume, "outline", "file-down", { download: "Subradeep_Das_Resume.pdf" })
    );

    append(grid, form, info);
    append(inner, sectionHeading(content.sectionTitles.contact, "Let's build something useful"), grid);
    section.replaceChildren(inner);
  }

  function makeField(name, label, type, autocomplete = "") {
    const wrap = el("div", "form-field");
    const field = type === "textarea"
      ? el("textarea", "", { id: name, name, rows: "5", required: true })
      : el("input", "", { id: name, name, type, autocomplete, required: true });
    append(wrap, field, el("label", "", { for: name, text: label }), el("p", "field-message", { "aria-live": "polite" }));
    return wrap;
  }

  function contactLink(iconName, label, value, href) {
    const card = el("a", "contact-link", { href, "aria-label": `${label}: ${value}` });
    externalize(card);
    append(card, icon(iconName), append(el("span", ""), el("small", "", { text: label }), el("strong", "", { text: value })));
    return card;
  }

  function renderFooter() {
    const footer = $("#footer");
    const inner = el("div", "footer-inner");
    const links = el("div", "footer-links");
    ["#about", "#skills", "#projects", "#process", "#experience", "#certifications", "#contact"].forEach((href) => {
      const label = href.slice(1).replace("-", " ");
      links.append(el("a", "", { href, text: label[0].toUpperCase() + label.slice(1) }));
    });

    append(
      inner,
      append(el("div", "footer-brand"), el("span", "brand-mark", { text: content.meta.initials }), el("strong", "", { text: content.meta.name }), el("p", "", { text: content.labels.builtWith })),
      links,
      append(el("div", "footer-social"), externalize(el("a", "", { href: content.meta.linkedin, text: "LinkedIn" })), externalize(el("a", "", { href: content.meta.github, text: "GitHub" }))),
      el("p", "footer-copy", { text: `Copyright ${new Date().getFullYear()} ${content.meta.name}. All rights reserved.` })
    );

    footer.replaceChildren(inner);
  }

  function renderBackToTop() {
    const button = $("#back-to-top");
    button.replaceChildren(icon("arrow-up"));
  }

  function renderProjectModals() {
    const root = $("#modal-root");
    root.replaceChildren();

    content.projects.forEach((project) => {
      const modal = el("div", "modal", {
        id: `modal-${project.id}`,
        role: "dialog",
        "aria-modal": "true",
        "aria-labelledby": `modal-${project.id}-title`,
        tabindex: "-1"
      });
      const close = el("button", "modal-close", { type: "button", "aria-label": "Close case study", dataCloseModal: "true" });
      close.append(icon("x"));
      append(modal, close, el("h2", "", { id: `modal-${project.id}-title`, text: project.title }));
      Object.entries(project.caseStudy).forEach(([label, value]) => {
        append(modal, append(el("div", "case-row"), el("strong", "", { text: label }), el("span", "", { text: value })));
      });
      root.append(modal);
    });
  }

  function initLoader() {
    const loader = $("#page-loader");
    const finish = () => {
      document.body.classList.add("loaded");
      window.setTimeout(() => {
        if (loader) loader.style.display = "none";
      }, 320);
    };
    if (reducedMotion) {
      finish();
      return;
    }
    window.setTimeout(finish, 650);
  }

  function initNavigation() {
    const navbar = $("#navbar");
    const toggle = $("#mobile-menu-toggle");
    const navLinks = $$("[data-nav-link], [data-mobile-link]");

    const setMenu = (open) => {
      navbar.classList.toggle("menu-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      toggle.replaceChildren(icon(open ? "x" : "menu"));
      renderIcons();
    };

    setMenu(false);
    toggle.addEventListener("click", (event) => {
      event.stopPropagation();
      setMenu(!navbar.classList.contains("menu-open"));
    });
    navLinks.forEach((link) => link.addEventListener("click", () => setMenu(false)));

    document.addEventListener("click", (event) => {
      if (!navbar.classList.contains("menu-open") || navbar.contains(event.target)) return;
      setMenu(false);
    });

    const updateHeader = () => navbar.classList.toggle("scrolled", window.scrollY > 20);
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });

    const sections = content.nav.map((item) => $(item.href)).filter(Boolean);
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries) => {
        const active = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!active) return;
        navLinks.forEach((link) => {
          link.classList.toggle("nav-active", link.getAttribute("href") === `#${active.target.id}`);
        });
      }, { threshold: 0.35 });
      sections.forEach((section) => observer.observe(section));
    }

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") setMenu(false);
    });
  }

  function initScrollProgress() {
    const bar = $("#scroll-progress-bar");
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? (window.scrollY / max) * 100 : 0;
      bar.style.width = `${Math.min(progress, 100)}%`;
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
  }

  function initRevealObserver() {
    const items = $$(".reveal, .reveal-left, .reveal-right");
    if (!("IntersectionObserver" in window) || reducedMotion) {
      items.forEach((item) => item.classList.add("revealed"));
      return;
    }
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("revealed");
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -50px 0px" });
    items.forEach((item) => observer.observe(item));
  }

  function initHeroTyping() {
    const target = $("#typing-role");
    const roles = window.innerWidth < 520 && content.meta.typingRolesMobile
      ? content.meta.typingRolesMobile
      : content.meta.typingRoles || [];
    if (!target || !roles.length) return;
    if (reducedMotion) {
      target.textContent = roles[0];
      return;
    }

    let roleIndex = 0;
    let charIndex = 0;
    let deleting = false;

    const tick = () => {
      const role = roles[roleIndex];
      target.textContent = role.slice(0, charIndex);

      if (!deleting && charIndex < role.length) {
        charIndex += 1;
        window.setTimeout(tick, 58);
        return;
      }
      if (!deleting) {
        deleting = true;
        window.setTimeout(tick, 1800);
        return;
      }
      if (charIndex > 0) {
        charIndex -= 1;
        window.setTimeout(tick, 34);
        return;
      }
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      window.setTimeout(tick, 220);
    };

    tick();
  }

  function initCounters() {
    const counters = $$("[data-counter]");
    if (!counters.length) return;
    let started = false;

    const animate = (node) => {
      const target = Number(node.dataset.counter || 0);
      const suffix = node.dataset.suffix || "";
      const duration = 1300;
      const start = performance.now();

      const frame = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        node.textContent = `${Math.round(target * eased)}${suffix}`;
        if (progress < 1) requestAnimationFrame(frame);
        else node.textContent = `${target}${suffix}`;
      };
      requestAnimationFrame(frame);
    };

    const start = () => {
      if (started) return;
      started = true;
      counters.forEach(animate);
    };

    if (!("IntersectionObserver" in window) || reducedMotion) {
      start();
      return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        start();
        obs.disconnect();
      }
    }, { threshold: 0.35 });
    observer.observe($("#hero-stats"));
  }

  function initModals() {
    const overlay = $("#modal-overlay");
    let activeModal = null;
    let lastFocused = null;
    const focusableSelector = 'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])';

    const closeModal = () => {
      if (!activeModal) return;
      activeModal.classList.remove("modal-open");
      overlay.classList.remove("modal-open");
      document.body.style.overflow = "";
      activeModal.setAttribute("aria-hidden", "true");
      activeModal = null;
      lastFocused?.focus?.();
    };

    const openModal = (id) => {
      const modal = document.getElementById(id);
      if (!modal) return;
      lastFocused = document.activeElement;
      activeModal = modal;
      overlay.classList.add("modal-open");
      modal.classList.add("modal-open");
      modal.removeAttribute("aria-hidden");
      document.body.style.overflow = "hidden";
      ($$(focusableSelector, modal)[0] || modal).focus();
    };

    $$("[data-open-modal]").forEach((button) => button.addEventListener("click", () => openModal(button.dataset.openModal)));
    $$("[data-close-modal]").forEach((button) => button.addEventListener("click", closeModal));
    overlay.addEventListener("click", closeModal);

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeModal();
      if (event.key !== "Tab" || !activeModal) return;

      const nodes = $$(focusableSelector, activeModal).filter((node) => node.offsetParent !== null);
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
  }

  function initContactForm() {
    const form = $("#contact-form");
    if (!form) return;

    const fields = $$("input, textarea", form);
    const success = $(".form-success", form);
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    fields.forEach((field) => {
      const wrap = field.closest(".form-field");
      const sync = () => wrap.classList.toggle("filled", field.value.trim().length > 0);
      field.addEventListener("input", () => {
        sync();
        wrap.classList.remove("field-error");
        $(".field-message", wrap).textContent = "";
      });
      sync();
    });

    const validate = () => {
      let ok = true;
      fields.forEach((field) => {
        const wrap = field.closest(".form-field");
        const message = $(".field-message", wrap);
        const value = field.value.trim();
        let error = "";

        if (!value) error = "This field is required.";
        else if (field.type === "email" && !emailPattern.test(value)) error = "Enter a valid email address.";

        wrap.classList.toggle("field-error", Boolean(error));
        message.textContent = error;
        if (error) ok = false;
      });
      return ok;
    };

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      success.classList.remove("show");
      if (!validate()) {
        fields.find((field) => field.closest(".form-field").classList.contains("field-error"))?.focus();
        return;
      }

      const name = $("#name", form).value.trim();
      const email = $("#email", form).value.trim();
      const message = $("#message", form).value.trim();
      const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
      const body = encodeURIComponent(`${message}\n\nFrom: ${name}\nEmail: ${email}`);
      window.location.href = `mailto:${content.meta.email}?subject=${subject}&body=${body}`;

      success.textContent = "Your message is ready in your email client. Thank you for reaching out.";
      success.classList.add("show");
      form.reset();
      fields.forEach((field) => field.closest(".form-field").classList.remove("filled", "field-error"));
    });
  }

  function initBackToTop() {
    const button = $("#back-to-top");
    const update = () => button.classList.toggle("visible", window.scrollY > 500);
    button.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" }));
    update();
    window.addEventListener("scroll", update, { passive: true });
  }

  function initCursorGlow() {
    const glow = $("#cursor-glow");
    if (!glow || reducedMotion || window.matchMedia("(pointer: coarse)").matches) return;

    let raf = null;
    let x = 0;
    let y = 0;

    window.addEventListener("pointermove", (event) => {
      x = event.clientX;
      y = event.clientY;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        glow.style.transform = `translate(${x}px, ${y}px)`;
        raf = null;
      });
    }, { passive: true });
  }

  function initStarfield() {
    const canvas = $("#hero-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let width = 0;
    let height = 0;
    let dpr = 1;
    let points = [];
    let raf = null;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(320, rect.width);
      height = Math.max(320, rect.height);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.max(42, Math.min(120, Math.floor((width * height) / 14000)));
      points = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 0.6 + Math.random() * 1.5,
        alpha: 0.2 + Math.random() * 0.75,
        vx: (Math.random() - 0.5) * 0.08,
        vy: (Math.random() - 0.5) * 0.08
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      points.forEach((point) => {
        point.x += point.vx;
        point.y += point.vy;
        if (point.x < 0) point.x = width;
        if (point.x > width) point.x = 0;
        if (point.y < 0) point.y = height;
        if (point.y > height) point.y = 0;

        ctx.beginPath();
        ctx.fillStyle = `rgba(240, 246, 252, ${point.alpha})`;
        ctx.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      for (let i = 0; i < points.length; i += 1) {
        for (let j = i + 1; j < points.length; j += 1) {
          const a = points[i];
          const b = points[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance > 120) continue;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0, 212, 255, ${0.12 * (1 - distance / 120)})`;
          ctx.lineWidth = 1;
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    };

    const loop = () => {
      draw();
      raf = requestAnimationFrame(loop);
    };

    resize();
    draw();
    if (!reducedMotion) loop();
    window.addEventListener("resize", () => {
      if (raf) cancelAnimationFrame(raf);
      resize();
      draw();
      if (!reducedMotion) loop();
    }, { passive: true });
  }
})();
