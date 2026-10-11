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
const heading = document.querySelector('[data-company-heading]');

if (reel && reel.youtube) {
  cover.hidden = false;
  cover.loading = 'eager';
  P.setYouTubeImage(cover, reel.youtube);
  play.hidden = false;
  play.dataset.play = reel.id;
  play.setAttribute('aria-label', `Assistir ao demo reel ${company.name}`);
  play.querySelector('[data-company-name]').textContent = company.name;
  heading.hidden = false;
  heading.classList.add('sr-only');
  heading.textContent = company.name;
} else {
  // Sem demo reel ainda: só o nome
  play.remove();
  heading.hidden = false;
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
