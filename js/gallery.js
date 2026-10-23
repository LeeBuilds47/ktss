// Add photos: set src to an image path, e.g. src:'img/lab.jpg'
const PH=Array.from({length:9},(_,i)=>({cap:'School photo '+(i+1),src:''}));
const g=$('#gal');let cur=0,lb=null,last=null;
g.innerHTML=PH.map((p,i)=>`<button class="tile" data-i="${i}" aria-label="Open ${p.cap}">${p.src?`<img src="${p.src}" alt="${p.cap}" loading="lazy">`:p.cap}</button>`).join('');
g.onclick=e=>{const b=e.target.closest('.tile');if(b){last=b;open(+b.dataset.i)}};
function open(i){cur=(i+PH.length)%PH.length;const p=PH[cur];
 if(!lb){lb=document.createElement('div');lb.className='lb';lb.setAttribute('role','dialog');lb.setAttribute('aria-modal','true');lb.setAttribute('aria-label','Photo viewer');
  lb.innerHTML='<button id="lx" style="top:20px;right:20px" aria-label="Close">×</button><button id="lp" style="left:20px" aria-label="Previous">‹</button><button id="ln" style="right:20px" aria-label="Next">›</button><figure><div class="big" id="lbig"></div><figcaption id="lcap" style="margin-top:12px"></figcaption></figure>';
  document.body.appendChild(lb);lb.querySelector('#lx').onclick=close;lb.querySelector('#lp').onclick=()=>open(cur-1);lb.querySelector('#ln').onclick=()=>open(cur+1);
  lb.onclick=e=>{if(e.target===lb)close()};lb.querySelector('#lx').focus()}
 lb.querySelector('#lbig').innerHTML=p.src?`<img src="${p.src}" alt="${p.cap}" style="object-fit:contain">`:p.cap;lb.querySelector('#lcap').textContent=p.cap+' ('+(cur+1)+'/'+PH.length+')'}
function close(){if(lb){lb.remove();lb=null;last&&last.focus()}}
addEventListener('keydown',e=>{if(!lb)return;if(e.key==='Escape')close();if(e.key==='ArrowRight')open(cur+1);if(e.key==='ArrowLeft')open(cur-1)});