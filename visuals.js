/* Ilustraciones SVG de la v02 (representación ilustrativa, no cinematografía final). */
window.SSOVisual=(()=>{
const tag=t=>`<span class="scene-tag">${t}</span>`;
const forest=(mode,label)=>window.RodalVisual(mode||'forest',{}).replace(/<span class="scene-tag">[^<]*<\/span>/,label?tag(label):'');

/* Slide 01: base operativa al amanecer, camión de combate y brigada equipándose */
function base(hud){
 const crew=[0,1,2,3].map(i=>`<g transform="translate(${470+i*48} ${352-(i%2)*6})"><g class="crew" style="--d:${i*.4}s"><circle r="9" cy="-52" fill="#e7c34f"/><rect x="-10" y="-44" width="20" height="34" rx="6" fill="#c8592f"/><rect x="-9" y="-12" width="7" height="22" fill="#3b3a2e"/><rect x="2" y="-12" width="7" height="22" fill="#3b3a2e"/><rect x="-14" y="-40" width="6" height="22" rx="3" fill="#a7462a"/></g></g>`).join('');
 const truck=`<g transform="translate(70 290)"><rect x="0" y="20" width="250" height="78" rx="6" fill="url(#red)"/><rect x="250" y="38" width="88" height="60" rx="8" fill="#b8473a"/><path d="M262 44h52l16 26h-68Z" fill="url(#glass)"/><rect x="12" y="32" width="120" height="30" rx="4" fill="#d7c39a" opacity=".85"/><rect x="146" y="32" width="92" height="12" rx="3" fill="#f4e7c3" opacity=".6"/><circle cx="62" cy="104" r="20" fill="#232622"/><circle cx="62" cy="104" r="8" fill="#8b8d7c"/><circle cx="282" cy="104" r="20" fill="#232622"/><circle cx="282" cy="104" r="8" fill="#8b8d7c"/><rect x="290" y="28" width="28" height="9" rx="3" fill="#f0b044" class="beacon"/></g>`;
 return `<div class="visual-wrap dawn">${forest('forest','BASE OPERATIVA · AMANECER').replace('</svg>',truck+crew+'</svg>')}<div class="hud-panel"><small>HUD · DESPLIEGUE</small><b>${hud}</b></div></div>`;
}

/* Slide 02: mapa holográfico con tres factores */
function holomap(){
 let contours='';for(let i=0;i<9;i++)contours+=`<ellipse cx="${300+i*6}" cy="${215-i*4}" rx="${250-i*26}" ry="${120-i*12}" fill="none" stroke="#7ff0d4" stroke-opacity="${.18+i*.06}" stroke-width="1.3"/>`;
 let trees='';for(let i=0;i<26;i++){const x=470+(i%7)*30+(i>13?12:0),y=250+Math.floor(i/7)*24;trees+=`<path d="M${x} ${y}l9 -22 9 22Z" fill="#8ff0b8" opacity=".55"/>`}
 const hot=(x,y,label,icon,k)=>`<g transform="translate(${x} ${y})"><g class="hotspot" style="--d:${k*.5}s"><circle r="30" fill="#0c2a2a" stroke="#ffe38a" stroke-width="2"/><circle r="38" fill="none" stroke="#ffe38a" class="ping"/>${icon}<text y="56" text-anchor="middle" fill="#ffe8a6" font-size="15" letter-spacing="2">${label}</text></g></g>`;
 const mount='<path d="M-16 10 -4 -12 4 0 9 -6 18 10Z" fill="#ffe38a"/>',wind='<path d="M-16 -6h20a6 6 0 1 0-6-6M-16 2h26a6 6 0 1 1-6 6M-16 10h14" stroke="#ffe38a" stroke-width="3" fill="none" stroke-linecap="round"/>',fuel='<path d="M-14 12-5-12 4 12ZM0 12 9-8 18 12Z" fill="#ffe38a"/>';
 return `<div class="scene-view holo"><svg viewBox="0 0 800 460" role="img" aria-label="Mapa holográfico del valle forestal con tres factores de peligro destacados"><defs><radialGradient id="holo"><stop stop-color="#1f5a55"/><stop offset="1" stop-color="#0b1d1f"/></radialGradient></defs><rect width="800" height="460" fill="url(#holo)"/><path d="M0 400 Q400 340 800 400 V460 H0Z" fill="#4a3c2c"/><g class="holo-grid" stroke="#7ff0d4" stroke-opacity=".12">${Array.from({length:17},(_,i)=>`<path d="M${i*50} 0v380"/>`).join('')}${Array.from({length:8},(_,i)=>`<path d="M0 ${i*50}h800"/>`).join('')}</g>${contours}<path d="M80 330 Q300 250 520 300 T780 290" stroke="#7ff0d4" stroke-dasharray="6 6" fill="none" stroke-opacity=".5"/>${trees}<g class="windlines" stroke="#c9fff1" stroke-opacity=".6" stroke-width="2" fill="none"><path d="M560 90q30-10 60 0t60 0"/><path d="M580 120q30-10 60 0t60 0"/></g>${hot(300,170,'TOPOGRAFÍA',mount,0)}${hot(640,100,'METEOROLOGÍA',wind,1)}${hot(590,335,'COMBUSTIBLE',fuel,2)}</svg>${tag('MAPA HOLOGRÁFICO 3D · VALLE FORESTAL')}</div>`;
}

/* Slide 06: brigadista con fatiga + telemetría */
function fatigue(alert){
 const tired=`<g transform="translate(560 380)"><path d="M-40 6 40 -150" stroke="#6d5a3a" stroke-width="7"/><circle cx="0" cy="-118" r="16" fill="#e7c34f"/><path d="M-14 -100c-6 30-8 60-4 92h30c2-32 0-62-8-92Z" fill="#c8592f"/><path d="M8 -96 22 -128" stroke="#c8592f" stroke-width="10" stroke-linecap="round"/><g class="dizzy" fill="none" stroke="#fff3c4" stroke-width="2"><path d="M-20-150q8-8 16 0t16 0"/><path d="M-12-162q8-8 16 0t16 0"/></g></g>`;
 const gully='<path d="M120 460 Q170 330 230 300 Q290 330 330 460Z" fill="#3a2a1e" opacity=".85"/><path d="M180 460 Q210 360 232 320 Q256 360 270 460" fill="#21170f" opacity=".8"/>';
 return `<div class="visual-wrap smoky">${forest('forest','SECTOR DEL INCENDIO · CÁRCAVAS').replace('</svg>',gully+tired+'</svg>')}<div class="fire-layer"><div class="smoke"></div></div><div class="telemetry" role="status"><span class="blink">●</span> ${alert}</div></div>`;
}

/* Ladera: base para slides 10, 12 y 13 */
function slope(state){
 // state: 'context' | 'ok' | 'ko-rock' | 'ko-wire'
 const upper=[0,1,2].map(i=>`<g transform="translate(${470+i*34} ${120+i*16})"><circle r="7" cy="-26" fill="#e7c34f"/><rect x="-7" y="-20" width="14" height="22" rx="4" fill="#4f6fb0"/></g>`).join('');
 const ours=state==='ok'?[0,1,2,3].map(i=>`<g transform="translate(${170+i*60} ${330-i*28})"><g class="walker" style="--d:${i*.35}s"><circle r="7" cy="-26" fill="#e7c34f"/><rect x="-7" y="-20" width="14" height="22" rx="4" fill="#c8592f"/></g></g>`).join(''):[0,1,2,3].map(i=>`<g transform="translate(${505+(i%2)*14} ${250+i*34})"><circle r="7" cy="-26" fill="#e7c34f"/><rect x="-7" y="-20" width="14" height="22" rx="4" fill="#c8592f"/></g>`).join('');
 const fence='<g stroke="#d8d1b8" stroke-width="2">'+[0,1,2,3,4,5,6,7].map(i=>`<path d="M${120+i*80} 392v-40" stroke="#6f5a3e" stroke-width="6"/>`).join('')+'<path d="M110 362 L700 362M110 374 L700 374M110 386 L700 386" stroke-dasharray="3 5 1 5"/></g>';
 const diag=state==='ok'?'<path d="M140 350 L420 210" stroke="#9fe27a" stroke-width="5" stroke-dasharray="10 8" fill="none"/><text x="250" y="258" fill="#d9ffc4" font-size="14" transform="rotate(-27 250 258)">AVANCE EN DIAGONAL</text>':'';
 const vert=state&&state.startsWith('ko')||state==='context'?'<path d="M512 110 V350" stroke="#ff9d7a" stroke-width="3" stroke-dasharray="6 6" opacity=".8"/>':'';
 const rock=state==='ok'?'<circle class="rock pass" cx="560" cy="110" r="13" fill="#7a7466"/>':state==='ko-rock'||state==='ko'?'<circle class="rock hit" cx="512" cy="110" r="14" fill="#7a7466"/><g class="impact"><circle cx="512" cy="250" r="34" fill="none" stroke="#ff4d3a" stroke-width="4"/></g>':'';
 const wire=state==='ko-wire'||state==='ko'?'<g class="whip"><path d="M380 374 q30 -60 70 -20" stroke="#ffcf9e" stroke-width="3" fill="none"/><text x="390" y="320" fill="#ffd7c4" font-size="13">LATIGAZO</text></g>':state==='ok'?'<g><path d="M340 362 q20 18 40 0" stroke="#9fe27a" stroke-width="4" fill="none"/><text x="300" y="420" fill="#d9ffc4" font-size="13">PASO COOPERATIVO · TENSAR CON GUANTES</text></g>':'';
 const fire='<g class="lat-fire">'+[0,1,2].map(i=>`<path d="M${40+i*26} ${250+i*22} q12 -40 24 0 q-12 14 -24 0Z" fill="#ff8a2a" opacity=".85"/>`).join('')+'</g>';
 return `<div class="scene-view ladera ${state}"><svg viewBox="0 0 800 460" role="img" aria-label="Ladera escarpada con brigada superior, alambrada inferior y fuego lateral"><defs><linearGradient id="sl" x2=".3" y2="1"><stop stop-color="#8f9b72"/><stop offset="1" stop-color="#4f4632"/></linearGradient></defs><rect width="800" height="460" fill="#b9c3b0"/><path d="M0 460 L0 420 L760 70 L800 60 V460Z" fill="url(#sl)"/>${Array.from({length:22},(_,i)=>`<path d="M${60+i*32} ${410-i*15}l7-26 7 26Z" fill="#32523f" opacity=".7"/>`).join('')}${fire}${diag}${vert}${upper}${ours}${rock}${fence}${wire}<text x="470" y="80" fill="#2e3b55" font-size="13">BRIGADA SUPERIOR · CORTE</text></svg>${tag('LADERA ESCARPADA · ALTA PENDIENTE')}</div>`;
}

/* Slide 09: esquema de peligro según tarjeta */
function hazard(choice){
 if(choice==='C')return `<div class="scene-view schematic"><svg viewBox="0 0 800 460" role="img" aria-label="Esquema de peligro de impacto por aproximación no autorizada a un helicóptero"><rect width="800" height="460" fill="#2a1414"/><g class="rotor"><path d="M250 150h300" stroke="#ffd2c4" stroke-width="6"/></g><path d="M320 170h150q50 0 60 40l-10 30H330q-30 0-30-30Z" fill="#7b2c24" stroke="#ffb59f" stroke-width="2"/><path d="M530 205h120" stroke="#ffb59f" stroke-width="6"/><circle cx="400" cy="230" r="150" fill="none" stroke="#ff4d3a" stroke-width="3" stroke-dasharray="10 8" class="pulse-ring"/><g transform="translate(150 380)"><circle r="9" cy="-36" fill="#e7c34f"/><rect x="-9" y="-28" width="18" height="30" rx="5" fill="#c8592f"/></g><text x="400" y="420" fill="#ffd0c4" font-size="18" text-anchor="middle" letter-spacing="2">ZONA DE HELICÓPTERO · SIN AUTORIZACIÓN DEL PILOTO</text></svg>${tag('PELIGRO DE IMPACTO')}</div>`;
 return `<div class="scene-view schematic"><svg viewBox="0 0 800 460" role="img" aria-label="Esquema de peligro de atrapamiento en una cárcava"><rect width="800" height="460" fill="#2a1414"/><path d="M0 200 H260 Q330 210 360 420 H440 Q470 210 540 200 H800 V460 H0Z" fill="#5a3324"/><path d="M360 420 Q400 300 440 420Z" fill="#1a0d08"/><g class="flames-in">${[0,1,2,3].map(i=>`<path d="M${330+i*40} 260 q18 -60 36 0 q-18 20 -36 0Z" fill="#ff7a2a"/>`).join('')}</g><g transform="translate(400 380)"><circle r="9" cy="-36" fill="#e7c34f"/><rect x="-9" y="-28" width="18" height="30" rx="5" fill="#c8592f"/></g><path d="M300 150 L400 340 L500 150" stroke="#ff4d3a" stroke-width="3" fill="none" stroke-dasharray="8 6"/><text x="400" y="110" fill="#ffd0c4" font-size="18" text-anchor="middle" letter-spacing="2">CÁRCAVA PROFUNDA · RIESGO DE ATRAPAMIENTO</text></svg>${tag('PELIGRO DE ATRAPAMIENTO')}</div>`;
}

/* Slide 08: hidratación y ruta segura */
function safeEntry(){
 const drink=`<g transform="translate(150 380)"><circle cx="0" cy="-118" r="16" fill="#e7c34f"/><path d="M-14 -100c-6 30-8 60-4 92h30c2-32 0-62-8-92Z" fill="#c8592f"/><rect x="14" y="-136" width="14" height="30" rx="4" fill="#7fc6ff" transform="rotate(-35 14 -136)"/><text x="40" y="-140" fill="#e9fbff" font-size="16">500 ml</text></g>`;
 const route='<path d="M300 460 Q360 360 420 300 T560 240" stroke="#9fe27a" stroke-width="6" stroke-dasharray="12 10" fill="none" class="route"/>'+[0,1,2].map(i=>`<g transform="translate(${360+i*55} ${380-i*45})"><g class="walker" style="--d:${i*.4}s"><circle r="8" cy="-28" fill="#e7c34f"/><rect x="-8" y="-21" width="16" height="24" rx="4" fill="#c8592f"/></g></g>`).join('');
 return `<div class="visual-wrap">${forest('forest','RUTA DEMARCADA SEGURA').replace('</svg>',drink+route+'</svg>')}</div>`;
}

return {base,holomap,fatigue,slope,hazard,safeEntry};
})();
