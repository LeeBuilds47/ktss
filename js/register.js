const sel=$('#prg');sel.innerHTML='<option value="">Select a program</option>'+PROGRAMS.map(p=>`<option value="${p.key}">${p.t}</option>`).join('');
const pre=new URLSearchParams(location.search).get('program');if(pre)sel.value=pre;
function showProgramFee(){const program=PROGRAMS.find(p=>p.key===sel.value);$('#program-fee').textContent=program?`${program.termFee.toLocaleString('en-US')} RWF per term`:'Select a program to see its tuition fee.'}
sel.onchange=showProgramFee;showProgramFee();
let cur=0;const panes=$$('.pane'),steps=$$('.step'),lines=$$('.line');
function show(n){cur=n;panes.forEach((p,i)=>p.classList.toggle('on',i===n));
 steps.forEach((s,i)=>{s.classList.toggle('on',i===n);s.classList.toggle('done',i<n);s.querySelector('i').textContent=i<n?'✓':i+1});
 lines.forEach((l,i)=>l.classList.toggle('done',i<n));$('.form').scrollIntoView()}
function valid(p){let ok=true;p.querySelectorAll('input,select').forEach(el=>{if(!el.closest('.row'))return;let bad=false;const v=el.value.trim();
 if(el.required&&!v)bad=true;if(el.type==='tel'&&v&&v.replace(/\D/g,'').length<9)bad=true;
 if(el.type==='email'&&v&&!/^\S+@\S+\.\S+$/.test(v))bad=true;if(el.id==='dob'&&v&&new Date(v)>new Date())bad=true;
 if(!validRow(el,bad))ok=false});return ok}
$$('[data-next]').forEach(b=>b.onclick=()=>{if(valid(panes[cur]))show(cur+1)});
$$('[data-prev]').forEach(b=>b.onclick=()=>show(cur-1));
const drop=$('#drop'),file=$('#file'),fe=$('#fe');
function pick(f){fe.textContent='';if(!f)return;
 if(!/^image\/(jpeg|png|webp)$/.test(f.type)){fe.textContent='Use a JPG, PNG or WEBP image.';file.value='';return}
 if(f.size>2*1024*1024){fe.textContent='Image is larger than 2MB. Choose a smaller one.';file.value='';return}
 $('#dn').textContent=f.name}
drop.onclick=()=>file.click();drop.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();file.click()}};
file.onchange=()=>pick(file.files[0]);
['dragover','dragenter'].forEach(t=>drop.addEventListener(t,e=>{e.preventDefault();drop.classList.add('over')}));
['dragleave','drop'].forEach(t=>drop.addEventListener(t,e=>{e.preventDefault();drop.classList.remove('over')}));
drop.addEventListener('drop',e=>{const f=e.dataTransfer.files[0];if(f){const dt=new DataTransfer();dt.items.add(f);file.files=dt.files;pick(f)}});
$('#f').onsubmit=e=>{e.preventDefault();if(!valid(panes[cur]))return;$('#f').hidden=true;$('#steps').hidden=true;$('#ok').style.display='block'};