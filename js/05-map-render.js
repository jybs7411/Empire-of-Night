/* ========== 지도 ========== */
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
        else{var q=oddsHint(sendAmount(selT,ui.amt),t.men,t.id);tg={c:q,txt:({good:'우세',even:'호각',bad:'열세'})[q]};}
      }
    }
    var dim=(selT&&!isSel&&!tg&&!ui.hold)?' dim':'';
    var fl=ui.flash[t.id]?' flash-'+ui.flash[t.id]:'';
    var owner=ow<0?'주인 없음':ORGS[ow].short;
    var tname=t.kind==='city'?CITY_TYPES[t.type].n:TERRAIN[m.ter].n;
    var aria=esc((t.kind==='city'?'도시 ':'구역 ')+t.name+', '+tname+', '+owner+', 병력 '+mn);
    var hint=tg?'<text class="ht '+tg.c+'" x="HX" y="HY">'+tg.txt+'</text>':'';
    if(tg&&selT)lines+=arrowSvg(ui.sel,t.id,tg.c);
    if(t.kind==='area'){
      base+='<path class="poly '+cls+dim+fl+'" data-i="'+t.id+'" d="'+m.d+'" tabindex="0" role="button" aria-label="'+aria+'"/>';
      if(ow>=0)tex+='<path class="tx'+dim+'" fill="url(#pM'+ow+')" d="'+m.d+'"/>';
      if(m.ter==='mtn')tex+='<path class="tx'+dim+'" fill="url(#pMtn)" d="'+m.d+'"/>';
      else if(m.ter==='forest')tex+='<path class="tx'+dim+'" fill="url(#pFor)" d="'+m.d+'"/>';
      if(isSel)fx+='<path class="fx-sel" d="'+m.d+'"/><path class="fx-ant" d="'+m.d+'"/>';
      else if(tg)fx+='<path class="fx-tgt '+tg.c+'" d="'+m.d+'"/>';
      var lx=m.lx,ly=m.ly,gl='';
      if(m.ter==='mtn')gl='<path class="tg m" d="M'+(lx-35)+' '+(ly+12)+'L'+(lx-31)+' '+(ly+4)+'L'+(lx-27)+' '+(ly+12)+'Z"/>';
      else if(m.ter==='forest')gl='<path class="tg f" d="M'+(lx-35)+' '+(ly+8)+'L'+(lx-31)+' '+(ly+1)+'L'+(lx-27)+' '+(ly+8)+'ZM'+(lx-36)+' '+(ly+13)+'L'+(lx-31)+' '+(ly+6)+'L'+(lx-26)+' '+(ly+13)+'Z"/>';
      labs+='<g class="lab '+cls+dim+'">'+hint.replace('HX',lx.toFixed(1)).replace('HY',(ly-13).toFixed(1))+
        '<text class="nm" x="'+lx.toFixed(1)+'" y="'+ly.toFixed(1)+'">'+esc(t.name)+'</text>'+gl+
        '<text class="sm" x="'+lx.toFixed(1)+'" y="'+(ly+11).toFixed(1)+'">¥'+tileInc(G,t)+' · '+mn+'/'+t.cap+'</text>'+markG(ow,lx+34,ly+7.5,0.95,'mkl')+
        dotsSvg(lx,ly+21,mn,ow<0)+'</g>';
    }else{
      var px=m.px,py=m.py,pxs=px.toFixed(1),pys=py.toFixed(1);
      if(isSel)cityFx+='<circle class="halo" cx="'+pxs+'" cy="'+pys+'" r="13"/><circle class="selring" cx="'+pxs+'" cy="'+pys+'" r="16.5"/>';
      else if(tg)cityFx+='<circle class="tgtring '+tg.c+'" cx="'+pxs+'" cy="'+pys+'" r="16.5"/>';
      var shape,deck='';
      if(t.type==='fort')shape='<rect class="city fort '+cls+'" x="'+(px-8).toFixed(1)+'" y="'+(py-8).toFixed(1)+'" width="16" height="16" rx="2.5" transform="rotate(45 '+pxs+' '+pys+')"/>';
      else shape='<circle class="city '+cls+'" cx="'+pxs+'" cy="'+pys+'" r="9.5"/>';
      if(t.type==='bridge')deck='<path class="deck" d="M'+(px-16).toFixed(1)+' '+(py-5).toFixed(1)+'H'+(px+16).toFixed(1)+'M'+(px-16).toFixed(1)+' '+(py+5).toFixed(1)+'H'+(px+16).toFixed(1)+'"/>';
      labs+='<g class="lab '+cls+dim+'">'+deck+(t.hq?'<circle class="ring" cx="'+pxs+'" cy="'+pys+'" r="13"/>':'')+shape+
        hint.replace('HX',pxs).replace('HY',(py-27).toFixed(1))+
        '<text class="cinc" x="'+pxs+'" y="'+(py+3.4).toFixed(1)+'">¥'+tileInc(G,t)+'</text>'+
        '<text class="cnm" x="'+pxs+'" y="'+(py-16).toFixed(1)+'">'+esc(t.name)+'</text>'+
        markG(ow,px-16,py-9,0.95,'mkl')+dotsSvg(px,py+(t.hq?21:18),mn,ow<0)+'</g>';
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
    bubs+='<g class="bub '+b.kind+'" data-bubble="'+i+'" tabindex="0" role="button" aria-label="'+(b.kind==='dirty'?'뒷돈 ¥10, 견제 +3':'잔돈 ¥3~5')+' — '+esc(m.name)+'" transform="translate('+x.toFixed(1)+' '+y.toFixed(1)+')">'+
      '<circle class="bh" r="15"/><circle class="bc" r="10"/><text y="4.2">¥</text></g>';
  });
  if(ui.shot){
    var a2=ctr(ui.shot.from),b3=ctr(ui.shot.to),dx=b3[0]-a2[0],dy=b3[1]-a2[1],len=Math.sqrt(dx*dx+dy*dy);
    shot='<line class="shot '+ui.shot.c+'" style="--len:'+len.toFixed(0)+'px" x1="'+a2[0].toFixed(1)+'" y1="'+a2[1].toFixed(1)+'" x2="'+b3[0].toFixed(1)+'" y2="'+b3[1].toFixed(1)+'"/>';
  }
  ui.pops.forEach(function(p){var c=ctr(p.id);pops+='<text class="pop '+p.c+'" x="'+c[0].toFixed(1)+'" y="'+(c[1]-8).toFixed(1)+'">'+esc(p.t)+'</text>';});
  var vb='-12 -12 '+(MAP_W+24)+' 504';
  $('fx').setAttribute('viewBox',vb);
  $('map').innerHTML='<svg viewBox="'+vb+'" preserveAspectRatio="xMidYMid meet" role="group" aria-label="지도">'+
    '<defs>'+markDefs()+'<clipPath id="land"><path d="'+COAST_D+'"/></clipPath>'+
    '<pattern id="pMtn" width="15" height="12" patternUnits="userSpaceOnUse"><path class="pt m" d="M1.5 10L5 3.5L8.5 10M8 10L11 5.5L14 10"/></pattern>'+
    '<pattern id="pFor" width="10" height="10" patternUnits="userSpaceOnUse"><circle class="pt f" cx="2.6" cy="2.6" r="1.7"/><circle class="pt f" cx="7.6" cy="7.4" r="1.7"/></pattern></defs>'+
    '<rect class="sea" x="-12" y="-12" width="'+(MAP_W+24)+'" height="504"/>'+
    '<g clip-path="url(#land)">'+base+tex+'<path class="river" d="'+RIVER_D+'"/><path class="river2" d="'+RIVER_D+'"/>'+fx+'</g><path class="coast" d="'+COAST_D+'"/>'+
    rail+lines+cityFx+labs+hits+bubs+shot+pops+'</svg>';
  if(had&&ui.focus!==null){var f=$('map').querySelector('[data-i="'+ui.focus+'"]');if(f)f.focus();}
}
