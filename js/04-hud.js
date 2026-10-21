/* ========== 상단 · 세로 게이지 · 칩 · 참모 조언 ========== */
function peopleSvg(kind){
  return'<svg class="ppl '+kind+'" viewBox="0 0 46 26" aria-hidden="true">'+
    '<circle cx="9" cy="8" r="4"/><path d="M2 23c0-5.4 3.2-8.6 7-8.6s7 3.2 7 8.6z"/>'+
    '<circle cx="23" cy="6.4" r="4.6"/><path d="M15 23c0-6 3.6-9.6 8-9.6s8 3.6 8 9.6z"/>'+
    '<circle cx="37" cy="8" r="4"/><path d="M30 23c0-5.4 3.2-8.6 7-8.6s7 3.2 7 8.6z"/>'+
    (kind==='me'?'<path class="sg" d="M40 3h6M43 0v6"/>':'<path class="sg" d="M41 1l5 5M46 1l-5 5"/>')+'</svg>';
}
function enemyMen(){
  var n=0;G.tiles.forEach(function(t){if(t.owner>=1)n+=t.men;});return n;
}
function renderTop(){
  var mine=owned(G,0),men=0;
  mine.forEach(function(t){men+=t.men;});
  var pct=Math.round(mine.length/G.tiles.length*100);
  $('top').innerHTML='<div class="pill l" title="우리 병력">'+peopleSvg('me')+'<b>'+men+'</b></div>'+
    '<div class="mainbar" role="img" aria-label="장악 '+pct+'%"><span class="mfill" style="width:'+pct+'%"></span><span class="mlabel">장악 '+pct+'%</span></div>'+
    '<div class="pill r" title="이웃 병력">'+'<b>'+enemyMen()+'</b>'+peopleSvg('foe')+'</div>';
  var dots='';for(var i=0;i<AP_MAX;i++)dots+='<i class="'+(i<G.ap?'on':'')+'"></i>';
  $('dateBox').innerHTML='<span class="dl"><span>밤</span><b>'+Math.min(G.day,MAXDAY)+'</b><i>/'+MAXDAY+'</i></span><span class="ap-dots" aria-label="남은 수 '+G.ap+'">'+dots+'</span><span class="tbar" aria-hidden="true"><i id="tbarI"></i></span>';updateBar();
}

/* ---- 게이지 풀이 ---- */
var GAUGE={
  dread:{n:'위세',tag:'이웃이 우리를 얼마나 두려워하나',
    what:'이웃 조직이 우리를 무서워하는 정도입니다. 높을수록 이웃이 함부로 덤비지 못하고, 휴전·동맹 제의도 잘 받아 줍니다. 낮으면 얕보고 땅을 갉아먹으러 옵니다.',
    up:['땅을 차지한다 (영향력이 번져도 조금 오른다)','본보기 · 이웃 땅 점령','목표를 이룬다'],
    down:['땅을 잃거나 공격이 막힌다','밤이 지나면 저절로 조금씩 식는다','동요가 높으면 더 샌다'],
    zones:function(){return[['bad','28 미만','얕보인다. 이웃이 땅을 노린다.'],['','28~55','안정권. 밤마다 조금씩 식는다.'],['warn','55 이상','두려움은 크지만 경계도 함께 오른다.']];}},
  heat:{n:'경계',tag:'이웃이 우리를 얼마나 위협으로 보나',
    what:'우리가 너무 커지면 이웃들이 서로 손을 잡습니다. 높을수록 "저놈부터 치자"는 동맹이 생기고, 선을 넘으면 동맹한 이웃이 같은 밤에 한꺼번에 덤빕니다.',
    up:['땅을 넓힌다 (특히 이웃 땅)','위세가 높다','본보기 · 무력 강화'],
    down:['숨 죽이기','술자리 · 휴전 · 동맹 (동맹 하나당 매밤 −2)','입단속 강화 · 숲 땅'],
    zones:function(){var sa=strikeAt(G);return[['','55 미만','각자 제 몫만 챙긴다. 이웃끼리 싸우기도 한다.'],['warn','55~'+sa,'이웃들 사이에 동맹 이야기가 돈다.'],['bad',sa+' 이상','동맹한 이웃이 같은 밤에 덤빈다.']];}},
  anx:{n:'동요',tag:'조직 안의 불안 · 센 척의 값',
    what:'우리 조직 안쪽의 흔들림입니다. 높으면 가면이 갈라져 위세가 새고 싸움이 무뎌지며, 100이 되면 조직이 스스로 무너집니다.',
    up:['땅을 빼앗기거나 본보기를 쓴다','가혹한 선택','경계가 55 이상이면 매밤 오른다'],
    down:['숨 죽이기','자비로운 선택 · 부하 챙기기','법·변호사 강화'],
    zones:function(){return[['','40 미만','아직은 태연한 척할 수 있다.'],['warn','40~70','센 척이 점점 무겁다.'],['bad','70 이상','가면이 갈라진다. 위세가 새고 공격이 10% 약해진다.']];}}
};
function dreadNote(d){
  if(d<28)return'위세 '+Math.round(d)+' · 얕보인다. 이웃이 땅을 갉아먹기 시작한다.';
  if(d>=55)return'위세 '+Math.round(d)+' · 두려움이 커질수록 경계도 함께 커진다.';
  return'위세 '+Math.round(d)+' · 안정권이다. 하지만 밤마다 조금씩 식는다.';
}
function heatNote(h){
  var base='경계 '+Math.round(h)+' · ';
  if(h>=strikeAt(G))return base+'동맹한 이웃이 오늘 밤 안에 덤빌 수 있다.';
  if(h>=55)return base+'조직들 사이에 동맹 이야기가 돈다.';
  if(h>=35)return base+'이웃의 눈초리가 달라졌다.';
  return base+'아직은 각자 제 몫만 챙긴다.';
}
function anxNote(a){
  var base='동요 '+Math.round(a)+' · ';
  if(a>=70)return base+'가면이 갈라진다. 위세가 새고 싸움이 무뎌진다.';
  if(a>=40)return base+'센 척이 점점 무겁다.';
  return base+'아직은 태연한 척할 수 있다.';
}
function renderGauges(){
  var sa=strikeAt(G);
  function zone(id,bot,hgt){var z=$(id);if(z){z.style.bottom=bot+'%';z.style.height=hgt+'%';}}
  var dz=document.querySelectorAll('#gDread .zone'),az=document.querySelectorAll('#gAnx .zone');
  dz[0].style.bottom='0';dz[0].style.height='28%';dz[1].style.bottom='55%';dz[1].style.height='45%';
  az[0].style.bottom='60%';az[0].style.height='10%';az[1].style.bottom='70%';az[1].style.height='30%';
  zone('zHeatW',55,sa-55);zone('zHeatB',sa,100-sa);
  [['dread','gDread'],['heat','gHeat'],['anx','gAnx']].forEach(function(p){
    var k=p[0],box=$(p[1]),v=Math.round(G[k]);
    box.querySelector('.fill').style.height=G[k]+'%';
    box.querySelector('.mv').textContent=v;
    box.classList.toggle('hot',(k==='heat'&&G.heat>=sa)||(k==='anx'&&G.anx>=70)||(k==='dread'&&G.dread<28));
    var de=box.querySelector('.delta'),d=prevV[k]===null?0:v-prevV[k];
    if(d!==0){
      de.textContent=(d>0?'+':'−')+Math.abs(d);
      de.className='delta '+(d>0?'up':'down');
      void de.offsetWidth;
      de.classList.add('show');
    }
    prevV[k]=v;
  });
}

/* ---- 지도 위 칩 (자금 · 목표) ---- */
function renderChips(){
  var g=G.goal,bg=budget(G),h='';
  h+='<div class="chip money" title="자금 / 밤마다 들어오는 순수입"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M9 7.5l3 4 3-4M8.6 12h6.8M8.6 14.6h6.8M12 11.5V17"/></svg><b>'+G.money+'</b><small class="'+(bg.net>=0?'pos':'neg')+'">'+(bg.net>=0?'+':'−')+Math.abs(bg.net)+'/밤</small></div>';
  if(g&&!G.over){var p=goalProgress(G);h+='<button type="button" class="chip goal" id="goalBtn"><b>목표</b><span>'+esc(g.text)+'</span><i>'+p.v+'/'+p.n+'</i></button>';}
  h+='<button type="button" class="chip rivs" id="rivBtn" aria-label="이웃 조직 상태, 누르면 외교">';
  for(var r=1;r<=3;r++){
    var a=attitude(G,r),k=a.k==='ally'||a.k==='calm'?'ok':(a.k==='join'||a.k==='hate'?'bad':(a.k==='grudge'?'warn':(a.k==='dead'?'dead':'')));
    h+='<span class="rvd o'+r+' '+k+'" title="'+ORGS[r].short+' · '+a.t+'">'+markIcon(r)+'</span>';
  }
  h+='</button>';
  $('chips').innerHTML=h;
  tweenMoney(document.querySelector('#chips .money b'));
}
function renderTick(){renderChips();}

/* ---- 참모 조언: 지금 뭘 하면 좋을지 한 줄로 ---- */
function advice(s){
  if(s.over)return null;
  if(s.pend)return{k:'info',t:'먼저 결정을 내려야 합니다.'};
  var parts=participants(s);
  if(s.heat>=strikeAt(s)&&parts.length>=2)return{k:'bad',t:'동맹한 이웃이 곧 덤빕니다! 숨 죽이기나 휴전으로 경계를 낮추세요.',g:'heat'};
  if(s.anx>=70)return{k:'bad',t:'동요가 위험합니다. 숨 죽이기나 부하 챙기기로 가라앉히세요.',g:'anx'};
  var al=alliesOf(s,0);
  for(var i=0;i<al.length;i++)if(betrayRisk(s,al[i],0)>=0.12)return{k:'warn',t:ORGS[al[i]].short+'의 배신 위험이 높습니다. 선물을 보내거나 병력을 모으세요.',tab:'dip'};
  if(s.offers.length)return{k:'info',t:'이웃이 제안을 보내 왔습니다. 다음 밤에 확인하세요.',tab:'dip'};
  if(s.dread<28)return{k:'warn',t:'위세가 낮아 이웃이 얕봅니다. 땅을 차지하거나 이웃 땅을 쳐서 위세를 올리세요.',g:'dread'};
  if(s.heat>=55)return{k:'warn',t:'경계가 높습니다. 이웃들이 손잡기 시작합니다. 한 곳과 휴전을 맺어 보세요.',g:'heat'};
  if(s.money<8)return{k:'warn',t:'자금이 바닥입니다. 금빛 점을 거두고 땅을 넓혀 수입을 늘리세요.'};
  if(s.ap===0)return{k:'info',t:'오늘의 수를 다 썼습니다. 밤을 넘기세요.'};
  var buy=TECH.some(function(t){return!hasTech(s,t.id)&&(!t.pre||hasTech(s,t.pre))&&s.money>=t.cost;});
  if(buy&&s.money>=40)return{k:'info',t:'자금에 여유가 있습니다. 작전실에서 조직을 강화해 보세요.',tab:'ops'};
  if(s.day>=3&&!s.pacts.length&&[1,2,3].some(function(r){return!s.dead[r];}))return{k:'info',t:'외교로 이웃 하나와 휴전해 보세요. 위협이 하나 줄어듭니다.',tab:'dip'};
  if(s.day<=3)return{k:'info',t:'영향력은 시간이 지나면 저절로 번집니다. 빈 땅을 눌러 "집중"하면 그쪽으로 빨리 번져요.'};
  return{k:'info',t:'내 땅을 눌러 병력을 고른 뒤, 붙은 땅을 눌러 보내세요.'};
}
function renderAdvisor(){
  var a=advice(G),el=$('advisor');
  if(!a){el.hidden=true;return;}
  el.hidden=false;el.className='advisor a-'+a.k;
  el.dataset.g=a.g||'';el.dataset.tab=a.tab||'';
  el.innerHTML='<span class="ak">참모</span><span class="at">'+esc(a.t)+'</span>';
}
