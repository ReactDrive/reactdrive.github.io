'use strict';
(() => {
  const data=window.REACTDRIVE_RESULTS, extra=window.REACTDRIVE_EXTRA;
  const el=id=>document.getElementById(id), red='#6658f5', grey='#aebbd0', muted='#73798a', line='#edf0f5';
  const f=n=>Number(n).toFixed(2), sign=n=>`${n>0?'+':''}${Number(n).toFixed(1)}`;
  const text=(x,y,s,size=12,color=muted,anchor='start',weight=400)=>`<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="Arial,sans-serif" font-size="${size}" fill="${color}" font-weight="${weight}">${s}</text>`;
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const compactQuery=matchMedia('(max-width:600px)');
  const planningGeometry=()=>({w:compactQuery.matches?440:620,h:377,L:compactQuery.matches?142:218,R:47,top:19,bottom:303,ticks:329,axis:358});
  const planningType=()=>compactQuery.matches?{tick:15,label:17,value:16,axis:14}:{tick:20,label:21,value:19,axis:18};
  // Matching canvases keep labels and axes aligned without changing either scale.
  function drawPlanningScores(){
    const {w,h,L,R,top,bottom,ticks,axis}=planningGeometry(),x=v=>L+(v-83)/3*(w-L-R);
    const type=planningType();
    let svg=`<svg data-chart viewBox="0 0 ${w} ${h}" role="group" aria-label="PDMS on an expanded 83 to 86 scale. Real data 83.8, Cosmos3 augmentation 83.8, ReactDrive augmentation 85.1.">`;
    [83,84,85,86].forEach(v=>{svg+=`<line x1="${x(v)}" x2="${x(v)}" y1="${top}" y2="${bottom}" stroke="${line}"/>`+text(x(v),ticks,v,type.tick,muted,'middle');});
    svg+=`<line x1="${x(83.8)}" x2="${x(83.8)}" y1="${top}" y2="${bottom}" stroke="#c3cbda" stroke-dasharray="3 4"/>`;
    const vals=data.planning.metrics.pdms.values;
    ['Real data','+ Cosmos3','+ ReactDrive'].forEach((name,i)=>{
      const y=top+(i+.5)*(bottom-top)/3,c=i===2?red:grey;
      svg+=`<g data-chart-item data-chart-index="${i}" data-chart-name="${name}" data-chart-value="${vals[i].toFixed(1)}" data-chart-context="Predictive Driver Model Score · Higher is better" tabindex="0" role="img" aria-label="${name}: ${vals[i].toFixed(1)}"><title>${name}: ${vals[i].toFixed(1)}</title><rect class="chart-hit" x="5" y="${y-22}" width="${w-10}" height="45" rx="4"/>`;
      svg+=text(L-12,y+6,name,type.label,i===2?red:muted,'end',i===2?700:400);
      svg+=`<circle data-chart-dot cx="${x(vals[i])}" cy="${y}" r="${i===2?6:5}" fill="${c}"/><g data-chart-label>`+text(x(vals[i])+12,y+6,vals[i].toFixed(1),type.value,i===2?red:muted,'start',i===2?700:400)+'</g></g>';
    });
    svg+=text((L+w-R)/2,axis,'PDMS ↑',type.axis,muted,'middle')+'</svg>';
    el('planning-chart').innerHTML=svg;window.ReactDriveCharts?.mount(el('planning-chart'));
  }
  function drawPlanningDeltas(){
    const compact=compactQuery.matches;
    const type=planningType();
    const {w,h,L,R,top,bottom,ticks,axis}=planningGeometry(),min=-.5,max=1.2,x=v=>L+(v-min)/(max-min)*(w-L-R),zero=x(0);
    let svg=`<svg data-chart viewBox="0 0 ${w} ${h}" role="group" aria-label="Changes in planning subscores compared with training on real data, in percentage points. Cosmos3: 0, 0, minus 0.4, plus 0.1, 0, 0. ReactDrive: plus 0.6, plus 0.8, plus 0.6, plus 0.9, 0, plus 0.1.">`;
    [-.5,0,.5,1].forEach(v=>{svg+=`<line x1="${x(v)}" x2="${x(v)}" y1="${top}" y2="${bottom}" stroke="${v===0?'#bac3d3':line}" stroke-width="${v===0?1.2:.7}"/>`+text(x(v),ticks,v===0?'0':sign(v),type.tick,muted,'middle');});
    const fullNames=['No-at-fault collision','Drivable-area compliance','Time-to-collision','Ego progress','Comfort','Driving direction'];
    const names=['NC','DAC','TTC','EP','Comfort','DDC'];
    extra.planningDeltas.filter(r=>r.key!=='pdms').forEach((r,i)=>{
      const y=38+i*48;
      svg+=text(L-12,y+6,`<title>${fullNames[i]}</title>${names[i]}`,type.label,'#535e73','end');
      [[r.cosmos3DeltaVsReal,grey,y-10,'Cosmos3'],[r.deltaVsReal,red,y+10,'ReactDrive']].forEach(([v,c,yy,name],j)=>{
        const description=esc(fullNames[i]+' · vs. real data'),value=sign(v)+' pp';
        svg+=`<g data-chart-item data-chart-index="${i*2+j}" data-chart-name="${name}" data-chart-value="${value}" data-chart-context="${description}" tabindex="0" role="img" aria-label="${name}, ${description}: ${value}"><title>${name}: ${value}</title><rect class="chart-hit" x="${L-3}" y="${yy-8}" width="${w-L-R+34}" height="16" rx="2"/>`;
        if(v!==0)svg+=`<rect data-chart-bar="${v<0?'negative':'horizontal'}" x="${Math.min(zero,x(v))}" y="${yy-4}" width="${Math.abs(x(v)-zero)}" height="8" fill="${c}" rx="1"/>`;
        else svg+=`<circle data-chart-dot cx="${zero}" cy="${yy}" r="3" fill="${c}"/>`;
        if (v !== 0) svg+='<g data-chart-label>'+text(x(v)+(v<0?2:9),yy+(v<0?-8:6),sign(v),type.value,c===red?red:muted,'start',c===red?700:400)+'</g>';
        svg+='</g>';
      });
    });
    svg+=text((L+w-R)/2,axis,'Δ (pp) ↑',type.axis,muted,'middle')+'</svg>';
    el('planning-deltas').innerHTML=svg;window.ReactDriveCharts?.mount(el('planning-deltas'));
  }
  function renderBoth(){drawPlanningScores();drawPlanningDeltas();}
  renderBoth();
  compactQuery.addEventListener('change',renderBoth);
  const labels=k=>data.metrics[k].label+(k==='cr'?' (%)':'')+' ↓';
  function matrix(methods,keys,values){return '<table><thead><tr><th>Method</th>'+keys.map(k=>`<th>${labels(k)}</th>`).join('')+'</tr></thead><tbody>'+methods.map((name,i)=>`<tr${i===methods.length-1?' class="ours-row"':''}><td>${name}</td>`+keys.map(k=>`<td${values[k][i]===Math.min(...values[k])?' class="best"':''}>${f(values[k][i])}</td>`).join('')+'</tr>').join('')+'</tbody></table>';}
  el('ablation-full').innerHTML=matrix(extra.ablationMethods,['fid','fvd','agentADE','agentFDE'],extra.ablationFactual);
  const ablation=()=>{el('ablation-actions').innerHTML=matrix(extra.ablationMethods,['egoADE','egoFDE','cr'],extra.ablationCounterfactual[el('ablation-group').value]);};
  el('ablation-group').addEventListener('change',ablation);ablation();
  const groups={overall:'All actions',laneChange:'Lane changes',accelerationDeceleration:'Speed up / slow down',stop:'Stop'};
  let all='<table><thead><tr><th>Dataset / evaluation</th><th>Method</th><th>Agent ADE ↓</th><th>Agent FDE ↓</th><th>FVD ↓</th><th>FID ↓</th><th>Ego ADE ↓</th><th>Ego FDE ↓</th><th>CR (%) ↓</th></tr></thead><tbody>';
  Object.entries(data.datasets).forEach(([dataset,d])=>{
    [['Recorded actions',d.factual],...Object.entries(groups).map(([key,name])=>[name,d.counterfactual[key]])].forEach(([name,values])=>{
      all+=`<tr class="table-divider"><td colspan="9">${dataset} · ${name}</td></tr>`;
      data.methods.forEach((method,i)=>{all+=`<tr${i===5?' class="ours-row"':''}><td>${dataset}</td><td>${method}</td>`+['agentADE','agentFDE','fvd','fid','egoADE','egoFDE','cr'].map(k=>values[k]?`<td${values[k][i]===Math.min(...values[k])?' class="best"':''}>${f(values[k][i])}</td>`:'<td>—</td>').join('')+'</tr>';});
    });
  });
  el('all-main-results').innerHTML=all+'</tbody></table>';
})();
