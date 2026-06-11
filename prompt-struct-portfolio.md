# Portfólio — Lucas de Castro

## Projeto
- **Site:** https://llucasparanhos.github.io
- **Repositório:** https://github.com/llucasparanhos/llucasparanhos.github.io
- **Stack:** HTML + CSS + JS puros, sem frameworks

## Estado atual
Leia os arquivos em https://github.com/llucasparanhos/llucasparanhos.github.io antes de qualquer sugestão. O site está funcional mas incompleto visualmente — imagens são placeholders, animações ainda não foram implementadas.

## Arquivos
```
portfolio/
├── index.html
├── style.css
└── main.js
```

## Fontes
```css
--ff: 'Space Grotesk', system-ui, sans-serif; /* títulos */
--fb: 'DM Sans', system-ui, sans-serif;        /* corpo */
```

```html
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700;900&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap" rel="stylesheet">
```

## Deploy
```bash
git add .
git commit -m "descrição"
git push
```

---

## Quem sou eu

Com mais de 10 anos de experiência em Design, hoje busco unir o visual ao mundo analítico. Passei por agências criando para clientes como Google, YouTube e Rede Bahia (afiliada Globo), e startups de Fintech, Healthtech e Govtech. Atualmente atuo como UX/UI e Product Designer na Branef/FESF.

Venho me especializando em dados e analytics, design systems, prototipação, métricas de conversão, retenção e metodologias ágeis. Curso Análise e Desenvolvimento de Sistemas e Product Analytics na PM3, me aprofundando em SQL, Python, Amplitude e Excel para transformar dado bruto em decisão visual.

> Dados sem design é ruído. Design sem dados é opinião.

---

## Objetivo do portfólio

Capturar recrutadores de fintechs, healthtechs e empresas de tecnologia no Brasil.

**Vagas alvo:** Product Designer Pleno/Sênior, Designer de Informação, Design System, UX com dados.

**O recrutador precisa sentir em 5 segundos:**
- Quem sou e qual é meu diferencial
- Que tenho resultados reais, não só telas bonitas
- Que trabalho com empresas conhecidas e metodologia sólida
- Qual é o próximo passo para entrar em contato

---

## Tom e linguagem

**Princípio:** direto, humano, sem parecer IA. Menos adjetivos, mais fatos.

| Errado | Certo |
|--------|-------|
| Designer apaixonado por criar experiências incríveis | 10 anos. Agora com dados. |
| Profissional dedicado e proativo | +15% conversão. Problema resolvido. |
| Busco oportunidades desafiadoras | Produto que funciona. Número que prova. |

- Sem travessões
- Sem "soluções inovadoras"
- Sem "apaixonado por"
- Com números sempre que possível
- Frases curtas valem mais que parágrafos longos

---

## Cases no portfólio

Cada case segue a estrutura: **hook → problema de negócio com KPIs → OKR com KRs e health metrics → diagnóstico → solução → resultado.**

| # | Case | Destaque |
|---|------|----------|
| 01 | Redesign Check-in Wellhub | Gamificação leve, design emocional |
| 02 | Perfil Credenciados Kivid | Conectar pacientes a profissionais com clareza |
| 03 | Checkout Kivid | +15% conversão, -20% abandono |
| 04 | Avaliação NPS Kivid | Cultura data-driven no time de produto |

---

## Ordem de prioridade

1. **Animações e experiência** — é o que transforma o site de estático para memorável
2. **Responsividade mobile** — recrutador abre no celular, muitas vezes pelo LinkedIn
3. **Imagens reais** — tira a sensação de rascunho e dá credibilidade
4. **SEO e Open Graph** — visibilidade no Google e link bonito no LinkedIn
5. **Analytics** — medir qual case converte e onde o recrutador abandona

---

## Experiência e animações

### Conceito geral

O portfólio é um passeio. O recrutador entra numa tela quase vazia e o conteúdo vai ganhando vida conforme ele rola — como assistir um designer pensando em tempo real. A sensação ao chegar no fim deve ser: identificação e inspiração.

Toda animação tem propósito. Nada pisca sem motivo. O movimento reforça hierarquia, guia o olhar e cria ritmo.

### Princípios

- Entradas sempre com fade + movimento sutil (slide de baixo, nunca lateral)
- Delay em cascata para elementos do mesmo grupo — nunca tudo ao mesmo tempo
- Hover sempre responsivo — o elemento reage, respira, cresce
- Transições de página suaves — fade, nunca troca instantânea
- Performance primeiro — CSS animations e Intersection Observer, zero frameworks

### Animações por seção

**Hero**
- Nome aparece letra por letra como se estivesse sendo digitado
- Chips de skills entram em cascata com delay crescente
- Botão principal pulsa suavemente em loop
- Subtítulo faz fade in após o nome terminar

**Cards de cases**
- Cards entram deslizando de baixo quando entram no viewport
- Hover: card cresce levemente (scale 1.03), sombra aparece, imagem faz zoom suave
- Número grande do card faz parallax leve no scroll
- Seta gira 45 graus no hover

**Seção Sobre mim**
- Fade ao entrar no viewport
- Estatísticas contam do zero até o valor final ao aparecer na tela
- Áreas de especialidade entram em cascata

**Cases internos**
- Cada bloco aparece com fade + slide ao rolar
- Boxes dourados têm borda que se desenha ao entrar na tela
- Cards de resultado contam os números ao aparecer

**Navegação**
- Nav aparece com blur e opacity ao fazer scroll para baixo
- Desaparece suavemente ao fazer scroll para cima
- Item ativo tem underline que desliza

### Implementação técnica

- Intersection Observer para disparar animações ao entrar no viewport
- CSS custom properties para controlar duração e delay
- `prefers-reduced-motion` respeitado
- Conteúdo sempre visível se JS falhar

```css
--dur-fast: 0.2s;
--dur-mid: 0.45s;
--dur-slow: 0.7s;
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);
```

---

## Melhorias planejadas

### SEO e visibilidade
- Meta tags: "Product Designer Salvador", "UX Designer dados", "Designer Figma SQL"
- Open Graph para link bonito no LinkedIn e WhatsApp
- Favicon personalizado

### Analytics
- Google Analytics 4
- Eventos: clique em cada case, clique no CTA, tempo na página
- Meta: saber qual case converte mais

### Prova social
- Logos de empresas no hero ou logo abaixo
- Opcional: depoimento curto de gestor ou colega

---

## Como trabalhar comigo

- Leia os arquivos do repositório antes de qualquer sugestão
- Altere apenas o necessário, preservando visual e identidade
- Nunca misture HTML, CSS e JS no mesmo arquivo
- Entregue apenas o arquivo alterado: `index.html`, `style.css` ou `main.js`
- Dê o comando git exato para subir, um por vez
- Me avise quando algo depender de decisão minha antes de executar

---

## Diretrizes de design

- Visual limpo, tipografia forte, muito espaço em branco
- Storytelling nos cases: hook, problema, OKR, solução, resultado
- Métricas sempre presentes: KPIs, OKRs, KRs, health metrics
- Mobile e desktop com mesma qualidade
- Nunca sacrificar clareza por estética

---

## Arquitetura do código

### Princípio geral
O código precisa ser fácil de alterar. Conteúdo separado de estrutura, estrutura separada de estilo, estilo controlado por variáveis. Uma mudança deve exigir edição em um lugar só.

### 1. Conteúdo separado do HTML

Todo texto, título, descrição e dado de case fica num objeto `DATA` no topo do `main.js`. O HTML é gerado a partir desse objeto. Para alterar qualquer conteúdo, edita apenas o `DATA` — nunca caça texto no meio do HTML.

```javascript
const DATA = {
  hero: {
    titulo: 'Product Designer + Dados.',
    subtitulo: '10 anos construindo produtos digitais.'
  },
  cases: [
    {
      id: 'wellhub',
      numero: '01',
      titulo: 'Redesign Check-in Wellhub',
      descricao: 'Transformar o check-in num momento de conquista.',
      tags: ['UX/UI', 'Gamification'],
      empresa: 'Product Designer · 2 semanas'
    }
  ]
}
```

### 2. Tokens de design no CSS

Todas as decisões visuais ficam como variáveis no topo do `style.css`. Mudar a cor principal, o raio dos cards ou a velocidade das animações exige alterar uma linha.

```css
:root {
  /* cores */
  --gold: #b8a06e;
  --gold-lt: #f0e8d8;
  --bg: #faf8f5;
  --text: #1c1c1c;

  /* tipografia */
  --ff: 'Space Grotesk', system-ui, sans-serif;
  --fb: 'DM Sans', system-ui, sans-serif;

  /* espaçamentos */
  --gap-section: 5rem;
  --gap-card: 14px;
  --raio-card: 16px;

  /* animações */
  --dur-fast: 0.2s;
  --dur-mid: 0.45s;
  --dur-slow: 0.7s;
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
}
```

### 3. Componentes gerados por função

Cards, seções de case e blocos repetidos são gerados por funções JS a partir do `DATA`. Adicionar um novo case é só adicionar um objeto no array — o HTML aparece sozinho.

```javascript
function renderCard(c) {
  return `
    <div class="card" onclick="goTo('case', '${c.id}')">
      <div class="card-thumb">...</div>
      <div class="card-body">
        <h3 class="card-title">${c.titulo}</h3>
        <p class="card-desc">${c.descricao}</p>
      </div>
    </div>
  `
}
```

### Impacto prático

| Tarefa | Sem estrutura | Com estrutura |
|--------|--------------|---------------|
| Mudar título do hero | Caçar no HTML | Editar `DATA.hero.titulo` |
| Adicionar case novo | Copiar bloco HTML | Adicionar objeto no array |
| Mudar cor do site | Caçar múltiplas ocorrências | Alterar `--gold` numa linha |
| Ajustar animações | Alterar várias propriedades | Alterar `--dur-mid` numa linha |
| Trocar fonte | Alterar import + variável | Alterar `--ff` numa linha |

---

## Estética — em definição

A identidade visual final ainda está sendo pesquisada. **Não implemente nenhuma mudança estética sem aprovação explícita.**

O que já está definido e não muda:
- Paleta base: fundo off-white `#faf8f5`, dourado `#b8a06e`, texto escuro `#1c1c1c`
- Fontes: Space Grotesk nos títulos, DM Sans no corpo
- Estilo geral: limpo, muito espaço em branco, tipografia forte

O que ainda será decidido:
- Estilo das imagens e tratamento visual dos cases
- Densidade e layout das seções
- Detalhes de microinteração e hover
- Possível tema ou conceito visual unificador

Quando a estética for definida, será documentada aqui antes de qualquer implementação.

---

## Em que pé estamos

### O que existe hoje
- Site funcional no ar em https://llucasparanhos.github.io
- 4 cases com storytelling, OKRs e KPIs escritos
- HTML, CSS e JS separados em arquivos próprios
- Fonte Space Grotesk nos títulos, DM Sans no corpo
- Paleta definida: off-white, dourado, texto escuro
- Imagens ainda são placeholders — pasta `img/` será preenchida

### O que ainda não está feito
- Código ainda mistura conteúdo com estrutura — sem objeto `DATA`, sem componentes gerados por função
- Animações e interações não foram implementadas
- Estética final ainda em definição — referência visual sendo pesquisada
- SEO, Open Graph e Analytics não configurados

### Decisões tomadas

**Scroll, não páginas separadas.**
O portfólio é uma página com scroll. As animações nascem conforme o recrutador desce. O ritmo da história é controlado pelo design. Apenas os cases internos abrem em página própria com profundidade.

**Interativo e com movimento.**
O site precisa ser divertido de navegar. Elementos que reagem ao hover, conteúdo que entra em cena ao rolar, transições suaves entre páginas. Movimento com propósito — nada pisca sem motivo.

**Clean e sem perder o recrutador.**
Muito espaço em branco. Informações organizadas, hierarquia clara. A pessoa nunca fica perdida — sabe onde está e o que fazer em seguida.

### Sequência de construção

Seguir essa ordem. Não pular etapas.

1. **Refatorar a arquitetura** — separar `DATA` do HTML, criar funções que geram componentes, completar tokens de design no CSS. Fazer isso antes de qualquer visual novo.
2. **Definir e aprovar a estética** — referência visual, estilo das imagens, conceito unificador. Nada de implementação visual sem aprovação explícita.
3. **Implementar animações e interações** — scroll reveal, hover, contagem de números, digitação do hero, parallax dos cards.
4. **Substituir placeholders** — imagens reais na pasta `img/`, tratamento visual consistente.
5. **SEO e Open Graph** — meta tags, link bonito no LinkedIn, favicon.
6. **Analytics** — Google Analytics 4, eventos de clique nos cases e CTA.

### Regra principal
Não começar o passo 2 sem terminar o passo 1. Não começar o passo 3 sem aprovação do passo 2. A estética muda tudo — refatorar depois é retrabalho.

---

## Portfólio como produto — KPIs e OKRs

### Conceito
O portfólio é um produto real. Tem objetivo, tem métricas, tem iteração. Não é só um site bonito — é um canal ativo de geração de oportunidades que precisa ser monitorado e melhorado com dados.

### OKRs do portfólio

**Objetivo:** Transformar o portfólio num canal ativo de geração de oportunidades profissionais.

| Key Result | Meta |
|------------|------|
| KR1 | 3 contatos de recrutadores por mês via portfólio |
| KR2 | Taxa de conversão hero → case de pelo menos 60% |
| KR3 | Tempo médio no site acima de 2 minutos |
| KR4 | Pelo menos 1 case com tempo de leitura acima de 3 minutos |
| KR5 | Tráfego orgânico crescendo mês a mês |

### KPIs a monitorar

| KPI | O que revela |
|-----|-------------|
| Visitantes únicos por semana | Se o tráfego está crescendo |
| Taxa de rejeição | Se o hero está prendendo ou não |
| Tempo médio na página | Se a pessoa está lendo ou saindo rápido |
| Cliques por case | Qual case atrai mais |
| Tempo dentro do case | Qual case prende mais |
| Clique no CTA "Falar comigo" | Taxa de conversão real |
| Origem do tráfego | LinkedIn, Google ou direto |

### Ferramentas — apenas gratuitas

- **Google Analytics 4** — tráfego, origem, tempo na página, eventos de clique. Grátis e sem limite.
- **Google Search Console** — quais termos no Google levam ao site, posição nos resultados. Grátis.
- **Hotjar** — heatmap de cliques e scroll, até 35 sessões por dia no plano gratuito. Suficiente para começar.

### Implementação no código

Eventos a rastrear no Google Analytics 4:

```javascript
// clique em case
gtag('event', 'case_click', { case_id: 'wellhub' })

// clique no CTA
gtag('event', 'cta_click', { local: 'hero' })

// tempo de leitura do case (disparar aos 60s)
gtag('event', 'case_read', { case_id: 'wellhub', tempo: '60s' })
```

### Cadência de revisão

- **Toda semana:** checar visitantes, origem e cliques nos cases
- **Todo mês:** revisar OKRs, identificar o case com mais e menos engajamento
- **A cada 3 meses:** iterar no conteúdo ou layout baseado nos dados
