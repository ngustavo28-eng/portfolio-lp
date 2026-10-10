/*
  Catálogo único do portfólio.
  Fonte de dados para a landing page (abas, destaques, empresas) e para a página individual.

  Tipos de mídia aceitos em cada item:
  - youtube:  { youtube: 'ID do vídeo' }
  - playlist: { playlist: 'ID da playlist' }  → abre o player de playlist do YouTube
  - spotify:  { spotify: 'ID do programa', cover: 'URL da capa 1:1' }
  - sem mídia → placeholder identificado

  Categorias com `source` carregam os vídeos de uma playlist do YouTube no navegador,
  na mesma ordem da playlist. Basta adicionar ou reordenar vídeos no YouTube.
*/

(function () {
  // Modo preview (página publicada no Claude): sem iframes nem API do YouTube; vídeos abrem em nova aba
  const PREVIEW = window.PORTFOLIO_PREVIEW === true;

  const COMPANY = {
    gla: 'Growth Leaders Academy',
    kz: 'KondZilla',
    viv: 'Vivência.Lab',
  };

  const PLAYLISTS = {
    videoclipes: 'PLa90DWLprJ2M',
    portalKondzilla: 'PLr_xEhwOyCnbM1jn-JEPyZ4ofB2Eocxph',
  };

  const pad = (n) => String(n).padStart(2, '0');

  const placeholders = (prefix, count, title, meta, company) =>
    Array.from({ length: count }, (_, i) => ({
      id: `${prefix}-${pad(i + 1)}`,
      title: `${title} ${pad(i + 1)}`,
      meta,
      company,
      type: 'video',
      placeholder: true,
    }));

  const items = {
    'demoreel-geral': {
      id: 'demoreel-geral', title: 'Demo reel', meta: 'Gustavo Nascimento', company: 'Gustavo Nascimento',
      category: 'Demo reel', type: 'video', youtube: '737SNbK3EkU',
    },
    'demoreel-gla': {
      id: 'demoreel-gla', title: 'Demo reel Growth Leaders Academy', meta: 'Demo reel', company: COMPANY.gla,
      category: 'Demo reel', type: 'video', youtube: 'qJHTdMjE1BM',
    },
    'demoreel-kondzilla': {
      id: 'demoreel-kondzilla', title: 'Demo reel KondZilla', meta: 'Demo reel', company: COMPANY.kz,
      category: 'Demo reel', type: 'video', youtube: 'XSyhbnqlcYs',
    },
    'demoreel-vivencia': {
      id: 'demoreel-vivencia', title: 'Demo reel Vivência.Lab', meta: 'Demo reel', company: COMPANY.viv,
      category: 'Demo reel', type: 'video', placeholder: true,
    },
    'manifesto-video': {
      id: 'manifesto-video', title: 'Vídeo manifesto', meta: 'Manifesto · KondZilla', company: COMPANY.kz,
      category: 'Vídeo manifesto', type: 'video', youtube: '5CHdLBsiQRE',
    },
  };

  const categories = {
    anuncios: {
      label: 'Mídia paga',
      items: placeholders('anuncios', 8, 'Vídeo', 'Anúncio · a confirmar', COMPANY.gla),
    },
    redes: {
      label: 'Redes sociais',
      items: placeholders('redes', 7, 'Conteúdo', 'Redes sociais · a confirmar', COMPANY.gla),
    },
    youtube: {
      label: 'YouTube',
      items: [
        { id: 'yt-cafe-mineiro', title: 'Café Mineiro', meta: 'Playlist · GLA', company: COMPANY.gla, type: 'video', playlist: 'PLy8iFoljIPf5IjJwEN6PYLof-UyiA8dYO', placeholder: true },
        { id: 'yt-gambicast-t1', title: 'Gambicast · 1ª temporada', meta: 'Playlist · GLA', company: COMPANY.gla, type: 'video', playlist: 'PLy8iFoljIPf4rfidU1CPw5ZHYwA8Vq-Nv', placeholder: true },
        { id: 'yt-backstage', title: 'Backstage', meta: 'Playlist · GLA', company: COMPANY.gla, type: 'video', playlist: 'PLy8iFoljIPf6ZDYAqXM2aOR3aanJPkCjl', placeholder: true },
        { id: 'yt-dj-blakes', title: 'Marcha no Mundo com DJ Blakes', meta: 'Sobre Funk', company: 'Sobre Funk', type: 'video', youtube: 'uBoRA3F7meM' },
      ],
      // Vídeos do Portal KondZilla, exceto os episódios de Raxaria
      source: { playlist: PLAYLISTS.portalKondzilla, exclude: /raxaria/i, meta: 'Portal KondZilla', company: COMPANY.kz },
    },
    videoclipes: {
      label: 'Videoclipes',
      items: [],
      source: { playlist: PLAYLISTS.videoclipes, meta: 'Videoclipe · KondZilla', company: COMPANY.kz },
    },
    podcasts: {
      label: 'Podcasts',
      shape: 'square',
      items: [
        { id: 'podcast-deep-growth', title: 'Deep Growth', meta: 'Spotify · GLA', company: COMPANY.gla, type: 'audio', spotify: '41HIlBruf8r0kHiAQCyHNp', cover: 'https://i.scdn.co/image/ab6765630000ba8a7c5259a1fc27d4170387d8ee' },
        { id: 'podcast-o-experimento', title: 'O Experimento', meta: 'Spotify · a confirmar', company: 'A confirmar', type: 'audio', spotify: '3IeOx7H3dzRcidplfAiz5C', cover: 'https://i.scdn.co/image/ab6765630000ba8a88b3fbeb7d30d926e2ca3fdc' },
        { id: 'podcast-mulheres-de-growth', title: 'Mulheres de Growth', meta: 'Spotify · GLA', company: COMPANY.gla, type: 'audio', spotify: '1FRHA4Ye4Utead1w7rEpH0', cover: 'https://i.scdn.co/image/ab6765630000ba8a8dde50a06e7a486348537a3c' },
        { id: 'podcast-220', title: '220 Podcast', meta: 'Spotify · GLA', company: COMPANY.gla, type: 'audio', spotify: '1LT8xbzQ2S8swdipmoQYlp', cover: 'https://i.scdn.co/image/ab6765630000ba8a33adb05022c321c0b90a8928' },
      ],
    },
    eventos: {
      label: 'Eventos internacionais',
      items: placeholders('eventos', 6, 'Cobertura', 'Evento internacional · GLA', COMPANY.gla),
    },
    raxaria: {
      label: 'Raxaria',
      items: [],
      // Somente os episódios de Raxaria do Portal KondZilla
      source: { playlist: PLAYLISTS.portalKondzilla, include: /raxaria/i, meta: 'Raxaria · KondZilla', company: COMPANY.kz },
    },
    manifesto: {
      label: 'Vídeo manifesto',
      items: [
        items['manifesto-video'],
        // Frames automáticos do YouTube, provisórios até a exportação dos frames definitivos
        ...[1, 2, 3].map((n) => ({
          id: `manifesto-frame-${pad(n)}`, title: `Frame ${pad(n)}`, meta: 'Frame provisório', company: COMPANY.kz,
          type: 'frame', frameOf: '5CHdLBsiQRE', frameIndex: n,
        })),
      ],
    },
    documentarios: {
      label: 'Documentários',
      items: [
        { id: 'documentario-01', title: 'Produção 01', meta: 'Documentário · Vivência.Lab', company: COMPANY.viv, type: 'video', placeholder: true },
        { id: 'documentario-02', title: 'Produção 02', meta: 'Documentário · Vivência.Lab', company: COMPANY.viv, type: 'video', placeholder: true },
        { id: 'curta-01', title: 'Curta-metragem', meta: 'Ficção · Vivência.Lab', company: COMPANY.viv, type: 'video', placeholder: true },
      ],
    },
  };

  const companies = {
    gla: { name: COMPANY.gla, reel: 'demoreel-gla', categories: ['anuncios', 'youtube', 'podcasts', 'eventos'] },
    kondzilla: { name: COMPANY.kz, reel: 'demoreel-kondzilla', categories: ['videoclipes', 'raxaria', 'manifesto', 'youtube'] },
    vivencia: { name: COMPANY.viv, reel: 'demoreel-vivencia', categories: ['documentarios'] },
  };

  // Indexa os itens das categorias para a página individual
  Object.entries(categories).forEach(([key, cat]) => {
    cat.items.forEach((item) => {
      item.category = item.category || cat.label;
      item.categoryKey = key;
      if (!items[item.id]) items[item.id] = item;
    });
  });

  /* ---------- Utilidades de mídia ---------- */

  const ytThumb = (id, quality = 'maxresdefault') => `https://i.ytimg.com/vi/${id}/${quality}.jpg`;

  // Carrega a melhor thumbnail disponível. O YouTube devolve uma imagem 120×90 quando a versão HD não existe.
  function setYouTubeImage(img, id, kind = 'maxresdefault', fallback = 'hqdefault') {
    img.decoding = 'async';
    img.loading = 'lazy';
    img.addEventListener('load', function check() {
      if (img.naturalWidth <= 120 && !img.dataset.fallback) {
        img.dataset.fallback = '1';
        img.src = ytThumb(id, fallback);
      }
    });
    img.addEventListener('error', () => {
      if (!img.dataset.fallback) {
        img.dataset.fallback = '1';
        img.src = ytThumb(id, fallback);
      } else {
        markThumbFailed(img);
      }
    });
    img.src = ytThumb(id, kind);
  }

  // Sem thumbnail (bloqueio de rede, bloqueador de anúncios): esconde a imagem e mostra o placeholder
  function markThumbFailed(img) {
    img.hidden = true;
    if (img.parentElement) img.parentElement.classList.add('thumb-failed');
  }

  function projectHref(item, base) {
    const token = item.categoryKey ? `${item.id}.${item.categoryKey}` : item.id;
    return `${base}#${token}`;
  }

  function frameImage(img, id, index) {
    setYouTubeImage(img, id, `maxres${index}`, `hq${index}`);
  }

  function embedUrl(item, autoplay = true) {
    const ap = autoplay ? '1' : '0';
    if (item.youtube) return `https://www.youtube-nocookie.com/embed/${item.youtube}?autoplay=${ap}&rel=0&modestbranding=1&playsinline=1`;
    if (item.playlist) return `https://www.youtube-nocookie.com/embed/videoseries?list=${item.playlist}&rel=0&modestbranding=1&playsinline=1`;
    if (item.spotify) return `https://open.spotify.com/embed/show/${item.spotify}?utm_source=generator&theme=0`;
    return '';
  }

  function externalUrl(item) {
    if (item.youtube) return `https://www.youtube.com/watch?v=${item.youtube}`;
    if (item.playlist) return `https://www.youtube.com/playlist?list=${item.playlist}`;
    if (item.spotify) return `https://open.spotify.com/show/${item.spotify}`;
    return '';
  }

  /* ---------- Playlists do YouTube carregadas no navegador ---------- */

  const CACHE_PREFIX = 'gn-playlist-v1:';
  const CACHE_TTL = 1000 * 60 * 60 * 12;

  function readCache(key) {
    try {
      const raw = window.localStorage.getItem(CACHE_PREFIX + key);
      if (!raw) return null;
      const data = JSON.parse(raw);
      if (Date.now() - data.time > CACHE_TTL) return null;
      return data.value;
    } catch (error) {
      return null;
    }
  }

  function writeCache(key, value) {
    try {
      window.localStorage.setItem(CACHE_PREFIX + key, JSON.stringify({ time: Date.now(), value }));
    } catch (error) {
      /* armazenamento indisponível: segue sem cache */
    }
  }

  let ytApiPromise = null;

  function loadYouTubeApi() {
    if (window.YT && window.YT.Player) return Promise.resolve(window.YT);
    if (ytApiPromise) return ytApiPromise;
    ytApiPromise = new Promise((resolve, reject) => {
      const previous = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (typeof previous === 'function') previous();
        resolve(window.YT);
      };
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.async = true;
      script.onerror = () => reject(new Error('YouTube indisponível'));
      document.head.append(script);
      setTimeout(() => reject(new Error('Tempo esgotado')), 15000);
    });
    ytApiPromise.catch(() => { ytApiPromise = null; });
    return ytApiPromise;
  }

  // Usa um player oculto para ler a lista de IDs da playlist, na ordem original.
  function fetchPlaylistIds(listId) {
    if (PREVIEW) return Promise.reject(new Error('Preview sem acesso ao YouTube'));
    return loadYouTubeApi().then((YT) => new Promise((resolve, reject) => {
      const host = document.createElement('div');
      host.setAttribute('aria-hidden', 'true');
      host.style.cssText = 'position:absolute;left:-10000px;top:0;width:320px;height:180px;opacity:0;pointer-events:none;';
      const target = document.createElement('div');
      host.append(target);
      document.body.append(host);

      let done = false;
      let poll = null;
      let player = null;

      const finish = (ids) => {
        if (done) return;
        done = true;
        clearInterval(poll);
        try { player && player.destroy(); } catch (error) { /* ignora */ }
        host.remove();
        if (ids && ids.length) resolve(ids.slice());
        else reject(new Error('Playlist vazia ou indisponível'));
      };

      player = new YT.Player(target, {
        width: 320,
        height: 180,
        playerVars: { listType: 'playlist', list: listId, autoplay: 0, controls: 0 },
        events: {
          onReady: (event) => {
            try { event.target.getIframe().setAttribute('tabindex', '-1'); } catch (error) { /* ignora */ }
            let tries = 0;
            poll = setInterval(() => {
              const ids = event.target.getPlaylist && event.target.getPlaylist();
              if (ids && ids.length) finish(ids);
              else if (++tries > 40) finish(null);
            }, 250);
          },
          onError: () => finish(null),
        },
      });

      setTimeout(() => finish(null), 20000);
    }));
  }

  // Título de cada vídeo (serviço oEmbed com CORS). Sem título, o card usa numeração.
  function fetchTitle(videoId) {
    const url = `https://noembed.com/embed?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${videoId}`)}`;
    return fetch(url)
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => (data && data.title ? data.title : null))
      .catch(() => null);
  }

  async function mapLimit(list, limit, fn) {
    const results = new Array(list.length);
    let cursor = 0;
    const workers = Array.from({ length: Math.min(limit, list.length) }, async () => {
      while (cursor < list.length) {
        const index = cursor++;
        results[index] = await fn(list[index], index);
      }
    });
    await Promise.all(workers);
    return results;
  }

  const playlistPromises = {};

  // Devolve [{ id, title }] na ordem da playlist.
  function loadPlaylist(listId) {
    if (playlistPromises[listId]) return playlistPromises[listId];
    const cached = readCache(listId);
    if (cached) {
      playlistPromises[listId] = Promise.resolve(cached);
      return playlistPromises[listId];
    }
    playlistPromises[listId] = fetchPlaylistIds(listId)
      .then((ids) => mapLimit(ids, 6, (id) => fetchTitle(id).then((title) => ({ id, title }))))
      .then((videos) => {
        writeCache(listId, videos);
        return videos;
      });
    playlistPromises[listId].catch(() => { delete playlistPromises[listId]; });
    return playlistPromises[listId];
  }

  // Remove o nome do canal/artista repetido e deixa o título curto para o card
  function cleanTitle(title) {
    if (!title) return title;
    return title
      .replace(/\s*\([^)]*(?:kondzilla|clipe|official|oficial|video)[^)]*\)\s*/gi, ' ')
      .replace(/\s*\[[^\]]*(?:kondzilla|clipe|official|oficial|video)[^\]]*\]\s*/gi, ' ')
      .replace(/\s*[|·-]\s*(?:kondzilla|portal kondzilla)\s*$/i, '')
      .replace(/\s{2,}/g, ' ')
      .trim();
  }

  // Resolve uma categoria com fonte dinâmica em itens de vídeo
  function resolveCategory(key) {
    const cat = categories[key];
    if (!cat) return Promise.resolve([]);
    if (!cat.source) return Promise.resolve(cat.items);
    const { playlist, include, exclude, meta, company } = cat.source;
    return loadPlaylist(playlist).then((videos) => {
      const filtered = videos.filter(({ title }) => {
        if (include) return title && include.test(title);
        if (exclude) return !(title && exclude.test(title));
        return true;
      });
      const dynamic = filtered.map((video, index) => ({
        id: `yt-${video.id}`,
        title: cleanTitle(video.title) || `${cat.label} ${pad(index + 1)}`,
        meta,
        company,
        category: cat.label,
        categoryKey: key,
        type: 'video',
        youtube: video.id,
      }));
      dynamic.forEach((item) => { items[item.id] = item; });
      return [...cat.items, ...dynamic];
    });
  }

  /* ---------- Player leve: mostra a capa e só carrega o iframe no clique ---------- */

  function createIframe(item, autoplay) {
    const iframe = document.createElement('iframe');
    iframe.src = embedUrl(item, autoplay);
    iframe.title = item.title;
    iframe.loading = 'lazy';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen';
    iframe.allowFullscreen = true;
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    return iframe;
  }

  function mountPlayer(container, item, { label = 'Assistir' } = {}) {
    if (!container || !item) return;
    container.replaceChildren();

    if (PREVIEW && (item.youtube || item.playlist)) {
      const link = document.createElement('a');
      link.className = 'player-poster';
      link.href = externalUrl(item);
      link.target = '_blank';
      link.rel = 'noopener';
      link.setAttribute('aria-label', `${label} no YouTube: ${item.title}`);
      if (item.youtube) {
        const img = document.createElement('img');
        img.alt = '';
        setYouTubeImage(img, item.youtube);
        link.append(img);
      }
      const ui = document.createElement('span');
      ui.className = 'player-ui';
      ui.innerHTML = `<span class="play-symbol" aria-hidden="true"></span><span>${label} no YouTube ↗</span>`;
      link.append(ui);
      container.append(link);
      return;
    }

    if (item.youtube) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'player-poster';
      button.setAttribute('aria-label', `${label}: ${item.title}`);
      const img = document.createElement('img');
      img.alt = '';
      img.loading = 'eager';
      setYouTubeImage(img, item.youtube);
      img.loading = 'eager';
      const ui = document.createElement('span');
      ui.className = 'player-ui';
      ui.innerHTML = `<span class="play-symbol" aria-hidden="true"></span><span>${label}</span>`;
      button.append(img, ui);
      button.addEventListener('click', () => {
        container.replaceChildren(createIframe(item, true));
        container.classList.add('is-playing');
      });
      container.append(button);
      return;
    }

    if (item.playlist) {
      container.append(createIframe(item, false));
      container.classList.add('is-playing');
      return;
    }

    const empty = document.createElement('div');
    empty.className = 'player-empty';
    empty.innerHTML = '<span class="play-symbol" aria-hidden="true"></span><span>Vídeo em breve</span>';
    container.append(empty);
  }

  window.Portfolio = {
    PREVIEW,
    projectHref,
    markThumbFailed,
    COMPANY,
    mountPlayer,
    createIframe,
    PLAYLISTS,
    categories,
    companies,
    items,
    ytThumb,
    setYouTubeImage,
    frameImage,
    embedUrl,
    externalUrl,
    loadPlaylist,
    resolveCategory,
    cleanTitle,
  };
})();
