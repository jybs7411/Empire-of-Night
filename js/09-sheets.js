/* ========== 시트(탭 팝업) ========== */
var SHEET_TITLES={crew:'부하',tech:'조직 강화',rivals:'이웃 조직',log:'밤의 기록',more:'더보기',drink:'술자리'};
var BRN=['기반','무력','은폐'];
var RULES_TXT=[
  '밤마다 <b>수</b>가 세 번 있다. 내 땅을 눌러 고르고, 붙은 곳을 눌러 병력을 보낸다. <b>전부</b>는 한 명만 남기고 모두, <b>절반</b>은 반만 보낸다.',
  '<b>지도는 새 판마다 새로 만들어진다.</b> 같은 지도를 다시 하려면 더보기에서 고르면 된다. 땅을 눌러 보면 지형과 쓰임이 아래에 나온다.',
  '<b>산악</b>은 방어 +25%, 수입 −1. <b>숲</b>은 방어 +10%에 눈에 띄지 않아, 차지해도 견제가 오르지 않고 가진 밤마다 견제가 가라앉는다. <b>평야</b>는 수입이 크다.',
  '<b>강</b>은 건널 수 없다. 강 건너로 가려면 <b>다리목</b>(방어 +20%)을 거쳐야 한다. 다리목을 쥐면 길을 쥔다. <b>요새</b>는 방어 +35%에 병력을 많이 쌓는다.',
  '<b>역</b>은 내 역끼리 철도로 이어진다. 역에서 다른 내 역을 누르면 한 번에 병력을 옮긴다. 점선이 금빛이 되면 연결된 것이다.',
  '조직마다 <b>표식</b>이 있다. 우리는 <b>불꽃</b>, 하야시구미는 <b>마름모</b>, 쓰키가미카이는 <b>초승달</b>, 구로이누는 <b>송곳니</b>. 땅에는 그 표식이 문양으로 깔리고 이름표 옆에도 찍힌다. 색을 구분하기 어려워도 표식으로 알아본다.',
  '큰 칸은 구역, 동그라미는 도시다. 도시는 작지만 수입이 크다. 본거지는 제 구역 안쪽에 있어서 그 구역을 먼저 빼앗아야 닿는다.',
  '<b>땅이 넓을수록</b> 병력이 절로 늘고 모집도 더 많이 된다. 밤마다 각 땅에 한 명씩 모여 절반 가까이(본거지는 7할)까지 차오른다. 모집은 4곳마다 +1명, 최대 +3명이다. 다만 사람이 늘면 유지비도 는다.',
  '<b>위압</b>이 낮으면 이웃이 얕보고 갉아먹는다. 위압은 밤마다 조금씩 식는다.',
  '위압이 높거나 땅이 넓어지면 <b>견제</b>가 오른다. 견제가 70을 넘으면 조직들이 같은 밤에 손을 잡고 덤빈다.',
  '<b>술자리</b>로 조직 하나를 하룻밤 묶어 두면 연합을 깰 수 있다.',
  '<b>불안</b>은 센 척의 값이다. 70을 넘으면 가면이 갈라져 위압이 새고 싸움이 무뎌진다. 100이 되면 무너진다.',
  '<b>부하</b> 셋은 믿음이 50 이상일 때만 제 몫을 한다. 믿음이 바닥이면 등을 돌린다. 챙기거나 솎아낼 수 있다.',
  '밤이 지나다 보면 <b>법</b>을 세울 때가 오고, 가게 주인이나 아이 같은 <b>약한 사람</b>과 마주치는 밤이 온다. 정답은 없다.',
  '<b>조직 강화</b>는 기반·무력·은폐 세 갈래다. 자금으로 사고 수는 쓰지 않는다. 무력은 강하지만 눈에 띈다.',
  '지도 위 <b>금빛 점</b>은 그 밤에만 거둘 수 있는 돈이다. 붉은 점은 더 크지만 눈에 띈다. 수는 쓰지 않는다.',
  '연달아 땅을 차지하면 <b>기세</b>가 붙어 위압이 더 오른다. 한 번 막히면 기세가 끊긴다.',
  '5밤마다 <b>목표</b>가 주어진다. 이루면 자금과 위압을 얻고, 놓쳐도 벌은 없다. 화면 위쪽 <b>예보</b>는 오늘 밤의 위험을 알려 준다.',
  '<b>되돌리기</b>는 그 밤에 둔 수를 물린다. 같은 수를 다시 두면 같은 결과가 나온다.',
  '본가를 잃으면 끝이다. 적의 본거지를 점령하면 그 조직은 무너진다.'
];
var RULE_PAGE=4;

function sheetCrew(){
  var h='',can=G.ap>0&&!G.over&&!G.pend;
  G.crew.forEach(function(c,i){
    var d=CREW[i];
    var st=!c.alive?'자리가 비었다':(c.loy>=50?'따르는 중':(c.loy>=25?'눈치 보는 중':'등을 돌릴 낌새'));
    var cls=!c.alive?'dead':(c.loy>=50?'fear':(c.loy>=25?'grudge':'join'));
    h+='<div class="crew'+(c.alive?'':' dead')+'"><div class="r-head"><b>'+d.name+'</b><span class="muted">'+d.role+'</span><em class="chip '+cls+'">'+st+'</em></div>'+
      (c.alive?'<div class="loy" role="img" aria-label="믿음 '+c.loy+'"><span style="width:'+c.loy+'%"></span></div>':'')+
      '<p class="r-trait">'+d.perk+'</p>'+
      (c.alive?'<div class="crew-btns"><button type="button" class="chipbtn" data-crew="'+i+'" data-op="care"'+((can&&G.money>=6)?'':' disabled')+'>챙기기 ¥6</button>'+
        '<button type="button" class="chipbtn" data-crew="'+i+'" data-op="purge"'+(can?'':' disabled')+'>솎아내기</button></div>':'')+'</div>';
  });
  return h;
}
function sheetTech(){
  var can=!G.over&&!G.pend,h='<div class="tech">';
  for(var b=0;b<3;b++){
    h+='<div class="tbr"><h3>'+BRN[b]+'</h3>';
    TECH.forEach(function(t){
      if(t.br!==b)return;
      var own=hasTech(G,t.id),open=!t.pre||hasTech(G,t.pre),afford=G.money>=t.cost;
      var dis=own||!open||!afford||!can;
      h+='<button type="button" class="ti'+(own?' own':'')+((!own&&open&&afford&&can)?' can':'')+'" data-tech="'+t.id+'"'+(dis?' disabled':'')+'>'+
        techIcon(t.id,t.br)+'<b>'+t.name+'</b><span class="tc">'+(own?'갖춤':'¥'+t.cost)+'</span>'+
        '<small>'+t.text+(t.heat?' · 사자마자 견제 +'+t.heat:'')+(!own&&!open?' · 앞선 강화 필요':'')+'</small></button>';
    });
    h+='</div>';
  }
  return h+'</div><p class="tnote">자금으로 사고, 수는 쓰지 않는다. 가진 돈 ¥'+G.money+'</p>';
}
function sheetRivals(){
  var html='';
  for(var r=1;r<=3;r++){
    var o=ORGS[r],ts=owned(G,r),men=0,ar=0,ci=0;
    ts.forEach(function(t){men+=t.men;if(t.kind==='area')ar++;else ci++;});
    var a=attitude(G,r);
    html+='<div class="rv o'+r+(G.dead[r]?' dead':'')+'">'+portrait(r)+'<div class="rb"><div class="r-head">'+markIcon(r)+'<b>'+o.name+'</b><em class="chip '+a.k+'">'+a.t+'</em></div>'+
      '<div class="r-stats">구역 '+ar+' · 도시 '+ci+' · 병력 '+men+'</div><p class="r-trait">'+o.trait+'</p></div></div>';
  }
  return html;
}
function sheetLog(){
  var out='',last=null,n=0;
  for(var i=G.log.length-1;i>=0&&n<10;i--){
    var e=G.log[i];if(e.tone==='sep')continue;
    if(e.day!==last){if(last!==null)out+='</div>';out+='<div class="night"><h3>'+e.day+'번째 밤</h3>';last=e.day;}
    out+='<p class="l '+(e.tone||'')+'">'+esc(e.text)+'</p>';n++;
  }
  if(last!==null)out+='</div>';
  return out||'<p class="empty">아직 기록이 없다.</p>';
}
function sheetDrink(){
  var dc=drinkCost(G),h='<div class="drk">';
  for(var r=1;r<=3;r++){
    h+='<button type="button" class="chipbtn o'+r+'" data-drink="'+r+'"'+((G.ap>0&&G.money>=dc&&!G.dead[r])?'':' disabled')+'><i></i>'+ORGS[r].name+
      '<small>'+(G.dead[r]?'이미 무너진 조직':'견제 −12 · 위압 −4 · 불안 −4 · ¥'+dc+' · 오늘 밤 그쪽을 묶는다')+'</small></button>';
  }
  return h+'</div>';
}
function sheetMore(){
  var h='<div class="subseg">'+[['rules','규칙'],['laws','법·기록'],['set','설정']].map(function(p){
    return'<button type="button" data-more="'+p[0]+'" aria-pressed="'+(ui.more===p[0])+'">'+p[1]+'</button>';}).join('')+'</div>';
  if(ui.more==='rules'){
    var pages=Math.ceil(RULES_TXT.length/RULE_PAGE),pg=clamp(ui.page,0,pages-1);
    RULES_TXT.slice(pg*RULE_PAGE,pg*RULE_PAGE+RULE_PAGE).forEach(function(t){h+='<p class="ru">'+t+'</p>';});
    h+='<div class="pager"><button type="button" class="chipbtn" data-page="-1"'+(pg===0?' disabled':'')+'>이전</button><span>'+(pg+1)+' / '+pages+'</span><button type="button" class="chipbtn" data-page="1"'+(pg>=pages-1?' disabled':'')+'>다음</button></div>';
  }else if(ui.more==='laws'){
    if(!G.rules.length)h+='<p class="empty law">아직 세운 법이 없다. 6번째 밤에 처음으로 정한다.</p>';
    else G.rules.forEach(function(id){var r=RULES[id];h+='<p class="law"><b>'+r.name+'</b><small>'+r.fx+'</small></p>';});
    h+='<p class="tnote">목표 달성 '+G.goalsDone+'회 · 최장 연승 '+G.bestStreak+'회 · 본보기 '+G.stats.examples+'회</p>';
  }else{
    function row(l,sub,btn){return'<div class="setrow"><div>'+l+(sub?'<small>'+sub+'</small>':'')+'</div>'+btn+'</div>';}
    h+=row('효과음','','<button type="button" class="tg" data-set="sound" aria-pressed="'+set.sound+'">'+(set.sound?'켜짐':'꺼짐')+'</button>');
    h+=row('진동','지원하는 기기에서만','<button type="button" class="tg" data-set="haptic" aria-pressed="'+set.haptic+'">'+(set.haptic?'켜짐':'꺼짐')+'</button>');
    h+=row('전투 연출','병력이 날아가 부딪히는 장면','<button type="button" class="tg" data-set="anim" aria-pressed="'+(set.anim!==false)+'">'+(set.anim!==false?'켜짐':'꺼짐')+'</button>');
    h+=row('지도 No.'+String(G.mseed%10000),'같은 지도로 처음부터 다시 · 지금 판은 사라진다','<button type="button" class="tg" data-again="1">다시</button>');
    h+=row('난이도','다음 새 게임부터 적용 · 어려움은 수입 −10%, 이웃 증원 증가',
      '<div class="seg" style="width:128px;height:34px"><button type="button" data-diff="0" aria-pressed="'+(set.diff===0)+'">보통</button><button type="button" data-diff="1" aria-pressed="'+(set.diff===1)+'">어려움</button></div>');
    h+=row('발을 씻는다','8번째 밤부터 · ¥80','<button type="button" class="tg" data-leave="1"'+(canLeave(G)?'':' disabled')+'>떠난다</button>');
    h+=row('새 게임',ui.confirmNew?'지금 판은 사라진다. 한 번 더 누르면 시작한다.':'지금 판을 접고 처음부터','<button type="button" class="tg" data-new="1" aria-pressed="'+ui.confirmNew+'">'+(ui.confirmNew?'정말 시작':'새로 시작')+'</button>');
  }
  return h;
}
function renderSheet(){
  var s=ui.sheet;
  $('scrim').classList.toggle('on',!!s);$('sheet').classList.toggle('on',!!s);
  if(!s)return;
  $('shTitle').textContent=SHEET_TITLES[s];
  $('shBody').innerHTML=({crew:sheetCrew,tech:sheetTech,rivals:sheetRivals,log:sheetLog,more:sheetMore,drink:sheetDrink})[s]();
}
