const sel=$('#prg');sel.innerHTML='<option value="">Select a program</option>'+PROGRAMS.map(p=>`<option value="${p.key}">${p.t}</option>`).join('');
const pre=new URLSearchParams(location.search).get('program');if(pre)sel.value=pre;
function showProgramFee(){
 const program=PROGRAMS.find(p=>p.key===sel.value);
 const term=window.ktssT('register.programFee','RWF per term');
 const hint=window.ktssT('register.feeHint','Select a program to see its tuition fee.');
 $('#program-fee').textContent=program?`${program.termFee.toLocaleString('en-US')} ${term}`:hint;
}
sel.onchange=showProgramFee;showProgramFee();
window.addEventListener('ktss-language-change',showProgramFee);
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
let photoDataUrl='';
function pick(f){fe.textContent='';if(!f)return;
 if(!/^image\/(jpeg|png|webp)$/.test(f.type)){fe.textContent=window.ktssT('register.uploadError','Use a JPG, PNG or WEBP image.');file.value='';photoDataUrl='';return}
 if(f.size>2*1024*1024){fe.textContent=window.ktssT('register.uploadTooBig','Image is larger than 2MB. Choose a smaller one.');file.value='';photoDataUrl='';return}
 const reader=new FileReader();
 reader.onload=()=>{photoDataUrl=String(reader.result||'');$('#dn').textContent=f.name};
 reader.onerror=()=>{photoDataUrl='';fe.textContent=window.ktssT('register.uploadReadError','Could not read the selected passport photo. Please try another file.')};
 reader.readAsDataURL(f);
}
drop.onclick=()=>file.click();drop.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();file.click()}};
file.onchange=()=>pick(file.files[0]);
['dragover','dragenter'].forEach(t=>drop.addEventListener(t,e=>{e.preventDefault();drop.classList.add('over')}));
['dragleave','drop'].forEach(t=>drop.addEventListener(t,e=>{e.preventDefault();drop.classList.remove('over')}));
drop.addEventListener('drop',e=>{const f=e.dataTransfer.files[0];if(f){const dt=new DataTransfer();dt.items.add(f);file.files=dt.files;pick(f)}});
$('#f').onsubmit=async e=>{
 e.preventDefault();
 const submitError=$('#submit-error');
 submitError.hidden=true;
 const firstInvalid=panes.findIndex(pane=>!valid(pane));
 if(firstInvalid>=0){show(firstInvalid);return}
 const submitButton=$('#f [type="submit"]');
 submitButton.disabled=true;
 try{
  const response=await fetch('/api/applications',{
   method:'POST',
   headers:{'Content-Type':'application/json'},
   body:JSON.stringify({
    firstName:$('#fn').value,
    lastName:$('#ln').value,
    gender:$('#g').value,
    dateOfBirth:$('#dob').value,
    program:$('#prg').value,
    nationality:$('#nat').value,
    residence:$('#res').value,
    phone:$('#ph').value,
    email:$('#em').value,
    guardianName:$('#pn').value,
    guardianPhone:$('#pp').value,
    healthInsurance:$('#hi').value,
    photoDataUrl
   })
  });
  const result=await response.json();
  if(!response.ok)throw new Error(result.errors?.join(' ')||result.error||window.ktssT('register.submitError','We could not submit your application. Please try again.'));
  $('#application-ref').textContent=result.id;
  $('#f').hidden=true;
  $('#steps').hidden=true;
  $('#ok').style.display='block';
 }catch(error){
  submitError.textContent=error instanceof TypeError
   ? window.ktssT('register.serviceUnavailable','The application service is unavailable. Please try again later.')
   : (window.ktssTranslateText?window.ktssTranslateText(error.message):error.message);
  submitError.hidden=false;
 }finally{
  submitButton.disabled=false;
 }
};
window.addEventListener('ktss-language-change',()=>{
 if(fe.textContent)fe.textContent=window.ktssTranslateText?window.ktssTranslateText(fe.textContent):fe.textContent;
});