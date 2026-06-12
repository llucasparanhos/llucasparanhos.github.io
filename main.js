
/* ── SPLASH ── */
window.addEventListener('load',()=>{
  setTimeout(()=>document.getElementById('splash').classList.add('gone'),1900);
});

/* ── CANVAS HEIGHT ── */
function setH(){
  const c=document.getElementById('home-canvas');
  if(c)c.style.height=Math.round((window.innerHeight-52)*0.85)+'px';
}
setH();window.addEventListener('resize',setH);

/* ── CURSOR ── */
const cur=document.getElementById('cur');
const ring=document.getElementById('cur-ring');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{
  mx=e.clientX;my=e.clientY;
  cur.style.left=mx+'px';cur.style.top=my+'px';
});
function animRing(){
  rx+=(mx-rx)*.12;ry+=(my-ry)*.12;
  ring.style.left=rx+'px';ring.style.top=ry+'px';
  requestAnimationFrame(animRing);
}
animRing();
document.addEventListener('mouseleave',()=>{cur.style.opacity='0';ring.style.opacity='0'});
document.addEventListener('mouseenter',()=>{cur.style.opacity='1';ring.style.opacity='1'});

/* ── PARALLAX ── */
document.addEventListener('mousemove',e=>{
  const W=window.innerWidth,H=window.innerHeight;
  const px=(e.clientX/W-.5),py=(e.clientY/H-.5);
  const hps=document.querySelectorAll('.hp');
  const factors=[12,-8,6];
  hps.forEach((hp,i)=>{
    const f=factors[i]||8;
    const base=i===1?'rotate(-1.5deg)':i===2?'rotate(1.5deg)':'';
    hp.style.transform=`translate(${px*f}px,${py*f}px) ${base}`;
  });
  document.querySelectorAll('.ftag').forEach((t,i)=>{
    const f=[4,-3,5,-4,3][i]||4;
    t.style.transform=`translate(${px*f}px,${py*(f*.6)}px)`;
  });
});

/* ── SCROLL: nav blur + parallax vertical ── */
window.addEventListener('scroll',()=>{
  const sy=window.scrollY;
  /* fotos parallax vertical suave */
  document.querySelectorAll('.hp').forEach((hp,i)=>{
    const sp=[.2,-.15,.1][i]||.2;
    hp.style.marginTop=(sy*sp)+'px';
  });
});

/* ── HOVER nos cards: cursor grande ── */
document.querySelectorAll('.cc').forEach(c=>{
  c.addEventListener('mouseenter',()=>{cur.classList.add('big');ring.classList.add('big')});
  c.addEventListener('mouseleave',()=>{cur.classList.remove('big');ring.classList.remove('big')});
});

/* ── MOBILE MENU ── */
const mob=document.getElementById('mob-menu');
const ham=document.getElementById('nav-ham');
const close=document.getElementById('mob-close');
ham.addEventListener('click',()=>{mob.classList.add('open');ham.classList.add('open');document.body.style.overflow='hidden'});
close.addEventListener('click',()=>{mob.classList.remove('open');ham.classList.remove('open');document.body.style.overflow=''});
document.querySelectorAll('.mob-item').forEach(i=>i.addEventListener('click',()=>{mob.classList.remove('open');ham.classList.remove('open');document.body.style.overflow=''}));

/* ── ACCORDION sobre ── */
function toggleSobre(){
  const body=document.getElementById('sobre-body');
  const chevron=document.getElementById('sobre-chevron');
  const isOpen=body.classList.contains('open');
  body.classList.toggle('open');
  chevron.classList.toggle('open');
  if(!isOpen){
    // Re-observe reveal elements inside
    setTimeout(()=>{
      body.querySelectorAll('.reveal,.reveal-left,.reveal-scale,.stagger').forEach(el=>{
        if(!el.classList.contains('visible')) obs.observe(el);
      });
    },100);
  }
}
const allReveal = document.querySelectorAll('.reveal,.reveal-left,.reveal-scale,.reveal-fade,.stagger');
const obs = new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add('visible');
      // não remove — mantém visível após sair
    }
  });
},{threshold:.06,rootMargin:'0px 0px -40px 0px'});
allReveal.forEach(r=>obs.observe(r));

/* ── PARALLAX SUAVE NO SCROLL ── */
let ticking=false;
window.addEventListener('scroll',()=>{
  if(!ticking){
    requestAnimationFrame(()=>{
      const sy=window.scrollY;

      /* fotos da home — parallax vertical diferenciado */
      document.querySelectorAll('.hp').forEach((hp,i)=>{
        const speeds=[.08,-.05,.06];
        hp.style.transform=`translateY(${sy*speeds[i]}px)${i===1?' rotate(-1.5deg)':i===2?' rotate(1.5deg)':''}`;
      });

      /* quote da sobre — sobe levemente */
      const q=document.querySelector('.sobre-quote');
      if(q){const rect=q.getBoundingClientRect();if(rect.top<window.innerHeight)q.style.transform=`translateY(${(window.innerHeight-rect.top)*-.03}px)`}

      /* nav blur no scroll */
      const nav=document.getElementById('main-nav');
      if(nav){
        if(sy>10){nav.style.boxShadow='0 1px 0 rgba(17,17,17,.08)'}
        else{nav.style.boxShadow='none'}
      }

      ticking=false;
    });
    ticking=true;
  }
});

/* ── HOVER MAGNÉTICO nas tags ── */
document.querySelectorAll('.ftag').forEach(tag=>{
  tag.addEventListener('mousemove',e=>{
    const rect=tag.getBoundingClientRect();
    const x=(e.clientX-rect.left-rect.width/2)*.15;
    const y=(e.clientY-rect.top-rect.height/2)*.15;
    tag.style.transform=`translate(${x}px,${y}px)`;
  });
  tag.addEventListener('mouseleave',()=>{
    tag.style.transform='';
    tag.style.transition='transform .4s var(--ease)';
  });
});

/* ── HOVER MAGNÉTICO nos botões do footer ── */
document.querySelectorAll('.fbtn').forEach(btn=>{
  btn.addEventListener('mousemove',e=>{
    const rect=btn.getBoundingClientRect();
    const x=(e.clientX-rect.left-rect.width/2)*.08;
    const y=(e.clientY-rect.top-rect.height/2)*.08;
    btn.style.transform=`translate(${x}px,${y}px)`;
  });
  btn.addEventListener('mouseleave',()=>{
    btn.style.transform='translateY(0)';
  });
});

/* ── COUNTER animado nos resultados ── */
function animateCounter(el,target,suffix){
  const num=parseFloat(target.replace(/[^\d.]/g,''));
  if(isNaN(num))return;
  let start=null;const dur=1200;
  const step=ts=>{
    if(!start)start=ts;
    const p=Math.min((ts-start)/dur,1);
    const ease=1-Math.pow(1-p,3);
    const cur=Math.round(ease*num*10)/10;
    el.innerHTML=target.replace(/[\d.]+/,cur%1===0?cur:cur.toFixed(1));
    if(p<1)requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/* ── CASE page: anima elementos ao abrir ── */
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

/* ── CASES ── */
const CASES={
  wellhub:{
    color:'#0F6E56',bg:'#111',
    ey:'UX/UI · Gamification · Wellness',
    ttl:'340 treinos.<br><em>Nenhuma celebração.</em>',
    meta:['Product Designer','2 semanas','Figma · Adobe CC'],
    hook:'"Sou usuário ativo do Wellhub há anos. Mais de 340 check-ins. Cada um representou uma decisão consciente de sair do sofá, ir à academia e investir na saúde. E o app? Tratava todos exatamente igual. Sem diferença entre o primeiro treino e o de número 300."',
    context:`<p>Como usuário frequente e designer, vi na experiência de check-in uma oportunidade real de criar algo emocionalmente envolvente. O redesign nasceu de uma frustração genuína: o aplicativo não valorizava o esforço que levou o usuário até ali.</p>
    <p>Aplicativos de bem-estar vivem de <strong>recorrência</strong>. Usuários que criam hábito retornam. Usuários que não sentem progresso somem. O check-in era a maior oportunidade perdida de reforçar esse hábito.</p>`,
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
    objetivo:'Transformar o check-in num ritual de conquista que reforce o hábito.',
    krs:[
      {txt:'Aumentar o tempo de permanência na tela pós check-in',meta:'+30%'},
      {txt:'Reduzir taxa de abandono no fluxo de check-in',meta:'-20%'},
      {txt:'Melhorar percepção de personalização no NPS',meta:'+15pts'}
    ],
    sol:`<p>O reframing estratégico: <strong>de botão para ritual. De função para celebração. De ação neutra para microvitória reconhecida.</strong></p>
    <p>Benchmark com Duolingo, Apple Fitness, TotalPass e Strava revelou o padrão comum: todos celebram o momento presente e mostram onde o usuário chegou. A gamificação leve — conquistas, streaks, progresso visual — reforça o comportamento sem virar jogo.</p>
    <p>Criamos estados diferenciados: primeiro check-in, marcos de 10/50/100 check-ins, sequências semanais. Cada estado tem feedback visual e textual próprio, tornando cada treino único.</p>`,
    results:[['340+','Check-ins reais como usuário — validação autêntica do problema'],['✓','Feedback positivo nos testes com usuários reais do Wellhub'],['↑','Engajamento percebido pós check-in nos testes de usabilidade'],['✓','Senso de progresso e personalização validados em entrevistas']]
  },
  credenciados:{
    color:'#185FA5',bg:'#111',
    ey:'UX Research · HealthTech · Kivid',
    ttl:'O usuário fechou<br>o app e foi no <em>Google.</em>',
    meta:['Product Designer','3 semanas','Figma'],
    hook:'"Imagine que você está com dor, precisa marcar uma consulta e abre o app do seu plano de saúde. A tela mostra o nome do médico e um número de telefone. Só isso. Sem endereço completo. Sem horários. Sem convênios. Nada que te ajudasse a decidir."',
    context:`<p>O Kivid havia construído uma rede de credenciados robusta, mas não havia pensado em montar uma <strong>experiência</strong> em volta desses dados. A lista existia. As informações existiam. Estavam espalhadas, incompletas ou simplesmente ausentes na interface.</p>
    <p>O impacto era direto: usuários saíam do app para buscar no Google, a taxa de agendamentos originados dentro do app era baixa e os tickets de suporte sobre informações básicas de credenciados eram altos — custo operacional direto para o negócio.</p>`,
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
    objetivo:'Tornar a busca de profissionais confiável, completa e rápida o suficiente para eliminar a necessidade de sair do app.',
    krs:[
      {txt:'Reduzir taxa de abandono da tela de credenciados',meta:'-30%'},
      {txt:'Aumentar agendamentos iniciados dentro do app',meta:'+25%'},
      {txt:'Reduzir tickets de suporte sobre credenciados',meta:'-40%'}
    ],
    sol:`<p>Uma página de perfil completa: o equivalente digital do cartão de visita profissional + agenda + mapa, tudo junto, sem sair do app.</p>
    <p>Nome, especialidade, avaliação por estrelas, endereço com mapa integrado, telefone direto, horários de atendimento por dia da semana, convênios aceitos e fotos do consultório. <strong>Decisão tomada em segundos, sem fricção.</strong></p>
    <p>Principal descoberta nos testes: o botão "Ligar" precisava estar visível sem scroll. Qualquer posição abaixo da dobra aumentava o abandono. Esse ajuste simples foi o de maior impacto.</p>`,
    results:[['✓','"Finalmente tudo no lugar certo" — feedback recorrente nos testes'],['↑','Facilidade percebida para agendar consultas e exames'],['↑','Taxa de uso da funcionalidade de busca no app'],['↓','Tempo médio para localizar dados essenciais de um profissional']]
  },
  checkout:{
    color:'#993556',bg:'#111',
    ey:'Conversão · Mobile · HealthTech',
    ttl:'Metade desistia<br>no meio do <em>checkout.</em>',
    meta:['Product Designer','10 semanas','Figma · Clarity'],
    hook:'"80% dos usuários chegavam até o checkout. Metade desistia no meio do processo. Cada abandono não era só um número — era uma família que não conseguiu contratar um plano de saúde acessível."',
    context:`<p>A persona central do Kivid é Adriana Santos, 56 anos, professora, classe C/D, casada, dois filhos. Quando ela entra numa tela de checkout, precisa de três coisas: <strong>clareza, segurança e velocidade</strong>. Qualquer dúvida vira abandono.</p>
    <p>O produto existente pedia informações excessivas logo no início, era fragmentado em múltiplas etapas sem progresso visível e não deixava claro o valor total até o final — exatamente o oposto do que Adriana precisava.</p>`,
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
    objetivo:'Tornar a compra do plano Kivid tão simples que o usuário complete sem precisar pensar.',
    krs:[
      {txt:'Aumentar taxa de conversão do checkout',meta:'+15%'},
      {txt:'Reduzir abandono de carrinho',meta:'-20%'},
      {txt:'Diminuir tempo médio de conclusão da compra',meta:'-30%'}
    ],
    sol:`<p>Unifiquei todas as etapas em <strong>uma única página</strong>. Preenchimento automático via CPF: o usuário digitava um campo e nome, endereço e dados básicos eram preenchidos automaticamente. Eliminamos tudo que era opcional ou desnecessário para a conclusão.</p>
    <p>O resumo do pedido ficou sempre visível, dinâmico e transparente — o valor total aparece desde o primeiro momento, atualizando em tempo real conforme o usuário seleciona opções. Sem surpresas no final. Sem perguntas sem resposta.</p>
    <p>Adicionamos indicadores de segurança (cadeado, selos) nas posições exatas onde os heatmaps mostravam maior hesitação. Pequeno detalhe, impacto mensurável na confiança.</p>`,
    results:[['15%','Aumento na taxa de conversão — KR1 atingido'],['20%','Redução no abandono de carrinho — KR2 atingido'],['↓','Tempo médio de conclusão da compra'],['✓','"Muito mais simples e rápido" — feedback recorrente']]
  },
  nps:{
    color:'#854F0B',bg:'#111',
    ey:'NPS · Data · HealthTech',
    ttl:'O time decidia<br>sem ouvir <em>ninguém.</em>',
    meta:['Product Designer','2 semanas','Figma'],
    hook:'"O Kivid tinha uma rede ativa de atendimentos. Decisões sobre o produto eram tomadas com base em feeling, suposições e reclamações espontâneas no suporte. Não havia linha de base. Não havia como medir evolução. Não havia cultura de feedback."',
    context:`<p>Você não consegue melhorar o que não mede. E você não consegue medir o que não pergunta. A ausência de dados de satisfação estruturados criava um ciclo vicioso: sem evidência, o time priorizava pelo que gritava mais alto — geralmente reclamações isoladas, não padrões reais.</p>
    <p>O objetivo não era apenas criar uma tela de avaliação. Era <strong>criar uma cultura de escuta contínua</strong> que alimentasse decisões de produto com evidência real dos pacientes.</p>`,
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
    objetivo:'Criar uma cultura de feedback contínuo que alimente decisões de produto com dados reais dos pacientes.',
    krs:[
      {txt:'Coletar NPS de pelo menos 30% dos atendimentos mensais',meta:'30%'},
      {txt:'Gerar ao menos 3 insights acionáveis por mês',meta:'3/mês'},
      {txt:'Estabelecer linha de base de satisfação trimestral',meta:'Q1 2024'}
    ],
    sol:`<p>O fluxo precisava ser <strong>invisível na fricção mas significativo no resultado</strong>. Emojis para facilitar a expressão emocional sem exigir escrita, cores suaves que não criam ansiedade, textos curtíssimos que respeitam o contexto pós-consulta médica.</p>
    <p>Cada elemento foi pensado para reduzir o esforço cognitivo de quem acabou de passar por um atendimento médico — momento em que a pessoa pode estar ansiosa, cansada ou aliviada. O campo qualitativo aberto aparece apenas após a avaliação numérica, como convite, nunca como obrigação.</p>
    <p>O impacto mais relevante foi comportamental: o time de produto passou a ter dados para discutir prioridades. O NPS virou pauta de reunião semanal. Os feedbacks qualitativos passaram a embasar decisões sobre treinamento dos credenciados.</p>`,
    results:[['✓','Canal estruturado criado — linha de base de satisfação estabelecida'],['↑','Feedbacks qualitativos chegando ao time toda semana'],['✓','Dados NPS acionáveis integrando o processo de priorização'],['↑','Pacientes sentindo que sua voz importava no produto']]
  }
};

function openCase(id,title){
  const c=CASES[id];
  document.getElementById('case-ttl-nav').textContent=title;
  document.getElementById('case-slot').innerHTML=`
    <div class="ch" style="--case-color:${c.color}">
      <div class="ch-ct">
        <div class="ch-ey">${c.ey}</div>
        <div class="ch-title">${c.ttl}</div>
        <div class="ch-meta-row">${c.meta.map(m=>`<span>${m}</span>`).join('')}</div>
      </div>
      <div class="ch-img-area" style="background:#111">
        <div class="ch-img-ph">${id}-hero.jpg</div>
      </div>
    </div>
    <div class="ch-bd">
      <div class="ch-hook">${c.hook}</div>

      <h3>Contexto e problema</h3>
      ${c.context}

      <div class="ch-imgs">
        <div class="ch-img-slot wide"><div class="ch-img-slot-lbl">${id}-contexto.jpg</div></div>
      </div>

      <h3>Diagnóstico</h3>
      <div class="ch-diag-grid">${c.diags.map(d=>`
        <div class="ch-diag">
          <div class="ch-diag-icon">${d.icon}</div>
          <div class="ch-diag-body">
            <div class="ch-diag-title">${d.title}</div>
            <div class="ch-diag-desc">${d.desc}</div>
          </div>
        </div>`).join('')}</div>

      <div class="ch-imgs">
        <div class="ch-img-slot"><div class="ch-img-slot-lbl">${id}-antes.jpg</div></div>
        <div class="ch-img-slot"><div class="ch-img-slot-lbl">${id}-wireframe.jpg</div></div>
      </div>

      <h3>KPIs que guiaram as decisões</h3>
      <div class="ch-kpi-grid">${c.kpis.map(k=>`
        <div class="ch-kpi">
          <div class="ch-kpi-icon">${k.icon}</div>
          <div class="ch-kpi-label">${k.label}</div>
          <div class="ch-kpi-val">${k.val}</div>
          <div class="ch-kpi-desc">${k.desc}</div>
        </div>`).join('')}</div>

      <div class="ch-okr-block">
        <div class="ch-okr-head">
          <span class="ch-okr-head-icon">◎</span>
          <span class="ch-okr-head-label">Objetivo</span>
          <span class="ch-okr-head-obj">${c.objetivo}</span>
        </div>
        <div class="ch-kr-list">${c.krs.map((kr,i)=>`
          <div class="ch-kr">
            <div class="ch-kr-num">KR${i+1}</div>
            <div class="ch-kr-txt">${kr.txt}</div>
            <div class="ch-kr-badge">${kr.meta}</div>
          </div>`).join('')}</div>
      </div>

      <h3>A solução</h3>
      ${c.sol}

      <div class="ch-imgs">
        <div class="ch-img-slot wide"><div class="ch-img-slot-lbl">${id}-solucao.jpg</div></div>
      </div>

      <h3>Resultados</h3>
      <div class="res-grid">${c.results.map(r=>`<div class="res-item"><div class="res-n">${r[0]}</div><div class="res-l">${r[1]}</div></div>`).join('')}</div>
    </div>`;
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
  /* Envia para mailto — substitua pela URL do Google Forms quando tiver */
  const subject=encodeURIComponent('Feedback Portfólio Lucas de Castro');
  const body=encodeURIComponent(txt);
  window.open('mailto:llucastourinho@gmail.com?subject='+subject+'&body='+body);
  document.getElementById('fb-text').style.display='none';
  document.querySelector('.fb-foot').style.display='none';
  document.getElementById('fb-thanks').style.display='block';
  setTimeout(closeFeedback,2200);
}
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeFeedback()});
