
/* ── LANGUAGE TOGGLE ── */
var currentLang = 'pt';

function toggleLang(){
  currentLang = currentLang === 'pt' ? 'en' : 'pt';
  var btn = document.getElementById('lang-toggle');
  if(btn) btn.textContent = currentLang === 'pt' ? 'PT · EN' : 'EN · PT';
  applyLang();
}

function t(en, pt){ return currentLang === 'en' ? en : pt; }

function applyLang(){
  var lang = currentLang;
  // Update all elements with data-pt/data-en
  document.querySelectorAll('[data-pt]').forEach(function(el){
    var val = el.getAttribute('data-' + lang);
    if(!val) return;
    // If it contains HTML tags, use innerHTML, else textContent
    if(val.indexOf('<') !== -1){
      el.innerHTML = val;
    } else {
      el.textContent = val;
    }
  });
  // Update placeholder on textarea
  document.querySelectorAll('[data-pt][placeholder]').forEach(function(el){
    el.placeholder = el.getAttribute('data-' + lang) || el.placeholder;
  });
  // Update html lang attribute
  document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';
}


/* ── LIGHTBOX ── */
function lbOpen(src){
  var img = document.getElementById('lb-img');
  var overlay = document.getElementById('lb-overlay');
  if(!img || !overlay) return;
  img.src = src;
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function lbClose(){
  var overlay = document.getElementById('lb-overlay');
  if(overlay) overlay.classList.remove('open');
  document.body.style.overflow = '';
}
document.addEventListener('keydown', function(e){
  if(e.key === 'Escape') lbClose();
});
/* v2 */

/* ── CAROUSEL — case pages ── */
var _carouselIdx = {};

function carouselMove(btn, dir){
  var carousel = btn.closest('.ch-carousel');
  if(!carousel) return;
  var track = carousel.querySelector('.ch-carousel-track');
  var slides = track.children.length;
  var cur = parseInt(carousel.dataset.idx||'0');
  carousel.dataset.idx = (cur + dir + slides) % slides;
  _renderCarousel(carousel, track, slides);
}

function carouselDot(dot){
  var carousel = dot.closest('.ch-carousel');
  if(!carousel) return;
  var track = carousel.querySelector('.ch-carousel-track');
  carousel.dataset.idx = dot.dataset.idx;
  _renderCarousel(carousel, track, track.children.length);
}

function _renderCarousel(carousel, track, slides){
  var idx = parseInt(carousel.dataset.idx||'0');
  track.style.transform = 'translateX(-'+(idx*100)+'%)';
  var dots = carousel.querySelectorAll('.ch-carousel-dot');
  dots.forEach(function(d,i){ d.classList.toggle('active', i===idx); });
  var count = carousel.querySelector('.ch-carousel-count');
  if(count) count.textContent = (idx+1)+' / '+slides;
}

/* ============================================================
   main.js, Lucas de Castro Portfolio
   ============================================================ */

/* ── SPLASH ── */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('splash').classList.add('gone');
  }, 1000);
});

/* ── NAV ── */
const navName = document.getElementById('nav-name');
if(navName) navName.addEventListener('click', () => goToHome());

function goToHome(){
  document.getElementById('page-home').classList.add('active');
  document.getElementById('page-case').classList.remove('active');
  document.getElementById('page-sobre').classList.remove('active');
  window.scrollTo({top:0, behavior:'instant'});
}

function goToSobre(){
  document.getElementById('page-home').classList.remove('active');
  document.getElementById('page-case').classList.remove('active');
  document.getElementById('page-sobre').classList.add('active');
  window.scrollTo({top:0, behavior:'instant'});
}

/* ── MOBILE MENU ── */
const ham = document.getElementById('nav-ham');
const mob = document.getElementById('mob-menu');
const mobClose = document.getElementById('mob-close');

if(ham) ham.addEventListener('click', () => {
  ham.classList.toggle('open');
  mob.classList.toggle('open');
  document.body.style.overflow = mob.classList.contains('open') ? 'hidden' : '';
});
if(mobClose) mobClose.addEventListener('click', closeMob);

function closeMob(){
  ham && ham.classList.remove('open');
  mob && mob.classList.remove('open');
  document.body.style.overflow = '';
}

/* ── HERO, Typewriter + Seleção + Cursor (onyourtiptoes style) ── */
(function(){
  const hero       = document.querySelector('.hero');
  const cursor     = document.getElementById('hero-cursor');
  const line1El    = document.getElementById('hero-line1');
  const caret1     = document.getElementById('hero-caret1');
  const line2El    = document.getElementById('hero-line2');
  const selectBg   = document.getElementById('hero-select-bg');
  const line3El    = document.getElementById('hero-line3');
  const subEl      = document.querySelector('.hero-sub');

  if(!hero || !line1El) return;

  const TEXT1 = 'Lucas de Castro';
  const TEXT2 = 'Product Designer & Analytics';
  const TEXT3 = 'Salvador, Bahia · Disponível';

  /* Animated auto-moving cursor, moves on its own like a real person */
  if(cursor){
    const heroRect = () => hero.getBoundingClientRect();

    /* Waypoints the cursor visits, relative to hero (0-1) */
    const waypoints = [
      {x:.15, y:.55},  /* starts left */
      {x:.35, y:.42},  /* moves toward title */
      {x:.55, y:.38},  /* hovers over text */
      {x:.72, y:.38},  /* drags across selection */
      {x:.52, y:.38},  /* back left, simulates selecting */
      {x:.68, y:.62},  /* moves down */
      {x:.25, y:.70},  /* swings left */
      {x:.15, y:.55},  /* back to start */
    ];

    let wi = 0;
    let curX = 0, curY = 0;
    let targetX = 0, targetY = 0;
    let visible = false;

    function updateTarget(){
      const r = heroRect();
      const wp = waypoints[wi];
      targetX = r.left + r.width  * wp.x;
      targetY = r.top  + r.height * wp.y;
      wi = (wi + 1) % waypoints.length;
    }

    /* Show cursor after typewriter starts */
    setTimeout(() => {
      const r = heroRect();
      curX = r.left + r.width * .15;
      curY = r.top  + r.height * .55;
      cursor.style.left = curX + 'px';
      cursor.style.top  = curY + 'px';
      cursor.classList.add('visible');
      visible = true;
      updateTarget();
    }, 600);

    /* Move every N ms to next waypoint */
    setInterval(() => { if(visible) updateTarget(); }, 2200);

    /* Smooth lerp animation */
    function animCursor(){
      if(visible){
        curX += (targetX - curX) * 0.045;
        curY += (targetY - curY) * 0.045;
        cursor.style.left = curX + 'px';
        cursor.style.top  = curY + 'px';
      }
      requestAnimationFrame(animCursor);
    }
    animCursor();

    /* Hide when user moves their own mouse over hero */
    hero.addEventListener('mouseenter', () => { visible = false; cursor.classList.remove('visible'); });
    hero.addEventListener('mouseleave', () => { visible = true;  cursor.classList.add('visible'); updateTarget(); });
  }

  /* Typewriter helper */
  function typeText(el, text, speed, cb){
    let i = 0;
    function next(){
      if(i <= text.length){
        el.textContent = text.slice(0, i);
        i++;
        setTimeout(next, speed + Math.random() * 30);
      } else {
        if(cb) cb();
      }
    }
    next();
  }

  /* Selection animation: expand bg overlay left→right */
  function animateSelection(el, bg, text, cb){
    el.textContent = text;
    const w = el.offsetWidth;
    let start = null;
    const dur = 500;
    function step(ts){
      if(!start) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      bg.style.width = (w * p) + 'px';
      if(p < 1){
        requestAnimationFrame(step);
      } else {
        /* Hold selected for 600ms then deselect */
        setTimeout(() => {
          let s2 = null;
          function desel(ts2){
            if(!s2) s2 = ts2;
            const p2 = Math.min((ts2 - s2) / 300, 1);
            bg.style.width = (w * (1 - p2)) + 'px';
            if(p2 < 1) requestAnimationFrame(desel);
            else if(cb) cb();
          }
          requestAnimationFrame(desel);
        }, 600);
      }
    }
    requestAnimationFrame(step);
  }

  /* Sequence */
  setTimeout(() => {
    /* 1. Type line 1 */
    typeText(line1El, TEXT1, 55, () => {
      /* Hide caret on line 1 */
      setTimeout(() => {
        if(caret1) caret1.classList.add('hidden');

        /* 2. Type line 2 */
        typeText(line2El, TEXT2, 45, () => {

          /* 3. Animate selection on line 2 */
          setTimeout(() => {
            animateSelection(line2El, selectBg, TEXT2, () => {

              /* 4. Show sub line */
              if(line3El) line3El.textContent = TEXT3;
              if(subEl) subEl.classList.add('visible');
            });
          }, 300);
        });
      }, 200);
    });
  }, 800);
})();

/* ── REVEAL ON SCROLL ── */
const allReveal = document.querySelectorAll('.reveal');
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if(e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
  });
}, { threshold: .05, rootMargin: '0px 0px -20px 0px' });
allReveal.forEach(r => obs.observe(r));
setTimeout(() => {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
}, 1400);

const CASES={
  wellhub:{
    color:'#0F6E56',bg:'#111',
    carousel:['wellhub-problema-1.jpg','wellhub-problema-2.jpg','wellhub-problema-3.jpg','wellhub-problema-4.jpg','wellhub-problema-5.jpg','wellhub-problema-6.jpg','wellhub-problema-7.jpg','wellhub-problema-8.jpg','wellhub-problema-9.jpg','wellhub-problema-10.jpg'],
    comparativo:['wellhub-comp-1.jpg','wellhub-comp-2.jpg','wellhub-comp-3.jpg','wellhub-comp-4.jpg'],
    ey:'UX/UI · Gamification · Wellness',
    ttl:'340 treinos.<br><em>Nenhuma celebração.</em>',
    meta:['Product Designer','2 semanas','Figma · Adobe CC'],
    hook:'"Sou usuário ativo do Wellhub há anos. Mais de 340 check-ins. Cada um representou uma decisão consciente de sair do sofá, ir à academia e investir na saúde. E o app? Tratava todos exatamente igual. Sem diferença entre o primeiro treino e o de número 300."',
    context:'<p>Como usuário frequente e designer, tinha acesso a algo que pesquisas de usabilidade raramente capturam: <strong>a experiência vivida por dentro</strong>. 534 check-ins acumulados eram dados reais de comportamento, não simulação. E o padrão era claro: quanto mais frequente o uso, mais invisível o app ficava. Nenhuma resposta emocional. Nenhum reconhecimento.</p><p>Aplicativos de bem-estar vivem de <strong>recorrência</strong>. A ciência comportamental chama isso de loop de hábito: gatilho, rotina, recompensa. O Wellhub tinha o gatilho (academia) e a rotina (check-in), mas quebrava o loop exatamente na recompensa. Sem ela, o hábito enfraquece. Com ela, ele se reforça sozinho.</p><p>O risco de negócio era direto: <strong>usuários sem senso de progresso cancelam planos</strong>. Retenção cai. CAC sobe. O check-in era a maior oportunidade de reforço de hábito que o produto desperdiçava a cada dia.</p>',
    diags:[
      {icon:'👁',title:'Zero feedback emocional',desc:'O check-in não devolvia nada ao usuário além de uma confirmação técnica.'},
      {icon:'📉',title:'Botão sem peso visual',desc:'Hierarquia quebrada: o momento mais importante da jornada era invisível.'},
      {icon:'🔁',title:'Sem histórico visível',desc:'Nenhuma forma de ver progresso acumulado ou sequências de treinos.'},
      {icon:'🎯',title:'Recomendações genéricas',desc:'Sugestões sem conexão com o perfil ou histórico do usuário.'}
    ],
    kpis:[
      {icon:'⏱',label:'Engajamento pós check-in',val:'Tempo na tela',desc:'Quanto tempo o usuário permanece após confirmar o treino'},
      {icon:'📊',label:'Taxa de abandono',val:'Fluxo de check-in',desc:'Usuários que iniciam mas não completam o check-in'},
      {icon:'⭐',label:'NPS de personalização',val:'Percepção do usuário',desc:'Sensação de que o app reconhece e valoriza o esforço'}
    ],
    role:'Product Designer responsável de ponta a ponta: pesquisa, benchmark, wireframes, protótipo e testes de usabilidade.',
    insight:'<p>Todo mundo via o check-in como um <strong>botão</strong>. Eu vi como o <strong>ápice emocional da jornada</strong>, o instante em que o usuário cumpriu o que prometeu a si mesmo. Esse reframing mudou tudo: não era sobre confirmar uma presença, era sobre reconhecer um esforço.</p><p>A pergunta que guiou o projeto: <em>o que deveria acontecer depois do check-in número 100 que não acontece no número 1?</em> A resposta óbvia era "uma tela diferente". A resposta certa era "uma sensação diferente". Partimos dali.</p>',
    objetivo:'Transformar o check-in num ritual de conquista que reforce o hábito.',
    krs:[
      {txt:'Aumentar o tempo de permanência na tela pós check-in',meta:'+30%'},
      {txt:'Reduzir taxa de abandono no fluxo de check-in',meta:'-20%'},
      {txt:'Melhorar percepção de personalização no NPS',meta:'+15pts'}
    ],
    sol:'<p>Reframing estratégico: <strong>de botão para ritual. De função para celebração. De ação neutra para microvitória reconhecida.</strong></p><p>O benchmark com Duolingo, Apple Fitness, TotalPass e Strava serviu de filtro, não de referência direta. O que cada um fazia bem: Duolingo usa animação e som para criar impacto emocional imediato. Apple Fitness mostra progresso acumulado e fechamento de anéis. Strava celebra o esforço com métricas do treino. O que descartei: pontuações competitivas e rankings, que funcionam para alguns perfis mas criam ansiedade em usuários casuais — exatamente quem mais precisa de reforço positivo.</p><p><strong>Risco mapeado antes de começar:</strong> gamificação mal calibrada pode inverter o efeito. Se o usuário se sentir pressionado a manter uma sequência, uma quebra de streak vira motivo de abandono, não de retorno. O design precisava celebrar o que foi feito, nunca cobrar o que não foi. Por isso os estados de "sequência recuperada" foram desenhados com o mesmo peso visual dos estados de conquista — quebrar e voltar é tão válido quanto nunca parar.</p><p>A decisão mais importante foi <strong>criar estados diferenciados de check-in</strong>: primeiro treino, marcos de 10/50/100/300 check-ins, sequências semanais ativas e sequências recuperadas após pausa. Cada estado tem animação, microcopy e feedback visual próprios. Não é só uma tela diferente: é o app reconhecendo <em>que treino específico</em> foi aquele. O usuário de 534 check-ins nunca mais recebe a mesma resposta de quem foi pela primeira vez.</p>',
    results:[['534','Check-ins pessoais usados como dado de descoberta — o problema foi vivido antes de ser desenhado','ti-run','check'],['100%','Feedback positivo em todas as sessões de teste com usuários reais, incluindo perfis de baixa frequência','ti-users','up'],['↑','Tempo na tela pós check-in aumentou nos testes de usabilidade — usuários exploravam conquistas e histórico','ti-trending-up','up'],['✓','Decisão de excluir rankings validada: 4 de 5 testadores mencionaram alívio pela ausência de comparação social','ti-star','check']],
    en:{
      ey:'UX/UI · Gamification · Wellness',
      ttl:'340 workouts.<br><em>Not a single celebration.</em>',
      meta:['Product Designer','2 weeks','Figma · Adobe CC'],
      hook:'"I\'ve been an active Wellhub user for years. Over 340 check-ins. Each one was a conscious decision to get off the couch, go to the gym, and invest in my health. And the app? It treated every single one exactly the same. No difference between the first workout and number 300."',
      context:'<p>As a frequent user and designer, I saw a real opportunity to create something emotionally engaging in the check-in experience. The redesign was born from a genuine frustration: the app didn\'t acknowledge the effort that brought the user there.</p><p>Wellness apps live on <strong>habit</strong>. Users who build routines come back. Users who feel no progress disappear. The check-in was the biggest missed opportunity to reinforce that habit.</p>',
      role:'Product Designer responsible end-to-end: research, benchmarking, wireframes, prototype and usability testing.',
      insight:'<p>Everyone saw the check-in as a <strong>button</strong>. I saw it as the <strong>emotional peak of the journey</strong>, the moment the user delivered on a promise they made to themselves. That reframing changed everything: it wasn\'t about confirming attendance, it was about recognizing effort.</p>',
      objetivo:'Transform the check-in into a ritual of achievement that reinforces the habit.',
      krs:[
        {txt:'Increase time on screen after check-in',meta:'+30%'},
        {txt:'Reduce drop-off rate in check-in flow',meta:'-20%'},
        {txt:'Improve personalization perception in NPS',meta:'+15pts'}
      ],
      kpis:[
        {icon:'⏱',label:'Post check-in engagement',val:'Time on screen',desc:'How long users stay after confirming their workout'},
        {icon:'📊',label:'Drop-off rate',val:'Check-in flow',desc:'Users who start but don\'t complete the check-in'},
        {icon:'⭐',label:'Personalization NPS',val:'User perception',desc:'Feeling that the app recognizes and values the effort'}
      ],
      sol:'<p>Strategic reframing: <strong>from button to ritual. From function to celebration. From neutral action to recognized micro-victory.</strong></p><p>Benchmarking Duolingo, Apple Fitness, TotalPass and Strava revealed the common pattern: all of them celebrate the present moment and show users where they\'ve arrived. Light gamification, achievements, streaks, visual progress, reinforces behavior without becoming a game.</p><p>We created differentiated states: first check-in, milestones at 10/50/100 check-ins, weekly streaks. Each state has its own visual and text feedback, making every workout feel unique.</p>',
      results:[['534','Real check-ins validated the problem before the first wireframe','ti-run','check'],['100%','Positive feedback in all testing sessions with real users','ti-users','up'],['↑','Post check-in engagement increased in usability tests','ti-trending-up','up'],['✓','Sense of achievement validated as key differentiator in all interviews','ti-star','check']]
    },
  },
  credenciados:{
    color:'#185FA5',bg:'#111',
    telas:['credenciados-tela-1.jpg','credenciados-tela-2.jpg','credenciados-tela-3.jpg','credenciados-tela-4.jpg','credenciados-tela-5.jpg','credenciados-tela-6.jpg'],
    funcImg:'credenciados-func.jpg',
    solucaoImg:'credenciados-solucao.jpg',
    ey:'UX Research · HealthTech · Kivid',
    ttl:'O usuário fechou<br>o app e foi no <em>Google.</em>',
    meta:['Product Designer','3 semanas','Figma'],
    hook:'"Imagine que você está com dor, precisa marcar uma consulta e abre o app do seu plano de saúde. A tela mostra o nome do médico e um número de telefone. Só isso. Sem endereço completo. Sem horários. Sem convênios. Nada que te ajudasse a decidir."',
    context:'<p>O Kivid havia construído uma rede de credenciados robusta, mas não havia pensado em montar uma <strong>experiência</strong> em volta desses dados. A lista existia. As informações existiam. Estavam espalhadas, incompletas ou simplesmente ausentes na interface.</p><p>O impacto era tríplice e mensurável: <strong>usuários saíam do app</strong> para completar a busca no Google (perda de contexto e sessão), a <strong>taxa de agendamentos originados dentro do app era baixa</strong> (perda de conversão) e os <strong>tickets de suporte sobre credenciados eram o segundo maior volume</strong> do time de CS, custo operacional direto para o negócio. Não era só um problema de UX, era uma ineficiência sistêmica com custo real.</p><p>A persona que guiou tudo: Paulo, 43 anos, autônomo, plano familiar. Ele usa o app às 22h, depois do trabalho, tentando marcar uma consulta para o filho. Cada segundo de dúvida é abandono. Cada campo ausente é uma ligação para o suporte no dia seguinte.</p>',
    diags:[
      {icon:'🗺',title:'Endereço ausente',desc:'Usuário precisava sair do app para encontrar o endereço completo do profissional.'},
      {icon:'🕐',title:'Sem horários disponíveis',desc:'Impossível saber se o médico atendia no turno desejado.'},
      {icon:'📞',title:'Só um telefone',desc:'A única ação disponível era ligar, sem alternativas de contato ou agendamento.'},
      {icon:'🧩',title:'Layout inconsistente',desc:'Experiência quebrada entre dispositivos, sem padrão visual.'}
    ],
    kpis:[
      {icon:'🚶',label:'Taxa de abandono',val:'Tela de credenciados',desc:'Usuários que entram na busca e saem sem tomar ação'},
      {icon:'📅',label:'Agendamentos no app',val:'% do total',desc:'Consultas iniciadas dentro do Kivid vs fora'},
      {icon:'🎧',label:'Tickets de suporte',val:'Sobre credenciados',desc:'Chamados sobre informações básicas de profissionais'}
    ],
    role:'Product Designer responsável pela descoberta, pesquisa com usuários internos, arquitetura da informação, protótipo e validação.',
    insight:'<p>A lista de credenciados existia. Os dados existiam. Mas estavam <strong>espalhados e sem hierarquia</strong>. O insight não foi criar informação nova, foi perceber que o problema era de <strong>experiência, não de dados</strong>. Bastava montar uma jornada de decisão em volta do que já existia.</p><p>O exercício de priorização foi crítico. Mapeei 12 informações que o usuário poderia querer ver. A pergunta foi: <em>qual delas, sozinha, mais reduz abandono?</em> Testei hipóteses com usuários internos e a resposta foi clara: <strong>endereço + botão de ação visível</strong>. Não avaliação, não foto do consultório, não currículo do médico. O endereço completo e a ação de contato acima da dobra respondiam por 80% da motivação de abandono. Priorizar isso antes de qualquer enfeite foi a decisão mais importante do projeto.</p>',
    objetivo:'Tornar a busca de profissionais confiável, completa e rápida o suficiente para eliminar a necessidade de sair do app.',
    krs:[
      {txt:'Reduzir taxa de abandono da tela de credenciados',meta:'-30%'},
      {txt:'Aumentar agendamentos iniciados dentro do app',meta:'+25%'},
      {txt:'Reduzir tickets de suporte sobre credenciados',meta:'-40%'}
    ],
    sol:'<p>Uma página de perfil completa: o equivalente digital do cartão de visita profissional + agenda + mapa, tudo junto, sem sair do app. Nome, especialidade, avaliação por estrelas, endereço com mapa integrado, telefone direto, horários por dia da semana, convênios aceitos e fotos do consultório. <strong>Decisão tomada em segundos, sem fricção.</strong></p><p>A descoberta mais relevante dos testes: o botão "Ligar" precisava estar visível sem scroll em qualquer tamanho de tela. Parecia óbvio depois, mas a versão inicial o colocava abaixo das avaliações, o que empiricamente aumentava o abandono. Movê-lo para o topo da página, fixo no viewport, foi a mudança de maior impacto individual do projeto inteiro.</p><p><strong>Decisão de escopo com base em dependência técnica:</strong> uma das features desejadas era calendário de disponibilidade em tempo real. Descartei para essa entrega porque exigiria integração com a agenda de cada profissional — uma dependência técnica que não existia e que atrasaria a entrega em semanas sem garantia de adoção pelos credenciados. Em vez disso, usei horários fixos por dia da semana preenchidos manualmente pelo profissional. Entregou 90% do valor percebido com zero dependência nova. <strong>O escopo certo não é o mais completo — é o que entrega valor real sem criar riscos desnecessários.</strong></p><p>Antes de subir para produção, mapeei com o time de suporte as métricas de acompanhamento: taxa de abandono na tela de credenciados (via analytics), agendamentos originados no app (via CRM), e volume de tickets por categoria (via suporte). Cada métrica tinha dono e cadência de revisão definidos antes do lançamento.</p>',
    results:[['0→1','Usuários localizaram profissionais com endereço, horário e convênios sem sair do app — pela primeira vez','ti-map-pin','check'],['↓','Tickets de suporte sobre credenciados reduziram após o lançamento — impacto operacional direto no CS','ti-headset','down'],['↑','Agendamentos iniciados dentro do app aumentaram no primeiro mês','ti-calendar','up'],['✓','"Finalmente tudo no lugar certo" — feedback espontâneo. Botão de ação acima da dobra foi a decisão de maior ROI do projeto','ti-message','check']],
    en:{
      ey:'UX Research · HealthTech · Kivid',
      ttl:'The user closed<br>the app and googled it.',
      meta:['Product Designer','3 weeks','Figma'],
      hook:'"Imagine you\'re in pain, need to schedule an appointment, and open your health plan app. The screen shows the doctor\'s name and a phone number. That\'s it. No full address. No hours. No accepted insurance. Nothing to help you decide."',
      context:'<p>Kivid had built a robust network of registered providers, but hadn\'t thought about building an <strong>experience</strong> around that data. The list existed. The information existed. It was scattered, incomplete, or simply absent from the interface.</p><p>The impact was direct: users left the app to search on Google, the appointment rate from within the app was low, and support tickets about basic provider info were high, a direct operational cost to the business.</p>',
      role:'Product Designer responsible for discovery, research with internal users, information architecture, prototype and validation.',
      insight:'<p>The provider list existed. The data existed. But it was <strong>scattered and without hierarchy</strong>. The insight wasn\'t creating new information, it was realizing the problem was about <strong>experience, not data</strong>. We just needed to build a decision journey around what already existed.</p>',
      objetivo:'Make provider search reliable, complete and fast enough to eliminate the need to leave the app.',
      krs:[
        {txt:'Reduce drop-off rate on the providers screen',meta:'-30%'},
        {txt:'Increase appointments started within the app',meta:'+25%'},
        {txt:'Reduce support tickets about providers',meta:'-40%'}
      ],
      kpis:[
        {icon:'🚶',label:'Drop-off rate',val:'Providers screen',desc:'Users who enter the search and leave without taking action'},
        {icon:'📅',label:'In-app appointments',val:'% of total',desc:'Consultations initiated within Kivid vs outside'},
        {icon:'🎧',label:'Support tickets',val:'About providers',desc:'Calls about basic professional information'}
      ],
      sol:'<p>A complete profile page: the digital equivalent of a professional business card + schedule + map, all together, without leaving the app.</p><p>Name, specialty, star rating, address with integrated map, direct phone, weekly hours, accepted insurance, and photos of the office. <strong>Decision made in seconds, without friction.</strong></p><p>Key discovery in testing: the "Call" button needed to be visible without scrolling. Any position below the fold increased abandonment. That simple adjustment had the greatest impact.</p>',
      results:[['0→1','Users found providers without leaving the app for the first time','ti-map-pin','check'],['↓','Support tickets decreased after launch','ti-headset','down'],['↑','In-app appointments increased in the first month','ti-calendar','up'],['4/5','"Finally everything in the right place" — spontaneous feedback in tests','ti-message','check']]
    },
  },
  checkout:{
    color:'#993556',bg:'#111',
    antes:['checkout-antes-1.jpg','checkout-antes-2.jpg','checkout-antes-3.jpg','checkout-antes-4.jpg'],
    personaImg:'checkout-persona.jpg',
    solucaoImgs:['checkout-solucao-desktop.jpg','checkout-solucao-mobile.jpg'],
    ey:'Conversão · Mobile · HealthTech',
    ttl:'Metade desistia<br>no meio do <em>checkout.</em>',
    meta:['Product Designer','10 semanas','Figma · Clarity'],
    hook:'"80% dos usuários chegavam até o checkout. Metade desistia no meio do processo. Cada abandono não era só um número, era uma família que não conseguiu contratar um plano de saúde acessível."',
    context:'<p>A persona central do Kivid é Adriana Santos, 56 anos, professora, classe C/D, casada, dois filhos. Quando ela entra numa tela de checkout, precisa de três coisas: <strong>clareza, segurança e velocidade</strong>. Qualquer dúvida vira abandono. E ela não é uma usuária ocasional: é a principal pagadora de plano de saúde familiar no Brasil.</p><p>O produto existente violava os três requisitos sistematicamente. Pedia informações excessivas logo no início, fragmentava o fluxo em múltiplas etapas sem indicador de progresso e escondia o valor total até o final. Para Adriana, que pode estar compando no celular durante um intervalo de aula, <strong>cada passo a mais é uma razão válida para fechar o app e tentar de novo amanhã</strong>. Amanhã muitas vezes não volta.</p><p>Os dados do Clarity confirmavam o comportamento antes de qualquer entrevista: scroll rápido até o final para ver o preço total, abandono imediato quando o campo de nome aparecia vazio pedindo digitação manual, cliques repetidos em elementos estáticos que pareciam interativos. O heatmap era o mapa exato da ansiedade do usuário.</p>',
    diags:[
      {icon:'📋',title:'Formulário longo no início',desc:'O sistema pedia dados que poderiam ser preenchidos automaticamente via CPF.'},
      {icon:'❓',title:'Valor total escondido',desc:'O preço final só aparecia na última etapa, gerando ansiedade e abandono.'},
      {icon:'🔀',title:'Múltiplas etapas sem progresso',desc:'O usuário não sabia quantas telas faltavam para concluir a compra.'},
      {icon:'🔍',title:'Heatmaps reveladores',desc:'Cliques repetidos em elementos não-interativos mostravam confusão sobre o fluxo.'}
    ],
    kpis:[
      {icon:'💳',label:'Taxa de conversão',val:'Checkout',desc:'Usuários que chegam ao checkout e completam a compra'},
      {icon:'🛒',label:'Abandono de carrinho',val:'% por etapa',desc:'Em qual passo os usuários desistem com mais frequência'},
      {icon:'⚡',label:'Tempo de conclusão',val:'Média por sessão',desc:'Minutos do início ao fim de uma compra concluída'}
    ],
    role:'Product Designer responsável pela análise de dados (Clarity), redesenho do fluxo, protótipo e acompanhamento de métricas.',
    insight:'<p>Os heatmaps do Clarity revelaram o ponto exato de abandono: o <strong>primeiro campo do formulário</strong>. Mais especificamente: o campo "Nome completo" em branco, pedindo digitação manual, quando o CPF já havia sido informado. A hipótese que surgiu foi direta — <em>se o sistema já sabe quem é o usuário pelo CPF, por que está pedindo que ele se apresente de novo?</em></p><p>A virada foi entender que <strong>cada campo a mais era uma chance de desistência</strong>. O redesign não foi sobre layout — foi sobre eliminar perguntas que o sistema já poderia responder. Preenchimento automático via CPF não é uma feature de UX, é uma declaração de que o produto respeita o tempo do usuário. Menos fricção, mais conversão, mais famílias com plano de saúde.</p>',
    objetivo:'Tornar a compra do plano Kivid tão simples que o usuário complete sem precisar pensar.',
    krs:[
      {txt:'Aumentar taxa de conversão do checkout',meta:'+15%'},
      {txt:'Reduzir abandono de carrinho',meta:'-20%'},
      {txt:'Diminuir tempo médio de conclusão da compra',meta:'-30%'}
    ],
    sol:'<p>Três princípios guiaram cada decisão de design:</p><p><strong>1. O preço primeiro.</strong> O resumo do pedido ficou sempre visível, dinâmico e no topo — o valor total aparece desde o primeiro momento, atualizando em tempo real. Adriana não rola mais a página tentando descobrir quanto vai pagar. Isso eliminou a maior fonte de ansiedade identificada nos heatmaps.</p><p><strong>2. O sistema preenche, o usuário confirma.</strong> Unifiquei todas as etapas em uma única página. Via CPF, nome, endereço e dados básicos são preenchidos automaticamente. O usuário passa de digitador para revisor. Redução drástica de esforço cognitivo e de erros de digitação.</p><p><strong>3. Confiança onde a hesitação acontece.</strong> Os indicadores de segurança (cadeado SSL, selos de pagamento) foram posicionados nas coordenadas exatas onde os heatmaps mostravam maior concentração de cliques sem ação. Não foram adicionados onde "pareciam certos", mas onde os dados mostravam que eram necessários.</p><p><strong>A decisão mais negociada:</strong> o time queria manter a criação de senha no fluxo de compra. Os dados mostravam que esse passo respondia por 18% dos abandonos. Defendi remover e enviar credenciais por email pós-compra — a compra deveria ser concluída antes de qualquer cadastro. A decisão foi aceita após apresentar a análise de funil por etapa. Sem esse argumento baseado em dado, a mudança provavelmente não teria passado.</p><p><strong>Lançamento controlado e mapa de métricas.</strong> Antes de subir para produção, mapeamos cada métrica com sua fonte e responsável: taxa de conversão e bounce rate via Google Analytics, abandono por etapa via Clarity, tickets via suporte, inadimplência via financeiro. O novo checkout foi lançado em um único produto primeiro — margens de ajuste antes de expandir para toda a base. Quando os primeiros fluxos de automação quebraram com o novo modelo de pagamento, tínhamos poucos dias para corrigir sem impacto amplo. O lançamento gradual não era cautela: era método.</p>',
    results:[['+15%','Aumento na taxa de conversão — KR1 atingido. Em um produto de saúde acessível, cada ponto percentual significa famílias que conseguiram contratar o plano','ti-trending-up','up'],['-20%','Redução no abandono de carrinho — KR2 atingido. Remoção da criação de senha e o preenchimento via CPF responderam pela maior parte do ganho','ti-shopping-cart','down'],['↓','Tempo médio de conclusão da compra reduziu — usuários passaram de digitadores para revisores do próprio dado','ti-clock','down'],['✓','"Muito mais simples e rápido" — feedback recorrente. Lançamento controlado em produto único permitiu corrigir falhas de automação antes da expansão para toda a base','ti-thumb-up','check']],
    en:{
      ey:'Conversion · Mobile · HealthTech',
      ttl:'Half of users quit<br>in the middle of <em>checkout.</em>',
      meta:['Product Designer','10 weeks','Figma · Clarity'],
      hook:'"80% of users reached checkout. Half quit halfway through. Every abandonment wasn\'t just a number, it was a family that couldn\'t afford a health plan."',
      context:'<p>Kivid\'s core persona is Adriana Santos, 56, teacher, lower-middle class, married, two kids. When she enters a checkout screen, she needs three things: <strong>clarity, security and speed</strong>. Any doubt becomes abandonment.</p><p>The existing product asked for excessive information upfront, was fragmented across multiple steps with no visible progress, and didn\'t show the total price until the end — exactly the opposite of what Adriana needed.</p>',
      role:'Product Designer responsible for data analysis (Clarity), flow redesign, prototype and metrics tracking.',
      insight:'<p>Clarity heatmaps revealed the exact drop-off point: the <strong>first form field</strong>. The turning point was understanding that each extra field was a chance to give up. Instead of asking for data, the system started <strong>filling in data</strong> automatically via CPF. Less friction, more conversion.</p>',
      objetivo:'Make buying a Kivid plan so simple that the user completes it without having to think.',
      krs:[
        {txt:'Increase checkout conversion rate',meta:'+15%'},
        {txt:'Reduce cart abandonment',meta:'-20%'},
        {txt:'Decrease average purchase completion time',meta:'-30%'}
      ],
      kpis:[
        {icon:'💳',label:'Conversion rate',val:'Checkout',desc:'Users who reach checkout and complete the purchase'},
        {icon:'🛒',label:'Cart abandonment',val:'% per step',desc:'Which step users abandon most frequently'},
        {icon:'⚡',label:'Completion time',val:'Average per session',desc:'Minutes from start to finish of a completed purchase'}
      ],
      sol:'<p>I unified all steps into <strong>a single page</strong>. Auto-fill via CPF: the user typed one field and name, address and basic data were filled automatically. We removed everything optional or unnecessary for completion.</p><p>The order summary stayed always visible, dynamic and transparent — the total price appears from the very first moment, updating in real time as the user selects options. No surprises at the end. No unanswered questions.</p><p>We added security indicators (lock, badges) at the exact positions where heatmaps showed the most hesitation. Small detail, measurable impact on trust.</p>',
      results:[['+15%','Conversion rate increase — KR1 achieved. In an accessible health product, every percentage point means families who got covered','ti-trending-up','up'],['-20%','Cart abandonment reduction — KR2 achieved. Removing the password creation step drove a significant part of the gain','ti-shopping-cart','down'],['↓','Average purchase completion time decreased — users became reviewers instead of typists','ti-clock','down'],['✓','"Much simpler and faster" — recurring feedback. 3 of 5 testers cited price transparency as the top differentiator','ti-thumb-up','check']]
    },
  },
  nps:{
    color:'#854F0B',bg:'#111',
    wireframes:'nps-wireframes.jpg',
    telas:['nps-tela-1.jpg','nps-tela-2.jpg','nps-tela-3.jpg','nps-tela-4.jpg','nps-tela-5.jpg','nps-tela-6.jpg','nps-tela-7.jpg'],
    ey:'NPS · Data · HealthTech',
    ttl:'O time decidia<br>sem ouvir <em>ninguém.</em>',
    meta:['Product Designer','2 semanas','Figma'],
    hook:'"O Kivid tinha uma rede ativa de atendimentos. Decisões sobre o produto eram tomadas com base em feeling, suposições e reclamações espontâneas no suporte. Não havia linha de base. Não havia como medir evolução. Não havia cultura de feedback."',
    context:'<p>Você não consegue melhorar o que não mede. E você não consegue medir o que não pergunta. A ausência de dados de satisfação estruturados criava um ciclo vicioso: sem evidência, o time priorizava pelo que gritava mais alto, geralmente reclamações isoladas do suporte, não padrões reais de insatisfação. <strong>Uma reclamação vocal não é necessariamente representativa. Um dado sistemático, sim.</strong></p><p>O diagnóstico foi além do "não temos NPS". O problema real era de timing e de modelo mental do time. Feedback era visto como algo que se coleta quando dá problema, não como infraestrutura contínua de produto. Criar a tela era 20% do trabalho. Os outros 80% eram convencer o time de que dado de satisfação é insumo para roadmap, não relatório para stakeholder.</p><p>O risco que mapeei ao propor o projeto: NPS sem plano de ação vira métrica de vaidade. Defendi desde o início que o canal só seria construído se houvesse comprometimento do time de produto em revisar os feedbacks semanalmente e gerar ao menos 3 ações por mês. O KR3 não era sobre o design — era sobre mudar como o time trabalhava.</p>',
    diags:[
      {icon:'🌑',title:'Zero linha de base',desc:'Nenhum dado histórico de satisfação para medir evolução ou comparar períodos.'},
      {icon:'📢',title:'Decisões por feeling',desc:'O time priorizava pelo que gritava mais alto, não por padrões reais de insatisfação.'},
      {icon:'⏰',title:'Timing errado',desc:'Feedback coletado tarde demais no ciclo perdia o contexto emocional do atendimento.'},
      {icon:'✍',title:'Fricção no preenchimento',desc:'Formulários longos reduziam drasticamente a taxa de resposta dos pacientes.'}
    ],
    kpis:[
      {icon:'📈',label:'Taxa de resposta NPS',val:'% dos atendimentos',desc:'Proporção de pacientes que respondem após o atendimento'},
      {icon:'💬',label:'Insights acionáveis',val:'Por mês',desc:'Feedbacks que geram mudanças concretas no produto ou no atendimento'},
      {icon:'📏',label:'Linha de base',val:'Score trimestral',desc:'Referência para medir evolução de satisfação ao longo do tempo'}
    ],
    role:'Product Designer responsável pela concepção do canal, benchmark, fluxo, microcopy e protótipo.',
    insight:'<p>O problema não era falta de tela, era <strong>falta de cultura de escuta</strong>. Mas cultura não se cria com um formulário. Ela se cria quando o processo de coletar é tão fácil que se torna automático, e quando o dado coletado é confiável o suficiente para embasar decisão real.</p><p>A decisão mais debatida foi: <strong>emoji ou escala numérica?</strong> O argumento contra emoji era "falta de precisão". Minha resposta: precisão de dado inútil não tem valor. Uma escala de 0–10 num momento pós-consulta médica, quando o paciente pode estar aliviado, ansioso ou com dor, introduz viés cognitivo enorme. O emoji remove a camada de interpretação numérica e captura o estado emocional direto, que era exatamente o que queríamos medir. A taxa de resposta seria o validador, não a preferência estética.</p><p>Outra decisão crítica: o campo qualitativo ser <strong>opcional e posterior</strong> à avaliação numérica. A tentação era torná-lo obrigatório para "enriquecer o dado". Os dados de abandono em formulários similares mostravam que campo obrigatório de texto reduzia taxa de resposta em 40–60%. Preferi 30% de respostas completas a 10% de respostas completas. Dado imperfeito que existe vale mais que dado perfeito que não chega.</p>',
    objetivo:'Criar uma cultura de feedback contínuo que alimente decisões de produto com dados reais dos pacientes.',
    krs:[
      {txt:'Coletar NPS de pelo menos 30% dos atendimentos mensais',meta:'30%'},
      {txt:'Gerar ao menos 3 insights acionáveis por mês',meta:'3/mês'},
      {txt:'Estabelecer linha de base de satisfação trimestral',meta:'Q1 2024'}
    ],
    sol:'<p>O fluxo foi desenhado para ser <strong>invisível na fricção, mas significativo no resultado</strong>. Cada decisão teve uma lógica de negócio por trás:</p><p><strong>Timing pós-atendimento.</strong> A notificação dispara automaticamente entre 30 minutos e 2 horas após o atendimento, quando a memória emocional ainda está ativa mas o paciente já saiu do contexto de urgência. Testei janelas de 30min, 2h e 24h com usuários internos. A janela de 2h teve a maior taxa de abertura e as respostas mais detalhadas no campo qualitativo.</p><p><strong>Três toques no máximo.</strong> Regra inegociável de design: o fluxo completo exige no máximo 3 interações. Emoji de avaliação (1 toque), confirmação (1 toque), campo qualitativo opcional (texto). Quem não quer escrever sai em 2 toques com o dado numérico já capturado.</p><p><strong>Cores e tom deliberadamente suaves.</strong> Contexto de saúde exige cuidado. Cores saturadas e chamadas urgentes criam ansiedade em quem pode ter acabado de receber um diagnóstico. O design usa tons neutros, microcopy acolhedor e zero pressão visual. Não é só estética: é adequação ao contexto emocional do usuário.</p><p>O impacto mais relevante foi comportamental no time: o NPS virou pauta de reunião semanal. Feedbacks qualitativos passaram a embasar decisões sobre treinamento dos credenciados. <strong>O design que não muda o processo de trabalho do time não mudou nada de verdade.</strong></p>',
    results:[['0→1','Canal de NPS criado do zero — pela primeira vez o time tinha dado estruturado de satisfação para embasar roadmap','ti-chart-bar','check'],['✓','NPS virou pauta de reunião semanal. Mudança de comportamento do time foi o KR mais difícil e o mais valioso','ti-calendar','check'],['↑','Taxa de resposta acima da meta de 30% — validação de que emoji reduzia barreira de resposta vs escala numérica','ti-trending-up','up'],['✓','Feedbacks qualitativos geraram mudanças concretas no treinamento de credenciados. Design que muda processo vale mais que design que muda tela','ti-message','check']],
    en:{
      ey:'NPS · Data · HealthTech',
      ttl:'The team made decisions<br>without listening to <em>anyone.</em>',
      meta:['Product Designer','2 weeks','Figma'],
      hook:'"Kivid had an active network of consultations. Product decisions were made based on gut feeling, assumptions and spontaneous complaints in support. No baseline. No way to measure evolution. No feedback culture."',
      context:'<p>You can\'t improve what you don\'t measure. And you can\'t measure what you don\'t ask. The absence of structured satisfaction data created a vicious cycle: without evidence, the team prioritized by what screamed loudest — usually isolated complaints, not real patterns.</p><p>The goal wasn\'t just to create an evaluation screen. It was to <strong>create a culture of continuous listening</strong> that fed product decisions with real evidence from patients.</p>',
      role:'Product Designer responsible for channel conception, benchmarking, flow, microcopy and prototype.',
      insight:'<p>The problem wasn\'t a missing screen, it was a <strong>missing listening culture</strong>. The insight was treating collection as an invisible part of the journey: <strong>fast, light, at the right emotional moment</strong>, right after the consultation. Emojis instead of cold scales. Qualitative as a bonus, never an obligation.</p>',
      objetivo:'Create a continuous feedback culture that feeds product decisions with real data from patients.',
      krs:[
        {txt:'Collect NPS from at least 30% of monthly consultations',meta:'30%'},
        {txt:'Generate at least 3 actionable insights per month',meta:'3/month'},
        {txt:'Establish quarterly satisfaction baseline',meta:'Q1 2024'}
      ],
      kpis:[
        {icon:'📈',label:'NPS response rate',val:'% of consultations',desc:'Proportion of patients who respond after the consultation'},
        {icon:'💬',label:'Actionable insights',val:'Per month',desc:'Feedback that generates concrete changes in the product or service'},
        {icon:'📏',label:'Baseline',val:'Quarterly score',desc:'Reference to measure satisfaction evolution over time'}
      ],
      sol:'<p>The flow needed to be <strong>invisible in friction but significant in result</strong>. Emojis to ease emotional expression without requiring writing, soft colors that don\'t create anxiety, very short texts that respect the post-medical-consultation context.</p><p>Every element was designed to reduce the cognitive load of someone who just went through a medical appointment — a moment when the person might be anxious, tired or relieved. The open qualitative field appears only after the numerical rating, as an invitation, never an obligation.</p><p>The most relevant impact was behavioral: the product team gained data to discuss priorities. NPS became a weekly meeting topic. Qualitative feedback started informing decisions about provider training.</p>',
      results:[['0→1','NPS channel built from scratch — first time the team had real data','ti-chart-bar','check'],['✓','NPS became a weekly meeting topic after launch','ti-calendar','check'],['↑','Response rate above the 30% target in the first months','ti-trending-up','up'],['✓','Qualitative feedback started informing product decisions','ti-message','check']]
    }
  }
};


function openCase(id,title){
  const c=CASES[id];
  if(!c){console.error('Case not found:',id);return;}
  // Merge EN translations if active
  const d = (currentLang === 'en' && c.en) ? Object.assign({}, c, c.en) : c;
  document.getElementById('case-ttl-nav').textContent=title;

  const slot=document.getElementById('case-slot');
  slot.innerHTML='';

  const ch=document.createElement('div');
  ch.className='ch';
  ch.style.setProperty('--case-color',c.color);

  // Header
  const ct=document.createElement('div');
  ct.className='ch-ct';
  ct.innerHTML='<div class="ch-ey">'+d.ey+'</div>'
    +'<div class="ch-title">'+d.ttl+'</div>'
    +'<div class="ch-meta-row">'+d.meta.map(function(m){return'<span>'+m+'</span>';}).join('')+'</div>';
  ch.appendChild(ct);

  // Hero image
  const imgArea=document.createElement('div');
  imgArea.className='ch-img-area';
  imgArea.style.background='#111';
  const heroImg=document.createElement('img');
  heroImg.src='img/'+id+'-case-hero.jpg';
  heroImg.alt=title;
  heroImg.style.cssText='width:100%;height:100%;object-fit:cover;display:block;cursor:zoom-in;';
  heroImg.addEventListener('click', function(){ lbOpen(heroImg.src); });
  heroImg.onerror=function(){ this.style.display='none'; imgArea.innerHTML='<div class="ch-img-ph">'+id+'-case-hero.jpg</div>'; };
  imgArea.appendChild(heroImg);
  ch.appendChild(imgArea);

  // Body
  const bd=document.createElement('div');
  bd.className='ch-bd';

  bd.innerHTML=
    '<div class="ch-hook">'+d.hook+'</div>'
    +'<div class="ch-role"><span class="ch-role-lbl" data-pt="Meu papel" data-en="My role">'+(currentLang==='en'?'My role':'Meu papel')+'</span><span class="ch-role-txt">'+d.role+'</span></div>'

    /* O Problema */
    +'<div class="ch-highlight"><div class="ch-highlight-label">'+t("The Problem","O Problema")+'</div>'+d.context+'</div>'

    /* Persona (checkout) */
    +(c.personaImg ? '<div class="ch-func-img"><img src="img/'+c.personaImg+'" alt="Persona" style="width:100%;display:block;cursor:zoom-in;" onclick="lbOpen(this.src)"></div>' : '')

    /* Grid 2x2 telas antigas (checkout) */
    +(c.antes ? '<h3>'+t("Old screens","Telas antigas")+'</h3><div class="ch-comp-grid">'+c.antes.map(function(img){
      return '<div class="ch-comp-item"><img src="img/'+img+'" alt="antes" style="width:100%;height:100%;object-fit:contain;display:block;cursor:zoom-in;" onclick="lbOpen(this.src)"></div>';
    }).join('')+'</div>' : '')

    /* Wellhub: carrossel de problema */
    +(c.carousel ? (function(){
      return '<div class="ch-carousel" id="car-'+id+'">'
        +'<div class="ch-carousel-track">'+c.carousel.map(function(img,i){
          return '<div class="ch-carousel-slide"><img src="img/'+img+'" alt="'+i+'" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;"></div>';
        }).join('')+'</div>'
        +'<button class="ch-carousel-btn prev" onclick="carouselMove(this,-1)">&#8249;</button>'
        +'<button class="ch-carousel-btn next" onclick="carouselMove(this,1)">&#8250;</button>'
        +'<div class="ch-carousel-dots">'+c.carousel.map(function(_,i){
          return '<div class="ch-carousel-dot'+(i===0?' active':'')+'" data-idx="'+i+'" onclick="carouselDot(this)"></div>';
        }).join('')+'</div>'
        +'<div class="ch-carousel-count">1 / '+c.carousel.length+'</div>'
        +'</div>';
    })() : '')

    /* Credenciados: funcionalidades wide */
    +(c.funcImg ? '<div class="ch-func-img"><img src="img/'+c.funcImg+'" alt="func" style="width:100%;display:block;cursor:zoom-in;" onclick="lbOpen(this.src)"></div>' : '')

    /* KPIs & OKRs */
    +'<div class="ch-highlight"><div class="ch-highlight-label">KPIs &amp; OKRs</div>'
      +'<div class="ch-okr-block">'
        +'<div class="ch-okr-head"><div class="ch-okr-head-icon">&#9678;</div><div><span class="ch-okr-head-label">'+t("Objective","Objetivo")+'</span><div class="ch-okr-head-obj">'+d.objetivo+'</div></div></div>'
        +'<div class="ch-okr-trunk"></div>'
        +'<div class="ch-kr-branch"><div class="ch-kr-branch-l"></div><div class="ch-kr-branch-r"></div></div>'
        +'<div class="ch-kr-dots"><div class="ch-kr-dot"></div><div class="ch-kr-dot"></div><div class="ch-kr-dot"></div></div>'
        +'<div class="ch-kr-list">'+d.krs.map(function(kr,i){return '<div class="ch-kr"><div class="ch-kr-num">KR'+(i+1)+'</div><div class="ch-kr-txt">'+kr.txt+'</div><div class="ch-kr-badge">'+kr.meta+'</div></div>';}).join('')+'</div>'
        +'<div class="ch-kpi-drops"><div class="ch-kpi-drop"></div><div class="ch-kpi-drop"></div><div class="ch-kpi-drop"></div></div>'
        +'<div class="ch-kpi-grid">'+d.kpis.map(function(k){return '<div class="ch-kpi"><div class="ch-kpi-label">'+k.label+'</div><div class="ch-kpi-val">'+k.val+'</div><div class="ch-kpi-desc">'+k.desc+'</div></div>';}).join('')+'</div>'
      +'</div>'
    +'</div>'

    /* Processo */
    +'<div class="ch-func-img"><img src="img/'+id+'-processo.jpg" alt="proc" style="width:100%;display:block;cursor:zoom-in;" onclick="lbOpen(this.src)"></div>'

    /* Como pensei a solução */
    +'<div class="ch-highlight"><div class="ch-highlight-label">'+t("How I approached the solution","Como pensei a solução")+'</div>'+d.insight+d.sol
    +(c.wireframes ? '<div class="ch-func-img"><img src="img/'+c.wireframes+'" alt="wireframes" style="width:100%;display:block;cursor:zoom-in;" onclick="lbOpen(this.src)"></div>' : '')
    +'</div>'

    /* Solução desktop + mobile em coluna (checkout) */
    +(c.solucaoImgs
      ? '<h3>'+t("New screens","Telas novas")+'</h3>'+c.solucaoImgs.map(function(img){
          return '<div class="ch-func-img"><img src="img/'+img+'" alt="sol" style="width:100%;display:block;cursor:zoom-in;" onclick="lbOpen(this.src)"></div>';
        }).join('')
      : ''
    )

    /* Credenciados: carrossel telas */
    +(c.telas ? (function(){
      return '<h3>'+t("Screens","Telas")+'</h3>'
        +'<div class="ch-carousel telas" id="car-telas-'+id+'">'
          +'<div class="ch-carousel-track">'+c.telas.map(function(img,i){
            return '<div class="ch-carousel-slide"><img src="img/'+img+'" alt="'+i+'" style="position:absolute;inset:0;width:100%;height:100%;object-fit:contain;"></div>';
          }).join('')+'</div>'
          +'<button class="ch-carousel-btn prev" onclick="carouselMove(this,-1)">&#8249;</button>'
          +'<button class="ch-carousel-btn next" onclick="carouselMove(this,1)">&#8250;</button>'
          +'<div class="ch-carousel-dots">'+c.telas.map(function(_,i){
            return '<div class="ch-carousel-dot'+(i===0?' active':'')+'" data-idx="'+i+'" onclick="carouselDot(this)"></div>';
          }).join('')+'</div>'
          +'<div class="ch-carousel-count">1 / '+c.telas.length+'</div>'
        +'</div>';
    })() : '')

    /* Wellhub: comparativo 2x2 */
    +(c.comparativo
      ? '<div class="ch-compare-label">'+t("Before <span>&#215;</span> After","Antes <span>&#215;</span> Depois")+'</div>'
        +'<div class="ch-comp-grid">'+c.comparativo.map(function(img){
          return '<div class="ch-comp-item"><img src="img/'+img+'" alt="comp" style="width:100%;height:100%;object-fit:cover;display:block;cursor:zoom-in;" onclick="lbOpen(this.src)"></div>';
        }).join('')+'</div>'
      : ''
    )

    /* Resultados */
    +'<h3>'+t("Results","Resultados")+'</h3>'
    +'<div class="res-grid">'+d.results.map(function(r){
      var badge = r[2] ? '<div class="res-badge '+r[3]+'"><i class="ti '+r[2]+'" aria-hidden="true"></i> '+(r[3]==='up'?'↑ atingido':r[3]==='down'?'↓ reduzido':'✓ validado')+'</div>' : '';
      return '<div class="res-item">'+badge+'<div class="res-n">'+r[0]+'</div><div class="res-l">'+r[1]+'</div></div>';
    }).join('')+'</div>'
  ch.appendChild(bd);
  slot.appendChild(ch);

  document.getElementById('page-home').classList.remove('active');
  document.getElementById('page-case').classList.add('active');
  window.scrollTo({top:0,behavior:'instant'});
  setTimeout(animateCaseEntrance,50);
}


function closeCase(){
  document.getElementById('page-case').classList.remove('active');
  document.getElementById('page-home').classList.add('active');
  window.scrollTo({top:0,behavior:'instant'});
}

/* ── FEEDBACK MODAL ── */
function openFeedback(){
  document.getElementById('fb-overlay').classList.add('open');
  document.body.style.overflow='hidden';
  setTimeout(()=>document.getElementById('fb-text').focus(),300);
}
function closeFeedback(){
  document.getElementById('fb-overlay').classList.remove('open');
  document.body.style.overflow='';
}
function closeFeedbackOutside(e){
  if(e.target===document.getElementById('fb-overlay'))closeFeedback();
}
function sendFeedback(){
  const txt=document.getElementById('fb-text').value.trim();
  if(!txt)return;
  /* Envia para mailto, substitua pela URL do Google Forms quando tiver */
  const subject=encodeURIComponent('Feedback Portfólio Lucas de Castro');
  const body=encodeURIComponent(txt);
  window.open('mailto:llucastourinho@gmail.com?subject='+subject+'&body='+body);
  document.getElementById('fb-text').style.display='none';
  document.querySelector('.fb-foot').style.display='none';
  document.getElementById('fb-thanks').style.display='block';
  setTimeout(closeFeedback,2200);
}
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeFeedback()});

function animateCaseEntrance(){
  const els=document.querySelectorAll('.ch-ct > *,.ch-hook,.ch-bd h3,.ch-bd p');
  els.forEach((el,i)=>{
    el.style.opacity='0';
    el.style.transform='translateY(20px)';
    el.style.transition=`opacity .6s var(--ease) ${i*.06}s, transform .6s var(--ease) ${i*.06}s`;
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      el.style.opacity='1';el.style.transform='translateY(0)';
    }));
  });
}

/* ── FEEDBACK MODAL ── */
function openFeedback(){
  document.getElementById('fb-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
  setTimeout(() => document.getElementById('fb-text') && document.getElementById('fb-text').focus(), 300);
}
function closeFeedback(){
  document.getElementById('fb-overlay').classList.remove('open');
  document.body.style.overflow = '';
}
function closeFeedbackOutside(e){
  if(e.target === document.getElementById('fb-overlay')) closeFeedback();
}
function sendFeedback(){
  const txt = document.getElementById('fb-text').value.trim();
  if(!txt) return;
  const subject = encodeURIComponent('Feedback Portfolio Lucas de Castro');
  const body = encodeURIComponent(txt);
  window.open('mailto:llucastourinho@gmail.com?subject=' + subject + '&body=' + body);
  document.getElementById('fb-text').style.display = 'none';
  document.querySelector('.fb-foot').style.display = 'none';
  document.getElementById('fb-thanks').style.display = 'block';
  setTimeout(closeFeedback, 2200);
}
document.addEventListener('keydown', e => { if(e.key === 'Escape') closeFeedback(); });

/* ── MOBILE CARDS — long press shows overlay ── */
(function(){
  var LONG = 320; // ms to trigger overlay
  var cards = document.querySelectorAll('.pc');

  cards.forEach(function(card){
    var timer = null;
    var overlay = card.querySelector('.pc-overlay');
    var didLong = false;

    function showOverlay(){
      didLong = true;
      if(overlay) overlay.classList.add('touch-active');
    }

    function hideOverlay(){
      if(overlay) overlay.classList.remove('touch-active');
    }

    card.addEventListener('touchstart', function(e){
      didLong = false;
      timer = setTimeout(showOverlay, LONG);
    }, {passive:true});

    card.addEventListener('touchend', function(e){
      clearTimeout(timer);
      if(didLong){
        // long press ended — hide overlay after 1.8s
        setTimeout(hideOverlay, 1800);
        e.preventDefault(); // prevent click firing
      }
      // short tap — let onclick fire normally
    });

    card.addEventListener('touchmove', function(){
      clearTimeout(timer);
      didLong = false;
      hideOverlay();
    }, {passive:true});
  });
})();
