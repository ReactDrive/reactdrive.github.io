/* ReactDrive project page. Plain scripts keep the page usable from file://. */
'use strict';
const examples = window.REACTDRIVE_EXAMPLES;
const results = window.REACTDRIVE_RESULTS;
const $ = (id) => document.getElementById(id);
const colors = ['#e0e4eb','#d7dde6','#cdd5e1','#c2ccda','#b6c3d5','#6658f5'];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const hero = $('hero-video');
const heroVideos = [hero, $('hero-video-secondary')];
let heroRequested = !reduceMotion, heroVisible = false, heroPlaying = false, heroStarting = false;
let heroFrame = 0, heroOperation = 0;
// Presentation-only attention cue, keyed to the visible vehicle in this clip.
// Coordinates are in the source video's 576 × 384 frame, not evaluation tracks.
const heroFocusKeys = [
  [3.4, 154, 289, 420, 93], [3.6, 128, 266, 446, 116],
  [3.8, 112, 232, 362, 141], [4.0, 109, 215, 310, 156],
  [4.2, 105, 214, 272, 158], [4.4, 99, 208, 247, 166],
  [4.6, 93, 208, 244, 167], [5.0, 72, 207, 238, 172],
  [5.4, 48, 205, 232, 177], [5.8, 18, 200, 226, 182],
  [6.1, 2, 196, 238, 186]
];
function updateHeroFocus() {
  const focus = $('hero-traffic-focus'), time = hero.currentTime || 0;
  focus.hidden = time < heroFocusKeys[0][0];
  if (focus.hidden) return;
  const next = heroFocusKeys.findIndex(key => key[0] >= time);
  const end = next < 0 ? heroFocusKeys.length - 1 : next;
  const a = heroFocusKeys[Math.max(0, end - 1)], b = heroFocusKeys[end];
  const progress = a[0] === b[0] ? 0 : Math.max(0, Math.min(1, (time - a[0]) / (b[0] - a[0])));
  const [x, y, width, height] = a.slice(1).map((v, i) => v + (b[i + 1] - v) * progress);
  focus.style.left = `${x / 576 * 100}%`;
  focus.style.top = `${y / 384 * 100}%`;
  focus.style.width = `${width / 576 * 100}%`;
  focus.style.height = `${height / 384 * 100}%`;
}
function updateHeroButton() {
  const playing = heroPlaying && heroVideos.every(v => !v.paused);
  $('hero-play').innerHTML = playing ? '<span aria-hidden="true">Ⅱ</span> Pause' : '<span aria-hidden="true">▶</span> Play';
  $('hero-play').setAttribute('aria-label', playing ? 'Pause hero comparison' : 'Play hero comparison');
}
function updateHeroTime() {
  updateHeroFocus();
  const frame = Math.min(60, Math.round((hero.currentTime || 0) * 10));
  $('hero-scrub').value = frame;
  $('hero-scrub').setAttribute('aria-valuetext', `Frame ${frame} of 60`);
  $('hero-time').value = `${String(frame).padStart(2, '0')} / 60`;
}
function pauseHero(clearRequest = false) {
  if (clearRequest) heroRequested = false;
  heroOperation++; heroPlaying = false; heroStarting = false;
  cancelAnimationFrame(heroFrame);
  heroVideos.forEach(v => v.pause());
  updateHeroButton(); updateHeroTime();
}
function tickHero() {
  if (!heroPlaying) return;
  if (hero.currentTime >= 6.05) { startHero(true); return; }
  const other = heroVideos[1];
  if (other.readyState >= 3 && !other.seeking && Math.abs(other.currentTime - hero.currentTime) > .06) other.currentTime = hero.currentTime;
  updateHeroTime();
  heroFrame = requestAnimationFrame(tickHero);
}
async function startHero(restart = false) {
  if (!heroVisible || document.hidden || heroStarting) return;
  const operation = ++heroOperation;
  heroStarting = true; heroPlaying = false; cancelAnimationFrame(heroFrame);
  const time = restart || hero.currentTime >= 6.02 ? 0 : hero.currentTime;
  heroVideos.forEach(v => { if (Math.abs(v.currentTime - time) > .015) v.currentTime = time; });
  const attempts = await Promise.allSettled(heroVideos.map(v => v.play()));
  if (operation !== heroOperation) {
    if (!heroRequested || !heroVisible || document.hidden) heroVideos.forEach(v => v.pause());
    return;
  }
  heroStarting = false;
  if (attempts.some(r => r.status === 'rejected') || !heroVisible || document.hidden) { pauseHero(); return; }
  heroPlaying = true; updateHeroButton(); updateHeroTime();
  heroFrame = requestAnimationFrame(tickHero);
}
$('hero-play').addEventListener('click', () => {
  if (heroPlaying || heroStarting) pauseHero(true);
  else { heroRequested = true; startHero(); }
});
$('hero-restart').addEventListener('click', () => { pauseHero(); heroRequested = true; startHero(true); });
$('hero-scrub').addEventListener('input', e => {
  const time = Math.max(0, Math.min(60, Number(e.target.value))) / 10;
  pauseHero(true);
  heroVideos.forEach(v => { v.currentTime = time; });
  updateHeroTime();
});
hero.addEventListener('seeked', updateHeroTime);
hero.addEventListener('ended', () => { if (heroRequested && heroVisible) startHero(true); });
heroVideos.forEach(v => {
  v.addEventListener('waiting', () => { if (heroPlaying) pauseHero(); });
  v.addEventListener('canplay', () => {
    if (heroRequested && heroVisible && !heroPlaying && !heroStarting && heroVideos.every(video => video.readyState >= 3)) startHero();
  });
  v.addEventListener('error', () => pauseHero(true));
});
new IntersectionObserver(entries => {
  heroVisible = entries[0].isIntersecting;
  if (heroVisible && heroRequested && !document.hidden) startHero();
  else pauseHero();
}, {threshold:.15}).observe($('hero-pair'));

let exampleIndex = 0;
const ours = $('ours-video'), baseline = $('baseline-video');
const pairVideos = [ours,baseline];
let pairPlaying = false, animationId = 0;
function updatePlayButton() {
  $('pair-play').textContent = pairPlaying ? 'Ⅱ' : '▶';
  $('pair-play').setAttribute('aria-label',pairPlaying ? 'Pause comparison' : 'Play comparison');
}
function updateTime() {
  const frame = Math.min(60,Math.round((ours.currentTime || 0)*10));
  $('pair-scrub').value = frame;
  $('pair-time').value = `${String(frame).padStart(2,'0')} / 60`;
  $('pair-scrub').setAttribute('aria-valuetext',`Frame ${frame} of 60`);
}
function tick() {
  if(!pairPlaying) return;
  if(Math.abs(baseline.currentTime-ours.currentTime)>.12 && baseline.readyState>=2) baseline.currentTime = ours.currentTime;
  updateTime();
  animationId = requestAnimationFrame(tick);
}
function pausePair() {
  pairPlaying=false; pairVideos.forEach(v=>v.pause()); cancelAnimationFrame(animationId);updatePlayButton();updateTime();
}
async function playPair() {
  pauseHero(true);
  if(ours.currentTime>=6.02) pairVideos.forEach(v=>v.currentTime=0);
  baseline.currentTime=ours.currentTime;
  try { await Promise.all(pairVideos.map(v=>v.play())); pairPlaying=true; updatePlayButton();cancelAnimationFrame(animationId);tick(); }
  catch { pausePair(); }
}
function seekPair(frame) {
  pausePair(); const t=Math.max(0,Math.min(60,frame))/10;
  pairVideos.forEach(v=>v.currentTime=t); updateTime();
}
$('pair-play').addEventListener('click',()=>pairPlaying?pausePair():playPair());
$('pair-restart').addEventListener('click',()=>{seekPair(0);playPair();});
$('pair-prev').addEventListener('click',()=>seekPair(Math.round(ours.currentTime*10)-1));
$('pair-next').addEventListener('click',()=>seekPair(Math.round(ours.currentTime*10)+1));
$('pair-scrub').addEventListener('input',e=>seekPair(Number(e.target.value)));
$('pair-speed').addEventListener('change',e=>pairVideos.forEach(v=>v.playbackRate=Number(e.target.value)));
ours.addEventListener('ended',()=>{if(pairPlaying){pairVideos.forEach(v=>v.currentTime=0);playPair();}});
ours.addEventListener('seeked',updateTime);
pairVideos.forEach(v=>v.addEventListener('error',()=>{
  pausePair();$('example-description').textContent='The video could not be loaded. Keep the assets folder beside index.html and reopen the page.';
}));
function selectExample(index) {
  pausePair();exampleIndex=index;const ex=examples[index];
  ours.src=ex.ours.video;ours.poster=ex.ours.poster;baseline.src=ex.baseline.video;baseline.poster=ex.baseline.poster;
  pairVideos.forEach(v=>{v.load();v.playbackRate=Number($('pair-speed').value);});
  $('baseline-name').textContent=ex.baseline.name;
  baseline.setAttribute('aria-label',`${ex.baseline.name} comparison video`);
  $('example-description').textContent=ex.description;
  $('sequence-image').src=ex.ours.sequence;
  $('sequence-image').alt=`Six frames from the ReactDrive video: ${ex.action.toLowerCase()}`;
  $('example-select').value=String(index);
  $('example-position').textContent=`${index+1} / ${examples.length}`;
  $('pair-scrub').value=0;$('pair-time').value='00 / 60';
}
examples.forEach((ex,i)=>{const option=document.createElement('option');option.value=String(i);option.textContent=`${ex.title} · ${ex.dataset}`;$('example-select').appendChild(option);});
$('example-select').addEventListener('change',e=>selectExample(Number(e.target.value)));
$('example-prev').addEventListener('click',()=>selectExample((exampleIndex-1+examples.length)%examples.length));
$('example-next').addEventListener('click',()=>selectExample((exampleIndex+1)%examples.length));
selectExample(0);

function escapeText(value){return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
const format = (v,d=2)=>Number(v).toFixed(d);
function chartSVG(values,label) {
  const w=320,h=250,left=38,right=9,top=28,bottom=43,pw=w-left-right,ph=h-top-bottom;
  const rawMax=Math.max(...values)*1.14;
  const roughStep=rawMax/4;
  const magnitude=10**Math.floor(Math.log10(roughStep));
  const tickStep=[1,2,2.5,5,10].find(v=>v>=roughStep/magnitude)*magnitude;
  const tickCount=Math.ceil(rawMax/tickStep),max=tickCount*tickStep;
  const y=v=>top+ph*(1-v/max),step=pw/values.length,bw=step*.67;
  const gradientId='metric-'+label.toLowerCase().replace(/[^a-z0-9]+/g,'-');
  let out=`<svg data-chart viewBox="0 0 ${w} ${h}" role="group" aria-label="${escapeText(label)}. ${escapeText(results.methods.map((m,i)=>m+' '+format(values[i])).join('; '))}. Lower is better."><title>${escapeText(label)}</title><defs>`;
  colors.forEach((c,i)=>{out+=`<linearGradient id="${gradientId}-${i}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c}"/><stop offset="1" stop-color="${i===5?'#d5d0ff':'#f2f4f8'}"/></linearGradient>`;});
  out+='</defs>';
  for(let i=0;i<=tickCount;i++) {const v=tickStep*i,yy=y(v);out+=`<line x1="${left}" y1="${yy}" x2="${w-right}" y2="${yy}" stroke="${i===0?'#ccd2de':'#edf0f5'}" stroke-width="${i===0?1:.7}"/><text x="${left-8}" y="${yy+3.5}" text-anchor="end" font-family="Arial,sans-serif" font-size="10" fill="#828898">${Number(v.toFixed(4))}</text>`;}
  values.forEach((v,i)=>{
    const cx=left+step*(i+.5),yy=y(v),name=escapeText(results.methods[i]),context=escapeText(label+' · Lower is better');
    out+=`<g data-chart-item data-chart-index="${i}" data-chart-name="${name}" data-chart-value="${format(v)}" data-chart-context="${context}" tabindex="0" role="img" aria-label="${name}, ${escapeText(label)}: ${format(v)}"><title>${name}: ${format(v)}</title><rect class="chart-hit" x="${cx-step*.47}" y="${top-18}" width="${step*.94}" height="${ph+20}" rx="5"/><rect data-chart-bar="vertical" x="${cx-bw/2}" y="${yy}" width="${bw}" height="${top+ph-yy}" rx="4" fill="url(#${gradientId}-${i})"/><text data-chart-label x="${cx}" y="${yy-10}" text-anchor="middle" font-family="Arial,sans-serif" font-size="12" font-weight="${i===5?700:400}" fill="${i===5?'#6658f5':'#626c7e'}">${format(v)}</text></g>`;
  });
  const axisNames=[['Vista'],['GEM'],['Epona'],['Driving','World'],['Cosmos3'],['React','Drive']];
  axisNames.forEach((lines,i)=>{const cx=left+step*(i+.5);out+=`<text x="${cx}" y="${top+ph+16}" text-anchor="middle" font-family="Arial,sans-serif" font-size="8.6" fill="${i===5?'#6658f5':'#737b8e'}" font-weight="${i===5?600:400}">${lines.map((line,j)=>`<tspan x="${cx}" dy="${j?10:0}">${line}</tspan>`).join('')}</text>`;});
  return out+'</svg>';
}
let resultDataset='Waymo',resultMode='factual',resultGroup='overall';
function renderResults() {
  const factual=resultMode==='factual';
  const keys=factual?['agentADE','agentFDE','fvd','fid']:['egoADE','egoFDE','cr'];
  const data=factual?results.datasets[resultDataset].factual:results.datasets[resultDataset].counterfactual[resultGroup];
  $('result-group-control').hidden=factual;
  $('chart-grid').classList.toggle('counterfactual',!factual);
  $('chart-grid').innerHTML=keys.map(k=>`<figure class="chart-card"><div class="chart-title"><h3>${results.metrics[k].label} ${k==='cr'?'(%) ':''}↓</h3><span>Lower is better</span></div>${chartSVG(data[k],results.metrics[k].name)}</figure>`).join('');
  const fvdReduction=((data.fvd?.[4]-data.fvd?.[5])/data.fvd?.[4]*100).toFixed(1);
  $('result-takeaway').innerHTML=factual?`ReactDrive has the lowest agent path errors and FVD on ${resultDataset}. FVD is <strong>${fvdReduction}% lower than Cosmos3</strong>.`:`Following the requested action and avoiding collisions on ${resultDataset}.`;
  let html='<table><thead><tr><th scope="col">Method</th>'+keys.map(k=>`<th scope="col" title="${escapeText(results.metrics[k].name)}">${results.metrics[k].label}${k==='cr'?' (%)':''} ↓</th>`).join('')+'</tr></thead><tbody>';
  results.methods.forEach((m,i)=>{html+=`<tr${i===5?' class="ours-row"':''}><td>${m}</td>`+keys.map(k=>`<td${data[k][i]===Math.min(...data[k])?' class="best"':''}>${format(data[k][i])}</td>`).join('')+'</tr>';});
  $('results-table').innerHTML=html+'</tbody></table>';
  document.querySelectorAll('[data-mode]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.mode===resultMode));
  document.querySelectorAll('[data-dataset]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.dataset===resultDataset));
  window.ReactDriveCharts?.mount($('chart-grid'));
}
document.querySelectorAll('[data-mode]').forEach(b=>b.addEventListener('click',()=>{resultMode=b.dataset.mode;renderResults();}));
document.querySelectorAll('[data-dataset]').forEach(b=>b.addEventListener('click',()=>{resultDataset=b.dataset.dataset;renderResults();}));
$('result-group').addEventListener('change',e=>{resultGroup=e.target.value;renderResults();});
$('method-legend').innerHTML=results.methods.map((m,i)=>`<span${i===5?' class="red"':''}><i style="background:${colors[i]}"></i>${m}</span>`).join('');
renderResults();

$('human-bars').innerHTML=results.human.criteria.map(c=>`<div class="human-row" data-chart><div data-chart-item data-chart-index="0" data-chart-name="ReactDrive preference" data-chart-value="${c.reactdrivePercent.toFixed(1)}%" data-chart-context="${escapeText(c.label)} · Baselines ${c.baselinePercent.toFixed(1)}%" tabindex="0" role="img" aria-label="${escapeText(c.label)}: ${c.reactdrivePercent}% ReactDrive, ${c.baselinePercent}% baselines"><div class="human-row-title"><span>${c.label}</span><strong class="metric-value" data-chart-label>${c.reactdrivePercent.toFixed(1)}<span class="metric-unit">%</span></strong></div><div class="preference-track"><div class="preference-fill" data-chart-bar="horizontal" style="width:${c.reactdrivePercent}%"></div></div></div></div>`).join('');
window.ReactDriveCharts?.mount($('human-bars'));
function planningChart(){
  const values=results.planning.metrics.pdms.values,names=['Real data','+ Cosmos3','+ ReactDrive'];
  const w=500,h=230,x=111,pw=340;let s=`<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="Planning PDMS: Real data 83.8, Cosmos3 augmentation 83.8, ReactDrive augmentation 85.1. Higher is better.">`;
  [0,25,50,75,100].forEach(v=>{const xx=x+pw*v/100;s+=`<line x1="${xx}" x2="${xx}" y1="8" y2="192" stroke="#edf0f5" stroke-width=".7"/><text x="${xx}" y="213" text-anchor="middle" fill="#828898" font-family="Arial,sans-serif" font-size="10">${v}</text>`;});
  values.forEach((v,i)=>{const y=20+i*61;s+=`<text x="${x-12}" y="${y+21}" text-anchor="end" font-family="Arial,sans-serif" font-size="12" fill="${i===2?'#6658f5':'#626c7e'}">${names[i]}</text><rect x="${x}" y="${y}" width="${v/100*pw}" height="32" fill="${['#d7dde6','#b6c3d5','#6658f5'][i]}"/><text x="${x+v/100*pw+9}" y="${y+21}" font-family="Arial,sans-serif" font-size="14" font-weight="${i===2?700:400}" fill="${i===2?'#6658f5':'#626c7e'}">${v.toFixed(1)}</text>`;});
  $('planning-chart').innerHTML=s+'</svg>';
}
planningChart();
const pKeys=['nc','dac','ttc','ep','comfort','ddc','pdms'];
$('planning-table').innerHTML='<table><thead><tr><th>Training data</th>'+pKeys.map(k=>`<th title="${results.planning.metrics[k].name}">${results.planning.metrics[k].label}${k==='pdms'?'':' (%)'} ↑</th>`).join('')+'</tr></thead><tbody>'+results.planning.methods.map((m,i)=>`<tr${i===2?' class="ours-row"':''}><td>${m}</td>`+pKeys.map(k=>`<td${results.planning.metrics[k].values[i]===Math.max(...results.planning.metrics[k].values)?' class="best"':''}>${results.planning.metrics[k].values[i].toFixed(1)}</td>`).join('')+'</tr>').join('')+'</tbody></table>';

const dialog=$('media-dialog');let movedNodes=[];
function openDialog(){pauseHero(true);dialog.showModal();document.body.style.overflow='hidden';}
function closeDialog(){dialog.close();}
$('dialog-close').addEventListener('click',closeDialog);
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeDialog();}});
dialog.addEventListener('close',()=>{
  movedNodes.forEach(({node,marker})=>{marker.replaceWith(node);});movedNodes=[];$('dialog-content').innerHTML='';document.body.style.overflow='';
});
$('method-expand').addEventListener('click',()=>{
  $('dialog-content').innerHTML='<img class="dialog-image" src="assets/images/pipeline.webp?v=20261113-labels-refined" alt="Expanded ReactDrive method pipeline">';openDialog();
});
$('pair-expand').addEventListener('click',()=>{
  if(dialog.open){closeDialog();return;}
  [$('comparison-screen'),document.querySelector('.player-controls')].forEach(node=>{const marker=document.createComment('expanded-content');node.before(marker);movedNodes.push({node,marker});$('dialog-content').appendChild(node);});openDialog();
});
document.addEventListener('visibilitychange',()=>{if(document.hidden){pausePair();pauseHero();}else if(heroVisible && heroRequested){startHero();}});
document.addEventListener('keydown',e=>{
  if(!dialog.open||!movedNodes.length||['INPUT','SELECT','BUTTON'].includes(document.activeElement.tagName))return;
  if(e.code==='Space'){e.preventDefault();pairPlaying?pausePair():playPair();}
  if(e.code==='ArrowRight'){e.preventDefault();seekPair(Math.round(ours.currentTime*10)+1);}
  if(e.code==='ArrowLeft'){e.preventDefault();seekPair(Math.round(ours.currentTime*10)-1);}
});

// Explicit alignment keeps long-page anchors consistent across browsers.
document.querySelectorAll('a[href^="#"]').forEach(link=>link.addEventListener('click',event=>{
  const hash=link.getAttribute('href'); const target=document.querySelector(hash); if(!target)return;
  event.preventDefault(); history.replaceState(null,'',hash);
  if(hash==='#top') window.scrollTo({top:0,behavior:'instant'});
  else window.scrollTo({top:target.getBoundingClientRect().top+window.scrollY+parseFloat(getComputedStyle(target).paddingTop)-24,behavior:'instant'});
}));
