/* ========== 알아서(자동 진행) · 알림 · 숫자 연출 · 부재 수입 ========== */
var autoT=0,mnT=0,hiddenAt=0;

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

/* ---- 이벤트를 참모 추천대로 ---- */
function decideAuto(){
  var p=G.pend;if(!p)return;
  var res=(p.type==='rule')?actRule(G,recommendRule(G,p.opts)):actScene(G,recommendChoice(G,p));
  if(res&&res.ok){undoStack=[];toast('참모가 정했다','auto');}
  if(res)afterAct(res,'tap');
}

/* ---- 알아서: 수를 두고 → 밤을 넘기고 → 반복. 이벤트·시트가 열리면 기다린다 ---- */
function setAuto(on,quiet){
  on=!!on;
  if(ui.auto===on)return;
  ui.auto=on;clearTimeout(autoT);
  if(on){
    ui.sel=-1;ui.mode='move';ui.peek=-1;setHint('',false);
    sfx('sel');buzz(12);
    if(!quiet)toast('알아서 시작 · 이벤트에서는 멈춘다','auto');
    autoT=setTimeout(autoTick,300);
  }else if(!quiet){toast('직접 두기','dim');}
  render();
}
function autoWait(ms){autoT=setTimeout(autoTick,ms);}
function autoTick(){
  clearTimeout(autoT);
  if(!ui.auto)return;
  if(G.over){ui.auto=false;render();return;}
  if(document.hidden||ui.busy||ui.recap||ui.intro||ui.sheet){autoWait(450);return;}
  if(G.pend){
    if(set.autoEv){decideAuto();autoWait(900);}else autoWait(450);
    return;
  }
  var gap=set.fast?240:430,p=autoPlan(G);
  if(p&&(p.free||G.ap>0)){
    var res=act(function(){return p.run(G);},p.kind==='move'?undefined:'coin');
    if(!res.ok){endTonight();autoWait(700);return;}
    autoWait(gap);
  }else{
    endTonight();autoWait(set.fast?500:800);
  }
}
/* 직접 손을 대면 자동은 멈춘다 */
['map','dock','amt','bEnd','bUndo'].forEach(function(id){
  $(id).addEventListener('click',function(){if(ui.auto)setAuto(false,true);},true);
});

/* ---- 부재 수입: 앱을 닫았다 돌아오면 금고에 돈이 쌓여 있다 ---- */
function claimIdle(awayMs){
  var g=idleReward(G,awayMs);
  if(g>0){note('자리를 비운 사이 금고에 +¥'+g,'gold');render();}
}
document.addEventListener('visibilitychange',function(){
  if(document.hidden){hiddenAt=Date.now();if(G)saveGame();return;}
  if(G&&!G.over&&hiddenAt){claimIdle(Date.now()-hiddenAt);}
  hiddenAt=0;
  if(ui.auto){clearTimeout(autoT);autoWait(500);}
});
