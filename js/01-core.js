var MAXDAY=30, AP_MAX=3, MAP_W=420, MAP_H=480, DIFF=0;
var CITY_TYPES={
  hq:{n:'본거지',inc:4,exp:1,cap:8,men:4,df:1.1},stn:{n:'역전',inc:4,exp:2,cap:6,men:2,df:1},
  club:{n:'유흥가',inc:5,exp:3,cap:6,men:3,df:1},port:{n:'항구',inc:6,exp:3,cap:6,men:2,df:1},mkt:{n:'시장',inc:3,exp:1,cap:5,men:2,df:1},
  bridge:{n:'다리목',inc:2,exp:1,cap:6,men:2,df:1.2},fort:{n:'요새',inc:1,exp:2,cap:9,men:3,df:1.35}
};
var ORGS=[
  {id:0,name:'우리',short:'우리',trait:'',thr:0,join:999},
  {id:1,name:'하야시구미',short:'하야시',trait:'겁 많은 노인회. 약해 보일 때만 움직이고, 판이 기울면 제일 먼저 손을 잡는다.',thr:30,join:55},
  {id:2,name:'쓰키가미카이',short:'쓰키가미',trait:'체면에 목숨을 건다. 당한 것은 오래 걸려도 반드시 갚는다.',thr:25,join:80},
  {id:3,name:'구로이누',short:'구로이누',trait:'하이에나. 누구든 가장 약한 구역만 노린다.',thr:50,join:65}
];

var CREW=[
  {name:'가네코',role:'주먹',loy:60,perk:'믿음 50 이상이면 공격이 10% 거세진다.'},
  {name:'오카다',role:'장부',loy:55,perk:'믿음 50 이상이면 밤 수입이 ¥2 늘어난다.'},
  {name:'마키노',role:'막내',loy:65,perk:'믿음 50 이상이면 밤마다 동요가 2 가라앉는다.'}
];

var RULE_DAYS=[6,12,18,24], SCENE_DAYS=[3,9,15,21,27];
var RULES={
  tribute:{name:'상납령',text:'모든 가게에서 매달 한 몫을 더 걷는다. 낼 수 있는지는 묻지 않는다.',fx:'밤 수입 +25% · 부하 믿음 매밤 −2'},
  giri:{name:'의리의 규칙',text:'식구는 버리지 않는다. 그 대신 식구에게 쓰는 것이 늘어난다.',fx:'부하 믿음 매밤 +2 · 위세 매밤 −1'},
  omerta:{name:'침묵의 규칙',text:'본 것도 들은 것도 없다. 입을 여는 자는 없다.',fx:'경계 매밤 −3 · 동요 매밤 +1'},
  shield:{name:'어린 것들은 건드리지 않는다',text:'아이와 여자에게 손대는 자는 우리 사람이 아니다.',fx:'동요 매밤 −2 · 위세 매밤 −1 · 수입 −¥1'},
  iron:{name:'철의 규율',text:'어긴 자는 손가락 하나. 예외는 없다.',fx:'위세 +1 · 경계 +1 · 부하 믿음 +1 (매밤)'}
};
function loyAll(s,v){s.crew.forEach(function(c){if(c.alive)c.loy=clamp(c.loy+v,0,100);});}
var SCENES=[
  {title:'국숫집 주인',text:'매달 봉투를 받아 가는 가게다. 오늘은 주인이 봉투 위에 아이의 학비 고지서를 같이 올려 두었다. 그는 아무 말도 하지 않는다. 말을 하지 않는 것이 그가 가진 전부다.',
   choices:[
    {label:'봉투만 받는다',desc:'¥+8 · 위세 +2',kind:'neutral',out:'봉투는 가벼웠다. 주인은 허리를 깊이 숙였고, 고지서는 끝내 집어 들지 않았다.',fx:function(s){s.money+=8;adjv(s,'dread',2);}},
    {label:'이번 달은 넘어간다',desc:'위세 −1 · 부하 믿음 −3',kind:'mercy',out:'봉투를 도로 밀었다. 주인은 믿지 못하는 얼굴로 한참을 서 있었다. 뒤에서 누군가 혀를 찼다.',fx:function(s){adjv(s,'dread',-1);loyAll(s,-3);}},
    {label:'이자까지 받는다',desc:'¥+14 · 위세 +4 · 경계 +3',kind:'harsh',out:'주인은 서랍 밑바닥까지 털었다. 다음 날 그 가게의 간판 불이 일찍 꺼졌다.',fx:function(s){s.money+=14;adjv(s,'dread',4);adjv(s,'heat',3);}}
  ]},
  {title:'사무실을 닦는 여자',text:'마룻바닥의 얼룩을 닦던 여자가 걸레를 쥔 채 서 있다. 아이가 열이 난다고 했다. 이 방에서 무엇을 보았는지 그녀는 묻지 않았고, 묻지 않았다는 사실이 우리 둘 사이에 놓여 있다.',
   choices:[
    {label:'일찍 보내 준다',desc:'동요 −3 · 위세 −2',kind:'mercy',out:'그녀는 인사도 제대로 못 하고 뛰어나갔다. 문이 닫히고 나서야 방이 조용해졌다.',fx:function(s){adjv(s,'anx',-3);adjv(s,'dread',-2);}},
    {label:'일을 마치게 한다',desc:'위세 +1 · 동요 +3',kind:'harsh',out:'그녀는 끝까지 닦았다. 걸레질 소리가 평소보다 컸다.',fx:function(s){adjv(s,'dread',1);adjv(s,'anx',3);}},
    {label:'돈을 쥐여 주고 입을 막는다',desc:'¥−5 · 경계 −3 · 동요 +1',kind:'neutral',out:'봉투를 받은 손이 떨렸다. 감사의 떨림인지 두려움의 떨림인지 알 수 없었다.',fx:function(s){s.money=Math.max(0,s.money-5);adjv(s,'heat',-3);adjv(s,'anx',1);}}
  ]},
  {title:'심부름하는 아이',text:'골목 어귀에서 담배를 사다 나르는 아이가 있다. 열두 살쯤. 오늘은 우리 쪽 막내의 옷을 입고 서서, 나를 올려다본다. 아이의 눈에 비친 나는 아마 멋있어 보일 것이다.',
   choices:[
    {label:'받아 준다',desc:'본가 병력 +1 · 동요 +3 · 막내 믿음 +8',kind:'harsh',out:'아이는 처음으로 웃었다. 그 웃음이 오래 남을 것 같지는 않았다.',fx:function(s){var t=s.tiles[HQ_ID];if(t.owner===0)t.men=Math.min(t.cap,t.men+1);adjv(s,'anx',3);if(s.crew[2].alive)s.crew[2].loy=clamp(s.crew[2].loy+8,0,100);}},
    {label:'쫓아낸다',desc:'위세 +2',kind:'neutral',out:'아이는 뒤돌아보며 뛰어갔다. 두 번째 골목에서 누군가 아이를 받아 주는 것이 보였다. 다른 조직의 옷이었다.',fx:function(s){adjv(s,'dread',2);}},
    {label:'학교에 보낸다',desc:'¥−10 · 동요 −4 · 위세 −2',kind:'mercy',out:'아이는 이해하지 못한 얼굴로 가방을 받았다. 어른들은 말없이 서로를 쳐다봤다.',fx:function(s){s.money=Math.max(0,s.money-10);adjv(s,'anx',-4);adjv(s,'dread',-2);}}
  ]},
  {title:'빚진 남자의 아내',text:'남편의 빚이 석 달째 밀렸다. 여자는 사무실 앞에서 기다렸고, 들어와서도 앉지 않았다. 손에는 결혼반지가 아니라 서류 봉투가 들려 있다. 남편은 오지 않았다.',
   choices:[
    {label:'빚을 덜어 준다',desc:'¥−12 · 위세 −3 · 경계 −4',kind:'mercy',out:'여자는 울지 않았다. 대신 문 앞에서 한 번 돌아보았다. 그 눈은 고마움이 아니라 계산이었다.',fx:function(s){s.money=Math.max(0,s.money-12);adjv(s,'dread',-3);adjv(s,'heat',-4);}},
    {label:'남편을 본보기로 삼는다',desc:'위세 +8 · 경계 +4 · 동요 +4',kind:'harsh',out:'일은 조용히 끝났다. 여자는 다시 오지 않았다. 그 골목의 가게들이 일제히 셔터를 일찍 내렸다.',fx:function(s){adjv(s,'dread',8);adjv(s,'heat',4);adjv(s,'anx',4);}},
    {label:'그녀에게 일을 시킨다',desc:'¥+10 · 동요 +2',kind:'neutral',out:'여자는 다음 날부터 장부 옆자리에 앉았다. 눈을 마주치지 않는 것이 규칙이 되었다.',fx:function(s){s.money+=10;adjv(s,'anx',2);}}
  ]},
  {title:'골목의 늙은 여자',text:'아버지 대부터 이 골목에서 반찬을 팔던 여자가 길가에 앉아 있다. "네 아버지는 문을 열어 두었지." 그녀는 나를 보지 않고 말한다. 칭찬인지 책망인지 알 수 없다.',
   choices:[
    {label:'그냥 지나간다',desc:'동요 +4',kind:'neutral',out:'걸음을 늦추지 않았다. 등 뒤에서 그녀가 혼잣말로 아버지의 이름을 다시 불렀다.',fx:function(s){adjv(s,'anx',4);}},
    {label:'앉아서 들어 준다',desc:'동요 −6 · 위세 −2',kind:'mercy',out:'한참 들었다. 대부분은 쓸모없는 옛 이야기였다. 일어설 때 부하들이 처음으로 나를 낯설게 보았다.',fx:function(s){adjv(s,'anx',-6);adjv(s,'dread',-2);}},
    {label:'말을 막는다',desc:'위세 +3 · 부하 믿음 +3',kind:'harsh',out:'"가게나 보세요." 늙은 여자는 입을 닫았다. 부하들은 만족한 얼굴이었고, 나는 아니었다.',fx:function(s){adjv(s,'dread',3);loyAll(s,3);}}
  ]}
];
/* 강화 나무: br 0 기반 · 1 무력 · 2 은폐. 같은 갈래 안에서 배열 순서가 자리(0 뿌리, 1·2 첫 가지, 3·4 둘째 가지, 5 끝)다. */
var TECH=[
  {id:'a1',br:0,name:'단골 가게',cost:25,pre:null,heat:4,text:'모든 도시의 수입 +¥1'},
  {id:'a2',br:0,name:'징수 장부',cost:40,pre:'a1',heat:4,text:'모든 구역의 수입 +¥1'},
  {id:'a4',br:0,name:'지하 금고',cost:35,pre:'a1',heat:2,text:'밤마다 지도에 금빛 점이 하나 더 나타난다'},
  {id:'a3',br:0,name:'신병 모집소',cost:55,pre:'a2',heat:4,text:'모집이 +3명 · 유지비 병력×0.4'},
  {id:'a5',br:0,name:'돈세탁',cost:50,pre:'a4',heat:0,text:'자금이 ¥40 이상이면 밤마다 이자 ¥3'},
  {id:'a6',br:0,name:'상인회',cost:60,pre:'a5',heat:3,text:'유흥가·항구·시장의 수입 +¥2'},
  {id:'b1',br:1,name:'쇠파이프',cost:30,pre:null,heat:6,text:'공격력 ×1.08 · 경계 매밤 +1'},
  {id:'b2',br:1,name:'검은 차량',cost:45,pre:'b1',heat:8,text:'이길 때 잃는 병력 −20% · 본보기 위세 +4 · 경계 매밤 +1'},
  {id:'b4',br:1,name:'방탄 개조',cost:40,pre:'b1',heat:2,text:'이웃의 공격을 받을 때 우리 땅 방어 ×1.1'},
  {id:'b3',br:1,name:'밀수한 총',cost:70,pre:'b2',heat:12,text:'공격력 ×1.12 더 · 경계 매밤 +2'},
  {id:'b5',br:1,name:'감시 초소',cost:50,pre:'b4',heat:2,text:'밤마다 가장 약한 국경 땅에 병력 +1'},
  {id:'b6',br:1,name:'정예 조직',cost:60,pre:'b5',heat:4,text:'모집이 +1명 더 · 공격력 ×1.05'},
  {id:'c1',br:2,name:'입단속',cost:30,pre:null,heat:0,text:'경계 매밤 −2'},
  {id:'c2',br:2,name:'경찰 연줄',cost:45,pre:'c1',heat:0,text:'연합 습격 발동 기준이 경계 78로 오른다'},
  {id:'c4',br:2,name:'밀사',cost:40,pre:'c1',heat:0,text:'휴전·동맹 제의가 받아들여질 가능성 +15%p · 외교 비용 −¥3'},
  {id:'c3',br:2,name:'변호사',cost:65,pre:'c2',heat:0,text:'동요 매밤 −2 · 술자리 ¥5'},
  {id:'c5',br:2,name:'이간 공작',cost:55,pre:'c4',heat:0,text:'동맹한 두 이웃 사이를 갈라놓을 수 있다 (외교 화면)'},
  {id:'c6',br:2,name:'언론 플레이',cost:50,pre:'c5',heat:0,text:'땅을 차지할 때 오르는 경계 −1'}
];
function hasTech(s,id){return s.tech.indexOf(id)>=0;}
function tileInc(s,t){return t.inc+((t.kind==='city'&&hasTech(s,'a1'))?1:0)+((t.kind==='area'&&hasTech(s,'a2'))?1:0)+((hasTech(s,'a6')&&(t.type==='club'||t.type==='port'||t.type==='mkt'))?2:0);}
function strikeAt(s){return hasTech(s,'c2')?78:70;}
function drinkCost(s){return hasTech(s,'c3')?5:8;}
function actTech(s,id){
  if(s.over)return fail('이미 끝난 이야기다.');
  if(s.pend)return fail('먼저 결정을 내려야 한다.');
  var t=TECH.filter(function(x){return x.id===id;})[0];
  if(!t)return fail('없는 강화다.');
  if(hasTech(s,id))return fail('이미 갖췄다.');
  if(t.pre&&!hasTech(s,t.pre))return fail('앞선 강화가 먼저 필요하다.');
  if(s.money<t.cost)return fail('자금이 모자란다. (¥'+t.cost+' 필요)');
  s.money-=t.cost;s.tech.push(id);
  if(t.heat)adjv(s,'heat',t.heat);
  say(s,'조직을 키웠다. '+t.name+'. (¥'+t.cost+(t.heat?' · 경계 +'+t.heat:'')+')','big');
  return{ok:true};
}
function genBubbles(s){
  s.bubbles=[];
  var mine=owned(s,0).slice();
  var n=(mine.length>=4?(rnd(s)<0.5?1:2):1)+(hasTech(s,'a4')?1:0);
  for(var k=0;k<n&&mine.length;k++){
    var i=Math.floor(rnd(s)*mine.length),t=mine.splice(i,1)[0];
    s.bubbles.push({tile:t.id,kind:rnd(s)<0.35?'dirty':'cash'});
  }
}
function actBubble(s,i){
  if(s.over||s.pend)return fail('지금은 손댈 수 없다.');
  var b=s.bubbles[i];
  if(!b)return fail('이미 사라진 기회다.');
  var t=s.tiles[b.tile];
  if(b.kind==='cash'){
    var g=3+Math.floor(rnd(s)*3);s.money+=g;
    say(s,t.name+'에서 잔돈을 거뒀다. (+¥'+g+')','dim');
  }else{
    s.money+=10;adjv(s,'heat',3);adjv(s,'anx',1);
    say(s,t.name+'에서 뒷돈을 챙겼다. 눈에 띄었다. (+¥10 · 경계 +3)','dim');
  }
  s.bubbles.splice(i,1);s.stats.bubbles++;
  return{ok:true};
}
function giveUpCrew(s){
  var b=-1;
  s.crew.forEach(function(c,i){if(c.alive&&(b<0||c.loy<s.crew[b].loy))b=i;});
  if(b<0)return;
  s.crew[b].alive=false;s.stats.purged++;loyAll(s,-6);
}
var DILEMMAS=[
  {minDay:5,title:'형사의 방문',when:function(s){return s.heat>=45;},
   text:'정장 차림의 남자 둘이 가게마다 돌며 우리 이름을 묻고 다닌다. 명함에는 "생활안전"이라고 적혀 있다. 그것이 진짜 부서인지 아는 사람은 없다.',
   choices:[
    {label:'봉투를 건넨다',desc:'¥−18 · 경계 −10',cost:18,kind:'neutral',out:'남자는 봉투의 두께를 손끝으로 재더니 아무 말 없이 돌아갔다.',fx:function(s){s.money-=18;adjv(s,'heat',-10);}},
    {label:'모른 척한다',desc:'경계 +6 · 위세 +2',kind:'neutral',out:'가게 주인들은 우리를 모른다고 했다. 그 거짓말이 얼마나 갈지는 아무도 몰랐다.',fx:function(s){adjv(s,'heat',6);adjv(s,'dread',2);}},
    {label:'부하 하나를 내준다',desc:'경계 −14 · 동요 +4 · 부하 믿음 −6',kind:'harsh',out:'가장 믿음이 약한 사람이 차에 올랐다. 남은 이들은 아무도 그의 이름을 부르지 않았다.',fx:function(s){giveUpCrew(s);adjv(s,'heat',-14);adjv(s,'anx',4);}}
  ]},
  {minDay:6,title:'신문 기사',when:function(s){return s.dread>=62;},
   text:'조간 사회면 구석에 우리 구역의 이름이 실렸다. "특정 조직의 영향력 확대 우려". 이웃 조직들은 그 신문을 한 부씩 사서 서랍에 넣었다.',
   choices:[
    {label:'정정 보도를 요구한다',desc:'¥−12 · 위세 −3 · 경계 −5',cost:12,kind:'neutral',out:'작은 정정 기사가 났다. 기사 속 우리는 조금 덜 무서웠다.',fx:function(s){s.money-=12;adjv(s,'dread',-3);adjv(s,'heat',-5);}},
    {label:'그대로 둔다',desc:'위세 +3 · 경계 +5',kind:'neutral',out:'기사는 잊히지 않았다. 사람들은 우리 앞에서 목소리를 낮췄다.',fx:function(s){adjv(s,'dread',3);adjv(s,'heat',5);}},
    {label:'기자를 찾아간다',desc:'위세 +8 · 경계 +8 · 동요 +3',kind:'harsh',out:'기자는 다음 날부터 출근하지 않았다. 신문사는 사과문을 냈고, 그 사과문이 더 큰 소문이 되었다.',fx:function(s){adjv(s,'dread',8);adjv(s,'heat',8);adjv(s,'anx',3);}}
  ]},
  {minDay:7,title:'빈 금고',when:function(s){return s.money<=6;},
   text:'금고를 열었다. 먼지 낀 바닥이 보인다. 월급날은 사흘 뒤다. 부하들은 아직 아무 말도 하지 않는다. 말을 하지 않는 것이 가장 위험한 때다.',
   choices:[
    {label:'가게마다 특별 모금',desc:'¥+18 · 위세 +3 · 경계 +4',kind:'harsh',out:'가게 주인들은 말없이 서랍을 열었다. 그 밤 골목의 불빛이 일찍 꺼졌다.',fx:function(s){s.money+=18;adjv(s,'dread',3);adjv(s,'heat',4);}},
    {label:'사채를 쓴다',desc:'¥+30 · 부하 믿음 −5 · 동요 +4',kind:'neutral',out:'돈은 급하게 들어왔다. 갚는 날짜가 적힌 종이는 서랍 깊이 넣어 두었다.',fx:function(s){s.money+=30;loyAll(s,-5);adjv(s,'anx',4);}},
    {label:'버틴다',desc:'위세 −2 · 동요 −2',kind:'mercy',out:'아무것도 하지 않았다. 부하들은 서로의 얼굴을 한 번씩 쳐다보았다.',fx:function(s){adjv(s,'dread',-2);adjv(s,'anx',-2);}}
  ]},
  {minDay:8,title:'이웃의 사자',when:function(s){return(s.heat>=52||s.grudge[1]>=2||s.grudge[2]>=2||s.grudge[3]>=2)&&[1,2,3].some(function(r){return!s.dead[r]&&!hasPact(s,0,r);});},
   text:function(s,p){return(p&&p.r?ORGS[p.r].name:'이웃 조직')+'에서 사람이 왔다. 정장은 단정하고 손에는 아무것도 들지 않았다. 술자리를 청한다고 했다. 어느 쪽 장소에서 열지는 말하지 않았다.';},
   choices:[
    {label:'응한다',desc:'¥−10 · 경계 −12 · 위세 −4 · 호감 +10 · 그쪽 하룻밤 휴전',cost:10,kind:'neutral',out:'술잔은 두 번 돌았다. 아무도 먼저 잔을 비우지 않았다.',fx:function(s,p){s.money-=10;adjv(s,'heat',-12);adjv(s,'dread',-4);if(p&&p.r){s.grudge[p.r]=0;addRel(s,p.r,0,10);if(!hasPact(s,0,p.r))addPact(s,0,p.r,'truce',1);}}},
    {label:'돌려보낸다',desc:'위세 +3 · 그쪽 원한 +1 · 호감 −6',kind:'neutral',out:'사자는 정중하게 인사하고 돌아갔다. 돌아가는 뒷모습이 오래 문 앞에 남았다.',fx:function(s,p){adjv(s,'dread',3);if(p&&p.r){s.grudge[p.r]+=1;addRel(s,p.r,0,-6);}}},
    {label:'사자를 본보기로 삼는다',desc:'위세 +9 · 경계 +6 · 동요 +3 · 그쪽 원한 +2 · 호감 −18',kind:'harsh',out:'사자는 걸어서 돌아가지 못했다. 그 소식은 술자리보다 빨리 퍼졌다.',fx:function(s,p){adjv(s,'dread',9);adjv(s,'heat',6);adjv(s,'anx',3);if(p&&p.r){s.grudge[p.r]+=2;addRel(s,p.r,0,-18);}}}
  ]}
];
function evOf(p,s){return p.type==='offer'?buildOffer(s,p):(p.type==='dilemma'?DILEMMAS[p.idx]:SCENES[p.idx]);}
function pickDilemma(s){
  for(var k=0;k<DILEMMAS.length;k++){
    var d=DILEMMAS[k];
    if(s.done['d'+k]||s.day<d.minDay||!d.when(s))continue;
    if(rnd(s)<0.6){s.done['d'+k]=1;s.pend={type:'dilemma',idx:k,r:pickRival(s)};return;}
  }
}
function hasRule(s,id){return s.rules.indexOf(id)>=0;}
function queueDecision(s){
  if(s.over)return;
  genBubbles(s);
  if(RULE_DAYS.indexOf(s.day)>=0){
    var pool=Object.keys(RULES).filter(function(k){return!hasRule(s,k);});
    for(var i=pool.length-1;i>0;i--){var j=Math.floor(rnd(s)*(i+1));var t=pool[i];pool[i]=pool[j];pool[j]=t;}
    if(pool.length)s.pend={type:'rule',opts:pool.slice(0,3)};
  }else{
    var k=SCENE_DAYS.indexOf(s.day);
    if(k>=0)s.pend={type:'scene',idx:s.sceneOrder[k]};
    else pickDilemma(s);
  }
  if(!s.pend&&s.offers.length)s.pend=s.offers.shift();
}
function actRule(s,id){
  if(!s.pend||s.pend.type!=='rule'||s.pend.opts.indexOf(id)<0)return fail('지금 세울 수 있는 법이 아니다.');
  s.rules.push(id);s.pend=null;
  say(s,'새 법을 세웠다. '+RULES[id].name+'.','big');
  return{ok:true};
}
function actScene(s,ci){
  if(!s.pend||(s.pend.type!=='scene'&&s.pend.type!=='dilemma'&&s.pend.type!=='offer'))return fail('지금은 마주칠 사람이 없다.');
  var sc=evOf(s.pend,s),ch=sc.choices[ci];
  if(!ch)return fail('그런 선택은 없다.');
  if(ch.cost&&s.money<ch.cost)return fail('자금이 모자란다. (¥'+ch.cost+' 필요)');
  var msg=ch.fx(s,s.pend);
  if(ch.kind==='mercy')s.stats.mercy++;else if(ch.kind==='harsh')s.stats.harsh++;
  if(s.pend.type==='offer')dipNews(s,sc.title+' — '+(typeof msg==='string'?msg:ch.out),'dip');
  else say(s,sc.title+' — '+(typeof msg==='string'?msg:ch.out),'voice');
  s.pend=null;
  return{ok:true};
}
function echoFor(s){
  var m=s.stats.mercy,h=s.stats.harsh;
  if(m+h===0)return'';
  if(m>=3&&h<=1)return'당신이 봐준 사람들은 당신 편이 되지 않았다. 다만 당신의 이름이 나올 때 목소리가 조금 낮아졌다.';
  if(h>=3&&m<=1)return'당신 앞에서는 아무도 울지 않았다. 울음은 언제나 문이 닫힌 뒤에 시작되었다.';
  return'때로는 봐주고 때로는 걷었다. 그들은 당신이 어느 쪽인지 끝내 알지 못했고, 그래서 더 조심스러웠다.';
}

/* ---------- 지형 ---------- */
function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
function clipPoly(poly,a,b,c){
  var out=[];
  for(var i=0;i<poly.length;i++){
    var P=poly[i],Q=poly[(i+1)%poly.length];
    var dp=a*P[0]+b*P[1]-c,dq=a*Q[0]+b*Q[1]-c;
    if(dp<=0)out.push(P);
    if((dp<0&&dq>0)||(dp>0&&dq<0)){var t=dp/(dp-dq);out.push([P[0]+(Q[0]-P[0])*t,P[1]+(Q[1]-P[1])*t]);}
  }
  return out;
}
function inPoly(x,y,P){
  var c=false;
  for(var i=0,j=P.length-1;i<P.length;j=i++){
    var xi=P[i][0],yi=P[i][1],xj=P[j][0],yj=P[j][1];
    if(((yi>y)!==(yj>y))&&(x<(xj-xi)*(y-yi)/(yj-yi)+xi))c=!c;
  }
  return c;
}
function powerDiagram(seeds,W,H,mg){
  mg=mg||0;
  var cells=seeds.map(function(si,i){
    var poly=[[-mg,-mg],[W+mg,-mg],[W+mg,H+mg],[-mg,H+mg]];
    seeds.forEach(function(sj,j){
      if(i===j)return;
      var a=2*(sj.x-si.x),b=2*(sj.y-si.y);
      var c=sj.x*sj.x+sj.y*sj.y-si.x*si.x-si.y*si.y+si.w-sj.w;
      poly=clipPoly(poly,a,b,c);
    });
    return poly;
  });
  var adj=seeds.map(function(){return{};});
  seeds.forEach(function(si,i){
    seeds.forEach(function(sj,j){
      if(j<=i)return;
      var a=2*(sj.x-si.x),b=2*(sj.y-si.y);
      var c=sj.x*sj.x+sj.y*sj.y-si.x*si.x-si.y*si.y+si.w-sj.w;
      var n=Math.sqrt(a*a+b*b);
      var pts=cells[i].filter(function(p){return Math.abs(a*p[0]+b*p[1]-c)/n<0.05;});
      if(pts.length<2)return;
      var best=0,pa=null,pb=null;
      for(var u=0;u<pts.length;u++)for(var v=u+1;v<pts.length;v++){
        var d=Math.hypot(pts[u][0]-pts[v][0],pts[u][1]-pts[v][1]);
        if(d>best){best=d;pa=pts[u];pb=pts[v];}
      }
      if(best>=10){var e={mid:[(pa[0]+pb[0])/2,(pa[1]+pb[1])/2]};adj[i][j]=e;adj[j][i]=e;}
    });
  });
  return{cells:cells,adj:adj};
}

/* ---------- 글 도우미 ---------- */
function jong(w){var c=w.charCodeAt(w.length-1);return c>=0xAC00&&c<=0xD7A3&&(c-0xAC00)%28!==0;}
function eul(w){return w+(jong(w)?'을':'를');}
function iga(w){return w+(jong(w)?'이':'가');}
function wa(w){return w+(jong(w)?'과':'와');}
function eun(w){return w+(jong(w)?'은':'는');}
function ro(w){var c=w.charCodeAt(w.length-1);var b=(c-0xAC00)%28;return w+((b===0||b===8)?'로':'으로');}
function rnd(s){
  s.rs=(s.rs+0x6D2B79F5)|0;
  var t=Math.imul(s.rs^(s.rs>>>15),1|s.rs);
  t=(t+Math.imul(t^(t>>>7),61|t))^t;
  return((t^(t>>>14))>>>0)/4294967296;
}
function say(s,text,tone){
  s.log.push({day:s.day,text:text,tone:tone||''});
  if(s.log.length>260)s.log.splice(0,s.log.length-260);
  s.lastSay=text;
}
function owned(s,o){return s.tiles.filter(function(t){return t.owner===o;});}
function adjv(s,k,v){
  s[k]=clamp(s[k]+v,0,100);
  if(k==='anx')s.stats.peakAnx=Math.max(s.stats.peakAnx,Math.round(s.anx));
  if(k==='dread')s.stats.peakDread=Math.max(s.stats.peakDread,Math.round(s.dread));
  if(k==='heat')s.stats.peakHeat=Math.max(s.stats.peakHeat,Math.round(s.heat));
}
function newGame(seed,mseed,mw){
  if(mseed===undefined)mseed=seed;
  if(!mw)mw=(typeof mapWidth==='function')?mapWidth():420;
  genMap(mseed,mw);
  var s={seed:seed,mseed:mseed,mw:MAP_W,rs:seed|0,day:1,ap:AP_MAX,dread:42,heat:14,money:30,
    tiles:NODES.map(function(t){return{id:t.id,kind:t.kind,name:t.name,type:t.type,inc:t.inc,exp:t.exp,cap:t.cap,hq:t.hq,owner:t.owner,men:t.men};}),
    tech:[],bubbles:[],done:{},rules:[],pend:null,sceneOrder:[0,1,2,3,4],anx:20,crew:CREW.map(function(c){return{loy:c.loy,alive:true};}),grudge:[0,0,0,0],dead:[false,false,false,false],rel:[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],aff:[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],pacts:[],offers:[],news:[],ambush:[],cool:[0,0,0,0],refused:[0,0,0,0],hit:[-9,-9,-9,-9],
    log:[],lastSay:'',over:null,lastBlow:null,lostTonight:0,focus:-1,diff:DIFF,streak:0,bestStreak:0,goal:null,goalsDone:0,
    stats:{examples:0,peakDread:42,peakHeat:14,peakAnx:20,strikes:0,taken:0,lost:0,betrayed:0,purged:0,mercy:0,harsh:0,bubbles:0,pactsMade:0,alliesFormed:0,pactBroken:0,betrayedBy:0}};
  for(var i=s.sceneOrder.length-1;i>0;i--){var j=Math.floor(rnd(s)*(i+1));var t=s.sceneOrder[i];s.sceneOrder[i]=s.sceneOrder[j];s.sceneOrder[j]=t;}
  for(var a=1;a<=3;a++){
    s.rel[a][0]=Math.round((rnd(s)-0.5)*16);
    for(var b=1;b<=3;b++){if(a===b)continue;s.rel[a][b]=Math.round((rnd(s)-0.5)*16);}
  }
  for(var a2=1;a2<=3;a2++)for(var b2=a2+1;b2<=3;b2++){var af=(rnd(s)-0.35)*3;s.aff[a2][b2]=af;s.aff[b2][a2]=af;}
  say(s,'본가의 불은 아직 꺼지지 않았다. 이웃 조직들은 말을 아끼고, 모두가 당신의 숨소리를 세고 있다.','voice');
  genBubbles(s);
  newGoal(s);
  return s;
}
function crewPerk(s,i){var c=s.crew[i];return!!(c&&c.alive&&c.loy>=50);}

/* ---------- 밤의 목표 · 예보 · 대사 · 칭호 ---------- */
var GOALS=[
  {k:'take',n:2,text:'땅 2곳을 빼앗거나 차지하기'},
  {k:'take',n:3,text:'땅 3곳을 빼앗거나 차지하기'},
  {k:'money',n:60,text:'자금 ¥60 모으기'},
  {k:'land',d:2,text:'지금보다 땅 2곳 더 넓히기'},
  {k:'quiet',n:3,text:'땅을 잃지 않고 3밤 넘기기'},
  {k:'dread',n:60,text:'위세 60 이상으로 밤 넘기기'},
  {k:'pact',n:1,text:'이웃 조직과 휴전이나 동맹 맺기'}
];
function newGoal(s){
  var g=GOALS[Math.floor(rnd(s)*GOALS.length)];
  s.goal={k:g.k,n:g.n||0,d:g.d||0,text:g.text,end:s.day+4,takeBase:s.stats.taken,pactBase:s.stats.pactsMade,landBase:owned(s,0).length,quiet:0,reward:12+Math.floor(s.day/6)*3};
}
function goalProgress(s){
  var g=s.goal;if(!g)return null;
  if(g.k==='take')return{v:Math.min(g.n,s.stats.taken-g.takeBase),n:g.n};
  if(g.k==='money')return{v:Math.min(g.n,s.money),n:g.n};
  if(g.k==='land')return{v:Math.max(0,Math.min(g.d,owned(s,0).length-g.landBase)),n:g.d};
  if(g.k==='quiet')return{v:Math.min(g.n,g.quiet),n:g.n};
  if(g.k==='pact')return{v:Math.min(g.n,s.stats.pactsMade-g.pactBase),n:g.n};
  return{v:Math.min(g.n,Math.round(s.dread)),n:g.n};
}
function checkGoal(s){
  var g=s.goal;if(!g)return;
  if(s.lostTonight>0)g.quiet=0;else g.quiet++;
  var p=goalProgress(s);
  if(p.v>=p.n){
    s.money+=g.reward;adjv(s,'dread',3);s.goalsDone++;
    say(s,'목표를 이뤘다. '+g.text+' (+¥'+g.reward+' · 위세 +3)','good');
    s.day++;newGoal(s);s.day--;
  }else if(s.day>=g.end){
    say(s,'목표를 놓쳤다. '+g.text,'dim');
    s.day++;newGoal(s);s.day--;
  }
}
function forecast(s){
  if(s.over)return{lvl:0,t:'끝난 밤'};
  var parts=participants(s);
  if(s.heat>=strikeAt(s)&&parts.length>=2)return{lvl:3,t:'연합 습격 임박'};
  if(s.anx>=85)return{lvl:3,t:'가면이 곧 무너진다'};
  var al=alliesOf(s,0);
  for(var i=0;i<al.length;i++)if(betrayRisk(s,al[i],0)>=0.12)return{lvl:2,t:iga(ORGS[al[i]].short)+' 배신을 꾀한다'};
  var worst=0,wr=0;
  for(var r=1;r<=3;r++){
    if(s.dead[r]||hasPact(s,0,r))continue;
    var p=(r===3)?(s.dread<60?0.5:0.25):pBite(s,r);
    if(p>worst){worst=p;wr=r;}
  }
  if(s.heat>=55&&parts.length>=1)return{lvl:2,t:'연합 논의가 돈다'};
  if(worst>=0.45)return{lvl:2,t:iga(ORGS[wr].short)+' 노린다'};
  if(s.anx>=70)return{lvl:2,t:'가면에 금이 갔다'};
  if(worst>=0.2||s.dread<30)return{lvl:1,t:'눈치 보는 이웃'};
  return{lvl:0,t:'잔잔한 밤'};
}
var TAUNT={
  1:['하야시의 노인이 찻잔을 내려놓았다. "젊은 것은 서두르면 안 되는 법이지."','하야시구미 사람이 정중하게 고개를 숙였다. 그 인사가 가장 모욕적이었다.'],
  2:['쓰키가미의 오야붕이 낮게 말했다. "체면은 값을 치르고서야 돌아온다."','쓰키가미의 깃발이 새로 꽂혔다. 그들은 이 밤을 오래 기다렸다.'],
  3:['구로이누의 웃음소리가 골목 끝에서 들렸다. "약한 곳은 냄새가 나거든."','구로이누는 서두르지 않았다. 가장 약한 쪽으로 이빨을 들이밀었을 뿐이다.']
};
function titleFor(s){
  var st=s.stats;
  if(st.examples>=5)return'피 냄새를 달고 다닌 사람';
  if(st.strikes>=2)return'연합의 표적';
  if(st.betrayedBy>=2)return'등에 칼을 맞은 사람';
  if(st.alliesFormed>=3)return'손을 잡은 사람';
  if(s.bestStreak>=4)return'멈추지 않은 사람';
  if(s.goalsDone>=4)return'장부를 믿은 사람';
  if(st.mercy>=4)return'봐주는 사람';
  if(st.betrayed>=2)return'등을 많이 본 사람';
  return'이름 없는 사람';
}
function sendAmount(t,mode){if(t.men<2)return 0;return mode==='all'?t.men-1:Math.max(1,Math.floor(t.men/2));}
var BATTLES=[];
function logBattle(b){BATTLES.push(b);if(BATTLES.length>40)BATTLES.shift();}
function dfac(id){return NODES[id].df||1;}
function railOK(s,from,to){
  if(from===to)return false;
  var a=NODES[from],b=NODES[to];
  return a.type==='stn'&&b.type==='stn'&&s.tiles[from].owner===0&&s.tiles[to].owner===0;
}
function canReach(s,from,to){return ADJ[from].indexOf(to)>=0||railOK(s,from,to);}
function oddsHint(A,D,id){if(D===0)return'good';var r=A/(D*1.15*(id===undefined?1:dfac(id)));return r>1.45?'good':(r>0.9?'even':'bad');}

function resolve(s,from,to,A,opts){
  var F=s.tiles[from],T=s.tiles[to],D=T.men;
  F.men-=A;
  var atk=A*(0.85+rnd(s)*0.3)*((opts&&opts.bonus)||1);
  var def=D*1.15*dfac(to)*(0.85+rnd(s)*0.3)*((opts&&opts.defBonus)||1);
  var res={win:false,A:A,D:D,prev:T.owner,lossA:0,lossD:0};
  if(D===0||atk>def){
    var la=Math.min(A-1,Math.round(D*0.85));
    if(opts&&opts.lossMul)la=Math.round(la*opts.lossMul);
    res.win=true;res.lossA=la;res.lossD=D;
    T.owner=F.owner;T.men=Math.min(T.cap,A-la);
  }else{
    var back=Math.floor(A*0.3);
    var ld=Math.min(D-1,Math.round(A*0.7));
    F.men+=back;T.men=D-ld;
    res.lossA=A-back;res.lossD=ld;
  }
  logBattle({from:from,to:to,A:A,D:D,win:res.win,lossA:res.lossA,lossD:res.lossD,by:F.owner,prev:res.prev});
  return res;
}
function collapse(s,o){
  s.dead[o]=true;
  s.tiles.forEach(function(t){if(t.owner===o){t.owner=-1;t.men=Math.ceil(t.men/2);}});
  s.pacts=s.pacts.filter(function(p){return p.a!==o&&p.b!==o;});
  s.offers=s.offers.filter(function(q){return q.r!==o;});
  s.ambush=s.ambush.filter(function(q){return q.by!==o&&q.on!==o;});
  say(s,ORGS[o].short+' 조직이 무너졌다. 남은 땅은 주인 없는 땅이 되었다.','big');
}
function afterCapture(s,v,prev){
  var T=s.tiles[v];
  if(T.hq&&prev>=1&&prev!==T.owner&&!s.dead[prev])collapse(s,prev);
}
function allRivalsDead(s){return s.dead[1]&&s.dead[2]&&s.dead[3];}

/* ---------- 플레이어 행동 ---------- */
function fail(m){return{ok:false,msg:m};}
function pre(s,cost){
  if(s.over)return fail('이미 끝난 이야기다.');
  if(s.pend)return fail('먼저 결정을 내려야 한다.');
  if(s.ap<1)return fail('이 밤에 쓸 수는 이제 없다. 밤을 넘기자.');
  if(cost&&s.money<cost)return fail('자금이 모자란다. (¥'+cost+' 필요)');
  return null;
}
function actMove(s,from,to,mode){
  var e=pre(s,0);if(e)return e;
  var F=s.tiles[from],T=s.tiles[to];
  if(!F||!T||F.owner!==0)return fail('내 땅에서 출발해야 한다.');
  if(!canReach(s,from,to))return fail('붙어 있는 곳으로만 갈 수 있다.');
  if(T.owner>=1&&hasPact(s,0,T.owner))return fail(wa(ORGS[T.owner].short)+' '+(pactKind(s,0,T.owner)==='ally'?'동맹':'휴전')+' 중이다. 치려면 외교 화면에서 먼저 파기해야 한다.');
  var A=sendAmount(F,mode);
  if(A<1)return fail('병력이 모자란다. (2명 이상 있어야 한다)');
  if(T.owner===0){
    A=Math.min(A,T.cap-T.men);
    if(A<1)return fail('그곳은 이미 가득 찼다.');
    F.men-=A;T.men+=A;s.ap--;
    logBattle({from:from,to:to,A:A,D:0,win:true,lossA:0,lossD:0,by:0,prev:0,move:true});
    if(ADJ[from].indexOf(to)<0)say(s,'철도로 '+F.name+'에서 '+ro(T.name)+' '+A+'명을 한 번에 옮겼다.');
    else say(s,F.name+'에서 '+ro(T.name)+' '+A+'명을 옮겼다.');
    return{ok:true,move:true,A:A,from:from,to:to};
  }
  var oid=T.owner,res=resolve(s,from,to,A,{bonus:(crewPerk(s,0)?1.1:1)*(s.anx>=70?0.9:1)*(hasTech(s,'b1')?1.08:1)*(hasTech(s,'b3')?1.12:1)*(hasTech(s,'b6')?1.05:1),lossMul:hasTech(s,'b2')?0.8:1});
  s.ap--;
  if(res.win){
    s.stats.taken++;s.streak++;if(s.streak>s.bestStreak)s.bestStreak=s.streak;
    if(s.streak>=2){var sb=Math.min(6,(s.streak-1)*2);adjv(s,'dread',sb);say(s,'연승. 기세가 붙었다. (위세 +'+sb+')','good');}
    if(oid===-1){
      adjv(s,'dread',2);adjv(s,'heat',Math.max(0,T.exp-(hasTech(s,'c6')?1:0)));
      say(s,eul(T.name)+' 차지했다. ('+A+'명 투입, '+res.lossA+'명 잃음)','good');
    }else{
      adjv(s,'dread',6);adjv(s,'heat',Math.max(0,4+T.exp-(hasTech(s,'c6')?1:0)));s.grudge[oid]+=2;hurt(s,oid,0,12);
      say(s,ORGS[oid].short+'의 '+eul(T.name)+' 빼앗았다. ('+res.lossA+'명 잃음)','good');
      afterCapture(s,to,oid);
      if(s.dead[oid]){
        adjv(s,'dread',8);adjv(s,'heat',8);
        for(var r=1;r<=3;r++)if(r!==oid&&!s.dead[r])s.grudge[r]+=1;
        if(allRivalsDead(s))s.over={type:'alone'};
      }
    }
  }else{
    s.streak=0;
    if(oid===-1){adjv(s,'dread',-3);say(s,T.name+' 점령에 실패했다. '+res.lossA+'명을 잃었다.','bad');}
    else{adjv(s,'dread',-5);adjv(s,'heat',1);s.grudge[oid]+=1;hurt(s,oid,0,4);say(s,ORGS[oid].short+'의 '+T.name+' 공격이 막혔다. '+res.lossA+'명을 잃었다.','bad');}
  }
  return{ok:true,win:res.win,A:A,from:from,to:to,lossA:res.lossA};
}
function recruitAmt(s){return(hasTech(s,'a3')?3:2)+(hasTech(s,'b6')?1:0)+Math.min(3,Math.floor(owned(s,0).length/4));}
function growTarget(t){return Math.ceil(t.cap*(t.hq?0.7:0.5));}
function actRecruit(s,id){
  var e=pre(s,5);if(e)return e;
  var T=s.tiles[id];
  if(!T||T.owner!==0)return fail('내 땅을 먼저 골라야 한다.');
  var add=Math.min(recruitAmt(s),T.cap-T.men);
  if(add<1)return fail('그곳은 이미 가득 찼다.');
  T.men+=add;s.money-=5;s.ap--;
  say(s,T.name+'에 '+add+'명을 불러 모았다. (¥5)');
  return{ok:true};
}
function exampleTargets(s,from){
  var F=s.tiles[from];
  if(!F||F.owner!==0||F.men<2)return[];
  return ADJ[from].filter(function(j){var o=s.tiles[j].owner;return o>=1&&!hasPact(s,0,o);});
}
function actExample(s,from,to){
  var e=pre(s,0);if(e)return e;
  if(exampleTargets(s,from).indexOf(to)<0)return fail('붙어 있는 적의 땅만 본보기로 삼을 수 있다.');
  var T=s.tiles[to],oid=T.owner,lost=Math.min(2,T.men);
  T.men-=lost;s.ap--;
  adjv(s,'dread',14+(hasTech(s,'b2')?4:0));adjv(s,'heat',9);adjv(s,'anx',5);s.grudge[oid]+=2;hurt(s,oid,0,15);s.stats.examples++;
  say(s,ORGS[oid].short+'의 '+eul(T.name)+' 본보기로 삼았다. 그쪽 사람 '+lost+'명이 쓰러졌다.','bad');
  return{ok:true};
}
function actFeast(s){
  var e=pre(s,10);if(e)return e;
  s.money-=10;s.ap--;adjv(s,'dread',10);adjv(s,'heat',4);adjv(s,'anx',3);
  say(s,'가장 비싼 술을 열고 가장 큰 차를 세웠다. 돈으로 사는 두려움이다. (¥10)');
  return{ok:true};
}
function actLie(s){
  var e=pre(s,0);if(e)return e;
  s.ap--;adjv(s,'dread',-8);adjv(s,'heat',-10);adjv(s,'anx',-6);
  say(s,'불을 끄고 문을 걸었다. 오늘 밤 우리는 존재하지 않는 사람이다.');
  return{ok:true};
}
function actCrew(s,i,op){
  var e=pre(s,op==='care'?6:0);if(e)return e;
  var c=s.crew[i];
  if(!c||!c.alive)return fail('그 자리는 비어 있다.');
  var nm=CREW[i].name;
  if(op==='care'){
    s.money-=6;s.ap--;c.loy=clamp(c.loy+25,0,100);adjv(s,'anx',-1);
    say(s,nm+'에게 술과 봉투를 건넸다. 말은 하지 않았다. (¥6)');
  }else{
    c.alive=false;s.ap--;adjv(s,'dread',8);adjv(s,'heat',3);adjv(s,'anx',8);s.stats.purged++;
    s.crew.forEach(function(o,j){if(j!==i&&o.alive)o.loy=clamp(o.loy-8,0,100);});
    say(s,eul(nm)+' 솎아냈다. 남은 이들은 고개를 숙였고, 아무도 눈을 마주치지 않았다.','bad');
  }
  return{ok:true};
}
function pickRival(s){
  var b=0,bs=-1;
  for(var r=1;r<=3;r++){if(s.dead[r])continue;var sc=s.grudge[r]+rnd(s);if(sc>bs){bs=sc;b=r;}}
  return b;
}
function crewBetray(s,i){
  var c=s.crew[i],nm=CREW[i].name;
  c.alive=false;s.stats.betrayed++;adjv(s,'dread',-4);
  if(i===0){
    var mine=owned(s,0).sort(function(a,b){return b.men-a.men;})[0];
    var cut=mine?Math.max(0,Math.min(2,mine.men-1)):0;
    if(mine)mine.men-=cut;
    var r=pickRival(s),rn='이웃';
    if(r>0){rn=ORGS[r].short;var rt=owned(s,r).sort(function(a,b){return a.men-b.men;})[0];if(rt)rt.men=Math.min(rt.cap,rt.men+cut);}
    say(s,iga(nm)+' 사람 '+cut+'명을 데리고 '+rn+' 쪽으로 넘어갔다.','bad');
  }else if(i===1){
    var take=Math.min(s.money,15);s.money-=take;
    say(s,iga(nm)+' 금고를 비우고 사라졌다. (−¥'+take+')','bad');
  }else{
    adjv(s,'heat',12);
    say(s,iga(nm)+' 우리 이야기를 이웃 조직에 흘리고 달아났다.','bad');
  }
}
function crewNight(s){
  s.crew.forEach(function(c,i){
    if(!c.alive)return;
    var d=-1+(s.money>=30?1:0)+(s.dread>=55?1:0)-(s.dread<30?2:0)-(s.anx>=60?2:0)-(s.lostTonight>0?2:0)-(hasRule(s,'tribute')?2:0)+(hasRule(s,'giri')?2:0)+(hasRule(s,'iron')?1:0)+Math.round((rnd(s)-0.5)*2);
    c.loy=clamp(c.loy+d,0,100);
    if(c.loy<25&&rnd(s)<0.4)crewBetray(s,i);
  });
}
function canLeave(s){return!s.over&&s.day>=8&&s.money>=80;}
function actLeave(s){
  if(!canLeave(s))return fail('아직은 발을 뺄 수 없다. (8번째 밤부터, ¥80)');
  s.money=0;s.over={type:'leave'};
  say(s,'봉투를 두고 문을 나섰다.','big');
  return{ok:true};
}

/* ---------- 이웃 조직 ---------- */
function pBite(s,r){
  var o=ORGS[r];
  var p=clamp((o.thr-s.dread)/o.thr,0,1)*0.9;
  p+=s.grudge[r]*(r===2?0.3:0.12);
  p+=clamp(-s.rel[r][0]-20,0,60)/300;
  if(s.rel[r][0]>20)p*=0.6;
  return Math.min(0.9,p);
}
function pickAttack(s,r,pred,opt){
  var best=null;
  s.tiles.forEach(function(u){
    if(u.owner!==r||u.men<2)return;
    var A=u.men-1;
    ADJ[u.id].forEach(function(vi){
      var v=s.tiles[vi];
      if(!pred(v))return;
      var margin=A-v.men*1.15*dfac(vi);
      if(margin<opt.minMargin)return;
      var sc=margin+v.inc*0.4+(v.hq?4:0)+(v.type==='fort'||v.type==='bridge'||v.type==='stn'?1.5:0)+rnd(s)*0.5;
      if(!best||sc>best.sc)best={u:u.id,v:vi,A:A,sc:sc};
    });
  });
  return best;
}
function pickWeakest(s,r){
  var best=null;
  s.tiles.forEach(function(u){
    if(u.owner!==r||u.men<2)return;
    var A=u.men-1;
    ADJ[u.id].forEach(function(vi){
      var v=s.tiles[vi];
      if(v.owner<0||v.owner===r||s.dead[v.owner]||hasPact(s,r,v.owner))return;
      if(v.owner===0&&s.dread>=60&&v.men>1)return;
      var margin=A-v.men*1.15*dfac(vi);
      if(margin<0.5)return;
      var sc=-v.men*2+margin*0.3+rnd(s)*0.5;
      if(!best||sc>best.sc)best={u:u.id,v:vi,A:A,sc:sc};
    });
  });
  return best;
}
function doRivalAttack(s,r,pr,kind,opts){
  var T=s.tiles[pr.v],prev=T.owner;
  var o2=opts||{};
  if(prev===0&&hasTech(s,'b4'))o2.defBonus=1.1;
  if(kind==='ambush'&&prev===0)s.lastBlow='betray';
  var res=resolve(s,pr.u,pr.v,pr.A,o2);
  var who=ORGS[r].short;
  if(res.win){
    afterCapture(s,pr.v,prev);
    if(prev===0){
      s.stats.lost++;s.lostTonight++;
      if(kind!=='ambush')s.lastBlow=(r===2&&s.grudge[2]>=1)?'grudge':'bite';
      say(s,iga(who)+' '+eul(T.name)+' 빼앗았다. ('+res.A+'명이 밀고 들어왔다)','bad');
      if(rnd(s)<0.6)say(s,TAUNT[r][Math.floor(rnd(s)*TAUNT[r].length)],'voice');
    }else if(prev>=1){
      say(s,iga(who)+' '+ORGS[prev].short+'의 '+eul(T.name)+' 쳤다.','dim');
    }
    if(prev>=1)hurt(s,prev,r,14);
  }else if(prev>=1){
    hurt(s,prev,r,5);
    if(prev===0){
      say(s,iga(who)+' '+T.name+'에 손을 댔다가 막혔다. ('+res.A+'명 vs '+res.D+'명)','good');
      adjv(s,'dread',2);
    }
  }
}
function expandRival(s,r){
  var best=null;
  s.tiles.forEach(function(u){
    if(u.owner!==r||u.men<3)return;
    var A=u.men-1;
    ADJ[u.id].forEach(function(vi){
      var v=s.tiles[vi];
      if(v.owner!==-1)return;
      if(A-v.men*1.15*dfac(vi)<1.2)return;
      var sc=v.inc+v.exp*0.3+(v.type==='fort'||v.type==='bridge'||v.type==='stn'?1.5:0)+rnd(s)*1.5;
      if(!best||sc>best.sc)best={u:u.id,v:vi,sc:sc,A:Math.min(A,v.men+2)};
    });
  });
  if(!best)return false;
  var T=s.tiles[best.v],res=resolve(s,best.u,best.v,best.A);
  if(res.win)say(s,iga(ORGS[r].short)+' '+eul(T.name)+' 차지했다.','dim');
  return true;
}
function reinforce(s,r){
  var ts=owned(s,r);if(!ts.length)return;
  var n=Math.floor(ts.length/3)+(rnd(s)<0.7?1:0);
  for(var k=0;k<n;k++){
    var cand=ts.filter(function(t){return t.men<Math.min(t.cap,9);});
    if(!cand.length)break;
    var fr=cand.filter(function(t){return ADJ[t.id].some(function(j){return s.tiles[j].owner!==r;});});
    var pool=fr.length?fr:cand;
    pool.sort(function(a,b){return a.men-b.men;});
    pool[0].men++;
  }
}
function strikeForce(s,parts,v){
  var out=[];
  parts.forEach(function(r){
    var best=null;
    s.tiles.forEach(function(u){
      if(u.owner!==r||u.men<2)return;
      var d=DIST[u.id][v];if(d>3)return;
      var A=Math.floor((u.men-1)*(d===1?1:(d===2?0.85:0.7)));
      if(A<1)return;
      if(!best||A>best.A)best={u:u.id,A:A,r:r};
    });
    if(best)out.push(best);
  });
  return out;
}
function doStrike(s,parts){
  var best=null;
  owned(s,0).forEach(function(T){
    var c=strikeForce(s,parts,T.id);if(!c.length)return;
    var P=0;c.forEach(function(x){P+=x.A;});
    if(s.heat<100&&P<T.men*0.8*dfac(T.id))return;
    var sc=P-T.men*1.15*dfac(T.id)+T.inc*0.4+(T.hq?6:0)+rnd(s)*1.0-(c.length<2?3:0);
    if(!best||sc>best.sc)best={v:T.id,c:c,P:P,sc:sc};
  });
  if(!best)return false;
  var T2=s.tiles[best.v],D=T2.men,A=0;
  best.c.forEach(function(x){s.tiles[x.u].men=1;A+=x.A;});
  var strikeAt0=best.c.slice();
  var atk=A*(0.85+rnd(s)*0.3)*(s.heat>=100?1.25:1);
  var def=D*1.15*dfac(best.v)*(0.85+rnd(s)*0.3)*(hasTech(s,'b4')?1.1:1);
  var names=best.c.map(function(x){return ORGS[x.r].short;}).join('·');
  if(D===0||atk>def){
    var la=Math.min(A-1,Math.round(D*0.85));
    var lead=best.c.slice().sort(function(a,b){return b.A-a.A;})[0];
    T2.owner=lead.r;T2.men=Math.min(T2.cap,A-la);
    s.stats.lost++;s.lostTonight++;s.lastBlow='strike';
    strikeAt0.forEach(function(x){logBattle({from:x.u,to:best.v,A:x.A,D:D,win:true,lossA:Math.round(la*x.A/Math.max(1,A)),lossD:D,by:x.r,prev:0});});
    say(s,'연합군('+names+')이 '+eul(T2.name)+' 짓밟고 빼앗았다. ('+A+'명 vs '+D+'명)','bad');
  }else{
    var ld=Math.min(D-1,Math.round(A*0.7));
    T2.men=D-ld;
    best.c.forEach(function(x){s.tiles[x.u].men+=Math.floor(x.A*0.3);});
    say(s,'연합군('+names+')이 '+eul(T2.name)+' 에워쌌지만 막아냈다. ('+A+'명 vs '+D+'명)','good');
    strikeAt0.forEach(function(x){logBattle({from:x.u,to:best.v,A:x.A,D:D,win:false,lossA:Math.round(x.A*0.7),lossD:Math.min(D-1,Math.round(A*0.7)),by:x.r,prev:0});});
    adjv(s,'dread',2);
  }
  return true;
}
/* 배신당한 쪽을 노리는 기습: 병력이 모자라도 칼을 뽑는다 */
function surpriseAttack(s,r,target){
  var pr=pickAttack(s,r,function(v){return v.owner===target;},{minMargin:-1.5});
  if(!pr)return false;
  doRivalAttack(s,r,pr,'ambush',{bonus:1.25});
  return true;
}
function rivalTurn(s,r){
  var acted=false;
  var amb=s.ambush.filter(function(q){return q.by===r;});
  s.ambush=s.ambush.filter(function(q){return q.by!==r;});
  amb.forEach(function(q){if(s.dead[r]||(q.on>0&&s.dead[q.on]))return;if(surpriseAttack(s,r,q.on))acted=true;});
  if(!hasPact(s,r,0)&&!acted){
    var p=(r===3)?0.5:pBite(s,r);
    if(rnd(s)<p){
      var mm=clamp((s.dread-25)/12,-2,3)+(r===1?1:0)-(r===2?Math.min(2,s.grudge[2]):0);
      var pr2=(r===3)?pickWeakest(s,r):pickAttack(s,r,function(v){return v.owner===0;},{minMargin:mm});
      if(pr2){doRivalAttack(s,r,pr2,'bite');acted=true;
        if(p>0.45&&rnd(s)<p){var pr4=(r===3)?pickWeakest(s,r):pickAttack(s,r,function(v){return v.owner===0;},{minMargin:mm});if(pr4)doRivalAttack(s,r,pr4,'bite');}}
    }
  }
  if(!acted){
    if(rnd(s)<0.7)expandRival(s,r);
    else{
      /* 이웃끼리의 싸움: 미운 상대가 있으면 그쪽으로, 경계가 낮을수록 자주 */
      var foe=foeOf(s,r);
      var pf=foe>=1?0.55:(s.heat<50?0.5:0.15);
      if(rnd(s)<pf){
        var pr3=pickAttack(s,r,function(v){return v.owner>=1&&v.owner!==r&&!s.dead[v.owner]&&!hasPact(s,r,v.owner)&&(foe<0||v.owner===foe);},{minMargin:2});
        if(pr3)doRivalAttack(s,r,pr3,'fight');
      }
    }
  }
  reinforce(s,r);
}

var VOICE={
  lost:['셔터가 내려진 가게 앞, 간판의 문양이 하룻밤 사이에 바뀌어 있었다.','어젯밤까지 당신에게 내던 봉투를 오늘은 다른 사람이 받아 갔다. 가게 주인은 똑같은 얼굴로 웃었다.'],
  heat:['세 집의 어른이 같은 날 같은 가게에 모였다고 한다. 소문은 비 냄새보다 빨리 퍼진다.','건너편 조직의 차들이 평소보다 늦게까지 불을 켜 두고 있다.','누군가 당신의 이름을 낮게 말한다. 뒤에 이어지는 말은 들리지 않는다.'],
  weak:['아이들이 당신네 간판 앞에 침을 뱉고 뛰어갔다. 아무도 혼내지 않았다.','"이번 달 봉투는 다음 주에 드릴게요." 웃으며 말하는 얼굴이 어딘가 낯설다.','국숫집 주인이 옆 조직의 안부를 먼저 묻는다. 당신 쪽은 쳐다보지 않는다.'],
  strong:['당신이 지나가면 골목의 대화가 끊긴다. 누구도 눈을 마주치지 않는다.','가게마다 셔터가 정시에 내려간다. 존경이 아니라 계산이다.','부하들이 먼저 문을 열어 준다. 그 손이 아주 조금 떨린다.'],
  poor:['봉투가 얇아졌다는 걸 부하들은 말하지 않아도 안다.','빈 금고를 쳐다보는 눈이 하나둘 늘었다.'],
  calm:['조용한 밤이다. 조용한 밤일수록 누군가 무언가를 세고 있다.','비가 그쳤다. 네온의 붉은빛이 젖은 아스팔트에 길게 눕는다.','술잔이 돌고 웃음이 돈다. 서로의 손이 어디에 있는지 모두 알고 있다.','아무 일도 없었다. 이 세계에서는 그 말을 아무도 믿지 않는다.']
};
function voice(s){
  var k='calm';
  if(s.lostTonight>0)k='lost';
  else if(s.heat>=60)k='heat';
  else if(s.dread<25)k='weak';
  else if(s.dread>=65)k='strong';
  else if(s.money<8)k='poor';
  var L=VOICE[k];
  return L[Math.floor(rnd(s)*L.length)];
}
/* 밤마다 들어오고 나가는 돈 (화면에도 같은 값을 쓴다) */
function budget(s){
  var mine=owned(s,0),inc=0,men=0;
  mine.forEach(function(t){inc+=tileInc(s,t);men+=t.men;});
  if(crewPerk(s,1))inc+=2;
  if(hasTech(s,'a5')&&s.money>=40)inc+=3;
  if(hasRule(s,'tribute'))inc=Math.ceil(inc*1.25);
  if(hasRule(s,'shield'))inc=Math.max(0,inc-1);
  if(s.diff===1)inc=Math.max(0,Math.floor(inc*0.9));
  var up=Math.ceil(men*(hasTech(s,'a3')?0.4:0.5));
  return{inc:inc,up:up,net:inc-up,men:men};
}
function endNight(s){
  if(s.over||s.pend)return;
  s.bubbles=[];
  s.lostTonight=0;s.focus=-1;s.streak=0;
  say(s,'밤이 깊었다','sep');
  var grown=0;
  var own0=owned(s,0),gn=Math.floor(own0.length/5);
  for(var gk=0;gk<gn;gk++){
    var gc=own0.filter(function(t){return t.men<Math.min(t.cap,growTarget(t));});
    if(!gc.length)break;
    var gf=gc.filter(function(t){return ADJ[t.id].some(function(j){return s.tiles[j].owner!==0;});});
    var gp=(gf.length?gf:gc).sort(function(x,y){return x.men-y.men;});
    gp[0].men++;grown++;
  }
  if(grown>0)say(s,'땅이 있으니 사람이 모인다. 여러 곳에서 병력 '+grown+'명이 늘었다.','dim');
  if(hasTech(s,'b5')){
    var po=owned(s,0).filter(function(t){return t.men<t.cap&&ADJ[t.id].some(function(j){return s.tiles[j].owner!==0;});}).sort(function(x,y){return x.men-y.men;})[0];
    if(po){po.men++;say(s,'감시 초소가 '+eul(po.name)+' 지킬 사람을 한 명 보탰다.','dim');}
  }
  var mine=owned(s,0),bg=budget(s),inc=bg.inc,up=bg.up;
  s.money+=inc-up;
  if(s.money<0){
    var short=-s.money;s.money=0;
    var gone=0;
    for(var k=0;k<short;k++){
      var big=mine.slice().sort(function(a,b){return b.men-a.men;})[0];
      if(!big||big.men<=1)break;
      big.men--;gone++;
    }
    adjv(s,'dread',-3);
    say(s,'수입 ¥'+inc+' · 유지비 ¥'+up+'. 돈이 모자라 '+gone+'명이 말없이 떠났다.','bad');
  }else{
    say(s,'수입 ¥'+inc+' · 유지비 ¥'+up+' · 자금 ¥'+s.money,'dim');
  }
  var heatUp=Math.max(0,s.dread-50)*0.3+Math.max(0,mine.length-4)*1.4;
  adjv(s,'dread',-2.5);
  var forests=0;mine.forEach(function(t){if(NODES[t.id].ter==='forest')forests++;});
  adjv(s,'heat',heatUp-2-Math.min(2,forests));
  if(s.anx>=60)adjv(s,'dread',-2);
  if(hasRule(s,'giri')||hasRule(s,'shield'))adjv(s,'dread',-1);
  if(hasRule(s,'shield')&&hasRule(s,'giri'))adjv(s,'dread',-1);
  if(hasRule(s,'omerta'))adjv(s,'heat',-3);
  if(hasRule(s,'iron')){adjv(s,'dread',1);adjv(s,'heat',1);}
  adjv(s,'heat',(hasTech(s,'b1')?1:0)+(hasTech(s,'b2')?1:0)+(hasTech(s,'b3')?2:0)-(hasTech(s,'c1')?2:0));

  var nal=alliesOf(s,0).length;
  if(nal)adjv(s,'heat',-Math.min(4,2*nal));
  relDrift(s);pactNight(s);formAlliances(s);neighborPeace(s);rallyCoalition(s);allySupport(s);
  var parts=participants(s);
  var strikeNow=false;
  if(s.heat>=strikeAt(s)&&parts.length>=2){
    say(s,'연합이 움직였다. '+iga(parts.map(function(r){return ORGS[r].short;}).join(', '))+' 같은 시각에 문을 열었다.','bad');
    var rounds=0;
    while(rounds<2&&doStrike(s,parts))rounds++;
    if(rounds>0){strikeNow=true;s.stats.strikes++;}
    else say(s,'연합은 모였지만 아직 이쪽까지 닿지 못했다.','dim');
  }
  var order=[1,2,3].filter(function(r){return!s.dead[r];});
  for(var i=order.length-1;i>0;i--){var j=Math.floor(rnd(s)*(i+1));var tmp=order[i];order[i]=order[j];order[j]=tmp;}
  order.forEach(function(r){
    if(strikeNow&&parts.indexOf(r)>=0)reinforce(s,r);
    else rivalTurn(s,r);
    if(s.diff===1&&rnd(s)<0.5)reinforce(s,r);
  });
  if(strikeNow){
    adjv(s,'heat',-(s.heat>=100?65:35));
    if(s.heat<20)s.heat=20;
    if(s.lostTonight===0){adjv(s,'dread',4);say(s,'연합은 아무것도 얻지 못하고 물러갔다. 대가는 컸다.','good');}
  }
  for(var r=1;r<=3;r++){
    s.grudge[r]=Math.max(0,s.grudge[r]-(r===2?0.5:1));
  }
  offersNight(s);pactTick(s);
  adjv(s,'anx',-2+(s.heat>=55?3:0)+s.lostTonight*6-(crewPerk(s,2)?2:0)+(hasRule(s,'omerta')?1:0)-(hasRule(s,'shield')?2:0)-(hasTech(s,'c3')?2:0));
  crewNight(s);
  say(s,voice(s),'voice');
  if(s.anx>=100){s.over={type:'fall',cause:'nerve'};return;}
  if(s.tiles[HQ_ID].owner!==0||owned(s,0).length===0){
    s.over={type:'fall',cause:s.lastBlow||'bite'};
    return;
  }
  checkGoal(s);
  s.day++;s.ap=AP_MAX;
  if(s.day>MAXDAY)s.over={type:'survive'};
  queueDecision(s);
}
function endingFor(s){
  var o=s.over,m=owned(s,0).length;
  if(o.type==='fall'){
    if(o.cause==='nerve')return{kicker:'몰락',title:'벗겨진 가면',text:'센 척은 오래가지 않았다. 어느 밤, 손이 떨리는 것을 모두가 보았다. 그날부터 아무도 당신을 두려워하지 않았다.'};
    if(o.cause==='strike')return{kicker:'몰락',title:'연합의 밤',text:'세 개의 조직이 같은 시각에 문을 열었다. 아무도 혼자 오지 않았다. 당신은 너무 강했고, 그래서 그들은 서로를 믿기로 했다.'};
    if(o.cause==='betray')return{kicker:'몰락',title:'등 뒤의 술잔',text:'동맹은 술잔을 비우는 동안에만 동맹이었다. 칼은 앞에서 오지 않았다. 믿은 만큼 깊이 들어왔다.'};
    if(o.cause==='grudge')return{kicker:'몰락',title:'갚아야 할 것',text:'당신이 남긴 상처는 잊히지 않았다. 체면을 잃은 자는 가장 늦게, 가장 조용히 온다.'};
    return{kicker:'몰락',title:'먹잇감',text:'처음엔 땅 한 뙈기였다. 아무도 화내지 않았다. 웃으면서 가져갔을 뿐이다. 우습게 보이던 그 순간에 이미 끝나 있었다.'};
  }
  if(o.type==='leave')return{kicker:'탈출',title:'발을 씻다',text:'문을 나서며 뒤를 돌아보지 않았다. 돌아보면 누군가 서 있을까 봐. 이 세계는 나가는 사람에게도 값을 받는다.'};
  if(o.type==='alone')return{kicker:'정상',title:'혼자 남은 반도',text:'마지막 간판이 내려갔다. 이제 아무도 손잡지 않는다. 손잡을 상대가 없기 때문이다. 이 땅의 규칙은 당신의 기분이다.'};
  var live=[1,2,3].filter(function(r){return!s.dead[r];});
  if(live.length>=2&&live.every(function(r){return pactKind(s,0,r)==='ally';}))return{kicker:'서른 밤',title:'한 식탁',text:'모든 조직이 같은 식탁에 앉았다. 서로의 손을 볼 수 있는 자리에서. 이 평화가 얼마나 갈지는 아무도 묻지 않았다. 묻는 순간 깨질 것을 알기 때문이다.'};
  if(s.goalsDone>=4&&m>=6)return{kicker:'서른 밤',title:'계산된 밤',text:'모든 밤을 장부에 적었다. 예보를 읽고, 목표를 세우고, 하나씩 지워 나갔다. 이 세계에서 가장 드문 것은 용기가 아니라 계획이다.'};
  if(s.stats.mercy>=4&&s.stats.harsh<=1&&s.stats.examples===0)return{kicker:'서른 밤',title:'느슨하게 쥔 주먹',text:'주먹을 세게 쥔 적이 거의 없다. 사람들은 그것을 약함이라 불렀지만, 서른 밤을 버틴 것은 그 느슨한 손이었다.'};
  if(m>=13&&s.dread>=60)return{kicker:'서른 밤',title:'혼자 앉은 상석',text:'가장 높은 자리에 앉았다. 술잔을 건넬 사람은 없다. 잔에 입을 대기 전에 당신은 매번 잔을 한 번 더 본다.'};
  if(m>=8&&s.heat<=45)return{kicker:'서른 밤',title:'살얼음 위의 균형',text:'아무도 이기지 못했고 아무도 무너지지 않았다. 이 균형은 누구의 것도 아니고, 누구든 먼저 발을 떼면 깨진다.'};
  return{kicker:'서른 밤',title:'버틴 사람',text:'아직 살아 있다. 이 세계에서는 그것이 이력서의 전부다.'};
}
