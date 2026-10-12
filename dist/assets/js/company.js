const P = window.Portfolio;
const UI = window.PortfolioUI;

UI.initHeader();

// #gla, #kondzilla ou #vivencia
const slug = decodeURIComponent(window.location.hash.slice(1)) || 'gla';
const company = P.companies[slug] || P.companies.gla;
const reel = P.items[company.reel];

document.title = `${company.name} — Gustavo Nascimento`;
window.addEventListener('hashchange', () => window.location.reload());

/* ---------- Capa: demo reel da empresa ---------- */

const cover = document.querySelector('[data-company-cover]');
const play = document.querySelector('[data-company-play]');
const staticCover = document.querySelector('[data-company-static]');
const staticKicker = document.querySelector('[data-company-static-kicker]');
const staticName = document.querySelector('[data-company-static-name]');
const heading = document.querySelector('[data-company-heading]');

if (reel?.cover) {
  cover.hidden = false;
  cover.loading = 'eager';
  cover.src = reel.cover;
}

if (reel && reel.youtube) {
  play.hidden = false;
  staticCover.hidden = true;
  play.dataset.play = reel.id;
  play.setAttribute('aria-label', `Watch the ${company.name} demo reel`);
  play.querySelector('[data-company-name]').textContent = company.name;
  heading.textContent = company.name;
} else {
  // Sem demo reel reproduzível: mantém a capa enviada e mostra a identificação.
  play.remove();
  staticCover.hidden = false;
  staticKicker.hidden = true;
  staticName.textContent = company.name;
  heading.textContent = company.name;
}

/* ---------- Linhas de trabalhos por categoria ---------- */

const rows = document.querySelector('[data-company-rows]');

function buildRow(key) {
  const category = P.categories[key];
  const section = document.createElement('section');
  section.className = 'company-row';
  section.setAttribute('aria-label', category.label);
  section.innerHTML = `<div class="shell"><h2>${category.label}</h2></div>`;
  const shelf = document.createElement('div');
  shelf.className = 'work-shelf';
  if (category.shape === 'square') shelf.classList.add('is-square');
  shelf.setAttribute('aria-busy', 'true');
  shelf.replaceChildren(...UI.createLoadingCards(4, category.shape === 'square'));
  section.append(shelf);
  rows.append(section);
  UI.enhanceShelf(shelf);

  const paint = (items) => {
    const own = items.filter((item) => item.company === company.name && item.type !== 'frame');
    if (!own.length) {
      section.remove();
      return;
    }
    shelf.replaceChildren(...own.map((item, index) => UI.createShelfCard(item, index, {
      square: category.shape === 'square',
      hideTitles: category.hideTitles,
    })));
    shelf.removeAttribute('aria-busy');
  };

  P.resolveCategory(key)
    .then(paint)
    .catch(() => {
      const fallback = category.source && category.source.company === company.name
        ? [{
          id: `playlist-${key}`, title: category.label,
          company: company.name, type: 'video', playlist: category.source.playlist,
        }]
        : [];
      fallback.forEach((item) => { P.items[item.id] = item; });
      paint([...category.items, ...fallback]);
    });
}

company.categories.forEach(buildRow);

/* ---------- Experiência na empresa ---------- */

const resume = document.querySelector('[data-company-resume]');

if (resume && company.experience?.length) {
  const shell = document.createElement('div');
  shell.className = 'shell company-resume-inner';

  const heading = document.createElement('header');
  heading.className = 'company-resume-heading';
  const eyebrow = document.createElement('p');
  eyebrow.className = 'section-label';
  eyebrow.textContent = 'Experience';
  const title = document.createElement('h2');
  title.id = 'company-resume-title';
  title.textContent = company.name;
  const details = document.createElement('p');
  details.className = 'company-resume-intro';
  details.textContent = `${company.location} · ${company.summary}`;
  heading.append(eyebrow, title, details);

  const timeline = document.createElement('ol');
  timeline.className = 'company-timeline';
  company.experience.forEach((entry) => {
    const item = document.createElement('li');
    const period = document.createElement('p');
    period.className = 'company-timeline-period';
    period.textContent = entry.period;
    const body = document.createElement('div');
    body.className = 'company-timeline-body';
    const role = document.createElement('h3');
    role.textContent = entry.role;
    body.append(role);
    if (entry.bullets?.length) {
      const bullets = document.createElement('ul');
      entry.bullets.forEach((text) => {
        const bullet = document.createElement('li');
        bullet.textContent = text;
        bullets.append(bullet);
      });
      body.append(bullets);
    }
    item.append(period, body);
    timeline.append(item);
  });

  shell.append(heading, timeline);
  resume.append(shell);
} else if (resume) {
  resume.remove();
}
