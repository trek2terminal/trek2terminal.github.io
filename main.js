(() => {
  'use strict';

  const content = window.SITE_CONTENT;
  if (!content) return;

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const labels = content.labels || {};
  const titles = content.sectionTitles || {};

  document.addEventListener('DOMContentLoaded', () => {
    renderSite();
    initLoader();
    initTheme();
    initNavigation();
    initScrollProgress();
    initRevealObserver();
    initHeroTyping();
    initCounters();
    initSkillTabs();
    initProficiencyBars();
    initModals();
    initTerminal();
    initContactForm();
    initBackToTop();
    renderIcons();
  });

  function el(tag, className, attrs = {}) {
    const node = document.createElement(tag);
    if (className) node.className = className;

    Object.entries(attrs).forEach(([key, value]) => {
      if (value === null || value === undefined || value === false) return;
      if (key === 'text') {
        node.textContent = value;
        return;
      }
      if (key === 'html') {
        node.innerHTML = value;
        return;
      }
      if (key === 'style') {
        node.setAttribute('style', value);
        return;
      }
      if (key.startsWith('data') && !key.includes('-')) {
        node.dataset[key.slice(4, 5).toLowerCase() + key.slice(5)] = value;
        return;
      }
      node.setAttribute(key, value === true ? '' : value);
    });

    return node;
  }

  function append(parent, ...children) {
    children.flat().filter(Boolean).forEach((child) => {
      parent.append(child);
    });
    return parent;
  }

  function icon(name, className = '') {
    return el('i', className, { 'data-lucide': name, 'aria-hidden': 'true' });
  }

  function sectionHeading(title) {
    const wrap = el('div', 'section-heading reveal');
    append(wrap, el('h2', '', { text: title }));
    return wrap;
  }

  function externalize(anchor) {
    const href = anchor.getAttribute('href') || '';
    if (!href || href.startsWith('#') || href.startsWith('mailto:')) return anchor;
    anchor.setAttribute('target', '_blank');
    anchor.setAttribute('rel', 'noopener noreferrer');
    return anchor;
  }

  function buttonLink(text, href, variant = 'primary') {
    const anchor = el('a', `btn btn-${variant}`, { href, text });
    return externalize(anchor);
  }

  function renderIcons() {
    if (window.lucide) window.lucide.createIcons();
  }

  function renderSite() {
    renderMeta();
    renderShellText();
    renderNav();
    renderHero();
    renderWhatIDo();
    renderProjects();
    renderSkills();
    renderEducation();
    renderCertifications();
    renderExperience();
    renderAbout();
    renderContact();
    renderFooter();
    renderBackToTop();
    renderModals();
  }

  function renderMeta() {
    const meta = content.meta;
    document.title = `${meta.name} | ${meta.title} Portfolio`;
    const description = $('meta[name="description"]');
    if (description) description.setAttribute('content', `${meta.name} portfolio - ${meta.tagline}`);
    const ogTitle = $('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', `${meta.name} | ${meta.title}`);
    const ogDescription = $('meta[property="og:description"]');
    if (ogDescription) ogDescription.setAttribute('content', meta.tagline);
    const ogImage = $('meta[property="og:image"]');
    if (ogImage) ogImage.setAttribute('content', meta.avatar);

    const favicon = $('#favicon-link');
    if (favicon && meta.favicon) favicon.setAttribute('href', meta.favicon);
    const preload = $('#avatar-preload');
    if (preload && meta.avatar) preload.setAttribute('href', meta.avatar);
  }

  function renderShellText() {
    const meta = content.meta;
    $('[data-loader-mark]').textContent = meta.initials;
    $('[data-brand-initials]').textContent = meta.initials;
    $('[data-brand-name]').textContent = meta.name;
  }

  function renderNav() {
    const nav = content.nav || [];
    const desktop = $('[data-nav-links]');
    const mobile = $('[data-mobile-menu]');
    desktop.replaceChildren();
    mobile.replaceChildren();

    nav.forEach((item) => {
      desktop.append(el('a', '', { href: item.href, text: item.label, dataNavLink: 'true' }));
      mobile.append(el('a', '', { href: item.href, text: item.label, dataMobileLink: 'true' }));
    });
  }

  function renderHero() {
    const meta = content.meta;
    const section = $('#home');
    const grid = el('div', 'hero-grid');
    const copy = el('div', 'hero-copy reveal-left');
    const badge = el('p', 'availability-badge');
    append(badge, el('span', 'availability-dot'), document.createTextNode(labels.availability));

    const title = el('h1', '', { text: meta.name });
    const typing = el('p', 'typing-line');
    append(typing, el('span', '', { id: 'typing-role' }));
    const tagline = el('p', 'hero-tagline', { text: meta.tagline });

    const actions = el('div', 'button-row');
    append(
      actions,
      buttonLink(labels.viewProjects, '#projects', 'primary'),
      buttonLink(labels.downloadResume, meta.resume, 'outline'),
      buttonLink(labels.contactMe, '#contact', 'ghost')
    );

    const stats = el('div', 'stats-row', { id: 'hero-stats', 'aria-label': 'Portfolio highlights' });
    content.stats.forEach((stat) => {
      const item = el('div', 'stat-item');
      append(
        item,
        el('span', 'stat-number', { text: '0', dataCounter: stat.value }),
        el('span', 'stat-label', { text: stat.label })
      );
      stats.append(item);
    });

    append(copy, badge, title, typing, tagline, actions, stats);

    const visual = el('div', 'hero-visual reveal-right');
    const avatar = el('div', 'avatar-shell');
    avatar.append(el('img', '', {
      src: meta.avatar,
      alt: meta.avatarAlt || `Portrait of ${meta.name}`,
      width: '420',
      height: '420',
      loading: 'lazy'
    }));
    ['TensorFlow', 'Docker', 'Flask', 'PyTorch'].forEach((chip) => {
      avatar.append(el('span', 'float-chip', { text: chip }));
    });
    visual.append(avatar);

    append(grid, copy, visual);
    section.replaceChildren(grid);
  }

  function renderWhatIDo() {
    const section = $('#what-i-do');
    const inner = el('div', 'section-inner');
    const grid = el('div', 'grid-4');

    content.whatIDo.forEach((item, index) => {
      const card = el('article', 'card hover-lift reveal', { style: `transition-delay: ${index * 0.1}s` });
      append(card, icon(item.icon), el('h3', '', { text: item.title }), el('p', '', { text: item.description }));
      grid.append(card);
    });

    append(inner, sectionHeading(titles.whatIDo), grid);
    section.replaceChildren(inner);
  }

  function renderProjects() {
    const section = $('#projects');
    const inner = el('div', 'section-inner');
    const grid = el('div', 'project-grid');

    content.projects.forEach((project, index) => {
      const card = el('article', `project-card hover-lift ${index % 2 === 0 ? 'reveal-left' : 'reveal-right'}`, {
        style: `--project-gradient: linear-gradient(90deg, ${project.accentColor[0]}, ${project.accentColor[1]})`
      });
      const accent = el('div', 'project-accent');
      const body = el('div', 'project-content');
      const chips = el('div', 'chip-row');
      project.stack.forEach((tech) => chips.append(el('span', 'chip', { text: tech })));

      const highlights = el('ul', '');
      project.highlights.forEach((item) => highlights.append(el('li', '', { text: item })));

      const actions = el('div', 'project-actions');
      actions.append(el('button', 'btn btn-primary', {
        type: 'button',
        text: labels.readCaseStudy,
        dataOpenModal: `modal-${project.id}`
      }));
      project.links.forEach((link) => actions.append(buttonLink(link.label, link.url, 'outline')));

      append(body, el('h3', '', { text: project.title }), chips, el('p', '', { text: project.summary }), highlights, actions);
      append(card, accent, body);
      grid.append(card);
    });

    append(inner, sectionHeading(titles.projects), grid);
    section.replaceChildren(inner);
  }

  function renderSkills() {
    const section = $('#skills');
    const inner = el('div', 'section-inner');
    const panel = el('div', 'skills-panel reveal');
    const tabs = el('div', 'skill-tabs', { role: 'tablist', 'aria-label': 'Skill groups' });
    const list = el('div', 'skill-list', { id: 'skill-list' });
    const groups = Object.keys(content.skills);

    groups.forEach((group, index) => {
      tabs.append(el('button', `skill-tab${index === 0 ? ' active' : ''}`, {
        type: 'button',
        role: 'tab',
        'aria-selected': index === 0 ? 'true' : 'false',
        text: group,
        dataSkillGroup: group
      }));
    });

    append(panel, tabs, list);

    const proficiency = el('div', 'proficiency-panel reveal', { id: 'proficiency-panel' });
    proficiency.append(el('h3', 'sub-heading', { text: labels.keyProficiencies }));
    content.proficiency.forEach((item, index) => {
      const row = el('article', 'bar-row');
      const header = el('header');
      append(header, el('span', '', { text: item.label }), el('span', '', { text: `${item.percent}%` }));
      const track = el('div', 'bar-track');
      track.append(el('span', 'bar-fill', {
        dataProgress: item.percent,
        style: `transition-delay: ${index * 0.1}s`
      }));
      append(row, header, track);
      proficiency.append(row);
    });

    append(inner, sectionHeading(titles.skills), panel, proficiency);
    section.replaceChildren(inner);
    renderSkillList(groups[0]);
  }

  function renderSkillList(group) {
    const list = $('#skill-list');
    if (!list) return;
    list.replaceChildren();
    (content.skills[group] || []).forEach((skill) => {
      list.append(el('span', 'chip skill-chip', { text: skill }));
    });
  }

  function renderEducation() {
    const section = $('#education');
    const inner = el('div', 'section-inner');
    const timeline = el('div', 'timeline education-timeline');

    content.education.forEach((item, index) => {
      const entry = el('article', `timeline-item ${index % 2 === 0 ? 'reveal-left' : 'reveal-right'}`);
      const card = el('div', 'timeline-card hover-lift');
      append(
        card,
        el('h3', '', { text: item.institution }),
        el('p', 'accent-text', { text: item.degree }),
        el('span', 'timeline-meta', { text: `${item.period} | ${item.score}` }),
        item.link ? externalize(el('a', 'text-link', { href: item.link.url, text: `${item.link.label} \u2192` })) : null
      );
      append(entry, el('span', 'timeline-dot'), card);
      timeline.append(entry);
    });

    append(inner, sectionHeading(titles.education), timeline);
    section.replaceChildren(inner);
  }

  function renderCertifications() {
    const section = $('#certifications');
    const inner = el('div', 'section-inner');
    const grid = el('div', 'cert-grid');

    content.certifications.forEach((cert, index) => {
      const card = el('article', 'cert-card hover-lift reveal', { style: `transition-delay: ${index * 0.1}s` });
      append(
        card,
        el('span', 'issuer', { text: cert.issuer }),
        el('h3', '', { text: cert.title }),
        el('p', 'credential', { text: `ID: ${cert.credentialId}` }),
        externalize(el('a', 'text-link', { href: cert.link, text: `${labels.viewCertificate} \u2192` }))
      );
      grid.append(card);
    });

    append(inner, sectionHeading(titles.certifications), grid);
    section.replaceChildren(inner);
  }

  function renderExperience() {
    const section = $('#experience');
    const inner = el('div', 'section-inner');
    const timeline = el('div', 'timeline experience-timeline');

    content.experience.forEach((item) => {
      const entry = el('article', 'timeline-item reveal-right');
      const side = el('aside', 'experience-side');
      append(
        side,
        el('img', '', {
          src: item.logo,
          alt: item.logoAlt || `${item.company} logo`,
          width: '120',
          height: '48',
          loading: 'lazy'
        }),
        el('p', '', { text: [item.period, item.location].filter(Boolean).join(' | ') })
      );

      const card = el('div', 'timeline-card hover-lift');
      const bullets = el('ul', 'experience-list');
      item.bullets.forEach((bullet) => bullets.append(el('li', '', { text: bullet })));
      append(
        card,
        el('h3', '', { text: item.role }),
        el('p', 'accent-text', { text: item.company }),
        bullets,
        item.link ? externalize(el('a', 'text-link', { href: item.link.url, text: `${item.link.label} \u2192` })) : null
      );

      append(entry, el('span', 'timeline-dot'), side, card);
      timeline.append(entry);
    });

    append(inner, sectionHeading(titles.experience), timeline);
    section.replaceChildren(inner);
  }

  function renderAbout() {
    const section = $('#about');
    const inner = el('div', 'section-inner');
    const grid = el('div', 'about-grid');
    const copy = el('div', 'about-copy reveal-left');
    const interestRow = el('div', 'interest-row');

    content.about.interests.forEach((item) => {
      interestRow.append(el('span', 'interest-chip', { text: `${item.emoji} ${item.label}` }));
    });

    append(
      copy,
      el('p', '', { text: content.about.bio }),
      el('p', 'interests-label', { text: labels.interests }),
      interestRow,
      buttonLink(labels.downloadResume, content.meta.resume, 'primary')
    );

    const terminal = el('div', 'terminal-window reveal-right', { 'aria-label': 'Animated terminal output' });
    const top = el('div', 'terminal-top');
    append(top, el('span'), el('span'), el('span'));
    append(terminal, top, el('pre', 'terminal-output', { id: 'terminal-output' }));

    append(grid, copy, terminal);
    append(inner, sectionHeading(titles.about), grid);
    section.replaceChildren(inner);
  }

  function renderContact() {
    const section = $('#contact');
    const inner = el('div', 'section-inner');
    const grid = el('div', 'contact-grid');
    const fields = content.contact.fields;

    const form = el('form', 'contact-form reveal-left', {
      id: 'contact-form',
      action: content.contact.formAction,
      method: 'POST',
      novalidate: true
    });
    form.append(el('div', 'form-success', {
      role: 'status',
      'aria-live': 'polite',
      text: `\u2713 ${labels.successPrefix} ${content.contact.responseTime}.`
    }));
    form.append(makeField('name', fields.name, 'text', 'name'));
    form.append(makeField('email', fields.email, 'email', 'email'));
    form.append(makeField('message', fields.message, 'textarea'));
    form.append(el('button', 'btn btn-primary submit-button', {
      type: 'submit',
      html: `<span class="submit-text">${labels.sendMessage}</span>`
    }));

    const info = el('div', 'contact-info reveal-right');
    append(
      info,
      contactCard('mail', 'Email', content.meta.email, `mailto:${content.meta.email}`),
      contactCard('map-pin', 'Location', content.meta.location),
      contactCard('linkedin', 'LinkedIn', 'LinkedIn Profile', content.meta.linkedin),
      contactCard('github', 'GitHub', 'GitHub Profile', content.meta.github)
    );

    const openWrap = el('div', '');
    const openRow = el('div', 'open-row');
    content.meta.openTo.forEach((item) => openRow.append(el('span', 'interest-chip', { text: item })));
    append(openWrap, el('p', 'open-label', { text: labels.openTo }), openRow);
    info.append(openWrap);

    append(grid, form, info);
    append(inner, sectionHeading(titles.contact), grid);
    section.replaceChildren(inner);
  }

  function makeField(name, label, type, autocomplete = '') {
    const wrap = el('div', 'form-field');
    const field = type === 'textarea'
      ? el('textarea', '', { id: name, name, rows: '5', required: true })
      : el('input', '', { id: name, name, type, autocomplete, required: true });
    append(wrap, field, el('label', '', { for: name, text: label }), el('p', 'field-message', { 'aria-live': 'polite' }));
    return wrap;
  }

  function contactCard(iconName, label, value, href = '') {
    const tag = href ? 'a' : 'article';
    const card = el(tag, 'info-card hover-lift', href ? { href } : {});
    externalize(card);
    append(card, icon(iconName), append(el('div'), el('span', '', { text: label }), el('strong', '', { text: value })));
    return card;
  }

  function renderFooter() {
    const footer = $('#footer');
    const inner = el('div', 'footer-inner');
    const grid = el('div', 'footer-grid');

    const left = el('div');
    append(
      left,
      append(el('a', 'nav-brand', { href: '#home' }), el('span', 'brand-mark', { text: content.meta.initials }), el('span', 'brand-name', { text: content.meta.name })),
      el('p', '', { text: content.meta.tagline })
    );

    const quick = el('div');
    append(quick, el('h2', '', { text: labels.quickLinks }));
    content.nav.filter((item) => ['#projects', '#skills', '#contact'].includes(item.href)).forEach((item) => {
      quick.append(el('a', '', { href: item.href, text: item.label }));
    });

    const connect = el('div');
    append(
      connect,
      el('h2', '', { text: labels.connect }),
      externalize(el('a', '', { href: content.meta.linkedin, text: 'LinkedIn' })),
      externalize(el('a', '', { href: content.meta.github, text: 'GitHub' }))
    );

    const bottom = el('div', 'footer-bottom');
    append(
      bottom,
      el('span', '', { text: `\u00A9 2025 ${content.footer.copyText} - ${content.footer.builtWith}` }),
      el('a', '', { href: '#home', text: `${labels.backToTop} \u2191` })
    );

    append(grid, left, quick, connect);
    append(inner, grid, bottom);
    footer.replaceChildren(inner);
  }

  function renderBackToTop() {
    const button = $('#back-to-top');
    button.textContent = '\u2191';
  }

  function renderModals() {
    const root = $('#modal-root');
    root.replaceChildren();

    content.projects.forEach((project) => {
      const modal = el('div', 'modal', {
        id: `modal-${project.id}`,
        role: 'dialog',
        'aria-modal': 'true',
        'aria-labelledby': `modal-${project.id}-title`,
        tabindex: '-1'
      });
      const close = el('button', 'modal-close', {
        type: 'button',
        'aria-label': 'Close case study',
        text: '\u00D7',
        dataCloseModal: 'true'
      });
      modal.append(close, el('h2', '', { id: `modal-${project.id}-title`, text: project.title }));

      [
        ['Role', project.caseStudy.role],
        ['Stack', project.caseStudy.stack],
        ['Problem', project.caseStudy.problem],
        ['Build', project.caseStudy.build],
        ['Engineering Focus', project.caseStudy.engineeringFocus]
      ].forEach(([label, value]) => {
        append(modal, append(el('div', 'case-row'), el('strong', '', { text: label }), el('span', '', { text: value })));
      });

      root.append(modal);
    });
  }

  function initLoader() {
    const loader = $('#page-loader');
    const visited = sessionStorage.getItem('visited') === 'true';
    const finish = () => {
      document.body.classList.add('loaded');
      document.body.classList.remove('is-loading');
      document.dispatchEvent(new Event('portfolio:loaded'));
      window.setTimeout(() => {
        loader.style.display = 'none';
      }, 420);
    };

    if (visited || reducedMotion) {
      loader.style.display = 'none';
      document.body.classList.add('loaded');
      document.dispatchEvent(new Event('portfolio:loaded'));
      return;
    }

    document.body.classList.add('is-loading');
    window.setTimeout(() => {
      sessionStorage.setItem('visited', 'true');
      finish();
    }, 1800);
  }

  function initTheme() {
    const button = $('#theme-toggle');
    const apply = (theme) => {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
      button.setAttribute('aria-pressed', String(theme === 'light'));
      button.innerHTML = '';
      button.append(icon(theme === 'light' ? 'sun' : 'moon'));
      renderIcons();
    };

    apply(document.documentElement.getAttribute('data-theme') || 'dark');
    button.addEventListener('click', () => {
      const next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      apply(next);
    });
  }

  function initNavigation() {
    const navbar = $('#navbar');
    const toggle = $('#mobile-menu-toggle');
    const mobileMenu = $('#mobile-menu');
    const navLinks = $$('[data-nav-link], [data-mobile-link]');

    const setMenu = (open) => {
      navbar.classList.toggle('menu-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      toggle.innerHTML = '';
      toggle.append(icon(open ? 'x' : 'menu'));
      renderIcons();
    };

    setMenu(false);
    toggle.addEventListener('click', (event) => {
      event.stopPropagation();
      setMenu(!navbar.classList.contains('menu-open'));
    });

    navLinks.forEach((link) => link.addEventListener('click', () => setMenu(false)));

    document.addEventListener('click', (event) => {
      if (!navbar.classList.contains('menu-open')) return;
      if (navbar.contains(event.target) || mobileMenu.contains(event.target)) return;
      setMenu(false);
    });

    const updateHeader = () => navbar.classList.toggle('scrolled', window.scrollY > 60);
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });

    const sections = content.nav.map((item) => $(item.href)).filter(Boolean);
    const observer = new IntersectionObserver((entries) => {
      const active = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!active) return;

      navLinks.forEach((link) => {
        link.classList.toggle('nav-active', link.getAttribute('href') === `#${active.target.id}`);
      });
    }, { threshold: 0.4 });

    sections.forEach((section) => observer.observe(section));

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') setMenu(false);
    });
  }

  function initScrollProgress() {
    const bar = $('#scroll-progress-bar');
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? (window.scrollY / max) * 100 : 0;
      bar.style.width = `${Math.min(progress, 100)}%`;
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
  }

  function initRevealObserver() {
    const items = $$('.reveal, .reveal-left, .reveal-right');
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    items.forEach((item) => observer.observe(item));
  }

  function initHeroTyping() {
    const target = $('#typing-role');
    const roles = content.meta.typingRoles;
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
        window.setTimeout(tick, 60);
        return;
      }

      if (!deleting) {
        deleting = true;
        window.setTimeout(tick, 2000);
        return;
      }

      if (charIndex > 0) {
        charIndex -= 1;
        window.setTimeout(tick, 40);
        return;
      }

      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      window.setTimeout(tick, 160);
    };

    tick();
  }

  function initCounters() {
    const hero = $('#home');
    const counters = $$('[data-counter]');
    if (!hero || !counters.length) return;

    let started = false;
    let heroVisible = false;

    const animate = (node) => {
      const target = Number(node.dataset.counter || 0);
      const duration = 1500;
      const start = performance.now();

      const frame = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = progress * (2 - progress);
        node.textContent = String(Math.round(target * eased));
        if (progress < 1) requestAnimationFrame(frame);
        else node.textContent = String(target);
      };
      requestAnimationFrame(frame);
    };

    const start = () => {
      if (started || !heroVisible || !document.body.classList.contains('loaded')) return;
      started = true;
      counters.forEach((counter) => {
        counter.textContent = '0';
        animate(counter);
      });
    };

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        heroVisible = entry.isIntersecting;
        if (!heroVisible) return;
        start();
        if (started) obs.disconnect();
      });
    }, { threshold: 0.4 });

    document.addEventListener('portfolio:loaded', start, { once: true });
    observer.observe(hero);
  }

  function initSkillTabs() {
    const tabs = $$('.skill-tab');
    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        tabs.forEach((item) => {
          const active = item === tab;
          item.classList.toggle('active', active);
          item.setAttribute('aria-selected', String(active));
        });
        renderSkillList(tab.dataset.skillGroup);
      });
    });
  }

  function initProficiencyBars() {
    const panel = $('#proficiency-panel');
    const bars = $$('.bar-fill', panel);
    if (!panel || !bars.length) return;

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        bars.forEach((bar) => {
          bar.style.width = `${bar.dataset.progress}%`;
        });
        obs.disconnect();
      });
    }, { threshold: 0.25 });

    observer.observe(panel);
  }

  function initModals() {
    const overlay = $('#modal-overlay');
    const modals = $$('.modal');
    let activeModal = null;
    let lastFocused = null;

    const focusableSelector = 'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])';
    const focusables = (modal) => $$(focusableSelector, modal).filter((node) => node.offsetParent !== null);

    const closeModal = () => {
      if (!activeModal) return;
      activeModal.classList.remove('modal-open');
      overlay.classList.remove('modal-open');
      document.body.style.overflow = '';
      activeModal = null;
      lastFocused?.focus?.();
    };

    const openModal = (id) => {
      const modal = document.getElementById(id);
      if (!modal) return;
      lastFocused = document.activeElement;
      activeModal = modal;
      overlay.classList.add('modal-open');
      modal.classList.add('modal-open');
      document.body.style.overflow = 'hidden';
      (focusables(modal)[0] || modal).focus();
    };

    $$('[data-open-modal]').forEach((button) => {
      button.addEventListener('click', () => openModal(button.dataset.openModal));
    });

    overlay.addEventListener('click', closeModal);
    $$('[data-close-modal]').forEach((button) => button.addEventListener('click', closeModal));

    modals.forEach((modal) => {
      modal.addEventListener('keydown', (event) => {
        if (event.key !== 'Tab') return;
        const nodes = focusables(modal);
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
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeModal();
    });
  }

  function initTerminal() {
    const output = $('#terminal-output');
    const lines = content.about.terminalLines;
    if (!output || !lines.length) return;

    if (reducedMotion) {
      output.textContent = lines.join('\n');
      return;
    }

    let lineIndex = 0;
    let charIndex = 0;
    let currentLine = null;

    const reset = () => {
      output.replaceChildren();
      lineIndex = 0;
      charIndex = 0;
      currentLine = null;
      type();
    };

    const classify = (line) => {
      if (line.startsWith('$')) return 'terminal-command';
      if (line.includes('done') || line.includes('Ready') || line.includes('Successfully')) return 'terminal-success';
      return '';
    };

    const type = () => {
      if (lineIndex >= lines.length) {
        const cursor = el('span', 'terminal-cursor', { text: '_' });
        output.append(cursor);
        window.setTimeout(reset, 2000);
        return;
      }

      const line = lines[lineIndex];
      if (!currentLine) {
        currentLine = el('span', classify(line));
        output.append(currentLine);
      }

      currentLine.textContent = line.slice(0, charIndex);
      if (charIndex < line.length) {
        charIndex += 1;
        window.setTimeout(type, 35);
        return;
      }

      output.append(document.createTextNode('\n'));
      lineIndex += 1;
      charIndex = 0;
      currentLine = null;
      window.setTimeout(type, 180);
    };

    type();
  }

  function initContactForm() {
    const form = $('#contact-form');
    if (!form) return;

    const fields = $$('input, textarea', form);
    const button = $('.submit-button', form);
    const success = $('.form-success', form);
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    fields.forEach((field) => {
      const wrap = field.closest('.form-field');
      const sync = () => wrap.classList.toggle('filled', field.value.trim().length > 0);
      field.addEventListener('input', () => {
        sync();
        wrap.classList.remove('field-error');
        $('.field-message', wrap).textContent = '';
      });
      sync();
    });

    const validate = () => {
      let ok = true;
      fields.forEach((field) => {
        const wrap = field.closest('.form-field');
        const message = $('.field-message', wrap);
        const value = field.value.trim();
        let error = '';

        if (!value) error = 'This field is required.';
        else if (field.type === 'email' && !emailPattern.test(value)) error = 'Enter a valid email address.';

        wrap.classList.toggle('field-error', Boolean(error));
        message.textContent = error;
        if (error) ok = false;
      });
      return ok;
    };

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      success.classList.remove('show');

      if (!validate()) {
        fields.find((field) => field.closest('.form-field').classList.contains('field-error'))?.focus();
        return;
      }

      button.classList.add('loading');
      button.disabled = true;

      try {
        const action = form.getAttribute('action') || '';
        if (action.includes('REPLACE_WITH_YOUR_ID')) {
          await new Promise((resolve) => window.setTimeout(resolve, 1500));
        } else {
          const response = await fetch(action, {
            method: 'POST',
            headers: { Accept: 'application/json' },
            body: new FormData(form)
          });
          if (!response.ok) throw new Error('Form submission failed');
        }

        form.reset();
        fields.forEach((field) => field.closest('.form-field').classList.remove('filled', 'field-error'));
        success.classList.add('show');
        window.setTimeout(() => success.classList.remove('show'), 5000);
      } catch {
        const message = $('.field-message', fields[2].closest('.form-field'));
        message.textContent = 'Message could not be sent. Please email me directly.';
        fields[2].closest('.form-field').classList.add('field-error');
      } finally {
        button.classList.remove('loading');
        button.disabled = false;
      }
    });
  }

  function initBackToTop() {
    const button = $('#back-to-top');
    const update = () => button.classList.toggle('visible', window.scrollY > 400);
    button.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    update();
    window.addEventListener('scroll', update, { passive: true });
  }
})();
