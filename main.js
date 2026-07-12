
/* ── LANGUAGE TOGGLE ── */
var currentLang = 'pt';
var _navCount = 0;

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
var _lbGallery = null; // {images:[...], index:0}
function lbOpen(src){
  var img = document.getElementById('lb-img');
  var overlay = document.getElementById('lb-overlay');
  if(!img || !overlay) return;
  _lbGallery = null;
  img.src = src;
  overlay.classList.add('open');
  overlay.classList.remove('lb-has-nav');
  document.body.style.overflow = 'hidden';
}
function lbOpenGallery(images, startIndex){
  var img = document.getElementById('lb-img');
  var overlay = document.getElementById('lb-overlay');
  if(!img || !overlay || !images || !images.length) return;
  _lbGallery = { images: images, index: startIndex || 0 };
  img.src = images[_lbGallery.index];
  overlay.classList.add('open');
  overlay.classList.toggle('lb-has-nav', images.length > 1);
  document.body.style.overflow = 'hidden';
}
function lbNav(dir){
  if(!_lbGallery) return;
  var g = _lbGallery;
  g.index = (g.index + dir + g.images.length) % g.images.length;
  var img = document.getElementById('lb-img');
  if(img) img.src = g.images[g.index];
}
function lbClose(){
  var overlay = document.getElementById('lb-overlay');
  if(overlay) overlay.classList.remove('open');
  document.body.style.overflow = '';
  _lbGallery = null;
}
document.addEventListener('keydown', function(e){
  if(e.key === 'Escape') lbClose();
  if(e.key === 'ArrowLeft') lbNav(-1);
  if(e.key === 'ArrowRight') lbNav(1);
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

function goToHome(push){
  if(push === undefined) push = true;
  document.getElementById('page-home').classList.add('active');
  document.getElementById('page-case').classList.remove('active');
  document.getElementById('page-sobre').classList.remove('active');
  window.scrollTo({top:0, behavior:'instant'});
  if(push){
    history.pushState({ page: 'home' }, '', window.location.pathname + window.location.search);
    _navCount++;
  }
}

function goToSobre(push){
  if(push === undefined) push = true;
  document.getElementById('page-home').classList.remove('active');
  document.getElementById('page-case').classList.remove('active');
  document.getElementById('page-sobre').classList.add('active');
  window.scrollTo({top:0, behavior:'instant'});
  if(push){
    history.pushState({ page: 'sobre' }, '', '#sobre');
    _navCount++;
  }
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

              /* 4. Show sub line + tagline */
              if(line3El) line3El.textContent = TEXT3;
              if(subEl) subEl.classList.add('visible');
              var tagline = document.querySelector('.hero-tagline');
              if(tagline) setTimeout(function(){ tagline.classList.add('visible'); }, 400);
            });
          }, 300);
        });
      }, 200);
    });
  }, 800);
})();

/* ── REVEAL ON SCROLL ── */
const allReveal = document.querySelectorAll('.reveal');
if('IntersectionObserver' in window){
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if(e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold: .1, rootMargin: '0px 0px -100px 0px' });
  allReveal.forEach(r => obs.observe(r));
} else {
  /* fallback só pra navegadores sem suporte a IntersectionObserver */
  allReveal.forEach(el => el.classList.add('visible'));
}

const CASES={
  wellhub:{
    color:'#0F6E56',bg:'#111',
    autoral:true,
    model:['B2C'],
    prototipo:{src:'wellhub-prototipo.mp4', ratio:'450/900'},
    carousel:['wellhub-problema-1.jpg','wellhub-problema-2.jpg','wellhub-problema-3.jpg','wellhub-problema-4.jpg','wellhub-problema-5.jpg','wellhub-problema-6.jpg','wellhub-problema-7.jpg','wellhub-problema-8.jpg','wellhub-problema-9.jpg','wellhub-problema-10.jpg'],
    comparativo:['wellhub-comp-1.jpg','wellhub-comp-2.jpg','wellhub-comp-3.jpg','wellhub-comp-4.jpg'],
    ey:'UX/UI · Gamification · Wellness',
    ttl:'340 treinos que passaram<br>a ser <em>celebrados.</em>',
    meta:['Product Designer','2 semanas','Figma · Adobe CC'],
    hook:'"Sou usuário ativo do Wellhub há anos. Mais de 340 check-ins. Cada um representou uma decisão consciente de sair do sofá, ir à academia e investir na saúde. E o app? Tratava todos exatamente igual. Sem diferença entre o primeiro treino e o de número 300."',
    context:'<p>Para entender o problema real, conduzi testes de usabilidade com usuários ativos do Wellhub — observando o fluxo de check-in ao vivo, sem interferência. O padrão foi consistente: nenhum usuário demonstrou resposta emocional ao completar o check-in. A tela de confirmação era processada como uma etapa burocrática, não como um momento de conquista.</p><p>Um check-in que não reconhece o esforço não é só uma falha de UX. É uma oportunidade de retenção desperdiçada a cada treino. Sem feedback emocional, o app não cria memória afetiva. Sem memória afetiva, o usuário cancela na primeira chance. Cada check-in neutro era um argumento silencioso para o churn.</p>',
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
    insight:'<p>Todo mundo via o check-in como um <strong>botão</strong>. Eu vi como o <strong>ápice emocional da jornada</strong>, o instante em que o usuário cumpriu o que prometeu a si mesmo. Essa mudança de enquadramento mudou tudo: não era sobre confirmar uma presença, era sobre reconhecer um esforço.</p>',
    objetivo:'Transformar o check-in num ritual de conquista que reforce o hábito.',
    krs:[
      {txt:'Aumentar o tempo de permanência na tela pós check-in',meta:'+30%'},
      {txt:'Reduzir taxa de abandono no fluxo de check-in',meta:'-20%'},
      {txt:'Melhorar percepção de personalização no NPS',meta:'+15pts'}
    ],
    sol:'<div class="ch-sol-cards"><div class="ch-sol-card"><div class="ch-sol-card-num">01</div><div class="ch-sol-card-title">Reframing estratégico</div><div class="ch-sol-card-desc">De botão para ritual. De função para celebração. De ação neutra para microvitória reconhecida.</div></div><div class="ch-sol-card"><div class="ch-sol-card-num">02</div><div class="ch-sol-card-title">Benchmark revelou o padrão</div><div class="ch-sol-card-desc">Duolingo, Apple Fitness, TotalPass e Strava celebram o momento presente e mostram onde o usuário chegou. Gamificação leve reforça o comportamento sem virar jogo.</div></div><div class="ch-sol-card"><div class="ch-sol-card-num">03</div><div class="ch-sol-card-title">Estados por marco</div><div class="ch-sol-card-desc">Primeiro check-in, marcos de 10/50/100, sequências semanais. Cada estado com feedback visual e textual próprio. Cada treino, um significado único.</div></div></div>',
    results:[['534','Check-ins reais validaram o problema antes do primeiro wireframe','ti-run','check'],['100%','Feedback positivo em todas as sessões de teste com usuários reais','ti-users','up'],['↑','Engajamento pós check-in aumentou nos testes de usabilidade','ti-trending-up','up'],['✓','Senso de conquista validado como diferencial em todas as entrevistas','ti-star','check']],
    medicao:{texto:'Sessões de teste moderadas com 5 usuários reais usando protótipo no Figma. Critério de aprovação: conclusão das tarefas principais sem bloqueio crítico.',tools:['Figma Prototype','Teste de Usabilidade']},
    en:{
      ey:'UX/UI · Gamification · Wellness',
      ttl:'340 workouts that started<br><em>being celebrated.</em>',
      meta:['Product Designer','2 weeks','Figma · Adobe CC'],
      hook:'"I\'ve been an active Wellhub user for years. Over 340 check-ins. Each one was a conscious decision to get off the couch, go to the gym, and invest in my health. And the app? It treated every single one exactly the same. No difference between the first workout and number 300."',
      context:'<p>A check-in that doesn\'t acknowledge effort isn\'t just a UX failure. It\'s a retention opportunity wasted with every workout.</p><p>Without emotional feedback, the app creates no affective memory. Without affective memory, users cancel at the first chance. Every neutral check-in was a silent argument for churn.</p>',
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
      sol:'<div class="ch-sol-cards"><div class="ch-sol-card"><div class="ch-sol-card-num">01</div><div class="ch-sol-card-title">Strategic reframing</div><div class="ch-sol-card-desc">From button to ritual. From function to celebration. From neutral action to recognized micro-victory.</div></div><div class="ch-sol-card"><div class="ch-sol-card-num">02</div><div class="ch-sol-card-title">Benchmark revealed the pattern</div><div class="ch-sol-card-desc">Duolingo, Apple Fitness, TotalPass and Strava all celebrate the present moment and show where users have arrived. Light gamification reinforces behavior without becoming a game.</div></div><div class="ch-sol-card"><div class="ch-sol-card-num">03</div><div class="ch-sol-card-title">States by milestone</div><div class="ch-sol-card-desc">First check-in, milestones at 10/50/100, weekly streaks. Each state with its own visual and text feedback. Every workout with unique meaning.</div></div></div>',
      results:[['534','Real check-ins validated the problem before the first wireframe','ti-run','check'],['100%','Positive feedback in all testing sessions with real users','ti-users','up'],['↑','Post check-in engagement increased in usability tests','ti-trending-up','up'],['✓','Sense of achievement validated as key differentiator in all interviews','ti-star','check']]
    },
  },
  credenciados:{
    color:'#185FA5',bg:'#111',
    model:['B2C'],
    cfCardW:160,
    prototipo:{src:'credenciados-prototipo.mp4', ratio:'608/1080'},
    telas:['credenciados-tela-1.jpg','credenciados-tela-2.jpg','credenciados-tela-3.jpg','credenciados-tela-4.jpg','credenciados-tela-5.jpg','credenciados-tela-6.jpg'],
    funcImg:'credenciados-func.jpg',
    solucaoImg:'credenciados-solucao.jpg',
    ey:'UX Research · HealthTech · Kivid',
    ttl:'O profissional certo,<br>encontrado dentro do <em>app.</em>',
    meta:['Product Designer','3 semanas','Figma'],
    hook:'"Imagine que você está com dor, precisa marcar uma consulta e abre o app do seu plano de saúde. A tela mostra o nome do médico e um número de telefone. Só isso. Sem endereço completo. Sem horários. Sem convênios. Nada que te ajudasse a decidir."',
    context:'<p>O Kivid tinha os dados. O que não tinha era uma experiência em volta deles.</p><p>Usuários que saíam do app para o Google não voltavam com o agendamento feito dentro do app. O custo era triplo: suporte sobrecarregado, agendamentos perdidos e dados de comportamento que nunca chegavam ao time de produto.</p>',
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
    insight:'<p>A lista de credenciados existia. Os dados existiam. Mas estavam <strong>espalhados e sem hierarquia</strong>. O insight não foi criar informação nova, foi perceber que o problema era de <strong>experiência, não de dados</strong>. Bastava montar uma jornada de decisão em volta do que já existia.</p>',
    objetivo:'Tornar a busca de profissionais confiável, completa e rápida o suficiente para eliminar a necessidade de sair do app.',
    krs:[
      {txt:'Reduzir taxa de abandono da tela de credenciados',meta:'-30%'},
      {txt:'Aumentar agendamentos iniciados dentro do app',meta:'+25%'},
      {txt:'Reduzir tickets de suporte sobre credenciados',meta:'-40%'}
    ],
    sol:'<div class="ch-sol-cards"><div class="ch-sol-card"><div class="ch-sol-card-num">01</div><div class="ch-sol-card-title">A informação existia, a experiência não</div><div class="ch-sol-card-desc">A lista de credenciados estava lá. O insight foi montar uma jornada de decisão em volta do que já existia: nome, especialidade, avaliação, mapa, horários, convênios. Tudo em uma tela.</div></div><div class="ch-sol-card"><div class="ch-sol-card-num">02</div><div class="ch-sol-card-title">Hierarquia de decisão</div><div class="ch-sol-card-desc">O usuário de saúde decide em segundos. A hierarquia visual responde três perguntas em ordem: este médico aceita meu convênio? Fica perto? Tem horário hoje?</div></div><div class="ch-sol-card"><div class="ch-sol-card-num">03</div><div class="ch-sol-card-title">O detalhe de maior impacto</div><div class="ch-sol-card-desc">O botão "Ligar" precisava estar visível sem scroll. Descoberto nos testes de usabilidade, esse ajuste teve mais impacto na taxa de ação do que qualquer outra mudança de layout.</div></div></div>',
    results:[['0→1','Usuários localizaram profissionais sem sair do app pela primeira vez','ti-map-pin','check'],['↓','Tickets de suporte reduziram após o lançamento','ti-headset','down'],['↑','Agendamentos via app aumentaram no primeiro mês','ti-calendar','up'],['4/5','"Finalmente tudo no lugar certo" — feedback espontâneo nos testes','ti-message','check']],
    medicao:{texto:'O diagnóstico começou com o time de suporte — tickets recorrentes sobre "como encontrar um profissional" indicavam que o app não estava cumprindo sua função principal. Após o redesign, o acompanhamento foi feito via Google Analytics 4, comparando taxa de saída e eventos de agendamento concluído antes e depois do lançamento.',tools:['Suporte — análise qualitativa de tickets','Google Analytics 4']},
    en:{
      ey:'UX Research · HealthTech · Kivid',
      ttl:'The right professional,<br>found inside the <em>app.</em>',
      meta:['Product Designer','3 weeks','Figma'],
      hook:'"Imagine you\'re in pain, need to schedule an appointment, and open your health plan app. The screen shows the doctor\'s name and a phone number. That\'s it. No full address. No hours. No accepted insurance. Nothing to help you decide."',
      context:'<p>Kivid had the data. What it didn\'t have was an experience built around it.</p><p>Users who left the app for Google didn\'t come back with appointments made inside the app. The cost was threefold: support overload, lost appointments, and behavioral data that never reached the product team.</p>',
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
      sol:'<div class="ch-sol-cards"><div class="ch-sol-card"><div class="ch-sol-card-num">01</div><div class="ch-sol-card-title">The information existed, the experience didn\'t</div><div class="ch-sol-card-desc">The provider list was there. The insight was building a decision journey around what already existed: name, specialty, rating, map, hours, insurance. All in one screen.</div></div><div class="ch-sol-card"><div class="ch-sol-card-num">02</div><div class="ch-sol-card-title">Decision hierarchy</div><div class="ch-sol-card-desc">Healthcare users decide in seconds. The visual hierarchy answers three questions in order: does this doctor accept my insurance? Is it nearby? Is there availability today?</div></div><div class="ch-sol-card"><div class="ch-sol-card-num">03</div><div class="ch-sol-card-title">The highest-impact detail</div><div class="ch-sol-card-desc">The "Call" button needed to be visible without scrolling. Found in usability testing, this adjustment had more impact on action rate than any other layout change.</div></div></div>',
      results:[['0→1','Users found providers without leaving the app for the first time','ti-map-pin','check'],['↓','Support tickets decreased after launch','ti-headset','down'],['↑','In-app appointments increased in the first month','ti-calendar','up'],['4/5','"Finally everything in the right place" — spontaneous feedback in tests','ti-message','check']]
    },
  },
  checkout:{
    color:'#993556',bg:'#111',
    model:['B2C'],
    prototipo:[
      {src:'checkout-prototipo-desktop.mp4', ratio:'2880/1800', label:'Desktop'},
      {src:'checkout-prototipo-mobile.mp4', ratio:'900/1800', label:'Mobile'}
    ],
    antes:['checkout-antes-1.jpg','checkout-antes-2.jpg','checkout-antes-3.jpg','checkout-antes-4.jpg'],
    personaImg:'checkout-persona.jpg',
    solucaoImgs:['checkout-solucao-desktop.jpg','checkout-solucao-mobile.jpg'],
    ey:'Conversão · Mobile · HealthTech',
    ttl:'Mais pessoas chegando<br>até o fim da <em>compra.</em>',
    meta:['Product Designer','10 semanas','Figma · Clarity'],
    hook:'"80% dos usuários chegavam até o checkout. Metade desistia no meio do processo. Cada abandono não era só um número, era uma família que não conseguiu contratar um plano de saúde acessível."',
    context:'<p>Cada abandono no checkout era mais do que receita perdida.</p><p>Era o custo de aquisição pago sem retorno. Era o suporte sobrecarregado com dúvidas que a tela deveria responder. Era Adriana saindo sem o plano de saúde que precisava, e contando para alguém que o app era complicado.</p><p>O produto fragmentado em múltiplas etapas, com valor total escondido e formulário longo, fazia exatamente o oposto do que a persona central precisava.</p>',
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
    insight:'<p>Os heatmaps do Clarity revelaram o ponto exato de abandono: o <strong>primeiro campo do formulário</strong>. A virada foi entender que cada campo a mais era uma chance de desistência. Em vez de pedir dados, o sistema passou a <strong>preencher dados</strong>, via CPF, automaticamente. Menos fricção, mais conversão.</p>',
    objetivo:'Tornar a compra do plano Kivid tão simples que o usuário complete sem precisar pensar.',
    krs:[
      {txt:'Aumentar taxa de conversão do checkout',meta:'+15%'},
      {txt:'Reduzir abandono de carrinho',meta:'-20%'},
      {txt:'Diminuir tempo médio de conclusão da compra',meta:'-30%'}
    ],
    sol:'<div class="ch-sol-cards"><div class="ch-sol-card"><div class="ch-sol-card-num">01</div><div class="ch-sol-card-title">Preço visível desde o início</div><div class="ch-sol-card-desc">O resumo ficou fixo, dinâmico e no topo. O valor total aparece no primeiro momento e atualiza em tempo real. Adriana nunca mais rolava a página tentando descobrir quanto ia pagar.</div></div><div class="ch-sol-card"><div class="ch-sol-card-num">02</div><div class="ch-sol-card-title">O sistema preenche, você confirma</div><div class="ch-sol-card-desc">Via CPF, nome, endereço e dados básicos são preenchidos automaticamente. O usuário passa de digitador para revisor. Menos campos, menos esforço, menos abandono.</div></div><div class="ch-sol-card"><div class="ch-sol-card-num">03</div><div class="ch-sol-card-title">Confiança onde a hesitação acontece</div><div class="ch-sol-card-desc">Selos de segurança posicionados onde os heatmaps mostravam maior concentração de cliques sem ação. Não onde pareciam certos, onde os dados mostravam que eram necessários.</div></div></div><div class="ch-sol-aside"><div class="ch-sol-aside-label">A decisão mais negociada</div><p>O time queria manter a criação de senha dentro do fluxo de compra. Os dados mostravam que esse passo respondia por 18% dos abandonos. Defendi remover e enviar credenciais por email pós-compra. A mudança foi aceita depois de apresentar a análise de funil por etapa. Sem dado, essa decisão não teria passado.</p></div><div class="ch-sol-aside"><div class="ch-sol-aside-label">Lançamento em um produto primeiro</div><p>O novo checkout subiu em apenas um curso. Quando os primeiros fluxos quebraram com o novo modelo de parcelamento, tínhamos poucos dias para corrigir sem impacto amplo. Lançamento gradual não era cautela, era método.</p></div>',
    results:[['+15%','Aumento na taxa de conversão — KR1 atingido','ti-trending-up','up'],['-20%','Redução no abandono de carrinho — KR2 atingido','ti-shopping-cart','down'],['↓','Tempo médio de conclusão da compra reduziu','ti-clock','down'],['✓','"Muito mais simples e rápido" — feedback recorrente','ti-thumb-up','check']],
    medicao:{texto:'GA4 com funil de eventos comparando 30 dias antes vs 30 dias após o lançamento. Microsoft Clarity para análise de gravações de sessão e identificação visual dos pontos de abandono.',tools:['Google Analytics 4','Microsoft Clarity']},
    en:{
      ey:'Conversion · Mobile · HealthTech',
      ttl:'More people completing<br>the <em>purchase.</em>',
      meta:['Product Designer','10 weeks','Figma · Clarity'],
      hook:'"80% of users reached checkout. Half quit halfway through. Every abandonment wasn\'t just a number, it was a family that couldn\'t afford a health plan."',
      context:'<p>Every checkout abandonment was more than lost revenue.</p><p>It was acquisition cost paid with no return. It was support overloaded with questions the screen should have answered. It was Adriana leaving without the health plan she needed, and telling someone the app was complicated.</p><p>A product fragmented across multiple steps, with a hidden total price and a long form, did exactly the opposite of what the core persona needed.</p>',
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
      sol:'<div class="ch-sol-cards"><div class="ch-sol-card"><div class="ch-sol-card-num">01</div><div class="ch-sol-card-title">Price visible from the start</div><div class="ch-sol-card-desc">The summary stayed fixed, dynamic and at the top. The total price appears from the first moment and updates in real time. Adriana never had to scroll to find out what she was paying.</div></div><div class="ch-sol-card"><div class="ch-sol-card-num">02</div><div class="ch-sol-card-title">The system fills, you confirm</div><div class="ch-sol-card-desc">Via CPF, name, address and basic data are filled automatically. The user goes from typist to reviewer. Fewer fields, less effort, less abandonment.</div></div><div class="ch-sol-card"><div class="ch-sol-card-num">03</div><div class="ch-sol-card-title">Trust where hesitation happens</div><div class="ch-sol-card-desc">Security badges positioned exactly where heatmaps showed the highest concentration of clicks with no action. Not where they seemed right — where the data showed they were needed.</div></div></div><div class="ch-sol-aside"><div class="ch-sol-aside-label">The most negotiated decision</div><p>The team wanted to keep password creation within the purchase flow. Data showed that step accounted for 18% of drop-offs. I argued to remove it and send credentials by email after purchase. The change was approved after presenting the funnel analysis by step. Without data, that decision wouldn\'t have passed.</p></div><div class="ch-sol-aside"><div class="ch-sol-aside-label">Gradual launch</div><p>The new checkout went live in just one course first. When the first automations broke with the new payment model, we had a few days to fix it with limited impact. The gradual launch wasn\'t caution — it was method.</p></div>',
      results:[['15%','Conversion rate increase, KR1 achieved'],['20%','Cart abandonment reduction, KR2 achieved'],['↓','Average purchase completion time'],['✓','"Much simpler and faster", recurring feedback']]
    },
  },
  nps:{
    color:'#854F0B',bg:'#111',
    cfCardW:160,
    prototipo:{src:'nps-prototipo.mp4', ratio:'1000/1920'},
    wireframes:'nps-wireframes.jpg',
    telas:['nps-tela-1.jpg','nps-tela-2.jpg','nps-tela-3.jpg','nps-tela-4.jpg','nps-tela-5.jpg','nps-tela-6.jpg','nps-tela-7.jpg'],
    ey:'NPS · Data · HealthTech',
    ttl:'Canal de NPS criado do zero.<br><em>Time que passou a ouvir.</em>',
    meta:['Product Designer','2 semanas','Figma'],
    hook:'"O Kivid tinha uma rede ativa de atendimentos. Decisões sobre o produto eram tomadas com base em feeling, suposições e reclamações espontâneas no suporte. Não havia linha de base. Não havia como medir evolução. Não havia cultura de feedback."',
    context:'<p>Sem dado de satisfação, o time priorizava pelo que gritava mais alto. Geralmente, reclamações isoladas no suporte, não padrões reais de insatisfação.</p><p>O custo era invisível: sprints planejados sem evidência, melhorias entregues sem como medir se funcionaram, e uma base de pacientes cujo nível de satisfação era, literalmente, desconhecido.</p>',
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
    insight:'<p>O problema não era falta de tela, era <strong>falta de cultura de escuta</strong>. O insight foi tratar a coleta como parte invisível da jornada: <strong>rápida, leve, no momento emocional certo</strong>, logo após o atendimento. Emojis no lugar de escalas frias. O qualitativo como bônus, nunca obrigação.</p>',
    objetivo:'Criar uma cultura de feedback contínuo que alimente decisões de produto com dados reais dos pacientes.',
    krs:[
      {txt:'Estabelecer canal de NPS e atingir taxa de resposta acima da baseline do mercado',meta:'base'},
      {txt:'Gerar ao menos 3 insights acionáveis por mês',meta:'3/mês'},
      {txt:'Estabelecer linha de base de satisfação trimestral',meta:'Q1 2024'}
    ],
    sol:'<div class="ch-sol-cards"><div class="ch-sol-card"><div class="ch-sol-card-num">01</div><div class="ch-sol-card-title">Momento certo, esforço mínimo</div><div class="ch-sol-card-desc">O disparo acontece logo após o atendimento, quando a experiência ainda está fresca. Fluxo em três telas, nenhuma que exija mais de 10 segundos.</div></div><div class="ch-sol-card"><div class="ch-sol-card-num">02</div><div class="ch-sol-card-title">Expressão emocional sem barreiras</div><div class="ch-sol-card-desc">Emojis no lugar de escalas frias. Cores suaves que não criam ansiedade. Microcopy que respeita o contexto de quem acabou de sair de uma consulta médica.</div></div><div class="ch-sol-card"><div class="ch-sol-card-num">03</div><div class="ch-sol-card-title">Qualitativo como convite</div><div class="ch-sol-card-desc">O campo aberto aparece só depois da avaliação numérica, como bônus, nunca como obrigação. Isso aumentou a taxa de preenchimento e a qualidade dos insights.</div></div></div>',
    results:[['0→1','Canal de NPS criado do zero — pela primeira vez o time tinha dados reais','ti-chart-bar','check'],['✓','NPS virou pauta de reunião semanal após o lançamento','ti-calendar','check'],['↑','Taxa de resposta acima da baseline do mercado nos primeiros meses','ti-trending-up','up'],['✓','Feedbacks qualitativos passaram a embasar decisões de produto','ti-message','check']],
    medicao:{texto:'Acompanhamento da taxa de resposta via sistema interno de coleta in-app nas primeiras semanas após o lançamento. Comparação com baseline do mercado de NPS para healthtechs.',tools:['Sistema in-app','Análise de taxa de resposta']},
    en:{
      ttl:'NPS channel built from scratch.<br><em>A team that started listening.</em>',
      meta:['Product Designer','2 weeks','Figma'],
      hook:'"Kivid had an active network of consultations. Product decisions were made based on gut feeling, assumptions and spontaneous complaints in support. No baseline. No way to measure evolution. No feedback culture."',
      context:'<p>Without satisfaction data, the team prioritized by what screamed loudest. Usually isolated complaints in support, not real patterns of dissatisfaction.</p><p>The cost was invisible: sprints planned without evidence, improvements delivered with no way to measure if they worked, and a patient base whose satisfaction level was, literally, unknown.</p>',
      role:'Product Designer responsible for channel conception, benchmarking, flow, microcopy and prototype.',
      insight:'<p>The problem wasn\'t a missing screen, it was a <strong>missing listening culture</strong>. The insight was treating collection as an invisible part of the journey: <strong>fast, light, at the right emotional moment</strong>, right after the consultation. Emojis instead of cold scales. Qualitative as a bonus, never an obligation.</p>',
      objetivo:'Create a continuous feedback culture that feeds product decisions with real data from patients.',
      krs:[
        {txt:'Establish an NPS channel and achieve a response rate above market baseline',meta:'base'},
        {txt:'Generate at least 3 actionable insights per month',meta:'3/month'},
        {txt:'Establish quarterly satisfaction baseline',meta:'Q1 2024'}
      ],
      kpis:[
        {icon:'📈',label:'NPS response rate',val:'% of consultations',desc:'Proportion of patients who respond after the consultation'},
        {icon:'💬',label:'Actionable insights',val:'Per month',desc:'Feedback that generates concrete changes in the product or service'},
        {icon:'📏',label:'Baseline',val:'Quarterly score',desc:'Reference to measure satisfaction evolution over time'}
      ],
      sol:'<div class="ch-sol-cards"><div class="ch-sol-card"><div class="ch-sol-card-num">01</div><div class="ch-sol-card-title">Right moment, minimum effort</div><div class="ch-sol-card-desc">The trigger fires right after the consultation, when the experience is still fresh. A three-screen flow, none requiring more than 10 seconds.</div></div><div class="ch-sol-card"><div class="ch-sol-card-num">02</div><div class="ch-sol-card-title">Emotional expression without barriers</div><div class="ch-sol-card-desc">Emojis instead of cold scales. Soft colors that don\'t create anxiety. Microcopy that respects the context of someone who just left a medical appointment.</div></div><div class="ch-sol-card"><div class="ch-sol-card-num">03</div><div class="ch-sol-card-title">Qualitative as an invitation</div><div class="ch-sol-card-desc">The open field appears only after the numerical rating, as a bonus, never an obligation. This increased both the completion rate and the quality of insights.</div></div></div>',
      results:[['0→1','NPS channel built from scratch — first time the team had real data','ti-chart-bar','check'],['✓','NPS became a weekly meeting topic after launch','ti-calendar','check'],['↑','Response rate above market baseline in the first months','ti-trending-up','up'],['✓','Qualitative feedback started informing product decisions','ti-message','check']]
    }
  }
  ,
  bomconsorcio:{
    color:'#9247F0',bg:'#111',
    model:['B2C'],
    caseHero:'bomconsorcio-case-hero.png',
    ey:'UX Writing · Arquitetura da Informação · Fintech',
    ttl:'Um sistema que todos<br><em>conseguem usar.</em>',
    meta:['Product Designer','BomConsórcio · Fintech','Figma'],
    hook:'"O cliente aceitava a oferta e, a partir daí, não sabia mais o que esperar. Em uma transação financeira de alto valor — vender uma cota de consórcio — incerteza não é só frustração. É perda de confiança. A cada tela nova, a mesma pergunta chegava ao suporte: isso já foi? quanto falta? O problema não era interface. Era que o sistema não honrava o processo real."',
    context:'<p>O fluxo de venda de cota secundária tinha sete a oito etapas reais entre o aceite da oferta e o pagamento. O stepper mostrado ao cliente, porém, agrupava várias dessas etapas sob um único número, escondendo sub-passos inteiros.</p><p>O texto de aceite de termos reunia declarações jurídicas, condições financeiras e regras operacionais em um único bloco extenso, sem hierarquia entre o que era obrigação legal e o que era informação prática. No meio do fluxo, o cliente era redirecionado para um provedor externo de biometria e assinatura, sem preparo prévio para a troca de ambiente. O resultado: dúvida recorrente sobre "em que etapa estou" e "o que falta", medida pelo volume de contatos no suporte.</p>',
    diags:[
      {icon:'🔢',title:'Etapas escondidas',desc:'Um número do stepper agrupava de 2 a 3 sub-passos reais. O cliente via "Etapa 2 de 5" e vivia muito mais telas do que isso sugeria.'},
      {icon:'📄',title:'Texto jurídico em bloco único',desc:'Declarações legais, dados da transação e condições financeiras misturados em um único parágrafo extenso, sem hierarquia entre o obrigatório e o informativo.'},
      {icon:'🔀',title:'Redirecionamento externo sem preparo',desc:'Biometria e assinatura aconteciam fora do fluxo, em outro provedor, sem nenhuma tela preparando o cliente para a troca de ambiente.'},
      {icon:'🔁',title:'Confirmação redundante de endereço',desc:'O CEP já informado era solicitado de novo em um modal de confirmação separado, dando a sensação de retrabalho.'}
    ],
    kpis:[
      {icon:'📞',label:'Volume de tickets de suporte',val:'Sobre "próximos passos"',desc:'Quantos contatos mencionam dúvida sobre etapa atual ou tempo restante'},
      {icon:'🚪',label:'Abandono por sub-etapa',val:'Funil completo',desc:'Em qual etapa real, não só no número do stepper, o cliente mais desiste'},
      {icon:'⏱',label:'Tempo até a assinatura',val:'Aceite → Assinatura',desc:'Tempo entre o aceite da oferta e a assinatura do contrato'}
    ],
    role:'Product Designer responsável pelo redesenho do fluxo pós-aceite de oferta: arquitetura da informação, hierarquia visual, microcopy e prototipação no Figma.',
    insight:'<p>Em produtos financeiros, <strong>confiança precede conversão</strong>. O stepper genérico não estava só escondendo etapas — estava criando uma discrepância entre a promessa da interface e a realidade do processo. Quando o cliente chega na "etapa 2 de 6" e encontra cinco sub-passos internos, ele não se sente guiado. Ele se sente enganado. O redesign partiu dessa premissa: <strong>transparência de jornada não é feature de UX, é condição básica para que a transação continue</strong>. Cada decisão de interface foi tomada com essa lente — do stepper ao texto jurídico, da biometria ao painel financeiro.</p>',
    objetivo:'Tornar o andamento da venda da cota visível e previsível em cada etapa real, reduzindo a dependência do cliente em relação ao suporte para entender o que vem a seguir.',
    krs:[
      {txt:'Reduzir tickets de suporte sobre "próximos passos" após o aceite da oferta',meta:'-30% (hipótese)'},
      {txt:'Reduzir abandono nas sub-etapas hoje escondidas pelo stepper genérico',meta:'-20% (hipótese)'},
      {txt:'Reduzir o tempo médio entre aceite da oferta e assinatura do contrato',meta:'-15% (hipótese)'}
    ],
    sol:'<div class="ch-sol-cards"><div class="ch-sol-card"><div class="ch-sol-card-num">01</div><div class="ch-sol-card-title">Stepper fiel à realidade do processo</div><div class="ch-sol-card-desc">As 8 etapas reais (Aceite de Termos, Dados do Cedente, Endereço, Assinantes, Assinatura do contrato, Aguardando, Transferência, Pagamento) passaram a ter número e nome próprios. Nenhum sub-passo fica mais escondido atrás de uma etapa genérica.</div></div><div class="ch-sol-card"><div class="ch-sol-card-num">02</div><div class="ch-sol-card-title">Hierarquia por tipo de informação</div><div class="ch-sol-card-desc">Dados financeiros da venda (valor, taxa, desconto, prazo) foram isolados em um painel lateral próprio. A declaração jurídica ganhou um cartão dedicado, sem se misturar com números da transação.</div></div><div class="ch-sol-card"><div class="ch-sol-card-num">03</div><div class="ch-sol-card-title">Da declaração de seis parágrafos ao digest</div><div class="ch-sol-card-desc">O texto de aceite, antes um bloco jurídico denso, virou cinco frases em linguagem direta, cobrindo os mesmos pontos (processo eletrônico, token por e-mail, prazo de pagamento, destino do valor), com link "Ver termos completos" preservando o texto integral para compliance.</div></div></div><div class="ch-sol-aside"><div class="ch-sol-aside-label">A decisão mais negociada</div><p>Avaliamos internalizar a etapa de biometria e assinatura, hoje rodando em um provedor externo — o que quebra visualmente a continuidade do fluxo no momento mais sensível da transação. O ganho de continuidade era claro, mas o custo operacional de homologar verificação biométrica própria, manter compliance e SLA de segurança, somado ao tempo de implementação necessário, tornava a internalização inviável neste ciclo. Optamos por manter o provedor externo e investir o esforço de design em preparar o cliente para a transição, em vez de prometer uma reconstrução que não pagaria o investimento no curto prazo.</p></div><div class="ch-sol-aside"><div class="ch-sol-aside-label">O texto jurídico não precisava desaparecer, precisava de hierarquia</div><p>O bloco de aceite reunia seis parágrafos repetindo a mesma estrutura "Declaro que...". A solução não foi remover conteúdo legal, foi separar camadas: um digest de cinco pontos em linguagem direta para leitura em segundos, e o texto completo preservado por trás de um link, para quem precisa da redação jurídica integral. Validei essa mudança diretamente no arquivo de Figma, comparando a altura do card antes e depois como primeira evidência de redução de carga de leitura.</p></div>',
    resultsLabel:'Hipóteses a validar',
    medicao:{texto:'O diagnóstico partiu do time de suporte — a categoria mais frequente de tickets era dúvida sobre andamento do processo, não erros técnicos. Esse padrão qualitativo validou o problema antes do primeiro wireframe e serviu como baseline para a hipótese de redução. Os resultados são projetados — o acesso aos dados pós-lançamento não estava no escopo do projeto.',tools:['Suporte — categorização qualitativa de tickets','Análise de padrão de chamados']},
    orgImg:'fluxo-figma-bomconsórcio.png',
    telas:['bomconsorcio-tela-01.jpg','bomconsorcio-tela-02.jpg','bomconsorcio-tela-03.jpg','bomconsorcio-tela-04.jpg','bomconsorcio-tela-05.jpg','bomconsorcio-tela-06.jpg','bomconsorcio-tela-07.jpg','bomconsorcio-tela-08.jpg','bomconsorcio-tela-09.jpg','bomconsorcio-tela-10.jpg','bomconsorcio-tela-11.jpg'],
    telasGrid:true,
    telasLabels:['Aceite de Termos','Dados do Cedente','Confirmação de CEP','Confirmação de Endereço','Assinante do Contrato','Prova de Vida','Etapa Concluída','Assinar Contrato','Confirmar Dados','Token de Autenticação','Assinatura Concluída'],
    telaRatio:'1328/1398',
    results:[
      ['-30%','Hipótese: queda nos tickets de suporte sobre "o que vem depois", já que cada sub-etapa real passa a ter seu próprio número visível no stepper.','ti-headset','hyp','hipótese'],
      ['-20%','Hipótese: menor abandono nas sub-etapas hoje invisíveis, pela granularidade do progresso mostrado ao cliente.','ti-trending-down','hyp','hipótese'],
      ['-15%','Hipótese: tempo médio entre aceite e assinatura cai, com o texto jurídico digerido e o trajeto até a assinatura mais claro.','ti-clock','hyp','hipótese'],
      ['↑','Hipótese: clareza percebida sobe nos testes de usabilidade, à medida que cada etapa visível corresponde a uma etapa real do processo.','ti-eye','hyp','hipótese']
    ],
    en:{
      ey:'UX Writing · Information Architecture · Fintech',
      ttl:'A system that everyone<br><em>can use now.</em>',
      meta:['Product Designer','BomConsórcio · Fintech','Figma'],
      hook:'"The client accepted the offer and from that point on had no idea what to expect. Every screen, the same question reached support: has this gone through? how much is left? It wasn\'t a lack of information. It was too much information, the wrong way."',
      context:'<p>The secondary quota sale flow had seven to eight real steps between accepting the offer and final payment. The stepper shown to the client, however, grouped several of those steps under a single number, hiding entire sub-steps.</p><p>The terms acceptance text bundled legal declarations, financial conditions and operational rules into one long block, with no hierarchy between legal obligation and practical information. Midway through the flow, the client was redirected to an external biometrics and signature provider with no preparation for the change of environment. The result: recurring doubt about "what step am I on" and "what\'s left," measured by the volume of support contacts.</p>',
      diags:[
        {icon:'🔢',title:'Hidden steps',desc:'One stepper number grouped 2 to 3 real sub-steps. The client saw "Step 2 of 5" and went through far more screens than that suggested.'},
        {icon:'📄',title:'Legal text in a single block',desc:'Legal declarations, transaction data and financial conditions mixed into one long paragraph, with no hierarchy between what was mandatory and what was informational.'},
        {icon:'🔀',title:'External redirect with no preparation',desc:'Biometrics and signature happened outside the flow, on another provider, with no screen preparing the client for the change of environment.'},
        {icon:'🔁',title:'Redundant address confirmation',desc:'The ZIP code already provided was asked again in a separate confirmation modal, creating a sense of rework.'}
      ],
      kpis:[
        {icon:'📞',label:'Support ticket volume',val:'About "what\'s next"',desc:'How many contacts mention doubt about the current step or time remaining'},
        {icon:'🚪',label:'Drop-off by sub-step',val:'Full funnel',desc:'Which real step, not just the stepper number, sees the most abandonment'},
        {icon:'⏱',label:'Time to signature',val:'Acceptance → Signature',desc:'Time between accepting the offer and signing the contract'}
      ],
      role:'Product Designer responsible for redesigning the post-acceptance flow: information architecture, visual hierarchy, microcopy and prototyping in Figma.',
      insight:'<p>The problem wasn\'t the number of steps, it was the <strong>mismatch between what the client saw and what was actually happening</strong>. A single stepper number hid entire sub-steps, data of different natures (legal, financial, operational) appeared mixed together, and the environment changed without warning at the biometrics step. The client wasn\'t lost because of lack of ability, they were lost because the interface told a different story than the actual process.</p>',
      objetivo:'Make the progress of the quota sale visible and predictable at every real step, reducing the client\'s dependency on support to understand what comes next.',
      krs:[
        {txt:'Reduce support tickets about "next steps" after offer acceptance',meta:'-30% (hypothesis)'},
        {txt:'Reduce drop-off in sub-steps currently hidden by the generic stepper',meta:'-20% (hypothesis)'},
        {txt:'Reduce average time between offer acceptance and contract signature',meta:'-15% (hypothesis)'}
      ],
      sol:'<div class="ch-sol-cards"><div class="ch-sol-card"><div class="ch-sol-card-num">01</div><div class="ch-sol-card-title">A stepper that matches the real process</div><div class="ch-sol-card-desc">The 8 real steps (Terms Acceptance, Seller Data, Address, Signatories, Contract Signature, Awaiting, Transfer, Payment) each got their own number and name. No sub-step stays hidden behind a generic step anymore.</div></div><div class="ch-sol-card"><div class="ch-sol-card-num">02</div><div class="ch-sol-card-title">Hierarchy by type of information</div><div class="ch-sol-card-desc">Financial data about the sale (amount, fee, discount, term) was isolated into its own side panel. The legal declaration got a dedicated card, no longer mixed with transaction numbers.</div></div><div class="ch-sol-card"><div class="ch-sol-card-num">03</div><div class="ch-sol-card-title">From a six-paragraph declaration to a digest</div><div class="ch-sol-card-desc">The acceptance text, once a dense legal block, became five plain-language sentences covering the same points (electronic process, email token, payment deadline, destination of funds), with a "View full terms" link preserving the complete text for compliance.</div></div></div><div class="ch-sol-aside"><div class="ch-sol-aside-label">The most negotiated decision</div><p>We evaluated bringing the biometrics and signature step in-house, since it currently runs on an external provider that visually breaks flow continuity at the most sensitive moment of the transaction. The continuity gain was clear, but the operational cost of certifying our own biometric verification, maintaining compliance and security SLAs, plus the implementation time required, made bringing it in-house unfeasible for this cycle. We chose to keep the external provider and invest the design effort in preparing the client for the transition, instead of promising a rebuild that wouldn\'t pay off the investment in the short term.</p></div><div class="ch-sol-aside"><div class="ch-sol-aside-label">The legal text didn\'t need to disappear, it needed hierarchy</div><p>The acceptance block had six paragraphs repeating the same "I declare that..." structure. The fix wasn\'t removing legal content, it was separating layers: a five-point digest in plain language for a few seconds of reading, and the full text preserved behind a link for anyone who needs the complete legal wording. I validated this directly in the Figma file, comparing the card\'s height before and after as first evidence of reduced reading load.</p></div>',
      resultsLabel:'Hypotheses to validate',
      results:[
        ['-30%','Hypothesis: drop in support tickets about "what happens next," since every real sub-step now has its own visible number on the stepper.','ti-headset','hyp','hypothesis'],
        ['-20%','Hypothesis: lower drop-off in sub-steps currently invisible, thanks to the granularity of progress shown to the client.','ti-trending-down','hyp','hypothesis'],
        ['-15%','Hypothesis: average time between acceptance and signature drops, with digested legal text and a clearer path to signature.','ti-clock','hyp','hypothesis'],
        ['↑','Hypothesis: perceived clarity rises in usability tests, as each visible step matches a real step in the process.','ti-eye','hyp','hypothesis']
      ]
    }
  }
  ,
  itau:{
    color:'#EC7000',bg:'#111',
    model:['B2B','B2C'],
    ey:'White Label · Design System · Fintech',
    ttl:'Por fora, Itaú.<br><em>Por dentro, BomConsórcio.</em>',
    meta:['Product Designer','BomConsórcio × Itaú · Fintech','Figma'],
    orgImg:'img-figma-white-label.jpg',
    processoImg:'User-Flow-White-Label-Itaú.jpg',
    mobileImg:'mockup-mobile-itaú.jpg',
    cfCardW:640,
    telas:['itau-tela-01.jpg','itau-tela-02.jpg','itau-tela-03.jpg','itau-tela-04.jpg','itau-tela-05.jpg','itau-tela-06.jpg','itau-tela-07.jpg','itau-tela-08.jpg','itau-tela-09.jpg','itau-tela-10.jpg','itau-tela-11.jpg'],
    telasLabels:['Início — LP Itaú','Cadastro — Início','Cadastro — Dados','Cadastro — Criar conta','Cadastro — Confirmar e-mail','Cadastro — Verificação de identidade','Cadastro — Conta criada com sucesso','Login — Início','Login — Encontrar cota','Login — Oferta','Estado de exceção — cota'],
    hook:'"O prazo era curto e a régua era de banco. Não bastava reaproveitar o motor do BomConsórcio, cada pixel precisava passar pela aprovação de marca do Itaú antes de ir ao ar. O desafio não era desenhar do zero. Era fazer um sistema inteiro parecer que sempre foi do banco, sem parar a operação para reconstruir."',
    context:'<p>O objetivo do fluxo é simples de descrever e complexo de entregar: o cliente Itaú com uma cota de consórcio cancelada entra no sistema e recebe uma oferta de antecipação de crédito pela cota, seguindo o mesmo motor de venda secundária já validado pelo BomConsórcio. Do clique inicial até a oferta na tela, ele passa por um processo completo de identificação, validação e simulação.</p><p>A white label foi dividida em dois ambientes. O <strong>Ambiente 1 (externo)</strong> cobre tudo antes do login — landing page da parceria, cadastro, validação por token e recuperação de senha. O <strong>Ambiente 2 (interno)</strong> começa depois que o cliente entra no sistema — localização da cota, verificação de identidade e simulação da oferta. Os dois precisavam ter a mesma coerência visual e de marca, mesmo sendo etapas e contextos completamente diferentes.</p>',
    diags:[
      {icon:'🎨',title:'Sem camada de tema isolada',desc:'A base do BomConsórcio não separava marca de lógica de fluxo. Cor, tipografia e logo estavam direto nos componentes, então trocar a marca significava reescrever telas, não substituir uma camada.'},
      {icon:'🏦',title:'Régua de aprovação de banco',desc:'Cada tela passava pelo time de branding do Itaú antes do desenvolvimento. Um tom de laranja fora do manual ou um peso de fonte errado podia travar a entrega por dias.'},
      {icon:'🧩',title:'Dois ambientes, uma só marca',desc:'O ambiente externo (pré-login) e o interno (pós-login) tinham propósitos e telas completamente diferentes, mas precisavam parecer parte do mesmo sistema Itaú do início ao fim, sem costura visível entre eles.'},
      {icon:'🔀',title:'Duas marcas, um mesmo login',desc:'Clientes com cota de outra administradora precisavam ser identificados e redirecionados sem confundir qual sistema estavam usando.'},
      {icon:'📢',title:'Parceria banco + fintech sem lugar pra explicar',desc:'Não existia página que justificasse por que um cliente do Itaú deveria confiar numa fintech parceira para vender a cota. Sem essa camada, a desconfiança inicial era um risco real de abandono.'}
    ],
    kpis:[
      {icon:'🗺️',label:'Cobertura mapeada',val:'PF + PJ · Desktop + App',desc:'Jornada completa mapeada e desenhada: acesso ao site, cadastro, validação por token, login, recuperação de senha, localização de cota, oferta e estados de erro'},
      {icon:'⏱',label:'Tempo de aprovação de marca',val:'Ciclo de revisão',desc:'Dias entre entrega de tela e aprovação do time de branding do Itaú'},
      {icon:'♻️',label:'Reuso do design system',val:'% de componentes',desc:'Proporção de componentes do BomConsórcio reaproveitados sem reconstrução'},
      {icon:'🚀',label:'Tempo até o ar',val:'Kickoff → Lançamento',desc:'Tempo total entre o início do projeto e o lançamento da versão white label'}
    ],
    role:'Product Designer responsável pela white label completa do fluxo BomConsórcio para o Itaú, cobrindo os dois ambientes do produto — externo (pré-login) e interno (pós-login) — em versão desktop e app, para pessoa física e pessoa jurídica. Mapeei toda a jornada do usuário: acesso ao site, cadastro, validação via token, verificação de identidade, login, recuperação de senha, localização da cota, simulação de oferta e estados de erro. Construí também um mini design system para sustentar essa adaptação. Atuação direta com a responsável por branding do Itaú.',
    insight:'<p>White label não é reskin. A tentação era tratar a adaptação como troca de cor e logo, mas a régua de aprovação de banco expôs uma dívida estrutural: o BomConsórcio não tinha uma camada de tema separada da lógica de fluxo. O trabalho real foi <strong>tokenizar a marca</strong> — isolar o que era "Itaú" do que era "processo de venda de cota" — para que qualquer próxima marca parceira pudesse ser plugada sem reescrever nada. Compliance de banco não é obstáculo de design, é um teste de arquitetura.</p>',
    objetivo:'Entregar uma versão white label completa do fluxo BomConsórcio — ambientes externo e interno, desktop e app, pessoa física e jurídica — totalmente alinhada à marca e ao compliance do Itaú, com um mini design system que sustentasse a jornada inteira, do acesso ao site até a oferta pela cota.',
    krs:[
      {txt:'Reduzir o tempo médio de aprovação de marca por tela',meta:'-40% (hipótese)'},
      {txt:'Aumentar a proporção de componentes reaproveitados sem reconstrução',meta:'80%+ (hipótese)'},
      {txt:'Lançar a versão white label dentro do prazo acordado com o Itaú',meta:'No prazo'}
    ],
    sol:'<div class="ch-sol-cards"><div class="ch-sol-card"><div class="ch-sol-card-num">01</div><div class="ch-sol-card-title">Tokenização de marca</div><div class="ch-sol-card-desc">Cor, tipografia, logo e ícones do header foram isolados em uma camada de tema, plugável por cima da arquitetura de fluxo do BomConsórcio — sem tocar na lógica de cadastro, oferta ou verificação de identidade.</div></div><div class="ch-sol-card"><div class="ch-sol-card-num">02</div><div class="ch-sol-card-title">Header e navegação com identidade própria</div><div class="ch-sol-card-desc">Logo Itaú, paleta laranja e microcopy adaptado ("Consórcio Itaú") substituíram os equivalentes do BomConsórcio em todos os pontos de contato, do login à tela de "sem oferta no momento".</div></div><div class="ch-sol-card"><div class="ch-sol-card-num">03</div><div class="ch-sol-card-title">Landing page da parceria</div><div class="ch-sol-card-desc">Página dedicada com "Como funciona", vantagens de vender com o BomConsórcio e FAQ, criada para legitimar a parceria bancária antes mesmo do cliente entrar no fluxo de venda.</div></div><div class="ch-sol-card"><div class="ch-sol-card-num">04</div><div class="ch-sol-card-title">Mini design system White Label</div><div class="ch-sol-card-desc">Construí um mini design system cobrindo os dois ambientes (externo e interno), desktop e app, PF e PJ — tokens de marca, componentes de formulário, estados de erro e sucesso — sustentando toda a jornada mapeada sem retrabalho tela a tela.</div></div></div><div class="ch-sol-aside"><div class="ch-sol-aside-label">A decisão mais negociada</div><p>A cada rodada de aprovação, o time de branding do Itaú pedia ajustes finos — tom exato do laranja, peso da fonte no header, distância mínima do logo. Cada ida e volta consumia dias que o cronograma da parceria não previa. A saída não foi negociar menos rodadas, foi antecipar: levantei o manual de marca do Itaú antes de desenhar a primeira tela e validei protótipos de baixa fidelidade direto com a responsável por branding, para só então avançar para alta fidelidade. Isso não eliminou as rodadas de aprovação, mas reduziu o retrabalho em cada uma, protegendo o prazo apertado da parceria.</p></div>',
    resultsLabel:'Resultados',
    medicao:{texto:'A entrega no prazo e a cobertura completa (PF/PJ, desktop/app) são fatos verificáveis do escopo entregue. Os demais resultados são projeções, já que não houve acesso a dados pós-lançamento no escopo deste projeto — baseadas no acompanhamento qualitativo das rodadas de aprovação de marca e no comparativo de componentes reaproveitados vs. recriados durante a adaptação.',tools:['Rodadas de aprovação — acompanhamento qualitativo','Comparativo de componentes do design system']},
    results:[
      ['0→1','Entrega completa da white label — dois ambientes, desktop e app, PF e PJ — dentro do prazo acordado com o Itaú.','ti-calendar-check','check','entregue'],
      ['80%+','Hipótese: proporção de componentes do BomConsórcio reaproveitados sem reconstrução, graças à tokenização de marca.','ti-puzzle','hyp','hipótese'],
      ['PF + PJ','Cobertura completa da jornada mapeada e desenhada, em desktop e app, para pessoa física e jurídica.','ti-devices','check','entregue'],
      ['-40%','Hipótese: menor tempo de aprovação de marca por tela, com protótipos de baixa fidelidade validados antes da alta fidelidade.','ti-clock','hyp','hipótese']
    ],
    en:{
      ey:'White Label · Design System · Fintech',
      ttl:'On the outside, Itaú.<br><em>On the inside, BomConsórcio.</em>',
      meta:['Product Designer','BomConsórcio × Itaú · Fintech','Figma'],
      hook:'"The deadline was tight and the bar was bank-grade. It wasn\'t enough to reuse the BomConsórcio engine, every pixel had to pass Itaú\'s brand approval before going live. The challenge wasn\'t designing from scratch. It was making an entire system look like it had always belonged to the bank, without stopping operations to rebuild it."',
      context:'<p>The flow\'s goal is simple to state and complex to deliver: an Itaú client with a cancelled consortium quota enters the system and receives a credit anticipation offer for that quota, following the same secondary sale engine already validated by BomConsórcio. From the first click to the offer on screen, the client goes through a full process of identification, validation and simulation.</p><p>The white label was split into two environments. <strong>Environment 1 (external)</strong> covers everything before login — the partnership landing page, signup, token validation and password recovery. <strong>Environment 2 (internal)</strong> starts once the client logs in — quota location, identity verification and offer simulation. Both needed the same visual and brand coherence, despite being completely different stages and contexts.</p>',
      diags:[
        {icon:'🎨',title:'No isolated theme layer',desc:'BomConsórcio\'s base didn\'t separate brand from flow logic. Color, typography and logo lived directly inside components, so swapping the brand meant rewriting screens, not swapping a layer.'},
        {icon:'🏦',title:'Bank-grade approval bar',desc:'Every screen went through Itaú\'s branding team before development. An orange shade off the manual or a wrong font weight could stall delivery for days.'},
        {icon:'🧩',title:'Two environments, one brand',desc:'The external (pre-login) and internal (post-login) environments had entirely different purposes and screens, but needed to feel like one continuous Itaú system, with no visible seam between them.'},
        {icon:'🔀',title:'Two brands, one login',desc:'Clients with a quota from another administrator needed to be identified and redirected without confusing which system they were in.'},
        {icon:'📢',title:'A bank + fintech partnership with nowhere to explain itself',desc:'There was no page justifying why an Itaú client should trust a partner fintech to sell their quota. Without that layer, initial distrust was a real abandonment risk.'}
      ],
      kpis:[
        {icon:'🗺️',label:'Mapped coverage',val:'PF + PJ · Desktop + App',desc:'Full journey mapped and designed: site access, signup, token validation, login, password recovery, quota location, offer and error states'},
        {icon:'⏱',label:'Brand approval time',val:'Review cycle',desc:'Days between screen delivery and approval from Itaú\'s branding team'},
        {icon:'♻️',label:'Design system reuse',val:'% of components',desc:'Proportion of BomConsórcio components reused without rebuild'},
        {icon:'🚀',label:'Time to launch',val:'Kickoff → Launch',desc:'Total time between project kickoff and the white label launch'}
      ],
      role:'Product Designer responsible for the full white label of the BomConsórcio flow for Itaú, covering both product environments — external (pre-login) and internal (post-login) — in desktop and app versions, for individual and business clients. I mapped the entire user journey: site access, signup, token validation, identity verification, login, password recovery, quota location, offer simulation and error states. I also built a mini design system to sustain the adaptation. Worked directly with Itaú\'s branding lead.',
      insight:'<p>White label isn\'t a reskin. The temptation was to treat the adaptation as swapping color and logo, but the bank\'s approval bar exposed a structural debt: BomConsórcio had no theme layer separate from its flow logic. The real work was <strong>tokenizing the brand</strong> — isolating what was "Itaú" from what was "quota sale process" — so the next partner brand could be plugged in without rewriting anything. Bank compliance isn\'t a design obstacle, it\'s an architecture test.</p>',
      objetivo:'Deliver a complete white label version of the BomConsórcio flow — external and internal environments, desktop and app, individual and business clients — fully aligned with Itaú\'s brand and compliance, with a mini design system sustaining the entire journey, from site access to the quota offer.',
      krs:[
        {txt:'Reduce average brand approval time per screen',meta:'-40% (hypothesis)'},
        {txt:'Increase the proportion of components reused without rebuild',meta:'80%+ (hypothesis)'},
        {txt:'Launch the white label version within the deadline agreed with Itaú',meta:'On time'}
      ],
      sol:'<div class="ch-sol-cards"><div class="ch-sol-card"><div class="ch-sol-card-num">01</div><div class="ch-sol-card-title">Brand tokenization</div><div class="ch-sol-card-desc">Color, typography, logo and header icons were isolated into a theme layer, pluggable on top of BomConsórcio\'s flow architecture — without touching the signup, offer or identity verification logic.</div></div><div class="ch-sol-card"><div class="ch-sol-card-num">02</div><div class="ch-sol-card-title">Header and navigation with its own identity</div><div class="ch-sol-card-desc">Itaú\'s logo, orange palette and adapted microcopy ("Consórcio Itaú") replaced BomConsórcio\'s equivalents across every touchpoint, from login to the "no offer available" screen.</div></div><div class="ch-sol-card"><div class="ch-sol-card-num">03</div><div class="ch-sol-card-title">Partnership landing page</div><div class="ch-sol-card-desc">A dedicated page with "How it works," reasons to sell through BomConsórcio, and an FAQ, built to legitimize the banking partnership before the client even entered the sale flow.</div></div><div class="ch-sol-card"><div class="ch-sol-card-num">04</div><div class="ch-sol-card-title">White label mini design system</div><div class="ch-sol-card-desc">I built a mini design system covering both environments (external and internal), desktop and app, individual and business clients — brand tokens, form components, error and success states — sustaining the entire mapped journey without screen-by-screen rework.</div></div></div><div class="ch-sol-aside"><div class="ch-sol-aside-label">The most negotiated decision</div><p>At every approval round, Itaú\'s branding team asked for fine adjustments — the exact shade of orange, the header\'s font weight, the logo\'s minimum clear space. Each round-trip ate into days the partnership\'s timeline hadn\'t budgeted for. The fix wasn\'t negotiating fewer rounds, it was getting ahead of them: I pulled Itaú\'s brand manual before drawing the first screen and validated low-fidelity prototypes directly with the branding lead, only moving to high fidelity afterward. That didn\'t eliminate approval rounds, but it cut rework in each one, protecting the partnership\'s tight deadline.</p></div>',
      resultsLabel:'Results',
      results:[
        ['0→1','Full white label delivery — two environments, desktop and app, individual and business — within the deadline agreed with Itaú.','ti-calendar-check','check','delivered'],
        ['80%+','Hypothesis: proportion of BomConsórcio components reused without rebuild, thanks to brand tokenization.','ti-puzzle','hyp','hypothesis'],
        ['PF + PJ','Full journey coverage mapped and designed, in desktop and app, for individual and business clients.','ti-devices','check','delivered'],
        ['-40%','Hypothesis: lower brand approval time per screen, with low-fidelity prototypes validated before high fidelity.','ti-clock','hyp','hypothesis']
      ]
    }
  }
  ,
  passaporte:{
    color:'#B8860B',bg:'#111',
    model:['B2C','B2E'],
    platformBadge:'📱 App Mobile · Fluxo conversacional na versão do cliente',
    ey:'Assinatura · Pagamentos · HealthTech',
    ttl:'Uma assinatura,<br><em>dois lados da venda.</em>',
    meta:['Product Designer','Kivid · HealthTech · Fintech','Figma'],
    hook:'"Desenhar a tela de checkout é a parte fácil. O difícil é garantir que, no momento em que o cliente termina de pagar no app, o vendedor veja exatamente a mesma venda confirmada no portal dele, não importa se o pagamento foi por PIX, cartão, pontos ou na maquininha. Não era uma tela. Eram dois sistemas contando a mesma história ao mesmo tempo."',
    context:'<p>O Passaporte Kivid é uma assinatura que dá acesso a uma rede de saúde com valores especiais, vendida tanto pra uma pessoa individual quanto pra um plano família, com titular e dependentes. O produto tinha duas pontas que precisavam ser desenhadas juntas: o <strong>app do cliente</strong>, onde a família se cadastra e paga a assinatura, e o <strong>portal web do afiliado</strong>, onde o vendedor gerencia vendas, recebe pagamentos e acompanha comissão.</p><p>Cada ponta tinha sua própria complexidade de pagamento. No app, o cliente podia pagar via PIX, cartão, pontos+cartão ou pontos+PIX. No portal, o afiliado podia vender por link de pagamento, PIX ou maquininha física. Design o suficiente pra fazer a venda acontecer nos dois lados, sem os dois sistemas nunca conflitarem sobre o que realmente foi vendido.</p>',
    diags:[
      {icon:'💳',title:'Quatro formas de pagar, uma só experiência',desc:'PIX, cartão, pontos+cartão e pontos+PIX no app do cliente precisavam parecer parte do mesmo fluxo, não quatro fluxos colados um no outro — cada um com resumo, confirmação e estado de erro próprios.'},
      {icon:'🔄',title:'Duas telas, uma só verdade',desc:'O que o cliente via como "pago" no app precisava bater exatamente com o que o afiliado via como "vendido" no portal — sem lag perceptível, sem estados divergentes entre as duas pontas do sistema.'},
      {icon:'👨‍👩‍👧',title:'Cadastro de família sem parecer burocracia',desc:'Adicionar cada membro da família exigia nome, nascimento, CPF e contato — dados sensíveis demais pra um formulário longo e frio, mas obrigatórios demais pra pular etapas.'},
      {icon:'🧾',title:'Três canais de recebimento pro afiliado',desc:'O vendedor podia receber por PIX, cartão ou maquininha física — cada canal com timing e interface completamente diferentes, mas precisando terminar no mesmo tipo de confirmação e recibo.'}
    ],
    kpis:[
      {icon:'🗺️',label:'Cobertura completa',val:'App cliente + Portal afiliado',desc:'Sistema desenhado nas duas pontas da mesma transação, do cadastro da família à confirmação da venda'},
      {icon:'💳',label:'Métodos de pagamento unificados',val:'4 no app · 3 no portal',desc:'PIX, cartão, pontos+cartão e pontos+PIX do lado do cliente; PIX, cartão e maquininha do lado do afiliado'},
      {icon:'👏',label:'Momento de celebração',val:'Microinteração no sucesso',desc:'Estado de confirmação com animação de celebração, fechando o fluxo com reconhecimento em vez de só uma confirmação fria'},
      {icon:'🚀',label:'Lançado em produção',val:'Sistema no ar',desc:'App do cliente e portal do afiliado publicados e em uso real, não apenas protótipo'}
    ],
    role:'Product Designer responsável por desenhar as duas pontas do sistema — o app do cliente (assinatura e pagamento do Passaporte) e o portal web do afiliado (venda, recebimento e comissão) — trabalhando em conjunto com outro(s) designer(s) do time Kivid.',
    insight:'<p>O desafio real não era nenhuma tela isolada de checkout. Era manter dois sistemas independentes — o app do consumidor e o portal do vendedor — contando exatamente a mesma história sobre a mesma transação. Cada método de pagamento no app precisava de um equivalente reconhecível no portal: "pago" pro cliente tinha que virar "vendido" pro afiliado, no mesmo instante, com a mesma clareza. <strong>Desenhar os dois lados juntos</strong>, não em paralelo, foi o que evitou que o sistema virasse dois produtos desconectados fingindo ser um só.</p>',
    objetivo:'Entregar um sistema de assinatura completo cobrindo o app do cliente e o portal do afiliado, unificando múltiplos métodos de pagamento dos dois lados sem fragmentar a experiência nem transformar o cadastro de família em burocracia.',
    krs:[
      {txt:'Unificar a lógica visual dos 4 métodos de pagamento do app do cliente',meta:'Mesma estrutura de resumo/confirmação'},
      {txt:'Garantir que os 3 canais de recebimento do afiliado sigam o mesmo padrão de confirmação',meta:'PIX, cartão, maquininha'},
      {txt:'Reduzir a sensação de burocracia no cadastro de membros da família',meta:'Fluxo conversacional, um dado por vez'}
    ],
    sol:'<div class="ch-sol-cards"><div class="ch-sol-card"><div class="ch-sol-card-num">01</div><div class="ch-sol-card-title">Formulário conversacional pra família</div><div class="ch-sol-card-desc">Nome, nascimento, CPF e contato de cada membro são coletados um de cada vez, em bolhas de chat, em vez de um formulário longo — reduz a sensação de burocracia sem abrir mão da validação de cada campo.</div></div><div class="ch-sol-card"><div class="ch-sol-card-num">02</div><div class="ch-sol-card-title">Camada de pagamento unificada</div><div class="ch-sol-card-desc">Resumo, confirmação e estado de sucesso seguem a mesma estrutura visual nos quatro métodos de pagamento do app e nos três canais de recebimento do portal — muda o meio, não a lógica da tela.</div></div><div class="ch-sol-card"><div class="ch-sol-card-num">03</div><div class="ch-sol-card-title">Portal do afiliado com múltiplos canais</div><div class="ch-sol-card-desc">Link de pagamento, PIX e maquininha física desenhados como variações do mesmo padrão de confirmação, com dashboard de vendas (realizadas, em andamento, canceladas) sempre refletindo o estado real da venda.</div></div><div class="ch-sol-card"><div class="ch-sol-card-num">04</div><div class="ch-sol-card-title">Recibo e confirmação com celebração</div><div class="ch-sol-card-desc">O estado de sucesso fecha o fluxo com uma microinteração de celebração, e gera um recibo formal — equilibrando o lado emocional da compra com a exigência de comprovante para o cliente.</div></div></div><div class="ch-sol-aside"><div class="ch-sol-aside-label">A decisão mais negociada</div><p>A área de compliance queria um formulário tradicional pra coletar os dados de cada membro da família — mais previsível de auditar. O time de produto queria uma experiência conversacional, mais leve pra quem está cadastrando três ou quatro pessoas seguidas. A saída não foi escolher um lado: o fluxo manteve a interface em bolhas de chat, mas cada dado era validado e armazenado exatamente como um formulário formal validaria — a camada visual mudou, a estrutura de dados por trás não.</p></div>',
    resultsLabel:'Resultados',
    medicao:{texto:'O sistema foi lançado em produção, então a cobertura completa (app + portal) e os canais de pagamento são fatos verificáveis do escopo entregue. Os demais resultados são projeções, já que não houve acesso a dados de uso pós-lançamento no escopo deste projeto — baseadas no acompanhamento qualitativo do fluxo durante o desenvolvimento.',tools:['Testes internos do fluxo de família','Comparativo de estrutura entre os métodos de pagamento']},
    results:[
      ['✓','Sistema completo lançado em produção, cobrindo o app do cliente e o portal do afiliado.','ti-rocket','check','entregue'],
      ['4 → 1','Hipótese: unificar a estrutura visual dos 4 métodos de pagamento reduz retrabalho de manutenção e inconsistência entre eles.','ti-credit-card','hyp','hipótese'],
      ['3 canais','Afiliado recebe por PIX, cartão e maquininha seguindo o mesmo padrão de confirmação e recibo.','ti-devices','check','entregue'],
      ['↓','Hipótese: o fluxo conversacional de cadastro de família reduz abandono em comparação a um formulário tradicional.','ti-users','hyp','hipótese']
    ],
    en:{
      ey:'Subscription · Payments · HealthTech',
      platformBadge:'📱 Mobile App · Conversational flow on the client side',
      ttl:'One subscription,<br><em>two sides of the sale.</em>',
      meta:['Product Designer','Kivid · HealthTech · Fintech','Figma'],
      hook:'"Designing the checkout screen is the easy part. The hard part is making sure that the moment a client finishes paying in the app, the seller sees the exact same sale confirmed in their portal — whether the payment was PIX, card, points, or a physical card machine. It wasn\'t one screen. It was two systems telling the same story at the same time."',
      context:'<p>Passaporte Kivid is a subscription that grants access to a healthcare network at special rates, sold either to an individual or to a family plan with a policyholder and dependents. The product had two ends that needed to be designed together: the <strong>client app</strong>, where the family signs up and pays for the subscription, and the <strong>affiliate\'s web portal</strong>, where the seller manages sales, receives payments, and tracks commission.</p><p>Each end had its own payment complexity. In the app, the client could pay via PIX, card, points+card, or points+PIX. In the portal, the affiliate could sell through a payment link, PIX, or a physical card machine. The job was to make the sale work on both ends, without the two systems ever disagreeing about what was actually sold.</p>',
      diags:[
        {icon:'💳',title:'Four ways to pay, one experience',desc:'PIX, card, points+card, and points+PIX in the client app needed to feel like one flow, not four flows stitched together — each with its own summary, confirmation, and error state.'},
        {icon:'🔄',title:'Two screens, one truth',desc:'What the client saw as "paid" in the app had to match exactly what the affiliate saw as "sold" in the portal — no perceptible lag, no diverging states between the two ends of the system.'},
        {icon:'👨‍👩‍👧',title:'Family signup without feeling like paperwork',desc:'Adding each family member required name, birth date, CPF, and contact — too sensitive for a long, cold form, but too required to skip steps.'},
        {icon:'🧾',title:'Three receiving channels for the affiliate',desc:'The seller could receive payment via PIX, card, or a physical card machine — each channel with completely different timing and interface, but needing to land on the same kind of confirmation and receipt.'}
      ],
      kpis:[
        {icon:'🗺️',label:'Full coverage',val:'Client app + Affiliate portal',desc:'System designed on both ends of the same transaction, from family signup to sale confirmation'},
        {icon:'💳',label:'Unified payment methods',val:'4 in the app · 3 in the portal',desc:'PIX, card, points+card, and points+PIX on the client side; PIX, card, and card machine on the affiliate side'},
        {icon:'👏',label:'Celebration moment',val:'Success microinteraction',desc:'Confirmation state with a celebration animation, closing the flow with recognition instead of just a cold confirmation'},
        {icon:'🚀',label:'Live in production',val:'System shipped',desc:'Client app and affiliate portal published and in real use, not just a prototype'}
      ],
      role:'Product Designer responsible for designing both ends of the system — the client app (Passaporte subscription and payment) and the affiliate\'s web portal (sales, payment receiving, and commission) — working alongside other designer(s) on the Kivid team.',
      insight:'<p>The real challenge wasn\'t any single checkout screen. It was keeping two independent systems — the consumer app and the seller portal — telling exactly the same story about the same transaction. Every payment method in the app needed a recognizable equivalent in the portal: "paid" for the client had to become "sold" for the affiliate, at the same moment, with the same clarity. <strong>Designing both sides together</strong>, not in parallel, is what kept the system from becoming two disconnected products pretending to be one.</p>',
      objetivo:'Deliver a complete subscription system covering the client app and the affiliate portal, unifying multiple payment methods on both ends without fragmenting the experience or turning family signup into paperwork.',
      krs:[
        {txt:'Unify the visual logic of the 4 payment methods in the client app',meta:'Same summary/confirmation structure'},
        {txt:'Ensure the affiliate\'s 3 receiving channels follow the same confirmation pattern',meta:'PIX, card, card machine'},
        {txt:'Reduce the perceived paperwork feel of the family signup flow',meta:'Conversational flow, one field at a time'}
      ],
      sol:'<div class="ch-sol-cards"><div class="ch-sol-card"><div class="ch-sol-card-num">01</div><div class="ch-sol-card-title">Conversational family form</div><div class="ch-sol-card-desc">Each family member\'s name, birth date, CPF, and contact are collected one at a time, in chat bubbles, instead of a long form — reducing the paperwork feel without giving up field-level validation.</div></div><div class="ch-sol-card"><div class="ch-sol-card-num">02</div><div class="ch-sol-card-title">Unified payment layer</div><div class="ch-sol-card-desc">Summary, confirmation, and success states follow the same visual structure across the app\'s four payment methods and the portal\'s three receiving channels — the medium changes, the screen logic doesn\'t.</div></div><div class="ch-sol-card"><div class="ch-sol-card-num">03</div><div class="ch-sol-card-title">Affiliate portal with multiple channels</div><div class="ch-sol-card-desc">Payment link, PIX, and physical card machine designed as variations of the same confirmation pattern, with a sales dashboard (completed, in progress, canceled) always reflecting the sale\'s real state.</div></div><div class="ch-sol-card"><div class="ch-sol-card-num">04</div><div class="ch-sol-card-title">Receipt and celebration confirmation</div><div class="ch-sol-card-desc">The success state closes the flow with a celebration microinteraction and generates a formal receipt — balancing the emotional side of the purchase with the client\'s need for proof of payment.</div></div></div><div class="ch-sol-aside"><div class="ch-sol-aside-label">The most negotiated decision</div><p>Compliance wanted a traditional form to collect each family member\'s data — more predictable to audit. The product team wanted a conversational experience, lighter for someone registering three or four people in a row. The fix wasn\'t picking a side: the flow kept the chat-bubble interface, but each field was validated and stored exactly as a formal form would validate it — the visual layer changed, the data structure behind it didn\'t.</p></div>',
      resultsLabel:'Results',
      results:[
        ['✓','Complete system shipped to production, covering the client app and the affiliate portal.','ti-rocket','check','delivered'],
        ['4 → 1','Hypothesis: unifying the visual structure of the 4 payment methods reduces maintenance rework and inconsistency between them.','ti-credit-card','hyp','hypothesis'],
        ['3 channels','Affiliate receives via PIX, card, and card machine following the same confirmation and receipt pattern.','ti-devices','check','delivered'],
        ['↓','Hypothesis: the conversational family signup flow reduces abandonment compared to a traditional form.','ti-users','hyp','hypothesis']
      ]
    }
  }

};


function openCase(id,title,push){
  if(push === undefined) push = true;
  const c=CASES[id];
  if(!c){console.error('Case not found:',id);return;}
  // Merge EN translations if active
  const d = (currentLang === 'en' && c.en) ? Object.assign({}, c, c.en) : c;
  document.getElementById('case-ttl-nav').textContent=title;

  const slot=document.getElementById('case-slot');
  slot.innerHTML='';

  const ch=document.createElement('div');
  ch.className='ch';
  ch.id='ch-'+id;
  ch.style.setProperty('--case-color',c.color);

  // Header
  const ct=document.createElement('div');
  ct.className='ch-ct';
  ct.innerHTML=(d.autoral ? '<div class="ch-autoral-badge" data-pt="Case Autoral" data-en="Personal Project">Case Autoral</div>' : '')
    +(c.model ? '<div class="ch-model-badges">'+c.model.map(function(m){return '<span class="ch-model-badge">'+m+'</span>';}).join('')+'</div>' : '')
    +'<div class="ch-ey">'+d.ey+'</div>'
    +'<div class="ch-title">'+d.ttl+'</div>'
    +(d.platformBadge ? '<div class="ch-platform-badge">'+d.platformBadge+'</div>' : '');
  ch.appendChild(ct);

  // Hero image
  const imgArea=document.createElement('div');
  imgArea.className='ch-img-area';
  imgArea.style.background='#111';
  const heroImg=document.createElement('img');
  const heroImgSrc = c.caseHero || (id+'-case-hero.jpg');
  heroImg.src='img/'+heroImgSrc;
  heroImg.alt=title;
  heroImg.style.cssText='width:100%;height:auto;display:block;cursor:zoom-in;';
  heroImg.addEventListener('click', function(){ lbOpen(heroImg.src); });
  heroImg.onerror=function(){ this.style.display='none'; imgArea.innerHTML='<div class="ch-img-ph">'+heroImgSrc+'</div>'; };
  imgArea.appendChild(heroImg);
  ch.appendChild(imgArea);

  // Resultados em destaque — logo após o hero
  const resHero=document.createElement('div');
  resHero.className='ch-res-hero';
  resHero.innerHTML=
    '<div class="ch-res-hero-label">'+(d.resultsLabel || t("Results","Resultados"))+'</div>'
    +'<div class="ch-res-hero-grid">'+d.results.map(function(r){
      var badgeWord = r[4] || (r[3]==='up'?'↑ atingido':r[3]==='down'?'↓ reduzido':'✓ validado');
      var badge = r[2] ? '<div class="res-badge '+r[3]+'"><i class="ti '+r[2]+'" aria-hidden="true"></i> '+badgeWord+'</div>' : '';
      return '<div class="ch-res-hero-item">'+badge+'<div class="ch-res-hero-n">'+r[0]+'</div><div class="ch-res-hero-l">'+r[1]+'</div></div>';
    }).join('')+'</div>'
    +(c.medicao ? '<div class="ch-medicao ch-medicao-top"><div class="ch-medicao-label">'+t('How we measured','Como medimos')+'</div><p class="ch-medicao-texto">'+c.medicao.texto+'</p><div class="ch-medicao-tools">'+c.medicao.tools.map(function(tl){return '<span class="ch-medicao-tool">'+tl+'</span>';}).join('')+'</div></div>' : '');
  ch.appendChild(resHero);

  // Body
  const bd=document.createElement('div');
  bd.className='ch-bd';

  bd.innerHTML=
    '<div class="ch-hook">'+d.hook+'</div>'

    /* Protótipo em vídeo */
    +(c.prototipo ? (function(){
      var vids = Array.isArray(c.prototipo) ? c.prototipo : [c.prototipo];
      var html = '<div class="ch-video-wrap">';
      html += '<div class="ch-video-label" data-pt="Protótipo" data-en="Prototype">'+t('Prototype','Protótipo')+'</div>';
      html += '<div class="ch-video-inner">';
      vids.forEach(function(v){
        var parts = v.ratio ? v.ratio.split('/') : ['1','1'];
        var isLandscape = parseInt(parts[0]) > parseInt(parts[1]);
        html += '<div class="ch-video-item">';
        if(v.label) html += '<div class="ch-video-item-label">'+v.label+'</div>';
        html += '<video class="ch-video-el '+(isLandscape?'landscape':'portrait')+'" src="img/'+v.src+'" controls playsinline preload="metadata"></video>';
        html += '</div>';
      });
      html += '</div></div>';
      return html;
    })() : '')

    +'<div class="ch-role"><span class="ch-role-lbl" data-pt="Meu papel" data-en="My role">'+(currentLang==='en'?'My role':'Meu papel')+'</span><span class="ch-role-txt">'+d.role+'</span></div>'

    /* Organização do fluxo (Figma) */
    +(c.orgImg ? '<div class="ch-func-img"><img src="img/'+c.orgImg+'" alt="Organização do fluxo" style="width:100%;display:block;cursor:zoom-in;" onclick="lbOpen(this.src)"></div>' : '')

    /* O Problema */
    +'<div class="ch-highlight"><div class="ch-highlight-label" data-split>'+t("The Problem","O Problema")+'</div>'+d.context+'</div>'

    /* Persona (checkout) */
    +(c.personaImg ? '<div class="ch-func-img"><img src="img/'+c.personaImg+'" alt="Persona" style="width:100%;display:block;cursor:zoom-in;" onclick="lbOpen(this.src)"></div>' : '')

    /* Grid 2x2 telas antigas (checkout) */
    +(c.antes ? '<h3>'+t("Old screens","Telas antigas")+'</h3><div class="ch-comp-grid">'+c.antes.map(function(img){
      return '<div class="ch-comp-item"><img src="img/'+img+'" alt="antes" style="width:100%;height:100%;object-fit:contain;display:block;cursor:zoom-in;" onclick="lbOpen(this.src)"></div>';
    }).join('')+'</div>' : '')

    /* Wellhub: carrossel de problema */
    +(c.carousel ? renderCarousel2(c.carousel, [], id+'-carousel') : '')

    /* Credenciados: funcionalidades wide */
    +(c.funcImg ? '<div class="ch-func-img"><img src="img/'+c.funcImg+'" alt="func" style="width:100%;display:block;cursor:zoom-in;" onclick="lbOpen(this.src)"></div>' : '')

    /* KPIs & OKRs */
    +'<div class="ch-highlight"><div class="ch-highlight-label" data-split>KPIs &amp; OKRs</div>'
      +'<div class="ch-okr-block">'
        +'<div class="ch-okr-head"><div class="ch-okr-head-icon">&#9678;</div><div><span class="ch-okr-head-label">'+t("Objective","Objetivo")+'</span><div class="ch-okr-head-obj">'+d.objetivo+'</div></div></div>'
        +'<div class="ch-okr-trunk"></div>'
        +'<div class="ch-kr-branch"><div class="ch-kr-branch-l"></div><div class="ch-kr-branch-r"></div></div>'
        +'<div class="ch-kr-dots"><div class="ch-kr-dot"></div><div class="ch-kr-dot"></div><div class="ch-kr-dot"></div></div>'
        +'<div class="ch-kr-list">'+d.krs.map(function(kr,i){return '<div class="ch-kr"><div class="ch-kr-num">KR'+(i+1)+'</div><div class="ch-kr-txt">'+kr.txt+'</div><div class="ch-kr-badge">'+kr.meta+'</div></div>';}).join('')+'</div>'
        +'<div class="ch-kpi-drops"><div class="ch-kpi-drop"></div><div class="ch-kpi-drop"></div><div class="ch-kpi-drop"></div></div>'
        +'<div class="ch-kpi-grid'+(d.kpis.length===4?' ch-kpi-grid-4':'')+'">'+d.kpis.map(function(k){return '<div class="ch-kpi"><div class="ch-kpi-label">'+k.label+'</div><div class="ch-kpi-val">'+k.val+'</div><div class="ch-kpi-desc">'+k.desc+'</div></div>';}).join('')+'</div>'
      +'</div>'
    +'</div>'

    /* Processo */
    +'<div class="ch-func-img"><img src="img/'+(c.processoImg || (id+'-processo.jpg'))+'" alt="proc" style="width:100%;display:block;cursor:zoom-in;" onclick="lbOpen(this.src)"></div>'

    /* Como pensei a solução */
    +'<div class="ch-highlight"><div class="ch-highlight-label" data-split>'+t("How I approached the solution","Como pensei a solução")+'</div>'+d.insight+d.sol
    +(c.wireframes ? '<div class="ch-func-img"><img src="img/'+c.wireframes+'" alt="wireframes" style="width:100%;display:block;cursor:zoom-in;" onclick="lbOpen(this.src)"></div>' : '')
    +'</div>'

    /* Solução desktop + mobile em coluna (checkout) */
    +(c.solucaoImgs
      ? '<h3>'+t("New screens","Telas novas")+'</h3>'+c.solucaoImgs.map(function(img){
          return '<div class="ch-func-img"><img src="img/'+img+'" alt="sol" style="width:100%;display:block;cursor:zoom-in;" onclick="lbOpen(this.src)"></div>';
        }).join('')
      : ''
    )

    /* Antes × Depois — imagem única */
    +(c.antesDepois ? '<div class="ch-func-img"><img src="img/'+c.antesDepois+'" alt="Antes e Depois" style="width:100%;display:block;cursor:zoom-in;" onclick="lbOpen(this.src)" loading="lazy"></div>' : '')

    /* Carrossel — telas */
    +(c.telas ? '<h3>'+t("Screens","Telas")+'</h3>'+renderCarousel2(c.telas, c.telasLabels || [], id) : '')

    /* Wellhub: comparativo 2x2 */
    +(c.comparativo
      ? '<div class="ch-compare-label">'+t("Before <span>&#215;</span> After","Antes <span>&#215;</span> Depois")+'</div>'
        +'<div class="ch-comp-grid">'+c.comparativo.map(function(img){
          return '<div class="ch-comp-item"><img src="img/'+img+'" alt="comp" style="width:100%;height:100%;object-fit:cover;display:block;cursor:zoom-in;" onclick="lbOpen(this.src)"></div>';
        }).join('')+'</div>'
      : ''
    )

    /* Mockup mobile — imagem final */
    +(c.mobileImg ? '<div class="ch-func-img" style="margin-top:2rem;"><img src="img/'+c.mobileImg+'" alt="mockup mobile" style="width:100%;display:block;cursor:zoom-in;" onclick="lbOpen(this.src)"></div>' : '')
  ch.appendChild(bd);
  slot.appendChild(ch);

  document.getElementById('page-home').classList.remove('active');
  document.getElementById('page-case').classList.add('active');
  window.scrollTo({top:0,behavior:'instant'});
  setTimeout(animateCaseEntrance,50);
  setTimeout(initCompSliders,100);
  setTimeout(function(){ if(c.telas) initCarousel2(id); if(c.carousel) initCarousel2(id+'-carousel'); },150);
  setTimeout(function(){ initCurtainReveal(ch); initLetterReveal(ch); },150);

  if(push){
    history.pushState({ page: 'case', id: id, title: title }, '', '#case-' + id);
    _navCount++;
  }
}


function closeCase(){
  if(_navCount > 0){
    history.back();
    _navCount--;
  } else {
    goToHome();
  }
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
  /* Hero image — entra com scale + fade */
  var imgArea = document.querySelector('.ch-img-area');
  if(imgArea){
    imgArea.style.opacity='0';
    imgArea.style.transform='translateY(32px) scale(0.97)';
    imgArea.style.transition='opacity .9s var(--ease), transform .9s var(--ease)';
    requestAnimationFrame(function(){ requestAnimationFrame(function(){
      imgArea.style.opacity='1'; imgArea.style.transform='translateY(0) scale(1)';
    }); });
  }
  /* Título e eyebrow — stagger */
  var ctEls = document.querySelectorAll('.ch-ct > *');
  ctEls.forEach(function(el,i){
    el.style.opacity='0';
    el.style.transform='translateY(22px)';
    el.style.transition='opacity .6s var(--ease) '+(0.18+i*.09)+'s, transform .6s var(--ease) '+(0.18+i*.09)+'s';
    requestAnimationFrame(function(){ requestAnimationFrame(function(){
      el.style.opacity='1'; el.style.transform='translateY(0)';
    }); });
  });
  /* Hook — entra após o título */
  var hook = document.querySelector('.ch-hook');
  if(hook){
    hook.style.opacity='0';
    hook.style.transform='translateY(20px)';
    hook.style.transition='opacity .65s var(--ease) .45s, transform .65s var(--ease) .45s';
    requestAnimationFrame(function(){ requestAnimationFrame(function(){
      hook.style.opacity='1'; hook.style.transform='translateY(0)';
    }); });
  }
  /* Resultados em destaque — entra logo após a hero image */
  var resHero = document.querySelector('.ch-res-hero');
  if(resHero){
    resHero.style.opacity='0';
    resHero.style.transform='translateY(24px) scale(0.98)';
    resHero.style.transition='opacity .8s var(--ease) .32s, transform .8s var(--ease) .32s';
    requestAnimationFrame(function(){ requestAnimationFrame(function(){
      resHero.style.opacity='1'; resHero.style.transform='translateY(0) scale(1)';
    }); });
  }
  /* Scroll reveal para o restante */
  setTimeout(initCaseScrollReveal, 600);
}

function initCaseScrollReveal(){
  var ch = document.querySelector('.ch');
  if(!ch) return;
  var sel = [
    '.ch-video-wrap','.ch-role','.ch-highlight','.ch-kpi-grid',
    '.ch-diag-grid','.ch-res-grid','.ch-medicao','.cf2-wrap',
    '.ch-func-img','.ch-antes-grid','.ch-slider-wrap','.ch-comp-sidebyside',
    '.ch-sol-cards','.ch-sol-aside','.ch-autoral-badge',
    '.ch-telas-list','.ch-bd > h3','.ch-bd > p'
  ].join(',');
  var obs = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  },{threshold:0.07, rootMargin:'0px 0px -40px 0px'});

  ch.querySelectorAll(sel).forEach(function(el){
    if(el.classList.contains('ch-hook')) return; /* já animado na entrada */
    var rect = el.getBoundingClientRect();
    if(rect.top > window.innerHeight - 40){
      el.classList.add('ch-rev');
      obs.observe(el);
    }
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

/* ── Coverflow ── */
function renderCarousel2(images, labels, id){
  var slides = images.map(function(img, i){
    var num = ('0'+(i+1)).slice(-2);
    var name = labels[i] || '';
    return '<div class="cf2-slide" data-i="'+i+'" data-img="img/'+img+'">'
      +'<img src="img/'+img+'" alt="Tela '+num+'" loading="lazy">'
      +(name ? '<div class="cf2-slide-label"><span class="cf2-slide-num">'+num+'</span><span class="cf2-slide-name">'+name+'</span></div>' : '')
    +'</div>';
  }).join('');
  var arrows = images.length > 1
    ? '<button class="cf2-arrow cf2-arrow-prev" aria-label="Anterior">&#8249;</button><button class="cf2-arrow cf2-arrow-next" aria-label="Próxima">&#8250;</button>'
    : '';
  return '<div class="cf2-wrap" id="cf2-wrap-'+id+'">'
    +'<div class="cf2-track">'+slides+'</div>'
    +arrows
  +'</div>';
}

function initCarousel2(id){
  var wrap = document.getElementById('cf2-wrap-'+id);
  if(!wrap) return;
  var track = wrap.querySelector('.cf2-track');
  var slides = Array.from(track.querySelectorAll('.cf2-slide'));
  if(!slides.length) return;
  var images = slides.map(function(s){ return s.dataset.img; });

  var prevBtn = wrap.querySelector('.cf2-arrow-prev');
  var nextBtn = wrap.querySelector('.cf2-arrow-next');

  function slideStep(){
    return (slides[0].offsetWidth + 20); // largura do slide + gap
  }
  function scrollToIndex(i){
    var clamped = Math.max(0, Math.min(slides.length - 1, i));
    track.scrollTo({ left: slides[clamped].offsetLeft - (track.offsetWidth - slides[clamped].offsetWidth) / 2, behavior:'smooth' });
  }
  function currentIndex(){
    var center = track.scrollLeft + track.offsetWidth / 2;
    var best = 0, bestDist = Infinity;
    slides.forEach(function(s, i){
      var sCenter = s.offsetLeft + s.offsetWidth / 2;
      var dist = Math.abs(sCenter - center);
      if(dist < bestDist){ bestDist = dist; best = i; }
    });
    return best;
  }

  if(prevBtn) prevBtn.addEventListener('click', function(){ scrollToIndex(currentIndex() - 1); });
  if(nextBtn) nextBtn.addEventListener('click', function(){ scrollToIndex(currentIndex() + 1); });

  /* Clique abre lightbox em modo galeria (mantém navegação) */
  var isDragging = false, dragMoved = false;
  slides.forEach(function(slide, i){
    slide.addEventListener('click', function(){
      if(!dragMoved) lbOpenGallery(images, i);
    });
  });

  /* Arrastar com mouse (desktop) */
  var dragStartX = 0, scrollStart = 0, pointerDown = false;
  track.addEventListener('mousedown', function(e){
    pointerDown = true; dragMoved = false;
    dragStartX = e.clientX;
    scrollStart = track.scrollLeft;
    track.classList.add('dragging');
  });
  window.addEventListener('mousemove', function(e){
    if(!pointerDown) return;
    var dx = e.clientX - dragStartX;
    if(Math.abs(dx) > 5) dragMoved = true;
    track.scrollLeft = scrollStart - dx;
  });
  window.addEventListener('mouseup', function(){
    if(!pointerDown) return;
    pointerDown = false;
    track.classList.remove('dragging');
    setTimeout(function(){ dragMoved = false; }, 50);
  });

  window.addEventListener('resize', function(){ /* mantém posição relativa, sem reset forçado */ });
}

/* ── Before / After Slider ── */
function initCompSliders(){
  document.querySelectorAll('.ch-comp-slider').forEach(function(slider){
    var inner=slider.querySelector('.ch-comp-slider-inner');
    var after=slider.querySelector('.ch-comp-slider-after');
    var handle=slider.querySelector('.ch-comp-slider-handle');
    var isDragging=false;

    function setPos(clientX){
      var rect=inner.getBoundingClientRect();
      var pct=Math.max(2,Math.min(98,((clientX-rect.left)/rect.width)*100));
      after.style.clipPath='inset(0 '+(100-pct)+'% 0 0)';
      handle.style.left=pct+'%';
    }

    slider.addEventListener('mousedown',function(e){isDragging=true;setPos(e.clientX);e.preventDefault();});
    window.addEventListener('mousemove',function(e){if(isDragging)setPos(e.clientX);});
    window.addEventListener('mouseup',function(){isDragging=false;});
    slider.addEventListener('touchstart',function(e){isDragging=true;setPos(e.touches[0].clientX);},{passive:true});
    window.addEventListener('touchmove',function(e){if(isDragging)setPos(e.touches[0].clientX);},{passive:true});
    window.addEventListener('touchend',function(){isDragging=false;});
  });
}

/* ── Loading screen ── */
(function(){
  var loader = document.getElementById('loader');
  if(!loader) return;
  window.addEventListener('load', function(){
    setTimeout(function(){
      loader.classList.add('done');
      setTimeout(function(){ loader.remove(); }, 750);
    }, 1500);
  });
})();

/* ── Grain overlay ── */
(function(){
  var g = document.createElement('div');
  g.className = 'grain';
  document.body.appendChild(g);
})();

/* ── Custom cursor (desktop only) ── */
(function(){
  if(!window.matchMedia('(hover:hover)').matches) return;
  var dot = document.createElement('div');
  dot.className = 'cursor-dot';
  var ring = document.createElement('div');
  ring.className = 'cursor-ring';
  document.body.appendChild(dot);
  document.body.appendChild(ring);

  var mx = window.innerWidth/2, my = window.innerHeight/2;
  var rx = mx, ry = my;

  document.addEventListener('mousemove', function(e){
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx+'px';
    dot.style.top  = my+'px';
    document.body.classList.remove('cursor-hidden');
  });

  (function loop(){
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx+'px';
    ring.style.top  = ry+'px';
    requestAnimationFrame(loop);
  })();

  document.addEventListener('mousedown', function(){ ring.classList.add('clicking'); });
  document.addEventListener('mouseup',   function(){ ring.classList.remove('clicking'); });
  document.addEventListener('mouseleave',function(){ document.body.classList.add('cursor-hidden'); });
  document.addEventListener('mouseenter',function(){ document.body.classList.remove('cursor-hidden'); });

  var hoverSel = 'a,button,.pc,.cf2-slide,.cf2-arrow,.nav-sobre,.nav-ham,[role="button"],.lb-close';
  document.addEventListener('mouseover', function(e){
    if(e.target.closest(hoverSel)) ring.classList.add('hover');
  });
  document.addEventListener('mouseout', function(e){
    if(e.target.closest(hoverSel)) ring.classList.remove('hover');
  });
})();

/* ── Number counter animation ── */
(function(){
  function animateStat(el){
    var inner = el.innerHTML;
    var num = parseInt(el.textContent);
    if(isNaN(num)) return;
    var suffix = inner.slice(String(num).length);
    var duration = 1400;
    var start = null;
    function step(ts){
      if(!start) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var ease = 1 - Math.pow(1 - p, 3);
      el.innerHTML = Math.round(num * ease) + suffix;
      if(p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var obs = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        obs.unobserve(entry.target);
        animateStat(entry.target);
      }
    });
  }, {threshold:0.6});
  document.querySelectorAll('.sb-stat-n').forEach(function(el){
    obs.observe(el);
  });
})();

/* ── Magnetic nos botões de nav ── */
(function(){
  if(!window.matchMedia('(hover:hover)').matches) return;
  var STRENGTH = 0.35;
  function initMagnetic(){
    document.querySelectorAll('.cf2-arrow,.nav-ham,.nav-sobre').forEach(function(el){
      el.addEventListener('mousemove', function(e){
        var r = el.getBoundingClientRect();
        var dx = (e.clientX - (r.left + r.width/2)) * STRENGTH;
        var dy = (e.clientY - (r.top  + r.height/2)) * STRENGTH;
        el.style.transform = 'translate('+dx+'px,'+dy+'px)';
        el.style.transition = 'transform .1s';
      });
      el.addEventListener('mouseleave', function(){
        el.style.transform = '';
        el.style.transition = 'transform .5s cubic-bezier(.16,1,.3,1)';
      });
    });
  }
  initMagnetic();
})();

/* ── Efeitos estilo Webflow: split-letras, skew no scroll, cortina ── */

/* 1. Texto letra por letra ao entrar na tela */
function initLetterReveal(root){
  var scope = root || document;
  var targets = scope.querySelectorAll('[data-split]:not([data-split-done])');
  targets.forEach(function(el){
    el.setAttribute('data-split-done','1');
    var text = el.textContent;
    el.textContent = '';
    var frag = document.createDocumentFragment();
    text.split('').forEach(function(ch, i){
      var span = document.createElement('span');
      span.className = 'split-letter';
      span.style.transitionDelay = (i * 22) + 'ms';
      span.textContent = ch === ' ' ? '\u00A0' : ch;
      frag.appendChild(span);
    });
    el.appendChild(frag);
    el.classList.add('split-ready');
  });
  if(!targets.length) return;
  var obs = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        entry.target.classList.add('split-in');
        obs.unobserve(entry.target);
      }
    });
  }, {threshold:.4});
  targets.forEach(function(el){ obs.observe(el); });
}
document.addEventListener('DOMContentLoaded', function(){ initLetterReveal(); });
if(document.readyState !== 'loading') initLetterReveal();

/* 3. Reveal em "cortina" — painel desliza revelando a imagem por trás */
function initCurtainReveal(root){
  var scope = root || document;
  var wraps = scope.querySelectorAll('.ch-func-img:not([data-curtain-done]), .ch-img-area:not([data-curtain-done])');
  wraps.forEach(function(wrap){
    wrap.setAttribute('data-curtain-done','1');
    var curtain = document.createElement('div');
    curtain.className = 'curtain-panel';
    wrap.style.position = wrap.style.position || 'relative';
    wrap.appendChild(curtain);
    var obs = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          setTimeout(function(){ curtain.classList.add('curtain-open'); }, 120);
          obs.unobserve(entry.target);
        }
      });
    }, {threshold:.2});
    obs.observe(wrap);
  });
}

/* ── Parallax nos cards da home ── */
(function(){
  var cardImgs = document.querySelectorAll('.pc-img img');
  if(!cardImgs.length) return;
  var ticking = false;
  function updateParallax(){
    cardImgs.forEach(function(img){
      var card = img.closest('.pc');
      var rect = card.getBoundingClientRect();
      var vh = window.innerHeight;
      if(rect.bottom < 0 || rect.top > vh) return; /* fora da tela, não calcula */
      var progress = (rect.top - vh) / (-rect.height - vh) - 0.5; /* -0.5..0.5 aprox */
      var shift = Math.max(-14, Math.min(14, progress * 28));
      img.style.setProperty('--pc-parallax', shift.toFixed(1)+'px');
    });
    ticking = false;
  }
  window.addEventListener('scroll', function(){
    if(!ticking){ window.requestAnimationFrame(updateParallax); ticking = true; }
  }, {passive:true});
  updateParallax();
})();

/* ── Parallax no hero ── */
(function(){
  var heroType = document.querySelector('.hero-type-wrap');
  var heroSub  = document.querySelector('.hero-sub');
  var heroTag  = document.querySelector('.hero-tagline');
  if(!heroType) return;
  window.addEventListener('scroll', function(){
    var s = window.scrollY;
    if(heroType) heroType.style.transform = 'translateY('+s*.08+'px)';
    if(heroSub)  heroSub.style.transform  = 'translateY('+s*.12+'px)';
    if(heroTag)  heroTag.style.transform  = 'translateY('+s*.15+'px)';
  }, {passive:true});
})();

/* ── Shimmer no nome após typing ── */
(function(){
  var line1 = document.getElementById('hero-line1');
  if(!line1) return;
  var obs = new MutationObserver(function(){
    if(line1.textContent.length > 8){
      setTimeout(function(){
        line1.classList.add('hero-shimmer');
        obs.disconnect();
      }, 600);
    }
  });
  obs.observe(line1, {childList:true, characterData:true, subtree:true});
})();

/* ── ROUTER INITIALIZATION ── */
(function(){
  function initRouter(){
    // Handle initial page load hash
    var hash = window.location.hash;
    if(hash === '#sobre'){
      history.replaceState({ page: 'sobre' }, '', '#sobre');
      goToSobre(false);
    } else if(hash.startsWith('#case-')){
      var id = hash.replace('#case-', '');
      var title = '';
      if(CASES[id]){
        var rawTtl = CASES[id].ttl || '';
        title = rawTtl.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
      }
      history.replaceState({ page: 'case', id: id, title: title }, '', '#case-' + id);
      openCase(id, title, false);
    } else {
      history.replaceState({ page: 'home' }, '', window.location.pathname + window.location.search);
      goToHome(false);
    }

    // Popstate listener
    window.addEventListener('popstate', function(e){
      if(e.state){
        if(e.state.page === 'home'){
          goToHome(false);
        } else if(e.state.page === 'sobre'){
          goToSobre(false);
        } else if(e.state.page === 'case'){
          openCase(e.state.id, e.state.title, false);
        }
      } else {
        // Fallback
        var h = window.location.hash;
        if(h === '#sobre'){
          goToSobre(false);
        } else if(h.startsWith('#case-')){
          var cid = h.replace('#case-', '');
          var cttl = '';
          if(CASES[cid]) cttl = (CASES[cid].ttl || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
          openCase(cid, cttl, false);
        } else {
          goToHome(false);
        }
      }
    });
  }
  
  // Wait a split second to make sure other load bindings are registered
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', initRouter);
  } else {
    setTimeout(initRouter, 50);
  }
})();

