const NOTES={
  en:['Applications are open for the 2026-2027 school year.','See the Tuition Fees page for fees and how to pay.','Questions? Read the FAQ or contact the school office.'],
  rw:['Amasomo yatangiye gufungura umwaka w\'amashuri 2026-2027.','Reba urupapuro rw\'amafaranga y\'ishuri kugira umenye amafaranga n\'uburyo bwo kubishyura.','Ibibazo? Soma FAQ cyangwa uvugane n\'ibiro by\'ishuri.']
};
const bar=$('#banner'),bt=$('#bt');let i=0,paused=false;
const show=()=>{
 const locale=(document.body&&document.body.dataset&&document.body.dataset.lang)||'en';
 bt.textContent=NOTES[locale] ? NOTES[locale][i++%NOTES[locale].length] : NOTES.en[i++%NOTES.en.length];
};
show();
window.addEventListener('ktss-language-change',()=>{i=0;show()});
bar.onmouseenter=()=>paused=true;bar.onmouseleave=()=>paused=false;
setInterval(()=>{if(!paused)show()},3000);

const heroSlides=$$('.hero-slide',$('#heroSlides'));
const heroControls=$('#heroControls');
if(heroSlides.length>0&&heroControls){
  let current=heroSlides.findIndex(slide=>slide.classList.contains('is-active'));
  if(current<0)current=0;
  let stopped=matchMedia('(prefers-reduced-motion: reduce)').matches;
  let timer;
  const count=$('.slide-count',heroControls);
  const toggle=$('[data-slide="toggle"]',heroControls);
  const displaySlide=index=>{
   current=(index+heroSlides.length)%heroSlides.length;
   heroSlides.forEach((slide,i)=>{
    const active=i===current;
    slide.classList.toggle('is-active',active);
    slide.setAttribute('aria-hidden',String(!active));
    slide.setAttribute('aria-label','Photo '+(i+1)+' of '+heroSlides.length);
   });
   count.textContent='Photo '+(current+1)+' of '+heroSlides.length;
   if(window.localStorage){
     try{localStorage.setItem('ktss-home-slide',String(current));}catch(error){console.warn('Could not save slideshow position.',error);}
   }
  };
  const schedule=()=>{
   clearInterval(timer);
   if(!stopped)timer=setInterval(()=>displaySlide(current+1),2200);
   const label=stopped?'Play slideshow':'Pause slideshow';
   toggle.textContent=label;
   toggle.dataset.paused=String(stopped);
   toggle.setAttribute('aria-label',label);
  };
  try {
   const savedIndex=Number(localStorage.getItem('ktss-home-slide'));
   if(Number.isInteger(savedIndex) && savedIndex >= 0 && savedIndex < heroSlides.length) current=savedIndex;
  } catch (error) { console.warn('Could not restore slideshow position.', error); }
  displaySlide(current);
  heroControls.hidden=false;
  $('[data-slide="previous"]',heroControls).onclick=()=>displaySlide(current-1);
  $('[data-slide="next"]',heroControls).onclick=()=>displaySlide(current+1);
  toggle.onclick=()=>{stopped=!stopped; schedule();};
  schedule();
  window.updateSlideStatus=(lang)=>{
   const label = stopped ? 'Play slideshow' : 'Pause slideshow';
   const translation = lang === 'rw' ? (stopped ? 'Tangira amashusho' : 'Hagarika amashusho') : label;
   toggle.textContent = translation;
   toggle.setAttribute('aria-label', translation);
   count.textContent = (lang === 'rw' ? 'Ifoto ' : 'Photo ') + (current+1) + (lang === 'rw' ? ' ya ' : ' of ') + heroSlides.length;
  };
  window.updateSlideStatus(document.body.dataset.lang||'en');
}
renderPrograms($('#homeProgs'));