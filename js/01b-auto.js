/* ========== 알아서(참모 자동 지휘) · 추천 · 도장 · 등급 · 부재 수입 ==========
   손가락 몇 번으로 한 판을 끝낼 수 있게 하는 방치형 장치들. DOM을 건드리지 않으므로 sim.js에서도 돌 수 있다. */

/* ---------- 도장: 땅이 늘 때마다 한 번씩 주는 큰 보상 ---------- */
var MILES=[{land:5,money:15,dread:3},{land:8,money:22,dread:3},{land:11,money:30,dread:4}];
function checkMiles(s){
  var n=owned(s,0).length;
  MILES.forEach(function(m){
    if(n<m.land||s.mile.indexOf(m.land)>=0)return;
    s.mile.push(m.land);s.money+=m.money;adjv(s,'dread',m.dread);
    say(s,'땅 '+m.land+'곳 도장. 이름이 알려졌다. (+¥'+m.money+' · 위세 +'+m.dread+')','big');
    note('도장 · 땅 '+m.land+'곳  +¥'+m.money,'stamp');
  });
}

/* ---------- (테스트용) 자동 플레이 봇: sim.js의 auto 봇이 쓴다. 화면에서는 쓰지 않는다 ----------
   autoPlan(s)는 상태를 바꾸지 않고 "다음 한 수"만 돌려준다. {free:true}면 수를 쓰지 않는 일(강화). */
var TECH_ORDER=['a1','c1','a2','b4','c4','a4','a3','b1','c2','a5','c3','b5','a6','b6','b2','c6','c5','b3'];
function techById(id){return TECH.filter(function(t){return t.id===id;})[0];}
function hostileNear(s,id,except){
  return ADJ[id].some(function(j){var o=s.tiles[j].owner;return j!==except&&o>=1&&!hasPact(s,0,o);});
}
function planOf(kind,run,extra){var p={kind:kind,run:run};for(var k in extra)p[k]=extra[k];return p;}
function autoPlan(s){
  if(s.over||s.pend)return null;
  var sa=strikeAt(s),reserve=12,i;
  /* 1. 강화 · 부하 챙기기 (수를 쓰지 않거나 싸다) */
  for(i=0;i<TECH_ORDER.length;i++){
    var t=techById(TECH_ORDER[i]);
    if(!t||hasTech(s,t.id)||(t.pre&&!hasTech(s,t.pre)))continue;
    if(t.heat>0&&s.heat+t.heat>sa-14)continue;
    if(s.money>=t.cost+reserve)return planOf('tech',(function(id){return function(g){return actTech(g,id);};})(t.id),{free:true});
    break;
  }
  if(s.ap<1)return null;
  var weak=-1;
  s.crew.forEach(function(c,k){if(c.alive&&c.loy<35&&(weak<0||c.loy<s.crew[weak].loy))weak=k;});
  if(weak>=0&&s.money>=6+reserve)return planOf('care',function(g){return actCrew(g,weak,'care');});
  /* 2. 위험하면 몸을 낮춘다 / 위세가 바닥이면 연회 */
  var parts=participants(s);
  if(s.anx>=68||(parts.length>=2&&s.heat>=sa-6)||s.heat>=sa-2)return planOf('lie',function(g){return actLie(g);});
  if(s.dread<26&&s.money>=10+reserve)return planOf('feast',function(g){return actFeast(g);});
  /* 3. 가장 이득인 공격 */
  var bonus=(crewPerk(s,0)?1.1:1)*(s.anx>=70?0.9:1)*(hasTech(s,'b1')?1.08:1)*(hasTech(s,'b3')?1.12:1)*(hasTech(s,'b6')?1.05:1);
  var best=null;
  owned(s,0).forEach(function(t){
    if(t.men<2)return;
    ADJ[t.id].forEach(function(j){
      var v=s.tiles[j];
      if(v.owner===0)return;
      if(v.owner>=1&&(s.dead[v.owner]||hasPact(s,0,v.owner)))return;
      var mode=hostileNear(s,t.id,j)?'half':'all';
      var A=sendAmount(t,mode);if(A<1)return;
      var margin=A*bonus-v.men*1.15*dfac(j);
      if(margin<(v.owner<0?1.2:2.4))return;
      if(v.owner>=1&&s.heat>=55&&!v.hq)return;
      var sc=margin*0.4+v.inc*0.9+(v.hq&&v.owner>=1?14:0)+(v.owner<0?1.5:0)-v.exp*(s.heat>=45?1.2:0.4)+rnd1(s,t.id+j);
      if(!best||sc>best.sc)best={sc:sc,f:t.id,to:j,mode:mode};
    });
  });
  if(best)return planOf('move',function(g){return actMove(g,best.f,best.to,best.mode);},{from:best.f,to:best.to});
  /* 4. 이웃 하나와 휴전 (경계가 높거나 위세가 낮을 때) */
  if(s.day>=3&&(s.heat>=40||s.dread<35)){
    var pick=-1,ps=-9;
    for(var r=1;r<=3;r++){
      if(s.dead[r]||hasPact(s,0,r)||s.refused[r]>0)continue;
      var sc2=s.grudge[r]*2-s.rel[r][0]/20+powerOf(s,r)/20;
      if(sc2>ps){ps=sc2;pick=r;}
    }
    if(pick>0&&s.money>=proposalCost(s,'truce')+reserve)return planOf('truce',function(g){return actPropose(g,pick,'truce');});
  }
  /* 5. 안쪽 땅의 남는 병력을 최전선으로 */
  var mv=null;
  owned(s,0).forEach(function(t){
    if(t.men<3||hostileNear(s,t.id,-1))return;
    ADJ[t.id].forEach(function(j){
      var u=s.tiles[j];
      if(u.owner!==0||u.men>=u.cap)return;
      var front=hostileNear(s,j,-1)||ADJ[j].some(function(q){return s.tiles[q].owner<0;});
      if(!front)return;
      var sc=(u.cap-u.men)+(u.hq?3:0)+t.men*0.3;
      if(!mv||sc>mv.sc)mv={sc:sc,f:t.id,to:j};
    });
  });
  if(mv)return planOf('shift',function(g){return actMove(g,mv.f,mv.to,'half');},{from:mv.f,to:mv.to});
  /* 6. 최전선 모집 */
  if(s.money>=5+reserve/2){
    var rc=null;
    owned(s,0).forEach(function(t){
      if(t.men>=t.cap)return;
      var fr=hostileNear(s,t.id,-1)||ADJ[t.id].some(function(q){return s.tiles[q].owner<0;});
      var sc=(t.cap-t.men)*(fr?2:1)+(t.hq?2:0);
      if(!rc||sc>rc.sc)rc={sc:sc,id:t.id};
    });
    if(rc)return planOf('recruit',function(g){return actRecruit(g,rc.id);});
  }
  return null;
}
/* 판마다 같은 결과가 나오도록 rnd 대신 쓰는 아주 작은 흔들림 */
function rnd1(s,k){return((k*2654435761+s.day*97)%1000)/1000*0.6;}
/* 한 밤 치(남은 수 전부 + 강화)를 규칙만으로 돌린다. 헤드리스 시뮬과 테스트용 */
function autoNight(s){
  var guard=0,p;
  while(guard++<14&&(p=autoPlan(s))){
    var r=p.run(s);
    if(!r||!r.ok)break;
    if(s.over||s.pend)break;
  }
}

/* ---------- 참모 추천: 이벤트 선택지를 가상으로 적용해 보고 가장 낫게 남는 쪽 ---------- */
function stateValue(s){
  var loy=0,n=0;s.crew.forEach(function(c){if(c.alive){loy+=c.loy;n++;}});
  return s.money*0.5+(s.dread<30?(s.dread-30)*1.3:Math.min(s.dread,62)*0.35)
    -s.heat*0.7-Math.max(0,s.heat-48)*0.9-s.anx*0.8-Math.max(0,s.anx-55)*1.3+(n?loy/n*0.12:-8)+s.pacts.length*1.5;
}
function recommendChoice(s,p){
  try{
    var ev=evOf(p,s),best=-1,bv=-1e9;
    ev.choices.forEach(function(ch,i){
      if(ch.cost&&s.money<ch.cost)return;
      var c=JSON.parse(JSON.stringify(s));
      ch.fx(c,c.pend);
      var v=stateValue(c);
      if(v>bv){bv=v;best=i;}
    });
    return best<0?0:best;
  }catch(e){return 0;}
}
function recommendRule(s,opts){
  var loy=0,n=0;s.crew.forEach(function(c){if(c.alive){loy+=c.loy;n++;}});loy=n?loy/n:0;
  var sc={
    tribute:(s.money<30?3:1)+(loy<50?-2:0),
    omerta:s.heat/12+(s.anx>=60?-1:0),
    shield:s.anx/12+(s.money<20?-1:0),
    giri:loy<55?3:1,
    iron:s.dread<40?2.5:0.4
  };
  var best=opts[0];
  opts.forEach(function(id){if((sc[id]||0)>(sc[best]||0))best=id;});
  return best;
}

/* ---------- 등급 · 최고 기록 ---------- */
function scoreOf(s){
  var o=s.over||{},land=owned(s,0).length,day=Math.min(s.day,MAXDAY);
  var sc=day/MAXDAY*20+land/s.tiles.length*90+s.goalsDone*6+Math.min(8,s.stats.pactsMade*2)+Math.min(6,Math.round(s.money/12));
  if(o.type==='survive')sc+=15;
  else if(o.type==='alone')sc+=40;
  else if(o.type==='leave')sc+=8;
  else sc-=6;
  return Math.max(0,Math.round(sc));
}
function gradeOf(sc){return sc>=108?'S':(sc>=90?'A':(sc>=70?'B':(sc>=48?'C':'D')));}

/* ---------- 부재 수입: 자리를 비운 동안 금고에 쌓인 돈 ---------- */
var IDLE_MIN_MS=45000,IDLE_CAP_MIN=20;
function idleReward(s,awayMs){
  if(!s||s.over||awayMs<IDLE_MIN_MS)return 0;
  var min=Math.min(IDLE_CAP_MIN,awayMs/60000),land=owned(s,0).length;
  var g=Math.max(1,Math.round(min*(0.5+land*0.35)));
  s.money+=g;
  say(s,'자리를 비운 사이 금고에 ¥'+g+'이 쌓였다.','good');
  return g;
}
