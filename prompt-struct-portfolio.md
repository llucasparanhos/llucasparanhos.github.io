# Portfólio — Lucas de Castro
> Documento de estado atual do projeto. Leia antes de qualquer sugestão.

## Projeto
- **Site:** https://llucasparanhos.github.io
- **Repositório:** https://github.com/llucasparanhos/llucasparanhos.github.io
- **Stack:** HTML + CSS + JS puros, sem frameworks
- **Pasta local:** `C:\Users\lluca\Documents\Portfólio\`

## Arquivos
```
portfolio/
├── index.html
├── style.css
├── main.js
└── img/
```

## Fontes
```css
--ff-display: 'Syne', system-ui, sans-serif;      /* hero display */
--ff-mono:    'DM Mono', system-ui, sans-serif;    /* labels, tags */
--ff-body:    'DM Sans', system-ui, sans-serif;    /* corpo, títulos bold */
--ff-serif:   'DM Serif Display', serif;           /* sobre */
```

## Paleta
```css
--c-bg:#0c0c0c; --c-bg2:#141414; --c-bg3:#1c1c1c;
--c-text:#f0ede8; --c-muted:#999; --c-dim:#555;
--c-line:rgba(240,237,232,.1); --c-gold:#c9a96e;
```

## Deploy
```bash
git add .
git commit -m "descrição"
git push
```

---

## Estado atual — O que está pronto

### Estrutura SPA (single page app)
- `#page-home` — hero + projetos + footer (home)
- `#page-case` — páginas internas dos cases (geradas por JS via `openCase()`)
- `#page-sobre` — página sobre completa

### NAV
- Grid 3 colunas: `Sobre` (esquerda) · `Lucas de Castro` (centro) · `LinkedIn Email WhatsApp Feedback` (direita)
- Mobile: hamburger com menu overlay

### HERO
- Typewriter: "Lucas de Castro" digita → "Product Designer & Analytics" digita → seleção animada
- Cursor SVG animado com lerp (some quando usuário usa mouse)
- Subtítulo fade in após typewriter

### CARDS DE PROJETOS (home)
- 6 cards em grid 2 colunas desktop
- Card = foto full (sem texto embaixo no desktop)
- Hover desktop: overlay escurece + mostra empresa, título, "Ver case →"
- Mobile: long press (320ms) mostra overlay; toque curto abre o case
- Cards 5 e 6 (Kinvo e BomConsórcio): badge dourado "Em construção" + "Em breve" no overlay
- Gap e padding mobile: 8px
- Border-radius mobile: 8px

### LIGHTBOX
- Clique em qualquer imagem dos cases abre em tela cheia
- `lbOpen(src)` / `lbClose()` / ESC para fechar
- `#lb-overlay` no index.html

### CARROSSEL
- `carouselMove(btn, dir)` / `carouselDot(dot)` / `_renderCarousel()`
- Classe `.ch-carousel` — proporção 4:5 (padrão / Wellhub problema)
- Classe `.ch-carousel.telas` — proporção 392:852, max-width 360px centralizado (Credenciados e NPS)
- Classe `.ch-carousel.telas` — reutilizada para NPS também

### PÁGINAS DE CASES
Cada case tem estrutura:
1. Hook (itálico, grande)
2. Meu papel (border-left dourada)
3. **O Problema** (ch-highlight com label dourado)
   - Wellhub: carrossel 4:5 com 10 imagens
   - Credenciados: funcImg wide
   - Checkout: personaImg + grid 2x2 telas antigas (1366:768)
   - NPS: sem imagem de problema
4. **KPIs & OKRs** (ch-highlight) — árvore: objetivo → KRs → KPIs (conectores hidden mobile)
5. Imagem de processo (`id-processo.jpg`) — `ch-func-img`, altura natural
6. **Como pensei a solução** (ch-highlight)
   - NPS: wireframes dentro do bloco
7. Imagens da solução (varia por case — ver abaixo)
8. Resultados (res-grid 2 colunas)

---

## Imagens por case

### Wellhub
| Arquivo | Onde |
|---|---|
| `wellhub-hero.png` | Card na home |
| `wellhub-case-hero.jpg` | Hero da página interna |
| `wellhub-problema-1.jpg` até `10.jpg` | Carrossel O Problema (4:5) |
| `wellhub-processo.jpg` | Entre KPIs e solução (1891×355px) |
| `wellhub-comp-1.jpg` até `4.jpg` | Grid 2x2 Antes × Depois (4:3) |

**Campos no CASES object:**
```js
carousel: ['wellhub-problema-1.jpg', ..., 'wellhub-problema-10.jpg'],
comparativo: ['wellhub-comp-1.jpg', 'wellhub-comp-2.jpg', 'wellhub-comp-3.jpg', 'wellhub-comp-4.jpg'],
```

### Credenciados
| Arquivo | Onde |
|---|---|
| `credenciados-hero.png` | Card na home |
| `credenciados-case-hero.jpg` | Hero da página interna (1600×600px) |
| `credenciados-func.jpg` | Funcionalidades wide após O Problema |
| `credenciados-processo.jpg` | Entre KPIs e solução |
| `credenciados-solucao.jpg` | Após Como pensei a solução (wide) |
| `credenciados-tela-1.jpg` até `6.jpg` | Carrossel Telas (392:852, max 360px) |

**Campos no CASES object:**
```js
telas: ['credenciados-tela-1.jpg', ..., 'credenciados-tela-6.jpg'],
funcImg: 'credenciados-func.jpg',
solucaoImg: 'credenciados-solucao.jpg',
```

### Checkout
| Arquivo | Onde |
|---|---|
| `checkout-hero.png` | Card na home |
| `checkout-case-hero.jpg` | Hero da página interna (1600×600px) |
| `checkout-persona.jpg` | Persona após O Problema |
| `checkout-antes-1.jpg` até `4.jpg` | Grid 2x2 telas antigas (1366:768) |
| `checkout-processo.jpg` | Entre KPIs e solução |
| `checkout-solucao-desktop.jpg` | Solução — coluna, imagem 1 |
| `checkout-solucao-mobile.jpg` | Solução — coluna, imagem 2 |

**Campos no CASES object:**
```js
antes: ['checkout-antes-1.jpg', ..., 'checkout-antes-4.jpg'],
personaImg: 'checkout-persona.jpg',
solucaoImgs: ['checkout-solucao-desktop.jpg', 'checkout-solucao-mobile.jpg'],
```

### NPS
| Arquivo | Onde |
|---|---|
| `nps-hero.png` | Card na home |
| `nps-case-hero.jpg` | Hero da página interna (1600×600px) |
| `nps-processo.jpg` | Entre KPIs e solução |
| `nps-wireframes.jpg` | Dentro de Como pensei a solução |
| `nps-tela-1.jpg` até `7.jpg` | Carrossel Telas (392:852, max 360px) |

**Campos no CASES object:**
```js
wireframes: 'nps-wireframes.jpg',
telas: ['nps-tela-1.jpg', ..., 'nps-tela-7.jpg'],
```

---

## Página Sobre
- Foto: `img/foto.jpg`
- Texto bio, frase, áreas de skill (4 cols desktop, 1 col mobile)
- Stats: 4 números com "ghost number" decorativo
- Logos 4×2 grid: Google, YouTube, Rede Bahia, BTG, Kinvo, Kivid, BomConsórcio, California
- Trajetória profissional com lista de experiências

## SEO / Open Graph
```html
<meta property="og:image" content="https://llucasparanhos.github.io/img/og-cover.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
```
- Imagem OG: `img/og-cover.jpg` (1200×630px)

---

## Cases em construção (cards 5 e 6)
- **Kinvo** — `kinvo-hero.png` no card, overlay "Em construção"
- **BomConsórcio** — `bomconsórcio-hero.png` no card, overlay "Em construção"
- Não têm página interna ainda

---

## Lógica do openCase() — fluxo de renderização
```
openCase(id, title)
  → busca CASES[id]
  → cria .ch-ct (eyebrow, título, meta)
  → cria .ch-img-area (hero: id-case-hero.jpg)
  → cria .ch-bd com bd.innerHTML:
      hook → meu papel → O Problema →
      [carousel se c.carousel e !c.funcImg] →
      [funcImg se c.funcImg] →
      [personaImg se c.personaImg] →
      [grid 2x2 antes se c.antes] →
      KPIs & OKRs →
      processo (id-processo.jpg) →
      Como pensei a solução →
      [wireframes dentro se c.wireframes] →
      [solucaoImgs coluna se c.solucaoImgs] →
      [solucaoImg wide se c.solucaoImg] →
      [telas carousel se c.telas] →
      [comparativo 2x2 se c.comparativo] →
      Resultados
```

---

## Como trabalhar neste projeto
- Leia este arquivo antes de qualquer sugestão
- Altere apenas o necessário, preservando visual e identidade
- Nunca misture HTML, CSS e JS no mesmo arquivo
- Entregue apenas o arquivo alterado
- Dê o comando git exato para subir
- Me avise quando algo depender de decisão antes de executar
- Português brasileiro em tudo, exceto termos técnicos
- **Problema recorrente:** `main.js` local às vezes não é substituído pelo arquivo baixado do Claude. Solução: usar `fix_mainjs.py` ou deletar o arquivo e baixar novamente, depois `git add main.js` → commit → push
