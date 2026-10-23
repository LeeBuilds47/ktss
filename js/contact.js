const f=$('#cf');
f.onsubmit=e=>{e.preventDefault();let ok=true;
 const n=$('#cn'),m=$('#ce'),s=$('#cm');
 ok=validRow(n,!n.value.trim())&ok;
 ok=validRow(m,!/^\S+@\S+\.\S+$/.test(m.value.trim()))&ok;
 ok=validRow(s,s.value.trim().length<10)&ok;
 if(!ok)return;
 f.hidden=true;$('#cok').hidden=false};