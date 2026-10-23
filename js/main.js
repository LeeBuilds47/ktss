(function(){
const $=(s,c=document)=>c.querySelector(s);
window.$=$;window.$$=(s,c=document)=>[...c.querySelectorAll(s)];
const b=$('#burger'),m=$('#menu');
if(b)b.onclick=()=>{const o=m.classList.toggle('open');b.setAttribute('aria-expanded',o)};
const a=$('[data-nav="'+document.body.dataset.page+'"]');if(a)a.classList.add('on');
$$('[data-year]').forEach(e=>e.textContent=new Date().getFullYear());
const t=document.createElement('button');t.className='totop';t.textContent='↑';t.hidden=true;t.setAttribute('aria-label','Back to top');
t.onclick=()=>scrollTo({top:0,behavior:'smooth'});document.body.appendChild(t);
addEventListener('scroll',()=>{t.hidden=scrollY<500},{passive:true});
window.toast=msg=>{const d=document.createElement('div');d.className='toast';d.setAttribute('role','status');d.textContent=msg;document.body.appendChild(d);setTimeout(()=>d.remove(),2600)};
window.validRow=(el,bad)=>{const r=el.closest('.row');if(r)r.classList.toggle('bad',bad);return !bad};
})();