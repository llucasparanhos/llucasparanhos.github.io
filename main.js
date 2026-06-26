
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
    autoral:true,
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
    antesDepois:'bomconsorcio-antes-depois.jpg',
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
  ct.innerHTML=(d.autoral ? '<div class="ch-autoral-badge" data-pt="Case Autoral" data-en="Personal Project">Case Autoral</div>' : '')
    +'<div class="ch-ey">'+d.ey+'</div>'
    +'<div class="ch-title">'+d.ttl+'</div>';
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
      var cfId = id+'-carousel';
      var dots = c.carousel.map(function(_,i){
        return '<div class="cf-dot-nav'+(i===0?' active':'')+'" data-cf-idx="'+i+'"></div>';
      }).join('');
      var cards = c.carousel.map(function(img,i){
        var cls = i===0?' active':i===1?' near':'';
        return '<div class="cf-card'+cls+'" data-cf-i="'+i+'" data-img="img/'+img+'">'
          +'<img src="img/'+img+'" alt="'+i+'" loading="lazy">'
        +'</div>';
      }).join('');
      return '<div class="cf-wrap" id="cf-wrap-'+cfId+'" data-card-w="250">'
        +'<div class="cf-track">'+cards+'</div>'
        +'<div class="cf-nav">'
          +'<button class="cf-btn cf-btn-prev">&#8249;</button>'
          +'<div class="cf-dots">'+dots+'</div>'
          +'<button class="cf-btn cf-btn-next">&#8250;</button>'
        +'</div>'
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

    /* Antes × Depois — imagem única */
    +(c.antesDepois ? '<div class="ch-func-img"><img src="img/'+c.antesDepois+'" alt="Antes e Depois" style="width:100%;display:block;cursor:zoom-in;" onclick="lbOpen(this.src)" loading="lazy"></div>' : '')

    /* Carrossel coverflow — telas */
    +(c.telas ? (function(){
      var labels = c.telasLabels || [];
      var cardW = c.cfCardW || 200;
      var dots = c.telas.map(function(_,i){
        return '<div class="cf-dot-nav'+(i===0?' active':'')+'" data-cf-idx="'+i+'"></div>';
      }).join('');
      var cards = c.telas.map(function(img,i){
        var num = ('0'+(i+1)).slice(-2);
        var name = labels[i] || '';
        var cls = i===0?' active':i===1?' near':'';
        return '<div class="cf-card'+cls+'" data-cf-i="'+i+'" data-img="img/'+img+'">'
          +'<img src="img/'+img+'" alt="Tela '+num+'" loading="lazy">'
          +(name ? '<div class="cf-card-label"><span class="cf-card-num">'+num+'</span><span class="cf-card-name">'+name+'</span></div>' : '')
        +'</div>';
      }).join('');
      return '<h3>'+t("Screens","Telas")+'</h3>'
        +'<div class="cf-wrap" id="cf-wrap-'+id+'" data-card-w="'+cardW+'">'
          +'<div class="cf-track">'+cards+'</div>'
          +'<div class="cf-nav">'
            +'<button class="cf-btn cf-btn-prev">&#8249;</button>'
            +'<div class="cf-dots">'+dots+'</div>'
            +'<button class="cf-btn cf-btn-next">&#8250;</button>'
          +'</div>'
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

    /* Como medimos */
    +(c.medicao ? (function(){
      return '<div class="ch-medicao">'
        +'<div class="ch-medicao-label">'+t('How we measured','Como medimos')+'</div>'
        +'<p class="ch-medicao-texto">'+c.medicao.texto+'</p>'
        +'<div class="ch-medicao-tools">'+c.medicao.tools.map(function(t){
          return '<span class="ch-medicao-tool">'+t+'</span>';
        }).join('')+'</div>'
      +'</div>';
    })() : '')

    /* Resultados */
    +'<h3>'+(d.resultsLabel || t("Results","Resultados"))+'</h3>'
    +'<div class="res-grid">'+d.results.map(function(r){
      var badgeWord = r[4] || (r[3]==='up'?'↑ atingido':r[3]==='down'?'↓ reduzido':'✓ validado');
      var badge = r[2] ? '<div class="res-badge '+r[3]+'"><i class="ti '+r[2]+'" aria-hidden="true"></i> '+badgeWord+'</div>' : '';
      return '<div class="res-item">'+badge+'<div class="res-n">'+r[0]+'</div><div class="res-l">'+r[1]+'</div></div>';
    }).join('')+'</div>'
  ch.appendChild(bd);
  slot.appendChild(ch);

  document.getElementById('page-home').classList.remove('active');
  document.getElementById('page-case').classList.add('active');
  window.scrollTo({top:0,behavior:'instant'});
  setTimeout(animateCaseEntrance,50);
  setTimeout(initCompSliders,100);
  setTimeout(function(){ initCoverflow(id); if(c.carousel) initCoverflow(id+'-carousel'); },150);
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

/* ── Coverflow ── */
function initCoverflow(id){
  var wrap = document.getElementById('cf-wrap-'+id);
  if(!wrap) return;
  var track = wrap.querySelector('.cf-track');
  var cards = Array.from(track.querySelectorAll('.cf-card'));
  var dots = Array.from(wrap.querySelectorAll('.cf-dot-nav'));
  var total = cards.length;
  var current = 0;
  var GAP = 16;
  var DRAG_THRESHOLD = 50;
  var dragStartX = null;
  var isDragging = false;

  function getCardW(){
    return parseInt(wrap.dataset.cardW) || (cards[0] ? cards[0].offsetWidth : 200);
  }

  function render(){
    var CARD_W = getCardW();
    var wrapW = wrap.offsetWidth;
    var centerX = wrapW / 2;
    cards.forEach(function(card, i){
      var dist = ((i - current + total) % total);
      if(dist > total / 2) dist -= total;
      var absD = Math.abs(dist);
      card.classList.remove('active','near');
      if(absD === 0) card.classList.add('active');
      else if(absD === 1) card.classList.add('near');
      var x = centerX + dist * (CARD_W + GAP) - CARD_W / 2;
      var scale = absD===0 ? 1.08 : absD===1 ? 0.92 : 0.82;
      var opacity = absD===0 ? 1 : absD===1 ? 0.65 : absD<=3 ? 0.35 : 0;
      card.style.left = x + 'px';
      card.style.transform = 'translateY(-50%) scale('+scale+')';
      card.style.opacity = opacity;
      card.style.zIndex = total - absD;
      card.style.pointerEvents = absD > 3 ? 'none' : 'auto';
    });
    dots.forEach(function(dot, i){
      dot.classList.toggle('active', i === current);
    });
  }

  function navigate(dir){
    current = ((current + dir + total) % total);
    render();
  }

  /* Click */
  cards.forEach(function(card, i){
    card.addEventListener('click', function(){
      if(!isDragging){
        if(i === current){ lbOpen(card.dataset.img); }
        else { current = i; render(); }
      }
    });
  });
  dots.forEach(function(dot, i){
    dot.addEventListener('click', function(){ current = i; render(); });
  });
  wrap.querySelector('.cf-btn-prev').addEventListener('click', function(){ navigate(-1); });
  wrap.querySelector('.cf-btn-next').addEventListener('click', function(){ navigate(1); });

  /* Touch swipe */
  wrap.addEventListener('touchstart', function(e){
    dragStartX = e.touches[0].clientX;
  }, {passive:true});
  wrap.addEventListener('touchend', function(e){
    if(dragStartX === null) return;
    var diff = dragStartX - e.changedTouches[0].clientX;
    if(Math.abs(diff) > DRAG_THRESHOLD) navigate(diff > 0 ? 1 : -1);
    dragStartX = null;
  }, {passive:true});

  /* Mouse drag */
  wrap.addEventListener('mousedown', function(e){
    dragStartX = e.clientX;
    isDragging = false;
    wrap.style.cursor = 'grabbing';
    e.preventDefault();
  });
  window.addEventListener('mousemove', function(e){
    if(dragStartX !== null && Math.abs(e.clientX - dragStartX) > 5) isDragging = true;
  });
  window.addEventListener('mouseup', function(e){
    if(dragStartX !== null){
      var diff = dragStartX - e.clientX;
      if(Math.abs(diff) > DRAG_THRESHOLD) navigate(diff > 0 ? 1 : -1);
      wrap.style.cursor = '';
      dragStartX = null;
      setTimeout(function(){ isDragging = false; }, 50);
    }
  });

  render();
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
