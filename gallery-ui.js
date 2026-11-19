'use strict';
(() => {
  const el=id=>document.getElementById(id);
  const library=window.REACTDRIVE_GALLERY||[];
  const curation=window.REACTDRIVE_CURATION||{featured:[],scenes:[]};
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const actionNames={accelerate:'Accelerate',decelerate:'Slow down',lane_shift_left:'Left',lane_shift_right:'Right',stop:'Stop'};
  const actionLabel=item=>item.action||actionNames[item.task];
  const lookup=new Map(); library.forEach(v=>{lookup.set(v.id,v);v.aliases.forEach(a=>lookup.set(a.id,v));});
  const meta=new Map((curation.featured||[]).map(v=>[lookup.get(v.id)?.id||v.id,v]));
  let featured=[...new Set((curation.featured||[]).map(v=>lookup.get(v.id)).filter(Boolean))];
  if(!featured.length)featured=library.slice(0,16);
  const ordered=[...featured,...library.filter(v=>!featured.includes(v))];
  const vid=el('showcase-video'),canvas=el('detail-canvas'),ctx=canvas.getContext('2d');
  let active=featured[0],roi={x:.23,y:.33,w:.46,h:.46},featureRAF=0,featureAuto=!reduced;
  function squareROI(raw,maxSize=.85){
    const r=raw||{x:.22,y:.31,w:.48,h:.48}; const size=Math.min(maxSize,Math.max(.22,r.w||.48,r.h||.48));
    return {x:Math.max(0,Math.min(1-size,r.x+(r.w-size)/2)),y:Math.max(0,Math.min(1-size,r.y+(r.h-size)/2)),w:size,h:size};
  }
  function drawCrop(video,c,r){
    if(video.readyState<2||!video.videoWidth)return;
    const con=c.getContext('2d');con.drawImage(video,r.x*video.videoWidth,r.y*video.videoHeight,r.w*video.videoWidth,r.h*video.videoHeight,0,0,c.width,c.height);
  }
  function drawFeature(){
    cancelAnimationFrame(featureRAF);
    drawCrop(vid,canvas,roi);el('showcase-scrub').value=Math.min(60,Math.round(vid.currentTime*10));el('showcase-time').value=`${String(Math.min(60,Math.round(vid.currentTime*10))).padStart(2,'0')} / 60`;
    if(!vid.paused&&!vid.ended)featureRAF=requestAnimationFrame(drawFeature);
  }
  function syncROI(){const r=el('focus-window');r.style.left=roi.x*100+'%';r.style.top=roi.y*100+'%';r.style.width=roi.w*100+'%';r.style.height=roi.h*100+'%';drawCrop(vid,canvas,roi);}
  function featureButton(){el('showcase-play').textContent=vid.paused?'▶':'Ⅱ';el('showcase-play').setAttribute('aria-label',vid.paused?'Play selected video':'Pause selected video');}
  async function playFeature(){try{await vid.play();featureAuto=true;}catch{}featureButton();}
  function chooseVideo(item,{autoplay=false,scroll=false}={}){
    if(!item)return;vid.pause();cancelAnimationFrame(featureRAF);active=item;const m=meta.get(item.id)||{};
    vid.src=item.video;vid.poster=item.poster;vid.loop=true;vid.load();vid.playbackRate=Number(el('showcase-speed').value);
    roi=squareROI(m.roi,.42);syncROI();el('showcase-title-line').textContent=actionLabel(item);
    el('watch-for').textContent=m.watch||'Agent responses to the selected action.';
    const pos=featured.indexOf(item);el('feature-position').textContent=pos>=0?`${pos+1} / ${featured.length}`:`Scene ${item.id.slice(1)}`;
    el('showcase-scrub').value=0;el('showcase-time').value='00 / 60';
    document.querySelectorAll('[data-feature-id]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.featureId===item.id));
    featureAuto=autoplay;if(scroll){const section=el('showcase');window.scrollTo({top:section.getBoundingClientRect().top+window.scrollY+parseFloat(getComputedStyle(section).paddingTop)-24,behavior:'instant'});}if(autoplay)playFeature();featureButton();
  }
  featured.forEach(v=>{
    const m=meta.get(v.id)||{},b=document.createElement('button');b.className='feature-thumb';b.dataset.featureId=v.id;b.setAttribute('aria-label',`${v.dataset}, ${actionLabel(v)}, ${m.title||v.id}`);b.setAttribute('aria-pressed','false');
    b.innerHTML=`<img src="${v.poster}" width="576" height="384" alt="${v.dataset} ${actionLabel(v)}" loading="lazy"><span>${actionLabel(v)}</span>`;
    b.addEventListener('click',()=>chooseVideo(v,{autoplay:true}));el('feature-reel').appendChild(b);
  });
  ['loadeddata','seeked'].forEach(e=>vid.addEventListener(e,()=>{drawCrop(vid,canvas,roi);drawFeature();}));
  vid.addEventListener('play',()=>{cancelAnimationFrame(featureRAF);featureButton();drawFeature();});
  vid.addEventListener('pause',()=>{cancelAnimationFrame(featureRAF);featureButton();});
  el('showcase-play').addEventListener('click',()=>{if(vid.paused)playFeature();else{vid.pause();featureAuto=false;}});
  el('showcase-restart').addEventListener('click',()=>{vid.currentTime=0;playFeature();});
  el('showcase-scrub').addEventListener('input',e=>{vid.pause();featureAuto=false;vid.currentTime=Number(e.target.value)/10;el('showcase-time').value=`${String(e.target.value).padStart(2,'0')} / 60`;});
  el('showcase-speed').addEventListener('change',e=>vid.playbackRate=Number(e.target.value));
  function nextFeature(step){let i=featured.indexOf(active);if(i<0)i=0;chooseVideo(featured[(i+step+featured.length)%featured.length],{autoplay:true});}
  el('feature-prev').addEventListener('click',()=>nextFeature(-1));el('feature-next').addEventListener('click',()=>nextFeature(1));
  el('focus-context').addEventListener('click',e=>{const b=e.currentTarget.getBoundingClientRect();roi.x=Math.max(0,Math.min(1-roi.w,(e.clientX-b.left)/b.width-roi.w/2));roi.y=Math.max(0,Math.min(1-roi.h,(e.clientY-b.top)/b.height-roi.h/2));syncROI();});
  el('focus-context').addEventListener('keydown',e=>{const d=.04;if(e.key==='ArrowLeft')roi.x-=d;else if(e.key==='ArrowRight')roi.x+=d;else if(e.key==='ArrowUp')roi.y-=d;else if(e.key==='ArrowDown')roi.y+=d;else if(e.code==='Space'){e.preventDefault();el('showcase-play').click();return;}else return;e.preventDefault();roi.x=Math.max(0,Math.min(1-roi.w,roi.x));roi.y=Math.max(0,Math.min(1-roi.h,roi.y));syncROI();});
  new IntersectionObserver(entries=>{if(!entries[0].isIntersecting)vid.pause();else if(featureAuto)playFeature();},{threshold:.25}).observe(el('focus-stage'));
  chooseVideo(featured[0]);

  // Shared starting scenes: every panel retains its actual action-conditioned output.
  const scenes=(curation.scenes||[]).map(s=>({...s,members:s.members.map(m=>typeof m==='string'?{id:m}:m).map(m=>({...m,item:lookup.get(m.id)})).filter(m=>m.item)})).filter(s=>s.members.length>1);
  let branchVideos=[],branchCanvases=[],currentScene=null,branchPlaying=false,branchRAF=0;
  function branchTick(){
    cancelAnimationFrame(branchRAF);
    const master=branchVideos[0];if(!master)return;
    branchVideos.forEach((v,i)=>{if(i&&branchPlaying&&Math.abs(v.currentTime-master.currentTime)>.13)v.currentTime=master.currentTime;drawCrop(v,branchCanvases[i],squareROI(currentScene.members[i].roi||currentScene.roi));});
    const f=Math.min(60,Math.round(master.currentTime*10));el('branch-scrub').value=f;el('branch-time').value=`${String(f).padStart(2,'0')} / 60`;
    if(branchPlaying)branchRAF=requestAnimationFrame(branchTick);
  }
  function stopBranches(){branchPlaying=false;branchVideos.forEach(v=>v.pause());cancelAnimationFrame(branchRAF);el('branch-play').textContent='▶';el('branch-play').setAttribute('aria-label','Play action comparison');}
  async function playBranches(){vid.pause();const t=branchVideos[0]?.currentTime||0;branchVideos.forEach(v=>v.currentTime=t>=6.02?0:t);try{await Promise.all(branchVideos.map(v=>v.play()));branchPlaying=true;el('branch-play').textContent='Ⅱ';el('branch-play').setAttribute('aria-label','Pause action comparison');cancelAnimationFrame(branchRAF);branchTick();}catch{stopBranches();}}
  function chooseScene(index){
    stopBranches();currentScene=scenes[index];if(!currentScene)return;
    const grid=el('branch-grid');grid.className=`branch-grid count-${currentScene.members.length}${el('branch-detail').checked?' show-detail':''}`;grid.innerHTML='';branchVideos=[];branchCanvases=[];
    currentScene.members.forEach(m=>{const v=m.item,fig=document.createElement('figure');fig.className='branch-card';fig.innerHTML=`<figcaption>${actionLabel(v)}</figcaption><div class="branch-media"><video muted playsinline preload="auto" poster="${v.poster}" aria-label="ReactDrive ${actionLabel(v)} from ${currentScene.title}"></video><canvas width="768" height="512" aria-label="Close-up of agents: ${actionLabel(v)}"></canvas></div>`;grid.appendChild(fig);const movie=fig.querySelector('video'),can=fig.querySelector('canvas');movie.src=v.video;branchVideos.push(movie);branchCanvases.push(can);movie.addEventListener('loadeddata',branchTick);movie.addEventListener('seeked',()=>drawCrop(movie,can,squareROI(m.roi||currentScene.roi)));});
    branchVideos[0].addEventListener('ended',()=>{if(branchPlaying){branchVideos.forEach(v=>v.currentTime=0);playBranches();}});
    el('branch-watch').textContent=currentScene.watch;el('branch-scrub').value=0;el('branch-time').value='00 / 60';[...el('scene-switcher').children].forEach((b,i)=>b.setAttribute('aria-pressed',i===index));
  }
  scenes.forEach((s,i)=>{const b=document.createElement('button');b.textContent=s.title;b.setAttribute('aria-pressed',i===0);b.addEventListener('click',()=>{chooseScene(i);playBranches();});el('scene-switcher').appendChild(b);});
  if(scenes.length)chooseScene(0);else el('action-response').hidden=true;
  el('branch-play').addEventListener('click',()=>branchPlaying?stopBranches():playBranches());el('branch-restart').addEventListener('click',()=>{branchVideos.forEach(v=>v.currentTime=0);playBranches();});
  el('branch-scrub').addEventListener('input',e=>{stopBranches();branchVideos.forEach(v=>v.currentTime=Number(e.target.value)/10);el('branch-time').value=`${String(e.target.value).padStart(2,'0')} / 60`;});
  el('branch-detail').addEventListener('change',e=>{el('branch-grid').classList.toggle('show-detail',e.target.checked);branchTick();});
  new IntersectionObserver(entries=>{if(!entries[0].isIntersecting)stopBranches();},{threshold:.1}).observe(el('branch-grid'));

  // Curated video wall. Originals are loaded only as their previews enter view.
  let dataset='all',action='all',shown=12,filtered=[],previewEnabled=!reduced;
  el('preview-toggle').checked=previewEnabled;
  const observedCards=new Set();
  const previewObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
    const video=entry.target.querySelector('video');if(!video)return;
    if(entry.isIntersecting){observedCards.add(entry.target);if(previewEnabled){if(!video.src)video.src=video.dataset.src;video.play().then(()=>video.classList.add('is-ready')).catch(()=>{});}}
    else{observedCards.delete(entry.target);video.pause();}
  }),{threshold:.35});
  function renderLibrary(reset=true){
    if(reset){el('video-library').querySelectorAll('video').forEach(v=>v.pause());previewObserver.disconnect();observedCards.clear();el('video-library').innerHTML='';shown=12;}
    filtered=ordered.filter(v=>(dataset==='all'||v.dataset===dataset)&&(action==='all'||v.task===action));
    const existing=el('video-library').children.length;
    filtered.slice(existing,shown).forEach(v=>{
      const b=document.createElement('button');b.className='library-card';b.setAttribute('aria-label',`Open ${v.dataset} ${actionLabel(v)} scene ${v.id}`);b.dataset.id=v.id;
      b.innerHTML=`<div class="library-media"><img src="${v.poster}" width="576" height="384" alt="" loading="lazy"><video data-src="${v.video}" muted loop playsinline preload="none" aria-hidden="true"></video><span class="open-mark" aria-hidden="true">↗</span></div><span class="library-card-label"><strong>${actionLabel(v)}</strong></span>`;
      b.querySelector('video').muted=true;b.addEventListener('click',()=>{observedCards.forEach(c=>c.querySelector('video').pause());stopBranches();chooseVideo(v,{autoplay:true,scroll:true});});el('video-library').appendChild(b);previewObserver.observe(b);
    });
    el('library-count').textContent=`${filtered.length} videos${dataset!=='all'?' · '+dataset:''}${action!=='all'?' · '+actionNames[action]:''}`;
    el('library-progress').textContent=`${Math.min(shown,filtered.length)} / ${filtered.length} shown`;
    el('library-more').disabled=shown>=filtered.length;el('library-more').textContent=shown>=filtered.length?'All matching videos shown':'Show 12 more videos';
    document.querySelectorAll('[data-library-dataset]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.libraryDataset===dataset));document.querySelectorAll('[data-library-action]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.libraryAction===action));
  }
  document.querySelectorAll('[data-library-dataset]').forEach(b=>b.addEventListener('click',()=>{dataset=b.dataset.libraryDataset;renderLibrary();}));document.querySelectorAll('[data-library-action]').forEach(b=>b.addEventListener('click',()=>{action=b.dataset.libraryAction;renderLibrary();}));
  el('library-more').addEventListener('click',()=>{shown+=12;renderLibrary(false);});el('preview-toggle').addEventListener('change',e=>{previewEnabled=e.target.checked;observedCards.forEach(c=>{const v=c.querySelector('video');if(previewEnabled){if(!v.src)v.src=v.dataset.src;v.play().then(()=>v.classList.add('is-ready')).catch(()=>{});}else v.pause();});});
  renderLibrary();
  document.addEventListener('visibilitychange',()=>{if(document.hidden){vid.pause();stopBranches();el('video-library').querySelectorAll('video').forEach(v=>v.pause());}});
})();
