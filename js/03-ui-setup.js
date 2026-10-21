/* ========== 모바일 화면 · 설정 · 소리 ========== */
var $=function(id){return document.getElementById(id);};
var G=null,SAVE_KEY='nb-save-v5',SET_KEY='nb-set-v2',SEEN_KEY='nb-seen-v4',BEST_KEY='nb-best-v1';
var set={sound:true,haptic:true,diff:0,anim:true,speed:1};
function lsGet(k){try{return localStorage.getItem(k);}catch(e){return null;}}
function lsSet(k,v){try{localStorage.setItem(k,v);}catch(e){}}
function lsDel(k){try{localStorage.removeItem(k);}catch(e){}}
(function(){var r=lsGet(SET_KEY);if(r){try{var o=JSON.parse(r);for(var k in o)set[k]=o[k];}catch(e){}}})();
function saveSet(){lsSet(SET_KEY,JSON.stringify(set));}
function saveGame(){if(G&&!G.over){G.seenAt=Date.now();lsSet(SAVE_KEY,JSON.stringify(G));}else lsDel(SAVE_KEY);}

var AC=null;
function tone(f,d,type,vol,when){
  if(!set.sound)return;
  try{
    if(!AC){var C=window.AudioContext||window.webkitAudioContext;if(!C)return;AC=new C();}
    if(AC.state==='suspended')AC.resume();
    var t=AC.currentTime+(when||0),o=AC.createOscillator(),g=AC.createGain();
    o.type=type||'sine';o.frequency.setValueAtTime(f,t);
    g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(vol||0.06,t+0.015);g.gain.exponentialRampToValueAtTime(0.0001,t+d);
    o.connect(g);g.connect(AC.destination);o.start(t);o.stop(t+d+0.03);
  }catch(e){}
}
var SFX={
  tap:function(){tone(520,.06,'triangle',.05);},
  sel:function(){tone(330,.08,'triangle',.06);tone(494,.1,'triangle',.05,.06);},
  win:function(){tone(196,.14,'sawtooth',.05);tone(262,.2,'sawtooth',.05,.1);tone(392,.26,'triangle',.06,.2);},
  lose:function(){tone(180,.2,'square',.04);tone(120,.36,'square',.04,.15);},
  night:function(){tone(110,.6,'sine',.09);tone(82,.9,'sine',.07,.2);},
  hit:function(){tone(150+Math.random()*80,.05,'square',.03);},
  coin:function(){tone(880,.07,'square',.03);tone(1320,.12,'square',.03,.07);},
  warn:function(){tone(140,.25,'sawtooth',.05);}
};
function sfx(n){try{if(SFX[n])SFX[n]();}catch(e){}}
function buzz(p){if(!set.haptic)return;try{if(navigator.vibrate)navigator.vibrate(p);}catch(e){}}

var ui={busy:false,hold:null,peek:-1,sel:-1,mode:'move',amt:'all',msg:'',err:false,flash:{},sheet:null,more:'rules',page:0,pops:[],shot:null,recap:null,confirmNew:false,focus:null,ops:'over',tsel:null,gauge:'dread',confirmBreak:-1,intro:false,flow:true,acc:0,mShown:null,rec:0,recKey:'',recorded:-1};
var prevV={dread:null,heat:null,anx:null};
var undoStack=[];
var TIPS=['시간이 흐르면 영향력이 붙은 빈 땅으로 저절로 번집니다. 빈 땅을 눌러 "집중"하면 3배 빨라요.','오른쪽 아래 ×1을 누르면 시간이 빨라지고, 한 번 더 누르면 정지합니다. 시장·술집·파친코는 돈줄입니다.','이웃 땅은 번지지 않으니 병력으로 치세요. 땅 5·8·11곳이면 도장 보상, 외교 탭에서 휴전도 맺어 보세요.'];
/* 조직 표식: 0 불꽃 · 1 마름모 · 2 초승달 · 3 송곳니 */
var MARKS=[
  {n:'불꽃',d:'M0 -8C2 -4 5.5 -2 5.5 2.2A5.5 5.5 0 0 1 -5.5 2.2C-5.5 -0.2 -4 -1.8 -2.6 -3.6C-2.4 -1.6 -1.2 -1.6 -0.6 -3.2C-0.2 -4.6 -0.4 -6.4 0 -8ZM0 7.4C-1.7 7.4 -2.8 6.2 -2.8 4.6C-2.8 3 -1.4 2 0 0.6C1.4 2 2.8 3 2.8 4.6C2.8 6.2 1.7 7.4 0 7.4Z'},
  {n:'마름모',d:'M0 -8L7.4 0L0 8L-7.4 0ZM0 -3.7L3.4 0L0 3.7L-3.4 0Z'},
  {n:'초승달',d:'M3.4 -7.6A7.6 7.6 0 0 0 3.4 7.6A9.4 9.4 0 0 1 3.4 -7.6Z'},
  {n:'송곳니',d:'M-6.4 -6.4H-0.8L-3.6 7Z M0.8 -6.4H6.4L3.6 7Z'}
];
function markG(o,x,y,s,cls){
  if(o<0||!MARKS[o])return'';
  return'<g class="mk o'+o+(cls?' '+cls:'')+'" transform="translate('+x.toFixed(1)+' '+y.toFixed(1)+') scale('+s+')"><path d="'+MARKS[o].d+'"/></g>';
}
function markIcon(o){return'<svg class="mkb o'+o+'" viewBox="-9 -9 18 18" aria-hidden="true"><path d="'+MARKS[o].d+'"/></svg>';}
function markDefs(){
  var h='';
  for(var o=0;o<4;o++)h+='<pattern id="pM'+o+'" width="40" height="40" patternUnits="userSpaceOnUse"><g class="o'+o+'" opacity=".17">'+
    '<g class="mk" transform="translate(10 10) scale(.95)"><path d="'+MARKS[o].d+'"/></g><g class="mk" transform="translate(30 30) scale(.95)"><path d="'+MARKS[o].d+'"/></g></g></pattern>';
  return h;
}
function esc(t){return String(t).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
function setHint(m,e){ui.msg=m||'';ui.err=!!e;}
