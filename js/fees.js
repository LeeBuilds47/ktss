const fmt=n=>n.toLocaleString('en-US')+' RWF';
$('#ft').innerHTML=PROGRAMS.map(p=>`<tr><td>${p.t}</td><td>${fmt(p.termFee)}</td><td>${fmt(p.termFee*3)}</td></tr>`).join('');
const sel=$('#cp'),nt=$('#cn'),out=$('#co');
sel.innerHTML=PROGRAMS.map(p=>`<option value="${p.key}">${p.t}</option>`).join('');
function calc(){const program=PROGRAMS.find(p=>p.key===sel.value),n=Math.min(3,Math.max(1,+nt.value||1));out.textContent=fmt(program.termFee*n)}
sel.onchange=nt.oninput=calc;calc();