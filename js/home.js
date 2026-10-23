const NOTES=['Applications are open for the 2026-2027 school year.','See the Tuition Fees page for fees and how to pay.','Questions? Read the FAQ or contact the school office.'];
const bar=$('#banner'),bt=$('#bt');let i=0,paused=false;
const show=()=>{bt.textContent=NOTES[i++%NOTES.length]};show();
bar.onmouseenter=()=>paused=true;bar.onmouseleave=()=>paused=false;
setInterval(()=>{if(!paused)show()},4500);
renderPrograms($('#homeProgs'));