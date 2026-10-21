/* ========== 이벤트 팝업 · 밤 요약 · 엔딩 · 처음 안내 ========== */
function endingHtml(){
  var e=endingFor(G),mine=owned(G,0).length,st=G.stats;
  var nights=G.over.type==='survive'?MAXDAY:Math.min(G.day,MAXDAY);
  function c(l,v){return'<div><dt>'+l+'</dt><dd>'+v+'</dd></div>';}
  return'<div class="mcard end"><p class="kicker">'+e.kicker+'</p><h2>'+e.title+'</h2><p class="mtext">'+e.text+'</p>'+
    '<dl class="estats">'+c('맞이한 밤',nights)+c('끝날 때 땅',mine)+c('최고 위세',st.peakDread)+c('최고 경계',st.peakHeat)+c('최고 동요',st.peakAnx)+
    c('본보기',st.examples)+c('연합 공격',st.strikes)+c('최장 연승',G.bestStreak)+c('목표 달성',G.goalsDone)+
    c('맺은 약속',st.pactsMade)+c('깨진 약속',st.pactBroken)+c('배신당함',st.betrayedBy)+'</dl>'+
    '<p class="echo">칭호 · '+titleFor(G)+'</p>'+(echoFor(G)?'<p class="echo">'+echoFor(G)+'</p>':'')+
    '<button type="button" class="primary wide" id="bRestart">새 지도로 다시 한 번</button><button type="button" class="wide ghost" id="bRetry">같은 지도로 다시</button></div>';
}
function introHtml(){
  function row(k,g,t,d){return'<div class="irow"><span class="ik '+k+'">'+(g?'<svg viewBox="0 0 24 24" aria-hidden="true">'+g+'</svg>':'')+'</span><div><b>'+t+'</b><small>'+d+'</small></div></div>';}
  return'<div class="mcard intro"><p class="kicker">처음 안내</p><h2>밤의 균형</h2>'+
    '<p class="mtext">서른 밤 동안 본거지를 지키는 조직의 이야기다. 병력을 보내 땅을 차지하고, 이웃 조직 셋과 줄다리기를 한다.</p>'+
    '<div class="ilist">'+
    row('dread',GICON.dread,'위세 · 이웃이 우리를 무서워하는 정도','낮으면 얕보고 쳐들어온다. 땅을 차지하면 오른다.')+
    row('heat',GICON.heat,'경계 · 이웃이 우리를 위협으로 보는 정도','높으면 이웃끼리 손을 잡고 한꺼번에 덤빈다.')+
    row('anx',GICON.anx,'동요 · 우리 조직 안의 불안','높으면 싸움이 무뎌지고, 100이면 무너진다.')+
    row('dip','<path d="M2.5 12.5l4-4 3.2 1.6 3-2.2 4.4 2.6 2.4-1.6 2 2.4-6.6 6.2-2.4-1.4-2.2 1.4z"/>','외교 · 이웃도 서로 손잡고 배신한다','우리도 휴전·동맹을 맺을 수 있다. 외교 탭을 보자.')+
    '</div><p class="mtext sm">오른쪽 게이지를 누르면 자세한 설명이 나오고, 지도 아래 <b>참모</b>가 지금 할 일을 알려 준다.</p>'+
    '<button type="button" class="primary wide" id="bIntro">알겠다</button></div>';
}
function renderModal(){
  var el=$('modal'),p=G.pend,h='';
  if(ui.busy)h='';
  else if(G.over)h=endingHtml();
  else if(ui.intro)h=introHtml();
  else if(p&&!ui.recap){
    if(p.type==='scene'||p.type==='dilemma'||p.type==='offer'){
      var ev=evOf(p,G),txt=typeof ev.text==='function'?ev.text(G,p):ev.text;
      var kick=p.type==='offer'?'외교':(p.type==='dilemma'?'위기':'약한 사람의 눈');
      h='<div class="mcard'+(p.type==='offer'?' dip':'')+'"><p class="kicker">'+G.day+'번째 밤 · '+kick+'</p><h2>'+ev.title+'</h2><p class="mtext">'+txt+'</p><div class="choices">'+
        ev.choices.map(function(c,i){return'<button type="button" class="choice" data-scene="'+i+'"'+((c.cost&&G.money<c.cost)?' disabled':'')+'><b>'+c.label+'</b><small>'+c.desc+'</small></button>';}).join('')+'</div></div>';
    }else{
      h='<div class="mcard"><p class="kicker">'+G.day+'번째 밤 · 법을 세울 때</p><h2>이 조직의 법</h2><p class="mtext">식구들이 말을 기다린다. 한 번 세운 법은 거두지 못한다.</p><div class="choices">'+
        p.opts.map(function(id){var r=RULES[id];return'<button type="button" class="choice" data-rule="'+id+'"><b>'+r.name+'</b><small>'+r.text+'</small><small>'+r.fx+'</small></button>';}).join('')+'</div></div>';
    }
  }
  if(el.dataset.key===h)return;
  el.dataset.key=h;el.hidden=!h;el.innerHTML=h;
}
function renderRecap(){
  var el=$('recap'),r=ui.recap;
  if(!r||G.over){el.hidden=true;el.innerHTML='';return;}
  if(!el.hidden)return;
  el.hidden=false;
  el.innerHTML='<p class="rk">'+r.day+'번째 밤이 지났다</p><h2>'+esc(r.title)+'</h2><div class="rl">'+
    r.lines.map(function(e){return'<p class="l '+(e.tone||'')+'">'+esc(e.text)+'</p>';}).join('')+'</div><p class="go">탭하여 계속</p>';
}
