/* ========== 외교: 호감 · 휴전 · 동맹 · 배신 · 화해 ==========
   s.rel[a][b]  a가 b를 어떻게 보는가 (−100 적대 … +100 우호). a는 이웃 1~3, b는 0(우리)~3.
   s.pacts      [{a,b,k:'truce'|'ally',left,since}] a<b. 0이 끼면 우리와 맺은 약속이다.
   s.offers     이웃이 우리에게 청한 제안(화해·동맹·조공)이 다음 밤에 팝업으로 뜬다.
   밤마다 (1) 감정이 식거나 쌓이고 (2) 약속이 깨지거나 (3) 새 동맹·화해가 생긴다. */
var PERS={
  1:{timid:0.8,honor:0.35,greed:0.25,tag:'승자 편에 서는 노회한 무리'},
  2:{timid:0.2,honor:0.9,greed:0.2,tag:'신의를 지키지만 원한도 잊지 않는다'},
  3:{timid:0.3,honor:0.1,greed:0.9,tag:'약해진 동맹을 먼저 물어뜯는다'}
};
var PACT_COST={truce:15,ally:30,gift:10,discord:20};
function who(x){return x===0?'우리':ORGS[x].short;}
function addRel(s,a,b,v){if(a===b||a<1)return;s.rel[a][b]=clamp(s.rel[a][b]+v,-100,100);}
function getPact(s,a,b){
  var lo=Math.min(a,b),hi=Math.max(a,b);
  for(var i=0;i<s.pacts.length;i++){var p=s.pacts[i];if(p.a===lo&&p.b===hi)return p;}
  return null;
}
function pactKind(s,a,b){var p=getPact(s,a,b);return p?p.k:'';}
function hasPact(s,a,b){return!!getPact(s,a,b);}
function dropPact(s,a,b){
  var lo=Math.min(a,b),hi=Math.max(a,b);
  s.pacts=s.pacts.filter(function(p){return!(p.a===lo&&p.b===hi);});
}
function addPact(s,a,b,k,left){
  dropPact(s,a,b);
  s.pacts.push({a:Math.min(a,b),b:Math.max(a,b),k:k,left:left||0,since:s.day,ask:s.day});
}
function alliesOf(s,x){
  var out=[];
  s.pacts.forEach(function(p){if(p.k!=='ally')return;if(p.a===x)out.push(p.b);else if(p.b===x)out.push(p.a);});
  return out;
}
function dipNews(s,text,tone){
  say(s,text,tone||'dip');
  s.news.push({day:s.day,text:text,tone:tone||'dip'});
  if(s.news.length>12)s.news.shift();
}
function share(s,a){var n=0;s.tiles.forEach(function(t){if(t.owner===a)n++;});return n/s.tiles.length;}
function powerOf(s,a){var p=0;s.tiles.forEach(function(t){if(t.owner===a)p+=t.men+1.5;});return p;}
function contacts(s,a,b){
  var c=0;
  s.tiles.forEach(function(u){if(u.owner!==a)return;ADJ[u.id].forEach(function(v){if(s.tiles[v].owner===b)c++;});});
  return c;
}
/* 상대가 우리를 미워하는지(연합 가담 후보) */
function willing(s,r){
  if(s.dead[r]||hasPact(s,r,0))return false;
  return s.heat>=ORGS[r].join||s.grudge[r]>=3||s.rel[r][0]<=-45;
}
function hurt(s,victim,attacker,amt){
  s.hit[victim]=s.day;
  if(victim>=1)addRel(s,victim,attacker,-amt);
  alliesOf(s,victim).forEach(function(y){if(y!==attacker&&y>=1)addRel(s,y,attacker,-amt*0.5);});
}
/* 같은 적을 둔 사이인가 (동맹이 더 단단해지는 조건) */
function sharedFoe(s,a,b){
  if(s.heat>=40&&!hasPact(s,a,0)&&!hasPact(s,b,0))return true;
  for(var x=1;x<=3;x++){
    if(x===a||x===b||s.dead[x])continue;
    if(s.rel[a][x]<-25&&s.rel[b][x]<-25&&!hasPact(s,a,x)&&!hasPact(s,b,x))return true;
  }
  return false;
}

/* ---------- 감정의 흐름 ---------- */
function relDrift(s){
  for(var a=1;a<=3;a++){
    if(s.dead[a])continue;
    for(var b=0;b<=3;b++){
      if(a===b||(b>0&&s.dead[b]))continue;
      var pk=pactKind(s,a,b),d=0;
      var r=s.rel[a][b]*(a===2?0.94:0.9);
      var c=contacts(s,a,b)+contacts(s,b,a);
      if(!pk&&c)d-=Math.min(3,c*0.5);
      if(pk==='ally')d+=sharedFoe(s,a,b)?3:0.6;
      else if(pk==='truce')d+=1;
      if(b>0){
        var both=!hasPact(s,a,0)&&!hasPact(s,b,0);
        if(both&&s.heat>=40)d+=(s.heat-35)/12;
        else if(s.heat<30)d-=1.2;
        d+=s.aff[a][b];
        d+=(rnd(s)-0.5)*4;
        var shb=share(s,b);if(shb>0.4)d-=(shb-0.4)*25;
      }else{
        d-=Math.max(0,s.heat-50)/20;
        if(s.dread>=65)d+=PERS[a].timid*1.5;else if(s.dread<30)d-=1;
        d+=(rnd(s)-0.5)*2;
        var sh0=share(s,0);if(sh0>0.4)d-=(sh0-0.4)*25;
      }
      s.rel[a][b]=clamp(r+d,-100,100);
    }
  }
}

/* ---------- 약속이 깨질 위험 (x가 y를 저버릴 확률/밤) ---------- */
function betrayRisk(s,x,y){
  var P=PERS[x],px=powerOf(s,x),py=powerOf(s,y);
  var weak=clamp(px/(py+1)-1,0,1.5);
  var p=0.01+P.greed*0.07*weak;
  if(y===0){
    if(s.anx>=70)p+=0.04*(1+P.greed);
    if(s.dread<30)p+=0.04*P.greed;
  }
  if(share(s,y)>0.4)p+=0.05;
  if(s.rel[x][y]<10)p+=0.04;
  if(P.timid>0.5){
    var top=0,ty=-1;
    for(var z=0;z<=3;z++){if(z===x||z===y||(z>0&&s.dead[z]))continue;var sz=share(s,z);if(sz>top){top=sz;ty=z;}}
    if(ty>=0&&top>share(s,y)*1.5+0.02)p+=0.05;
  }
  p-=P.honor*0.04;
  return clamp(p,0,0.5);
}
function riskLabel(p){return p>=0.12?{k:'high',t:'높음'}:(p>=0.05?{k:'mid',t:'보통'}:{k:'low',t:'낮음'});}

function betrayPact(s,x,y){
  dropPact(s,x,y);
  var P=PERS[x];
  if(y>=1){addRel(s,y,x,-70);addRel(s,x,y,-30);}else addRel(s,x,0,-70);
  /* 신의를 잃으면 모두가 그 이름을 기억한다 */
  for(var z=1;z<=3;z++){if(z!==x&&z!==y&&!s.dead[z])addRel(s,z,x,-12);}
  s.stats.pactBroken++;
  if(y===0)s.stats.betrayedBy++;
  if(P.timid>0.5&&rnd(s)<0.7){
    var top=-1,ts=0;
    for(var z2=0;z2<=3;z2++){if(z2===x||z2===y||(z2>0&&s.dead[z2]))continue;var sz=share(s,z2);if(sz>ts){ts=sz;top=z2;}}
    dipNews(s,iga(who(x))+' '+(y===0?'우리와의':wa(who(y))+'의')+' 동맹을 저버리고 '+(top===0?'우리':who(top))+' 쪽으로 돌아섰다.','bad');
    if(top>=0&&!hasPact(s,x,top)){
      addPact(s,x,top,'ally');addRel(s,x,top,20);if(top>=1)addRel(s,top,x,20);
    }
    return;
  }
  s.ambush.push({by:x,on:y});
  dipNews(s,'배신! '+iga(who(x))+' '+wa(y===0?'우리':who(y))+'의 동맹을 깨고 칼을 뽑았다.','bad');
}

function pactNight(s){
  var list=s.pacts.slice();
  list.forEach(function(p){
    if(!getPact(s,p.a,p.b))return;
    if(p.k==='truce')return;
    [[p.a,p.b],[p.b,p.a]].forEach(function(pair){
      var x=pair[0],y=pair[1];
      if(x===0||!getPact(s,p.a,p.b)||s.dead[x])return;
      if(s.rel[x][y]<-5&&rnd(s)<0.6){
        dropPact(s,x,y);
        dipNews(s,wa(who(x))+' '+who(y)+'의 동맹이 틀어졌다. 서로 등을 돌렸다.','dip');
        return;
      }
      if(rnd(s)<betrayRisk(s,x,y)){betrayPact(s,x,y);return;}
    });
    var q=getPact(s,p.a,p.b);
    if(q&&q.a>0&&s.day-q.since>8&&!sharedFoe(s,q.a,q.b)&&rnd(s)<0.08){
      dropPact(s,q.a,q.b);
      dipNews(s,wa(who(q.a))+' '+who(q.b)+'의 동맹이 흐지부지 끝났다. 더는 서로 필요하지 않았다.','dip');
    }
  });
}
function pactTick(s){
  s.pacts=s.pacts.filter(function(p){
    if(p.k!=='truce')return true;
    p.left--;
    if(p.left>0)return true;
    if(p.a===0&&p.left<=0&&p.since<s.day)dipNews(s,wa(who(p.b))+'의 휴전이 끝났다.','dip');
    return false;
  });
  for(var r=1;r<=3;r++){if(s.cool[r]>0)s.cool[r]--;if(s.refused[r]>0)s.refused[r]--;}
}

/* ---------- 새 동맹 · 화해 (이웃끼리) ---------- */
function formAlliances(s){
  for(var a=1;a<=3;a++)for(var b=a+1;b<=3;b++){
    if(s.dead[a]||s.dead[b]||pactKind(s,a,b)==='ally')continue;
    if(s.rel[a][b]>=22&&s.rel[b][a]>=22&&rnd(s)<0.4){
      addPact(s,a,b,'ally');
      var why=sharedFoe(s,a,b)?(s.heat>=40&&!hasPact(s,a,0)&&!hasPact(s,b,0)?'우리라는 공통의 위협 때문에':'같은 적을 두었기 때문에'):'서로 이득이 맞아서';
      dipNews(s,wa(who(a))+' '+iga(who(b))+' '+why+' 손을 잡았다.','bad');
      s.stats.alliesFormed++;
    }
  }
}
function neighborPeace(s){
  for(var a=1;a<=3;a++)for(var b=a+1;b<=3;b++){
    if(s.dead[a]||s.dead[b]||hasPact(s,a,b))continue;
    if(s.rel[a][b]<=-20&&s.rel[b][a]<=-20&&contacts(s,a,b)+contacts(s,b,a)>0){
      var pa=powerOf(s,a),pb=powerOf(s,b);
      if(Math.max(pa,pb)/(Math.min(pa,pb)+1)>1.5&&rnd(s)<0.25){
        addPact(s,a,b,'truce',4);addRel(s,a,b,18);addRel(s,b,a,18);
        dipNews(s,wa(who(a))+' '+iga(who(b))+' 싸움을 멈추고 휴전했다.','dip');
      }
    }
  }
}
/* 연합 습격 직전에는 우리를 미워하는 이웃들이 서둘러 손을 잡는다 */
function rallyCoalition(s){
  if(s.heat<strikeAt(s))return;
  var w=[1,2,3].filter(function(r){return willing(s,r);});
  for(var i=0;i<w.length;i++)for(var j=i+1;j<w.length;j++){
    if(pactKind(s,w[i],w[j])==='ally')continue;
    addPact(s,w[i],w[j],'ally');
    addRel(s,w[i],w[j],20);addRel(s,w[j],w[i],20);
    dipNews(s,wa(who(w[i]))+' '+iga(who(w[j]))+' 우리를 치기 위해 급히 동맹을 맺었다.','bad');
    s.stats.alliesFormed++;
  }
}
/* 동맹으로 묶인, 우리를 노리는 무리 */
function participants(s){
  var w=[1,2,3].filter(function(r){return willing(s,r);}),out=[];
  w.forEach(function(r){
    if(w.some(function(q){return q!==r&&pactKind(s,r,q)==='ally';}))out.push(r);
  });
  return out;
}

/* ---------- 이웃이 우리에게 청하는 것 ---------- */
function offersNight(s){
  s.offers=s.offers.filter(function(o){return s.day-o.day<=1;});
  if(s.offers.length)return;
  for(var r=1;r<=3;r++){
    if(s.dead[r]||s.cool[r]>0)continue;
    var pk=pactKind(s,r,0),o=s.rel[r][0],P=PERS[r],pc=getPact(s,r,0);
    if(!pk){
      var losing=share(s,r)<0.16||(s.day-s.hit[r]<=2);
      var p=0.07+P.timid*0.14+(s.dread>=60?0.12:0)+(losing?0.2:0)+Math.max(0,o)/200-s.grudge[r]*0.07-((r===2&&s.grudge[r]>=2)?0.15:0);
      if(o<=-60||s.day<3)p=0;
      if(rnd(s)<p){s.offers.push({type:'offer',kind:'truce',r:r,day:s.day});s.cool[r]=5;return;}
      /* 우리가 강하고 호감이 있으면, 휴전 없이도 판이 기운 쪽(우리)에 붙으려 한다 */
      if(o>=18&&s.dread>=55&&s.day>=4&&rnd(s)<0.08+P.timid*0.08){s.offers.push({type:'offer',kind:'ally',r:r,day:s.day});s.cool[r]=6;return;}
    }else if(pk==='truce'&&o>=25&&s.day-pc.since>=2){
      if(rnd(s)<0.3){s.offers.push({type:'offer',kind:'ally',r:r,day:s.day});s.cool[r]=6;return;}
    }else if(pk==='ally'&&s.day-pc.ask>=7&&rnd(s)<0.18){
      pc.ask=s.day;
      s.offers.push({type:'offer',kind:'tribute',r:r,day:s.day});return;
    }
  }
}
function foeOf(s,r){
  var best=-1,bv=-15;
  for(var x=1;x<=3;x++){if(x===r||s.dead[x]||hasPact(s,r,x))continue;if(s.rel[r][x]<bv){bv=s.rel[r][x];best=x;}}
  return best;
}
var OFFER_TEXT={
  truce:{
    1:'하야시구미의 사자가 찻잔을 두 손으로 받쳐 들고 왔다. "서로 피를 보는 것은 노인네들 몫이 아닙니다. 당분간 문을 닫고 지냅시다."',
    2:'쓰키가미카이에서 하얀 봉투가 왔다. 체면을 잃지 않을 만큼만 낮춘 글씨다. "네 밤, 서로의 문 앞을 지나지 않기로 청합니다."',
    3:'구로이누의 사내가 이빨을 보이며 웃었다. "이 판에서 이빨 빠지는 건 우리도 싫거든. 잠깐 쉬자고."'
  },
  ally:{
    1:'하야시구미 회장이 직접 찾아왔다. "이 판은 이미 기울고 있습니다. 힘 있는 쪽과 함께하는 게 제 오랜 지혜지요."',
    2:'쓰키가미카이의 오야붕이 술잔을 내밀었다. "당신은 약속을 지키는 사람이라 들었소. 우리의 칼과 체면을 함께 쓰시오."',
    3:'구로이누의 두목이 어깨를 으쓱했다. "같은 편이 되면 편하지. 다만 약해지면 어떻게 되는지는 서로 알 거야."'
  },
  tribute:{
    1:'하야시구미가 조심스럽게 손을 내밀었다. "저희도 형편이… 이번 달 힘을 보태 주실 수 있겠습니까."',
    2:'쓰키가미카이가 격식을 갖춰 말했다. "동맹이란 서로의 비용을 나누는 것이오. 이번 몫을 청하오."',
    3:'구로이누가 손바닥을 펼쳤다. "동맹이잖아? 이번엔 네가 쏴."'
  }
};
function buildOffer(s,p){
  var r=p.r,nm=ORGS[r].name,k=p.kind;
  if(k==='truce')return{
    title:nm+'의 화해 제의',kicker:'외교',text:OFFER_TEXT.truce[r],
    choices:[
      {label:'받아들인다',desc:'4밤 동안 서로 치지 않는다 · 호감 +12',kind:'mercy',
       out:wa(nm)+' 술잔을 한 번 돌렸다. 4밤 동안 서로의 문 앞을 지나지 않기로 했다.',
       fx:function(s,p){addPact(s,0,r,'truce',4);addRel(s,r,0,12);s.grudge[r]=0;s.stats.pactsMade++;}},
      {label:'조공을 받고 받아들인다',desc:'¥+14 · 호감 −6 · 25% 확률로 틀어짐',kind:'harsh',
       out:'조공을 받고 휴전을 받아 주었다.',
       fx:function(s,p){
         if(rnd(s)<0.25){addRel(s,r,0,-10);s.grudge[r]+=1;return eun(nm)+' 모욕이라며 자리를 떠났다. 화해는 없던 일이 되었다.';}
         s.money+=14;addPact(s,0,r,'truce',4);addRel(s,r,0,6);s.stats.pactsMade++;adjv(s,'dread',2);
       }},
      {label:'거절한다',desc:'호감 −8',kind:'neutral',
       out:'사자는 아무 말 없이 돌아갔다. 거절은 기억된다.',
       fx:function(s,p){addRel(s,r,0,-8);}}
    ]};
  if(k==='ally'){
    var foe=foeOf(s,r),fn=foe>=1?ORGS[foe].short:'';
    return{
      title:nm+'의 동맹 제의',kicker:'외교',text:OFFER_TEXT.ally[r]+(fn?' (공동의 적: '+fn+')':''),
      choices:[
        {label:'동맹을 맺는다',desc:'서로 치지 않고 매밤 경계 −2 · 가끔 병력 지원 · 배신의 위험은 있다',kind:'neutral',
         out:wa(nm)+' 동맹을 맺었다. 술잔은 비었지만 서로의 손은 아직 보였다.',
         fx:function(s,p){
           addPact(s,0,r,'ally');addRel(s,r,0,10);s.stats.pactsMade++;s.stats.alliesFormed++;
           for(var x=1;x<=3;x++){if(x!==r&&!s.dead[x]&&s.rel[x][r]<-20)addRel(s,x,0,-8);}
         }},
        {label:'아직은 이르다',desc:'호감 −3',kind:'neutral',
         out:'"시간을 주시오." 사자는 정중하게 고개를 숙였다.',
         fx:function(s,p){addRel(s,r,0,-3);}}
      ]};
  }
  var amt=10+Math.floor(s.day/5)*2;
  return{
    title:nm+'의 요청',kicker:'외교',text:OFFER_TEXT.tribute[r],
    choices:[
      {label:'돈을 보탠다',desc:'¥−'+amt+' · 호감 +10',cost:amt,kind:'mercy',
       out:'봉투를 건넸다. 동맹은 이렇게 값을 치르며 유지된다.',
       fx:function(s,p){s.money-=amt;addRel(s,r,0,10);}},
      {label:'거절한다',desc:'호감 −14 · 배신 위험 증가',kind:'harsh',
       out:'요청을 거절했다. 상대의 표정은 변하지 않았지만 눈은 계산하고 있었다.',
       fx:function(s,p){addRel(s,r,0,-14);}}
    ]};
}

/* ---------- 우리가 직접 하는 외교 ---------- */
function proposalChance(s,r,kind){
  var o=s.rel[r][0],P=PERS[r],p;
  if(kind==='truce'){
    p=0.36+o/160+(s.dread-45)/180+(s.dread>=55?P.timid*0.12:0)-s.grudge[r]*0.07;
    if(share(s,r)<0.16||s.day-s.hit[r]<=2)p+=0.14;
    if(s.heat>=70)p-=0.12;
  }else{
    p=0.12+o/110+(s.dread-40)/260-s.grudge[r]*0.06-(r===2?0.04:0);
    if(pactKind(s,r,0)==='truce')p+=0.18;
    if(s.heat>=45)p+=0.1;
  }
  if(hasTech(s,'c4'))p+=0.15;
  return clamp(p,0.05,0.92);
}
function chanceLabel(p){return p>=0.6?'높음':(p>=0.3?'보통':'낮음');}
function proposalCost(s,kind){return Math.max(5,PACT_COST[kind]-(hasTech(s,'c4')?3:0));}
function dipCheck(s,r){
  if(r<1||r>3||s.dead[r])return fail('마주 앉을 상대가 없다.');
  return null;
}
function actDrink(s,r){
  var dc=drinkCost(s),e=pre(s,dc);if(e)return e;
  e=dipCheck(s,r);if(e)return e;
  if(pactKind(s,r,0)==='ally')return fail('이미 동맹이다. 술잔은 따로 필요 없다.');
  s.money-=dc;s.ap--;adjv(s,'heat',-12);adjv(s,'dread',-4);adjv(s,'anx',-4);s.grudge[r]=0;addRel(s,r,0,8);
  if(!hasPact(s,0,r))addPact(s,0,r,'truce',1);
  say(s,ORGS[r].short+'와 술잔을 나눴다. 오늘 밤 그쪽은 움직이지 않는다. (¥'+dc+')');
  return{ok:true};
}
function actPropose(s,r,kind){
  var cost=proposalCost(s,kind),e=pre(s,cost);if(e)return e;
  e=dipCheck(s,r);if(e)return e;
  var pk=pactKind(s,r,0);
  if(pk==='ally')return fail('이미 동맹이다.');
  if(kind==='truce'&&pk==='truce')return fail('이미 휴전 중이다.');
  if(s.refused[r]>0)return fail('오늘 밤은 더 청할 수 없다. 방금 거절당했다.');
  var p=proposalChance(s,r,kind);
  s.money-=cost;s.ap--;
  if(rnd(s)<p){
    if(kind==='truce'){
      addPact(s,0,r,'truce',4);addRel(s,r,0,12);s.grudge[r]=0;
      dipNews(s,iga(ORGS[r].short)+' 휴전을 받아들였다. 4밤 동안 서로 치지 않는다. (¥'+cost+')','good');
    }else{
      addPact(s,0,r,'ally');addRel(s,r,0,10);s.stats.alliesFormed++;
      for(var x=1;x<=3;x++){if(x!==r&&!s.dead[x]&&s.rel[x][r]<-20)addRel(s,x,0,-8);}
      dipNews(s,iga(ORGS[r].short)+' 동맹을 받아들였다. (¥'+cost+')','good');
    }
    s.stats.pactsMade++;
    return{ok:true,pact:true};
  }
  addRel(s,r,0,-2);s.refused[r]=1;
  say(s,iga(ORGS[r].short)+' '+(kind==='truce'?'휴전':'동맹')+' 제의를 거절했다. (¥'+cost+')','bad');
  return{ok:true,pact:false};
}
function actGift(s,r){
  var cost=PACT_COST.gift,e=pre(s,cost);if(e)return e;
  e=dipCheck(s,r);if(e)return e;
  s.money-=cost;s.ap--;addRel(s,r,0,14);s.grudge[r]=Math.max(0,s.grudge[r]-1);
  say(s,ORGS[r].short+'에 선물을 보냈다. 받는 쪽은 아무 말도 하지 않았지만 포장은 풀려 있었다. (¥'+cost+')','dim');
  return{ok:true};
}
function discordChance(s,a,b){
  var lo=Math.min(s.rel[a][b],s.rel[b][a]);
  return clamp(0.3+(40-lo)/150,0.15,0.8);
}
function actDiscord(s,a,b){
  if(!hasTech(s,'c5'))return fail('이간 공작은 은폐 강화 "이간 공작"이 있어야 쓸 수 있다.');
  var cost=PACT_COST.discord,e=pre(s,cost);if(e)return e;
  if(pactKind(s,a,b)!=='ally')return fail('동맹 관계인 둘에게만 쓸 수 있다.');
  var p=discordChance(s,a,b);
  s.money-=cost;s.ap--;
  addRel(s,a,b,-30);addRel(s,b,a,-30);
  if(rnd(s)<p){
    dropPact(s,a,b);
    dipNews(s,'이간 공작이 먹혔다. '+wa(who(a))+' '+who(b)+'의 동맹이 깨졌다. (¥'+cost+')','good');
  }else{
    addRel(s,a,0,-10);addRel(s,b,0,-10);adjv(s,'heat',3);
    say(s,'이간 공작이 들켰다. 두 조직 모두 우리를 의심한다. (¥'+cost+')','bad');
  }
  return{ok:true};
}
function actBreak(s,r){
  if(s.over)return fail('이미 끝난 이야기다.');
  if(s.pend)return fail('먼저 결정을 내려야 한다.');
  var pk=pactKind(s,r,0);
  if(!pk)return fail('맺은 약속이 없다.');
  dropPact(s,r,0);
  addRel(s,r,0,pk==='ally'?-50:-25);
  for(var x=1;x<=3;x++){if(x!==r&&!s.dead[x])addRel(s,x,0,-6);}
  adjv(s,'dread',-2);
  dipNews(s,wa(ORGS[r].short)+'의 '+(pk==='ally'?'동맹':'휴전')+'을 우리가 먼저 깼다. 신의 없는 자라는 말이 돈다.','bad');
  return{ok:true};
}

/* ---------- 이웃의 속마음을 풀어 쓰기 ---------- */
function attitude(s,r){
  if(s.dead[r])return{k:'dead',t:'붕괴'};
  var pk=pactKind(s,r,0),pc=getPact(s,r,0);
  if(pk==='ally')return{k:'ally',t:'동맹'};
  if(pk==='truce')return{k:'calm',t:'휴전 '+pc.left+'밤'};
  var part=participants(s);
  if(part.indexOf(r)>=0)return{k:'join',t:'연합에 가담'};
  if(willing(s,r))return{k:'join',t:'손잡을 의향'};
  var o=s.rel[r][0];
  if(o<=-35)return{k:'hate',t:'적대'};
  if(s.grudge[r]>=1)return{k:'grudge',t:'벼르는 중'};
  if(r===3)return s.dread<60?{k:'scorn',t:'약한 곳을 찾는 중'}:{k:'watch',t:'눈치 보는 중'};
  if(s.dread<ORGS[r].thr)return{k:'scorn',t:'얕보는 중'};
  if(s.dread>=65)return{k:'fear',t:'두려워하는 중'};
  if(o>=25)return{k:'fear',t:'호의적'};
  return{k:'watch',t:'지켜보는 중'};
}
function relLabel(v){return v<=-60?'원수':(v<=-30?'적대':(v<=-10?'냉랭':(v<25?'무덤덤':(v<55?'호의':'우호'))));}
function moodReasons(s,r){
  var out=[],o=s.rel[r][0],pk=pactKind(s,r,0);
  if(s.dead[r])return['무너진 조직이다.'];
  if(pk==='ally'){var br=riskLabel(betrayRisk(s,r,0));out.push('동맹 중이다. 배신 위험 '+br.t+'.');}
  else if(pk==='truce')out.push('휴전 중이라 이 기간엔 치지 않는다.');
  if(s.grudge[r]>=1)out.push('우리에게 당한 원한이 남아 있다.');
  if(!pk&&s.dread<ORGS[r].thr)out.push('우리 위세가 낮아 얕보고 있다.');
  if(!pk&&s.dread>=65)out.push('우리 위세가 높아 함부로 덤비지 못한다.');
  if(s.heat>=55&&!pk)out.push('우리 경계가 높아 다른 조직과 손잡을 생각을 한다.');
  var al=alliesOf(s,r).filter(function(x){return x!==0;});
  if(al.length)out.push(al.map(function(x){return ORGS[x].short;}).join('·')+' 동맹이다.');
  if(!out.length)out.push(o>=15?'우리를 나쁘지 않게 본다.':(o<=-15?'우리를 못마땅해한다.':'특별한 감정은 없다.'));
  return out.slice(0,3);
}
function diploAlert(s){
  if(s.offers.length||(s.pend&&s.pend.type==='offer'))return 2;
  if(participants(s).length>=2&&s.heat>=strikeAt(s)-10)return 2;
  var al=alliesOf(s,0);
  for(var i=0;i<al.length;i++)if(betrayRisk(s,al[i],0)>=0.12)return 2;
  return s.news.length&&s.news[s.news.length-1].day>=s.day-1?1:0;
}
/* 밤마다 동맹이 건네는 도움 */
function allySupport(s){
  alliesOf(s,0).forEach(function(r){
    if(s.dead[r]||rnd(s)>=0.35||powerOf(s,r)<14)return;
    var cand=owned(s,0).filter(function(t){return ADJ[t.id].some(function(j){return s.tiles[j].owner>=1&&!hasPact(s,0,s.tiles[j].owner);})&&t.men<t.cap;});
    if(!cand.length)return;
    cand.sort(function(a,b){return a.men-b.men;});
    cand[0].men++;
    say(s,iga(ORGS[r].short)+' '+cand[0].name+'에 병력 1명을 보내 왔다.','good');
  });
}
