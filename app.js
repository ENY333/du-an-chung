
const DBKEY='DYNAMIC_HUB_ULTIMATE_2026';
const defaults={theme:'dark',accent:'#7c5cff',modules:[
{id:1,name:'CHUPWEB',desc:'Công cụ chụp / xử lý ảnh màn hình',url:'CHUPWEB/CHUPWEB.html',icon:'📸',fav:true},
{id:2,name:'GMAIL MANAGER',desc:'Quản lý link tài khoản, không lưu mật khẩu',url:'GMAIL/GMAIL.html',icon:'✉️',fav:true},
{id:3,name:'NÉN / GIẢI NÉN',desc:'Nén dữ liệu và file ngay trên trình duyệt',url:'NEN/NEN.html',icon:'🗜️',fav:false},
{id:4,name:'OCR',desc:'Nhận dạng chữ từ ảnh',url:'OCR/OCR.html',icon:'🔎',fav:true},
{id:5,name:'VI-TRANSLATE',desc:'Dịch và xử lý văn bản',url:'Vi-translate/Vi-translate.html',icon:'🌐',fav:true}
],history:[],notes:'',tasks:[]};
let db=JSON.parse(localStorage.getItem(DBKEY)||'null')||structuredClone(defaults);
function saveDB(){localStorage.setItem(DBKEY,JSON.stringify(db))}
function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function toast(s){let t=document.querySelector('#toast');if(!t)return;t.textContent=s;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1600)}
function apply(){document.documentElement.style.setProperty('--a',db.accent);document.documentElement.dataset.theme=db.theme}
function openModule(m){let u=m.url;if(!/^(https?:|[^/]+\/)/.test(u))return toast('URL không hợp lệ');db.history.unshift({n:m.name,t:Date.now()});db.history=db.history.slice(0,40);saveDB();location.href=u}
function renderHub(){
const stats=[['MODULE',db.modules.length],['YÊU THÍCH',db.modules.filter(x=>x.fav).length],['TODO',db.tasks.filter(x=>!x.done).length],['LỊCH SỬ',db.history.length]];
document.querySelector('#stats').innerHTML=stats.map(x=>`<div class="card stat"><b>${x[1]}</b><span>${x[0]}</span></div>`).join('');
let cards=db.modules.map(m=>`<div class="card module"><div style="font-size:27px">${esc(m.icon)}</div><h3>${esc(m.name)}</h3><p>${esc(m.desc)}</p><span class="tag">${m.fav?'★ Yêu thích':'MODULE'}</span><div class="actions" style="margin-top:10px"><button class="btn primary" onclick="openModule(${JSON.stringify(m).replace(/"/g,'&quot;')})">Mở →</button><button class="btn" onclick="fav(${m.id})">★</button></div></div>`).join('');
document.querySelector('#modules').innerHTML=cards;
document.querySelector('#history').innerHTML=db.history.length?db.history.slice(0,8).map(x=>`<div style="padding:7px 0;border-bottom:1px solid var(--line)">${esc(x.n)} <span class="muted" style="float:right">${new Date(x.t).toLocaleString('vi-VN')}</span></div>`).join(''):'<div class="muted">Chưa có hoạt động.</div>';
}
function fav(id){let m=db.modules.find(x=>x.id===id);m.fav=!m.fav;saveDB();renderHub()}
function addModule(){let n=prompt('Tên module');if(!n)return;let u=prompt('URL (ví dụ CHUPWEB/CHUPWEB.html hoặc https://...)');if(!u)return;db.modules.push({id:Date.now(),name:n,desc:'Module cá nhân',url:u,icon:'◆',fav:false});saveDB();renderHub();toast('Đã thêm module')}
function backup(){let b=new Blob([JSON.stringify(db,null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='dynamic-hub-backup.json';a.click();toast('Đã backup')}
function toggleTheme(){db.theme=db.theme==='dark'?'light':'dark';saveDB();apply();document.body.classList.toggle('light',db.theme==='light')}
window.addEventListener('DOMContentLoaded',()=>{apply();renderHub();let s=document.querySelector('#hubSearch');s?.addEventListener('input',()=>{let q=s.value.toLowerCase();document.querySelectorAll('.module').forEach(x=>x.style.display=x.textContent.toLowerCase().includes(q)?'block':'none')});document.addEventListener('keydown',e=>{if(e.ctrlKey&&e.key.toLowerCase()==='k'){e.preventDefault();s?.focus()}if(e.ctrlKey&&e.key.toLowerCase()==='b'){e.preventDefault();backup()}if(e.key==='Escape')document.querySelector('.modal')?.classList.remove('show')})})
