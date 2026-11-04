// Sample items. Replace with real news.
const NEWS=[
{d:'2026-09-01',c:'Announcement',t:'Applications are open',s:'Apply online for the 2026-2027 school year using the Register page.'},
{d:'2026-09-15',c:'Event',t:'Open day for parents and students',s:'Meet the teachers, see the classrooms and ask questions about each program.'},
{d:'2026-10-05',c:'Announcement',t:'Fee payment reminder',s:'Please pay first-term fees and keep your receipt. See the Tuition Fees page.'},
{d:'2026-10-20',c:'Event',t:'Software Development showcase',s:'Students present the websites and apps they built this term.'}];
let f='All';const list=$('#nl');
function draw(){const l=NEWS.filter(n=>f==='All'||n.c===f).sort((a,b)=>b.d.localeCompare(a.d));
 const locale=document.body.dataset.lang==='rw'?'rw':'en';
 const months=['Mutarama','Gashyantare','Werurwe','Mata','Gicurasi','Kamena','Nyakanga','Kanama','Nzeri','Ukwakira','Ugushyingo','Ukuboza'];
 list.innerHTML=l.length?l.map(n=>{
  const date=new Date(n.d+'T00:00:00Z');
  const formatted=locale==='rw'
   ? `${date.getUTCDate()} ${months[date.getUTCMonth()]} ${date.getUTCFullYear()}`
   : date.toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'});
  return `<article class="ncard"><time datetime="${n.d}">${formatted}</time><div><h3>${n.t}</h3><p>${n.s}</p></div></article>`;
 }).join(''):'<p class="empty">Nothing here yet.</p>'}
$$('.chip').forEach(b=>b.onclick=()=>{f=b.dataset.f;$$('.chip').forEach(x=>x.setAttribute('aria-pressed',x===b));draw()});draw();
window.addEventListener('ktss-language-change',draw);