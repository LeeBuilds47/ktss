const k=new URLSearchParams(location.search).get('p'),p=PROGRAMS.find(x=>x.key===k),c=$('#pc');
function renderProgram(locale){
 if(!p){
  c.innerHTML=`<p class="empty">${window.ktssT('programPage.notFound','Program not found.')} <a href="programs.html" style="color:var(--blue)">${window.ktssT('programPage.seeAll','See all programs')}</a>.</p>`;
  document.title=window.ktssTranslateText('Program – KTSS',locale);
  return;
 }
 document.title=window.ktssTranslateText(p.t+' – KTSS',locale);
 const li=a=>a.map(x=>'<li>'+x+'</li>').join('');
 const programName=window.ktssTranslateText(p.t,locale);
 const text = {
  back: window.ktssT('programPage.back','← All programs'),
  duration: window.ktssT('programPage.duration','Duration'),
  level: window.ktssT('programPage.level','Level'),
  start: window.ktssT('programPage.start','Start'),
  learn: window.ktssT('programPage.learn','What you will learn'),
  requirements: window.ktssT('programPage.requirements','Admission requirements'),
  applyFor: window.ktssT('programPage.applyFor','Apply for'),
  startMonth: window.ktssT('programPage.startMonth','September 2026'),
  programName
 };
 const applyLabel=locale==='rw'?`${text.applyFor} ${text.programName}`:`${text.applyFor} ${p.t}`;
 c.innerHTML=`<div class="ph"><a class="back" href="programs.html">${text.back}</a><h1>${text.programName}</h1><p class="sum">${p.sum}</p>
 <div class="facts"><div>${text.duration}<b>${p.dur}</b></div><div>${text.level}<b>${p.lvl}</b></div><div>${text.start}<b>${text.startMonth}</b></div></div>
 <h2>${text.learn}</h2><ul>${li(p.learn)}</ul><h2>${text.requirements}</h2><ul class="req">${li(p.req)}</ul>
 <div class="go"><a class="btn" href="register.html?program=${p.key}">${applyLabel}</a></div></div>`
}
renderProgram(document.body.dataset.lang||'en');
window.addEventListener('ktss-language-change',event=>renderProgram(event.detail.locale));