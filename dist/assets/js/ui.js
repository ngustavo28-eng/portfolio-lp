/*
  Componentes compartilhados entre a página inicial e a página de empresa:
  - pop-up de vídeo (YouTube) ou áudio (Spotify) por cima da página
  - cards da prateleira horizontal (com fade lateral e arraste)
  - header translúcido que troca de tom sobre áreas escuras
*/

(function () {
  const P = window.Portfolio;

  /* ---------- Pop-up de mídia ---------- */

  let modal = null;
  let lastOpener = null;

  function buildModal() {
    modal = document.createElement('div');
    modal.className = 'media-modal';
    modal.hidden = true;
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.innerHTML = `
      <div class="media-modal-backdrop" data-modal-close></div>
      <div class="media-modal-box">
        <div class="media-modal-bar">
          <p class="media-modal-title" id="media-modal-title"></p>
          <button class="media-modal-close" type="button" data-modal-close aria-label="Close video">×</button>
        </div>
        <div class="media-modal-frame"></div>
      </div>`;
    modal.setAttribute('aria-labelledby', 'media-modal-title');
    document.body.append(modal);

    modal.addEventListener('click', (event) => {
      if (event.target.closest('[data-modal-close]')) closeMedia();
    });

    document.addEventListener('keydown', (event) => {
      if (modal.hidden) return;
      if (event.key === 'Escape') closeMedia();
      if (event.key === 'Tab') {
        // Mantém o foco dentro do pop-up
        const focusables = [...modal.querySelectorAll('button, a[href], iframe')].filter((el) => !el.closest('[hidden]'));
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });
  }

  let player = null;        // player da API do YouTube (modo playlist)
  let openToken = 0;

  const isPlayable = (item) => Boolean(item && (item.image || item.instagram || item.youtube || item.playlist || item.spotify || item.vimeo || (item.videos && item.videos.length)));

  function previewNote(item) {
    const what = item.spotify ? 'the podcast' : item.playlist || item.videos ? 'the video with its playlist' : 'the video';
    const link = item.spotify ? 'Listen on Spotify' : item.vimeo ? 'Watch on Vimeo' : 'Watch on YouTube';
    const url = item.videos ? `https://www.youtube.com/watch?v=${item.videos[0].id}` : P.externalUrl(item);
    return `
      <div class="media-modal-note">
        <p>On the published site, ${what} plays here in this pop-up.<br>This preview blocks external players.</p>
        <a class="text-link" href="${url}" target="_blank" rel="noopener">${link} ↗</a>
      </div>`;
  }

  // Playlist: vídeo à esquerda, lista à direita (como no YouTube), tudo dentro do pop-up
  function openPlaylist(item, frame, token) {
    frame.innerHTML = `
      <div class="media-modal-body">
        <div class="media-modal-player"><div></div></div>
        <div class="media-modal-list" hidden><ol></ol></div>
      </div>`;
    const host = frame.querySelector('.media-modal-player > div');
    const listWrap = frame.querySelector('.media-modal-list');
    const list = listWrap.querySelector('ol');
    const start = Number(item.start) || 0;

    const fallback = () => {
      if (token !== openToken) return;
      // Sem a API do YouTube: player de playlist padrão, sem a lista lateral
      const ids = item.videos ? item.videos.map((v) => v.id) : null;
      const initialVideo = item.youtube || (ids && (ids[start] || ids[0]));
      const src = ids
        ? `https://www.youtube-nocookie.com/embed/${initialVideo}?autoplay=1&rel=0&playsinline=1&playlist=${ids.join(',')}`
        : item.youtube
          ? `https://www.youtube-nocookie.com/embed/${item.youtube}?list=${item.playlist}&autoplay=1&rel=0&playsinline=1`
          : `https://www.youtube-nocookie.com/embed/videoseries?list=${item.playlist}&index=${start}&autoplay=1&rel=0&playsinline=1`;
      const iframe = P.createIframe({ title: item.title }, true);
      iframe.src = src;
      frame.querySelector('.media-modal-player').replaceChildren(iframe);
    };

    const highlight = () => {
      if (!player || typeof player.getPlaylistIndex !== 'function') return;
      const current = player.getPlaylistIndex();
      list.querySelectorAll('li').forEach((li, index) => {
        const active = index === current;
        li.classList.toggle('is-active', active);
        li.querySelector('button').setAttribute('aria-current', active ? 'true' : 'false');
        if (active) li.scrollIntoView({ block: 'nearest' });
      });
    };

    const renderList = (ids) => {
      const known = {};
      (item.videos || []).forEach((v) => { known[v.id] = v.title; });
      list.replaceChildren(...ids.map((id, index) => {
        const li = document.createElement('li');
        const button = document.createElement('button');
        button.type = 'button';
        button.innerHTML = `<img alt="" loading="lazy" src="${P.ytThumb(id, 'mqdefault')}"><span class="media-modal-list-title"></span>`;
        const title = button.querySelector('.media-modal-list-title');
        title.textContent = known[id] || `Video ${index + 1}`;
        if (!known[id]) P.titleFor(id).then((text) => { if (text) title.textContent = text; });
        button.addEventListener('click', () => player && player.playVideoAt(index));
        li.append(button);
        return li;
      }));
      listWrap.hidden = false;
      highlight();
    };

    // GambiCast e as coleções internas já conhecem seus vídeos. Renderizar a
    // lista antes da API do YouTube garante que a lateral continue visível
    // mesmo se a API demorar ou estiver bloqueada no preview.
    if (item.videos?.length) renderList(item.videos.map((video) => video.id));

    P.loadYouTubeApi().then((YT) => {
      if (token !== openToken) return;
      const vars = { autoplay: 1, rel: 0, playsinline: 1, modestbranding: 1 };
      if (item.playlist) Object.assign(vars, { listType: 'playlist', list: item.playlist, index: start });
      player = new YT.Player(host, {
        width: '100%',
        height: '100%',
        host: 'https://www.youtube-nocookie.com',
        videoId: item.youtube || undefined,
        playerVars: vars,
        events: {
          onReady: (event) => {
            if (token !== openToken) return;
            if (item.videos) event.target.loadPlaylist(item.videos.map((v) => v.id), start);
            let tries = 0;
            const poll = setInterval(() => {
              if (token !== openToken) { clearInterval(poll); return; }
              const ids = event.target.getPlaylist && event.target.getPlaylist();
              if (ids && ids.length) { clearInterval(poll); renderList(ids); }
              else if (++tries > 40) clearInterval(poll);
            }, 250);
          },
          onStateChange: highlight,
        },
      });
    }).catch(fallback);
  }

  function openMedia(item, opener) {
    if (!isPlayable(item)) return;
    if (!modal) buildModal();
    lastOpener = opener || document.activeElement;
    const token = ++openToken;

    const frame = modal.querySelector('.media-modal-frame');
    modal.querySelector('.media-modal-title').textContent = item.title || '';
    modal.querySelector('.media-modal-close').setAttribute('aria-label', item.image ? 'Close image' : 'Close video');
    const isList = Boolean(item.playlist || item.videos);
    modal.classList.toggle('is-audio', Boolean(item.spotify));
    modal.classList.toggle('is-playlist', isList && !P.PREVIEW);

    modal.classList.toggle('is-image', Boolean(item.image));
    modal.classList.toggle('is-instagram', Boolean(item.instagram));

    if (item.image) {
      const image = document.createElement('img');
      image.className = 'media-modal-image';
      image.src = item.cover;
      image.alt = item.label || item.title || 'Enlarged image';
      frame.replaceChildren(image);
    } else if (P.PREVIEW && !item.instagram) {
      frame.innerHTML = previewNote(item);
    } else if (isList) {
      openPlaylist(item, frame, token);
    } else {
      const iframe = P.createIframe(item, true);
      iframe.loading = 'eager';
      frame.replaceChildren(iframe);
    }

    modal.hidden = false;
    document.body.classList.add('modal-open');
    requestAnimationFrame(() => modal.classList.add('is-open'));
    modal.querySelector('.media-modal-close').focus();
  }

  function closeMedia() {
    if (!modal || modal.hidden) return;
    openToken += 1;
    if (player) {
      try { player.destroy(); } catch (error) { /* ignora */ }
      player = null;
    }
    modal.classList.remove('is-open');
    modal.querySelector('.media-modal-frame').replaceChildren(); // para o vídeo
    modal.hidden = true;
    document.body.classList.remove('modal-open');
    if (lastOpener && typeof lastOpener.focus === 'function') lastOpener.focus();
  }

  // Qualquer elemento com data-play="<id do catálogo>" abre o pop-up
  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-play]');
    if (!trigger) return;
    const item = P.items[trigger.dataset.play];
    if (!isPlayable(item)) return;
    event.preventDefault();
    openMedia(item, trigger);
  });

  /* ---------- Cards da prateleira ---------- */

  const variants = ['tone-a', 'tone-b', 'tone-c', 'tone-d', 'tone-e', 'tone-f'];

  function createMedia(item, index, square, hideTitles) {
    const media = document.createElement('div');
    media.className = `shelf-media ${variants[index % variants.length]}`;
    if (square) media.classList.add('is-square');
    if (item.customCover) media.classList.add('has-custom-cover');
    media.setAttribute('aria-hidden', 'true');

    if (item.youtube || item.frameOf || item.cover) {
      const img = document.createElement('img');
      img.alt = '';
      if (item.coverPosition) img.style.objectPosition = item.coverPosition;
      media.append(img);
      media.classList.add('has-image');
      if (item.cover) {
        img.loading = 'lazy';
        img.decoding = 'async';
        img.addEventListener('error', () => P.markThumbFailed(img));
        img.src = item.cover;
      } else if (item.youtube) P.setYouTubeImage(img, item.youtube);
      else if (item.frameOf) P.frameImage(img, item.frameOf, item.frameIndex);
    } else if (item.instagram) {
      const mark = document.createElement('span');
      mark.className = 'shelf-instagram-mark';
      mark.textContent = 'Instagram';
      media.classList.add('is-instagram');
      media.append(mark);
    }

    // Título sobreposto à thumb (frames não têm título)
    if (item.title && !item.hideTitle && !hideTitles) {
      const name = document.createElement('span');
      name.className = 'shelf-media-name';
      name.textContent = item.title;
      media.append(name);
      media.classList.add('has-name');
    }

    if (isPlayable(item) && !item.noPlayer && !item.image && !item.playlist && !item.videos) {
      const play = document.createElement('span');
      play.className = 'shelf-play';
      media.append(play);
    }

    const badge = item.badge || (item.playlist ? 'Playlist' : item.placeholder ? 'Coming soon' : '');
    if (badge) {
      const tag = document.createElement('span');
      tag.className = 'shelf-badge';
      tag.textContent = item.placeholder && item.badge ? `${item.badge} · coming soon` : badge;
      media.append(tag);
    }

    return media;
  }

  function createShelfCard(item, index, { square = false, hideTitles = false } = {}) {
    const article = document.createElement('article');
    article.className = `shelf-card shelf-card-${item.type}`;
    const media = createMedia(item, index, square, hideTitles);

    if (isPlayable(item)) {
      // Botão (não link): abre só o pop-up, nunca outra aba
      const link = document.createElement('button');
      link.type = 'button';
      link.className = 'shelf-link';
      link.dataset.play = item.id;
      link.setAttribute('aria-label', `${item.image ? 'Enlarge' : 'Watch'}: ${item.title || item.label || 'video'}`);
      link.append(media);
      article.append(link);
    } else {
      const figure = document.createElement('figure');
      figure.setAttribute('aria-label', item.title || item.label || 'Video frame');
      figure.append(media);
      article.append(figure);
    }
    return article;
  }

  function createLoadingCards(count, square) {
    return Array.from({ length: count }, () => {
      const card = document.createElement('div');
      card.className = 'shelf-card';
      card.innerHTML = `<div class="shelf-media is-loading${square ? ' is-square' : ''}"></div>`;
      return card;
    });
  }

  // Fade na lateral direita enquanto houver mais cards; arraste com o mouse
  function enhanceShelf(shelf) {
    if (!shelf || shelf.dataset.enhanced) return;
    shelf.dataset.enhanced = '1';

    const update = () => {
      const end = shelf.scrollLeft + shelf.clientWidth >= shelf.scrollWidth - 4;
      shelf.classList.toggle('is-end', end);
    };
    shelf.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    new MutationObserver(update).observe(shelf, { childList: true });
    update();

    let startX = 0;
    let startLeft = 0;
    let dragging = false;
    let moved = false;
    shelf.addEventListener('pointerdown', (event) => {
      if (event.pointerType !== 'mouse' || event.button !== 0) return;
      dragging = true;
      moved = false;
      startX = event.clientX;
      startLeft = shelf.scrollLeft;
    });
    window.addEventListener('pointermove', (event) => {
      if (!dragging) return;
      const delta = event.clientX - startX;
      if (Math.abs(delta) > 6) {
        moved = true;
        shelf.classList.add('is-dragging');
      }
      if (moved) shelf.scrollLeft = startLeft - delta;
    });
    window.addEventListener('pointerup', () => {
      if (!dragging) return;
      dragging = false;
      shelf.classList.remove('is-dragging');
    });
    // Um arraste não deve abrir o vídeo
    shelf.addEventListener('click', (event) => {
      if (moved) {
        event.preventDefault();
        event.stopPropagation();
        moved = false;
      }
    }, true);
    shelf.addEventListener('dragstart', (event) => event.preventDefault());
  }

  /* ---------- Header translúcido ---------- */

  function initHeader() {
    const header = document.querySelector('[data-header]');
    if (!header) return;
    let ticking = false;

    const update = () => {
      ticking = false;
      const probe = header.offsetHeight / 2;
      const dark = [...document.querySelectorAll('.tone-dark')].some((section) => {
        const rect = section.getBoundingClientRect();
        return rect.top <= probe && rect.bottom > probe;
      });
      header.classList.toggle('is-dark', dark);
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  window.PortfolioUI = {
    isPlayable,
    openMedia,
    closeMedia,
    createShelfCard,
    createLoadingCards,
    enhanceShelf,
    initHeader,
  };
})();
