/* ========== 정보 · 독 · 탭 ========== */
function ico(d,cls){return'<svg class="si '+(cls||'')+'" viewBox="0 0 24 24" aria-hidden="true">'+d+'</svg>';}
var I_MEN='<circle cx="12" cy="7.5" r="3.4"/><path d="M5 20c0-4.4 3-7 7-7s7 2.6 7 7z"/>';
var I_COIN='<circle cx="12" cy="12" r="9"/><path d="M9 7.5l3 4 3-4M8.6 12h6.8M8.6 14.6h6.8M12 11.5V17"/>';
var I_EYE='<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3.2"/>';
var I_SHIELD='<path d="M12 3l7 2.6v6c0 4.4-3 7.6-7 9.4-4-1.8-7-5-7-9.4v-6z"/>';
function renderInfo(){
  var t=ui.sel>=0?G.tiles[ui.sel]:(ui.peek>=0?G.tiles[ui.peek]:null),h='',tip='';
  if(t){
    var m=NODES[t.id],pk=t.owner>=1?pactKind(G,0,t.owner):'';
    var owner=t.owner<0?'주인 없는 땅':(t.owner===0?'우리 땅':ORGS[t.owner].name+(pk==='ally'?' · 동맹':(pk==='truce'?' · 휴전':'')));
    var kind=t.kind==='city'?CITY_TYPES[t.type].n:TERRAIN[m.ter].n;
    tip=t.kind==='city'?CITY_TIP[t.type]:TERRAIN[m.ter].tip;
    var df=Math.round((dfac(t.id)-1)*100),fill=Math.min(100,Math.round(t.men/t.cap*100));
    h='<div class="i-head"><b>'+esc(t.name)+'</b><em class="st '+(t.owner<0?'on':'o'+t.owner)+'">: '+esc(owner)+'</em><span class="kind">'+kind+'</span></div>'+
      '<div class="i-bar '+(t.owner<0?'on':'o'+t.owner)+'"><span style="width:'+fill+'%"></span></div>'+
      '<div class="i-stats"><span>'+ico(I_MEN)+'<b>'+t.men+'</b>/'+t.cap+'</span><span>'+ico(I_COIN)+'<b>¥'+tileInc(G,t)+'</b></span>'+
      '<span title="눈에 띔: 차지할 때 경계가 얼마나 오르는지">'+ico(I_EYE)+'<b>'+'●'.repeat(t.exp)+'○'.repeat(Math.max(0,3-t.exp))+'</b></span>'+
      '<span>'+ico(I_SHIELD)+'<b>'+(df>0?'+'+df+'%':'기본')+'</b></span></div>';
  }else{
    h='<div class="i-head"><b>땅을 눌러 보세요</b><span class="kind">정보가 여기에 나옵니다</span></div>';
  }
  var m2=ui.msg;
  if(!m2&&!G.over){
    if(ui.mode==='example')m2='본보기를 보일 이웃 땅을 누르세요.';
    else if(ui.sel>=0)m2=tip+' 보낼 곳을 누르세요.';
    else if(ui.peek>=0)m2=tip+' 내 땅을 먼저 눌러 병력을 고르세요.';
    else m2=(G.day<=TIPS.length&&G.ap>0)?TIPS[G.day-1]:'내 땅을 눌러 병력을 고르세요.';
  }
  $('info').innerHTML=h+'<div class="i-msg'+(ui.err?' err':'')+'">'+esc(m2)+'</div>';
}
function renderActions(){
  var over=!!G.over,ap=G.ap>0&&!over&&!G.pend;
  var selT=ui.sel>=0?G.tiles[ui.sel]:null,mineSel=!!(selT&&selT.owner===0);
  $('bRecruit').disabled=!(ap&&mineSel&&G.money>=5&&selT.men<selT.cap);
  $('bRecruit').querySelector('small').textContent='병력 +'+recruitAmt(G)+' · ¥5';
  $('bRecruit').title='선택한 내 땅에 병력을 불러 모읍니다. 수 1 · ¥5';
  $('bExample').disabled=!(ap&&mineSel&&exampleTargets(G,ui.sel).length>0);
  $('bExample').setAttribute('aria-pressed',ui.mode==='example'?'true':'false');
  $('bExample').querySelector('small').textContent='위세+'+(14+(hasTech(G,'b2')?4:0))+' 경계+9';
  $('bExample').title='붙어 있는 이웃 땅에 본보기를 보입니다. 위세 크게 ↑ · 경계 ↑ · 동요 ↑ · 그쪽 원한 ↑ · 수 1';
  $('bFeast').disabled=!(ap&&G.money>=10);
  $('bFeast').title='돈으로 사는 두려움. 위세 +10 · 경계 +4 · 동요 +3 · 수 1 · ¥10';
  $('bLie').disabled=!ap;
  $('bLie').title='숨을 죽이고 조용히 지냅니다. 위세 −8 · 경계 −10 · 동요 −6 · 수 1';
  $('bUndo').disabled=!(undoStack.length&&!over&&!G.pend&&!ui.auto);
  var au=$('bAuto');
  au.disabled=over;
  au.setAttribute('aria-pressed',ui.auto?'true':'false');
  au.title=ui.auto?'자동 진행을 멈추고 직접 둡니다':'참모가 수를 대신 두고 밤을 넘깁니다. 이벤트가 오면 멈춥니다';
  au.querySelector('b').textContent=ui.auto?'멈춤':'알아서';
  au.querySelector('svg').innerHTML=ui.auto?'<rect x="6" y="6" width="12" height="12" rx="1.5"/>':'<path d="M7 4.5v15l12-7.5z"/>';
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
  var da=diploAlert(G);
  setDot('crew',risk,true);setDot('ops',canTech,false);setDot('dip',da>=1,da>=2);
  document.querySelectorAll('.tab').forEach(function(b){b.setAttribute('aria-expanded',ui.sheet===b.dataset.tab?'true':'false');});
}
