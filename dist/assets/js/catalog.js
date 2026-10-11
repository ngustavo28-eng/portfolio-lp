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
  // Modo preview (página publicada no Claude): o ambiente bloqueia iframes e a API do YouTube
  const PREVIEW = window.PORTFOLIO_PREVIEW === true;

  const COMPANY = {
    gla: 'Growth Leaders Academy',
    kz: 'KondZilla',
    viv: 'Vivência.Lab',
  };

  const PLAYLISTS = {
    videoclipes: 'PLa90DWLprJ2M',
    portalKondzilla: 'PLr_xEhwOyCnbM1jn-JEPyZ4ofB2Eocxph',
    growthTalk: 'PLy8iFoljIPf7sANtunhIdrgFqeh_n2dTr',
  };

  const pad = (n) => String(n).padStart(2, '0');

  const RAXARIA_VIDEO_IDS = [
    'z00IH-4YE2w',
    'I6WtmTS1tDs',
    'Jg6eqNCzCvM',
    '0Wm0i3KeIko',
    'z0NifBprNWk',
    'Mng_y836WQU',
    'nedGaFv5xA8',
    'rEJQyNxhwdg',
    'hxQ1ebKGLTU',
    'uyvi5YfmqFA',
    'WGb4-FF0N_I',
    'CzjzhfQfs48',
    'WExe61dPQRA',
  ];

  const raxariaVideos = RAXARIA_VIDEO_IDS.map((id, index) => ({
    id,
    title: `Raxaria ${pad(index + 1)}`,
  }));

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
      id: 'manifesto-video', title: 'Manifesto KondZilla', meta: 'Manifesto', company: COMPANY.kz,
      category: 'Manifesto KondZilla', type: 'video', youtube: '5CHdLBsiQRE',
    },
  };

  // Ordem visual das abas é definida no HTML:
  // Videoclipes, YouTube, Raxaria, Curta-metragem, Mídia paga, Redes sociais e Podcasts.
  // Manifesto permanece no catálogo para o destaque e a página da KondZilla, mas não aparece como aba.
  const categories = {
    youtube: {
      label: 'YouTube',
      // Programas em formato de playlist: abrem no pop-up com o vídeo à esquerda e a lista ao lado.
      // `start` (opcional): índice do vídeo que começa tocando (0 = primeiro da playlist).
      items: [
        // Vídeos avulsos: sem título, somente a thumbnail.
        { id: 'yt-kondzilla-ovym', title: '', company: COMPANY.kz, type: 'video', youtube: 'oVYm9jW07O8' },
        { id: 'yt-kondzilla-1eau', title: '', company: COMPANY.kz, type: 'video', youtube: '1EaUgGVHEOM' },
        { id: 'yt-raxaria', title: 'Raxaria', company: COMPANY.kz, type: 'video', videos: raxariaVideos, start: 0, badge: 'Playlist', cover: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaIxLuCAVS4N_RdEtNmtU6OiGYL97LSSqV9EZ3dpqURZG19sVLJI1CzElp&s=10', hideTitle: true },
        { id: 'yt-portal-kondzilla', title: 'Portal KondZilla', company: COMPANY.kz, type: 'video', playlist: PLAYLISTS.portalKondzilla, start: 0, badge: 'Playlist', cover: 'https://i.ytimg.com/vi/FdVDyIYJk8s/maxresdefault.jpg', hideTitle: true },
        { id: 'yt-cafe-mineiro', title: 'Café Mineiro', company: COMPANY.gla, type: 'video', playlist: 'PLy8iFoljIPf5IjJwEN6PYLof-UyiA8dYO', start: 0, cover: '/assets/images/cafe-mineiro-horizontal.png', hideTitle: true },
        { id: 'yt-gambicast', title: 'Gambicast', company: COMPANY.gla, type: 'video', playlist: 'PLy8iFoljIPf4rfidU1CPw5ZHYwA8Vq-Nv', start: 0, cover: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQd8ZuKAtJdBI_N8r58dGc4oHK5khQIRVFGBz2H6VjdTA&s=10', hideTitle: true },
        { id: 'yt-backstage', title: 'Backstage', company: COMPANY.gla, type: 'video', playlist: 'PLy8iFoljIPf6ZDYAqXM2aOR3aanJPkCjl', start: 0, cover: '/assets/images/backstage-horizontal.jpg', hideTitle: true },
        { id: 'yt-growth-talk', title: 'Growth Talk', company: COMPANY.gla, type: 'video', playlist: PLAYLISTS.growthTalk, start: 0, cover: '/assets/images/growth-talk-horizontal.jpg', hideTitle: true },
        { id: 'yt-gambiday', title: 'GambiDay', company: COMPANY.gla, type: 'video', playlist: 'PLXbylxEfXfVI', start: 1, cover: '/assets/images/capa-gambiday.png', hideTitle: true },
        { id: 'yt-gla-funil-pirata', title: '', company: COMPANY.gla, type: 'video', youtube: 'NF-SGRlZzIk' },
        // "10 Bilhões" fica entre Funil Pirata e Flywheel.
        { id: 'yt-kondzilla-tete', title: '', company: COMPANY.kz, type: 'video', youtube: 'TeteclIOtN8' },
        { id: 'yt-gla-flywheel', title: '', company: COMPANY.gla, type: 'video', youtube: 'LeRQIdd2QdE' },
        { id: 'yt-kondzilla-ylsv', title: '', company: COMPANY.kz, type: 'video', youtube: 'YlSvRGi7VnE' },
        { id: 'yt-kondzilla-daa', title: '', company: COMPANY.kz, type: 'video', youtube: 'daaUOLnA4qk' },
      ],
    },
    videoclipes: {
      label: 'Videoclipes',
      // Um card por clipe, só a thumb (sem título), na ordem enviada.
      // Removido: 2HesrVTn9Fo (Mc da Lika - Boa Ação), que veio repetido e não faz parte do portfólio.
      items: [
          'h7RPR1sDC6c',
          'o7n8k14itYc',
          'ouLKyxbbSEE',
          '4GlkLPR8bEk',
          'PE2Vm5Nrn8w',
          'CeSpY5W1VeE',
          'EWo3xfGL5mI',
          '76bDlOfADjA',
          't3_kTWFR1TU',
          '2yzSOnJrUAg',
          'JMefPyiEcIw',
          'sP2bz8zruOM',
          '1gVQQVg8fbs',
          '4uIMO-K7B2Q',
          'MtQTf9BENWE',
          'O93JQQLInT8',
          'hu0zCYf0qxk',
          '6RmQFmtbn4M',
          'SPzNeavphNM',
          '59gP1l9JBSQ',
          'qhd0AwH-avk',
          'XeKj-S2SHLY',
          'lw_sO-wwJWM',
          '1cOI2QssK_A',
          'kQ_qIOKzj4c',
          'cZvdxD7dOWw',
          '5iPLyqXzixY',
          'hkfixGhcsd8',
          'M3V6SF6nYVA',
          'C-n5GCTZhFI',
          'tnjzjjzgd20',
          'TUHaegutGRk',
      ].map((youtube, index) => ({
        id: `clipe-${youtube}`, title: '', label: `Videoclipe ${pad(index + 1)}`, company: COMPANY.kz, type: 'video', youtube,
      })),
    },
    anuncios: {
      label: 'Mídia paga',
      items: [
        { id: 'ads-noticia-urgente', title: 'Notícia Urgente: Mapa das Alavancas', company: COMPANY.gla, type: 'paid', youtube: 'iGiIdPacSM8' },
        { id: 'ads-executor-de-confianca', title: 'Executor de confiança', company: COMPANY.gla, type: 'paid', youtube: 'Y6KoNZlfZSs' },
        { id: 'ads-cartao-de-credito', title: 'Cartão de crédito', company: COMPANY.gla, type: 'paid', youtube: 'c_PhrxOv_Pg' },
        { id: 'ads-top-5-erros', title: 'Top 5 erros de carreira', company: COMPANY.gla, type: 'paid', youtube: 'WkIbbQINoOc' },
        { id: 'ads-como-conseguiu-seu-cargo', title: 'Como conseguiu seu cargo?', company: COMPANY.gla, type: 'paid', youtube: 'h003y8Ln5Z4' },
        { id: 'ads-plano-de-carreira', title: 'Como criar um plano de carreira', company: COMPANY.gla, type: 'paid', youtube: 'vqcA70oGcFY' },
        { id: 'ads-traducao-simultanea', title: 'Tradução Simultânea', company: COMPANY.gla, type: 'paid', youtube: '2mYVkA06UGk' },
        { id: 'ads-extintor', title: 'Dia inteiro apagando fogo', company: COMPANY.gla, type: 'paid', youtube: 'oonVAVDAw3Y' },
        { id: 'ads-dashboard', title: 'O que o dashboard não mostra', company: COMPANY.gla, type: 'paid', youtube: 'm7_LTygfSos' },
        { id: 'ads-teste-do-agente', title: 'O teste do agente', company: COMPANY.gla, type: 'paid', youtube: 'ksoeFxbmuqo' },
        { id: 'ads-perfil-generalista', title: 'Perfil Generalista', company: COMPANY.gla, type: 'paid', youtube: 'CMZ8vk3SVwU' },
        { id: 'ads-consulta-medica', title: 'Consulta médica', company: COMPANY.gla, type: 'paid', youtube: 'kVYH5zRstFo' },
        { id: 'ads-covardia-profissional', title: 'Você camufla sua covardia com humildade profissional', company: COMPANY.gla, type: 'paid', youtube: '9cWeCCfPlJ4' },
        { id: 'ads-vagas-epicas', title: 'Vagas Épicas', company: COMPANY.gla, type: 'paid', youtube: '2T85F_OF3JQ' },
        { id: 'ads-diagnostico-eremita', title: 'O Diagnóstico do Eremita', company: COMPANY.gla, type: 'paid', youtube: 'W6KDX6UF7IQ' },
        { id: 'ads-metodo-para-carreira', title: 'Método para carreira', company: COMPANY.gla, type: 'paid', youtube: 'RixjKULR-zA' },
      ],
    },
    redes: {
      label: 'Redes sociais',
      hideTitles: true,
      items: [
        // Ordem definida pelas thumbs: o primeiro bloco concentra os reels prioritários.
        'DI6gCqvgKnD', 'DIhjz2OAGgt', 'DOhHyafAfiI', 'DQH_yfKgUFj', 'DBw67eCB7Ci',
        'DPjWgx-gC67', 'DHmP4VdhXCM', 'CzXGhypOC-N', 'C8siMmdOh4x', 'C8p1zddS8Nf',
        'C8vBGs1vDBi', 'DKcawGJA5q2', 'DIoTRsCMs4A', 'DHL1eroM-Mm', 'DG83eu6sz6h',
        'DBGiBhMOkX2', 'C95sSPXvmQg', 'DCWXEK9RXLf', 'DSYMJF3gczJ', 'DRo7ymJgerZ',
        'DWHKVwrgGK-', 'DWCltwhgdkG', 'DdWVBeKxIcq', 'DZOD80aRxs9', 'DXzDIRJgnjC',
        'DW1nSf7gRSc', 'DIUibKuhUZs', 'CzZXE4EuTkU', 'DKCpknSgdoI',
        'C8naldXuSzq', 'C8Z6WQ4uV6O', 'DCgzDUiRxx7',
      ].map((instagram, index) => ({
        id: `instagram-${pad(index + 1)}`,
        label: 'Reel',
        company: COMPANY.gla,
        type: 'social',
        instagram,
        cover: `/assets/images/instagram/${instagram}.jpg`,
        // Teste visual solicitado: terceiro e quarto reels sem ícone sobre a capa.
        noPlayer: instagram === 'DOhHyafAfiI' || instagram === 'DQH_yfKgUFj',
      })),
    },
    podcasts: {
      label: 'Podcasts',
      shape: 'square',
      hideTitles: true,
      items: [
        { id: 'podcast-deep-growth', title: 'Deep Growth', meta: 'Spotify · GLA', company: COMPANY.gla, type: 'audio', spotify: '41HIlBruf8r0kHiAQCyHNp', cover: 'https://i.scdn.co/image/ab6765630000ba8a7c5259a1fc27d4170387d8ee' },
        { id: 'podcast-o-experimento', title: 'O Experimento', meta: 'Spotify · a confirmar', company: 'A confirmar', type: 'audio', spotify: '3IeOx7H3dzRcidplfAiz5C', cover: 'https://i.scdn.co/image/ab6765630000ba8a88b3fbeb7d30d926e2ca3fdc' },
        { id: 'podcast-mulheres-de-growth', title: 'Mulheres de Growth', meta: 'Spotify · GLA', company: COMPANY.gla, type: 'audio', spotify: '1FRHA4Ye4Utead1w7rEpH0', cover: 'https://i.scdn.co/image/ab6765630000ba8a8dde50a06e7a486348537a3c' },
        { id: 'podcast-220', title: '220 Podcast', meta: 'Spotify · GLA', company: COMPANY.gla, type: 'audio', spotify: '1LT8xbzQ2S8swdipmoQYlp', cover: 'https://i.scdn.co/image/ab6765630000ba8a33adb05022c321c0b90a8928' },
      ],
    },
    raxaria: {
      label: 'Raxaria',
      // Seleção fixa enviada pelo Gustavo, na ordem definida por ele.
      items: RAXARIA_VIDEO_IDS.map((youtube, index) => ({
        id: `raxaria-${pad(index + 1)}`,
        title: `Raxaria ${pad(index + 1)}`,
        meta: 'Raxaria · KondZilla',
        company: COMPANY.kz,
        type: 'video',
        youtube,
      })),
    },
    manifesto: {
      label: 'Manifesto KondZilla',
      items: [
        items['manifesto-video'],
        // Frames automáticos do YouTube, provisórios até a exportação dos frames definitivos
        ...[1, 2, 3].map((n) => ({
          id: `manifesto-frame-${pad(n)}`, title: '', company: COMPANY.kz,
          type: 'frame', frameOf: '5CHdLBsiQRE', frameIndex: n,
        })),
      ],
    },
    curta: {
      label: 'Curta-metragem',
      items: [
        { id: 'curta-01', title: 'O Sonho Periférico', meta: 'Curta-metragem · Vivência.Lab', company: COMPANY.viv, type: 'video', youtube: 'BfSrUKYxswY', cover: '/assets/images/capa-vivencia.jpg' },
        { id: 'sonho-periferico-frame-01', label: 'Frame 01', company: COMPANY.viv, type: 'image', image: true, cover: '/assets/images/frames-sonho-periferico/frame-01.jpg' },
        { id: 'sonho-periferico-frame-05', label: 'Frame 05', company: COMPANY.viv, type: 'image', image: true, cover: '/assets/images/frames-sonho-periferico/frame-05.jpg' },
        { id: 'sonho-periferico-frame-06', label: 'Frame 06', company: COMPANY.viv, type: 'image', image: true, cover: '/assets/images/frames-sonho-periferico/frame-06.jpg' },
        { id: 'sonho-periferico-frame-11', label: 'Frame 11', company: COMPANY.viv, type: 'image', image: true, cover: '/assets/images/frames-sonho-periferico/frame-11.jpg' },
        { id: 'sonho-periferico-frame-12', label: 'Frame 12', company: COMPANY.viv, type: 'image', image: true, cover: '/assets/images/frames-sonho-periferico/frame-12.jpg' },
        { id: 'sonho-periferico-frame-13', label: 'Frame 13', company: COMPANY.viv, type: 'image', image: true, cover: '/assets/images/frames-sonho-periferico/frame-13.jpg' },
      ],
    },
    documentarios: {
      label: 'Documentários',
      items: [
        { id: 'documentario-01', title: 'Universo das Relíquias', meta: 'Documentário', type: 'video', youtube: 'dCJKUEkTDGE' },
        { id: 'documentario-02', title: 'Cotidiano e Modas Periféricas', meta: 'Documentário', type: 'video', youtube: 'Bmt8dsYW-VQ' },
      ],
    },
  };

  // Ordem das categorias = ordem das linhas na página da empresa
  const companies = {
    gla: { name: COMPANY.gla, reel: 'demoreel-gla', categories: ['youtube', 'anuncios', 'redes', 'podcasts'] },
    kondzilla: { name: COMPANY.kz, reel: 'demoreel-kondzilla', categories: ['youtube', 'videoclipes', 'raxaria', 'manifesto'] },
    vivencia: { name: COMPANY.viv, reel: 'demoreel-vivencia', categories: ['curta'] },
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
    if (item.instagram) return `https://www.instagram.com/reel/${item.instagram}/embed/`;
    return '';
  }

  function externalUrl(item) {
    if (item.youtube) return `https://www.youtube.com/watch?v=${item.youtube}`;
    if (item.playlist) return `https://www.youtube.com/playlist?list=${item.playlist}`;
    if (item.spotify) return `https://open.spotify.com/show/${item.spotify}`;
    if (item.instagram) return `https://www.instagram.com/reel/${item.instagram}/`;
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

  // Título de um vídeo, com cache em memória (usado na lista lateral do pop-up de playlist)
  const titleCache = {};
  function titleFor(videoId) {
    if (!titleCache[videoId]) titleCache[videoId] = fetchTitle(videoId).then(cleanTitle);
    return titleCache[videoId];
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
      // Ignora vídeos que já estão no catálogo da categoria
      const known = new Set(cat.items.map((item) => item.youtube).filter(Boolean));
      const filtered = videos.filter(({ id, title }) => {
        if (known.has(id)) return false;
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

  window.Portfolio = {
    PREVIEW,
    projectHref,
    markThumbFailed,
    COMPANY,
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
    loadYouTubeApi,
    titleFor,
    resolveCategory,
    cleanTitle,
  };
})();
