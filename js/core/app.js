import {bindNav} from './router.js';
const current=document.body.dataset.page||'dashboard';
bindNav(current);
const search=document.querySelector('#search');
if(search){search.addEventListener('input',()=>{const q=search.value.trim().toLowerCase();document.querySelectorAll('.feature').forEach(x=>x.hidden=!!q&&!x.textContent.toLowerCase().includes(q))});window.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();search.focus()}if(e.key==='Escape'){search.value='';search.dispatchEvent(new Event('input'));search.blur()}})}
