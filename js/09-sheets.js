/* ========== 시트(팝업) · 작전실 ========== */
var SHEET_TITLES={dip:'외교',crew:'부하',log:'밤의 기록',more:'더보기',gauge:'게이지 풀이'};
var OPS_TABS=[['over','개요'],['eco','기반'],['cover','은폐'],['force','무력']];
var OPS_BR={eco:0,force:1,cover:2};
var RULES_TXT=[
  '<b>목표</b>는 서른 밤을 버티며 본거지를 지키는 것이다. 밤마다 <b>수</b>가 세 번 있다. 내 땅을 눌러 병력을 고르고, 붙은 땅을 눌러 보낸다. <b>전부</b>는 한 명만 남기고 모두, <b>절반</b>은 반만 보낸다.',
  '화면 오른쪽 세 게이지가 이 게임의 핵심이다. <b>위세</b>(이웃이 우리를 무서워하는 정도), <b>경계</b>(이웃이 우리를 위협으로 보는 정도), <b>동요</b>(우리 조직 안의 불안). 게이지를 누르면 올리고 내리는 법이 나온다.',
  '<b>지도는 새 판마다 새로 만들어진다.</b> 같은 지도로 다시 하려면 설정에서 고른다. 땅을 누르면 지형과 쓰임이 아래 정보 줄에 나온다.',
  '<b>산악</b>은 방어 +25%, 수입 −1. <b>숲</b>은 방어 +10%에 눈에 띄지 않아 차지해도 경계가 오르지 않는다. <b>평야</b>는 수입이 크다. <b>강</b>은 건널 수 없고 <b>다리목</b>(방어 +20%)으로만 지난다. <b>시장·술집·유흥가·파친코·항구</b>는 수입이 큰 돈줄이니 우선 차지하자.',
  '<b>역</b>은 내 역끼리 철도로 이어진다. 역에서 다른 내 역을 누르면 병력을 한 번에 옮긴다. 점선이 금빛이 되면 연결된 것이다.',
  '조직마다 <b>표식</b>이 있다. 우리는 <b>불꽃</b>, 하야시구미는 <b>마름모</b>, 쓰키가미카이는 <b>초승달</b>, 구로이누는 <b>송곳니</b>. 색을 구분하기 어려워도 병력 배지의 표식으로 알아본다.',
  '<b>땅이 넓을수록</b> 병력이 절로 늘고 모집도 더 된다. 대신 사람이 늘면 <b>유지비</b>도 는다. 돈이 모자라면 병력이 말없이 떠난다. 상단 좌측 칩에서 밤마다의 순수입을 볼 수 있다.',
  '<b>이웃끼리도 움직인다.</b> 이웃 조직은 서로 동맹을 맺고, 싸우고, 화해하고, 배신한다. 우리가 너무 커져 <b>경계</b>가 높아지면 이웃들이 손잡고 우리를 노린다. 반대로 경계가 낮으면 이웃끼리 싸운다.',
  '<b>외교</b> 탭에서 이웃과 술자리·휴전·동맹·선물을 쓸 수 있다. 성공 확률이 함께 보인다. 휴전과 동맹을 맺은 상대는 칠 수 없고, 먼저 <b>파기</b>해야 한다. 이웃이 먼저 화해나 동맹을 청해 오기도 한다.',
  '<b>동맹</b>은 든든하지만 영원하지 않다. 우리가 약해 보이거나 동맹이 너무 커지면 상대가 <b>배신</b>할 수 있다. 외교 탭의 "배신 위험"을 살피자. 이웃의 동맹은 <b>이간 공작</b>(은폐 강화)으로 갈라놓을 수 있다.',
  '경계가 연합 습격선(기본 70)을 넘으면 우리를 미워하는 이웃들이 급히 동맹을 맺고 같은 밤에 덤빈다. 동맹이 많을수록 경계는 매밤 내려간다.',
  '<b>부하</b> 셋은 믿음이 50 이상일 때만 제 몫을 한다. 믿음이 바닥이면 등을 돌린다. 챙기거나 솎아낼 수 있다.',
  '밤이 지나다 보면 <b>법</b>을 세울 때가 오고, 가게 주인이나 아이 같은 <b>약한 사람</b>과 마주치는 밤이 온다. 정답은 없다.',
  '<b>작전실</b>의 기반·은폐·무력 세 갈래 나무에서 조직을 강화한다. 자금으로 사고 수는 쓰지 않는다. 무력은 강하지만 눈에 띈다.',
  '지도 위 <b>육각 ¥ 표시</b>는 그 밤에만 거둘 수 있는 돈이다. 붉은 것은 더 크지만 눈에 띈다. 연달아 땅을 차지하면 <b>기세</b>가 붙어 위세가 더 오른다.',
  '5밤마다 <b>목표</b>가 주어진다. 이루면 자금과 위세를 얻고, 놓쳐도 벌은 없다. 지도 아래 <b>참모</b>가 지금 할 일을 한 줄로 알려 준다.',
  '<b>되돌리기</b>는 그 밤에 둔 수를 물린다. 본가를 잃으면 끝이다. 적의 본거지를 점령하면 그 조직은 무너진다.'
];
var RULE_PAGE=4;
var TERMS=[
  ['위세','이웃이 우리를 무서워하는 정도. 낮으면 얕보고 쳐들어온다. 땅을 차지하거나 본보기를 보이면 오른다.'],
  ['경계','이웃이 우리를 위협으로 보는 정도. 높으면 이웃끼리 손을 잡고, 선을 넘으면 한꺼번에 덤빈다.'],
  ['동요','우리 조직 안의 불안. 높으면 가면이 갈라져 위세가 새고 공격이 약해진다. 100이면 무너진다.'],
  ['호감','이웃 조직이 우리(또는 다른 조직)를 얼마나 좋게 보는지. 외교 화면의 막대로 볼 수 있다. 높을수록 휴전·동맹이 잘 된다.'],
  ['원한','우리가 땅을 빼앗거나 본보기를 보인 상대에게 쌓인다. 밤마다 조금씩 풀리지만 쓰키가미카이는 오래 간직한다.'],
  ['휴전','정해진 밤 동안 서로 치지 않는 약속. 기간이 끝나면 저절로 풀린다.'],
  ['동맹','기간이 없는 약속. 서로 치지 않고 우리 경계가 매밤 내려가며 가끔 병력을 보내 준다. 대신 배신당할 수 있다.'],
  ['연합 습격','경계가 선을 넘었을 때, 우리를 미워하는 이웃들이 동맹을 맺고 같은 밤에 한 곳을 집중해서 치는 것.'],
  ['배신','동맹이 약속을 깨는 것. 약해 보이는 상대를 노리거나, 더 센 쪽으로 갈아타며 일어난다.'],
  ['이간 공작','동맹한 이웃 둘 사이를 갈라놓는 외교 수. 은폐 강화 "이간 공작"이 필요하다.'],
  ['본보기','이웃 땅에 힘을 보이는 행동. 위세는 크게 오르지만 경계·동요·원한도 함께 오른다.'],
  ['연회','돈으로 위세를 사는 행동. 가볍게 위세를 올리고 싶을 때 쓴다.'],
  ['숨 죽이기','조용히 지내며 경계와 동요를 내리는 행동. 위세도 조금 내려간다.'],
  ['기세','땅을 연달아 차지하면 붙는 보너스. 한 번 막히면 끊긴다.']
];

function sheetCrew(){
  var h='',can=G.ap>0&&!G.over&&!G.pend;
  G.crew.forEach(function(c,i){
    var d=CREW[i];
    var st=!c.alive?'자리가 비었다':(c.loy>=50?'따르는 중':(c.loy>=25?'눈치 보는 중':'등을 돌릴 낌새'));
    var cls=!c.alive?'dead':(c.loy>=50?'fear':(c.loy>=25?'grudge':'join'));
    h+='<div class="crew rv'+(c.alive?'':' dead')+'">'+crewBust(i)+'<div class="rb"><div class="r-head"><b>'+d.name+'</b><span class="muted">'+d.role+'</span><em class="chip '+cls+'">'+st+'</em></div>'+
      (c.alive?'<div class="loy" role="img" aria-label="믿음 '+c.loy+'"><span style="width:'+c.loy+'%"></span></div>':'')+
      '<p class="r-trait">'+d.perk+'</p>'+
      (c.alive?'<div class="crew-btns"><button type="button" class="chipbtn" data-crew="'+i+'" data-op="care"'+((can&&G.money>=6)?'':' disabled')+'>챙기기 ¥6</button>'+
        '<button type="button" class="chipbtn" data-crew="'+i+'" data-op="purge"'+(can?'':' disabled')+'>솎아내기</button></div>':'')+'</div></div>';
  });
  return h;
}

/* ---------- 외교 ---------- */
function relBar(v){
  var pos=Math.round((v+100)/2);
  return'<div class="relbar" role="img" aria-label="호감 '+Math.round(v)+'"><i class="rz"></i><i class="rp" style="left:'+pos+'%"></i></div>';
}
function dipBtn(attrs,label,sub,dis,cls){
  return'<button type="button" class="chipbtn dbtn'+(cls?' '+cls:'')+'" '+attrs+(dis?' disabled':'')+'><b>'+label+'</b>'+(sub?'<small>'+sub+'</small>':'')+'</button>';
}
function sheetDip(){
  var h='',can=G.ap>0&&!G.over&&!G.pend;
  var parts=participants(G),sa=strikeAt(G);
  /* 정세 */
  var line;
  if(G.heat>=sa&&parts.length>=2)line='<b class="bad">연합 습격 임박</b> · '+parts.map(function(r){return ORGS[r].short;}).join('·')+'이(가) 같은 밤에 덤빈다. 경계를 낮추거나 한 곳과 손잡아 연합을 깨자.';
  else if(parts.length>=2)line='<b class="warn">우리를 노리는 동맹 </b> · '+parts.map(function(r){return ORGS[r].short;}).join('·')+'. 경계가 '+sa+'을 넘으면 덤빈다. (지금 '+Math.round(G.heat)+')';
  else if(G.heat>=55)line='<b class="warn">연합 논의가 돈다</b> · 경계 '+Math.round(G.heat)+'. '+sa+'을 넘기기 전에 외교로 식히자.';
  else line='<b>잠잠하다</b> · 경계 '+Math.round(G.heat)+'. 이웃끼리 서로 견제하는 중이다.';
  h+='<div class="dsum">'+line+'</div>';
  var al=alliesOf(G,0);
  if(al.length)h+='<div class="dsum ok">우리 동맹 · '+al.map(function(r){var b=riskLabel(betrayRisk(G,r,0));return ORGS[r].short+' (배신 위험 <b class="rk '+b.k+'">'+b.t+'</b>)';}).join(', ')+'</div>';
  /* 소식 */
  if(G.news.length){
    h+='<div class="dnews"><h3>최근 소식</h3>';
    G.news.slice(-4).reverse().forEach(function(n){h+='<p class="l '+(n.tone==='good'?'good':(n.tone==='bad'?'bad':'dim'))+'"><i>'+n.day+'밤</i> '+esc(n.text)+'</p>';});
    h+='</div>';
  }
  /* 이웃 카드 */
  for(var r=1;r<=3;r++){
    var o=ORGS[r],ts=owned(G,r),men=0,ar=0,ci=0;
    ts.forEach(function(t){men+=t.men;if(t.kind==='area')ar++;else ci++;});
    var a=attitude(G,r),pk=pactKind(G,r,0),dead=G.dead[r],ask=can&&!dead&&G.refused[r]===0;
    var cT=proposalCost(G,'truce'),cA=proposalCost(G,'ally'),dc=drinkCost(G);
    var pT=proposalChance(G,r,'truce'),pA=proposalChance(G,r,'ally');
    var rv=G.rel[r][0];
    h+='<div class="rv o'+r+(dead?' dead':'')+'">'+portrait(r)+'<div class="rb"><div class="r-head">'+markIcon(r)+'<b>'+o.name+'</b><em class="chip '+a.k+'">'+a.t+'</em></div>';
    if(!dead){
      h+='<div class="rel"><span>적대</span>'+relBar(rv)+'<span>우호</span></div><div class="rel-now">우리에 대한 호감 · <b>'+relLabel(rv)+'</b> ('+Math.round(rv)+')</div>';
      h+='<ul class="why">'+moodReasons(G,r).map(function(t){return'<li>'+esc(t)+'</li>';}).join('')+'</ul>';
    }
    h+='<p class="r-trait">'+PERS[r].tag+' · '+o.trait+'</p><div class="r-stats">구역 '+ar+' · 도시 '+ci+' · 병력 '+men+'</div>';
    if(!dead){
      h+='<div class="dip-btns">';
      if(!pk)h+=dipBtn('data-dip="drink" data-r="'+r+'"','술자리','¥'+dc+' · 하룻밤 휴전',!(can&&G.money>=dc));
      if(pk!=='ally'&&pk!=='truce')h+=dipBtn('data-dip="truce" data-r="'+r+'"','휴전 제의','¥'+cT+' · '+chanceLabel(pT)+' '+Math.round(pT*100)+'%',!(ask&&G.money>=cT));
      if(pk!=='ally')h+=dipBtn('data-dip="ally" data-r="'+r+'"','동맹 제의','¥'+cA+' · '+chanceLabel(pA)+' '+Math.round(pA*100)+'%',!(ask&&G.money>=cA));
      h+=dipBtn('data-dip="gift" data-r="'+r+'"','선물','¥'+PACT_COST.gift+' · 호감 +14',!(can&&G.money>=PACT_COST.gift));
      if(pk){
        var cf=ui.confirmBreak===r;
        h+=dipBtn('data-dip="break" data-r="'+r+'"',cf?'정말 파기':'파기',cf?'호감 대폭 ↓ · 한 번 더':'먼저 깬다',G.over||!!G.pend,'brk'+(cf?' on':''));
      }
      h+='</div>';
      if(G.refused[r]>0)h+='<p class="r-trait">방금 거절당했다. 오늘 밤은 다시 청할 수 없다.</p>';
    }
    h+='</div></div>';
  }
  /* 이웃끼리의 관계 */
  h+='<div class="dpairs"><h3>이웃끼리의 관계</h3>';
  for(var a2=1;a2<=3;a2++)for(var b2=a2+1;b2<=3;b2++){
    if(G.dead[a2]||G.dead[b2])continue;
    var pkk=pactKind(G,a2,b2),lo=Math.min(G.rel[a2][b2],G.rel[b2][a2]);
    var lab=pkk==='ally'?'동맹':(pkk==='truce'?'휴전':(lo<=-30?'적대':(lo>=20?'우호':'무관심')));
    h+='<div class="prow"><span class="pn"><i class="o'+a2+'">'+markIcon(a2)+'</i>'+ORGS[a2].short+' <em>↔</em> <i class="o'+b2+'">'+markIcon(b2)+'</i>'+ORGS[b2].short+'</span>'+
      '<em class="chip '+(pkk==='ally'?'join':(pkk==='truce'?'calm':(lo<=-30?'grudge':'')))+'">'+lab+'</em>';
    if(pkk==='ally'){
      if(hasTech(G,'c5')){var dp=discordChance(G,a2,b2);h+=dipBtn('data-dip="discord" data-a="'+a2+'" data-b="'+b2+'"','이간','¥'+PACT_COST.discord+' · '+Math.round(dp*100)+'%',!(can&&G.money>=PACT_COST.discord));}
      else h+='<small class="muted">은폐 강화 "이간 공작"으로 갈라놓을 수 있다</small>';
    }
    h+='</div>';
  }
  return h+'</div>';
}

function sheetLog(){
  var out='',last=null,n=0;
  for(var i=G.log.length-1;i>=0&&n<12;i--){
    var e=G.log[i];if(e.tone==='sep')continue;
    if(e.day!==last){if(last!==null)out+='</div>';out+='<div class="night"><h3>'+e.day+'번째 밤</h3>';last=e.day;}
    out+='<p class="l '+(e.tone||'')+'">'+esc(e.text)+'</p>';n++;
  }
  if(last!==null)out+='</div>';
  return out||'<p class="empty">아직 기록이 없다.</p>';
}
function sheetGauge(){
  var k=ui.gauge||'dread',g=GAUGE[k],v=Math.round(G[k]);
  var note=k==='dread'?dreadNote(G.dread):(k==='heat'?heatNote(G.heat):anxNote(G.anx));
  var a=advice(G),zs=g.zones().map(function(z){return'<li class="'+z[0]+'"><b>'+z[1]+'</b> '+z[2]+'</li>';}).join('');
  var sa=strikeAt(G),marks=k==='heat'?[55,sa]:(k==='dread'?[28,55]:[40,70]);
  return'<div class="gh '+k+'"><svg viewBox="0 0 24 24" aria-hidden="true">'+GICON[k]+'</svg><div><b>'+g.n+'</b><small>'+g.tag+'</small></div><span class="gval">'+v+'</span></div>'+
    '<div class="gbar '+k+'"><span class="gf" style="width:'+G[k]+'%"></span>'+marks.map(function(m){return'<i style="left:'+m+'%"></i>';}).join('')+'</div>'+
    '<p class="gwhat">'+g.what+'</p>'+
    '<h4>지금 상태</h4><p class="gnote">'+esc(note)+'</p>'+
    '<h4>구간별 의미</h4><ul class="gz">'+zs+'</ul>'+
    '<div class="gcols"><div><h4>올리는 것</h4><ul>'+g.up.map(function(t){return'<li>'+t+'</li>';}).join('')+'</ul></div><div><h4>내리는 것</h4><ul>'+g.down.map(function(t){return'<li>'+t+'</li>';}).join('')+'</ul></div></div>'+
    (a?'<h4>참모의 조언</h4><p class="gnote">'+esc(a.t)+'</p>':'');
}
function sheetMore(){
  var h='<div class="subseg">'+[['rules','규칙'],['terms','용어'],['laws','법·기록'],['set','설정']].map(function(p){
    return'<button type="button" data-more="'+p[0]+'" aria-pressed="'+(ui.more===p[0])+'">'+p[1]+'</button>';}).join('')+'</div>';
  if(ui.more==='rules'){
    var pages=Math.ceil(RULES_TXT.length/RULE_PAGE),pg=clamp(ui.page,0,pages-1);
    RULES_TXT.slice(pg*RULE_PAGE,pg*RULE_PAGE+RULE_PAGE).forEach(function(t){h+='<p class="ru">'+t+'</p>';});
    h+='<div class="pager"><button type="button" class="chipbtn" data-page="-1"'+(pg===0?' disabled':'')+'>이전</button><span>'+(pg+1)+' / '+pages+'</span><button type="button" class="chipbtn" data-page="1"'+(pg>=pages-1?' disabled':'')+'>다음</button></div>';
  }else if(ui.more==='terms'){
    TERMS.forEach(function(t){h+='<p class="law"><b>'+t[0]+'</b><small>'+t[1]+'</small></p>';});
  }else if(ui.more==='laws'){
    if(!G.rules.length)h+='<p class="empty law">아직 세운 법이 없다. 6번째 밤에 처음으로 정한다.</p>';
    else G.rules.forEach(function(id){var r=RULES[id];h+='<p class="law"><b>'+r.name+'</b><small>'+r.fx+'</small></p>';});
    h+='<p class="tnote">목표 달성 '+G.goalsDone+'회 · 최장 연승 '+G.bestStreak+'회 · 본보기 '+G.stats.examples+'회 · 맺은 약속 '+G.stats.pactsMade+'회 · 깨진 약속 '+G.stats.pactBroken+'회</p>';
  }else{
    function row(l,sub,btn){return'<div class="setrow"><div>'+l+(sub?'<small>'+sub+'</small>':'')+'</div>'+btn+'</div>';}
    h+=row('효과음','','<button type="button" class="tg" data-set="sound" aria-pressed="'+set.sound+'">'+(set.sound?'켜짐':'꺼짐')+'</button>');
    h+=row('진동','지원하는 기기에서만','<button type="button" class="tg" data-set="haptic" aria-pressed="'+set.haptic+'">'+(set.haptic?'켜짐':'꺼짐')+'</button>');
    h+=row('전투 연출','병력이 날아가 부딪히는 장면','<button type="button" class="tg" data-set="anim" aria-pressed="'+(set.anim!==false)+'">'+(set.anim!==false?'켜짐':'꺼짐')+'</button>');
    h+=row('처음 안내','게임 방법을 다시 본다','<button type="button" class="tg" data-intro="1">보기</button>');
    h+=row('지도 No.'+String(G.mseed%10000),'같은 지도로 처음부터 다시 · 지금 판은 사라진다','<button type="button" class="tg" data-again="1">다시</button>');
    h+=row('난이도','다음 새 게임부터 적용 · 어려움은 수입 −10%, 이웃 증원 증가',
      '<div class="seg" style="width:128px;height:34px"><button type="button" data-diff="0" aria-pressed="'+(set.diff===0)+'">보통</button><button type="button" data-diff="1" aria-pressed="'+(set.diff===1)+'">어려움</button></div>');
    h+=row('발을 씻는다','8번째 밤부터 · ¥80','<button type="button" class="tg" data-leave="1"'+(canLeave(G)?'':' disabled')+'>떠난다</button>');
    h+=row('새 게임',ui.confirmNew?'지금 판은 사라진다. 한 번 더 누르면 시작한다.':'지금 판을 접고 처음부터','<button type="button" class="tg" data-new="1" aria-pressed="'+ui.confirmNew+'">'+(ui.confirmNew?'정말 시작':'새로 시작')+'</button>');
  }
  return h;
}

/* ---------- 작전실 ---------- */
function opsOverview(){
  var bg=budget(G),goal=G.goal,left=Math.max(0,MAXDAY-G.day);
  var best=-1;G.crew.forEach(function(c,i){if(c.alive&&(best<0||c.loy>G.crew[best].loy))best=i;});
  var cohesion=Math.max(0,Math.min(5,Math.ceil((100-G.anx)/20)));
  var fist='';for(var i=0;i<5;i++)fist+='<svg class="coh'+(i<cohesion?' on':'')+'" viewBox="0 0 24 24" aria-hidden="true">'+GICON.anx+'</svg>';
  var coh=G.anx>=70?'조직이 흔들린다. 가면이 갈라지고 있다.':(G.anx>=40?'센 척이 점점 무겁다. 틈이 보이기 시작한다.':'조직은 단단하다. 동요가 거의 없다.');
  return'<div class="ov"><div class="hero-wrap">'+heroSvg()+'<span class="hero-tag">우리 조직</span></div>'+
    '<div class="ocards"><div class="ocard"><h3>밤의 균형</h3>'+(best>=0?'<div class="opt">'+crewBust(best)+'</div>':'')+'<div class="orow"><span>임무</span><b>'+(goal?esc(goal.text):'서른 밤을 버틴다')+'</b></div>'+
    '<div class="orow"><span>기간</span><b>'+Math.min(G.day,MAXDAY)+'번째 밤 · 남은 '+left+'밤</b></div>'+
    '<div class="orow"><span>오른팔</span><b>'+(best>=0?CREW[best].name+' ('+CREW[best].role+')':'없음')+'</b></div>'+
    '<div class="orow"><span>밤 예산</span><b>수입 ¥'+bg.inc+' − 유지비 ¥'+bg.up+' = <em class="'+(bg.net>=0?'pos':'neg')+'">'+(bg.net>=0?'+':'−')+'¥'+Math.abs(bg.net)+'</em></b></div></div>'+
    '<div class="ocard"><h3>조직의 결속</h3><p class="cohtxt">'+coh+'</p><div class="cohrow">'+fist+'</div></div></div></div>';
}
function opsTech(br){
  var list=branchTechs(br);
  var sel=list.filter(function(t){return t.id===ui.tsel;})[0];
  if(!sel)sel=list.filter(function(t){return techState(G,t)==='can';})[0]||list.filter(function(t){return techState(G,t)!=='own'&&techState(G,t)!=='locked';})[0]||list[0];
  ui.tsel=sel.id;
  var st=techState(G,sel),can=!G.over&&!G.pend;
  var pre=sel.pre?TECH.filter(function(t){return t.id===sel.pre;})[0]:null;
  var note='';
  if(st==='own')note='<p class="tgood">이미 갖췄다.</p>';
  else if(st==='locked')note='<p class="twarn">먼저 "'+pre.name+'"이(가) 필요하다.</p>';
  else if(G.money<sel.cost)note='<p class="twarn">자금이 모자란다. (¥'+sel.cost+' 필요)</p>';
  if(sel.heat&&st!=='own')note+='<p class="theat">사자마자 경계 +'+sel.heat+'</p>';
  var dis=!(st==='can'&&can);
  return'<div class="techwrap"><div class="treepane">'+techTreeSvg(br,sel.id)+'</div>'+
    '<div class="tdetail"><h3>'+sel.name+'</h3><div class="tbr">'+['기반','무력','은폐'][br]+' 갈래 · '+(st==='own'?'보유':'¥'+sel.cost)+'</div>'+
    '<p class="ttxt">'+sel.text+'</p>'+note+
    '<button type="button" class="buy" data-buy="'+sel.id+'"'+(dis?' disabled':'')+'>'+(st==='own'?'보유 중':'구매 −¥'+sel.cost)+'</button></div></div>';
}
function opsBars(){
  var bg=budget(G),press=clamp(Math.round(bg.up/Math.max(1,bg.inc)*100),0,100);
  var minLoy=100,anyCrew=false;G.crew.forEach(function(c){if(c.alive){anyCrew=true;minLoy=Math.min(minLoy,c.loy);}});
  var risk=anyCrew?clamp(Math.round((60-minLoy)/60*100),0,100):0;
  function bar(l,ic,v,cls,sub){return'<div class="obar '+cls+'"><div class="ol">'+ic+'<span>'+l+'</span></div><div class="otrack"><span style="width:'+v+'%"></span></div><small class="osub">'+sub+'</small></div>';}
  return bar('유지비 압박','<svg viewBox="0 0 24 24">'+I_COIN+'</svg>',press,press>=80?'bad':(press>=55?'warn':''),'수입 대비 병력 유지비 '+press+'%')+
    bar('이탈 위험','<svg viewBox="0 0 24 24">'+I_MEN+'</svg>',risk,risk>=60?'bad':(risk>=30?'warn':''),anyCrew?'가장 낮은 부하 믿음 '+minLoy:'남은 부하 없음');
}
function renderOps(){
  var on=ui.sheet==='ops',el=$('ops');
  el.hidden=!on;
  if(!on)return;
  $('opsTabs').innerHTML=OPS_TABS.map(function(p){return'<button type="button" class="otab" data-ops="'+p[0]+'" aria-pressed="'+(ui.ops===p[0])+'">'+p[1]+'</button>';}).join('')+
    '<button type="button" class="oclose" id="opsClose" aria-label="닫기"><svg viewBox="0 0 24 24"><path d="M5 5l14 14M19 5L5 19"/></svg></button>';
  $('opsBody').innerHTML=ui.ops==='over'?opsOverview():opsTech(OPS_BR[ui.ops]);
  $('opsFoot').innerHTML=opsBars();
}
var lastSheet=null;
function renderSheet(){
  var s=ui.sheet,sh=(s&&s!=='ops')?s:null;
  $('scrim').classList.toggle('on',!!sh);$('sheet').classList.toggle('on',!!sh);
  renderOps();
  if(!sh){lastSheet=null;return;}
  var sb=$('shBody'),keep=(lastSheet===sh)?sb.scrollTop:0;
  $('shTitle').textContent=SHEET_TITLES[sh];
  sb.innerHTML=({crew:sheetCrew,dip:sheetDip,log:sheetLog,more:sheetMore,gauge:sheetGauge})[sh]();
  sb.scrollTop=keep;lastSheet=sh;
}
