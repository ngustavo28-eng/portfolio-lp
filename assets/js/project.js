const P = window.Portfolio;
// Rota pelo hash: #<id> ou #<id>.<categoria> (compatível com ?id=&cat= antigos)
const params = new URLSearchParams(window.location.search);
const [hashId, hashCategory] = decodeURIComponent(window.location.hash.slice(1)).split('.');
const requestedId = hashId || params.get('id') || 'demoreel-geral';
const requestedCategory = hashCategory || params.get('cat');

// Anterior/próximo trocam só o hash: recarrega para montar o novo projeto
window.addEventListener('hashchange', () => window.location.reload());

const REELS = ['demoreel-geral', 'demoreel-gla', 'demoreel-kondzilla', 'demoreel-vivencia'];

const projectHref = (item) => P.projectHref(item, 'index.html');

function dynamicBase(id, categoryKey) {
  const category = P.categories[categoryKey];
  const source = category && category.source;
  if (id.startsWith('playlist-') && category) {
    return {
      id, title: `${category.label} no YouTube`, type: 'video', playlist: source && source.playlist,
      category: category.label, categoryKey, company: source ? source.company : 'A confirmar',
    };
  }
  return {
    id,
    title: category ? category.label : 'Vídeo',
    type: 'video',
    youtube: id.slice(3),
    category: category ? category.label : 'YouTube',
    categoryKey: category ? categoryKey : null,
    company: source ? source.company : 'A confirmar',
  };
}

function resolveItem() {
  if (P.items[requestedId]) return Promise.resolve(P.items[requestedId]);
  const isDynamic = requestedId.startsWith('yt-') || requestedId.startsWith('playlist-');
  if (!isDynamic) return Promise.resolve(P.items['demoreel-geral']);
  const base = dynamicBase(requestedId, requestedCategory);
  if (!requestedCategory || !P.categories[requestedCategory]) return Promise.resolve(base);
  return P.resolveCategory(requestedCategory)
    .then(() => P.items[requestedId] || base)
    .catch(() => base);
}

function renderMedia(item) {
  const media = document.querySelector('[data-project-media]');
  const player = document.querySelector('[data-project-player]');
  const external = document.querySelector('[data-project-external]');

  if (item.spotify) {
    media.classList.add('is-audio');
    const cover = document.createElement('img');
    cover.className = 'audio-cover';
    cover.src = item.cover;
    cover.alt = `Capa do podcast ${item.title}`;
    cover.addEventListener('error', () => cover.classList.add('thumb-failed'));
    if (P.PREVIEW) {
      player.replaceWith(cover);
    } else {
      const frame = P.createIframe(item, false);
      frame.className = 'audio-embed';
      frame.loading = 'eager';
      player.replaceWith(cover, frame);
    }
  } else {
    P.mountPlayer(player, item, { label: 'Assistir' });
  }

  const url = P.externalUrl(item);
  if (url && external) {
    const link = document.createElement('a');
    link.className = 'text-link';
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener';
    link.textContent = item.spotify ? 'Ouvir no Spotify ↗' : item.playlist ? 'Abrir playlist no YouTube ↗' : 'Abrir no YouTube ↗';
    external.replaceChildren(link);
    external.hidden = false;
  }
}

function renderCompanyWorks(item) {
  const company = Object.values(P.companies).find((entry) => entry.reel === item.id);
  const section = document.querySelector('[data-company-works]');
  const list = document.querySelector('[data-company-works-list]');
  if (!company || !section || !list) return;

  section.querySelector('h2').textContent = `Trabalhos na ${company.name}`;
  list.replaceChildren(...company.categories.map((key) => {
    const link = document.createElement('a');
    link.href = `../#${key}`;
    link.innerHTML = `<span>${P.categories[key].label}</span><span aria-hidden="true">→</span>`;
    return link;
  }));
  section.hidden = false;
}

function renderPagination(item) {
  const previousLink = document.querySelector('[data-previous-project]');
  const nextLink = document.querySelector('[data-next-project]');

  const apply = (list) => {
    const sequence = list.filter((entry) => entry && entry.type !== 'frame');
    const index = sequence.findIndex((entry) => entry.id === item.id);
    if (index < 0 || sequence.length < 2) return;
    const previous = sequence[(index - 1 + sequence.length) % sequence.length];
    const next = sequence[(index + 1) % sequence.length];
    previousLink.href = projectHref(previous);
    previousLink.textContent = `← ${previous.title}`;
    nextLink.href = projectHref(next);
    nextLink.textContent = `${next.title} →`;
  };

  if (REELS.includes(item.id)) {
    apply(REELS.map((id) => P.items[id]));
    return;
  }

  if (item.categoryKey) {
    P.resolveCategory(item.categoryKey).then(apply).catch(() => apply(P.categories[item.categoryKey].items));
  }
}

resolveItem().then((item) => {
  document.title = `${item.title} — Gustavo Nascimento`;
  document.querySelector('[data-project-title]').textContent = item.title;
  document.querySelector('[data-project-company]').textContent = item.company || 'A confirmar';
  document.querySelector('[data-project-specialty]').textContent = item.category || 'A confirmar';

  const back = document.querySelector('[data-back-link]');
  if (back) {
    if (item.categoryKey) {
      back.href = `../#${item.categoryKey}`;
    } else if (REELS.includes(item.id) && item.id !== 'demoreel-geral') {
      back.href = '../#empresas';
      back.textContent = '← Voltar às empresas';
    } else {
      back.href = '../';
      back.textContent = '← Voltar ao início';
    }
  }

  renderMedia(item);
  renderCompanyWorks(item);
  renderPagination(item);
});
