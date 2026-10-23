// DEMO ONLY: this does not log anyone in. Real login needs a backend.
$('#af').onsubmit=e=>{e.preventDefault();const u=$('#au'),p=$('#ap'),m=$('#am');
 m.textContent=(!u.value.trim()||!p.value)?'Enter your username and password.':'Admin login is not connected yet. It needs a backend to check passwords.'};