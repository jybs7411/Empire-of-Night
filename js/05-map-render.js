/* ========== 지도 ==========
   구역은 주인 색으로 칠하고 병력은 작은 동그라미로 보인다. 지역 이름은 그리지 않는다 (땅을 누르면 아래 정보 줄에 나온다).
   돈줄(시장·술집·유흥가·파친코·항구)은 도시 동그라미 안의 그림으로 구분한다. */
function ctr(id){var m=NODES[id];return m.kind==='city'?[m.px,m.py]:[m.cx,m.cy];}
function dotsSvg(cx,cy,n,hollow){
  var s='',per=n<=7?n:Math.ceil(n/2),rows=per>0?Math.ceil(n/per):0;
  for(var r=0;r<rows;r++){
    var c=Math.min(per,n-r*per),x0=cx-(c-1)*3.6;
    for(var k=0;k<c;k++)s+='<circle class="dot'+(hollow?' h':'')+'" cx="'+(x0+k*7.2).toFixed(1)+'" cy="'+(cy+r*7.2).toFixed(1)+'" r="2.8"/>';
  }
  return s;
}
function arrowSvg(from,to,c){
  var a=ctr(from),b=ctr(to),dx=b[0]-a[0],dy=b[1]-a[1],len=Math.sqrt(dx*dx+dy*dy);
  if(len<30)return'';
  var ux=dx/len,uy=dy/len,nx=-uy,ny=ux,ex=b[0]-ux*16,ey=b[1]-uy*16,sx=a[0]+ux*12,sy=a[1]+uy*12;
  function pt(x,y){return x.toFixed(1)+','+y.toFixed(1);}
  return'<line class="arrow '+c+'" x1="'+sx.toFixed(1)+'" y1="'+sy.toFixed(1)+'" x2="'+ex.toFixed(1)+'" y2="'+ey.toFixed(1)+'"/>'+
    '<polygon class="ahead '+c+'" points="'+pt(ex+ux*9,ey+uy*9)+' '+pt(ex-ux*2+nx*5.5,ey-uy*2+ny*5.5)+' '+pt(ex-ux*2-nx*5.5,ey-uy*2-ny*5.5)+'"/>';
}
/* 도시 종류별 그림 (24칸 안에 선으로) */
var CITY_GLYPH={
  hq:'<path d="M4.5 20V11L12 6l7.5 5v9z"/><path d="M12 6V1.6M12 1.6h4.4l-1.4 1.5 1.4 1.5H12"/>',
  stn:'<rect x="6" y="4" width="12" height="13" rx="2.6"/><path d="M6 11h12M9 20l1.5-3M15 20l-1.5-3"/>',
  club:'<path d="M8 3h8M7 5.5h10v11H7z"/><path d="M12 5.5v11M9.5 16.5V20h5v-3.5"/>',
  port:'<circle cx="12" cy="5.4" r="2"/><path d="M12 7.4V20M7.4 11.5h9.2M5 14a7 7 0 0 0 14 0"/>',
  mkt:'<path d="M4 9.5L5.6 4.5h12.8L20 9.5z"/><path d="M5.5 9.5V20h13V9.5M9 20v-5h6v5"/>',
  bar:'<path d="M9 3.5h6M10 3.5v3.2L7.5 10v10h9V10L14 6.7V3.5"/><path d="M7.5 13.5h9"/>',
  pachi:'<circle cx="12" cy="12" r="8.5"/><circle cx="9" cy="9.5" r="1.1"/><circle cx="15" cy="9.5" r="1.1"/><circle cx="12" cy="14" r="1.1"/><path d="M12 20.5v-2.5"/>',
  bridge:'<path d="M3 17h18M4.5 17a7.5 7.5 0 0 1 15 0M3 10.5h18"/>'
};
var MONEY_TYPES={club:1,mkt:1,bar:1,pachi:1,port:1};
/* 빈 땅 위에 영향력이 차오르는 막대 (붙은 내 땅이 있을 때만) */
function spreadBar(cx,cy,id){
  if(G.over||ui.hold||spreadPower(G,id)<=0)return'';
  var pct=Math.max(0.04,Math.min(1,(G.sp[id]||0)/spreadNeed(G,id))),w=26;
  return'<rect class="spb" x="'+(cx-w/2).toFixed(1)+'" y="'+cy.toFixed(1)+'" width="'+w+'" height="3.6" rx="1.8"/>'+
    '<rect class="spf'+(G.fcs===id?' fc':'')+'" x="'+(cx-w/2).toFixed(1)+'" y="'+cy.toFixed(1)+'" width="'+(w*pct).toFixed(1)+'" height="3.6" rx="1.8"/>';
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
  var had=$('map').contains(document.activeElement);
  var selT=ui.sel>=0?G.tiles[ui.sel]:null;
  var targets=(ui.mode==='example'&&selT)?exampleTargets(G,ui.sel):[];
  var base='',tex='',fx='',lines='',labs='',hits='',cityFx='',bubs='',pops='',shot='',rail='';
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
    if(t.kind==='area'){
      base+='<path class="poly '+cls+dim+fl+'" data-i="'+t.id+'" d="'+m.d+'" tabindex="0" role="button" aria-label="'+aria+'"/>';
      if(ow>=0)tex+='<path class="tx'+dim+'" fill="url(#pM'+ow+')" d="'+m.d+'"/>';
      if(m.ter==='mtn')tex+='<path class="tx'+dim+'" fill="url(#pMtn)" d="'+m.d+'"/>';
      else if(m.ter==='forest')tex+='<path class="tx'+dim+'" fill="url(#pFor)" d="'+m.d+'"/>';
      if(isSel)fx+='<path class="fx-sel" d="'+m.d+'"/><path class="fx-ant" d="'+m.d+'"/>';
      else if(tg)fx+='<path class="fx-tgt '+tg.c+'" d="'+m.d+'"/>';
      if(G.fcs===t.id&&!ui.hold)fx+='<path class="fx-ant fc" d="'+m.d+'"/>';
      var lx=m.lx,ly=m.ly+8;
      labs+='<g class="lab '+cls+dim+'">'+hint.replace('HX',lx.toFixed(1)).replace('HY',(ly-12).toFixed(1))+
        '<text class="sm" x="'+(lx-4).toFixed(1)+'" y="'+ly.toFixed(1)+'">¥'+tileInc(G,t)+'</text>'+markG(ow,lx+14,ly-3.5,0.95,'mkl')+
        dotsSvg(lx,ly+10,mn,ow<0)+(ow<0?spreadBar(lx,ly+(mn>7?25:18),t.id):'')+'</g>';
    }else{
      var px=m.px,py=m.py,pxs=px.toFixed(1),pys=py.toFixed(1);
      if(G.fcs===t.id&&!ui.hold)cityFx+='<circle class="selring fc" cx="'+pxs+'" cy="'+pys+'" r="16.5"/>';
      if(isSel)cityFx+='<circle class="halo" cx="'+pxs+'" cy="'+pys+'" r="13"/><circle class="selring" cx="'+pxs+'" cy="'+pys+'" r="16.5"/>';
      else if(tg)cityFx+='<circle class="tgtring '+tg.c+'" cx="'+pxs+'" cy="'+pys+'" r="16.5"/>';
      var deck='';
      if(t.type==='bridge')deck='<path class="deck" d="M'+(px-16).toFixed(1)+' '+(py-5).toFixed(1)+'H'+(px+16).toFixed(1)+'M'+(px-16).toFixed(1)+' '+(py+5).toFixed(1)+'H'+(px+16).toFixed(1)+'"/>';
      var gs=t.hq?0.62:0.52,gl='<g class="cgl" transform="translate('+(px-12*gs).toFixed(2)+' '+(py-12*gs).toFixed(2)+') scale('+gs+')">'+(CITY_GLYPH[t.type]||'')+'</g>';
      labs+='<g class="lab '+cls+dim+(MONEY_TYPES[t.type]?' money':'')+'">'+deck+(t.hq?'<circle class="ring" cx="'+pxs+'" cy="'+pys+'" r="13"/>':'')+
        '<circle class="city '+cls+'" cx="'+pxs+'" cy="'+pys+'" r="'+(t.hq?10.5:9.5)+'"/>'+gl+
        hint.replace('HX',pxs).replace('HY',(py-17).toFixed(1))+
        markG(ow,px-13,py-10,0.8,'mkl')+dotsSvg(px,py+(t.hq?21:18),mn,ow<0)+(ow<0?spreadBar(px,py+(mn>7?35:27),t.id):'')+'</g>';
      hits+='<circle class="hit '+cls+'" data-i="'+t.id+'" cx="'+pxs+'" cy="'+pys+'" r="17" tabindex="0" role="button" aria-label="'+aria+'"/>';
    }
  });
  if(RAIL.length>1){
    for(var a=0;a<RAIL.length-1;a++)for(var b2=a+1;b2<RAIL.length;b2++){
      var p1=ctr(RAIL[a]),p2=ctr(RAIL[b2]),both=G.tiles[RAIL[a]].owner===0&&G.tiles[RAIL[b2]].owner===0&&!ui.hold;
      rail+='<line class="rail'+(both?' on':'')+'" x1="'+p1[0].toFixed(1)+'" y1="'+p1[1].toFixed(1)+'" x2="'+p2[0].toFixed(1)+'" y2="'+p2[1].toFixed(1)+'"/>';
    }
  }
  if(!G.over&&!G.pend&&!ui.hold)G.bubbles.forEach(function(b,i){
    var m=NODES[b.tile],x=m.kind==='city'?m.px+19:m.lx+40,y=m.kind==='city'?m.py-15:m.ly-6;
    bubs+='<g class="bub '+b.kind+'" data-bubble="'+i+'" tabindex="0" role="button" aria-label="'+(b.kind==='dirty'?'뒷돈 ¥10, 경계 +3':'잔돈 ¥3~5')+' — '+esc(m.name)+'" transform="translate('+x.toFixed(1)+' '+y.toFixed(1)+')">'+
      '<circle class="bh" r="15"/><circle class="bc" r="10"/><text y="4.2">¥</text></g>';
  });
  if(ui.shot){
    var a2=ctr(ui.shot.from),b3=ctr(ui.shot.to),dx=b3[0]-a2[0],dy=b3[1]-a2[1],len=Math.sqrt(dx*dx+dy*dy);
    shot='<line class="shot '+ui.shot.c+'" style="--len:'+len.toFixed(0)+'px" x1="'+a2[0].toFixed(1)+'" y1="'+a2[1].toFixed(1)+'" x2="'+b3[0].toFixed(1)+'" y2="'+b3[1].toFixed(1)+'"/>';
  }
  ui.pops.forEach(function(p){var c=ctr(p.id);pops+='<text class="pop '+p.c+'" x="'+c[0].toFixed(1)+'" y="'+(c[1]-8).toFixed(1)+'">'+esc(p.t)+'</text>';});
  var vb='-12 -12 '+(MAP_W+24)+' 504';
  $('fx').setAttribute('viewBox',vb);
  $('ovl').setAttribute('viewBox',vb);
  $('ovl').innerHTML='<defs>'+markDefs()+'<clipPath id="landO"><path d="'+COAST_D+'"/></clipPath>'+
    '<pattern id="pMtn" width="15" height="12" patternUnits="userSpaceOnUse"><path class="pt m" d="M1.5 10L5 3.5L8.5 10M8 10L11 5.5L14 10"/></pattern>'+
    '<pattern id="pFor" width="10" height="10" patternUnits="userSpaceOnUse"><circle class="pt f" cx="2.6" cy="2.6" r="1.7"/><circle class="pt f" cx="7.6" cy="7.4" r="1.7"/></pattern></defs>'+
    '<rect class="sea" x="-12" y="-12" width="'+(MAP_W+24)+'" height="504"/>'+
    '<g clip-path="url(#landO)">'+base+tex+'<path class="river" d="'+RIVER_D+'"/><path class="river2" d="'+RIVER_D+'"/>'+fx+'</g><path class="coast" d="'+COAST_D+'"/>'+
    rail+pactLines()+lines+cityFx+labs+hits+bubs+shot+pops;
  if(had&&ui.focus!==null){var f=$('map').querySelector('[data-i="'+ui.focus+'"]');if(f)f.focus();}
}
