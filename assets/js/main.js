const P = window.Portfolio;

/* ---------- Menu ---------- */

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
});

document.querySelectorAll('[data-yt-frame]').forEach((img) => {
  P.frameImage(img, img.dataset.ytFrame, Number(img.dataset.frameIndex) || 1);
});

/* ---------- Demo reel ---------- */

document.querySelectorAll('[data-player]').forEach((container) => {
  P.mountPlayer(container, P.items[container.dataset.player], { label: container.dataset.playerLabel || 'Assistir' });
});

/* ---------- Catálogo em abas ---------- */

const workTabs = [...document.querySelectorAll('[data-category]')];
const workShelf = document.querySelector('[data-work-shelf]');
const shelfCount = document.querySelector('[data-shelf-count]');
const shelfPrevious = document.querySelector('[data-shelf-previous]');
const shelfNext = document.querySelector('[data-shelf-next]');
let activeCategory = 'anuncios';
let renderToken = 0;

const variants = ['tone-a', 'tone-b', 'tone-c', 'tone-d', 'tone-e', 'tone-f'];

const projectHref = (item) => P.projectHref(item, 'projeto/index.html');

function createMedia(item, index, square) {
  const media = document.createElement('div');
  media.className = `shelf-media ${variants[index % variants.length]}`;
  media.setAttribute('aria-hidden', 'true');

  if (item.youtube || item.frameOf || item.cover) {
    const img = document.createElement('img');
    img.alt = '';
    media.append(img);
    media.classList.add('has-image');
    if (item.youtube) P.setYouTubeImage(img, item.youtube);
    else if (item.frameOf) P.frameImage(img, item.frameOf, item.frameIndex);
    else {
      img.loading = 'lazy';
      img.decoding = 'async';
      img.addEventListener('error', () => P.markThumbFailed(img));
      img.src = item.cover;
    }
  }

  // Nome do trabalho: aparece nos placeholders e quando a thumbnail não carrega
  const name = document.createElement('span');
  name.className = 'shelf-media-name';
  name.textContent = item.title;
  media.append(name);

  if (item.type !== 'frame') {
    const play = document.createElement('span');
    play.className = 'shelf-play';
    media.append(play);
  }

  if (item.playlist) {
    const badge = document.createElement('span');
    badge.className = 'shelf-badge';
    badge.textContent = 'Playlist';
    media.append(badge);
  } else if (item.placeholder) {
    const badge = document.createElement('span');
    badge.className = 'shelf-badge';
    badge.textContent = 'Em breve';
    media.append(badge);
  }

  if (square) media.classList.add('is-square');
  return media;
}

function createShelfCard(item, category, index, square) {
  const article = document.createElement('article');
  article.className = `shelf-card shelf-card-${item.type}`;

  const media = createMedia(item, index, square);
  const caption = document.createElement('div');
  caption.className = 'shelf-caption';
  const title = document.createElement('h3');
  title.textContent = item.title;
  const meta = document.createElement('p');
  meta.textContent = item.meta;
  caption.append(title, meta);

  if (item.type === 'frame') {
    const figure = document.createElement('figure');
    figure.setAttribute('aria-label', `${item.title}, ${item.meta}`);
    figure.append(media, caption);
    article.append(figure);
  } else {
    const link = document.createElement('a');
    link.href = projectHref(item);
    link.setAttribute('aria-label', `Abrir ${item.title} em ${category.label}`);
    link.append(media, caption);
    article.append(link);
  }

  return article;
}

function createLoadingCards(count, square) {
  return Array.from({ length: count }, () => {
    const card = document.createElement('div');
    card.className = 'shelf-card';
    card.innerHTML = `<div class="shelf-media is-loading${square ? ' is-square' : ''}"></div><div class="shelf-caption"><span class="skeleton-line"></span></div>`;
    return card;
  });
}

function countLabel(items) {
  const videos = items.filter((item) => item.type !== 'frame').length;
  const frames = items.length - videos;
  const parts = [];
  if (videos) parts.push(`${videos} ${videos === 1 ? 'trabalho' : 'trabalhos'}`);
  if (frames) parts.push(`${frames} ${frames === 1 ? 'frame' : 'frames'}`);
  return parts.join(' · ');
}

function updateTabs(categoryKey, focusTab) {
  workTabs.forEach((tab) => {
    const selected = tab.dataset.category === categoryKey;
    tab.classList.toggle('is-active', selected);
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
    if (selected && focusTab) {
      tab.focus();
    }
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
    workShelf.replaceChildren(...items.map((item, index) => createShelfCard(item, category, index, square)));
    workShelf.removeAttribute('aria-busy');
    if (shelfCount) shelfCount.textContent = countLabel(items);
  };

  if (!category.source) {
    paint(category.items);
    return;
  }

  // Categoria alimentada por playlist do YouTube
  workShelf.setAttribute('aria-busy', 'true');
  if (shelfCount) shelfCount.textContent = 'Carregando vídeos…';
  workShelf.replaceChildren(
    ...category.items.map((item, index) => createShelfCard(item, category, index, square)),
    ...createLoadingCards(4, square),
  );

  P.resolveCategory(categoryKey)
    .then(paint)
    .catch(() => {
      if (token !== renderToken) return;
      const fallback = {
        id: `playlist-${categoryKey}`,
        title: `${category.label} no YouTube`,
        meta: 'Abrir playlist completa',
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

/* ---------- Trilhos horizontais ---------- */

function moveHorizontalRail(rail, direction, cardSelector) {
  if (!rail) return;
  const firstCard = rail.querySelector(cardSelector);
  const distance = firstCard ? firstCard.getBoundingClientRect().width + 16 : rail.clientWidth * 0.8;
  rail.scrollBy({ left: distance * direction, behavior: 'smooth' });
}

shelfPrevious?.addEventListener('click', () => moveHorizontalRail(workShelf, -1, '.shelf-card'));
shelfNext?.addEventListener('click', () => moveHorizontalRail(workShelf, 1, '.shelf-card'));

const companyRail = document.querySelector('[data-company-rail]');
document.querySelector('[data-rail-previous]')?.addEventListener('click', () => moveHorizontalRail(companyRail, -1, '.company-card'));
document.querySelector('[data-rail-next]')?.addEventListener('click', () => moveHorizontalRail(companyRail, 1, '.company-card'));

/* ---------- Links que abrem uma aba específica ---------- */

document.querySelectorAll('[data-open-category]').forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    renderCategory(link.dataset.openCategory);
    document.querySelector('#trabalhos')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ---------- Raxaria: episódios em composição horizontal ---------- */

const raxariaGallery = document.querySelector('[data-raxaria]');
const raxariaStrip = document.querySelector('[data-raxaria-strip]');

function episodeTile(item, className) {
  const link = document.createElement('a');
  link.className = `media-tile ${className || ''}`.trim();
  link.href = projectHref(item);
  link.setAttribute('aria-label', `Abrir ${item.title}`);
  const img = document.createElement('img');
  img.alt = '';
  P.setYouTubeImage(img, item.youtube);
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
    .then((episodes) => {
      const videos = episodes.filter((item) => item.youtube);
      if (!videos.length) throw new Error('Sem episódios');
      const [main, ...rest] = videos;
      raxariaGallery.replaceChildren(
        episodeTile(main, 'episode-main'),
        ...rest.slice(0, 2).map((item) => episodeTile(item)),
      );
      raxariaStrip?.replaceChildren(...rest.slice(2, 6).map((item) => episodeTile(item)));
    })
    .catch(() => {
      raxariaGallery.querySelectorAll('.is-loading').forEach((tile) => {
        tile.classList.remove('is-loading');
        tile.classList.add('is-empty');
      });
      const main = raxariaGallery.querySelector('.episode-main');
      if (main) {
        const link = document.createElement('a');
        link.className = 'media-tile episode-main is-empty';
        link.href = 'projeto/index.html#playlist-raxaria.raxaria';
        link.innerHTML = '<span class="tile-play" aria-hidden="true"></span><span class="tile-caption">Assistir aos episódios no YouTube</span>';
        main.replaceWith(link);
      }
    })
    .finally(() => raxariaGallery.removeAttribute('aria-busy'));
}

if (raxariaGallery) {
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        observer.disconnect();
        loadRaxaria();
      }
    }, { rootMargin: '600px 0px' });
    observer.observe(raxariaGallery);
  } else {
    loadRaxaria();
  }
}

/* ---------- Início ---------- */

// #videoclipes, #raxaria… abrem a aba correspondente
function categoryFromHash() {
  const key = decodeURIComponent(window.location.hash.slice(1));
  return P.categories[key] ? key : null;
}

function openCategoryFromHash() {
  const key = categoryFromHash();
  if (!key) return false;
  renderCategory(key);
  requestAnimationFrame(() => document.querySelector('#trabalhos')?.scrollIntoView({ block: 'start' }));
  return true;
}

const legacy = new URLSearchParams(window.location.search).get('categoria');
if (!openCategoryFromHash()) {
  renderCategory(legacy && P.categories[legacy] ? legacy : activeCategory);
}
window.addEventListener('hashchange', openCategoryFromHash);

document.querySelectorAll('[data-year]').forEach((node) => {
  node.textContent = new Date().getFullYear();
});
