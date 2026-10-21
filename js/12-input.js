/* ========== 입력 ========== */
$('map').addEventListener('click',function(e){
  if(ui.busy){finishAnim();return;}
  if(ui.recap)return;
  var bb=e.target.closest('[data-bubble]');
  if(bb){var bi=+bb.dataset.bubble;act(function(){return actBubble(G,bi);},'coin');return;}
  var b=e.target.closest('[data-i]');if(!b)return;
  onTile(+b.dataset.i);
});
$('map').addEventListener('keydown',function(e){
  if(e.key!=='Enter'&&e.key!==' ')return;
  var bb=e.target.closest('[data-bubble]');
  if(bb){e.preventDefault();var bi=+bb.dataset.bubble;act(function(){return actBubble(G,bi);},'coin');return;}
  var b=e.target.closest('[data-i]');if(!b)return;
  e.preventDefault();onTile(+b.dataset.i);
});
$('amt').addEventListener('click',function(e){
  var b=e.target.closest('button');if(!b)return;
  ui.amt=b.dataset.amt;sfx('tap');render();
});
$('bRecruit').addEventListener('click',function(){var s=ui.sel;act(function(){return actRecruit(G,s);},'coin');});
$('bExample').addEventListener('click',function(){
  ui.flash={};
  if(ui.mode==='example'){ui.mode='move';setHint('',false);render();return;}
  if(exampleTargets(G,ui.sel).length){ui.mode='example';setHint('',false);sfx('tap');}
  render();
});
$('bFocus').addEventListener('click',function(){
  var id=ui.peek;
  if(id<0||!G.tiles[id]||spreadPower(G,id)<=0)return;
  G.fcs=(G.fcs===id)?-1:id;
  setHint(G.fcs===id?G.tiles[id].name+'으로 영향력이 3배 빨리 번진다.':'집중을 풀었다.',false);
  sfx('sel');buzz(10);render();
});
$('bLie').addEventListener('click',function(){act(function(){return actLie(G);},'night');});
$('bUndo').addEventListener('click',doUndo);
$('bEnd').addEventListener('click',endTonight);
$('bFlow').addEventListener('click',function(){cycleFlow();});
$('chips').addEventListener('click',function(e){
  if(e.target.closest('#rivBtn')){ui.sheet='dip';sfx('tap');render();return;}
  if(!e.target.closest('#goalBtn')||!G.goal)return;
  var g=G.goal,left=Math.max(1,g.end-G.day+1);
  setHint('목표 · '+g.text+' · '+left+'밤 안에 · 보상 ¥'+g.reward+', 위세 +3',false);render();
});
$('top').addEventListener('click',function(){
  var mine=owned(G,0).length;
  setHint('장악 '+mine+'/'+G.tiles.length+'곳 · 왼쪽은 우리 병력, 오른쪽은 이웃 조직들의 병력 합이다.',false);render();
});
$('dateBox').addEventListener('click',function(){
  setHint('밤 '+Math.min(G.day,MAXDAY)+'/'+MAXDAY+' · 남은 수 '+G.ap+'번. 수를 다 쓰면 밤을 넘기자.',false);render();
});
function openGauge(k){ui.gauge=k;ui.sheet='gauge';ui.confirmNew=false;sfx('tap');render();}
document.querySelectorAll('.mt').forEach(function(b){b.addEventListener('click',function(){openGauge(b.dataset.g);});});
$('advisor').addEventListener('click',function(){
  var d=$('advisor').dataset;
  if(d.g)openGauge(d.g);
  else if(d.tab){ui.sheet=d.tab;sfx('tap');render();}
  else{ui.sheet='gauge';ui.gauge='dread';sfx('tap');render();}
});
$('bGear').addEventListener('click',function(){ui.sheet='more';ui.more='set';ui.confirmNew=false;sfx('tap');render();});
$('tabs').addEventListener('click',function(e){
  var b=e.target.closest('.tab');if(!b)return;
  var name=b.dataset.tab;
  ui.sheet=(ui.sheet===name)?null:name;ui.confirmNew=false;ui.confirmBreak=-1;sfx('tap');render();
});
function closeSheet(){ui.sheet=null;ui.confirmNew=false;ui.confirmBreak=-1;render();}
$('scrim').addEventListener('click',closeSheet);
$('shClose').addEventListener('click',closeSheet);
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&ui.sheet)closeSheet();});
$('shBody').addEventListener('click',function(e){
  var b=e.target.closest('button');if(!b||b.disabled)return;
  var d=b.dataset;
  if(d.crew!==undefined){var ci=+d.crew,op=d.op;act(function(){return actCrew(G,ci,op);},'coin');return;}
  if(d.dip){
    var rr=+d.r,kind=d.dip;
    if(kind==='break'){
      if(ui.confirmBreak!==rr){ui.confirmBreak=rr;render();return;}
      ui.confirmBreak=-1;act(function(){return actBreak(G,rr);},'warn');return;
    }
    ui.confirmBreak=-1;
    if(kind==='drink'){act(function(){return actDrink(G,rr);},'coin');return;}
    if(kind==='gift'){act(function(){return actGift(G,rr);},'coin');return;}
    if(kind==='truce'||kind==='ally'){act(function(){return actPropose(G,rr,kind);},'coin');return;}
    if(kind==='discord'){var da=+d.a,db=+d.b;act(function(){return actDiscord(G,da,db);},'coin');return;}
  }
  if(d.flowset){cycleFlow();return;}
  if(d.more){ui.more=d.more;ui.page=0;ui.confirmNew=false;render();return;}
  if(d.page){ui.page+=+d.page;render();return;}
  if(d.again){boot(null,true);return;}
  if(d.intro){ui.sheet=null;ui.intro=true;render();return;}
  if(d.set){set[d.set]=!(set[d.set]!==false);saveSet();if(d.set==='sound')sfx('tap');render();return;}
  if(d.diff!==undefined){set.diff=+d.diff;saveSet();render();return;}
  if(d.leave){ui.sheet=null;act(function(){return actLeave(G);},'night');return;}
  if(d.new){if(!ui.confirmNew){ui.confirmNew=true;render();return;}boot(null);return;}
});
$('ops').addEventListener('click',function(e){
  if(e.target.closest('#opsClose')){closeSheet();return;}
  var tb=e.target.closest('[data-ops]');
  if(tb){ui.ops=tb.dataset.ops;ui.tsel=null;sfx('tap');render();return;}
  var hx=e.target.closest('[data-tech]');
  if(hx){ui.tsel=hx.dataset.tech;sfx('tap');render();return;}
  var by=e.target.closest('[data-buy]');
  if(by&&!by.disabled){var tid=by.dataset.buy;act(function(){return actTech(G,tid);},'coin');}
});
$('ops').addEventListener('keydown',function(e){
  if(e.key!=='Enter'&&e.key!==' ')return;
  var hx=e.target.closest('[data-tech]');
  if(hx){e.preventDefault();ui.tsel=hx.dataset.tech;render();}
});
$('modal').addEventListener('click',function(e){
  var b=e.target.closest('button');if(!b||b.disabled)return;
  if(b.id==='bRestart'){boot(null);return;}
  if(b.id==='bRetry'){boot(null,true);return;}
  if(b.id==='bIntro'){ui.intro=false;lsSet(SEEN_KEY,'1');sfx('tap');render();return;}
  var res=null;
  if(b.dataset.scene!==undefined)res=actScene(G,+b.dataset.scene);
  else if(b.dataset.rule)res=actRule(G,b.dataset.rule);
  if(res){undoStack=[];afterAct(res,'tap');}
});
$('recap').addEventListener('click',closeRecap);
