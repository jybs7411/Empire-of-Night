#!/usr/bin/env node
/* 밸런스·외교 점검용 헤드리스 시뮬레이터 (브라우저 없이 규칙만 돌린다)
   사용: node scripts/sim.js [판수=40] [봇=aggr|peace|idle] */
var fs=require('fs'),path=require('path'),vm=require('vm');
var root=path.join(__dirname,'..');
var ctx={console:console,Math:Math,JSON:JSON,Object:Object,Array:Array,Date:Date};
ctx.window=ctx;ctx.document={getElementById:function(){return null;}};
vm.createContext(ctx);
['01-core.js','01a-diplomacy.js','02-map-gen.js'].forEach(function(f){
  vm.runInContext(fs.readFileSync(path.join(root,'js',f),'utf8'),ctx,{filename:f});
});
var N=+process.argv[2]||40,BOT=process.argv[3]||'aggr';
var R=vm.runInContext('(function(seed,bot){\n'+
'var s=newGame(seed,seed,420),ev={ally:0,betray:0,truce:0,offers:0,strike:0,defect:0,drop:0,cool:0,gift:0,discord:0,accept:0};\n'+
'var guard=0;\n'+
'function decide(){\n'+
'  if(!s.pend)return;\n'+
'  var p=s.pend;\n'+
'  if(p.type==="rule")actRule(s,p.opts[0]);\n'+
'  else{ev.offers+=(p.type==="offer")?1:0;var e=evOf(p,s),ci=0;if(p.type==="offer")ev.accept++;for(var i=0;i<e.choices.length;i++){if(!(e.choices[i].cost&&s.money<e.choices[i].cost)){ci=i;break;}}actScene(s,ci);}\n'+
'}\n'+
'while(!s.over&&guard++<80){\n'+
'  decide();\n'+
'  if(bot!=="idle"){\n'+
'    for(var k=0;k<AP_MAX&&!s.over&&!s.pend;k++){\n'+
'      var done=false;\n'+
'      if(bot==="peace"){\n'+
'        for(var r=1;r<=3&&!done;r++){if(s.dead[r]||s.ap<1)continue;var pk=pactKind(s,r,0);\n'+
'          if(!pk&&s.money>=proposalCost(s,"truce")+5&&s.refused[r]===0){var q=actPropose(s,r,"truce");if(q.ok){done=true;ev.truce++;}}\n'+
'          else if(pk==="truce"&&s.money>=proposalCost(s,"ally")+5&&s.refused[r]===0){var q2=actPropose(s,r,"ally");if(q2.ok){done=true;}}\n'+
'        }\n'+
'      }\n'+
'      if(done)continue;\n'+
'      var best=null;\n'+
'      owned(s,0).forEach(function(t){if(t.men<2)return;ADJ[t.id].forEach(function(j){var v=s.tiles[j];if(v.owner===0)return;if(v.owner>=1&&hasPact(s,0,v.owner))return;var m=(t.men-1)-v.men*1.15*dfac(j);if(bot==="peace"&&v.owner>=1)return;if(m>1&&(!best||m>best.m))best={f:t.id,t:j,m:m};});});\n'+
'      if(best){actMove(s,best.f,best.t,"all");continue;}\n'+
'      var weak=owned(s,0).filter(function(t){return t.men<t.cap;}).sort(function(a,b){return a.men-b.men;})[0];\n'+
'      if(weak&&s.money>=5)actRecruit(s,weak.id);else actLie(s);\n'+
'    }\n'+
'  }\n'+
'  var before=s.pacts.map(function(p){return p.a+"-"+p.b+p.k;}).join(",");\n'+
'  var nl=s.log.length;\n'+
'  endNight(s);\n'+
'  s.log.slice(nl).forEach(function(l){\n'+
'    if(/배신!/.test(l.text))ev.betray++;\n'+
'    if(/돌아섰다/.test(l.text))ev.defect++;\n'+
'    if(/손을 잡았다|급히 동맹/.test(l.text))ev.ally++;\n'+
'    if(/휴전했다/.test(l.text))ev.truce++;\n'+
'    if(/연합군/.test(l.text))ev.strike++;\n'+
'    if(/틀어졌다|흐지부지/.test(l.text))ev.drop++;\n'+
'  });\n'+
'}\n'+
'var live=[1,2,3].filter(function(r){return!s.dead[r];}).length;\n'+
'return{over:s.over&&s.over.type,cause:s.over&&s.over.cause,day:s.day,land:owned(s,0).length,pacts:s.pacts.length,st:{made:s.stats.pactsMade,allies:s.stats.alliesFormed,broken:s.stats.pactBroken,betrayedBy:s.stats.betrayedBy},ev:ev,live:live,money:s.money,heat:Math.round(s.heat),dread:Math.round(s.dread),sample:s.news.slice(-3).map(function(n){return n.day+":"+n.text;})};\n'+
'})',ctx);
var tot={},res={};
for(var i=0;i<N;i++){
  var r=R(1000+i*37,BOT);
  var k=r.over+(r.cause?'/'+r.cause:'');res[k]=(res[k]||0)+1;
  Object.keys(r.ev).forEach(function(e){tot[e]=(tot[e]||0)+r.ev[e];});Object.keys(r.st).forEach(function(e){tot['st.'+e]=(tot['st.'+e]||0)+r.st[e];});
  if(i<2)console.log(JSON.stringify(r,null,1));
}
console.log('결과',res);
console.log('판당 평균',Object.keys(tot).map(function(e){return e+':'+(tot[e]/N).toFixed(2);}).join('  '));
