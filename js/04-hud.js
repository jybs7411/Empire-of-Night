/* ========== 상단 · 게이지 · 목표 ========== */
function renderTop(){
  var mine=owned(G,0),men=0,areas=0,cities=0;
  mine.forEach(function(t){men+=t.men;if(t.kind==='area')areas++;else cities++;});
  var dots='';for(var i=0;i<AP_MAX;i++)dots+='<i class="'+(i<G.ap?'on':'')+'"></i>';
  function st(l,v){return'<div class="st"><span>'+l+'</span><b>'+v+'</b></div>';}
  $('top').innerHTML='<div class="day"><span>밤</span><b>'+Math.min(G.day,MAXDAY)+'</b><i>/'+MAXDAY+'</i></div>'+
    '<div class="stats">'+st('자금','¥'+G.money)+st('병력',men)+st('구역',areas)+st('도시',cities)+'</div>'+
    '<div class="ap" aria-label="남은 수 '+G.ap+'"><span>수</span><div class="ap-dots">'+dots+'</div></div>';
}
function dreadNote(d){
  if(d<28)return'위압 '+Math.round(d)+' · 얕보인다. 이웃이 땅을 갉아먹기 시작한다.';
  if(d>=55)return'위압 '+Math.round(d)+' · 두려움이 커질수록 경계도 함께 커진다.';
  return'위압 '+Math.round(d)+' · 안정권이다. 하지만 밤마다 조금씩 식는다.';
}
function heatNote(h){
  var base='견제 '+Math.round(h)+' · ';
  if(h>=strikeAt(G))return base+'연합이 움직일 수 있다. 오늘 밤 안에 덤빈다.';
  if(h>=55)return base+'조직들 사이에 연합 이야기가 돈다.';
  if(h>=35)return base+'이웃의 눈초리가 달라졌다.';
  return base+'아직은 각자 제 몫만 챙긴다.';
}
function anxNote(a){
  var base='불안 '+Math.round(a)+' · ';
  if(a>=70)return base+'가면이 갈라진다. 위압이 새고 싸움이 무뎌진다.';
  if(a>=40)return base+'센 척이 점점 무겁다.';
  return base+'아직은 태연한 척할 수 있다.';
}
function renderGauges(){
  var sa=strikeAt(G);
  $('zHeatW').style.left='55%';$('zHeatW').style.width=(sa-55)+'%';
  $('zHeatB').style.left=sa+'%';$('zHeatB').style.width=(100-sa)+'%';
  [['dread','gDread'],['heat','gHeat'],['anx','gAnx']].forEach(function(p){
    var k=p[0],box=$(p[1]),v=Math.round(G[k]);
    box.querySelector('.fill').style.width=G[k]+'%';
    box.querySelector('.pin').style.left=G[k]+'%';
    box.querySelector('.gv b').textContent=v;
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
function renderTick(){
  var g=G.goal,f=forecast(G),h='';
  if(g&&!G.over){var p=goalProgress(G);h+='<button type="button" class="goal" id="goalBtn"><b>목표</b>'+esc(g.text)+' <i>'+p.v+'/'+p.n+'</i></button>';}
  else h+='<span class="goal"></span>';
  h+='<span class="fc l'+f.lvl+'">'+esc(f.t)+'</span>';
  $('tick').innerHTML=h;
}
