const tabs=$$('.tab'),panels=$$('.panel');
function open(k,push){let found=false;tabs.forEach(t=>{const on=t.dataset.tab===k;if(on)found=true;t.setAttribute('aria-selected',on)});
 if(!found)return open('principal',push);
 panels.forEach(p=>p.hidden=p.id!=='p-'+k);if(push)history.replaceState(null,'','?tab='+k)}
tabs.forEach(t=>t.onclick=()=>open(t.dataset.tab,true));
tabs.forEach((t,i)=>t.onkeydown=e=>{const n=e.key==='ArrowRight'?1:e.key==='ArrowLeft'?-1:0;if(n){const x=tabs[(i+n+tabs.length)%tabs.length];x.focus();x.click()}});
open(new URLSearchParams(location.search).get('tab')||'principal');