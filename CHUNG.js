const KEY="dynamicHubV2";const defaults=[
{name:"CHUPWEB",desc:"Công cụ chụp / xử lý web",url:"CHUPWEB/CHUPWEB.html",icon:"◈",fav:true},
{name:"Gmail Manager",desc:"Quản lý nhanh tài khoản Gmail",url:"GMAIL/GMAIL.html",icon:"✉",fav:false},
{name:"NÉN",desc:"Công cụ nén dữ liệu",url:"NÉN/NÉN.html",icon:"▣",fav:false},
{name:"OCR",desc:"Nhận diện văn bản từ hình ảnh",url:"OCR/OCR.html",icon:"▤",fav:true},
{name:"Vi-translate",desc:"Công cụ dịch nhanh",url:"Vi-translate/Vi-translate.html",icon:"文",fav:false}
];let data=JSON.parse(localStorage.getItem(KEY)||"null")||{modules:defaults,notes:"",history:[],visits:0,links:[],drive:[],ebook:[]};function save(){localStorage.setItem(KEY,JSON.stringify(data));render()}
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
function toast(t){let x=$("#toast");x.textContent=t;x.classList.add("show");setTimeout(()=>x.classList.remove("show"),1800)}
function go(p){$$(".page").forEach(x=>x.classList.toggle("active",x.id===p));$$(".nav").forEach(x=>x.classList.toggle("active",x.dataset.page===p));$("#pageTitle").textContent=$(`.nav[data-page="${p}"] span`)?.textContent||"Tổng quan";render()}
$$(".nav").forEach(b=>b.onclick=()=>go(b.dataset.page));$$("[data-page-jump]").forEach(b=>b.onclick=()=>go(b.dataset.pageJump));
function card(m,i){return `<article class="card"><button class="fav ${m.fav?"on":""}" data-fav="${i}">★</button><div class="card-icon">${m.icon||"✦"}</div><h3>${esc(m.name)}</h3><p>${esc(m.desc||"")}</p><button class="primary open" data-open="${i}">Mở →</button></article>`}
function esc(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function render(){let fav=data.modules.filter(x=>x.fav);$("#quickCards").innerHTML=(fav.length?fav:data.modules).slice(0,6).map(m=>card(m,data.modules.indexOf(m))).join("")||`<p class="muted">Chưa có module.</p>`;$("#moduleCards").innerHTML=data.modules.map(card).join("");$("#statModules").textContent=data.modules.length;$("#statFav").textContent=fav.length;$("#statVisits").textContent=data.visits;$("#statNotes").textContent=data.notes.length;$("#notes").value=data.notes;$("#historyList").innerHTML=data.history.length?data.history.map(h=>`<div class="history-item"><span>${esc(h.name)}</span><small>${esc(h.time)}</small></div>`).join(""):`<p class="muted">Chưa có lịch sử.</p>`;renderSaved($("#driveCards"),data.drive,"◫");renderSaved($("#ebookCards"),data.ebook,"▤");bindCards()}
function renderSaved(el,arr,icon){el.innerHTML=arr.map((x,i)=>`<article class="card"><div class="card-icon">${icon}</div><h3>${esc(x.name)}</h3><p>${esc(x.url)}</p><a class="primary open" style="display:block;text-align:center;text-decoration:none" href="${esc(x.url)}" target="_blank" rel="noopener">Mở →</a></article>`).join("")||""}
function bindCards(){$$("[data-open]").forEach(b=>b.onclick=()=>{let m=data.modules[+b.dataset.open];data.visits++;data.history.unshift({name:m.name,time:new Date().toLocaleString("vi-VN")});data.history=data.history.slice(0,30);save();location.href=m.url});$$("[data-fav]").forEach(b=>b.onclick=()=>{data.modules[+b.dataset.fav].fav=!data.modules[+b.dataset.fav].fav;save();toast("Đã cập nhật yêu thích")})}
function openModal(title="Thêm module"){ $("#modalTitle").textContent=title;$("#modal").classList.add("show");$("#mName").focus()}
function closeModal(){$("#modal").classList.remove("show");["mName","mDesc","mUrl"].forEach(x=>$("#"+x).value="");$("#mIcon").value="✦"}
$("#newModule").onclick=()=>openModal();$("#addBtn").onclick=()=>openModal();$("#close").onclick=$("#cancel").onclick=closeModal;
$("#saveModule").onclick=()=>{let n=$("#mName").value.trim(),u=$("#mUrl").value.trim();if(!n||!u)return toast("Nhập tên và đường dẫn");data.modules.push({name:n,desc:$("#mDesc").value, url:u,icon:$("#mIcon").value||"✦",fav:false});save();closeModal();toast("Đã thêm module")};
$("#saveNotes").onclick=()=>{data.notes=$("#notes").value;save();toast("Đã lưu ghi chú")};$("#clearNotes").onclick=()=>{$("#notes").value="";data.notes="";save()};
$("#textTool").oninput=e=>{let v=e.target.value;$("#chars").textContent=v.length;$("#words").textContent=v.trim()?v.trim().split(/\s+/).length:0;$("#lines").textContent=v? v.split(/\n/).length:0};
$("#calcBtn").onclick=()=>{try{let v=$("#calc").value;if(!/^[0-9+*/%().\s-]+$/.test(v))throw 0;$("#calcOut").textContent=Function("return "+v)()}catch{$("#calcOut").textContent="Biểu thức không hợp lệ"}};
function json(doMin){try{let x=JSON.parse($("#jsonIn").value);$("#jsonOut").value=doMin?JSON.stringify(x):JSON.stringify(x,null,2)}catch{$("#jsonOut").value="JSON không hợp lệ"}}
$("#jsonFormat").onclick=()=>json(false);$("#jsonMin").onclick=()=>json(true);
$("#saveLink").onclick=()=>{let n=$("#linkTitle").value.trim(),u=$("#linkUrl").value.trim();if(!n||!u)return toast("Thiếu tên hoặc link");data.links.push({name:n,url:u});data.modules.push({name:n,desc:"Link cá nhân",url:u,icon:"🔗",fav:false});save();toast("Đã thêm link")};
function addSaved(type){let n=prompt("Tên"),u=prompt("Link Drive / URL");if(n&&u){data[type].push({name:n,url:u});save();toast("Đã thêm")}}
$("#driveAdd").onclick=()=>addSaved("drive");$("#ebookAdd").onclick=()=>addSaved("ebook");
$("#clearHistory").onclick=()=>{data.history=[];save();toast("Đã xóa lịch sử")};
function theme(){document.body.classList.toggle("light");localStorage.setItem("hubTheme",document.body.classList.contains("light")?"light":"dark")}$("#theme").onclick=theme;$("#theme2").onclick=theme;if(localStorage.getItem("hubTheme")==="light")document.body.classList.add("light");
$("#export").onclick=()=>{let a=document.createElement("a");a.href=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:"application/json"}));a.download="dynamic-hub-backup.json";a.click();URL.revokeObjectURL(a.href)};
$("#importBtn").onclick=()=>$("#importFile").click();$("#importFile").onchange=e=>{let f=e.target.files[0];if(!f)return;let r=new FileReader;r.onload=()=>{try{data=JSON.parse(r.result);save();toast("Đã nhập backup")}catch{toast("File backup không hợp lệ")}};r.readAsText(f)};
$("#reset").onclick=()=>{if(confirm("Xóa toàn bộ dữ liệu Dynamic Hub?")){localStorage.removeItem(KEY);location.reload()}};
$("#searchBtn").onclick=()=>{let q=prompt("Tìm module / công cụ");if(!q)return;let m=data.modules.find(x=>(x.name+" "+x.desc).toLowerCase().includes(q.toLowerCase()));if(m){go("modules");toast("Đã tìm thấy: "+m.name)}else toast("Không tìm thấy")};
document.addEventListener("keydown",e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="k"){e.preventDefault();$("#searchBtn").click()}});
setInterval(()=>$("#clock").textContent=new Date().toLocaleTimeString("vi-VN"),1000);render();