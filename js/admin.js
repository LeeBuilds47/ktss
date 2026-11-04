const loginPanel=$('#admin-login');
const dashboard=$('#admin-dashboard');
const loginForm=$('#af');
const loginMessage=$('#am');
const requestsBody=$('#request-rows');
const requestError=$('#request-error');
const detailDialog=$('#request-detail');
const state={page:1,pages:1,total:0,perPage:25,counts:{all:0,new:0,reviewing:0,accepted:0,rejected:0},selectedId:null,loading:false};
let searchTimer;

const text=(key,fallback)=>window.ktssT(`admin.${key}`,fallback);
const escapeText=value=>String(value??'');
const localized=value=>window.ktssTranslateText?window.ktssTranslateText(escapeText(value)):escapeText(value);
const statusLabel=status=>text(`statusNames.${status}`,status);
const dateLabel=value=>{
 if(!value)return '';
 const date=new Date(value);
 if(Number.isNaN(date.getTime()))return value;
 return new Intl.DateTimeFormat(document.documentElement.lang==='rw'?'rw-RW':'en-GB',{dateStyle:'medium',timeStyle:'short'}).format(date);
};
const programLabel=key=>({
 olevel:localized("O'Level"),
 software:localized('Software Development'),
 accounting:localized('Accounting')
}[key]||key);

async function api(url,options={}){
 const response=await fetch(url,{credentials:'same-origin',...options,headers:{...(options.body?{'Content-Type':'application/json'}:{}),...options.headers}});
 const contentType=response.headers.get('content-type')||'';
 const body=contentType.includes('application/json')?await response.json():null;
 if(!response.ok){
  const error=new Error(body?.error||text('requestFailed','Request failed. Please try again.'));
  error.status=response.status;
  throw error;
 }
 return body;
}

function showLogin(message=''){
 dashboard.hidden=true;
 loginPanel.hidden=false;
 loginMessage.textContent=message;
}

function showDashboard(){
 loginPanel.hidden=true;
 dashboard.hidden=false;
 loginMessage.textContent='';
 loadApplications();
}

function updateCounts(counts){
 state.counts=counts;
 ['all','new','reviewing','accepted','rejected'].forEach(key=>{
  const target=$(`#count-${key}`);
  if(target)target.textContent=String(counts[key]||0);
 });
}

function currentFilters(){
 return {
  q:$('#request-search').value.trim(),
  status:$('#request-status').value,
  program:$('#request-program').value,
  from:$('#request-from').value,
  to:$('#request-to').value
 };
}

function queryString(includePage=true){
 const params=new URLSearchParams();
 const filters=currentFilters();
 Object.entries(filters).forEach(([key,value])=>{if(value)params.set(key,value)});
 if(includePage){params.set('page',String(state.page));params.set('perPage',String(state.perPage))}
 return params.toString();
}

function displayError(message){
 requestError.textContent=message;
 requestError.hidden=!message;
}

function setLoading(){
 state.loading=true;
 requestsBody.replaceChildren();
 const row=document.createElement('tr');
 const cell=document.createElement('td');
 cell.colSpan=5;
 cell.className='admin-empty';
 cell.textContent=text('loading','Loading requests...');
 row.append(cell);
 requestsBody.append(row);
}

function renderRows(items){
 requestsBody.replaceChildren();
 if(!items.length){
  const row=document.createElement('tr');
  const cell=document.createElement('td');
  cell.colSpan=5;
  cell.className='admin-empty';
  cell.textContent=text('noRequests','No requests match these filters.');
  row.append(cell);
  requestsBody.append(row);
  return;
 }
 items.forEach(item=>{
  const row=document.createElement('tr');
  const applicant=document.createElement('td');
  const name=document.createElement('strong');
  name.textContent=`${item.firstName} ${item.lastName}`;
  const contact=document.createElement('span');
  contact.textContent=item.email||item.phone;
  applicant.append(name,contact);
  const program=document.createElement('td');
  program.textContent=programLabel(item.program);
  const submitted=document.createElement('td');
  submitted.textContent=dateLabel(item.createdAt);
  const status=document.createElement('td');
  const badge=document.createElement('span');
  badge.className=`status-badge status-${item.status}`;
  badge.textContent=statusLabel(item.status);
  status.append(badge);
  const actions=document.createElement('td');
  const open=document.createElement('button');
  open.className='request-open';
  open.type='button';
  open.textContent=text('viewRequest','View');
  open.addEventListener('click',()=>openRequest(item.id));
  actions.append(open);
  row.append(applicant,program,submitted,status,actions);
  requestsBody.append(row);
 });
}

async function loadApplications(){
 if(state.loading)return;
 state.loading=true;
 displayError('');
 setLoading();
 try{
  const data=await api(`/api/admin/applications?${queryString()}`);
  state.page=data.page;
  state.pages=data.pages;
  state.total=data.total;
  state.loading=false;
  updateCounts(data.counts);
  renderRows(data.items);
  const start=data.total?((data.page-1)*data.perPage)+1:0;
  const end=Math.min(data.page*data.perPage,data.total);
  $('#results-summary').textContent=text('showing','Showing')+` ${start}-${end} `+text('of','of')+` ${data.total} `+text('requests','requests');
  $('#page-summary').textContent=`${text('page','Page')} ${data.page} ${text('of','of')} ${data.pages}`;
  $('#page-previous').disabled=data.page<=1;
  $('#page-next').disabled=data.page>=data.pages;
 }catch(error){
  state.loading=false;
  if(error.status===401){showLogin(text('sessionExpired','Your admin session has ended. Please sign in again.'));return}
  requestsBody.replaceChildren();
  displayError(error.message);
 }
}

function detailField(container,label,value,href){
 const wrapper=document.createElement('div');
 wrapper.className='detail-field';
 const title=document.createElement('span');
 title.textContent=label;
 const valueElement=href?document.createElement('a'):document.createElement('strong');
 valueElement.textContent=value||'—';
 if(href)valueElement.href=href;
 wrapper.append(title,valueElement);
 container.append(wrapper);
}

async function openRequest(id){
 state.selectedId=id;
 $('#detail-title').textContent=text('loadingDetail','Loading request...');
 $('#detail-id').textContent='';
 $('#detail-fields').replaceChildren();
 $('#detail-error').hidden=true;
 $('#detail-photo-wrap').hidden=true;
 detailDialog.showModal();
 try{
  const request=await api(`/api/admin/applications/${encodeURIComponent(id)}`);
  if(state.selectedId!==id)return;
  $('#detail-title').textContent=`${request.firstName} ${request.lastName}`;
  $('#detail-id').textContent=`${text('requestId','Request ID')}: ${request.id} · ${text('submitted','Submitted')} ${dateLabel(request.createdAt)}`;
  const fields=$('#detail-fields');
  detailField(fields,text('gender','Gender'),localized(request.gender));
  detailField(fields,text('dateOfBirth','Date of birth'),request.dateOfBirth);
  detailField(fields,text('program','Program'),programLabel(request.program));
  detailField(fields,text('nationality','Nationality'),localized(request.nationality));
  detailField(fields,text('residence','Residence'),localized(request.residence));
  detailField(fields,text('phone','Phone'),request.phone,`tel:${request.phone}`);
  detailField(fields,text('email','Email'),request.email,request.email?`mailto:${request.email}`:undefined);
  detailField(fields,text('guardianName','Parent / guardian'),localized(request.guardianName));
  detailField(fields,text('guardianPhone','Parent / guardian phone'),request.guardianPhone,`tel:${request.guardianPhone}`);
  detailField(fields,text('healthInsurance','Health insurance'),localized(request.healthInsurance));
  $('#detail-status').value=request.status;
  $('#detail-notes').value=request.adminNotes||'';
  $('#detail-updated').textContent=request.updatedAt!==request.createdAt?`${text('lastUpdated','Last updated')}: ${dateLabel(request.updatedAt)}`:'';
  if(request.photoFile){
   $('#detail-photo').src=`/api/admin/applications/${encodeURIComponent(id)}/photo`;
   $('#detail-photo').alt=`${request.firstName} ${request.lastName} — ${text('passportPhoto','Passport photo')}`;
   $('#detail-photo-wrap').hidden=false;
  }
 }catch(error){
  $('#detail-title').textContent=text('detailUnavailable','Request unavailable');
  $('#detail-error').textContent=error.message;
  $('#detail-error').hidden=false;
 }
}

loginForm.addEventListener('submit',async event=>{
 event.preventDefault();
 loginMessage.textContent='';
 const button=loginForm.querySelector('[type="submit"]');
 button.disabled=true;
 try{
  await api('/api/admin/login',{method:'POST',body:JSON.stringify({
   username:$('#au').value.trim(),
   password:$('#ap').value
  })});
  loginForm.reset();
  showDashboard();
 }catch(error){
  loginMessage.textContent=error.message;
 }finally{
  button.disabled=false;
 }
});

$('#admin-logout').addEventListener('click',async()=>{
 try{await api('/api/admin/logout',{method:'POST',body:'{}'})}
 catch(error){displayError(error.message)}
 showLogin();
});
$('#refresh-requests').addEventListener('click',()=>loadApplications());
$('#export-requests').addEventListener('click',async()=>{
 try{
  const response=await fetch(`/api/admin/applications/export.csv?${queryString(false)}`,{credentials:'same-origin'});
  if(!response.ok){
   const body=await response.json().catch(()=>({}));
   if(response.status===401){showLogin(text('sessionExpired','Your admin session has ended. Please sign in again.'));return}
   throw new Error(body.error||text('exportFailed','Could not export applications.'));
  }
  const blob=await response.blob();
  const link=document.createElement('a');
  link.href=URL.createObjectURL(blob);
  link.download='ktss-applications.csv';
  link.click();
  URL.revokeObjectURL(link.href);
 }catch(error){displayError(error.message)}
});
['request-status','request-program','request-from','request-to'].forEach(id=>{
 $(`#${id}`).addEventListener('change',()=>{state.page=1;loadApplications()});
});
$('#request-search').addEventListener('input',()=>{
 clearTimeout(searchTimer);
 searchTimer=setTimeout(()=>{state.page=1;loadApplications()},250);
});
$('#page-previous').addEventListener('click',()=>{if(state.page>1){state.page-=1;loadApplications()}});
$('#page-next').addEventListener('click',()=>{if(state.page<state.pages){state.page+=1;loadApplications()}});
$('#detail-cancel').addEventListener('click',()=>detailDialog.close());
detailDialog.addEventListener('close',()=>{
 state.selectedId=null;
 $('#detail-photo').removeAttribute('src');
});
$('#detail-form').addEventListener('submit',async event=>{
 event.preventDefault();
 if(!state.selectedId)return;
 const button=$('#detail-form [type="submit"]');
 button.disabled=true;
 $('#detail-error').hidden=true;
 try{
  await api(`/api/admin/applications/${encodeURIComponent(state.selectedId)}`,{
   method:'PATCH',
   body:JSON.stringify({status:$('#detail-status').value,adminNotes:$('#detail-notes').value})
  });
  detailDialog.close();
  await loadApplications();
 }catch(error){
  $('#detail-error').textContent=error.message;
  $('#detail-error').hidden=false;
 }finally{
  button.disabled=false;
 }
});
window.addEventListener('ktss-language-change',()=>{
 if(!dashboard.hidden)loadApplications();
});

api('/api/admin/applications?page=1&perPage=1').then(()=>{
 showDashboard();
}).catch(error=>{
 if(error.status===401)showLogin();
 else showLogin(error.message);
});
