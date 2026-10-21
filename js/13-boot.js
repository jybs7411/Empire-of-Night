/* ========== 시작 ========== */
function migrate(g){
  if(g.diff===undefined)g.diff=0;
  if(g.streak===undefined)g.streak=0;
  if(g.bestStreak===undefined)g.bestStreak=0;
  if(g.goalsDone===undefined)g.goalsDone=0;
  if(!g.goal)newGoal(g);
  if(!g.mile)g.mile=[];
  return g;
}
function boot(data,again){
  finishAnim(true);ui.busy=false;ui.hold=null;ui.peek=-1;BATTLES.length=0;
  var ok=false;
  if(data&&data.tiles&&data.rs!==undefined&&data.mseed!==undefined&&data.crew&&data.rules&&data.tech&&!data.over){
    try{genMap(data.mseed,data.mw);ok=data.tiles.length===NODES.length;}catch(e0){ok=false;}
  }
  var away=0;
  if(ok){G=migrate(data);away=data.seenAt?Date.now()-data.seenAt:0;}
  else{
    DIFF=set.diff;
    var ms=(again&&G&&G.mseed!==undefined)?G.mseed:undefined;
    G=newGame((Math.random()*4294967296)>>>0,ms,(again&&G&&G.mw)?G.mw:undefined);
  }
  ui.auto=false;ui.mShown=null;ui.recKey='';
  if(ok){var ig=idleReward(G,away);if(ig>0)note('자리를 비운 사이 금고에 +¥'+ig,'gold');}
  ui.sel=-1;ui.mode='move';ui.msg='';ui.err=false;ui.flash={};ui.focus=null;ui.sheet=null;ui.recap=null;ui.pops=[];ui.shot=null;ui.confirmNew=false;ui.ops='over';ui.tsel=null;ui.confirmBreak=-1;ui.intro=!lsGet(SEEN_KEY)&&!ok;
  undoStack=[];
  prevV.dread=null;prevV.heat=null;prevV.anx=null;
  $('modal').dataset.key='';$('modal').hidden=true;$('modal').innerHTML='';$('recap').hidden=true;$('recap').innerHTML='';
  render();
}
try{
  var saved=null,raw=lsGet(SAVE_KEY);
  if(raw){try{saved=JSON.parse(raw);}catch(e2){saved=null;}}
  var hot=window.claude&&window.claude.hot;
  if(hot&&hot.snapshot)hot.snapshot(function(){return G;});
  if(hot&&hot.ready)hot.ready(function(d){boot(d||saved);});
  else boot((hot&&hot.data)?hot.data:saved);
}catch(err){boot(null);}
