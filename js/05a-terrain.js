/* ========== 지도의 정적 그림 (수채화풍) ==========
   판(지도 씨앗)이 바뀔 때만 한 번 그린다. 땅 주인·병력 같은 움직이는 것은 05-map-render.js 가 위에 얹는다. */
var TERRAIN_KEY='';
var PAL={
  paper:'#d6c99d',
  plain:['#bfc78c','#b6c082','#c7c993','#adb97b'],
  forest:['#8aa468','#7f9b5e','#93ab6f'],
  mtn:['#ad9f80','#a39476','#b6a88a'],
  field:['#c8c878','#a9ba72','#d8c98c','#9fb069','#cfbe7e','#b9c27f'],
  roof:['#b5573b','#5d7f93','#7c8a4b','#a26a3a','#8a5a7a']
};
function artRng(seed){
  var a=((seed|0)+0x9e3779b9)|0;
  return function(){a=(a+0x6D2B79F5)|0;var t=Math.imul(a^(a>>>15),1|a);t=(t+Math.imul(t^(t>>>7),61|t))^t;return((t^(t>>>14))>>>0)/4294967296;};
}
function pickA(R,a){return a[Math.floor(R()*a.length)];}
function f1(n){return(Math.round(n*10)/10).toString();}
function distSeg(px,py,a,b){
  var dx=b[0]-a[0],dy=b[1]-a[1],l2=dx*dx+dy*dy,t=l2?((px-a[0])*dx+(py-a[1])*dy)/l2:0;
  t=Math.max(0,Math.min(1,t));
  return Math.hypot(px-(a[0]+dx*t),py-(a[1]+dy*t));
}
function riverDist(x,y){
  var d=1e9;
  for(var i=0;i<RIVER_PTS.length-1;i++)d=Math.min(d,distSeg(x,y,RIVER_PTS[i],RIVER_PTS[i+1]));
  return d;
}
function polyBox(P){
  var x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;
  P.forEach(function(p){x0=Math.min(x0,p[0]);y0=Math.min(y0,p[1]);x1=Math.max(x1,p[0]);y1=Math.max(y1,p[1]);});
  return[x0,y0,x1,y1];
}
function terrainDefs(seed){
  var d='';
  d+='<filter id="fNoise" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".018 .026" numOctaves="4" seed="'+(seed%97)+'"/>'+
     '<feColorMatrix type="matrix" values="0 0 0 0 .42  0 0 0 0 .31  0 0 0 0 .14  0 0 0 1.25 -.42"/></filter>';
  d+='<filter id="fGrain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="'+(seed%53)+'"/>'+
     '<feColorMatrix type="matrix" values="0 0 0 0 .2  0 0 0 0 .15  0 0 0 0 .08  0 0 0 .9 -.3"/></filter>';
  d+='<filter id="fCloud" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="9"/></filter>';
  d+='<filter id="fSoft" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation=".6"/></filter>';
  d+='<radialGradient id="vg" cx="50%" cy="50%" r="75%"><stop offset=".55" stop-color="#3a2b12" stop-opacity="0"/><stop offset="1" stop-color="#3a2b12" stop-opacity=".42"/></radialGradient>';
  d+='<g id="tr"><ellipse cx="1.2" cy="3.4" rx="4" ry="1.6" fill="#2d3a1a" opacity=".28"/><circle cx="0" cy="0" r="4.2" fill="#4c7842"/><circle cx="-1" cy="-1.2" r="2.8" fill="#6f9f58"/><circle cx="-1.6" cy="-1.8" r="1.2" fill="#9cc77c" opacity=".8"/></g>';
  d+='<g id="tr2"><ellipse cx="1" cy="4" rx="3.4" ry="1.3" fill="#2d3a1a" opacity=".28"/><path d="M0 -6L4 2H-4Z" fill="#456f3f"/><path d="M0 -6L-4 2H0Z" fill="#5f8f4f"/></g>';
  d+='<g id="pk"><ellipse cx="2" cy="1" rx="11" ry="2.6" fill="#3b2f1c" opacity=".22"/><path d="M-10 0L-1 -17L1 -9L3 0Z" fill="#c3b596"/><path d="M-1 -17L10 0H3L1 -9Z" fill="#85735a"/>'+
     '<path d="M-1 -17L1 -9L-2 -5L-4 -9Z" fill="#e8e0c8" opacity=".85"/><path d="M-10 0L-1 -17L10 0" fill="none" stroke="#5f4e38" stroke-width=".7" stroke-linejoin="round"/>'+
     '<path d="M2 -8L4 -3M-4 -4L-6 0M5 -2L6 0" stroke="#5f4e38" stroke-width=".5" fill="none" opacity=".7"/></g>';
  d+='<g id="pk2"><ellipse cx="1" cy="1" rx="8" ry="2" fill="#3b2f1c" opacity=".2"/><path d="M-7 0L0 -11L2 0Z" fill="#bfb090"/><path d="M0 -11L7 0H2Z" fill="#8a7860"/><path d="M-7 0L0 -11L7 0" fill="none" stroke="#5f4e38" stroke-width=".6" stroke-linejoin="round"/></g>';
  for(var k=0;k<PAL.roof.length;k++){
    d+='<g id="hs'+k+'"><rect x="-4" y="2.6" width="9.6" height="1.6" fill="#3b2f1c" opacity=".2"/><rect x="-4.2" y="-2.6" width="8.4" height="5.6" fill="#ecdcae"/><rect x="1.2" y="-2.6" width="3" height="5.6" fill="#d3bf8a"/>'+
       '<path d="M-5.4 -2.4L-1 -7.6L5.4 -7.6L4.4 -2.4Z" fill="'+PAL.roof[k]+'"/><path d="M-5.4 -2.4L-1 -7.6L0.6 -7.6L-3.2 -2.4Z" fill="#fff" opacity=".18"/><rect x="-2.2" y="-0.6" width="1.8" height="3.6" fill="#7a5f3a" opacity=".7"/></g>';
  }
  return'<defs>'+d+'</defs>';
}
function cloudBlobs(R,W){
  var h='<g class="clouds">';
  for(var i=0;i<7;i++){
    var edge=R(),x,y;
    if(edge<0.5){x=R()<0.5?R()*70:W-R()*70;y=R()*480;}else{x=R()*W;y=R()<0.5?R()*60:480-R()*60;}
    h+='<ellipse cx="'+f1(x)+'" cy="'+f1(y)+'" rx="'+f1(40+R()*50)+'" ry="'+f1(14+R()*18)+'" fill="#f6f1e2" opacity="'+f1(0.24+R()*0.2)+'" filter="url(#fCloud)"/>';
  }
  return h+'</g>';
}
function terrainSvg(){
  var W=MAP_W,R=artRng(MAPSEED|0),seed=(MAPSEED|0)>>>0;
  var vb='-12 -12 '+(W+24)+' 504';
  var h='<svg viewBox="'+vb+'" preserveAspectRatio="xMidYMid meet" aria-hidden="true">'+terrainDefs(seed);
  h+='<clipPath id="landT"><path d="'+COAST_D+'"/></clipPath>';
  h+='<rect x="-12" y="-12" width="'+(W+24)+'" height="504" fill="'+PAL.paper+'"/>';
  h+='<g clip-path="url(#landT)">';
  /* 땅 색 */
  var items=[],i,t,m;
  var cityPts=[];
  NODES.forEach(function(n){if(n.kind==='city')cityPts.push([n.px,n.py]);});
  for(i=0;i<N_AREAS;i++){
    m=NODES[i];
    var base=m.ter==='mtn'?pickA(R,PAL.mtn):(m.ter==='forest'?pickA(R,PAL.forest):pickA(R,PAL.plain));
    h+='<path d="'+m.d+'" fill="'+base+'"/>';
  }
  h+='<rect x="-12" y="-12" width="'+(W+24)+'" height="504" filter="url(#fNoise)" opacity=".55"/>';
  /* 구역 경계: 붓으로 그은 가는 선 */
  for(i=0;i<N_AREAS;i++)h+='<path d="'+NODES[i].d+'" fill="none" stroke="#6b5a38" stroke-opacity=".34" stroke-width=".9" stroke-linejoin="round"/>';
  /* 강 */
  h+='<path d="'+RIVER_D+'" fill="none" stroke="#486f86" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" opacity=".92"/>'+
     '<path d="'+RIVER_D+'" fill="none" stroke="#6ea3bb" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>'+
     '<path d="'+RIVER_D+'" fill="none" stroke="#b7dbe6" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="10 9" opacity=".75"/>';
  /* 길 */
  var rd='';
  for(i=0;i<N_AREAS;i++)ADJ[i].forEach(function(j){
    if(j>=N_AREAS||j<i)return;
    var a=NODES[i],b=NODES[j],mx=(a.cx+b.cx)/2,my=(a.cy+b.cy)/2,dx=b.cx-a.cx,dy=b.cy-a.cy,l=Math.hypot(dx,dy)||1,off=(R()-0.5)*16;
    rd+='M'+f1(a.cx)+' '+f1(a.cy)+'Q'+f1(mx-dy/l*off)+' '+f1(my+dx/l*off)+' '+f1(b.cx)+' '+f1(b.cy);
  });
  h+='<path d="'+rd+'" fill="none" stroke="#7a673f" stroke-opacity=".35" stroke-width="2.6" stroke-linecap="round"/>'+
     '<path d="'+rd+'" fill="none" stroke="#f1e6c3" stroke-opacity=".8" stroke-width="1.3" stroke-linecap="round" stroke-dasharray="5 3"/>';
  /* 다리 */
  NODES.forEach(function(n){
    if(n.type!=='bridge')return;
    var best=1e9,ang=0;
    for(var r=0;r<RIVER_PTS.length-1;r++){
      var dd=distSeg(n.px,n.py,RIVER_PTS[r],RIVER_PTS[r+1]);
      if(dd<best){best=dd;ang=Math.atan2(RIVER_PTS[r+1][1]-RIVER_PTS[r][1],RIVER_PTS[r+1][0]-RIVER_PTS[r][0])*57.296+90;}
    }
    h+='<g transform="translate('+f1(n.px)+' '+f1(n.py)+') rotate('+f1(ang)+')"><rect x="-4.5" y="-17" width="9" height="34" rx="1.5" fill="#6b5a38"/>'+
       '<rect x="-3.2" y="-17" width="6.4" height="34" fill="#e3d3a4"/><path d="M-3.2 -11H3.2M-3.2 -5H3.2M-3.2 1H3.2M-3.2 7H3.2M-3.2 13H3.2" stroke="#9a855a" stroke-width=".7"/></g>';
  });
  /* 땅 위의 것들: 산 · 숲 · 논밭 · 마을 */
  function free(x,y,m2,pad){
    if(x<10||x>W-10||y<10||y>470)return false;
    if(riverDist(x,y)<(pad||9))return false;
    if(m2&&Math.abs(x-m2.lx)<44&&y>m2.ly-14&&y<m2.ly+34)return false;
    for(var c=0;c<cityPts.length;c++)if(Math.hypot(x-cityPts[c][0],y-cityPts[c][1])<22)return false;
    return true;
  }
  function spot(P,box,m2,pad){
    for(var tr=0;tr<30;tr++){
      var x=box[0]+R()*(box[2]-box[0]),y=box[1]+R()*(box[3]-box[1]);
      if(inPoly(x,y,P)&&free(x,y,m2,pad))return[x,y];
    }
    return null;
  }
  for(i=0;i<N_AREAS;i++){
    m=NODES[i];
    var box=polyBox(m.poly),area=(box[2]-box[0])*(box[3]-box[1]),n;
    if(m.ter==='mtn'){
      n=Math.max(4,Math.round(area/700));
      for(t=0;t<n;t++){var p=spot(m.poly,box,m,10);if(!p)continue;var sc=0.8+R()*0.7;items.push({y:p[1],s:'<use href="#'+(R()<0.35?'pk2':'pk')+'" transform="translate('+f1(p[0])+' '+f1(p[1])+') scale('+f1(sc)+')"/>'});}
    }else if(m.ter==='forest'){
      n=Math.max(8,Math.round(area/230));
      for(t=0;t<n;t++){var q=spot(m.poly,box,m,8);if(!q)continue;var s2=0.8+R()*0.5;items.push({y:q[1],s:'<use href="#'+(R()<0.28?'tr2':'tr')+'" transform="translate('+f1(q[0])+' '+f1(q[1])+') scale('+f1(s2)+')"/>'});}
    }else{
      n=3+Math.round(area/1500);
      for(t=0;t<n;t++){
        var f=spot(m.poly,box,m,8);if(!f)continue;
        var w=12+R()*16,hh=7+R()*7,rot=(R()-0.5)*50,col=pickA(R,PAL.field),ln='';
        for(var z=1;z<3;z++)ln+='M'+f1(-w/2+3)+' '+f1(-hh/2+z*hh/3)+'H'+f1(w/2-3);
        h+='<g transform="translate('+f1(f[0])+' '+f1(f[1])+') rotate('+f1(rot)+')" opacity=".92"><rect x="'+f1(-w/2)+'" y="'+f1(-hh/2)+'" width="'+f1(w)+'" height="'+f1(hh)+'" rx="1" fill="'+col+'" stroke="#6b5a38" stroke-opacity=".3" stroke-width=".6"/>'+
          '<path d="'+ln+'" stroke="#6b5a38" stroke-opacity=".28" stroke-width=".7" fill="none"/></g>';
      }
      if(!m.hasCity&&R()<0.4){
        var v=spot(m.poly,box,m,10);
        if(v)for(var hh2=0;hh2<3;hh2++)items.push({y:v[1]+hh2*3,s:'<use href="#hs'+Math.floor(R()*PAL.roof.length)+'" transform="translate('+f1(v[0]+(hh2-1)*8)+' '+f1(v[1]+hh2*3+(hh2%2?3:0))+')"/>'});
      }
    }
  }
  /* 도시 둘레의 집들 */
  NODES.forEach(function(n){
    if(n.kind!=='city'||n.type==='bridge')return;
    var cnt=n.type==='hq'?11:(n.type==='fort'?5:8),rr=n.type==='hq'?24:20;
    for(var q2=0;q2<cnt;q2++){
      var an=(q2/cnt)*6.283+R()*0.6,r2=13+R()*(rr-13),x=n.px+Math.cos(an)*r2*1.25,y=n.py+Math.sin(an)*r2*0.85+2;
      if(riverDist(x,y)<8||x<8||x>W-8||y<8||y>472)continue;
      items.push({y:y,s:'<use href="#hs'+Math.floor(R()*PAL.roof.length)+'" transform="translate('+f1(x)+' '+f1(y)+') scale(.9)"/>'});
    }
  });
  items.sort(function(a,b){return a.y-b.y;});
  items.forEach(function(it){h+=it.s;});
  h+=cloudBlobs(R,W);
  h+='<rect x="-12" y="-12" width="'+(W+24)+'" height="504" filter="url(#fGrain)" opacity=".5"/>';
  h+='<rect x="-12" y="-12" width="'+(W+24)+'" height="504" fill="url(#vg)"/>';
  h+='</g></svg>';
  return h;
}
function ensureTerrain(){
  var key=MAPSEED+':'+MAP_W,el=$('terrain');
  if(!el||TERRAIN_KEY===key)return;
  el.innerHTML=terrainSvg();
  TERRAIN_KEY=key;
}
