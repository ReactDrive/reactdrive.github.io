'use strict';
(() => {
  const preference=window.matchMedia('(prefers-reduced-motion: reduce)');
  const mounted=new WeakSet(), activeAnimations=new Set();
  let tooltip, currentItem;
  const canAnimate=typeof Element.prototype.animate==='function';
  const animate=(node,frames,options)=>{
    if(!canAnimate||preference.matches)return;
    const animation=node.animate(frames,{duration:760,easing:'cubic-bezier(.22,.68,.2,1)',...options});
    activeAnimations.add(animation);
    animation.finished.then(()=>activeAnimations.delete(animation),()=>activeAnimations.delete(animation));
  };
  function play(chart){
    if(preference.matches||!canAnimate)return;
    try {
      chart.querySelectorAll('[data-chart-bar]').forEach((node,i)=>{
        const direction=node.dataset.chartBar, vertical=direction==='vertical';
        node.style.transformBox='fill-box';
        node.style.transformOrigin=vertical?'center bottom':direction==='negative'?'right center':'left center';
        animate(node,[{transform:vertical?'scaleY(0)':'scaleX(0)'},{transform:'none'}],{delay:Math.min(i*45,260),fill:'backwards'});
      });
      chart.querySelectorAll('[data-chart-line]').forEach(node=>{
        const length=node.getTotalLength();
        animate(node,[{strokeDasharray:`${length} ${length}`,strokeDashoffset:length,opacity:0},{strokeDasharray:`${length} ${length}`,strokeDashoffset:0,opacity:1}],{duration:1050,delay:190,fill:'backwards'});
      });
      chart.querySelectorAll('[data-chart-dot]').forEach((node,i)=>{
        node.style.transformBox='fill-box';node.style.transformOrigin='center';
        animate(node,[{opacity:0,transform:'scale(.5)'},{opacity:1,transform:'none'}],{duration:460,delay:210+Math.min(i*45,260),fill:'backwards'});
      });
      chart.querySelectorAll('[data-chart-label]').forEach((node,i)=>animate(node,[{opacity:0},{opacity:1}],{duration:430,delay:310+Math.min(i*45,260),fill:'backwards'}));
    } catch(error) {
      // Final geometry is always in the markup, even when animation is unavailable.
      chart.getAnimations({subtree:true}).forEach(animation=>animation.cancel());
    }
  }
  const observer='IntersectionObserver' in window?new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){observer.unobserve(entry.target);play(entry.target);}
      else if(!entry.target.isConnected)observer.unobserve(entry.target);
    });
  },{threshold:.12}):null;
  function getTooltip(){
    if(tooltip)return tooltip;
    tooltip=document.createElement('div');tooltip.className='chart-tooltip';tooltip.id='chart-detail-tooltip';tooltip.setAttribute('role','tooltip');tooltip.hidden=true;
    document.body.appendChild(tooltip);return tooltip;
  }
  function positionTooltip(item,event){
    const tip=getTooltip(), bounds=item.getBoundingClientRect();
    const x=event&&Number.isFinite(event.clientX)?event.clientX:bounds.x+bounds.width/2;
    const y=event&&Number.isFinite(event.clientY)?event.clientY:bounds.y;
    const tipBounds=tip.getBoundingClientRect();
    const left=Math.max(12,Math.min(innerWidth-tipBounds.width-12,x-tipBounds.width/2));
    let top=y-tipBounds.height-15;if(top<12)top=Math.min(innerHeight-tipBounds.height-12,y+21);
    tip.style.left=`${left}px`;tip.style.top=`${top}px`;
  }
  function show(item,event){
    const chart=item.closest('[data-chart]');if(!chart)return;
    if(currentItem&&currentItem!==item)hide();currentItem=item;
    chart.classList.add('chart-is-inspecting');
    chart.querySelectorAll('[data-chart-index]').forEach(node=>node.classList.toggle('chart-is-selected',node.dataset.chartIndex===item.dataset.chartIndex));
    const tip=getTooltip();tip.replaceChildren();
    const name=document.createElement('strong'),value=document.createElement('span'),context=document.createElement('small');
    name.textContent=item.dataset.chartName||'';value.textContent=item.dataset.chartValue||'';context.textContent=item.dataset.chartContext||'';
    tip.append(name,value,context);tip.hidden=false;item.setAttribute('aria-describedby',tip.id);positionTooltip(item,event);
  }
  function hide(){
    if(currentItem){const chart=currentItem.closest('[data-chart]');chart?.classList.remove('chart-is-inspecting');chart?.querySelectorAll('.chart-is-selected').forEach(node=>node.classList.remove('chart-is-selected'));currentItem.removeAttribute('aria-describedby');currentItem=null;}
    if(tooltip)tooltip.hidden=true;
  }
  function mount(root=document){
    const charts=[...(root.matches?.('[data-chart]')?[root]:[]),...root.querySelectorAll('[data-chart]')];
    charts.forEach(chart=>{
      if(mounted.has(chart))return;mounted.add(chart);chart.classList.add('native-chart');
      chart.querySelectorAll('[data-chart-item]').forEach(item=>{
        item.addEventListener('pointerenter',event=>show(item,event));item.addEventListener('pointermove',event=>positionTooltip(item,event));
        item.addEventListener('pointerleave',()=>{if(document.activeElement!==item)hide();});
        item.addEventListener('focus',()=>show(item));item.addEventListener('blur',hide);
        item.addEventListener('keydown',event=>{if(event.key==='Escape')hide();});
      });
      if(observer&&!preference.matches)observer.observe(chart);else play(chart);
    });
  }
  preference.addEventListener('change',()=>{if(preference.matches){activeAnimations.forEach(animation=>animation.cancel());activeAnimations.clear();}});
  window.addEventListener('scroll',hide,{passive:true});window.addEventListener('resize',hide,{passive:true});
  window.ReactDriveCharts={mount,play};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>mount());else mount();
})();
