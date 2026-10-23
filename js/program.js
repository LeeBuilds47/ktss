const k=new URLSearchParams(location.search).get('p'),p=PROGRAMS.find(x=>x.key===k),c=$('#pc');
if(!p){c.innerHTML='<p class="empty">Program not found. <a href="programs.html" style="color:var(--blue)">See all programs</a>.</p>'}
else{document.title=p.t+' – KTSS';const li=a=>a.map(x=>'<li>'+x+'</li>').join('');
 c.innerHTML=`<div class="ph"><a class="back" href="programs.html">← All programs</a><h1>${p.t}</h1><p class="sum">${p.sum}</p>
 <div class="facts"><div>Duration<b>${p.dur}</b></div><div>Level<b>${p.lvl}</b></div><div>Start<b>September 2026</b></div></div>
 <h2>What you will learn</h2><ul>${li(p.learn)}</ul><h2>Admission requirements</h2><ul class="req">${li(p.req)}</ul>
 <div class="go"><a class="btn" href="register.html?program=${p.key}">Apply for ${p.t}</a></div></div>`}