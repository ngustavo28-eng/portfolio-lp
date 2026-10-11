# Portfólio audiovisual — Gustavo Nascimento

Versão 0.17 do portfólio, construída com HTML, CSS e JavaScript puros.

## Estrutura

- `dist/index.html`: landing page.
- `dist/empresa/index.html`: página de cada empresa (`#gla`, `#kondzilla`, `#vivencia`).
- `dist/assets/css/styles.css`: identidade visual e responsividade.
- `dist/assets/js/catalog.js`: catálogo único (links de vídeos, playlists e podcasts), carregamento de playlists do YouTube e player leve.
- `dist/assets/js/main.js`: navegação, catálogo em abas, trilhos horizontais e destaque Raxaria.
- `dist/assets/js/ui.js`: pop-up de vídeo, cards da prateleira e header translúcido.
- `dist/assets/js/company.js`: página da empresa.
- `tools/build_preview.py`: gera a versão de preview publicada no Claude.
- `CONTEXTO-PROJETO.md`: decisões, estado atual e próximos passos.

## Preview local

```bash
python3 -m http.server 4173 -d dist
```

Abra `http://localhost:4173`.

## Cloudflare Pages

- Framework preset: `None`
- Build command: deixar vazio
- Build output directory: `dist`

Demo reels, manifesto, podcasts e playlists já usam links reais. A aba YouTube inclui Growth Talk e vídeos avulsos do Portal KondZilla; GambiDay, Mídia paga, Redes sociais, Eventos, Documentários e os textos de apresentação ainda são placeholders identificados.

## Como adicionar trabalhos

Edite `dist/assets/js/catalog.js`. Cada item aceita `youtube` (ID do vídeo), `playlist` (ID da playlist) ou `spotify` + `cover`. Categorias com `source` carregam uma playlist inteira do YouTube automaticamente, na ordem da playlist.

## Interface atual

- Trabalhos organizados em sete abas, nesta ordem: Videoclipes, YouTube, Raxaria, Curta-metragem, Mídia paga, Redes sociais e Podcasts.
- Manifesto KondZilla permanece como destaque editorial e na página da KondZilla, mas não aparece nas abas.
- Prateleira horizontal responsiva para vídeos e frames.
- Setas de navegação posicionadas sobre o canto superior direito das thumbnails.
- Playlists não exibem ícone de play sobre a capa; vídeos mantêm o ícone com desfoque reduzido.
- Raxaria usa uma seleção fixa de 13 episódios, na ordem enviada pelo Gustavo.
- Café Mineiro usa a thumbnail horizontal anexada e incorporada localmente ao projeto.
- Backstage usa a capa anexada e incorporada localmente ao projeto.
- Growth Talk usa a thumbnail anexada e incorporada localmente ao projeto.
- Vídeos, playlists e podcasts abrem em pop-up sobre a página.
- Vídeo manifesto usa uma prancha editorial com vídeo principal e frames.
- Raxaria usa uma prancha editorial composta somente por episódios.
- Empresas usam cards horizontais de larguras diferentes.
- Sobre funciona como um painel curricular com foto, formação, trajetória, ferramentas e competências.

