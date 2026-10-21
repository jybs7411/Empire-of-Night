/* ========== 전투 연출 ========== */
var FXNS='http://www.w3.org/2000/svg';
var anim={cur:null,raf:0,done:null,queue:[]};
function fxOn(){
  if(window.__NOFX||set.anim===false)return false;
  try{if(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches)return false;}catch(e){}
  return true;
}
function sEl(tag,attrs){var e=document.createElementNS(FXNS,tag);for(var k in attrs)e.setAttribute(k,attrs[k]);return e;}
function ocls(o){return o<0?'on':'o'+o;}
function lerp(a,b,u){return a+(b-a)*u;}
function eo(u){u=Math.max(0,Math.min(1,u));return 1-(1-u)*(1-u);}
function lerpP(a,b,u){return[lerp(a[0],b[0],u),lerp(a[1],b[1],u)];}

function buildBattle(b,sp){
  var S=ctr(b.from),T=ctr(b.to);
  var base=Math.atan2(S[1]-T[1],S[0]-T[0]);
  var na=Math.max(1,Math.min(8,b.A)),nd=b.D>0?Math.max(1,Math.min(8,b.D)):0;
  var laV=0,ldV=0;
  if(nd){
    laV=Math.round(b.lossA*na/Math.max(1,b.A));
    if(b.lossA>0&&laV<1)laV=1;
    laV=b.win?Math.min(laV,na-1):Math.min(laV,na);
    ldV=b.win?nd:Math.min(Math.round(b.lossD*nd/Math.max(1,b.D)),nd-1);
    if(!b.win&&b.lossD>0&&ldV<1&&nd>1)ldV=1;
  }
  var fly=(b.move?520:430)*sp,gap=(b.move?50:46)*sp,out=[],i,j;
  var layer=$('fx'),g=sEl('g',{});layer.appendChild(g);
  var bt={g:g,att:[],def:[],sparks:[],dur:0,rings:[],vs:null,b:b,sp:sp,T:T,S:S,played:0};
  var ns=na-laV;
  for(i=0;i<na;i++){
    var ang=base+(i-(na-1)/2)*0.5,rad=nd?17:3;
    var cp=[T[0]+Math.cos(ang)*rad,T[1]+Math.sin(ang)*rad];
    var fa=(i-(ns-1)/2),dies=i<laV;
    var fin=[T[0]+Math.cos(i*2.4)*(ns>1?6:0),T[1]+Math.sin(i*2.4)*(ns>1?6:0)];
    var tr=sEl('line',{class:'fxtrail '+ocls(b.by),opacity:0});g.appendChild(tr);
    var el=sEl('circle',{r:4.4,class:'fxdot '+ocls(b.by),opacity:0});g.appendChild(el);
    bt.att.push({el:el,tr:tr,ls:i*gap,tc:i*gap+fly,s:[S[0]+(Math.random()-0.5)*6,S[1]+(Math.random()-0.5)*6],cp:cp,fin:fin,dies:dies,arc:(i%2?1:-1)*(5+Math.random()*7),lose:!b.win});
  }
  for(j=0;j<nd;j++){
    var pi=bt.att[j%na],ad=base+(j-(nd-1)/2)*0.6+3.14159,hp=[T[0]+Math.cos(ad)*(nd>1?7:0),T[1]+Math.sin(ad)*(nd>1?7:0)];
    var del=sEl('circle',{r:4.4,class:'fxdot '+ocls(b.prev),opacity:0});g.appendChild(del);
    var mid=lerpP(hp,pi.cp,0.55);
    bt.def.push({el:del,hp:hp,mid:mid,tc:pi.tc,dies:j<ldV,ph:Math.random()*6});
  }
  var first=1e9,last=0;
  bt.att.forEach(function(a){first=Math.min(first,a.tc);last=Math.max(last,a.tc);});
  if(nd){
    bt.att.forEach(function(a,k){
      var d=bt.def[k%bt.def.length];
      var mp=lerpP(a.cp,d.hp,0.5),lines=[];
      for(var q=0;q<8;q++){
        var an=Math.random()*6.283,ln=sEl('line',{class:'fxspark',x1:mp[0],y1:mp[1],x2:mp[0],y2:mp[1],opacity:0});g.appendChild(ln);
        lines.push({el:ln,an:an,len:10+Math.random()*10});
      }
      var fl=sEl('circle',{class:'fxflash',cx:mp[0],cy:mp[1],r:3,opacity:0});g.appendChild(fl);
      bt.sparks.push({t:a.tc,mp:mp,lines:lines,fl:fl,played:false});
    });
    var vs=sEl('text',{class:'fxvs',x:T[0],y:T[1]-26,opacity:0});
    vs.textContent=b.A+' : '+b.D;g.appendChild(vs);bt.vs=vs;bt.vsAt=first-80*sp;
  }
  bt.first=first;
  bt.settle=last+300*sp;
  bt.dur=last+(nd?300:200)*sp+380*sp+(b.move?0:260*sp);
  var ring=sEl('circle',{class:'fxring '+(b.win?'win ':'lose ')+ocls(b.win?b.by:b.prev),cx:T[0],cy:T[1],r:8,opacity:0});g.appendChild(ring);
  bt.ring={el:ring,t:bt.settle-60*sp};
  return bt;
}
function frameBattle(bt,t){
  var sp=bt.sp,b=bt.b;
  bt.att.forEach(function(a){
    var el=a.el,x,y,op=1,u;
    if(t<a.ls){op=0;x=a.s[0];y=a.s[1];}
    else if(t<a.tc){
      u=(t-a.ls)/(a.tc-a.ls);
      var p=lerpP(a.s,a.cp,eo(u)),dx=a.cp[0]-a.s[0],dy=a.cp[1]-a.s[1],L=Math.sqrt(dx*dx+dy*dy)||1;
      var w=Math.sin(Math.PI*u)*a.arc;
      x=p[0]-dy/L*w;y=p[1]+dx/L*w;op=Math.min(1,(t-a.ls)/70);
    }else{
      var dt=t-a.tc;
      if(a.dies){
        u=dt/(240*sp);x=a.cp[0];y=a.cp[1];op=Math.max(0,1-u);
        el.style.fill=u<1?'var(--danger)':'';el.setAttribute('r',(4.4+u*2.2).toFixed(2));
      }else if(!a.lose){
        u=eo((dt-140*sp)/(300*sp));var p2=lerpP(a.cp,a.fin,u);x=p2[0];y=p2[1];
      }else{
        u=Math.max(0,(dt-160*sp)/(380*sp));var p3=lerpP(a.cp,a.s,eo(u));x=p3[0];y=p3[1];op=1-Math.min(1,u)*0.95;
      }
    }
    el.setAttribute('cx',x.toFixed(1));el.setAttribute('cy',y.toFixed(1));el.setAttribute('opacity',op.toFixed(2));
    if(t>a.ls&&t<a.tc){
      var u0=Math.max(0,(t-a.ls-80*sp)/(a.tc-a.ls)),pp=lerpP(a.s,a.cp,eo(u0));
      a.tr.setAttribute('x1',pp[0].toFixed(1));a.tr.setAttribute('y1',pp[1].toFixed(1));a.tr.setAttribute('x2',x.toFixed(1));a.tr.setAttribute('y2',y.toFixed(1));a.tr.setAttribute('opacity',0.55);
    }else a.tr.setAttribute('opacity',0);
  });
  bt.def.forEach(function(d){
    var el=d.el,x,y,op=Math.min(1,t/160),r=4.4;
    var lunge=d.tc-130*sp;
    if(t<lunge){x=d.hp[0]+Math.sin(t/80+d.ph)*0.9;y=d.hp[1]+Math.cos(t/90+d.ph)*0.9;}
    else if(t<d.tc){var u=eo((t-lunge)/(130*sp));var p=lerpP(d.hp,d.mid,u);x=p[0];y=p[1];}
    else{
      var dt=t-d.tc;
      if(d.dies){
        var u2=dt/(240*sp);x=d.mid[0];y=d.mid[1];op=Math.max(0,1-u2);
        el.style.fill=u2<1?'var(--danger)':'';r=4.4+u2*2.2;
      }else{
        var u3=eo(dt/(260*sp));var p4=lerpP(d.mid,d.hp,u3);x=p4[0];y=p4[1];
        if(b.win===false)r=4.4+Math.max(0,Math.sin(Math.max(0,t-bt.settle)/90))*0.7;
      }
    }
    el.setAttribute('cx',x.toFixed(1));el.setAttribute('cy',y.toFixed(1));el.setAttribute('opacity',op.toFixed(2));el.setAttribute('r',r.toFixed(2));
  });
  bt.sparks.forEach(function(s){
    var u=(t-s.t)/(280*sp);
    if(u>=0&&!s.played){s.played=true;bt.played++;if(bt.played<=4)sfx('hit');if(bt.played===1&&bt.b.A>=3){var w=$('mapwrap');w.classList.remove('jolt');void w.offsetWidth;w.classList.add('jolt');}}
    if(s.fl){if(u>=0&&u<=0.7){s.fl.setAttribute('r',(3+u*16).toFixed(1));s.fl.setAttribute('opacity',(0.85*(1-u/0.7)).toFixed(2));}else s.fl.setAttribute('opacity',0);}
    s.lines.forEach(function(l){
      if(u<0||u>1){l.el.setAttribute('opacity',0);return;}
      var r1=l.len*0.3+u*l.len,r0=u*l.len*0.5;
      l.el.setAttribute('x1',(s.mp[0]+Math.cos(l.an)*r0).toFixed(1));l.el.setAttribute('y1',(s.mp[1]+Math.sin(l.an)*r0).toFixed(1));
      l.el.setAttribute('x2',(s.mp[0]+Math.cos(l.an)*r1).toFixed(1));l.el.setAttribute('y2',(s.mp[1]+Math.sin(l.an)*r1).toFixed(1));
      l.el.setAttribute('opacity',(1-u).toFixed(2));
    });
  });
  if(bt.vs){
    var uv=(t-bt.vsAt)/(900*sp);
    bt.vs.setAttribute('opacity',uv<0||uv>1?0:Math.min(1,uv*6,(1-uv)*2.5).toFixed(2));
    bt.vs.setAttribute('y',(bt.T[1]-26-Math.max(0,uv)*6).toFixed(1));
  }
  var ru=(t-bt.ring.t)/(480*sp);
  if(ru>=0&&ru<=1){
    bt.ring.el.setAttribute('r',(8+eo(ru)*(b.win?30:18)).toFixed(1));
    bt.ring.el.setAttribute('opacity',(0.9*(1-ru)).toFixed(2));
  }else bt.ring.el.setAttribute('opacity',0);
}
function stopAnim(){
  if(anim.raf)cancelAnimationFrame(anim.raf);
  anim.raf=0;
  var layer=$('fx');if(layer)layer.innerHTML='';
  anim.cur=null;
}
function playBattles(list,opts,done){
  finishAnim(true);
  var q=list.slice(0,opts&&opts.max||4),sp=((opts&&opts.fast)?0.72:1)*((set.speed>1)?0.6:1);
  anim.done=done;
  var idx=0;
  function next(){
    if(idx>=q.length){var d=anim.done;anim.done=null;stopAnim();if(d)d();return;}
    var b=q[idx++],bt=buildBattle(b,sp),t0=null;
    anim.cur=bt;
    function frame(ts){
      if(anim.cur!==bt)return;
      if(t0===null)t0=ts;
      var t=ts-t0;
      frameBattle(bt,t);
      if(t>=bt.dur){
        if(bt.g.parentNode)bt.g.parentNode.removeChild(bt.g);
        anim.cur=null;next();
      }else anim.raf=requestAnimationFrame(frame);
    }
    anim.raf=requestAnimationFrame(frame);
  }
  next();
}
function finishAnim(silent){
  if(!anim.cur&&!anim.done)return;
  var d=anim.done;anim.done=null;stopAnim();
  if(d&&!silent)d();
}
