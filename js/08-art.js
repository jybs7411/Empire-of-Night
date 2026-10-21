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
  c3:'<path d="M12 3.5v16.5M7.5 20h9"/><path d="M4 7.5h16"/><path d="M4 7.5L1.8 13.2a3 3 0 0 0 4.4 0z"/><path d="M20 7.5l-2.2 5.7a3 3 0 0 0 4.4 0z"/><circle cx="12" cy="4.4" r="1.1"/>'
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
