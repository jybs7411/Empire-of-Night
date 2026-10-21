/* ========== 무작위 지도 ========== */
var NODES=[],ADJ=[],DIST=[],HQ_ID=-1,MAPSEED=null,COAST=[],COAST_D='',RIVER_D='',RIVER_PTS=[],RAIL=[],HQ_OF=[-1,-1,-1,-1],N_AREAS=0;
var TERRAIN={
  plain:{n:'평야',df:1,tip:'수입 +1. 길이 트여 있어 차지하기 쉽다.'},
  forest:{n:'숲',df:1.1,tip:'방어 +10%. 눈에 띄지 않아 차지해도 경계가 오르지 않고, 가진 밤마다 경계 −1(최대 −2).'},
  mtn:{n:'산악',df:1.25,tip:'방어 +25%, 수입 −1. 지키기 좋은 땅이다.'}
};
var CITY_TIP={
  hq:'본거지. 잃으면 끝난다. 방어 +10%.',
  stn:'역전. 내 역끼리는 철도로 병력을 한 번에 옮긴다.',
  club:'유흥가. 조직의 큰 돈줄이지만 눈에 잘 띈다.',
  port:'항구. 밀수로 수입이 가장 크다.',
  mkt:'시장. 상인들에게 걷는 안정된 돈줄. 눈에 덜 띈다.',
  bar:'술집. 술값과 보호비가 모이는 돈줄이다. 방어 +15%.',
  pachi:'파친코. 현금이 쏟아지는 돈줄. 방어 +15%.',
  bridge:'다리목. 강 건너로 가는 길목이다. 방어 +20%.'
};
var N_PRE=['아사히','시라카바','미도리','구로사와','아카쓰키','후지미','나카노','센고쿠','야나기','하마나','노가미','가네야마','도리이','쓰키노','시모타니','하마카제','오오하마','이시바시','미나토','오카','다카노','사쿠라','마쓰바','가와라','후타바','아오바','시노노메','유키노','하루카','히이라기','이즈미','가스미','다케','스즈카','오이','시오','모미지','와카바','기쿠','사카에','도키와','나기사'];
var S_PLAIN=['평야','들','들판','벌','분지','농지'],S_MTN=['고개','산악','고원','능선','봉우리'],S_FOR=['숲','수풀','삼림','솔밭'],S_COAST=['해안','곶','포구'];
var HQ_NAMES=['본가','사쿠라바시','요이마치','구로이시'];
var C_STN=['미쓰카도 역','니시구치 역','히가시구치 역','기타하라 역','주오 역','다이몬 역'];
var C_CLUB=['가부토초','가미야초','유라쿠초','나가레초'];
var C_PORT=['미나미항','아오이항','시오카제항','미사키항'];
var C_MKT=['히가시 시장','가와라 시장','도리이 시장','아사 시장'];
var C_BRG=['아오이바시','센본바시','다쓰미바시','나가레바시','가게바시'];
var C_BAR=['달빛 술집','쓰바키 이자카야','도라지 주점','요루노 바','하나비 술집'];
var C_PACHI=['골든 파친코','마루한 파친코','니혼 파친코','스타 파친코'];

function shuf(R,a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(rnd(R)*(i+1));var t=a[i];a[i]=a[j];a[j]=t;}return a;}
function pickOne(R,a){return a[Math.floor(rnd(R)*a.length)];}
function segHit(p,q,r,s){
  var d1x=q[0]-p[0],d1y=q[1]-p[1],d2x=s[0]-r[0],d2y=s[1]-r[1],den=d1x*d2y-d1y*d2x;
  if(Math.abs(den)<1e-9)return null;
  var t=((r[0]-p[0])*d2y-(r[1]-p[1])*d2x)/den,u=((r[0]-p[0])*d1y-(r[1]-p[1])*d1x)/den;
  if(t<0||t>1||u<0||u>1)return null;
  return[p[0]+d1x*t,p[1]+d1y*t];
}

function tryMap(R){
  var i,j,k,g,x,y,W=R.W||420;
  /* 땅 = 화면 전체 (바깥 둘레는 해안으로 취급) */
  var NC=40,coast=[];
  for(k=0;k<NC;k++){
    var u0=k/NC*4,sd=Math.floor(u0),fr0=u0-sd;
    if(sd===0)coast.push([W*fr0,0]);
    else if(sd===1)coast.push([W,480*fr0]);
    else if(sd===2)coast.push([W*(1-fr0),480]);
    else coast.push([0,480*(1-fr0)]);
  }
  /* 땅 격자 (4px) */
  var GX=Math.ceil(W/4),GY=120,land=[],pts=[];
  for(y=0;y<GY;y++)for(x=0;x<GX;x++){var ok=inPoly(2+x*4,2+y*4,coast);land[y*GX+x]=ok;if(ok)pts.push(y*GX+x);}
  /* 구역 씨앗 */
  var n=Math.max(16,Math.round((19+Math.floor(rnd(R)*4))*W/420)),md=62,seeds=[],tries=0;
  while(seeds.length<n&&tries<6000){
    tries++;
    g=pts[Math.floor(rnd(R)*pts.length)];
    var sx0=2+(g%GX)*4,sy0=2+Math.floor(g/GX)*4,okp=true;
    for(j=0;j<seeds.length;j++){if(Math.hypot(seeds[j].x-sx0,seeds[j].y-sy0)<md){okp=false;break;}}
    if(okp)seeds.push({x:sx0,y:sy0,w:0});
    if(tries%400===0)md-=3;
  }
  if(seeds.length<14)return null;
  var own=[];
  function assign(){
    var st={cnt:[],sx:[],sy:[]};
    for(var a=0;a<seeds.length;a++){st.cnt.push(0);st.sx.push(0);st.sy.push(0);}
    for(var p=0;p<pts.length;p++){
      var gg=pts[p],px=2+(gg%GX)*4,py=2+Math.floor(gg/GX)*4,bi=0,bd=1e18;
      for(var a2=0;a2<seeds.length;a2++){var dd=(px-seeds[a2].x)*(px-seeds[a2].x)+(py-seeds[a2].y)*(py-seeds[a2].y);if(dd<bd){bd=dd;bi=a2;}}
      own[gg]=bi;st.cnt[bi]++;st.sx[bi]+=px;st.sy[bi]+=py;
    }
    return st;
  }
  var it,st;
  for(it=0;it<3;it++){st=assign();for(i=0;i<seeds.length;i++)if(st.cnt[i]>0){seeds[i].x=st.sx[i]/st.cnt[i];seeds[i].y=st.sy[i]/st.cnt[i];}}
  for(it=0;it<8;it++){
    st=assign();
    var small=-1;
    for(i=0;i<seeds.length;i++)if(st.cnt[i]<22){small=i;break;}
    if(small<0)break;
    seeds.splice(small,1);
  }
  st=assign();
  n=seeds.length;
  if(n<14)return null;
  for(i=0;i<n;i++)if(st.cnt[i]<22)return null;
  /* 중심 · 해안 여부 */
  var cen=[],cst=[];
  for(i=0;i<n;i++){cen.push([st.sx[i]/st.cnt[i],st.sy[i]/st.cnt[i],1e18]);cst.push(0);}
  for(k=0;k<pts.length;k++){
    g=pts[k];var gx=g%GX,gy=Math.floor(g/GX),o=own[g],px2=2+gx*4,py2=2+gy*4;
    var dd2=(px2-cen[o][0])*(px2-cen[o][0])+(py2-cen[o][1])*(py2-cen[o][1]);
    if(dd2<cen[o][2]){cen[o][2]=dd2;cen[o].bx=px2;cen[o].by=py2;}
    if(gx===0||gy===0||gx===GX-1||gy===GY-1||!land[g-1]||!land[g+1]||!land[g-GX]||!land[g+GX])cst[o]++;
  }
  for(i=0;i<n;i++){if(own[(Math.round((cen[i][1]-2)/4))*GX+Math.round((cen[i][0]-2)/4)]!==i){cen[i][0]=cen[i].bx;cen[i][1]=cen[i].by;}}
  /* 맞닿음 */
  var pc={},pm={};
  function addp(a,b,mx,my){
    if(a===b)return;
    var lo=Math.min(a,b),hi=Math.max(a,b),key=lo*64+hi;
    pc[key]=(pc[key]||0)+1;
    if(!pm[key])pm[key]=[0,0];
    pm[key][0]+=mx;pm[key][1]+=my;
  }
  for(k=0;k<pts.length;k++){
    g=pts[k];x=2+(g%GX)*4;y=2+Math.floor(g/GX)*4;
    if((g%GX)<GX-1&&land[g+1])addp(own[g],own[g+1],x+2,y);
    if(Math.floor(g/GX)<GY-1&&land[g+GX])addp(own[g],own[g+GX],x,y+2);
  }
  var edges={},nb=[];
  for(i=0;i<n;i++)nb.push([]);
  Object.keys(pc).forEach(function(key){
    if(pc[key]<3)return;
    var a=Math.floor(key/64),b=key%64;
    edges[key]={a:a,b:b,mid:[pm[key][0]/pc[key],pm[key][1]/pc[key]],len:pc[key]};
    nb[a].push(b);nb[b].push(a);
  });
  function EK(a,b){return Math.min(a,b)*64+Math.max(a,b);}
  /* 강 */
  var k0=Math.floor(rnd(R)*NC),k1=(k0+Math.floor(NC/2)+Math.floor(rnd(R)*7)-3+NC)%NC;
  function ext(P){return[P[0]+(P[0]-W/2)*0.08,P[1]+(P[1]-240)*0.08];}
  var P0=ext(coast[k0]),P1=ext(coast[k1]);
  var ddx=P1[0]-P0[0],ddy=P1[1]-P0[1],L=Math.sqrt(ddx*ddx+ddy*ddy),nx=-ddy/L,ny=ddx/L;
  var o1=(25+rnd(R)*35)*(rnd(R)<0.5?-1:1),o2=-o1*(0.4+rnd(R)*0.8);
  var ctl=[P0,[P0[0]+ddx*0.33+nx*o1,P0[1]+ddy*0.33+ny*o1],[P0[0]+ddx*0.66+nx*o2,P0[1]+ddy*0.66+ny*o2],P1],river=[];
  for(var s2=0;s2<3;s2++){
    var q0=ctl[Math.max(s2-1,0)],q1=ctl[s2],q2=ctl[s2+1],q3=ctl[Math.min(s2+2,3)];
    for(var u=0;u<8;u++){
      var t=u/8,t2=t*t,t3=t2*t;
      river.push([0.5*(2*q1[0]+(-q0[0]+q2[0])*t+(2*q0[0]-5*q1[0]+4*q2[0]-q3[0])*t2+(-q0[0]+3*q1[0]-3*q2[0]+q3[0])*t3),
                  0.5*(2*q1[1]+(-q0[1]+q2[1])*t+(2*q0[1]-5*q1[1]+4*q2[1]-q3[1])*t2+(-q0[1]+3*q1[1]-3*q2[1]+q3[1])*t3)]);
    }
  }
  river.push(P1);
  /* 강을 가로지르는 이웃 */
  var cross=[];
  Object.keys(edges).forEach(function(key){
    var e=edges[key],best=null;
    for(var r=0;r<river.length-1;r++){
      var h=segHit(cen[e.a],cen[e.b],river[r],river[r+1]);
      if(h){best={a:e.a,b:e.b,pt:h,idx:r};break;}
    }
    if(best)cross.push(best);
  });
  var m=cross.length;
  if(m<2)return null;
  cross.sort(function(p,q){return p.idx-q.idx;});
  var kb=clamp(Math.round(m/2.5),2,3);
  var bridges=[],used={};
  for(i=0;i<kb;i++){
    var ci=kb===1?0:Math.round(i*(m-1)/(kb-1));
    var c=cross[ci];if(used[ci])continue;used[ci]=1;bridges.push(c);
  }
  if(bridges.length<2)return null;
  cross.forEach(function(c2){
    var isB=bridges.indexOf(c2)>=0;
    if(!isB){
      var key=EK(c2.a,c2.b);delete edges[key];
      nb[c2.a]=nb[c2.a].filter(function(v){return v!==c2.b;});
      nb[c2.b]=nb[c2.b].filter(function(v){return v!==c2.a;});
    }
  });
  /* 다리 위치 */
  bridges.forEach(function(c2){
    var p=c2.pt;
    if(!inPoly(p[0],p[1],coast)){var e2=edges[EK(c2.a,c2.b)];p=e2.mid;}
    c2.pos=p;
  });
  /* 그래프 (구역 + 다리) */
  function buildGraph(extra){
    var A=[];for(var a=0;a<n+bridges.length+(extra?extra.length:0);a++)A.push([]);
    for(var a2=0;a2<n;a2++)nb[a2].forEach(function(b){A[a2].push(b);});
    bridges.forEach(function(c2,bi){A[n+bi]=[c2.a,c2.b];A[c2.a].push(n+bi);A[c2.b].push(n+bi);});
    return A;
  }
  var AD=buildGraph();
  function bfs(A,src){
    var d=[];for(var a=0;a<A.length;a++)d.push(99);
    d[src]=0;var q=[src];
    while(q.length){var u2=q.shift();A[u2].forEach(function(v){if(d[v]===99){d[v]=d[u2]+1;q.push(v);}});}
    return d;
  }
  var d0=bfs(AD,0);
  for(i=0;i<AD.length;i++)if(d0[i]===99)return null;
  /* 본거지 4곳 */
  var order=shuf(R,[0,1,2,3]),hqA=[],q;
  var dall=[];for(i=0;i<n;i++)dall.push(bfs(AD,i));
  var combos=[];
  for(var c1=0;c1<n;c1++)for(var c2=c1+1;c2<n;c2++){
    if(dall[c1][c2]<2)continue;
    for(var c3=c2+1;c3<n;c3++){
      if(dall[c1][c3]<2||dall[c2][c3]<2)continue;
      for(var c4=c3+1;c4<n;c4++){
        if(dall[c1][c4]<2||dall[c2][c4]<2||dall[c3][c4]<2)continue;
        var cc=[c1,c2,c3,c4],mnp=99,mxp=0,cnt4=[0,0,0,0];
        for(var a=0;a<4;a++)for(var b=a+1;b<4;b++){var dd=dall[cc[a]][cc[b]];if(dd<mnp)mnp=dd;if(dd>mxp)mxp=dd;}
        for(var z=0;z<n;z++){
          var bd3=99,bq3=-1,tie3=false;
          for(var a2=0;a2<4;a2++){var dz=dall[cc[a2]][z];if(dz<bd3){bd3=dz;bq3=a2;tie3=false;}else if(dz===bd3)tie3=true;}
          if(!tie3)cnt4[bq3]++;
        }
        var tmn=Math.min.apply(null,cnt4),tmx=Math.max.apply(null,cnt4);
        if(tmn<2)continue;
        combos.push({cc:cc,score:(tmx-tmn)+(mxp-mnp)*0.7-(mnp>=3?1.5:0)+rnd(R)*1.2,mnp:mnp,mxp:mxp,tmn:tmn,tmx:tmx});
      }
    }
  }
  if(!combos.length)return null;
  combos.sort(function(a,b){return a.score-b.score;});
  var pickc=combos[Math.floor(rnd(R)*Math.min(4,combos.length))];
  hqA=pickc.cc.slice();
  hqA=shuf(R,hqA);
  var minPair=pickc.mnp,maxPair=pickc.mxp,tmin=pickc.tmn,tmax=pickc.tmx;
  var score=(tmax-tmin)+(maxPair-minPair)*0.7+(minPair<3?2:0);
  /* 시작 땅 */
  var owner=[],men=[];
  for(i=0;i<n;i++){owner.push(-1);men.push(0);}
  var startSet={};
  var orgOfQ=order;
  for(q=0;q<4;q++){owner[hqA[q]]=orgOfQ[q];men[hqA[q]]=5;startSet[hqA[q]]=1;}
  for(var rd=0;rd<2;rd++)for(q=0;q<4;q++){
    var oo=orgOfQ[q],bc=-1,bdd=1e18;
    for(i=0;i<n;i++){
      if(owner[i]!==oo)continue;
      nb[i].forEach(function(v){
        if(owner[v]!==-1)return;
        var dh=Math.hypot(cen[v][0]-cen[hqA[q]][0],cen[v][1]-cen[hqA[q]][1])+rnd(R)*14;
        if(dh<bdd){bdd=dh;bc=v;}
      });
    }
    if(bc>=0){owner[bc]=oo;men[bc]=3;startSet[bc]=1;}
  }
  /* 지형 */
  var p1=rnd(R)*6.28,p2=rnd(R)*6.28,p3=rnd(R)*6.28,tv=[],ter=[];
  for(i=0;i<n;i++){
    tv.push({i:i,v:Math.sin(cen[i][0]*0.013+p1)*Math.cos(cen[i][1]*0.016+p2)+0.6*Math.sin((cen[i][0]+cen[i][1])*0.011+p3)+(rnd(R)-0.5)*0.4});
    ter.push('plain');
  }
  var free=tv.filter(function(o){return hqA.indexOf(o.i)<0;}).sort(function(a,b){return a.v-b.v;});
  var nm=Math.max(3,Math.round(free.length*0.24)),nf=Math.max(3,Math.round(free.length*0.22));
  for(i=0;i<nf;i++)ter[free[i].i]='forest';
  for(i=0;i<nm;i++)ter[free[free.length-1-i].i]='mtn';
  /* 지명 */
  var pre=shuf(R,N_PRE),names=[];
  for(i=0;i<n;i++){
    var suf;
    if(ter[i]==='mtn')suf=pickOne(R,S_MTN);
    else if(ter[i]==='forest')suf=pickOne(R,S_FOR);
    else suf=(cst[i]>=4&&rnd(R)<0.5)?pickOne(R,S_COAST):pickOne(R,S_PLAIN);
    names.push(pre[i]+' '+suf);
  }
  /* 랜드마크 */
  var cities=[];   // {name,type,hosts,owner,men,px,py}
  var hasCity={};
  function single(i2){
    var px=cen[i2][0],py=cen[i2][1]+24;
    if(!inPoly(px,py,coast))py=cen[i2][1]+12;
    return[px,Math.min(py,436)];
  }
  var posList=[];
  hqA.forEach(function(h,q2){
    var p=single(h);hasCity[h]=1;
    cities.push({name:HQ_NAMES[orgOfQ[q2]],type:'hq',hosts:[h],owner:orgOfQ[q2],men:0,px:p[0],py:p[1]});
    posList.push(p);
  });
  bridges.forEach(function(c2,bi){
    cities.push({name:'',type:'bridge',hosts:[c2.a,c2.b],owner:-1,men:0,px:c2.pos[0],py:c2.pos[1]});
    posList.push(c2.pos);
  });
  var pairs=[],triples=[],hqSet={};
  hqA.forEach(function(h){hqSet[h]=1;});
  Object.keys(edges).forEach(function(key){
    var e=edges[key];
    if(hqSet[e.a]||hqSet[e.b])return;
    pairs.push({h:[e.a,e.b],pos:e.mid});
    nb[e.a].forEach(function(c3){
      if(c3<=e.b||hqSet[c3])return;
      if(!edges[EK(e.a,c3)]||!edges[EK(e.b,c3)])return;
      var m1=edges[EK(e.a,c3)].mid,m2=edges[EK(e.b,c3)].mid;
      triples.push({h:[e.a,e.b,c3],pos:[(e.mid[0]+m1[0]+m2[0])/3,(e.mid[1]+m1[1]+m2[1])/3]});
    });
  });
  var useCnt=[];for(i=0;i<n;i++)useCnt.push(0);
  function farEnough(pos,dmin){
    for(var a=0;a<posList.length;a++)if(Math.hypot(posList[a][0]-pos[0],posList[a][1]-pos[1])<dmin)return false;
    return pos[0]>34&&pos[0]<W-34&&pos[1]>30&&pos[1]<438&&inPoly(pos[0],pos[1],coast);
  }
  function place(type,cands,cmp){
    var list=shuf(R,cands);
    if(cmp)list.sort(cmp);
    for(var pass=0;pass<3;pass++){
      var dmin=pass===0?46:(pass===1?32:22);
      for(var a=0;a<list.length;a++){
        var c3=list[a];
        if(c3.h.some(function(h){return useCnt[h]>=(pass===0?1:3)||(c3.h.length===1&&hasCity[h]);}))continue;
        if(!farEnough(c3.pos,dmin))continue;
        c3.h.forEach(function(h){useCnt[h]++;});
        if(c3.h.length===1)hasCity[c3.h[0]]=1;
        posList.push(c3.pos);
        cities.push({name:'',type:type,hosts:c3.h.slice(),owner:-1,men:0,px:c3.pos[0],py:c3.pos[1]});
        return c3;
      }
    }
    return null;
  }
  function singles(pred){
    var out=[];
    for(var a=0;a<n;a++){
      if(startSet[a]||!pred(a))continue;
      out.push({h:[a],pos:single(a)});
    }
    return out;
  }
  var dcen=function(c3){return Math.hypot(c3.pos[0]-W/2,c3.pos[1]-240);};
  var s1=place('stn',triples.length?triples:pairs,function(a,b){return dcen(a)-dcen(b);});
  if(!s1)return null;
  var s2c=place('stn',pairs.concat(triples),function(a,b){
    return Math.hypot(b.pos[0]-s1.pos[0],b.pos[1]-s1.pos[1])-Math.hypot(a.pos[0]-s1.pos[0],a.pos[1]-s1.pos[1]);
  });
  if(!s2c)return null;
  var coastal=function(a){return cst[a]>=4;};
  var portC=pairs.filter(function(c3){return c3.h.every(coastal);});
  if(!place('port',portC.length?portC:singles(coastal),null)&&!place('port',singles(coastal),null))return null;
  if(!place('mkt',pairs,null))return null;
  if(!place('club',singles(function(a){return ter[a]==='plain';}),function(a,b){return dcen(a)-dcen(b);}))return null;
  if(!place('bar',singles(function(a){return ter[a]!=='mtn';}),function(a,b){return dcen(a)-dcen(b);}))return null;
  place('pachi',singles(function(a){return ter[a]==='plain';}),null);
  /* 도시 이름 */
  var pools={stn:shuf(R,C_STN),club:shuf(R,C_CLUB),port:shuf(R,C_PORT),mkt:shuf(R,C_MKT),bridge:shuf(R,C_BRG),bar:shuf(R,C_BAR),pachi:shuf(R,C_PACHI)};
  cities.forEach(function(c3){if(!c3.name)c3.name=pools[c3.type].shift();});
  /* 이름표 자리: 도시·다른 이름표와 겹치지 않게 */
  function ovl(a,b){var w=Math.min(a[2],b[2])-Math.max(a[0],b[0]),h=Math.min(a[3],b[3])-Math.max(a[1],b[1]);return(w>0&&h>0)?w*h:0;}
  function lrect(x,y){return[x-42,y-12,x+42,y+36];}
  var crects=cities.map(function(c3){return[c3.px-38,c3.py-28,c3.px+38,c3.py+42];});
  var lpos=[],lrs=[];
  for(i=0;i<n;i++)if(hasCity[i]){lpos[i]=[cen[i][0],cen[i][1]-32];lrs.push(lrect(lpos[i][0],lpos[i][1]));}
  var dys=[-8,-26,10,-42,26,-58,42],dxs=[0,-24,24];
  for(i=0;i<n;i++){
    if(hasCity[i])continue;
    var bestL=null,bestP=1e18;
    for(var yi=0;yi<dys.length&&bestP>0;yi++)for(var xi=0;xi<dxs.length&&bestP>0;xi++){
      var lx=cen[i][0]+dxs[xi],ly=cen[i][1]+dys[yi];
      if(lx<54||lx>W-54||ly<16||ly>440)continue;
      var rc=lrect(lx,ly),pen=0;
      crects.forEach(function(r){pen+=ovl(rc,r);});
      lrs.forEach(function(r){pen+=ovl(rc,r);});
      var gi=Math.round((ly+10-2)/4)*GX+Math.round((lx-2)/4);
      if(own[gi]!==i)pen+=1500;
      pen+=Math.abs(dys[yi]+8)*2+Math.abs(dxs[xi]);
      if(pen<bestP){bestP=pen;bestL=[lx,ly];}
    }
    if(!bestL)bestL=[cen[i][0],cen[i][1]-8];
    lpos[i]=bestL;lrs.push(lrect(bestL[0],bestL[1]));
  }
  /* 노드 조립 */
  var pw=powerDiagram(seeds,W,MAP_H,14),nodes=[];
  for(i=0;i<n;i++){
    var area=st.cnt[i]*16,cap=clamp(Math.round(area/850),4,11),T=TERRAIN[ter[i]];
    var inc=clamp(clamp(Math.round(area/2800),2,5)+(ter[i]==='plain'?1:(ter[i]==='mtn'?-1:0)),1,6);
    var mn=men[i]>0?men[i]:clamp(Math.round(cap*0.25),1,4);
    nodes.push({id:i,kind:'area',name:names[i],type:'area',ter:ter[i],inc:inc,exp:ter[i]==='forest'?0:1,cap:cap,hq:false,owner:owner[i],men:mn,
      cx:cen[i][0],cy:cen[i][1],lx:lpos[i][0],ly:lpos[i][1],area:area,hasCity:!!hasCity[i],df:T.df,coastal:cst[i]>=4,
      poly:pw.cells[i].map(function(p){return[+p[0].toFixed(1),+p[1].toFixed(1)];}),
      d:'M'+pw.cells[i].map(function(p){return p[0].toFixed(1)+' '+p[1].toFixed(1);}).join('L')+'Z'});
  }
  cities.forEach(function(c3,k){
    var ty=CITY_TYPES[c3.type];
    nodes.push({id:n+k,kind:'city',name:c3.name,type:c3.type,ter:'',inc:ty.inc,exp:ty.exp,cap:ty.cap,hq:c3.type==='hq',
      owner:c3.owner,men:ty.men,px:c3.px,py:c3.py,hosts:c3.hosts,df:ty.df});
  });
  var adj=[];
  for(i=0;i<n;i++)adj.push(nb[i].slice());
  cities.forEach(function(c3,k){
    adj[n+k]=c3.hosts.slice();
    c3.hosts.forEach(function(h){adj[h].push(n+k);});
  });
  /* 다리 노드는 강을 건너는 직접 길을 대신한다 */
  var rail=[];nodes.forEach(function(t){if(t.type==='stn')rail.push(t.id);});
  var riverD='M'+river.map(function(p){return p[0].toFixed(1)+' '+p[1].toFixed(1);}).join('L');
  return{score:score,nodes:nodes,adj:adj,coast:coast,riverD:riverD,riverPts:river,rail:rail,nAreas:n};
}

function mapWidth(){
  try{var w=$('stage');if(w&&w.clientWidth>100&&w.clientHeight>100)return clamp(Math.round(w.clientWidth/w.clientHeight*504-24),300,470);}catch(e){}
  return 420;
}
function genMap(mseed,mw){
  mw=mw||420;
  if(MAPSEED===mseed&&MAP_W===mw&&NODES.length)return;
  var best=null;
  for(var k=0;k<300;k++){
    var R={rs:(mseed+k*7919)|0,W:mw};
    var r=null;
    try{r=tryMap(R);}catch(e){r=null;}
    if(!r)continue;
    if(!best||r.score<best.score)best=r;
    if(r.score<=6||(k>=8&&best))break;
  }
  if(!best){if(mw!==420)return genMap(mseed,420);throw new Error('map');}
  NODES=best.nodes;ADJ=best.adj;RIVER_PTS=best.riverPts;N_AREAS=best.nAreas;COAST=[[-14,-14],[mw+14,-14],[mw+14,494],[-14,494]];RIVER_D=best.riverD;RAIL=best.rail;
  COAST_D='M'+COAST.map(function(p){return p[0].toFixed(1)+' '+p[1].toFixed(1);}).join('L')+'Z';
  var N=NODES.length;DIST=[];
  for(var i=0;i<N;i++){
    var dist=[];for(var j=0;j<N;j++)dist.push(99);
    dist[i]=0;var q=[i];
    while(q.length){var u=q.shift();ADJ[u].forEach(function(v){if(dist[v]===99){dist[v]=dist[u]+1;q.push(v);}});}
    DIST.push(dist);
  }
  HQ_ID=-1;HQ_OF=[-1,-1,-1,-1];NODES.forEach(function(t){if(t.hq){HQ_OF[t.owner]=t.id;if(t.owner===0)HQ_ID=t.id;}});
  MAPSEED=mseed;MAP_W=mw;
}
