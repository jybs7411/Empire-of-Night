/* ========== 이벤트 팝업 · 밤 요약 · 엔딩 · 처음 안내 ========== */
function bestRecord(){
  var b=null;try{b=JSON.parse(lsGet(BEST_KEY)||'null');}catch(e){}
  return b&&typeof b.sc==='number'?b:null;
}
/* 엔딩 때 한 번만 점수를 기록하고 신기록 여부를 돌려준다 */
function recordEnding(){
  var sc=scoreOf(G),prev=bestRecord(),fresh=false;
  if(ui.recorded!==G.seed){
    ui.recorded=G.seed;
    if(!prev||sc>prev.sc){lsSet(BEST_KEY,JSON.stringify({sc:sc,g:gradeOf(sc),day:Math.min(G.day,MAXDAY)}));fresh=!!prev;ui.fresh=fresh;}
    else ui.fresh=false;
  }
  return{sc:sc,g:gradeOf(sc),best:bestRecord(),fresh:ui.fresh};
}
function endingHtml(){
  var e=endingFor(G),mine=owned(G,0).length,st=G.stats,rec=recordEnding();
  var nights=G.over.type==='survive'?MAXDAY:Math.min(G.day,MAXDAY);
  function c(l,v){return'<div><dt>'+l+'</dt><dd>'+v+'</dd></div>';}
  return'<div class="mcard end"><p class="kicker">'+e.kicker+'</p><h2>'+e.title+'</h2><p class="mtext">'+e.text+'</p>'+
    '<div class="grade g-'+rec.g+'"><b>'+rec.g+'</b><div><span>점수 '+rec.sc+(rec.fresh?' <em>신기록!</em>':'')+'</span><span>최고 기록 '+(rec.best?rec.best.g+' · '+rec.best.sc+'점':'-')+'</span></div></div>'+
    '<dl class="estats">'+c('맞이한 밤',nights)+c('끝날 때 땅',mine)+c('최고 위세',st.peakDread)+c('최고 경계',st.peakHeat)+c('최고 동요',st.peakAnx)+
    c('본보기',st.examples)+c('연합 공격',st.strikes)+c('최장 연승',G.bestStreak)+c('목표 달성',G.goalsDone)+
    c('맺은 약속',st.pactsMade)+c('깨진 약속',st.pactBroken)+c('도장',(G.mile||[]).length)+'</dl>'+
    '<p class="echo">칭호 · '+titleFor(G)+'</p>'+(echoFor(G)?'<p class="echo">'+echoFor(G)+'</p>':'')+
    '<button type="button" class="primary wide" id="bRestart">새 지도로 다시 한 번</button><button type="button" class="wide ghost" id="bRetry">같은 지도로 다시</button></div>';
}
function introHtml(){
  function row(k,g,t,d){return'<div class="irow"><span class="ik '+k+'">'+(g?'<svg viewBox="0 0 24 24" aria-hidden="true">'+g+'</svg>':'')+'</span><div><b>'+t+'</b><small>'+d+'</small></div></div>';}
  return'<div class="mcard intro"><p class="kicker">처음 안내</p><h2>밤의 균형</h2>'+
    '<p class="mtext">'+MAXDAY+'밤 동안 본거지를 지키며 땅을 넓힌다. 한 판은 10분 남짓. 손가락 몇 번이면 된다.</p>'+
    '<div class="ilist">'+
    row('auto','<path d="M7 4.5v15l12-7.5z" fill="currentColor"/>','알아서 · 누르면 참모가 대신 둔다','땅 넓히기, 모집, 강화까지 맡긴다. 이벤트가 오면 멈춘다.')+
    row('dread',GICON.dread,'위세 · 이웃이 우리를 무서워하는 정도','낮으면 얕보고 쳐들어온다. 땅을 차지하면 오른다.')+
    row('heat',GICON.heat,'경계 · 이웃이 우리를 위협으로 보는 정도','높으면 이웃끼리 손을 잡고 한꺼번에 덤빈다.')+
    row('anx',GICON.anx,'동요 · 우리 조직 안의 불안','높으면 싸움이 무뎌지고, 100이면 무너진다.')+
    '</div><p class="mtext sm">직접 두고 싶다면 내 땅을 눌러 병력을 고르고, 붙은 땅을 눌러 보낸다. 게이지를 누르면 설명이 나온다.</p>'+
    '<button type="button" class="primary wide" id="bIntro">알겠다</button></div>';
}
/* 같은 결정 창은 한 번만 계산해 둔다 (가상 적용이라 가볍지 않다) */
function recFor(p){
  var key=G.day+':'+p.type+':'+(p.idx!==undefined?p.idx:'')+':'+(p.r||'')+':'+(p.kind||'');
  if(ui.recKey!==key){ui.recKey=key;ui.rec=(p.type==='rule')?recommendRule(G,p.opts):recommendChoice(G,p);}
  return ui.rec;
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
      var rk=recFor(p);
      h='<div class="mcard'+(p.type==='offer'?' dip':'')+'"><p class="kicker">'+G.day+'번째 밤 · '+kick+'</p><h2>'+ev.title+'</h2><p class="mtext">'+txt+'</p><div class="choices">'+
        ev.choices.map(function(c,i){return'<button type="button" class="choice'+(i===rk?' rec':'')+'" data-scene="'+i+'"'+((c.cost&&G.money<c.cost)?' disabled':'')+'>'+(i===rk?'<span class="rtag">참모 추천</span>':'')+'<b>'+c.label+'</b><small>'+c.desc+'</small></button>';}).join('')+
        '</div><button type="button" class="wide auto" data-auto="1">참모에게 맡긴다</button></div>';
    }else{
      var rr=recFor(p);
      h='<div class="mcard"><p class="kicker">'+G.day+'번째 밤 · 법을 세울 때</p><h2>이 조직의 법</h2><p class="mtext">식구들이 말을 기다린다. 한 번 세운 법은 거두지 못한다.</p><div class="choices">'+
        p.opts.map(function(id){var r=RULES[id];return'<button type="button" class="choice'+(id===rr?' rec':'')+'" data-rule="'+id+'">'+(id===rr?'<span class="rtag">참모 추천</span>':'')+'<b>'+r.name+'</b><small>'+r.text+'</small><small>'+r.fx+'</small></button>';}).join('')+
        '</div><button type="button" class="wide auto" data-auto="1">참모에게 맡긴다</button></div>';
    }
  }
  if(el.dataset.key===h)return;
  el.dataset.key=h;el.hidden=!h;el.innerHTML=h;
}
var recapT=0;
function renderRecap(){
  var el=$('recap'),r=ui.recap;
  if(!r||G.over){el.hidden=true;el.innerHTML='';return;}
  if(!el.hidden)return;
  el.hidden=false;
  el.innerHTML='<p class="rk">'+r.day+'번째 밤이 지났다</p><h2>'+esc(r.title)+'</h2>'+
    '<p class="rgain"><b class="'+(r.gain>=0?'pos':'neg')+'">'+(r.gain>=0?'+':'−')+'¥'+Math.abs(r.gain)+'</b><span>땅 '+r.land+'곳 · 병력 '+r.men+'</span></p><div class="rl">'+
    r.lines.map(function(e){return'<p class="l '+(e.tone||'')+'">'+esc(e.text)+'</p>';}).join('')+'</div><p class="go">탭하여 계속</p>';
  clearTimeout(recapT);recapT=setTimeout(function(){if(ui.recap===r)closeRecap();},ui.auto?1500:4500);
}
