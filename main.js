
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
    context:'<p>Como usuário frequente e designer, vi na experiência de check-in uma oportunidade real de criar algo emocionalmente envolvente. O redesign nasceu de uma frustração genuína: o aplicativo não valorizava o esforço que levou o usuário até ali.</p>     <p>Aplicativos de bem-estar vivem de <strong>recorrência</strong>. Usuários que criam hábito retornam. Usuários que não sentem progresso somem. O check-in era a maior oportunidade perdida de reforçar esse hábito.</p>',
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
    sol:'<p>O reframing estratégico: <strong>de botão para ritual. De função para celebração. De ação neutra para microvitória reconhecida.</strong></p>     <p>Benchmark com Duolingo, Apple Fitness, TotalPass e Strava revelou o padrão comum: todos celebram o momento presente e mostram onde o usuário chegou. A gamificação leve, conquistas, streaks, progresso visual, reforça o comportamento sem virar jogo.</p>     <p>Criamos estados diferenciados: primeiro check-in, marcos de 10/50/100 check-ins, sequências semanais. Cada estado tem feedback visual e textual próprio, tornando cada treino único.</p>',
    results:[['340+','Check-ins reais como usuário, validação autêntica do problema'],['✓','Feedback positivo nos testes com usuários reais do Wellhub'],['↑','Engajamento percebido pós check-in nos testes de usabilidade'],['✓','Senso de progresso e personalização validados em entrevistas']]
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
    context:'<p>O Kivid havia construído uma rede de credenciados robusta, mas não havia pensado em montar uma <strong>experiência</strong> em volta desses dados. A lista existia. As informações existiam. Estavam espalhadas, incompletas ou simplesmente ausentes na interface.</p>     <p>O impacto era direto: usuários saíam do app para buscar no Google, a taxa de agendamentos originados dentro do app era baixa e os tickets de suporte sobre informações básicas de credenciados eram altos, custo operacional direto para o negócio.</p>',
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
    sol:'<p>Uma página de perfil completa: o equivalente digital do cartão de visita profissional + agenda + mapa, tudo junto, sem sair do app.</p>     <p>Nome, especialidade, avaliação por estrelas, endereço com mapa integrado, telefone direto, horários de atendimento por dia da semana, convênios aceitos e fotos do consultório. <strong>Decisão tomada em segundos, sem fricção.</strong></p>     <p>Principal descoberta nos testes: o botão "Ligar" precisava estar visível sem scroll. Qualquer posição abaixo da dobra aumentava o abandono. Esse ajuste simples foi o de maior impacto.</p>',
    results:[['✓','"Finalmente tudo no lugar certo", feedback recorrente nos testes'],['↑','Facilidade percebida para agendar consultas e exames'],['↑','Taxa de uso da funcionalidade de busca no app'],['↓','Tempo médio para localizar dados essenciais de um profissional']]
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
    context:'<p>A persona central do Kivid é Adriana Santos, 56 anos, professora, classe C/D, casada, dois filhos. Quando ela entra numa tela de checkout, precisa de três coisas: <strong>clareza, segurança e velocidade</strong>. Qualquer dúvida vira abandono.</p>     <p>O produto existente pedia informações excessivas logo no início, era fragmentado em múltiplas etapas sem progresso visível e não deixava claro o valor total até o final, exatamente o oposto do que Adriana precisava.</p>',
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
    sol:'<p>Unifiquei todas as etapas em <strong>uma única página</strong>. Preenchimento automático via CPF: o usuário digitava um campo e nome, endereço e dados básicos eram preenchidos automaticamente. Eliminamos tudo que era opcional ou desnecessário para a conclusão.</p>     <p>O resumo do pedido ficou sempre visível, dinâmico e transparente, o valor total aparece desde o primeiro momento, atualizando em tempo real conforme o usuário seleciona opções. Sem surpresas no final. Sem perguntas sem resposta.</p>     <p>Adicionamos indicadores de segurança (cadeado, selos) nas posições exatas onde os heatmaps mostravam maior hesitação. Pequeno detalhe, impacto mensurável na confiança.</p>',
    results:[['15%','Aumento na taxa de conversão, KR1 atingido'],['20%','Redução no abandono de carrinho, KR2 atingido'],['↓','Tempo médio de conclusão da compra'],['✓','"Muito mais simples e rápido", feedback recorrente']]
  },
  nps:{
    color:'#854F0B',bg:'#111',
    wireframes:'nps-wireframes.jpg',
    telas:['nps-tela-1.jpg','nps-tela-2.jpg','nps-tela-3.jpg','nps-tela-4.jpg','nps-tela-5.jpg','nps-tela-6.jpg','nps-tela-7.jpg'],
    ey:'NPS · Data · HealthTech',
    ttl:'O time decidia<br>sem ouvir <em>ninguém.</em>',
    meta:['Product Designer','2 semanas','Figma'],
    hook:'"O Kivid tinha uma rede ativa de atendimentos. Decisões sobre o produto eram tomadas com base em feeling, suposições e reclamações espontâneas no suporte. Não havia linha de base. Não havia como medir evolução. Não havia cultura de feedback."',
    context:'<p>Você não consegue melhorar o que não mede. E você não consegue medir o que não pergunta. A ausência de dados de satisfação estruturados criava um ciclo vicioso: sem evidência, o time priorizava pelo que gritava mais alto, geralmente reclamações isoladas, não padrões reais.</p>     <p>O objetivo não era apenas criar uma tela de avaliação. Era <strong>criar uma cultura de escuta contínua</strong> que alimentasse decisões de produto com evidência real dos pacientes.</p>',
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
      {txt:'Coletar NPS de pelo menos 30% dos atendimentos mensais',meta:'30%'},
      {txt:'Gerar ao menos 3 insights acionáveis por mês',meta:'3/mês'},
      {txt:'Estabelecer linha de base de satisfação trimestral',meta:'Q1 2024'}
    ],
    sol:'<p>O fluxo precisava ser <strong>invisível na fricção mas significativo no resultado</strong>. Emojis para facilitar a expressão emocional sem exigir escrita, cores suaves que não criam ansiedade, textos curtíssimos que respeitam o contexto pós-consulta médica.</p>     <p>Cada elemento foi pensado para reduzir o esforço cognitivo de quem acabou de passar por um atendimento médico, momento em que a pessoa pode estar ansiosa, cansada ou aliviada. O campo qualitativo aberto aparece apenas após a avaliação numérica, como convite, nunca como obrigação.</p>     <p>O impacto mais relevante foi comportamental: o time de produto passou a ter dados para discutir prioridades. O NPS virou pauta de reunião semanal. Os feedbacks qualitativos passaram a embasar decisões sobre treinamento dos credenciados.</p>',
    results:[['✓','Canal estruturado criado, linha de base de satisfação estabelecida'],['↑','Feedbacks qualitativos chegando ao time toda semana'],['✓','Dados NPS acionáveis integrando o processo de priorização'],['↑','Pacientes sentindo que sua voz importava no produto']]
  }
};


function openCase(id,title){
  const c=CASES[id];
  if(!c){console.error('Case not found:',id);return;}
  document.getElementById('case-ttl-nav').textContent=title;

  const slot=document.getElementById('case-slot');
  slot.innerHTML='';

  const ch=document.createElement('div');
  ch.className='ch';
  ch.style.setProperty('--case-color',c.color);

  // Header
  const ct=document.createElement('div');
  ct.className='ch-ct';
  ct.innerHTML='<div class="ch-ey">'+c.ey+'</div>'
    +'<div class="ch-title">'+c.ttl+'</div>'
    +'<div class="ch-meta-row">'+c.meta.map(function(m){return'<span>'+m+'</span>';}).join('')+'</div>';
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
    '<div class="ch-hook">'+c.hook+'</div>'
    +'<div class="ch-role"><span class="ch-role-lbl">Meu papel</span><span class="ch-role-txt">'+c.role+'</span></div>'

    /* O Problema */
    +'<div class="ch-highlight"><div class="ch-highlight-label">O Problema</div>'+c.context+'</div>'

    /* Persona (checkout) */
    +(c.personaImg ? '<div class="ch-func-img"><img src="img/'+c.personaImg+'" alt="Persona" style="width:100%;display:block;cursor:zoom-in;" onclick="lbOpen(this.src)"></div>' : '')

    /* Grid 2x2 telas antigas (checkout) */
    +(c.antes ? '<h3>Telas antigas</h3><div class="ch-comp-grid">'+c.antes.map(function(img){
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
        +'<div class="ch-okr-head"><div class="ch-okr-head-icon">&#9678;</div><div><span class="ch-okr-head-label">Objetivo</span><div class="ch-okr-head-obj">'+c.objetivo+'</div></div></div>'
        +'<div class="ch-okr-trunk"></div>'
        +'<div class="ch-kr-branch"><div class="ch-kr-branch-l"></div><div class="ch-kr-branch-r"></div></div>'
        +'<div class="ch-kr-dots"><div class="ch-kr-dot"></div><div class="ch-kr-dot"></div><div class="ch-kr-dot"></div></div>'
        +'<div class="ch-kr-list">'+c.krs.map(function(kr,i){return '<div class="ch-kr"><div class="ch-kr-num">KR'+(i+1)+'</div><div class="ch-kr-txt">'+kr.txt+'</div><div class="ch-kr-badge">'+kr.meta+'</div></div>';}).join('')+'</div>'
        +'<div class="ch-kpi-drops"><div class="ch-kpi-drop"></div><div class="ch-kpi-drop"></div><div class="ch-kpi-drop"></div></div>'
        +'<div class="ch-kpi-grid">'+c.kpis.map(function(k){return '<div class="ch-kpi"><div class="ch-kpi-label">'+k.label+'</div><div class="ch-kpi-val">'+k.val+'</div><div class="ch-kpi-desc">'+k.desc+'</div></div>';}).join('')+'</div>'
      +'</div>'
    +'</div>'

    /* Processo */
    +'<div class="ch-func-img"><img src="img/'+id+'-processo.jpg" alt="proc" style="width:100%;display:block;cursor:zoom-in;" onclick="lbOpen(this.src)"></div>'

    /* Como pensei a solução */
    +'<div class="ch-highlight"><div class="ch-highlight-label">Como pensei a solução</div>'+c.insight+c.sol
    +(c.wireframes ? '<div class="ch-func-img"><img src="img/'+c.wireframes+'" alt="wireframes" style="width:100%;display:block;cursor:zoom-in;" onclick="lbOpen(this.src)"></div>' : '')
    +'</div>'

    /* Solução desktop + mobile em coluna (checkout) */
    +(c.solucaoImgs
      ? '<h3>Telas novas</h3>'+c.solucaoImgs.map(function(img){
          return '<div class="ch-func-img"><img src="img/'+img+'" alt="sol" style="width:100%;display:block;cursor:zoom-in;" onclick="lbOpen(this.src)"></div>';
        }).join('')
      : ''
    )

    /* Credenciados: carrossel telas */
    +(c.telas ? (function(){
      return '<h3>Telas</h3>'
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
      ? '<div class="ch-compare-label">Antes <span>&#215;</span> Depois</div>'
        +'<div class="ch-comp-grid">'+c.comparativo.map(function(img){
          return '<div class="ch-comp-item"><img src="img/'+img+'" alt="comp" style="width:100%;height:100%;object-fit:cover;display:block;cursor:zoom-in;" onclick="lbOpen(this.src)"></div>';
        }).join('')+'</div>'
      : ''
    )

    /* Resultados */
    +'<h3>Resultados</h3>'
    +'<div class="res-grid">'+c.results.map(function(r){
      return '<div class="res-item"><div class="res-n">'+r[0]+'</div><div class="res-l">'+r[1]+'</div></div>';
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
