/* ========== 그림: 강화 아이콘 · 조직 우두머리 초상 ========== */
var TECH_ICON={
  /* 기반: 금빛 */
  a1:'<path d="M3 10.5h18V20H3z"/><path d="M2.5 10.5L4.5 4.5h15l2 6"/><path d="M6.5 10.5c0 1.6 1.2 2.6 2.7 2.6s2.7-1 2.7-2.6c0 1.6 1.2 2.6 2.7 2.6s2.7-1 2.7-2.6"/><path d="M10 20v-4.5h4V20"/>',
  a2:'<path d="M5 3.5h12.5a1.5 1.5 0 0 1 1.5 1.5v14.5H6.5A1.5 1.5 0 0 1 5 18z"/><path d="M5 18a1.5 1.5 0 0 1 1.5-1.5H19"/><path d="M9 8l2 2.6L13 8M11 10.6v4M9 12.2h4M9 13.8h4"/>',
  a3:'<circle cx="12" cy="7.5" r="2.8"/><path d="M6.8 19v-2.2c0-2.4 2.3-4 5.2-4s5.2 1.6 5.2 4V19z"/><circle cx="5" cy="9.5" r="2"/><path d="M1.6 17.5v-1.3c0-1.4 1.4-2.4 3.4-2.4"/><circle cx="19" cy="9.5" r="2"/><path d="M22.4 17.5v-1.3c0-1.4-1.4-2.4-3.4-2.4"/>',
  /* 무력: 붉은빛 */
  b1:'<path d="M4.5 19.5L17.5 6.5"/><path d="M3.2 17.6l3.2 3.2"/><path d="M16 5l3-1.4 1.4 3L17.8 8.6z"/><path d="M8 15.5l2.4 2.4"/>',
  b2:'<path d="M2.5 15.5v-3.2l2.4-.7 2.2-4.1h8.4l3.1 4 2.4.8v3.2z"/><path d="M9 7.5v4.3M2.5 12.2h19"/><circle cx="7.3" cy="16.4" r="2.2"/><circle cx="16.7" cy="16.4" r="2.2"/>',
  b3:'<path d="M3 7.5h13.5l1.2 1.5H21v3.3h-3.3l-.6 2H13l-.8 3.7H8.8L9.6 14.3H8L6.7 11H3z"/><path d="M12 10.2h3"/>',
  /* 은폐: 청록빛 */
  c1:'<path d="M3.5 13c2.4-3 5-4.2 8.5-4.2S18.1 10 20.5 13c-2.4 3.4-5 4.8-8.5 4.8S5.9 16.4 3.5 13z"/><path d="M3.5 13h17"/><path d="M8 11.8v2.6M10.7 11.3v3.3M13.3 11.3v3.3M16 11.8v2.6"/>',
  c2:'<path d="M12 2.8l7.6 2.7v6c0 4.8-3.2 8.3-7.6 9.7-4.4-1.4-7.6-4.9-7.6-9.7v-6z"/><path d="M12 7.5l1.4 2.8 3.1.4-2.3 2.2.6 3.1L12 14.4l-2.8 1.6.6-3.1-2.3-2.2 3.1-.4z"/>',
  c3:'<path d="M12 3.5v16.5M7.5 20h9"/><path d="M4 7.5h16"/><path d="M4 7.5L1.8 13.2a3 3 0 0 0 4.4 0z"/><path d="M20 7.5l-2.2 5.7a3 3 0 0 0 4.4 0z"/><circle cx="12" cy="4.4" r="1.1"/>',
  a4:'<rect x="4" y="5" width="16" height="14" rx="1.6"/><circle cx="12" cy="12" r="3.2"/><path d="M12 9.8v2.4l1.5 1M7 19v1.6M17 19v1.6"/>',
  a5:'<circle cx="12" cy="12" r="8"/><path d="M7.6 12.6q2.2-2.6 4.4 0t4.4 0"/><circle cx="12" cy="8.6" r=".9"/><path d="M9.4 15.6q2.6 1.4 5.2 0"/>',
  a6:'<ellipse cx="9" cy="16.5" rx="5" ry="2"/><path d="M4 16.5v-3M14 16.5v-3"/><ellipse cx="9" cy="13.5" rx="5" ry="2"/><ellipse cx="16" cy="10.5" rx="4.4" ry="1.8"/><path d="M11.6 10.5v-3M20.4 10.5v-3"/><ellipse cx="16" cy="7.5" rx="4.4" ry="1.8"/>',
  b4:'<path d="M12 3l7 2.6v6c0 4.4-3 7.6-7 9.4-4-1.8-7-5-7-9.4v-6z"/><path d="M12 8v8M8.5 12h7"/>',
  b5:'<path d="M8 21l1.4-10h5.2L16 21"/><path d="M6.5 11h11V8H6.5zM8 8V5.5h8V8M12 5.5V2.8M9.6 15h4.8"/>',
  b6:'<path d="M12 3l2.5 5.2 5.7.8-4.1 4 1 5.7L12 16l-5.1 2.7 1-5.7-4.1-4 5.7-.8z"/>',
  c4:'<rect x="3" y="6" width="18" height="12" rx="1.6"/><path d="M3.5 7l8.5 6.5L20.5 7"/>',
  c5:'<path d="M9.5 14.5l-2 2a3.2 3.2 0 0 1-4.5-4.5l2-2M14.5 9.5l2-2A3.2 3.2 0 0 1 21 12l-2 2"/><path d="M9.4 9.4l1.4 1.4M14.6 14.6l-1.4-1.4M12 2.8v2.2M4 20l1.6-1.6M20 20l-1.6-1.6"/>',
  c6:'<path d="M4 10v4h3l7 4V6L7 10z"/><path d="M17 9.5a3.4 3.4 0 0 1 0 5M7 14l1.2 5h2.4L9.6 15.6"/>'
};
function techIcon(id,br){
  return'<svg class="ico b'+br+'" viewBox="0 0 24 24" aria-hidden="true">'+(TECH_ICON[id]||'')+'</svg>';
}

/* 우두머리 초상 (이 게임용으로 새로 그린 가상 인물) */
function portrait(r){
  var bg,body,mk=markG(r,52,12,1.6,'');
  if(r===1){ /* 하야시구미 — 겁 많은 노인회 회장 */
    body='<path d="M4 64C6 51 18 46 32 46s26 5 28 18z" fill="#2a3325"/>'+
      '<path d="M23.5 46.5L32 61l8.5-14.5" fill="none" stroke="#d9d3c0" stroke-width="3.4" stroke-linejoin="round"/>'+
      '<rect x="27.5" y="37" width="9" height="11" rx="3" fill="#c3a083"/>'+
      '<ellipse cx="19.6" cy="28" rx="2.4" ry="3.6" fill="#c9a98c"/><ellipse cx="44.4" cy="28" rx="2.4" ry="3.6" fill="#c9a98c"/>'+
      '<ellipse cx="32" cy="27" rx="12" ry="14.2" fill="#d8b99b"/>'+
      '<path d="M20.2 23c-3-1-3.6 6.2-.6 8.4-.9-3-.7-6 .6-8.4zM43.8 23c3-1 3.6 6.2.6 8.4.9-3 .7-6-.6-8.4z" fill="#e8e4d8"/>'+
      '<path d="M22.5 15.8c3-3.6 6.2-4.6 9.5-4.6" fill="none" stroke="#e8e4d8" stroke-width="1.6" stroke-linecap="round" opacity=".5"/>'+
      '<path d="M24 17.6h6M34 17.6h6M25.5 19.8h4M34.5 19.8h4" stroke="#b79a80" stroke-width=".9" stroke-linecap="round" fill="none"/>'+
      '<path d="M22.4 23.4q3.6-2 7 0M34.6 23.4q3.6-2 7 0" fill="none" stroke="#e8e4d8" stroke-width="2.2" stroke-linecap="round"/>'+
      '<circle cx="26.2" cy="27.4" r="4.6" fill="rgba(200,220,230,.14)" stroke="#2b2b2b" stroke-width="1.1"/><circle cx="37.8" cy="27.4" r="4.6" fill="rgba(200,220,230,.14)" stroke="#2b2b2b" stroke-width="1.1"/><path d="M30.8 27.2h2.4" stroke="#2b2b2b" stroke-width="1"/>'+
      '<circle cx="26.5" cy="27.8" r="1" fill="#241e1a"/><circle cx="37.5" cy="27.8" r="1" fill="#241e1a"/>'+
      '<path d="M32 28.4v4.6" stroke="#b08e74" stroke-width="1" stroke-linecap="round"/>'+
      '<path d="M25.4 35.6q3.4-3.2 6.6-1.6 3.2-1.6 6.6 1.6-3.4 2.2-6.6.8-3.2 1.4-6.6-.8z" fill="#ebe7da"/>'+
      '<path d="M29.4 39.4q2.6 1 5.2 0" fill="none" stroke="#9c7a68" stroke-width="1" stroke-linecap="round"/>'+
      '<path d="M44 52h7.5l-.6 8h-6.3z" fill="#3a4733"/><path d="M45 50.4q1.5-1.4 0-2.8M48 50.4q1.5-1.4 0-2.8" fill="none" stroke="#d9d3c0" stroke-width=".9" opacity=".6"/>';
    bg='#1c2318';
  }else if(r===2){ /* 쓰키가미카이 — 체면을 지키는 여자 오야붕 */
    body='<path d="M4 64C6 51 18 46 32 46s26 5 28 18z" fill="#2a2240"/>'+
      '<path d="M22.5 46.5L32 60l9.5-13.5" fill="none" stroke="#b34a55" stroke-width="3.6" stroke-linejoin="round"/>'+
      '<path d="M26 61l6-5 6 5" fill="none" stroke="#c9a14a" stroke-width="1" opacity=".7"/>'+
      '<rect x="28" y="37" width="8" height="11" rx="3" fill="#d9bca6"/>'+
      '<circle cx="32" cy="8.6" r="5.4" fill="#12101a"/>'+
      '<ellipse cx="32" cy="27" rx="11" ry="13.4" fill="#e3c9b5"/>'+
      '<path d="M19.6 31c-4-12 3.4-21.4 12.4-21.4S48.4 19 44.4 31c.4-8-3.8-14.2-12.4-14.2S19.2 23 19.6 31z" fill="#12101a"/>'+
      '<path d="M26 20.4q6 3.4 12 0" fill="none" stroke="#12101a" stroke-width="2.4" stroke-linecap="round"/>'+
      '<path d="M24.2 25.2q3-1.8 6 .1M33.8 25.3q3-1.9 6-.1" fill="none" stroke="#1b1620" stroke-width="1" stroke-linecap="round"/>'+
      '<path d="M24.4 28q2.8 1.5 5.8 0M33.8 28q3 1.5 5.8 0" fill="none" stroke="#1b1620" stroke-width="1.6" stroke-linecap="round"/>'+
      '<path d="M23.8 28.2l-1.5-1.4M40.2 28.2l1.5-1.4" stroke="#1b1620" stroke-width="1.1" stroke-linecap="round"/>'+
      '<path d="M32 28.4v4.4" stroke="#c5a28e" stroke-width="1" stroke-linecap="round"/>'+
      '<path d="M28.6 36.2q3.4-1.6 6.8 0-1.2 2.6-3.4 2.6t-3.4-2.6z" fill="#a8303d"/>'+
      '<path d="M40.4 5.6a4 4 0 1 1 0 6.2 3.2 3.2 0 0 0 0-6.2z" fill="#d6b25a"/><path d="M36.6 8.4h3.6" stroke="#d6b25a" stroke-width="1"/>'+
      '<path d="M41 31.5l2.2 5.4" stroke="#b78672" stroke-width="1" stroke-linecap="round" opacity=".8"/>';
    bg='#1d1829';
  }else{ /* 구로이누 — 하이에나 같은 젊은 두목 */
    body='<path d="M4 64C6 51 16 46 32 46s26 5 28 18z" fill="#151a1f"/>'+
      '<path d="M22 47l10 17 10-17-4-1.6-6 8.4-6-8.4z" fill="#e6e2d4"/>'+
      '<path d="M18.5 46.8L25 62l-9.4 2zM45.5 46.8L39 62l9.4 2z" fill="#0f1317"/>'+
      '<rect x="27" y="37" width="10" height="11" rx="3" fill="#bf9a7e"/>'+
      '<path d="M29 43.6l1.2 2.4 1.2-2.4M33 43.6l1.2 2.4 1.2-2.4" fill="none" stroke="#52aaa6" stroke-width="1.1" stroke-linejoin="round"/>'+
      '<ellipse cx="19.8" cy="28.5" rx="2.2" ry="3.4" fill="#c5a085"/><circle cx="19.4" cy="31.2" r="1.1" fill="#52aaa6"/>'+
      '<ellipse cx="44.2" cy="28.5" rx="2.2" ry="3.4" fill="#c5a085"/>'+
      '<ellipse cx="32" cy="27" rx="11.6" ry="13.6" fill="#d0ab8d"/>'+
      '<path d="M19.8 26c-1.4-9.6 4.6-17.6 13-17.4 8 .2 12.4 6.4 11.4 17.4-1.6-8.4-5.4-12.6-12-12.4-6.2.2-10 4.6-12.4 12.4z" fill="#0e1013"/>'+
      '<path d="M24 12l-1.6-3.4M29 10.4l-.6-3.6M34.6 10.4l1.4-3.4M39.8 12.6l2.6-2.6" stroke="#0e1013" stroke-width="2.4" stroke-linecap="round"/>'+
      '<path d="M20.4 24.6H43.6V30q0 2.6-2.8 2.6h-4q-2.2 0-2.6-2.4-.6-1.4-1.8 0-.4 2.4-2.6 2.4h-4q-2.8 0-2.8-2.6z" fill="#0a0b0e"/>'+
      '<path d="M23.4 26.4l4.4-.1M35.6 26.4l4.6-.1" stroke="#52aaa6" stroke-width="1" stroke-linecap="round" opacity=".8"/>'+
      '<path d="M32 30v3.6" stroke="#b58f74" stroke-width="1" stroke-linecap="round"/>'+
      '<path d="M24.6 36.4q7.4 5 14.8 0-1 4.6-7.4 4.6t-7.4-4.6z" fill="#f1ede0" stroke="#231815" stroke-width="1"/>'+
      '<path d="M27 37.2l1.2 2.4 1.2-2M34.6 37.2l1.2 2.2 1.2-2.4" fill="#f1ede0" stroke="#231815" stroke-width=".6"/>'+
      '<path d="M38.4 27.8l3.2 9" stroke="#8c5a4c" stroke-width="1.2" stroke-linecap="round"/><path d="M37.6 31.2l3.6-1M38.6 34.2l3.2-1" stroke="#8c5a4c" stroke-width=".8" stroke-linecap="round"/>';
    bg='#0f1f1e';
  }
  return'<svg class="pt o'+r+'" viewBox="0 0 64 64" role="img" aria-label="'+ORGS[r].name+' 우두머리">'+
    '<rect width="64" height="64" fill="'+bg+'"/><g opacity=".3">'+mk+'</g>'+
    '<g class="mk o'+r+'" opacity=".22"><path d="M0 64L64 0V64Z" fill="var(--oc)" style="stroke:none"/></g>'+body+'</svg>';
}

/* ---------- 강화 나무: 육각 노드 ---------- */
var TPOS=[[150,50],[82,132],[218,132],[82,214],[218,214],[150,296]];
function hexPts(cx,cy,r){
  var out=[];
  for(var k=0;k<6;k++){var a=(30+60*k)*Math.PI/180;out.push((cx+r*Math.cos(a)).toFixed(1)+','+(cy+r*Math.sin(a)).toFixed(1));}
  return out.join(' ');
}
function branchTechs(br){return TECH.filter(function(t){return t.br===br;});}
function techState(s,t){
  if(hasTech(s,t.id))return'own';
  if(t.pre&&!hasTech(s,t.pre))return'locked';
  return s.money>=t.cost?'can':'open';
}
function techTreeSvg(br,sel){
  var list=branchTechs(br),pos={},h='<svg class="ttree" viewBox="0 0 300 346" role="group" aria-label="강화 나무">';
  list.forEach(function(t,i){pos[t.id]=TPOS[i];});
  list.forEach(function(t){
    if(!t.pre||!pos[t.pre])return;
    var a=pos[t.pre],b=pos[t.id],on=hasTech(G,t.pre);
    h+='<line class="tl'+(on?' on':'')+'" x1="'+a[0]+'" y1="'+a[1]+'" x2="'+b[0]+'" y2="'+b[1]+'"/>';
  });
  list.forEach(function(t){
    var p=pos[t.id],st=techState(G,t);
    h+='<g class="hx '+st+(sel===t.id?' sel':'')+'" data-tech="'+t.id+'" role="button" tabindex="0" aria-label="'+esc(t.name)+'">'+
      '<polygon class="hxb" points="'+hexPts(p[0],p[1],36)+'"/>'+
      (st==='can'?'<polygon class="hxp" points="'+hexPts(p[0],p[1],41)+'"/>':'')+
      '<polygon class="hxf" points="'+hexPts(p[0],p[1],31)+'"/>'+
      '<g class="hxi" transform="translate('+(p[0]-15)+' '+(p[1]-15)+') scale(1.25)">'+(TECH_ICON[t.id]||'')+'</g>'+
      (sel===t.id?'<polygon class="hxs" points="'+hexPts(p[0],p[1],38)+'"/>':'')+'</g>';
  });
  return h+'</svg>';
}

/* ---------- 작전실 개요: 아이소메트릭 본거지 ---------- */
function isoP(x,y,z){return[+(200+(x-y)*17).toFixed(1),+(92+(x+y)*9.6-z*19).toFixed(1)];}
function prism(x,y,w,d,h,top,left,right,line){
  function P(a,b,z){return isoP(a,b,z).join(',');}
  var ln=line?' stroke="'+line+'" stroke-width="1.6" stroke-linejoin="round"':' stroke="rgba(60,45,20,.35)" stroke-width=".7" stroke-linejoin="round"';
  return'<polygon points="'+P(x,y+d,0)+' '+P(x+w,y+d,0)+' '+P(x+w,y+d,h)+' '+P(x,y+d,h)+'" fill="'+left+'"'+ln+'/>'+
    '<polygon points="'+P(x+w,y,0)+' '+P(x+w,y+d,0)+' '+P(x+w,y+d,h)+' '+P(x+w,y,h)+'" fill="'+right+'"'+ln+'/>'+
    '<polygon points="'+P(x,y,h)+' '+P(x+w,y,h)+' '+P(x+w,y+d,h)+' '+P(x,y+d,h)+'" fill="'+top+'"'+ln+'/>';
}
function heroSvg(){
  var land=owned(G,0).length,objs=[],h='<svg class="hero" viewBox="0 0 400 300" role="img" aria-label="조직 본거지">';
  var g='#d9b45a';
  h+='<defs><pattern id="hAsph" width="6" height="6" patternUnits="userSpaceOnUse"><rect width="6" height="6" fill="#8d8b86"/><path d="M0 3H6" stroke="#7f7d78" stroke-width=".8"/></pattern></defs>';
  /* 바닥 */
  function Q(x0,y0,x1,y1,z){return isoP(x0,y0,z).join(',')+' '+isoP(x1,y0,z).join(',')+' '+isoP(x1,y1,z).join(',')+' '+isoP(x0,y1,z).join(',');}
  h+='<polygon points="'+Q(-0.6,-0.6,9.6,8.4,0)+'" fill="#6f6d68"/><polygon points="'+Q(-0.1,-0.1,9.1,7.9,0)+'" fill="url(#hAsph)" stroke="#5a5852" stroke-width="1"/>';
  h+='<polygon points="'+Q(0.4,5.2,2.8,7.6,0)+'" fill="#6aa86a" opacity=".85"/><polygon points="'+Q(6.4,0.6,8.6,2.4,0)+'" fill="#7fb37a" opacity=".8"/>';
  h+='<circle cx="'+isoP(1.6,6.4,0)[0]+'" cy="'+isoP(1.6,6.4,0)[1]+'" r="7" fill="#58a7bd"/><circle cx="'+isoP(1.6,6.4,0)[0]+'" cy="'+isoP(1.6,6.4,0)[1]+'" r="3" fill="#a9dbe6"/>';
  /* 건물 (뒤에서 앞으로) */
  objs.push({k:2.5,s:prism(1.6,0.8,3.4,2.2,2.6,'#d8a27a','#e5d3a6','#cdb784',g)+'<polygon points="'+[isoP(1.9,1.1,2.6),isoP(4.7,1.1,2.6),isoP(4.7,2.7,2.6),isoP(1.9,2.7,2.6)].map(function(p){return p.join(',');}).join(' ')+'" fill="#e3b48f" stroke="'+g+'" stroke-width="1.6"/>'});
  objs.push({k:3.6,s:prism(5.4,0.4,1.8,1.6,3.6,'#cfc7b2','#dccfae','#c5b88f')});
  objs.push({k:6.5,s:prism(5.5,4.2,2.6,1.6,1.2,'#a8b08a','#6f7a58','#5c6747')});
  var extra=Math.min(4,Math.floor(land/3));
  for(var i=0;i<extra;i++)objs.push({k:5+i,s:prism(0.4+i*1.5,3.6,1.1,1,1.2+((i%2)?0.5:0),'#d8c08b','#e2d0a2','#c9b17a')});
  /* 천막 */
  objs.push({k:7,s:'<polygon points="'+[isoP(6.3,3.1,0),isoP(8.1,3.1,0),isoP(8.1,3.1,1.2),isoP(7.2,3.1,1.9)].map(function(p){return p.join(',');}).join(' ')+'" fill="#e8e1c9"/><polygon points="'+[isoP(8.1,3.1,0),isoP(8.1,3.7,0),isoP(7.2,3.7,1.9),isoP(7.2,3.1,1.9)].map(function(p){return p.join(',');}).join(' ')+'" fill="#cfc7a8"/>'});
  /* 상자와 차량 */
  var cr=hasTech(G,'a1')+hasTech(G,'a2')+hasTech(G,'a4');
  for(var c=0;c<2+cr;c++)objs.push({k:4+c*0.2,s:prism(3.2+(c%3)*0.7,3.4+Math.floor(c/3)*0.7,0.6,0.6,0.5,'#e0b24a','#c99a34','#b3862a')});
  var cars=(hasTech(G,'b1')?1:0)+(hasTech(G,'b2')?1:0)+(hasTech(G,'b3')?1:0)+1;
  for(var v=0;v<cars;v++)objs.push({k:7.5+v,s:prism(3.4+v*1.3,5.8,1.0,0.6,0.55,'#3b3f46','#2d3036','#23262b')+prism(3.55+v*1.3,5.88,0.6,0.44,0.3,'#59606b','#444a54','#383d46')});
  /* 안테나 */
  if(hasTech(G,'c1')||hasTech(G,'c2')||hasTech(G,'c4')){
    var a0=isoP(8.2,1.2,0),a1=isoP(8.2,1.2,3.2);
    objs.push({k:3,s:'<path d="M'+a0.join(' ')+'L'+a1.join(' ')+'" stroke="#55606b" stroke-width="2"/><circle cx="'+a1[0]+'" cy="'+a1[1]+'" r="3" fill="#d94a4a"/><path d="M'+(a1[0]-9)+' '+(a1[1]+5)+'a10 10 0 0 1 18 0" fill="none" stroke="#55606b" stroke-width="1.4"/>'});
  }
  objs.sort(function(a,b){return a.k-b.k;});
  objs.forEach(function(o){h+=o.s;});
  /* 깃발 */
  var f0=isoP(2.0,3.4,0),f1p=isoP(2.0,3.4,2.4);
  h+='<path d="M'+f0.join(' ')+'L'+f1p.join(' ')+'" stroke="#5b4a2a" stroke-width="2"/><path d="M'+f1p.join(' ')+'l17 4-17 5z" fill="'+g+'"/>';
  /* 헬기 */
  var hp=isoP(7.3,6.5,0);
  h+='<g transform="translate('+hp[0]+' '+hp[1]+')"><ellipse cx="0" cy="3" rx="16" ry="7" fill="none" stroke="#e8e1c9" stroke-width="1.6"/><path d="M-4 3.4V-1M4 3.4V-1M-4 1.2h8" stroke="#e8e1c9" stroke-width="1.4"/>'+
    '<path d="M-10 -6c0-4 6-6 12-6s9 3 10 6l-3 4H-5z" fill="#6a7355" stroke="#454c37" stroke-width="1"/><path d="M-20 -10H18M-14 -15L16 -6" stroke="#3c4230" stroke-width="1.6" stroke-linecap="round"/><path d="M12 -6L26 -8" stroke="#6a7355" stroke-width="3"/></g>';
  return h+'</svg>';
}

/* ---------- 부하 얼굴 · 게이지 아이콘 ---------- */
function crewBust(i){
  var col=['#8a5f4a','#6b6f7a','#6f7a5c'][i%3],hair=['#17130f','#2a2018','#3a2c1c'][i%3];
  var x=i===1?'<circle cx="26" cy="27.5" r="4" fill="rgba(255,255,255,.25)" stroke="#2b2b2b" stroke-width="1"/><circle cx="38" cy="27.5" r="4" fill="rgba(255,255,255,.25)" stroke="#2b2b2b" stroke-width="1"/><path d="M30 27.4h4" stroke="#2b2b2b"/>':
    (i===0?'<path d="M39 22l3.4 9" stroke="#a45a4a" stroke-width="1.3" stroke-linecap="round"/>':'<path d="M27 26h3M34 26h3" stroke="#2b2b2b" stroke-width="1.4" stroke-linecap="round"/>');
  return'<svg class="pt crewpt" viewBox="0 0 64 64" role="img" aria-hidden="true"><rect width="64" height="64" fill="#2a211a"/>'+
    '<path d="M4 64C6 51 18 46 32 46s26 5 28 18z" fill="'+col+'"/><rect x="27.5" y="37" width="9" height="11" rx="3" fill="#c9a285"/>'+
    '<ellipse cx="32" cy="27" rx="11.5" ry="13.5" fill="#dbb99a"/><path d="M20.4 25c-1-9.4 4.6-15.6 11.8-15.4 7.4.2 12 5.4 11.4 15.4-2-6-5.6-9-11.4-8.8-5.6.2-9 3-11.8 8.8z" fill="'+hair+'"/>'+x+
    '<path d="M28.4 36.4q3.6 1.6 7.2 0" stroke="#8c5f50" stroke-width="1.2" fill="none" stroke-linecap="round"/></svg>';
}
var GICON={
  dread:'<path d="M7 11V6.5a1.6 1.6 0 0 1 3.2 0V10m0-4.2a1.6 1.6 0 0 1 3.2 0V10m0-3a1.6 1.6 0 0 1 3.2 0v4.2m0-1.6a1.6 1.6 0 0 1 3.2 0V14c0 4-2.4 6.8-6.4 6.8-3.6 0-5.2-1.8-7-4.6L3.6 13a1.6 1.6 0 0 1 2.6-1.8L7 12.6"/>',
  heat:'<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3.2"/>',
  anx:'<path d="M5 5.5c2.4-1.2 4.5-1.6 7-1.6s4.6.4 7 1.6v6.2c0 4.4-3 7.4-7 8.8-4-1.4-7-4.4-7-8.8z"/><path d="M12 4l-1.4 5 2.4 2.2-2 3.2 1.2 4"/>'
};
