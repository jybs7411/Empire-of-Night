/* ========== 이벤트 팝업 · 밤 요약 · 엔딩 ========== */
function endingHtml(){
  var e=endingFor(G),mine=owned(G,0).length,st=G.stats;
  var nights=G.over.type==='survive'?MAXDAY:Math.min(G.day,MAXDAY);
  function c(l,v){return'<div><dt>'+l+'</dt><dd>'+v+'</dd></div>';}
  return'<div class="mcard end"><p class="kicker">'+e.kicker+'</p><h2>'+e.title+'</h2><p class="mtext">'+e.text+'</p>'+
    '<dl class="estats">'+c('맞이한 밤',nights)+c('끝날 때 땅',mine)+c('최고 위압',st.peakDread)+c('최고 견제',st.peakHeat)+c('최고 불안',st.peakAnx)+
    c('본보기',st.examples)+c('연합 공격',st.strikes)+c('최장 연승',G.bestStreak)+c('목표 달성',G.goalsDone)+'</dl>'+
    '<p class="echo">칭호 · '+titleFor(G)+'</p>'+(echoFor(G)?'<p class="echo">'+echoFor(G)+'</p>':'')+
    '<button type="button" class="primary wide" id="bRestart">새 지도로 다시 한 번</button><button type="button" class="wide ghost" id="bRetry">같은 지도로 다시</button></div>';
}
function renderModal(){
  var el=$('modal'),p=G.pend,h='';
  if(ui.busy)h='';
  else if(G.over)h=endingHtml();
  else if(p&&!ui.recap){
    if(p.type==='scene'||p.type==='dilemma'){
      var ev=evOf(p),txt=typeof ev.text==='function'?ev.text(G,p):ev.text;
      h='<div class="mcard"><p class="kicker">'+G.day+'번째 밤 · '+(p.type==='dilemma'?'위기':'약한 사람의 눈')+'</p><h2>'+ev.title+'</h2><p class="mtext">'+txt+'</p><div class="choices">'+
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
