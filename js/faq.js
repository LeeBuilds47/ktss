const QA=[
['When does the school year start?','The 2026-2027 school year starts in September 2026.'],
['How do I apply?','Open the Register page, complete the three steps (personal info, contact info, documents) and submit. The school will contact you by phone.'],
['What are the admission requirements?','They depend on the program. Open a program from the Programs menu to see its full list.'],
['Can I transfer from another school?','Yes. Bring your last school report and a transfer letter, and apply using the same form.'],
['How much are the tuition fees?','See the Tuition Fees page for the fee table and payment methods.'],
['Does the school offer boarding?','Add your answer here.'],
['How can I contact the school?','Call or email using the details at the bottom of any page, Monday to Friday, 8:00 AM - 5:00 PM.']];
const box=$('#fl'),q=$('#fq');
function draw(){const s=q.value.toLowerCase().trim();const l=QA.filter(x=>(x[0]+x[1]).toLowerCase().includes(s));
 box.innerHTML=l.length?l.map(x=>`<details class="q"><summary>${x[0]}</summary><p>${x[1]}</p></details>`).join(''):'<p class="empty">No question matches. <a href="contact.html" style="color:var(--blue)">Ask the school</a>.</p>'}
q.oninput=draw;draw();