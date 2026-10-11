"""Gera a versão de preview publicada no Claude (pasta preview/).

O preview roda num ambiente que bloqueia iframes, imagens externas e a API do YouTube.
Por isso ativa window.PORTFOLIO_PREVIEW: o pop-up de vídeo mostra um aviso no lugar do player
e as playlists aparecem como um card. O site real (dist/) não muda.
"""
import pathlib, re, shutil

ROOT = pathlib.Path(__file__).resolve().parent.parent
DIST = ROOT / 'dist'
OUT = ROOT / 'preview'
FLAG = '<script>window.PORTFOLIO_PREVIEW = true;</script>'

if OUT.exists():
    shutil.rmtree(OUT)
shutil.copytree(DIST, OUT)

# Página principal: o publicador já envolve o arquivo em <html><head><body>
html = (DIST / 'index.html').read_text()
head = re.search(r'<head>(.*?)</head>', html, re.S).group(1)
body = re.search(r'<body>(.*?)</body>', html, re.S).group(1)
keep = [line.strip() for line in head.splitlines()
        if line.strip().startswith(('<link rel="stylesheet"', '<link href="https://fonts', '<link rel="preconnect"', '<script'))]
scripts = [l for l in keep if l.startswith('<script')]
links = [l for l in keep if not l.startswith('<script')]
fragment = '\n'.join(['<title>Portfólio Gustavo Nascimento</title>', *links, FLAG, *scripts]) + '\n' + body.strip() + '\n'
(OUT / 'index.html').write_text(fragment)

# Página da empresa: documento completo, só recebe a flag
company = (DIST / 'empresa' / 'index.html').read_text()
assert '<script src="../assets/js/catalog.js"' in company
company = company.replace('<script src="../assets/js/catalog.js"', FLAG + '\n    <script src="../assets/js/catalog.js"', 1)
(OUT / 'empresa' / 'index.html').write_text(company)
print('preview pronto em', OUT)
