/* ========== 행동 처리 ========== */
function render(){
  renderTop();renderGauges();renderTick();renderMap();renderInfo();renderActions();renderTabs();renderSheet();renderModal();renderRecap();saveGame();
}
var fxT=null,flT=null;
function fxClear(){clearTimeout(fxT);fxT=setTimeout(function(){ui.pops=[];ui.shot=null;renderMap();},1500);}
function flashClear(){var fl=ui.flash;clearTimeout(flT);flT=setTimeout(function(){if(ui.flash===fl){ui.flash={};renderMap();}},2000);}
function shake(){var w=$('mapwrap');w.classList.remove('shake');void w.offsetWidth;w.classList.add('shake');}
function snapHold(){var h={};G.tiles.forEach(function(t){h[t.id]={owner:t.owner,men:t.men};});return h;}
function outcome(res,kind,animated){
  if(res.from!==undefined){
    if(res.move){if(!animated)ui.shot={from:res.from,to:res.to,c:'mv'};ui.pops.push({id:res.to,t:'+'+res.A,c:'mv'});sfx('tap');}
    else if(res.win){if(!animated)ui.shot={from:res.from,to:res.to,c:'win'};ui.pops.push({id:res.to,t:'점령',c:'win'});sfx('win');buzz([20,40,20]);}
    else{if(!animated)ui.shot={from:res.from,to:res.to,c:'lose'};ui.pops.push({id:res.to,t:'막힘 −'+res.lossA,c:'lose'});sfx('lose');buzz(70);shake();}
  }else sfx(kind||'tap');
  if(G.over){ui.mode='move';ui.sheet=null;}
}
function afterAct(res,kind,hold){
  if(!res.ok){setHint(res.msg,true);sfx('warn');buzz(20);render();return;}
  setHint(G.lastSay,false);
  ui.pops=[];ui.shot=null;ui.peek=-1;
  var bs=BATTLES.splice(0,BATTLES.length);
  if(res.from!==undefined&&bs.length&&hold&&fxOn()){
    ui.hold=hold;ui.busy=true;
    render();
    playBattles(bs,{fast:!!res.move},function(){
      ui.hold=null;ui.busy=false;
      outcome(res,kind,true);render();fxClear();
    });
    return;
  }
  outcome(res,kind,false);
  render();fxClear();
}
function act(fn,kind){
  finishAnim();
  var before=JSON.stringify(G),hold=snapHold();
  ui.flash={};BATTLES.length=0;
  var res=fn();
  if(res.ok){undoStack.push(before);if(undoStack.length>12)undoStack.shift();}
  afterAct(res,kind,hold);
}
function doUndo(){
  finishAnim();
  if(!undoStack.length||G.over||G.pend)return;
  G=JSON.parse(undoStack.pop());BATTLES.length=0;
  if(ui.sel>=0&&G.tiles[ui.sel].owner!==0)ui.sel=-1;
  ui.mode='move';ui.flash={};ui.pops=[];ui.shot=null;
  setHint('한 수를 물렸다.',false);sfx('tap');render();
}
function onTile(i){
  if(G.over||G.pend)return;
  var t=G.tiles[i];
  ui.focus=i;
  if(ui.mode==='example'){
    var tg=exampleTargets(G,ui.sel),from0=ui.sel;
    ui.mode='move';
    if(tg.indexOf(i)>=0){act(function(){return actExample(G,from0,i);},'lose');return;}
    setHint('본보기를 거두었다.',false);render();return;
  }
  if(ui.sel<0){
    if(t.owner===0){ui.sel=i;ui.peek=-1;setHint('',false);sfx('sel');buzz(8);}
    else{ui.peek=ui.peek===i?-1:i;setHint('',false);sfx('tap');}
    render();return;
  }
  if(i===ui.sel){ui.sel=-1;ui.peek=-1;setHint('',false);sfx('tap');render();return;}
  if(canReach(G,ui.sel,i)){var from=ui.sel,amt=ui.amt;act(function(){return actMove(G,from,i,amt);});return;}
  if(t.owner===0){ui.sel=i;setHint('',false);sfx('sel');buzz(8);render();return;}
  setHint('붙어 있는 곳만 칠 수 있다.',true);sfx('warn');render();
}
function endTonight(){
  if(G.over||G.pend)return;
  finishAnim();
  var hold=snapHold();
  var before=G.tiles.map(function(t){return t.owner;}),logLen=G.log.length;
  ui.mode='move';ui.sheet=null;undoStack=[];ui.pops=[];ui.shot=null;ui.peek=-1;
  BATTLES.length=0;
  endNight(G);
  var bs=BATTLES.splice(0,BATTLES.length);
  ui.flash={};
  var lost=0,rc=null;
  G.tiles.forEach(function(t,i){
    if(before[i]!==t.owner){ui.flash[i]=before[i]===0?'lost':(t.owner===0?'won':'n');if(before[i]===0)lost++;}
  });
  if(ui.sel>=0&&G.tiles[ui.sel].owner!==0)ui.sel=-1;
  setHint('',false);
  if(!G.over){
    var lines=G.log.slice(logLen).filter(function(e){return e.tone!=='sep';}).slice(0,8);
    rc={day:G.day-1,title:lost>0?'빼앗긴 밤':(G.heat>=55?'숨 막히는 밤':'지나간 밤'),lines:lines};
  }
  function fin(){
    ui.hold=null;ui.busy=false;ui.recap=rc;
    sfx(lost>0?'lose':'night');
    if(lost>0){buzz([60,40,60]);shake();}
    render();
    if(!ui.recap)flashClear();
  }
  if(bs.length&&fxOn()){
    var pick=bs.filter(function(b){return b.prev===0;}).concat(bs.filter(function(b){return b.prev!==0;})).slice(0,4);
    ui.hold=hold;ui.busy=true;sfx('night');
    render();
    playBattles(pick,{fast:true,max:4},fin);
  }else fin();
}
function closeRecap(){
  if(!ui.recap)return;
  ui.recap=null;sfx('tap');
  render();flashClear();
}
