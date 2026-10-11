const P = window.Portfolio;
const UI = window.PortfolioUI;

/* ---------- Header e menu ---------- */

UI.initHeader();

const menuToggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('.site-nav');

function setMenu(open) {
  if (!menuToggle || !menu) return;
  menuToggle.setAttribute('aria-expanded', String(open));
  menu.classList.toggle('is-open', open);
  document.body.classList.toggle('menu-open', open);
}

menuToggle?.addEventListener('click', () => {
  setMenu(menuToggle.getAttribute('aria-expanded') !== 'true');
});

menu?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => setMenu(false));
});

/* ---------- Imagens do YouTube no HTML ---------- */

document.querySelectorAll('[data-yt-thumb]').forEach((img) => {
  P.setYouTubeImage(img, img.dataset.ytThumb);
  if (img.classList.contains('cover-bg')) img.loading = 'eager';
});

document.querySelectorAll('[data-yt-frame]').forEach((img) => {
  P.frameImage(img, img.dataset.ytFrame, Number(img.dataset.frameIndex) || 1);
});

/* ---------- Catálogo em abas ---------- */

const workTabs = [...document.querySelectorAll('[data-category]')];
const workShelf = document.querySelector('[data-work-shelf]');
let activeCategory = workTabs[0]?.dataset.category || 'youtube';
let renderToken = 0;

UI.enhanceShelf(workShelf);

function updateTabs(categoryKey, focusTab) {
  workTabs.forEach((tab) => {
    const selected = tab.dataset.category === categoryKey;
    tab.classList.toggle('is-active', selected);
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
    if (selected && focusTab) tab.focus();
    if (selected) {
      // Mantém a aba ativa visível no celular sem mover a página na vertical
      const strip = tab.parentElement;
      const left = tab.offsetLeft - strip.offsetLeft;
      if (left < strip.scrollLeft || left + tab.offsetWidth > strip.scrollLeft + strip.clientWidth) {
        strip.scrollTo({ left: Math.max(0, left - 16), behavior: 'smooth' });
      }
    }
  });
}

function renderCategory(categoryKey, focusTab = false) {
  const category = P.categories[categoryKey];
  if (!category || !workShelf) return;
  activeCategory = categoryKey;
  const token = ++renderToken;
  const square = category.shape === 'square';

  updateTabs(categoryKey, focusTab);
  workShelf.classList.toggle('is-square', square);
  workShelf.scrollTo({ left: 0 });

  const paint = (items) => {
    if (token !== renderToken) return;
    workShelf.replaceChildren(...items.map((item, index) => UI.createShelfCard(item, index, {
      square,
      hideTitles: category.hideTitles,
    })));
    workShelf.removeAttribute('aria-busy');
  };

  if (!category.source) {
    paint(category.items);
    return;
  }

  // Categoria alimentada por playlist do YouTube
  workShelf.setAttribute('aria-busy', 'true');
  workShelf.replaceChildren(
    ...category.items.map((item, index) => UI.createShelfCard(item, index, {
      square,
      hideTitles: category.hideTitles,
    })),
    ...UI.createLoadingCards(4, square),
  );

  P.resolveCategory(categoryKey)
    .then(paint)
    .catch(() => {
      if (token !== renderToken) return;
      // Sem acesso à lista: um card abre a playlist completa no pop-up
      const fallback = {
        id: `playlist-${categoryKey}`,
        title: category.label,
        company: category.source.company,
        category: category.label,
        categoryKey,
        type: 'video',
        playlist: category.source.playlist,
      };
      P.items[fallback.id] = fallback;
      paint([...category.items, fallback]);
    });
}

workTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => renderCategory(tab.dataset.category));
  tab.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    let nextIndex = index;
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % workTabs.length;
    if (event.key === 'ArrowLeft') nextIndex = (index - 1 + workTabs.length) % workTabs.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = workTabs.length - 1;
    renderCategory(workTabs[nextIndex].dataset.category, true);
  });
});

/* ---------- Setas dos trilhos ---------- */

function moveHorizontalRail(rail, direction, cardSelector) {
  if (!rail) return;
  const firstCard = rail.querySelector(cardSelector);
  const distance = firstCard ? firstCard.getBoundingClientRect().width + 16 : rail.clientWidth * 0.8;
  rail.scrollBy({ left: distance * direction, behavior: 'smooth' });
}

document.querySelector('[data-shelf-previous]')?.addEventListener('click', () => moveHorizontalRail(workShelf, -1, '.shelf-card'));
document.querySelector('[data-shelf-next]')?.addEventListener('click', () => moveHorizontalRail(workShelf, 1, '.shelf-card'));

const companyRail = document.querySelector('[data-company-rail]');
document.querySelector('[data-rail-previous]')?.addEventListener('click', () => moveHorizontalRail(companyRail, -1, '.company-card'));
document.querySelector('[data-rail-next]')?.addEventListener('click', () => moveHorizontalRail(companyRail, 1, '.company-card'));

/* ---------- Raxaria: episódios em composição horizontal ---------- */

const raxariaGallery = document.querySelector('[data-raxaria]');

// "Ver todos os episódios": pop-up com o vídeo e a lista de episódios ao lado
P.items['raxaria-all'] = {
  id: 'raxaria-all',
  title: 'Raxaria',
  type: 'video',
  videos: P.categories.raxaria.items.map((item) => ({ id: item.youtube, title: item.title })),
};
const raxariaStrip = document.querySelector('[data-raxaria-strip]');

function episodeTile(item, className) {
  const link = document.createElement('button');
  link.type = 'button';
  link.className = `media-tile ${className || ''}`.trim();
  link.dataset.play = item.id;
  link.setAttribute('aria-label', `Assistir: ${item.title}`);
  const img = document.createElement('img');
  img.alt = '';
  if (item.youtube) P.setYouTubeImage(img, item.youtube);
  const play = document.createElement('span');
  play.className = 'tile-play';
  play.setAttribute('aria-hidden', 'true');
  const caption = document.createElement('span');
  caption.className = 'tile-caption';
  caption.textContent = item.title;
  link.append(img, play, caption);
  return link;
}

function loadRaxaria() {
  if (!raxariaGallery) return;
  P.resolveCategory('raxaria')
    .then((episodes) => Promise.all(episodes.filter((item) => item.youtube).map(async (item) => {
      const title = await P.titleFor(item.youtube);
      return { ...item, title: title || item.title };
    })))
    .then((videos) => {
      if (!videos.length) throw new Error('Sem episódios');
      videos.forEach((item) => Object.assign(P.items[item.id], item));
      const raxariaCard = P.items['yt-raxaria'];
      if (raxariaCard) raxariaCard.videos = videos.map((item) => ({ id: item.youtube, title: item.title }));
      P.items['raxaria-all'] = {
        id: 'raxaria-all',
        title: 'Raxaria',
        type: 'video',
        videos: videos.map((item) => ({ id: item.youtube, title: item.title })),
      };

      // Mantém o Portal KondZilla sem os episódios de Raxaria.
      const portalCard = P.items['yt-portal-kondzilla'];
      const raxariaIds = new Set(videos.map((item) => item.youtube));
      if (portalCard?.playlist) {
        P.loadPlaylist(portalCard.playlist).then((portalVideos) => {
          const filtered = portalVideos.filter((video) => !raxariaIds.has(video.id));
          if (!filtered.length) return;
          Object.assign(portalCard, { youtube: filtered[0].id, videos: filtered });
          delete portalCard.playlist;
          if (activeCategory === 'youtube') renderCategory('youtube');
        });
      }

      const [main, ...rest] = videos;
      raxariaGallery.replaceChildren(
        episodeTile(main, 'episode-main'),
        ...rest.slice(0, 2).map((item) => episodeTile(item)),
      );
      raxariaStrip?.replaceChildren(...rest.slice(2, 6).map((item) => episodeTile(item)));
    })
    .catch(() => {
      const fallback = P.categories.raxaria.items[0];
      if (!fallback) return;
      const main = episodeTile(fallback, 'episode-main');
      raxariaGallery.replaceChildren(
        main,
        Object.assign(document.createElement('span'), { className: 'media-tile is-empty' }),
        Object.assign(document.createElement('span'), { className: 'media-tile is-empty' }),
      );
    })
    .finally(() => raxariaGallery.removeAttribute('aria-busy'));
}

if (raxariaGallery) loadRaxaria();

/* ---------- Início ---------- */

// #videoclipes, #raxaria… abrem a aba correspondente
function openCategoryFromHash() {
  const key = decodeURIComponent(window.location.hash.slice(1));
  if (!P.categories[key]) return false;
  renderCategory(key);
  requestAnimationFrame(() => document.querySelector('#trabalhos')?.scrollIntoView({ block: 'start' }));
  return true;
}

if (!openCategoryFromHash()) renderCategory(activeCategory);
window.addEventListener('hashchange', openCategoryFromHash);

document.querySelectorAll('[data-year]').forEach((node) => {
  node.textContent = new Date().getFullYear();
});
