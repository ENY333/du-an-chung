
const $=s=>document.querySelector(s);
document.querySelectorAll('.nav a').forEach(a=>a.addEventListener('click',()=>{document.querySelectorAll('.nav a').forEach(x=>x.classList.remove('active'));a.classList.add('active')}));
document.querySelectorAll('input[type=range]').forEach(r=>{const out=document.querySelector(`[data-for="${r.id}"]`);const sync=()=>{if(out)out.textContent=r.value};r.addEventListener('input',sync);sync()});
const search=$('.search'); if(search) search.addEventListener('input',()=>{const q=search.value.toLowerCase();document.querySelectorAll('.card,.tool').forEach(x=>x.style.display=x.textContent.toLowerCase().includes(q)?'':'none')});
document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();search?.focus()}});
