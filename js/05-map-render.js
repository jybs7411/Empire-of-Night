/* ========== 지도 (움직이는 층) ==========
   바닥 그림은 05a-terrain.js 가 #terrain 에 한 번 그려 두고, 여기서는 땅 주인 색 · 병력 배지 · 도시 · 외교선을 #ovl 에 얹는다. */
function ctr(id){var m=NODES[id];return m.kind==='city'?[m.px,m.py]:[m.cx,m.cy];}
function arrowSvg(from,to,c){
  var a=ctr(from),b=ctr(to),dx=b[0]-a[0],dy=b[1]-a[1],len=Math.sqrt(dx*dx+dy*dy);
  if(len<30)return'';
  var ux=dx/len,uy=dy/len,nx=-uy,ny=ux,ex=b[0]-ux*18,ey=b[1]-uy*18,sx=a[0]+ux*14,sy=a[1]+uy*14;
  function pt(x,y){return x.toFixed(1)+','+y.toFixed(1);}
  return'<line class="arrow '+c+'" x1="'+sx.toFixed(1)+'" y1="'+sy.toFixed(1)+'" x2="'+ex.toFixed(1)+'" y2="'+ey.toFixed(1)+'"/>'+
    '<polygon class="ahead '+c+'" points="'+pt(ex+ux*9,ey+uy*9)+' '+pt(ex-ux*2+nx*5.5,ey-uy*2+ny*5.5)+' '+pt(ex-ux*2-nx*5.5,ey-uy*2-ny*5.5)+'"/>';
}
/* 도시 종류별 아이콘 (24칸 안에 선으로) */
var CITY_GLYPH={
  hq:'<path d="M4.5 20V11L12 6l7.5 5v9z"/><path d="M12 6V1.6M12 1.6h4.4l-1.4 1.5 1.4 1.5H12"/><path d="M10 20v-4.5h4V20"/>',
  stn:'<rect x="6" y="4" width="12" height="13" rx="2.6"/><path d="M6 11h12M9 20l1.5-3M15 20l-1.5-3"/><circle cx="9.6" cy="14" r=".9"/><circle cx="14.4" cy="14" r=".9"/>',
  club:'<path d="M8 3h8M7 5.5h10v11H7z"/><path d="M12 5.5v11M9.5 16.5V20h5v-3.5"/>',
  port:'<circle cx="12" cy="5.4" r="2"/><path d="M12 7.4V20M7.4 11.5h9.2M5 14a7 7 0 0 0 14 0"/>',
  mkt:'<path d="M4 9.5L5.6 4.5h12.8L20 9.5z"/><path d="M5.5 9.5V20h13V9.5M9 20v-5h6v5"/>',
  bridge:'<path d="M3 17h18M4.5 17a7.5 7.5 0 0 1 15 0M3 10.5h18"/>',
  fort:'<path d="M5 20V8h2.6v2.2h2V8h4.8v2.2h2V8H19v12z"/><path d="M10.2 20v-4.6h3.6V20"/>'
};
function cityIcon(t,px,py,cls,sel){
  var big=t.hq,sz=big?30:24,x=px-sz/2,y=py-sz/2,sc=sz/24*0.78,off=sz/2-12*sc;
  return'<g class="cico '+cls+(sel?' sel':'')+'"><rect class="cbg" x="'+x.toFixed(1)+'" y="'+y.toFixed(1)+'" width="'+sz+'" height="'+sz+'" rx="'+(big?6:4.5)+'"/>'+
    '<g class="cgl" transform="translate('+(x+sz/2-12*sc).toFixed(2)+' '+(y+sz/2-12*sc).toFixed(2)+') scale('+sc.toFixed(3)+')">'+(CITY_GLYPH[t.type]||'')+'</g></g>';
}
/* 병력 배지: 원 안의 숫자와 아래의 채움 막대 */
function badge(cx,cy,n,cap,ow){
  var c=ow<0?'on':'o'+ow,w=22,fill=cap>0?Math.min(1,n/cap)*w:0;
  var x=cx.toFixed(1),y=cy.toFixed(1);
  return'<g class="bdg '+c+'"><circle class="bgc" cx="'+x+'" cy="'+y+'" r="9.6"/><text class="bn" x="'+x+'" y="'+(cy+3.9).toFixed(1)+'">'+n+'</text>'+
    '<rect class="bbk" x="'+(cx-w/2).toFixed(1)+'" y="'+(cy+11.4).toFixed(1)+'" width="'+w+'" height="3.6" rx="1.8"/>'+
    '<rect class="bfl" x="'+(cx-w/2).toFixed(1)+'" y="'+(cy+11.4).toFixed(1)+'" width="'+fill.toFixed(1)+'" height="3.6" rx="1.8"/>'+
    (ow>=0?'<circle class="mkbg" cx="'+(cx+9).toFixed(1)+'" cy="'+(cy-8).toFixed(1)+'" r="5.6"/>'+markG(ow,cx+9,cy-8,0.58,'mkl'):'')+'</g>';
}
var DRONE_D='';
function droneSvg(){
  var W=MAP_W,H=480;
  var d='M-30 '+Math.round(H*0.24)+' C '+Math.round(W*0.28)+' '+Math.round(H*0.06)+', '+Math.round(W*0.62)+' '+Math.round(H*0.5)+', '+(W+40)+' '+Math.round(H*0.3);
  return'<g class="drone" aria-hidden="true"><animateMotion dur="52s" repeatCount="indefinite" rotate="auto" path="'+d+'"/>'+
    '<g transform="translate(3 6)" opacity=".22"><path d="M-8 0L6 -2L9 0L6 2Z"/><path d="M0 -10L2 0L0 10L-2 0Z"/></g>'+
    '<path d="M-8 0L6 -2.2L9 0L6 2.2Z" fill="#f4f1e6" stroke="#4a3a22" stroke-width=".7" stroke-linejoin="round"/>'+
    '<path d="M-1 -11L1.6 0L-1 11L-3 0Z" fill="#f4f1e6" stroke="#4a3a22" stroke-width=".7" stroke-linejoin="round"/><path d="M-8 0L-10 -3.6M-8 0L-10 3.6" stroke="#4a3a22" stroke-width=".9" stroke-linecap="round"/></g>';
}
function pactLines(){
  var h='';
  G.pacts.forEach(function(p){
    var A=HQ_OF[p.a],B=HQ_OF[p.b];
    if(A<0||B<0||(p.a>0&&G.dead[p.a])||G.dead[p.b])return;
    var a=ctr(A),b=ctr(B),mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2;
    var cls,gl;
    if(p.k==='truce'){cls='truce'+(p.a===0?' me':'');gl='<path d="M-4.2 -1.6q2.1-2 4.2 0t4.2 0M-4.2 2.2q2.1-2 4.2 0t4.2 0"/>';}
    else if(p.a===0){cls='ally me';gl='<circle cx="-2.3" cy="0" r="3"/><circle cx="2.3" cy="0" r="3"/>';}
    else if(willing(G,p.a)&&willing(G,p.b)){cls='ally foe';gl='<path d="M-3.6 -3.6L3.6 3.6M3.6 -3.6L-3.6 3.6"/>';}
    else{cls='ally rv';gl='<circle cx="-2.3" cy="0" r="3"/><circle cx="2.3" cy="0" r="3"/>';}
    h+='<line class="pactln '+cls+'" x1="'+a[0].toFixed(1)+'" y1="'+a[1].toFixed(1)+'" x2="'+b[0].toFixed(1)+'" y2="'+b[1].toFixed(1)+'"/>'+
      '<g class="pactic '+cls+'" transform="translate('+mx.toFixed(1)+' '+my.toFixed(1)+')"><circle r="9"/>'+gl+'</g>';
  });
  return h;
}
function renderMap(){
  ensureTerrain();
  var had=$('map').contains(document.activeElement);
  var selT=ui.sel>=0?G.tiles[ui.sel]:null;
  var targets=(ui.mode==='example'&&selT)?exampleTargets(G,ui.sel):[];
  var tint='',tex='',fx='',lines='',labs='',hits='',cityFx='',bubs='',pops='',shot='',rail='',smoke='';
  G.tiles.forEach(function(t){
    var m=NODES[t.id],hv=(ui.hold&&ui.hold[t.id])||t,ow=hv.owner,mn=hv.men;
    var cls=ow<0?'on':'o'+ow,isSel=ui.sel===t.id,tg=null;
    if(selT&&!isSel&&!ui.hold){
      if(ui.mode==='example'){
        if(targets.indexOf(t.id)>=0)tg={c:'bad',txt:'본보기'};
      }else if(canReach(G,ui.sel,t.id)&&selT.men>=2){
        if(t.owner===0)tg={c:'mv',txt:ADJ[ui.sel].indexOf(t.id)>=0?'이동':'철도'};
        else if(t.owner>=1&&hasPact(G,0,t.owner))tg={c:'pact',txt:pactKind(G,0,t.owner)==='ally'?'동맹':'휴전'};
        else{var q=oddsHint(sendAmount(selT,ui.amt),t.men,t.id);tg={c:q,txt:({good:'우세',even:'호각',bad:'열세'})[q]};}
      }
    }
    var dim=(selT&&!isSel&&!tg&&!ui.hold)?' dim':'';
    var fl=ui.flash[t.id]?' flash-'+ui.flash[t.id]:'';
    var owner=ow<0?'주인 없음':ORGS[ow].short;
    var tname=t.kind==='city'?CITY_TYPES[t.type].n:TERRAIN[m.ter].n;
    var aria=esc((t.kind==='city'?'도시 ':'구역 ')+t.name+', '+tname+', '+owner+', 병력 '+mn);
    var hint=tg?'<text class="ht '+tg.c+'" x="HX" y="HY">'+tg.txt+'</text>':'';
    if(tg&&selT&&tg.c!=='pact')lines+=arrowSvg(ui.sel,t.id,tg.c);
    var c0=ctr(t.id);
    if(ui.flash[t.id]){
      var sx=c0[0]-7,sy=c0[1]-8;
      smoke+='<g class="smoke"><circle class="fire" cx="'+sx.toFixed(1)+'" cy="'+sy.toFixed(1)+'" r="2.6"/>'+
        [0,0.7,1.4].map(function(dl){return'<circle cx="'+sx.toFixed(1)+'" cy="'+(sy-2).toFixed(1)+'" r="4.4" style="animation-delay:'+dl+'s"/>';}).join('')+'</g>';
    }
    if(t.kind==='area'){
      tint+='<path class="poly '+cls+dim+fl+'" data-i="'+t.id+'" d="'+m.d+'" tabindex="0" role="button" aria-label="'+aria+'"/>';
      if(ow>=0){
        tex+='<path class="own glow '+cls+dim+'" d="'+m.d+'"/><path class="own '+cls+dim+'" d="'+m.d+'"/><path class="tx'+dim+'" fill="url(#pM'+ow+')" d="'+m.d+'"/>';
      }
      if(isSel)fx+='<path class="fx-sel" d="'+m.d+'"/><path class="fx-ant" d="'+m.d+'"/>';
      else if(tg)fx+='<path class="fx-tgt '+tg.c+'" d="'+m.d+'"/>';
      var lx=m.lx,ly=m.ly;
      labs+='<g class="lab '+cls+dim+'">'+hint.replace('HX',lx.toFixed(1)).replace('HY',(ly-13).toFixed(1))+
        '<text class="nm" x="'+lx.toFixed(1)+'" y="'+ly.toFixed(1)+'">'+esc(t.name)+'</text>'+
        badge(lx,ly+17,mn,t.cap,ow)+
        '<text class="inc" x="'+(lx+15).toFixed(1)+'" y="'+(ly+20.4).toFixed(1)+'">¥'+tileInc(G,t)+'</text></g>';
    }else{
      var px=m.px,py=m.py,pxs=px.toFixed(1),pys=py.toFixed(1),big=t.hq,hs=big?15:12;
      if(isSel)cityFx+='<circle class="halo" cx="'+pxs+'" cy="'+pys+'" r="'+(hs+2)+'"/><circle class="selring" cx="'+pxs+'" cy="'+pys+'" r="'+(hs+6)+'"/>';
      else if(tg)cityFx+='<circle class="tgtring '+tg.c+'" cx="'+pxs+'" cy="'+pys+'" r="'+(hs+6)+'"/>';
      labs+='<g class="lab city '+cls+dim+'">'+(big?'<circle class="ring" cx="'+pxs+'" cy="'+pys+'" r="'+(hs+4)+'"/>':'')+
        hint.replace('HX',pxs).replace('HY',(py-hs-12).toFixed(1))+
        '<text class="cnm" x="'+pxs+'" y="'+(py-hs-3).toFixed(1)+'">'+esc(t.name)+'</text>'+
        cityIcon(t,px,py,cls,isSel)+
        badge(px,py+hs+11,mn,t.cap,ow)+
        '<text class="inc" x="'+(px+hs+4).toFixed(1)+'" y="'+(py+4).toFixed(1)+'">¥'+tileInc(G,t)+'</text></g>';
      hits+='<circle class="hit '+cls+'" data-i="'+t.id+'" cx="'+pxs+'" cy="'+pys+'" r="'+(hs+5)+'" tabindex="0" role="button" aria-label="'+aria+'"/>';
    }
  });
  if(RAIL.length>1){
    for(var a=0;a<RAIL.length-1;a++)for(var b2=a+1;b2<RAIL.length;b2++){
      var p1=ctr(RAIL[a]),p2=ctr(RAIL[b2]),both=G.tiles[RAIL[a]].owner===0&&G.tiles[RAIL[b2]].owner===0&&!ui.hold;
      rail+='<line class="rail'+(both?' on':'')+'" x1="'+p1[0].toFixed(1)+'" y1="'+p1[1].toFixed(1)+'" x2="'+p2[0].toFixed(1)+'" y2="'+p2[1].toFixed(1)+'"/>';
    }
  }
  if(!G.over&&!G.pend&&!ui.hold)G.bubbles.forEach(function(b,i){
    var m=NODES[b.tile],x=m.kind==='city'?m.px+21:m.lx+40,y=m.kind==='city'?m.py-17:m.ly-6;
    bubs+='<g class="bub '+b.kind+'" data-bubble="'+i+'" tabindex="0" role="button" aria-label="'+(b.kind==='dirty'?'뒷돈 ¥10, 경계 +3':'잔돈 ¥3~5')+' — '+esc(m.name)+'" transform="translate('+x.toFixed(1)+' '+y.toFixed(1)+')">'+
      '<circle class="bh" r="16"/><path class="bc" d="M0 -11.5L10 -5.7V5.7L0 11.5L-10 5.7V-5.7Z"/><text y="4.4">¥</text></g>';
  });
  if(ui.shot){
    var a2=ctr(ui.shot.from),b3=ctr(ui.shot.to),dx=b3[0]-a2[0],dy=b3[1]-a2[1],len=Math.sqrt(dx*dx+dy*dy);
    shot='<line class="shot '+ui.shot.c+'" style="--len:'+len.toFixed(0)+'px" x1="'+a2[0].toFixed(1)+'" y1="'+a2[1].toFixed(1)+'" x2="'+b3[0].toFixed(1)+'" y2="'+b3[1].toFixed(1)+'"/>';
  }
  ui.pops.forEach(function(p){var c=ctr(p.id);pops+='<text class="pop '+p.c+'" x="'+c[0].toFixed(1)+'" y="'+(c[1]-8).toFixed(1)+'">'+esc(p.t)+'</text>';});
  var vb='-12 -12 '+(MAP_W+24)+' 504';
  $('fx').setAttribute('viewBox',vb);
  $('ovl').setAttribute('viewBox',vb);
  $('ovl').innerHTML='<defs>'+markDefs()+'<clipPath id="landO"><path d="'+COAST_D+'"/></clipPath></defs>'+
    '<g clip-path="url(#landO)">'+tint+tex+fx+'</g>'+
    rail+pactLines()+lines+cityFx+smoke+labs+hits+bubs+shot+pops+droneSvg();
  if(had&&ui.focus!==null){var f=$('map').querySelector('[data-i="'+ui.focus+'"]');if(f)f.focus();}
}
