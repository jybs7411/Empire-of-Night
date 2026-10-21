/* ========== 영향력 확산 (Rebel Inc식) ==========
   시간이 흐르면 내 땅과 붙은 주인 없는 땅으로 영향력이 저절로 번져, 가득 차면 그 땅이 우리 것이 된다.
   플레이어는 "집중"으로 번질 방향을 짚어 줄 뿐이다. 이웃 조직의 땅은 번지지 않고 병력으로 쳐야 한다.
   한 밤은 SPREAD_TICKS번으로 나뉘어 화면에서 조금씩 번지고, 남은 몫은 밤을 넘길 때 한꺼번에 반영된다.
   DOM을 건드리지 않아 sim.js에서도 그대로 돈다. */
var SPREAD_TICKS=4,FOCUS_MUL=3,FOCUS_OTHER=0.6;

/* 한 밤 동안 이 땅에 쌓이는 영향력 (내 땅이 붙어 있을수록, 병력이 많을수록 세다) */
function spreadPower(s,id){
  var v=s.tiles[id];
  if(!v||v.owner!==-1)return 0;
  var p=0;
  ADJ[id].forEach(function(j){
    var u=s.tiles[j];
    if(u.owner===0)p+=0.6+Math.min(6,u.men)*0.12+u.inc*0.04;
  });
  if(p<=0)return 0;
  p*=0.8+s.dread/250;
  if(s.fcs>=0&&s.tiles[s.fcs]&&s.tiles[s.fcs].owner===-1)p*=(s.fcs===id)?FOCUS_MUL:FOCUS_OTHER;
  return p;
}
/* 이 땅을 차지하는 데 필요한 영향력 */
function spreadNeed(s,id){
  var v=s.tiles[id];
  return 2.2+v.men*0.5*dfac(id)+(NODES[id].ter==='mtn'?0.8:0);
}
/* 영향력을 frac(0~1)만큼 번지게 한다. 새로 차지한 땅 번호들을 돌려준다 */
function spreadStep(s,frac){
  var got=[];
  s.tiles.forEach(function(v){
    if(v.owner!==-1)return;
    var p=spreadPower(s,v.id);
    if(p<=0)return;
    s.sp[v.id]=(s.sp[v.id]||0)+p*frac;
    if(s.sp[v.id]<spreadNeed(s,v.id))return;
    got.push(v.id);
  });
  got.forEach(function(id){
    var v=s.tiles[id];
    v.owner=0;v.men=Math.max(1,Math.ceil(v.men*0.5));
    delete s.sp[id];
    if(s.fcs===id)s.fcs=-1;
    s.stats.taken++;s.stats.spread++;
    adjv(s,'dread',1);adjv(s,'heat',Math.max(0,v.exp-(hasTech(s,'c6')?1:0))*0.6);
    say(s,'영향력이 번졌다. '+eul(v.name)+' 차지했다.','good');
    note('영향력이 번졌다 · '+v.name,'gold');
  });
  if(got.length)checkMiles(s);
  return got;
}
/* 밤을 넘길 때 아직 번지지 않은 몫을 마저 반영한다 */
function spreadRest(s){
  var left=(SPREAD_TICKS-(s.tickN||0))/SPREAD_TICKS;
  s.tickN=0;
  return spreadStep(s,left);
}
/* 이 땅이 차지되기까지 대략 남은 밤 (화면 안내용) */
function spreadEta(s,id){
  var p=spreadPower(s,id);if(p<=0)return 0;
  return Math.max(0.1,(spreadNeed(s,id)-(s.sp[id]||0))/p);
}
