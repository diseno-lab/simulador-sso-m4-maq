(()=>{'use strict';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],KEY=(window.MODULE||{}).key||'simulador-sso',SC=window.SCENES,V=window.SSOVisual,N=SC.length;
const byId=id=>SC[id-1];
/* ---------- SCORM 1.2 ---------- */
let api=null;try{let w=window;for(let i=0;i<12;i++){if(w.API){api=w.API;break}if(w.parent===w)break;w=w.parent}if(!api)api=window.opener?.API;if(api&&String(api.LMSInitialize(''))!=='true')api=null}catch{api=null}
const fresh=()=>({version:2,page:1,unlocked:[1],reviewed:[],answers:{},attempts:{},choice:{},result:{},finished:false});
let s=fresh(),prior=null;
try{const raw=api?api.LMSGetValue('cmi.suspend_data'):localStorage.getItem(KEY);if(raw){const p=JSON.parse(raw);if(p.version===2&&byId(p.page))prior=p}}catch{}
const started=Date.now();let active=false,finishCalled=false;
const score=()=>Math.round(Object.values(s.result).filter(r=>r==='first'||r==='second').length/3*100);
function save(){if(!active)return;try{if(api){api.LMSSetValue('cmi.suspend_data',JSON.stringify(s));api.LMSSetValue('cmi.core.lesson_location',String(s.page));api.LMSSetValue('cmi.core.score.min','0');api.LMSSetValue('cmi.core.score.max','100');api.LMSSetValue('cmi.core.score.raw',String(score()));api.LMSSetValue('cmi.core.lesson_status',s.finished?'completed':'incomplete');api.LMSSetValue('cmi.core.exit',s.finished?'':'suspend');const t=Math.floor((Date.now()-started)/1000);api.LMSSetValue('cmi.core.session_time',`${String(Math.floor(t/3600)).padStart(2,'0')}:${String(Math.floor(t/60)%60).padStart(2,'0')}:${String(t%60).padStart(2,'0')}.00`);api.LMSCommit('')}else localStorage.setItem(KEY,JSON.stringify(s))}catch{}}
const add=(a,x)=>{if(!a.includes(x))a.push(x)};
const cur=()=>byId(s.page);
/* ---------- Audio: voz sintética, SFX generados ---------- */
let utter=null,voiceRun=0,paused=false,actx=null;
const PKEY=KEY+'-prefs';const P0={voiceLevel:100,ambientLevel:100,effectsLevel:60,muted:false,ambient:false,effectsMuted:false,cc:false,ccSize:13,light:false,reducedMotion:false};
let prefs={...P0};try{prefs={...P0,...JSON.parse(localStorage.getItem(PKEY)||'{}')}}catch{}
const savePrefs=()=>{try{localStorage.setItem(PKEY,JSON.stringify(prefs))}catch{}};
const fxVol=()=>prefs.effectsMuted?0:prefs.effectsLevel/100;
const anyDialog=()=>!!document.querySelector('dialog[open]');
function tone(f,d,type='sine',v=.06){v*=fxVol()*1.6;if(v<=0)return;try{actx=actx||new (window.AudioContext||window.webkitAudioContext)();const o=actx.createOscillator(),g=actx.createGain();o.type=type;o.frequency.value=f;g.gain.value=v;g.gain.exponentialRampToValueAtTime(.0001,actx.currentTime+d);o.connect(g).connect(actx.destination);o.start();o.stop(actx.currentTime+d)}catch{}}
const sfx={snap:()=>{tone(880,.08,'square',.04);setTimeout(()=>tone(1320,.06,'square',.03),40)},tick:()=>tone(1000,.05,'square',.03),urgent:()=>tone(1400,.07,'square',.05),pulse:()=>tone(220,.25,'sine',.05),ok:()=>playFx('audio/correct-v120.mp3'),ko:()=>playFx('audio/incorrect-v120.mp3')};function playFx(src){const v=fxVol();if(!v)return;const a=new Audio(src);a.volume=Math.min(1,v*1.3);a.play().catch(()=>{})};
function voiceText(){const c=cur();return c.type==='ko'&&attemptOf(c)>=2?(c.voice2||''):c.voice}
const narrator=new Audio();narrator.preload='auto';
function voiceKey(){const c=cur();return 's'+String(c.id).padStart(2,'0')+(c.type==='ko'&&attemptOf(c)>=2?'b':'')}
function vPause(){if(utter===narrator)narrator.pause();else window.speechSynthesis?.pause()}
function vResume(){if(utter===narrator)narrator.play().catch(()=>{});else window.speechSynthesis?.resume()}
function pickVoice(vs){const es=vs.filter(v=>/^es/i.test(v.lang)),loc=es.filter(v=>v.localService);return loc.find(v=>/^es-(CL|419|MX|US)/i.test(v.lang))||loc[0]||es.find(v=>/^es-CL/i.test(v.lang))||es[0]}
function voiceStop(){voiceRun++;window.speechSynthesis?.cancel();narrator.pause();narrator.onended=null;utter=null;paused=false}
function speak(){voiceStop();if(!active)return;const id=voiceRun,text=voiceText();$('#captions').textContent=text;if(!text){controls();return}
 const file=(window.VOICE_FILES||{})[voiceKey()];
 if(file&&!prefs.muted){utter=narrator;narrator.src=file;narrator.volume=prefs.voiceLevel/100;narrator.onended=()=>{if(id===voiceRun){utter=null;voiceEnded()}};narrator.play().catch(()=>{if(id===voiceRun){utter=null;controls()}});controls();return}
 if(file&&prefs.muted)return;const synth=window.speechSynthesis,vs=synth?.getVoices()||[];if(synth&&!vs.length&&!speak._waited){speak._waited=true;synth.addEventListener('voiceschanged',()=>{if(active&&!utter)speak()},{once:true});setTimeout(()=>{if(active&&!utter)speak()},700);return}const es=pickVoice(vs);const note=$('#voice-note');if(!synth||!es||prefs.muted){if(note)note.textContent=prefs.muted?'Voz silenciada. Lee el mensaje en pantalla.':'Sin voz española en este navegador. Lee el mensaje en pantalla.';return}utter=new SpeechSynthesisUtterance(text);utter.lang=es.lang;utter.voice=es;utter.rate=1;utter.volume=prefs.voiceLevel/100;utter.onend=()=>{if(id===voiceRun){utter=null;voiceEnded()}};synth.speak(utter);controls()}
function voiceEnded(){const c=cur();if(c.type==='context'){setTimeout(()=>{if(cur()===c&&!anyDialog())go(c.to)},900)}controls()}
/* ---------- Navegación ---------- */
const attemptOf=c=>s.attempts[c.mech]||0;
let timer=null,timeLeft=0,selected=null;
function stopTimer(){clearInterval(timer);timer=null;document.body.classList.remove('urgent-fx')}
function go(n){if(!byId(n))return;stopTimer();voiceStop();s.page=n;add(s.unlocked,n);selected=null;render();save();$('#stage').focus()}
function forward(){const c=cur();if(c.type==='ko')return attemptOf(c)>=2?c.to2:c.mech;return c.to}
function primary(){const c=cur();add(s.reviewed,c.id);const t=forward();if(t)go(t)}
function controls(){const c=cur(),mech=['dnd','cards','timed','end'].includes(c.type);$('#next').disabled=mech||!forward();$('#prev').disabled=s.page===1||!!timer||c.type==='ok'||c.type==='ko';$('#count').textContent=String(s.page).padStart(2,'0')+'/'+N;$('#status').textContent=s.finished?'Simulación registrada':mech?'Completa la decisión':'Puedes continuar';$('#medals').innerHTML=[1,2,3].map(n=>{const r=s.result[n];const cls=r==='first'||r==='second'?'earned':r==='forced'?'forced':'';return `<span class="medal ${cls}" aria-label="Caso ${n}: ${r==='first'||r==='second'?'superado':r==='forced'?'corrección guiada':'pendiente'}">${cls==='earned'?'★':cls==='forced'?'✓':n}</span>`}).join('');paintPause()}
/* ---------- Render ---------- */
const eyebrow=c=>c.case?`CASO ${c.case} · SLIDE ${String(c.id).padStart(2,'0')}`:`${window.MODULE.eyebrow} · SLIDE ${String(c.id).padStart(2,'0')}`;
function textCol(c,extra=''){const ko2=c.type==='ko'&&attemptOf(c)>=2;const cta=c.type==='ko'?(ko2?c.cta2:c.cta):c.cta;const btn=c.type==='context'?'<button id="primary" class="ghost">Continuar ›</button><p class="note">Avance automático al terminar la locución.</p>':cta&&c.type!=='end'?`<button id="primary" class="big-action ${c.type==='ok'||ko2?'go':''}">${cta}</button>`:'';return `<div class="text"><p class="eyebrow">${eyebrow(c)}</p><h1>${c.title}</h1>${c.stamp?`<p class="result-stamp ok">✓ ${c.stamp}</p>`:''}${c.type==='ko'?`<p class="result-stamp ${c.tone}">${ko2?'EVALUACIÓN NO SUPERADA · CORRECCIÓN GUIADA':'INTENTO 1 DE 2 · REEVALÚA'}</p>`:''}<p class="lead">${voiceText()}</p>${extra}${btn}</div>`}
function dndBoard(c,mode){/* mode: play | review-ko | solved | ok */
 const ans=s.answers[c.id]||{};const sol=mode==='solved'||mode==='ok';
 const inBin=b=>c.tokens.map((t,i)=>[t,i]).filter(([t,i])=>sol?t[1]===b:ans[i]===b);
 const chip=([t,i])=>{const wrong=mode==='review-ko'&&ans[i]!==t[1];const right=sol||(mode==='review-ko'&&!wrong);return `<button class="chip ${wrong?'wrong':''} ${right&&mode!=='play'?'right':''}" data-chip="${i}" ${mode!=='play'?'tabindex="-1"':''} aria-label="${t[0]}${mode==='play'?': pulsa para devolver a la bandeja':''}">${t[0]}${right&&mode!=='play'?' ✓':''}${wrong?' ✕':''}</button>`};
 const tray=mode==='play'?`<div class="tray" role="group" aria-label="Fichas por clasificar">${c.tokens.map((t,i)=>ans[i]===undefined?(c.unlock===i&&c.tokens.some((u,j)=>j!==i&&ans[j]===undefined)?`<button class="token locked-token" disabled aria-disabled="true" title="Se desbloquea al ubicar las otras fichas">🔒 ${t[0]}</button>`:`<button draggable="true" class="token" data-token="${i}" aria-pressed="false">${t[0]}</button>`):'').join('')||'<span class="tray-empty">Todas las fichas están ubicadas.</span>'}</div><p class="legend">${c.legend||'Arrastra una ficha o selecciónala y pulsa la categoría.'} Funciona con ratón, toque o teclado (Tab y Enter).</p>`:'';
 const placed=Object.keys(ans).length;
 const binsHtml=c.bins.map((b,k)=>`<div class="bin ${c.map?'spot':''}" data-bin="${k}" ${c.map?`style="left:${c.binPos[k][0]}%;top:${c.binPos[k][1]}%${c.binColors?';border-color:'+c.binColors[k]:''}"`:''} ${mode==='play'?`role="button" tabindex="0" aria-label="${c.map?'Zona '+b:'Categoría '+b}"`:''}><b>${b}</b><div class="bin-chips">${inBin(k).map(chip).join('')}</div></div>`).join('');
 return `<div class="dnd ${mode} ${c.map?'mapped':''} ${c.unlock!==undefined&&c.tokens.every((u,j)=>j===c.unlock||(s.answers[c.id]||{})[j]!==undefined)?'core-on':''}">${c.map?`<div class="map-board">${V.map(c,mode)}${binsHtml}</div>`:`<div class="bins">${binsHtml}</div>`}${tray}${mode==='play'?`<button class="big-action" id="validate" ${placed!==c.tokens.length?'disabled':''}>${c.validate||'VALIDAR EVALUACIÓN'}</button>`:''}</div>`}
function cardsUI(c,chosen,lock){return `<div class="cards-wrap">${c.cardMap?V.cardMap(c,chosen,lock):''}<div class="cards ${lock?'locked':''} ${c.cardMap?'zone-cards':''}">${c.cards.map(([k,t])=>`<button class="card ${chosen===k?'chosen':''} ${lock&&k===c.correct?'correct':''}" data-card="${k}" ${lock?'disabled':''}><b>${c.cardLabel||'TARJETA'} ${k}</b>${c.cardArt?V.cardArt(c,k):''}<span>${t}</span></button>`).join('')}</div></div>`}
function render(narrate=true){const c=cur();let visual='',extra='';
 switch(c.type){
  case 'intro':case 'context':case 'ok':case 'ko':visual=V.scene(c,{a2:attemptOf(c)>=2,ch:s.choice[c.mech],dnd:dndBoard,cards:cardsUI,m:c.mech?byId(c.mech):null,byId});break;
  case 'dnd':visual=dndBoard(c,'play');break;
  case 'cards':visual=cardsUI(c,null,false);break;
  case 'timed':visual=`<div><div class="countdown" id="countdown" role="timer" aria-live="off">00:${String(c.seconds).padStart(2,'0')}</div>${cardsUI(c,null,false)}</div>`;break;
  case 'end':visual=dashboard(c);break}
 $('#stage').innerHTML=`<section class="scene t-${c.type} case-${c.case}">${textCol(c,extra)}${visual}</section>`;
 $('#primary')&&($('#primary').onclick=primary);
 if(c.type==='dnd')bindDnd(c);
 if(c.type==='cards'||c.type==='timed')$$('[data-card]').forEach(b=>b.onclick=()=>decide(c,b.dataset.card));
 if(c.type==='timed')startTimer(c);
 if(c.type==='ok'){sfx.ok()}
 if(c.type==='ko'){sfx.ko()}
 if(c.type==='end')bindEnd(c);
 if(c.type==='cards')sfx.pulse();
 if(c.whistle&&narrate)setTimeout(()=>{if(cur()===c){tone(2900,.45,'sine',.09);setTimeout(()=>tone(2950,.05,'sine',.02),420)}},2200);
 $('#captions').textContent=voiceText();controls();if(narrate)speak()}
/* ---------- Mecánicas ---------- */
function bindDnd(c){
 $$('[data-token]').forEach(b=>{b.onclick=()=>{selected=Number(b.dataset.token);$$('[data-token]').forEach(x=>{x.classList.toggle('selected',x===b);x.setAttribute('aria-pressed',String(x===b))})};b.ondragstart=e=>{selected=Number(b.dataset.token);e.dataTransfer.setData('text/plain',String(selected))}});
 $$('[data-bin]').forEach(bin=>{const k=Number(bin.dataset.bin);bin.ondragover=e=>{e.preventDefault();bin.classList.add('over')};bin.ondragleave=()=>bin.classList.remove('over');bin.ondrop=e=>{e.preventDefault();const t=Number(e.dataTransfer.getData('text/plain'));place(c,Number.isInteger(t)?t:selected,k)};bin.onclick=()=>place(c,selected,k);bin.onkeydown=e=>{if((e.key==='Enter'||e.key===' ')&&e.target===bin){e.preventDefault();place(c,selected,k)}}});
 $$('[data-chip]').forEach(ch=>ch.onclick=e=>{e.stopPropagation();if(selected!==null){place(c,selected,Number(ch.closest('[data-bin]').dataset.bin));return}const a=s.answers[c.id]||{};delete a[ch.dataset.chip];s.answers[c.id]=a;save();render(false)});
 $('#validate').onclick=()=>{const a=s.answers[c.id]||{};const ok=c.tokens.every((t,i)=>a[i]===t[1]);sfx.pulse();result(c,ok)}}
function place(c,token,bin){if(token===null||!Number.isInteger(token))return;if(c.instant&&c.tokens[token][1]!==bin){selected=null;s.misses=s.misses||{};s.misses[c.id]=(s.misses[c.id]||0)+1;tone(180,.18,'sawtooth',.05);const b=$(`[data-token="${token}"]`);if(b){b.classList.remove('bounce');void b.offsetWidth;b.classList.add('bounce');b.classList.remove('selected');b.setAttribute('aria-pressed','false')}const st=$('#status');if(st)st.textContent='Zona incorrecta: la ficha volvió a su lugar';return}const a=s.answers[c.id]||{};if(c.map)Object.keys(a).forEach(k=>{if(a[k]===bin)delete a[k]});a[token]=bin;s.answers[c.id]=a;selected=null;sfx.snap();save();render(false);const next=$('[data-token]');(next||$('#validate'))?.focus()}
function decide(c,k){stopTimer();s.choice[c.id]=k;sfx.pulse();result(c,k===c.correct)}
function result(c,ok){add(s.reviewed,c.id);s.attempts[c.id]=(s.attempts[c.id]||0)+1;const n=s.attempts[c.id];
 if(ok){s.result[c.case]=n===1?'first':'second';go(c.ok)}
 else{if(n>=2)s.result[c.case]='forced';go(c.ko)}}
/* Reintento del caso 1: las fichas mal ubicadas regresan a la bandeja */
const _go=go;go=function(n){const c=cur();if(c&&c.type==='ko'&&n===c.mech&&byId(n).type==='dnd'){const m=byId(n),a=s.answers[n]||{};if(c.resetAll)s.answers[n]={};else{m.tokens.forEach((t,i)=>{if(a[i]!==t[1])delete a[i]});s.answers[n]=a}}_go(n)};
function startTimer(c){timeLeft=c.seconds*10;const el=$('#countdown');timer=setInterval(()=>{if(anyDialog()||document.hidden)return;timeLeft--;if(timeLeft%10===0){const sec=timeLeft/10;el.textContent='00:'+String(sec).padStart(2,'0');const u=c.urgent||5;el.classList.toggle('urgent',sec<=u);if(c.urgentFx)document.body.classList.toggle('urgent-fx',sec<=u&&sec>0);if(sec>0)(sec<=u?sfx.urgent:sfx.tick)();if(sec<=0){stopTimer();decide(c,'T')}}},100);controls()}
function dashboard(c){const label={close:'Cierre del módulo',first:'Logrado · intento 1',second:'Logrado · intento 2',forced:'Corrección guiada'};return `<div class="tablet"><div class="tablet-head"><small>TABLET TÁCTICA</small><b>${window.MODULE.report}</b></div><ul class="checklist">${c.checklist.map((t,i)=>{const r=i<3?s.result[i+1]:(s.result[1]&&s.result[2]&&s.result[3]?'close':undefined);return `<li class="${r==='forced'?'forced':r?'done':''}"><span>${r==='forced'?'!':'✓'}</span>${i+1}. ${t}<small>${label[r]||'Pendiente'}</small></li>`}).join('')}</ul><div class="score"><strong>${score()}</strong><span>puntaje / 100</span></div>${c.seal?'<div class="seal" aria-label="Sello de evaluación aprobada">✓</div>':''}<button id="finish" class="big-action go">${c.cta}</button><button id="restart" class="ghost">Reiniciar simulación</button>${c.logos?`<div class="logos">${c.logos.map(l=>l.img?`<img src="${l.img}" alt="${l.alt}">`:`<span class="logo-ph" title="Reemplazar por el logo oficial">${l.alt}</span>`).join('')}</div>`:''}</div>`}
function certHtml(){let name='';try{name=api?String(api.LMSGetValue('cmi.core.student_name')||''):''}catch{}if(name.includes(','))name=name.split(',').map(x=>x.trim()).reverse().join(' ');const M=window.MODULE,d=new Date().toLocaleDateString('es-CL',{day:'numeric',month:'long',year:'numeric'});return `<div class="cert"><p class="cert-k">${M.certKicker}</p><h3>${M.certTitle}</h3><p class="cert-name">${name||'<span class="cert-line"></span>'}</p><p>${M.certBody}</p><p class="cert-meta">Puntaje: <b>${score()} / 100</b> · ${d}</p><ul>${byId(N).checklist.map((t,i)=>`<li>${s.result[i+1]==='first'||s.result[i+1]==='second'?'✓':'!'} ${t}</li>`).join('')}</ul></div>`}
function bindEnd(c){$('#finish').onclick=()=>{s.finished=true;add(s.reviewed,c.id);save();controls();if(api&&!finishCalled){finishCalled=true;try{api.LMSCommit('');api.LMSFinish('')}catch{}}
 if(window.MODULE.certTitle){const cert=certHtml();let pc=$('#print-cert');if(!pc){pc=document.createElement('div');pc.id='print-cert';document.body.append(pc)}pc.innerHTML=cert;modal('Simulación registrada',`${cert}<p class="note">${api?'Resultado enviado al LMS. Imprime o guarda el certificado y luego cierra esta ventana para volver al LMS.':'Imprime o guarda el certificado como PDF.'}</p><button id="print-cert-btn" class="big-action go">Imprimir / Guardar PDF</button>`);$('#print-cert-btn').onclick=()=>window.print();return}
 modal('Simulación registrada',api?'<p>Completion y score enviados al LMS. El reproductor se cerrará.</p>':'<p>Resultado guardado en este navegador. Puedes cerrar esta ventana.</p>');if(api)setTimeout(()=>{try{window.top.close()}catch{}window.close()},1500)};$('#restart').onclick=()=>modal('Reiniciar simulación','<p>Se borrará el avance de esta práctica.</p><button id="confirm-reset" class="big-action">Reiniciar desde el inicio</button>')}
/* ---------- Modal, ayuda, índice ---------- */
let focusBack=null,dlgPaused=false;
function modal(title,html){focusBack=document.activeElement;dlgPaused=!!utter&&!paused;if(dlgPaused)vPause();$('#dialog-title').textContent=title;$('#dialog-body').innerHTML=html;$('#modal').showModal();$('#close').focus()}
function close(){if(!active)return;$('#modal').close();if(dlgPaused)vResume();dlgPaused=false;focusBack?.focus?.()}
$('#modal').addEventListener('cancel',e=>e.preventDefault());$('#close').onclick=close;
$('#dialog-body').addEventListener('click',e=>{const b=e.target.closest('[data-page]');if(b&&!b.disabled){close();go(Number(b.dataset.page))}if(e.target.id==='confirm-reset'){s=fresh();$('#modal').close();go(1)}});
function welcome(){modal(window.MODULE.welcomeTitle,`${window.MODULE.welcome}<p class="note">Voz sintética provisional del navegador. Si no hay voz española, el mensaje queda visible en pantalla. Voz, ambiente, efectos, subtítulos y apariencia se ajustan en Configuración (⚙, arriba a la derecha).</p>${prior?'<button id="resume" class="big-action">Retomar avance</button> ':''}<button id="begin" class="start">${prior?'Comenzar de nuevo':'Entrar al simulador'}</button>`);$('#close').hidden=true;$('#begin').onclick=()=>{s=fresh();launch()};if($('#resume'))$('#resume').onclick=()=>{s=prior;launch()}}
function launch(){try{const w=new SpeechSynthesisUtterance(' ');w.volume=0;window.speechSynthesis?.speak(w)}catch{}active=true;applyPrefs();$('#close').hidden=false;$('#modal').close();render();save()}
$('#next').onclick=()=>{if(!$('#next').disabled)primary()};
$('#prev').onclick=()=>{const back=s.unlocked.filter(n=>n<s.page&&!['ok','ko'].includes(byId(n).type));if(back.length)go(Math.max(...back))};
$('#index').onclick=()=>modal('Índice',`<div class="index-list">${SC.map(c=>`<button data-page="${c.id}" ${!s.unlocked.includes(c.id)||['ok','ko'].includes(c.type)?'disabled':''}>${String(c.id).padStart(2,'0')} · ${c.title} ${s.reviewed.includes(c.id)?'✓':''}</button>`).join('')}</div>`);
$('#full').onclick=()=>{if(document.fullscreenElement)document.exitFullscreen?.();else document.documentElement.requestFullscreen?.().catch(()=>{})};
document.addEventListener('visibilitychange',()=>{if(document.hidden){save();if(utter&&!paused)vPause()}else if(utter&&!paused&&!anyDialog())vResume()});
window.addEventListener('pagehide',()=>{save();voiceStop();if(api&&!finishCalled){finishCalled=true;try{api.LMSFinish('')}catch{}}});

/* ---------- Configuración (modelo Cultura Mapuche v16) ---------- */
const ICON={pause:'<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>',play:'<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>',volume:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M4 10v4h4l5 4V6L8 10z" fill="currentColor"/><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11"/></svg>',mute:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M4 10v4h4l5 4V6L8 10z" fill="currentColor"/><path d="m16 9 5 6m0-6-5 6"/></svg>'};
const panel=$('#course-settings'),trigger=$('#settings-toggle');
function applyPrefs(){const r=document.documentElement;narrator.volume=prefs.voiceLevel/100;r.dataset.appearance=prefs.light?'light':'dark';r.dataset.reducedMotion=String(!!prefs.reducedMotion);r.style.setProperty('--caption-font-size',prefs.ccSize+'px');$('#captions').hidden=!prefs.cc;const a=$('#ambience');a.volume=prefs.ambientLevel/100*.18;if(prefs.ambient&&active){if(a.paused)a.play().catch(()=>{})}else a.pause();if(utter&&prefs.muted)voiceStop()}
function setPref(k,v){prefs[k]=v;savePrefs();applyPrefs();paint()}
function paint(){$('#cc-switch').textContent=prefs.cc?'Sí':'No';$('#cc-switch').setAttribute('aria-pressed',String(prefs.cc));for(const [id,off,name] of [['voice',prefs.muted,'voz'],['ambient',!prefs.ambient,'ambiente'],['effects',prefs.effectsMuted,'efectos']]){const b=$('#'+id+'-toggle');b.dataset.off=String(off);b.setAttribute('aria-pressed',String(off));b.setAttribute('aria-label',(off?'Activar ':'Silenciar ')+name);b.title=b.getAttribute('aria-label');b.innerHTML=off?ICON.mute:ICON.volume;const r=$('#'+id+'-level');r.value=prefs[id+'Level'];r.setAttribute('aria-valuetext',r.value+' %');r.nextElementSibling.textContent=r.value+' %'}$('#caption-size').value=prefs.ccSize;$('#reduced-motion').textContent=prefs.reducedMotion?'Sí':'No';$('#reduced-motion').setAttribute('aria-pressed',String(!!prefs.reducedMotion));$('#light-interface').textContent=prefs.light?'Volver a interfaz oscura':'Usar interfaz clara';$('#light-interface').setAttribute('aria-pressed',String(!!prefs.light))}
function paintPause(){const b=$('#play');const on=!!utter&&!paused;b.innerHTML=on?ICON.pause:ICON.play;b.setAttribute('aria-label',on?'Pausar locución':utter?'Reanudar locución':'Reproducir locución');b.title=b.getAttribute('aria-label')}
$('#play').onclick=()=>{if(!utter){speak();return}paused=!paused;paused?vPause():vResume();paintPause()};
$('#cc-switch').onclick=()=>setPref('cc',!prefs.cc);
$('#voice-toggle').onclick=()=>{setPref('muted',!prefs.muted);if(!prefs.muted)speakAfterClose=true};
$('#ambient-toggle').onclick=()=>setPref('ambient',!prefs.ambient);
$('#effects-toggle').onclick=()=>{setPref('effectsMuted',!prefs.effectsMuted);sfx.snap()};
for(const id of ['voice','ambient','effects'])$('#'+id+'-level').oninput=e=>{setPref(id+'Level',Number(e.target.value));if(id==='ambient'&&!prefs.ambient)setPref('ambient',true)};
$('#effects-level').onchange=()=>sfx.snap();
$('#caption-size').onchange=e=>setPref('ccSize',Number(e.target.value));
$('#reduced-motion').onclick=()=>setPref('reducedMotion',!prefs.reducedMotion);
$('#light-interface').onclick=()=>setPref('light',!prefs.light);
let speakAfterClose=false,resumeVoice=false;
trigger.onclick=()=>{resumeVoice=!!utter&&!paused;if(resumeVoice)vPause();panel.showModal();trigger.setAttribute('aria-expanded','true');panel.querySelector('.close').focus()};
panel.querySelector('.close').onclick=()=>panel.close();
panel.addEventListener('close',()=>{trigger.setAttribute('aria-expanded','false');trigger.focus();if(speakAfterClose&&active){speakAfterClose=false;speak()}else if(resumeVoice&&utter)vResume();resumeVoice=false});
const guide=$('#experience-guide');$('#open-experience-guide').onclick=()=>{guide.showModal();guide.querySelector('.close').focus()};guide.querySelector('.close').onclick=()=>guide.close();guide.addEventListener('close',()=>$('#open-experience-guide').focus());
for(const d of [panel,guide]){d.addEventListener('cancel',e=>e.preventDefault());d.addEventListener('keydown',e=>{if(e.key!=='Tab')return;const els=[...d.querySelectorAll('button,input,select')].filter(el=>!el.disabled&&el.getClientRects().length),f=els[0],l=els.at(-1);if(e.shiftKey&&document.activeElement===f){e.preventDefault();l.focus()}else if(!e.shiftKey&&document.activeElement===l){e.preventDefault();f.focus()}})}
applyPrefs();paint();paintPause();
window.SSOSim={snapshot:()=>JSON.parse(JSON.stringify(s)),go:n=>go(n)};
welcome();
})();
