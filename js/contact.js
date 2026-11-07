const f=$('#cf');

function readMessages(){
  try {
    const raw=localStorage.getItem('contact_messages');
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    return [];
  }
}

function writeMessages(value){
  localStorage.setItem('contact_messages', JSON.stringify(value));
}

f.onsubmit=e=>{
  e.preventDefault();
  let ok=true;
  const n=$('#cn'),m=$('#ce'),s=$('#cm');
  ok=validRow(n,!n.value.trim())&ok;
  ok=validRow(m,!/^\S+@\S+\.\S+$/.test(m.value.trim()))&ok;
  ok=validRow(s,s.value.trim().length<10)&ok;
  if(!ok)return;

  const submitButton=f.querySelector('button[type="submit"]');
  const originalLabel=submitButton.textContent;
  submitButton.disabled=true;
  submitButton.textContent='Sending...';

  setTimeout(() => {
    const messages=readMessages();
    messages.unshift({
      id: `MSG-${String(Date.now()).slice(-6)}`,
      name: n.value.trim(),
      email: m.value.trim(),
      message: s.value.trim(),
      status: 'unread',
      createdAt: new Date().toISOString()
    });
    writeMessages(messages);

    f.hidden=true;
    $('#cok').hidden=false;
    submitButton.disabled=false;
    submitButton.textContent=originalLabel;
  }, 1500);
};