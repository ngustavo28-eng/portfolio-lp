/*
  Catálogo único do portfólio.
  Fonte de dados para a landing page (abas, destaques, empresas) e para a página individual.

  Tipos de mídia aceitos em cada item:
  - youtube:  { youtube: 'ID do vídeo' }
  - playlist: { playlist: 'ID da playlist' }  → abre o player de playlist do YouTube
  - vimeo:    { vimeo: 'ID do vídeo' }
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

  // Listas fixas para o destaque. Elas evitam que a ordem de uma playlist
  // externa altere o episódio que abre no portfólio.
  const GAMBICAST_SEASON_2 = [
    { id: '9hn8UuyIHPE', title: 'Gambicast #12 | Como usar um quiz para criar um sistema de matchmaking' },
    { id: '8Fzrlwns0Gs', title: 'Gambicast #13 | Como aumentar as vendas diminuindo o tempo de atendimento' },
    { id: 'WMKKEU4HYDE', title: 'Gambicast #14 | Como reduzir 30% do CAC automatizando processos' },
    { id: 'tGEwuoQF3hI', title: 'Gambicast #15 | Como aumentar a produtividade em vendas' },
    { id: 'GSCPgpdonHw', title: 'Gambicast #16 | Como fazer um MVP sem investir em anúncios' },
    { id: 'rQIMk1DqdgM', title: 'Gambicast #17 | Como aumentar a conversão de trial para assinantes' },
    { id: '0ZRbIa0sYss', title: 'Gambicast #18 | Como aumentar o desempenho de um canal de influenciadores' },
    { id: 'BbwadTSHbwI', title: 'Gambicast #19 | Como aumentar a taxa de ativação' },
    { id: 'ofIkUsPcOsk', title: 'Gambicast #20 | Como aumentar a conversão reduzindo o tempo do primeiro contato' },
    { id: 'bUwZGzxBBmU', title: 'Gambicast #21 | Como gerar 8 mil leads e faturar 300 mil reais' },
  ];

  const GAMBICAST_SEASON_1 = [
    { id: 'jA4PkYTy4yY', title: 'Gambicast #01 | Como usar gamification para engajar 50 mil usuários' },
    { id: 'Us4nOUfUXgI', title: 'Gambicast #02 | Como cadastrar e emitir certificados para 3.500 alunos' },
    { id: 'ug4w10yfgxo', title: 'Gambicast #03 | Como captar mais de 2 mil inscritos em uma newsletter' },
    { id: 'mm2MaHAdlJc', title: 'Gambicast #04 | Como filtrar e aproveitar mais de 1.000 leads por mês' },
    { id: '8AJFmLsVENQ', title: 'Gambicast #05 | Como automatizar um programa de embaixadores' },
    { id: '5OHXLTMUS70', title: 'Gambicast #06 | Como estruturar um CRM caseiro' },
    { id: 'fwX4pGBptDc', title: 'Gambicast #07 | Como dobrar a taxa de resposta de uma pesquisa de satisfação' },
    { id: 'ZeL4UifAB0o', title: 'Gambicast #08 | Como aumentar a conversão dos cold e-mails' },
    { id: 'KM3KmwL_0WM', title: 'Gambicast #09 | Como coletar 3 mil leads/mês tendo engenharia como marketing' },
    { id: 'SE5D98TrP7Q', title: 'Gambicast #10 | Como gerar mais de 2 mil leads orgânicos via Instagram' },
  ];
  const GAMBICAST_ALL = [...GAMBICAST_SEASON_1, ...GAMBICAST_SEASON_2];

  // Seleção fixa do Portal KondZilla. Somente os IDs são armazenados,
  // portanto parâmetros de minutagem dos links enviados são ignorados.
  const PORTAL_KONDZILLA_VIDEOS = [
    { id: 'lodysCu96A0', title: 'The Unforgettable Story of MC Kevin' },
    { id: 's7FusDrD-WA', title: 'Life Story with MC Guimê' },
    { id: 'n3RZBwB8XkY', title: 'The Oakley Timeline with André de Mello' },
    { id: 'H5FD-GQJlUA', title: 'Summer Stories with MC RN do Capão' },
    { id: '12M1ujLR1a8', title: 'Who Is Wesley Gonzaga?' },
    { id: 'KTvpBqY3LcU', title: 'Tattoos with MC Rhamon' },
    { id: 'iTCyXxDkjk8', title: 'Life Story with Kako Bachega' },
    { id: 'ujNma6br1Cc', title: 'From the Hood with MC Danny' },
    { id: '-BjU0PBdryw', title: 'Who Is MC Luan da BS?' },
    { id: 'rKmlqpxt2MY', title: 'Q&A with the Cast of Sintonia' },
    { id: '66Wua6bH5Es', title: 'Who Is Fanieh? Meet MC Luzi from Sintonia' },
    { id: 'Lj6EXE7oVtM', title: "Speak Up with Dani Russo — 'A Mortadella Sandwich'" },
  ];

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
      category: 'Demo reel', type: 'video', youtube: 'fwWtlQCFKC0',
    },
    'demoreel-gla': {
      id: 'demoreel-gla', title: 'Demo reel Growth Leaders Academy', meta: 'Demo reel', company: COMPANY.gla,
      category: 'Demo reel', type: 'video', youtube: 'qJHTdMjE1BM', cover: '/assets/images/companies/demoreel-gla.png',
    },
    'demoreel-kondzilla': {
      id: 'demoreel-kondzilla', title: 'Demo reel KondZilla', meta: 'Demo reel', company: COMPANY.kz,
      category: 'Demo reel', type: 'video', youtube: 'XSyhbnqlcYs', cover: '/assets/images/companies/demoreel-kondzilla.png',
    },
    'demoreel-vivencia': {
      id: 'demoreel-vivencia', title: 'Demo reel Vivência.Lab', meta: 'Demo reel', company: COMPANY.viv,
      category: 'Demo reel', type: 'video', placeholder: true, cover: '/assets/images/companies/demoreel-vivencia.jpg',
    },
    'manifesto-video': {
      id: 'manifesto-video', title: 'KondZilla Manifesto', meta: 'Manifesto', company: COMPANY.kz,
      category: 'KondZilla Manifesto', type: 'video', youtube: 'zop0CR4ZWrI', cover: '/assets/images/manifesto/frame-00.jpg',
    },
    'manifesto-gla': {
      id: 'manifesto-gla', title: 'Manifesto GLA', meta: 'Manifesto', company: COMPANY.gla,
      category: 'Manifesto videos', type: 'video', youtube: '7fIpIRL60iM',
    },
    'gambicast-s2-12': {
      id: 'gambicast-s2-12', title: 'GambiCast · Season 2 · Episode 12', meta: 'GambiCast', company: COMPANY.gla,
      category: 'GambiCast', type: 'video', videos: GAMBICAST_ALL, start: 10,
    },
    'course-social-interview': {
      id: 'course-social-interview', title: 'A entrevista', meta: 'Social media course', company: COMPANY.gla,
      category: 'Social media', type: 'social', instagram: 'C8siMmdOh4x', cover: '/assets/images/gambiday/a-entrevista.jpg',
    },
    'course-social-nightmare': {
      id: 'course-social-nightmare', title: 'O pesadelo', meta: 'Social media course', company: COMPANY.gla,
      category: 'Social media', type: 'social', instagram: 'C8p1zddS8Nf', cover: '/assets/images/gambiday/o-pesadelo.jpg',
    },
    'course-social-gambiarras': {
      id: 'course-social-gambiarras', title: 'As gambiarras', meta: 'Social media course', company: COMPANY.gla,
      category: 'Social media', type: 'social', instagram: 'C8vBGs1vDBi', cover: '/assets/images/gambiday/as-gambiarras.jpg',
    },
    'mentorship-live-leadership': {
      id: 'mentorship-live-leadership', title: 'Carreira de Marketing 2026: as 6 habilidades da nova liderança', meta: 'Growth Talks · Live', company: COMPANY.gla,
      category: 'Career Mentorship Campaign', type: 'video', youtube: 'iuLR9tgY-uY',
    },
    'mentorship-live-salary': {
      id: 'mentorship-live-salary', title: 'Como negociar promoção e salário', meta: 'Growth Talks · Live', company: COMPANY.gla,
      category: 'Career Mentorship Campaign', type: 'video', youtube: 'V1559smG-34',
    },
    'mentorship-live-generalists': {
      id: 'mentorship-live-generalists', title: 'O melhor plano de carreira para generalistas em Marketing 2026', meta: 'Growth Talks · Live', company: COMPANY.gla,
      category: 'Career Mentorship Campaign', type: 'video', youtube: '-0J3kxRu104',
    },
    'mentorship-live-hidden-jobs': {
      id: 'mentorship-live-hidden-jobs', title: 'Como acessar as vagas escondidas', meta: 'Growth Talks · Live', company: COMPANY.gla,
      category: 'Career Mentorship Campaign', type: 'video', youtube: 'wQ-AFyIVIiA',
    },
    'mentorship-live-c-level': {
      id: 'mentorship-live-c-level', title: 'A jornada para se tornar C-Level', meta: 'Growth Talks · Live', company: COMPANY.gla,
      category: 'Career Mentorship Campaign', type: 'video', youtube: 'Ghp1kO8PD2I',
    },
    'mentorship-live-strategy': {
      id: 'mentorship-live-strategy', title: 'Career Mentorship live', meta: 'Live', company: COMPANY.gla,
      category: 'Career Mentorship Campaign', type: 'video', youtube: 'g6KMVS-mPtE',
    },
    'mentorship-live-growth': {
      id: 'mentorship-live-growth', title: 'Career Mentorship live', meta: 'Live', company: COMPANY.gla,
      category: 'Career Mentorship Campaign', type: 'video', youtube: '2LIzavpPKN4',
    },
    'mentorship-live-career': {
      id: 'mentorship-live-career', title: 'Career Mentorship live', meta: 'Live', company: COMPANY.gla,
      category: 'Career Mentorship Campaign', type: 'video', youtube: 'w3yRZoqDsNg',
    },
    'riddles-enigmas': {
      id: 'riddles-enigmas', title: 'Enigmas RD Summit 2023', meta: 'RD Summit', company: COMPANY.gla,
      category: 'RD Summit Riddles Campaign', type: 'video', vimeo: '882070731',
    },
    'riddles-glaze': {
      id: 'riddles-glaze', title: 'Glaze', meta: 'RD Summit', company: COMPANY.gla,
      category: 'RD Summit Riddles Campaign', type: 'video', vimeo: '882316725',
    },
    'elevenlabs-video': {
      id: 'elevenlabs-video', title: 'How ElevenLabs Scaled to US$600 Million in ARR', meta: 'YouTube', company: COMPANY.gla,
      category: 'Highlight', type: 'video', youtube: 'oVYm9jW07O8',
    },
  };

  // Ordem visual das abas é definida no HTML:
  // Videoclipes, YouTube, Raxaria, Curta-metragem, Redes sociais, Mídia paga, Documentários, Manifestos e Podcasts.
  const categories = {
    youtube: {
      label: 'YouTube',
      role: '',
      // Programas em formato de playlist: abrem no pop-up com o vídeo à esquerda e a lista ao lado.
      // `start` (opcional): índice do vídeo que começa tocando (0 = primeiro da playlist).
      items: [
        // Vídeos avulsos: sem título, somente a thumbnail.
        { id: 'yt-gla-elevenlabs', title: '', company: COMPANY.gla, type: 'video', youtube: 'oVYm9jW07O8' },
        { id: 'yt-gla-ia-receita', title: '', company: COMPANY.gla, type: 'video', youtube: '1EaUgGVHEOM' },
        { id: 'yt-gla-mercado-livre', title: '', company: COMPANY.gla, type: 'video', youtube: 'TeteclIOtN8' },
        { id: 'yt-raxaria', title: 'Raxaria', company: COMPANY.kz, type: 'video', videos: raxariaVideos, start: 0, badge: 'Playlist', cover: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaIxLuCAVS4N_RdEtNmtU6OiGYL97LSSqV9EZ3dpqURZG19sVLJI1CzElp&s=10', hideTitle: true },
        { id: 'yt-portal-kondzilla', title: 'Portal KondZilla', company: COMPANY.kz, type: 'video', videos: PORTAL_KONDZILLA_VIDEOS, start: 0, badge: 'Playlist', cover: 'https://i.ytimg.com/vi/FdVDyIYJk8s/maxresdefault.jpg', hideTitle: true },
        { id: 'yt-gambicast', title: 'Gambicast', company: COMPANY.gla, type: 'video', videos: GAMBICAST_ALL, start: 10, badge: 'Playlist', cover: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQd8ZuKAtJdBI_N8r58dGc4oHK5khQIRVFGBz2H6VjdTA&s=10', hideTitle: true },
        { id: 'yt-cafe-mineiro', title: 'Coffee with Mineiro', company: COMPANY.gla, type: 'video', playlist: 'PLy8iFoljIPf5IjJwEN6PYLof-UyiA8dYO', start: 0, cover: '/assets/images/cafe-mineiro-horizontal.png', hideTitle: true },
        { id: 'yt-backstage', title: 'Backstage', company: COMPANY.gla, type: 'video', playlist: 'PLy8iFoljIPf6ZDYAqXM2aOR3aanJPkCjl', start: 0, cover: '/assets/images/backstage-horizontal.jpg', hideTitle: true },
        { id: 'yt-growth-talk', title: 'Growth Talk', company: COMPANY.gla, type: 'video', youtube: 'W9xWdTqHgsU', playlist: PLAYLISTS.growthTalk, start: 0, cover: '/assets/images/growth-talk-horizontal.jpg', hideTitle: true },
        { id: 'yt-gambiday', title: 'GambiDay', company: COMPANY.gla, type: 'video', playlist: 'PLXbylxEfXfVI', start: 1, cover: '/assets/images/capa-gambiday.png', hideTitle: true },
        { id: 'yt-gla-funil-pirata', title: '', company: COMPANY.gla, type: 'video', youtube: 'NF-SGRlZzIk' },
        { id: 'yt-gla-flywheel', title: '', company: COMPANY.gla, type: 'video', youtube: 'LeRQIdd2QdE' },
        { id: 'yt-gla-book-empathy', title: '', company: COMPANY.gla, type: 'video', youtube: 'YlSvRGi7VnE' },
        { id: 'yt-gla-book-90-days', title: '', company: COMPANY.gla, type: 'video', youtube: 'daaUOLnA4qk' },
      ],
    },
    videoclipes: {
      label: 'Music videos',
      role: 'Video Editor',
      // Um card por clipe, só a thumb (sem título), na ordem enviada.
      // Removido: 2HesrVTn9Fo (Mc da Lika - Boa Ação), que veio repetido e não faz parte do portfólio.
      items: [
          'CeSpY5W1VeE', // MC Dricka — Gadinho de Faz Tempo
          'ouLKyxbbSEE', // MC Kekel — Maldita
          'hu0zCYf0qxk', // MC DN — Rico e Bem Novinho
          'O93JQQLInT8', // DJZIM feat. Rincco — Coloridinha
          'qhd0AwH-avk', // Grego MC — Escapamento Duplo
          '4GlkLPR8bEk', // MC Dricka — Bunda no Calcanhar
          'h7RPR1sDC6c', // MC Kekel — Olha o Que Você Perdeu
          'TUHaegutGRk', // Biel Rocha — Tudo Que é Bom Dura Pouco
          't3_kTWFR1TU', // MC Bokão e MC Luciano SP — Hit do Século
          '6RmQFmtbn4M', // Torre feat. DJ Kalfani & DJ Will — Terra de Ninguém
          '4uIMO-K7B2Q', // Isadora Marins — Quando o Álcool Acabar
          'EWo3xfGL5mI', // MC Bragança — Tuts Tuts Quero Ver
          '76bDlOfADjA', // MEY — Baby
          'o7n8k14itYc', // MC Dricka — Não Sei Se Me Odeia ou Se Me Adora
          'PE2Vm5Nrn8w',
          '2yzSOnJrUAg',
          'JMefPyiEcIw',
          'sP2bz8zruOM',
          '1gVQQVg8fbs',
          'MtQTf9BENWE',
          'SPzNeavphNM',
          '59gP1l9JBSQ',
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
      ].map((youtube, index) => ({
        id: `clipe-${youtube}`, title: '', label: `Music video ${pad(index + 1)}`, company: COMPANY.kz, type: 'video', youtube,
      })),
    },
    anuncios: {
      label: 'Paid media',
      role: 'Scriptwriter & Post-production Coordinator',
      items: [
        { id: 'ads-traducao-simultanea', title: 'Simultaneous Translation', company: COMPANY.gla, type: 'paid', youtube: '2mYVkA06UGk', cover: '/assets/images/paid-media/14-traducao-simultanea.webp', customCover: true },
        { id: 'ads-cartao-de-credito', title: 'Credit Card', company: COMPANY.gla, type: 'paid', youtube: 'c_PhrxOv_Pg', cover: '/assets/images/paid-media/18-cartao-de-credito.webp', customCover: true },
        { id: 'ads-motor-silencioso', title: 'The Silent Engine Analogy', company: COMPANY.gla, type: 'paid', youtube: 'dSQ-lx8NkHk', cover: '/assets/images/paid-media/02-motor-silencioso.webp', customCover: true },
        { id: 'ads-consulta-medica', title: 'Medical Appointment', company: COMPANY.gla, type: 'paid', youtube: 'kVYH5zRstFo', cover: '/assets/images/paid-media/05-consulta-medica.webp', customCover: true },
        { id: 'ads-executor-de-confianca', title: 'A Trusted Operator', company: COMPANY.gla, type: 'paid', youtube: 'Y6KoNZlfZSs' },
        { id: 'ads-covardia-profissional', title: 'Are You Hiding Cowardice Behind Professional Humility?', company: COMPANY.gla, type: 'paid', youtube: '9cWeCCfPlJ4', cover: '/assets/images/paid-media/16-voce-camufla-covardia.webp', customCover: true },
        { id: 'ads-taro-de-growth', title: 'Growth Tarot', company: COMPANY.gla, type: 'paid', youtube: 'LT800Y7z2GA', cover: '/assets/images/paid-media/28-tarot-de-growth.webp', customCover: true },
        { id: 'ads-o-preco-invisivel', title: 'The Hidden Price', company: COMPANY.gla, type: 'paid', youtube: 'okxFnJdCEFU', cover: '/assets/images/paid-media/31-preco-invisivel.webp', customCover: true },
        { id: 'ads-tutorial-nao-crescer', title: 'How Not to Grow Your Company', company: COMPANY.gla, type: 'paid', youtube: 'nHm9QTM-fHI', cover: '/assets/images/paid-media/23-como-nao-crescer.webp', customCover: true },
        { id: 'ads-top-5-erros', title: 'Top 5 Career Mistakes', company: COMPANY.gla, type: 'paid', youtube: 'WkIbbQINoOc', cover: '/assets/images/paid-media/13-top-5-erros-de-carreira.webp', customCover: true },
        { id: 'ads-como-conseguiu-seu-cargo', title: 'How Did You Land Your Role?', company: COMPANY.gla, type: 'paid', youtube: 'h003y8Ln5Z4', cover: '/assets/images/paid-media/17-como-conseguiu-seu-cargo.webp', customCover: true },
        { id: 'ads-extintor', title: 'Have You Become a Firefighter?', company: COMPANY.gla, type: 'paid', youtube: 'oonVAVDAw3Y', cover: '/assets/images/paid-media/19-apagando-incendio.webp', customCover: true },
        { id: 'ads-teste-do-agente', title: 'The Agent Test', company: COMPANY.gla, type: 'paid', youtube: 'ksoeFxbmuqo', cover: '/assets/images/paid-media/08-teste-do-agente.webp', customCover: true },
        { id: 'ads-plano-de-carreira', title: 'How to Build a Career Plan', company: COMPANY.gla, type: 'paid', youtube: 'vqcA70oGcFY', cover: '/assets/images/paid-media/04-plano-de-carreira.webp', customCover: true },
        { id: 'ads-vagas-epicas', title: 'Epic Job Openings', company: COMPANY.gla, type: 'paid', youtube: '2T85F_OF3JQ', cover: '/assets/images/paid-media/15-vagas-epicas.webp', customCover: true },
        { id: 'ads-empresas-confiaram', title: 'Companies That Trusted Us', company: COMPANY.gla, type: 'paid', youtube: '8y3pU7NH5uM', cover: '/assets/images/paid-media/26-empresas-que-confiaram.webp', customCover: true },
        { id: 'ads-quiz-data-growth', title: 'Quiz Data Growth', company: COMPANY.gla, type: 'paid', youtube: 'Q9zd3BJsqzU', cover: '/assets/images/paid-media/22-quiz.webp', customCover: true },
        { id: 'ads-diagnostico-eremita', title: 'The Hermit Diagnosis', company: COMPANY.gla, type: 'paid', youtube: 'W6KDX6UF7IQ', cover: '/assets/images/paid-media/27-diagnostico-eremita.webp', customCover: true },
        { id: 'ads-noticia-urgente', title: 'Breaking News: The Levers Map', company: COMPANY.gla, type: 'paid', youtube: 'iGiIdPacSM8', cover: '/assets/images/paid-media/03-breaking-news.webp', customCover: true },
        { id: 'ads-assista-o-backstage', title: 'Watch the Backstage', company: COMPANY.gla, type: 'paid', youtube: 'hzJY9ifdU5c', cover: '/assets/images/paid-media/21-backstage.webp', customCover: true },
        { id: 'ads-perfil-generalista', title: 'The Generalist Profile', company: COMPANY.gla, type: 'paid', youtube: 'CMZ8vk3SVwU', cover: '/assets/images/paid-media/29-generalista.webp', customCover: true },
        { id: 'ads-para-quem-e-o-gla', title: 'Who Is GLA For?', company: COMPANY.gla, type: 'paid', youtube: '8k8suMTYcZ8', cover: '/assets/images/paid-media/30-pra-quem-e-o-gla.webp', customCover: true },
        { id: 'ads-dashboard', title: "What the Dashboard Doesn't Show", company: COMPANY.gla, type: 'paid', youtube: 'm7_LTygfSos' },
        { id: 'ads-comunicado-oficial', title: 'Official Announcement', company: COMPANY.gla, type: 'paid', youtube: '6RcRCYwb07k', coverPosition: 'center bottom' },
        { id: 'ads-o-alarme-tocou', title: 'The Alarm Went Off', company: COMPANY.gla, type: 'paid', youtube: 'HI-RVGHc7Zk' },
      ],
    },
    redes: {
      label: 'Social media',
      role: 'Scriptwriter & Post-production Coordinator',
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
        cover: `/assets/images/instagram/${instagram}.jpg?v=20261011`,
        // Teste visual solicitado: terceiro e quarto reels sem ícone sobre a capa.
        noPlayer: instagram === 'DOhHyafAfiI' || instagram === 'DQH_yfKgUFj',
      })),
    },
    podcasts: {
      label: 'Podcasts',
      role: 'Recording & Post-production Coordinator',
      shape: 'square',
      hideTitles: true,
      items: [
        { id: 'podcast-deep-growth', title: 'Deep Growth', meta: 'Spotify · GLA', company: COMPANY.gla, type: 'audio', spotify: '41HIlBruf8r0kHiAQCyHNp', cover: 'https://i.scdn.co/image/ab6765630000ba8a7c5259a1fc27d4170387d8ee' },
        { id: 'podcast-o-experimento', title: 'The Experiment', meta: 'Spotify · GLA', company: COMPANY.gla, type: 'audio', spotify: '3IeOx7H3dzRcidplfAiz5C', cover: 'https://i.scdn.co/image/ab6765630000ba8a88b3fbeb7d30d926e2ca3fdc' },
        { id: 'podcast-mulheres-de-growth', title: 'Women in Growth', meta: 'Spotify · GLA', company: COMPANY.gla, type: 'audio', spotify: '1FRHA4Ye4Utead1w7rEpH0', cover: 'https://i.scdn.co/image/ab6765630000ba8a8dde50a06e7a486348537a3c' },
        { id: 'podcast-220', title: '220 Podcast', meta: 'Spotify · GLA', company: COMPANY.gla, type: 'audio', spotify: '1LT8xbzQ2S8swdipmoQYlp', cover: 'https://i.scdn.co/image/ab6765630000ba8a33adb05022c321c0b90a8928' },
      ],
    },
    raxaria: {
      label: 'Raxaria',
      role: 'Video Editor',
      hideTitles: true,
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
    portalKondzilla: {
      label: 'Portal KondZilla',
      hideTitles: true,
      // Os episódios permanecem individuais nesta galeria, sem navegação de playlist.
      items: PORTAL_KONDZILLA_VIDEOS.map((video, index) => ({
        id: `portal-kondzilla-${pad(index + 1)}`,
        title: '',
        label: video.title,
        company: COMPANY.kz,
        type: 'video',
        youtube: video.id,
      })),
    },
    manifesto: {
      label: 'KondZilla Manifesto',
      role: 'Post-production Artist',
      items: [
        items['manifesto-video'],
        // O frame 00 já é a capa do vídeo principal, então não o repete na galeria.
        ...[1, 2, 3, 4, 5, 6].map((n) => ({
          id: `manifesto-frame-${pad(n)}`, title: '', label: `Institutional frame ${pad(n)}`,
          company: COMPANY.kz, type: 'image', image: true,
          cover: `/assets/images/manifesto/frame-${pad(n)}.jpg`,
        })),
      ],
    },
    curta: {
      label: 'Short film',
      role: 'Director of Photography & Colorist',
      items: [
        { id: 'curta-01', title: 'A Dream from the Outskirts', meta: 'Short film · Vivência.Lab', company: COMPANY.viv, type: 'video', youtube: 'BfSrUKYxswY', cover: '/assets/images/capa-vivencia.jpg' },
        { id: 'sonho-periferico-frame-01', label: 'Frame 01', company: COMPANY.viv, type: 'image', image: true, cover: '/assets/images/frames-sonho-periferico/frame-01.jpg' },
        { id: 'sonho-periferico-frame-05', label: 'Frame 05', company: COMPANY.viv, type: 'image', image: true, cover: '/assets/images/frames-sonho-periferico/frame-05.jpg' },
        { id: 'sonho-periferico-frame-06', label: 'Frame 06', company: COMPANY.viv, type: 'image', image: true, cover: '/assets/images/frames-sonho-periferico/frame-06.jpg' },
        { id: 'sonho-periferico-frame-11', label: 'Frame 11', company: COMPANY.viv, type: 'image', image: true, cover: '/assets/images/frames-sonho-periferico/frame-11.jpg' },
        { id: 'sonho-periferico-frame-12', label: 'Frame 12', company: COMPANY.viv, type: 'image', image: true, cover: '/assets/images/frames-sonho-periferico/frame-12.jpg' },
        { id: 'sonho-periferico-frame-13', label: 'Frame 13', company: COMPANY.viv, type: 'image', image: true, cover: '/assets/images/frames-sonho-periferico/frame-13.jpg' },
      ],
    },
    documentarios: {
      label: 'Documentaries',
      items: [
        { id: 'documentario-01', title: 'The World of Relics', meta: 'Documentary', company: COMPANY.viv, type: 'video', youtube: 'dCJKUEkTDGE' },
        { id: 'documentario-02', title: 'Everyday Life and Fashion from the Outskirts', meta: 'Documentary', company: COMPANY.viv, type: 'video', youtube: 'Bmt8dsYW-VQ' },
      ],
    },
    manifestos: {
      label: 'Manifesto videos',
      items: [items['manifesto-video'], items['manifesto-gla']],
    },
  };

  // Ordem das categorias = ordem das linhas na página da empresa
  const companies = {
    gla: {
      name: COMPANY.gla,
      reel: 'demoreel-gla',
      categories: ['youtube', 'anuncios', 'redes', 'podcasts'],
      location: 'São Paulo, Brazil',
      summary: 'A complete ecosystem for growth leaders, marketing executives, and entrepreneurs in Brazil, spanning services, consulting, education, and community.',
      experience: [
        {
          role: 'AI Content Producer', period: 'Nov 2025 — Present',
          bullets: ['Run an AI-optimized production workflow as a one-person operation for the company’s own channels and client accounts: copywriting, carousels, YouTube videos, and short-form Instagram content.'],
        },
        {
          role: 'Content & Audiovisual Coordinator', period: 'Mar 2023 — Nov 2025',
          bullets: [
            'Creative concept and technical leadership of a three-person team across content formats and campaigns over two years.',
            'Content output across formats: 10 podcast seasons, 50+ livestreams, 300+ paid ads, YouTube shows, and coverage of six editions of international events, including SaaStr AI, UNBOUND, and MarTech Summit.',
            'Developed and trained audiovisual and content professionals to deliver the projects.',
            'Developed the content concept and strategy for Mentoria de Carreira, a career-development product built collaboratively from scratch that delivered the company’s biggest B2C result to date.',
          ],
        },
        {
          role: 'Partner', period: 'Since Mar 2023',
          bullets: [],
        },
        {
          role: 'Senior Filmmaker', period: 'Mar 2022 — Mar 2023',
          bullets: [
            'Set up the company’s audiovisual production process and team for podcasts, YouTube shows, livestreams, paid media content, courses, and social media.',
            'Created GambiCast, an educational and entertainment YouTube show, taking it from zero to 20K+ views through an optimized production process from scripting to final edit.',
          ],
        },
      ],
    },
    kondzilla: {
      name: COMPANY.kz,
      reel: 'demoreel-kondzilla',
      categories: ['videoclipes', 'raxaria', 'portalKondzilla', 'manifesto'],
      location: 'São Paulo, Brazil',
      summary: 'One of Brazil’s largest media and audiovisual companies, home to the country’s biggest YouTube channel with 68M+ subscribers.',
      experience: [
        {
          role: 'Video Editor', period: 'Feb 2021 — Apr 2022',
          bullets: [
            'Edited across multiple fronts: 70+ music videos, advertising campaigns, entertainment content, brand films, and social media productions.',
            'Editor responsible for Raxaria, a YouTube comedy show that started within Portal KondZilla and, after its success, spun off into its own channel, growing to 500K+ subscribers.',
            'Led the full post-production of the brand manifesto film, a strategic credibility asset used in meetings with major streaming players and in the founder and CEO’s talks at international events such as Web Summit 2022 in Portugal.',
          ],
        },
      ],
    },
    vivencia: {
      name: COMPANY.viv,
      reel: 'demoreel-vivencia',
      categories: ['curta', 'documentarios'],
      location: 'São Paulo, Brazil',
      summary: 'A consultancy specialized in trend and consumer-behavior research in Brazil, producing ethnographic documentary films about Brazilian favela culture.',
      experience: [
        {
          role: 'Director of Photography & Colorist', period: 'Aug 2021 — Aug 2023 · Part-time',
          bullets: [
            'Director of photography on three productions—two documentaries and one short film—about favela culture and fashion, covered by Folha de S.Paulo, Estadão, and FFW, and backed by São Paulo’s Department of Culture.',
            'Led aesthetic direction, camera operation, location scouting, cinematography budgeting, shooting schedules, and color supervision.',
          ],
        },
      ],
    },
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
    if (item.vimeo) return `https://player.vimeo.com/video/${item.vimeo}?autoplay=${ap}&title=0&byline=0&portrait=0`;
    if (item.instagram) return `https://www.instagram.com/reel/${item.instagram}/embed/`;
    return '';
  }

  function externalUrl(item) {
    if (item.youtube) return `https://www.youtube.com/watch?v=${item.youtube}`;
    if (item.playlist) return `https://www.youtube.com/playlist?list=${item.playlist}`;
    if (item.spotify) return `https://open.spotify.com/show/${item.spotify}`;
    if (item.vimeo) return `https://vimeo.com/${item.vimeo}`;
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
