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
$('bFeast').addEventListener('click',function(){act(function(){return actFeast(G);},'coin');});
$('bLie').addEventListener('click',function(){act(function(){return actLie(G);},'night');});
$('bDrink').addEventListener('click',function(){ui.sheet='drink';sfx('tap');render();});
$('bUndo').addEventListener('click',doUndo);
$('bEnd').addEventListener('click',endTonight);
$('tick').addEventListener('click',function(e){
  if(!e.target.closest('#goalBtn')||!G.goal)return;
  var g=G.goal,left=Math.max(1,g.end-G.day+1);
  setHint('목표 · '+g.text+' · '+left+'밤 안에 · 보상 ¥'+g.reward+', 위압 +3',false);render();
});
document.querySelectorAll('.g').forEach(function(b){
  b.addEventListener('click',function(){
    var k=b.dataset.g;setHint(k==='dread'?dreadNote(G.dread):(k==='heat'?heatNote(G.heat):anxNote(G.anx)),false);render();
  });
});
$('tabs').addEventListener('click',function(e){
  var b=e.target.closest('.tab');if(!b)return;
  var name=b.dataset.tab;
  ui.sheet=(ui.sheet===name)?null:name;ui.confirmNew=false;sfx('tap');render();
});
function closeSheet(){ui.sheet=null;ui.confirmNew=false;render();}
$('scrim').addEventListener('click',closeSheet);
$('shClose').addEventListener('click',closeSheet);
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&ui.sheet)closeSheet();});
$('shBody').addEventListener('click',function(e){
  var b=e.target.closest('button');if(!b||b.disabled)return;
  var d=b.dataset;
  if(d.crew!==undefined){var ci=+d.crew,op=d.op;act(function(){return actCrew(G,ci,op);},'coin');return;}
  if(d.tech){var tid=d.tech;act(function(){return actTech(G,tid);},'coin');return;}
  if(d.drink){var rr=+d.drink;ui.sheet=null;act(function(){return actDrink(G,rr);},'coin');return;}
  if(d.more){ui.more=d.more;ui.page=0;ui.confirmNew=false;render();return;}
  if(d.page){ui.page+=+d.page;render();return;}
  if(d.again){boot(null,true);return;}
  if(d.set){set[d.set]=!(set[d.set]!==false);saveSet();if(d.set==='sound')sfx('tap');render();return;}
  if(d.diff!==undefined){set.diff=+d.diff;saveSet();render();return;}
  if(d.leave){ui.sheet=null;act(function(){return actLeave(G);},'night');return;}
  if(d.new){if(!ui.confirmNew){ui.confirmNew=true;render();return;}boot(null);return;}
});
$('modal').addEventListener('click',function(e){
  var b=e.target.closest('button');if(!b||b.disabled)return;
  if(b.id==='bRestart'){boot(null);return;}
  if(b.id==='bRetry'){boot(null,true);return;}
  var res=null;
  if(b.dataset.scene!==undefined)res=actScene(G,+b.dataset.scene);
  else if(b.dataset.rule)res=actRule(G,b.dataset.rule);
  if(res){undoStack=[];afterAct(res,'tap');}
});
$('recap').addEventListener('click',closeRecap);
