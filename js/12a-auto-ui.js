/* ========== 시간 흐름(영향력 확산) · 알림 · 숫자 연출 · 부재 수입 ==========
   밤이 저절로 흘러가며 영향력이 번진다. 한 밤 = STEP_MS × SPREAD_TICKS (속도 ×1 기준 28초). */
var mnT=0,hiddenAt=0,flowLast=0,STEP_MS=7000;

/* ---- 알림(토스트) ---- */
function toast(t,c){
  var box=$('toasts');if(!box)return;
  var d=document.createElement('div');d.className='toast '+(c||'');d.textContent=t;
  box.appendChild(d);
  while(box.children.length>3)box.removeChild(box.firstChild);
  setTimeout(function(){if(d.parentNode)d.parentNode.removeChild(d);},2300);
}
function drainNotes(){
  if(!NOTES.length)return;
  NOTES.splice(0).slice(-4).forEach(function(n,i){setTimeout(function(){toast(n.t,n.c);},i*240);});
}

/* ---- 자금 숫자가 차오르는 연출 ---- */
function tweenMoney(el){
  if(!el)return;
  var to=G.money;
  if(ui.mShown===null||ui.mShown===to||!fxOn()){ui.mShown=to;el.textContent=to;return;}
  var from=ui.mShown,t0=null;
  cancelAnimationFrame(mnT);
  el.className=to>from?'up':'down';el.textContent=from;
  function f(ts){
    if(t0===null)t0=ts;
    var u=Math.min(1,(ts-t0)/550),v=Math.round(from+(to-from)*(1-(1-u)*(1-u)));
    ui.mShown=v;
    var e2=document.querySelector('#chips .money b');
    if(e2){e2.textContent=v;if(u>=1)e2.className='';}
    if(u<1)mnT=requestAnimationFrame(f);
  }
  mnT=requestAnimationFrame(f);
}

/* ---- 시간 흐름 ---- */
function flowRunning(){
  return ui.flow&&!document.hidden&&!ui.busy&&!ui.recap&&!ui.intro&&!ui.sheet&&!G.pend&&!G.over&&ui.mode!=='example';
}
function updateBar(){
  var i=$('tbarI');if(!i)return;
  i.style.width=Math.min(100,(((G.tickN||0)*STEP_MS+ui.acc)/(STEP_MS*SPREAD_TICKS))*100).toFixed(1)+'%';
}
function flowStep(){
  if((G.tickN||0)<SPREAD_TICKS-1){
    var got=spreadStep(G,1/SPREAD_TICKS);G.tickN=(G.tickN||0)+1;
    got.forEach(function(id){ui.flash[id]='won';ui.pops.push({id:id,t:'번짐',c:'win'});});
    if(got.length){sfx('win');buzz(15);flashClear();fxClear();}
    render();
  }else endTonight();
}
function flowTick(){
  var now=performance.now(),dt=Math.min(300,now-flowLast);flowLast=now;
  if(G&&flowRunning()){
    ui.acc+=dt*(set.speed||1);
    if(ui.acc>=STEP_MS){ui.acc=0;flowStep();}
  }
  updateBar();
}
flowLast=performance.now();
setInterval(flowTick,100);
/* 속도 버튼: ×1 → ×2 → ×3 → 정지 → ×1 */
function cycleFlow(){
  if(!ui.flow){ui.flow=true;set.speed=1;}
  else if((set.speed||1)<3)set.speed=(set.speed||1)+1;
  else ui.flow=false;
  saveSet();sfx('tap');render();
}

/* ---- 부재 수입: 앱을 닫았다 돌아오면 금고에 돈이 쌓여 있다 ---- */
function claimIdle(awayMs){
  var g=idleReward(G,awayMs);
  if(g>0){note('자리를 비운 사이 금고에 +¥'+g,'gold');render();}
}
document.addEventListener('visibilitychange',function(){
  if(document.hidden){hiddenAt=Date.now();if(G)saveGame();return;}
  if(G&&!G.over&&hiddenAt){claimIdle(Date.now()-hiddenAt);}
  hiddenAt=0;
});
