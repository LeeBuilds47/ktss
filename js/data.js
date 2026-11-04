// Edit program details here. Used by Home, Programs, Program, Register and Fees pages.
const PROGRAMS=[
{key:'olevel',t:"O'Level",sum:"Lower secondary education that builds a strong base for further studies and technical training.",dur:'3 years',termFee:93000,lvl:'Lower secondary (S1-S3)',
 learn:['Core subjects such as mathematics, sciences, languages and social studies','Basic ICT and practical skills',"Preparation for the national O'Level exam"],
 req:['Primary Leaving Certificate (completed Primary 6)','Birth certificate or national ID','Previous school report or transfer letter (for transfers)','Recent passport photo','Health insurance card (e.g. RSSB)','Parent or guardian contact details']},
{key:'software',t:'Software Development',sum:'Practical training in building websites, apps and other software.',dur:'3 years',termFee:93000,lvl:'Upper secondary technical (S4-S6)',
 learn:['Programming fundamentals and problem solving','Web and mobile app development','Databases and software testing','Real projects and workplace practice'],
 req:["O'Level certificate (completed Senior 3)",'Transcript or school report showing your marks','Interest in computers and logical thinking','Birth certificate or national ID','Recent passport photo','Health insurance card (e.g. RSSB)','Parent or guardian contact details']},
{key:'accounting',t:'Accounting',sum:'Training in bookkeeping, financial records and business accounts.',dur:'3 years',termFee:93000,lvl:'Upper secondary technical (S4-S6)',
 learn:['Bookkeeping and financial statements','Business mathematics and taxation basics','Accounting software and spreadsheets','Real projects and workplace practice'],
 req:["O'Level certificate (completed Senior 3)",'Transcript or school report showing your marks','Good basic mathematics','Birth certificate or national ID','Recent passport photo','Health insurance card (e.g. RSSB)','Parent or guardian contact details']}];
function renderPrograms(el,q){q=(q||'').toLowerCase();
 const l=PROGRAMS.filter(p=>{
  const localized=window.ktssTranslateText ? `${window.ktssTranslateText(p.t)} ${window.ktssTranslateText(p.sum)}` : '';
  return (p.t+' '+p.sum+' '+localized).toLowerCase().includes(q);
 });
 const emptyText=window.ktssT ? window.ktssT('programsPage.empty','No program matches your search.') : 'No program matches your search.';
 el.innerHTML=l.length?l.map(p=>`<a class="prog" href="program.html?p=${p.key}"><h3>${p.t}</h3><p>${p.sum}</p><span class="more">View requirements →</span></a>`).join(''):`<p class="empty">${emptyText}</p>`}