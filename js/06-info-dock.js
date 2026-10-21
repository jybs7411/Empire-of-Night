/* ========== 정보 · 독 · 탭 ========== */
function renderInfo(){
  var t=ui.sel>=0?G.tiles[ui.sel]:(ui.peek>=0?G.tiles[ui.peek]:null),l1,tip='';
  if(t){
    var owner=t.owner<0?'주인 없음':ORGS[t.owner].short;
    var kind=t.kind==='city'?'도시·'+CITY_TYPES[t.type].n:'구역·'+TERRAIN[NODES[t.id].ter].n;
    tip=t.kind==='city'?CITY_TIP[t.type]:TERRAIN[NODES[t.id].ter].tip;
    l1='<b>'+esc(t.name)+'</b> · '+kind+' · '+owner+' · 병력 '+t.men+'/'+t.cap+' · ¥'+tileInc(G,t)+' · 눈에 띔 '+'●'.repeat(t.exp)+'○'.repeat(3-t.exp);
  }else l1='<span class="muted">땅을 누르면 정보가 보입니다</span>';
  var m=ui.msg;
  if(!m&&!G.over){
    if(ui.mode==='example')m='본보기를 보일 적의 땅을 누르세요.';
    else if(ui.sel>=0)m=tip+' 보낼 곳을 누르세요.';
    else if(ui.peek>=0)m=tip+' 내 땅을 먼저 눌러 병력을 고르세요.';
    else m=(G.day<=TIPS.length&&G.ap>0)?TIPS[G.day-1]:'내 땅을 눌러 병력을 고르세요.';
  }
  $('info').innerHTML='<div class="i1">'+l1+'</div><div class="i2'+(ui.err?' err':'')+'">'+esc(m)+'</div>';
}
function renderActions(){
  var over=!!G.over,ap=G.ap>0&&!over&&!G.pend;
  var selT=ui.sel>=0?G.tiles[ui.sel]:null,mineSel=!!(selT&&selT.owner===0);
  $('bRecruit').disabled=!(ap&&mineSel&&G.money>=5&&selT.men<selT.cap);
  $('bRecruit').querySelector('small').textContent='+'+recruitAmt(G)+'명 · ¥5';
  $('bExample').disabled=!(ap&&mineSel&&exampleTargets(G,ui.sel).length>0);
  $('bExample').setAttribute('aria-pressed',ui.mode==='example'?'true':'false');
  $('bExample').querySelector('small').textContent='위압 +'+(14+(hasTech(G,'b2')?4:0));
  $('bFeast').disabled=!(ap&&G.money>=10);
  $('bLie').disabled=!ap;
  var dc=drinkCost(G),anyR=!G.dead[1]||!G.dead[2]||!G.dead[3];
  $('bDrink').disabled=!(ap&&G.money>=dc&&anyR);
  $('bUndo').disabled=!(undoStack.length&&!over&&!G.pend);
  $('bEnd').disabled=over||!!G.pend;
  $('bEnd').className='primary'+((G.ap===0&&!over&&!G.pend)?' ready':'');
  document.querySelectorAll('#amt button').forEach(function(b){b.setAttribute('aria-pressed',b.dataset.amt===ui.amt?'true':'false');});
}
function setDot(tab,show,red){
  var d=document.querySelector('[data-tab="'+tab+'"] .nd');
  d.hidden=!show;d.className='nd'+(red?' red':'');
}
function renderTabs(){
  var risk=G.crew.some(function(c){return c.alive&&c.loy<35;});
  var canTech=!G.over&&!G.pend&&TECH.some(function(t){return!hasTech(G,t.id)&&(!t.pre||hasTech(G,t.pre))&&G.money>=t.cost;});
  var f=forecast(G);
  setDot('crew',risk,true);setDot('tech',canTech,false);setDot('rivals',f.lvl>=2,f.lvl>=3);
  document.querySelectorAll('.tab').forEach(function(b){b.setAttribute('aria-expanded',ui.sheet===b.dataset.tab?'true':'false');});
}
