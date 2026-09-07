
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const page=document.body.dataset.page||"dashboard";
const state={image:null,imageURL:null};

const DATA={
dashboard:[
["⚡","Quick Launch","Mở công cụ nhanh"],["🖼️","Image Lab","Chỉnh sửa & xuất ảnh"],["🔍","OCR Studio","Nhận dạng văn bản"],["🧰","Data Lab","Dữ liệu & mã hóa"],["👤","Accounts","Quản lý tài khoản"],["🌐","Translate","Dịch văn bản"],["💾","Backup","Sao lưu dữ liệu"],["⌘","Shortcuts","Phím tắt hệ thống"]
],
image:[
["🖼️","Image Editor","Chỉnh ảnh bằng Canvas"],["☀️","Brightness","Độ sáng"],["◐","Contrast","Tương phản"],["🎨","Saturation","Độ bão hòa"],["⚫","Grayscale","Ảnh xám"],["↔️","Flip","Lật ảnh"],["↻","Rotate","Xoay ảnh"],["⬇️","Export","Xuất PNG/JPG/WebP"]
],
ocr:[
["🔍","OCR","Nhận dạng chữ từ ảnh"],["📋","Copy Text","Sao chép kết quả"],["⬇️","Export TXT","Tải văn bản"],["🧹","Clear","Xóa kết quả"]
],
data:[
["🔐","Base64","Encode / Decode"],["🔗","URL","Encode / Decode URL"],["{}","JSON","Format / Minify"],["#","SHA-256","Băm dữ liệu"],["🆔","UUID","Tạo UUID"],["🔢","Text Counter","Đếm ký tự / từ"],["🕒","Timestamp","Đổi thời gian"],["⇄","CSV ↔ JSON","Chuyển đổi dữ liệu"],["🗜️","GZIP","Nén / giải nén"]
],
accounts:[
["➕","Add Account","Thêm tài khoản"],["🔎","Search","Tìm tài khoản"],["📋","Copy Username","Sao chép username"],["↗️","Open Login","Mở trang đăng nhập"],["💾","Backup","Xuất dữ liệu"],["↩️","Restore","Nhập dữ liệu"]
],
translate:[
["🌐","Translate","Dịch trực tuyến"],["⇄","Swap","Đổi ngôn ngữ"],["📋","Copy","Sao chép"],["🧹","Clear","Xóa"],["🕘","History","Lịch sử dịch"]
]
};
const titles={dashboard:["Dashboard","Dynamic personal ecosystem"],image:["Image Lab","Creative image workspace"],ocr:["OCR Studio","Extract text from images"],data:["Data Lab","Utilities for data and encoding"],accounts:["Accounts","Local account manager"],translate:["Translate","Language workspace"]};

function toast(t){let x=$("#toast");x.textContent=t;x.classList.add("show");setTimeout(()=>x.classList.remove("show"),1800)}
function nav(){ $$(".nav button").forEach(b=>b.classList.toggle("active",b.dataset.page===page)); }
function renderTools(){
 let arr=DATA[page]||DATA.dashboard, grid=$("#tools");
 grid.innerHTML=arr.map((x,i)=>`<button class="tool" data-tool="${x[1]}"><div class="icon">${x[0]}</div><b>${x[1]}</b><small>${x[2]}</small></button>`).join("");
 $$(".tool").forEach(b=>b.onclick=()=>openTool(b.dataset.tool));
}
function openTool(name){
 const m=$("#modal"), c=$("#modalContent"), title=$("#modalTitle"); title.textContent=name; m.classList.add("open"); c.innerHTML=toolUI(name);
 bindTool(name,c);
}
function closeModal(){ $("#modal").classList.remove("open") }
function toolUI(n){
 if(n==="Image Editor"||n==="Brightness"||n==="Contrast"||n==="Saturation"||n==="Grayscale"||n==="Flip"||n==="Rotate"||n==="Export")
 return `<div class="workspace-card"><div class="drop" id="imgDrop"><div><strong>Chọn ảnh</strong><span>PNG, JPG, WEBP</span><label class="btn primary">Chọn file<input id="imgFile" type="file" accept="image/*"></label></div></div><div id="imgWork" style="display:none"><img id="imgPreview" class="preview"><div class="row" style="margin-top:12px"><button class="btn" id="rot">↻ Xoay</button><button class="btn" id="flip">↔ Lật</button><button class="btn" id="gray">Grayscale</button><button class="btn primary" id="savePng">Xuất PNG</button><button class="btn" id="saveWebp">WebP</button></div><div class="group"><div class="label">Brightness <span id="bv">100%</span></div><input id="brightness" type="range" min="0" max="200" value="100"></div><div class="group"><div class="label">Contrast <span id="cv">100%</span></div><input id="contrast" type="range" min="0" max="200" value="100"></div><div class="group"><div class="label">Saturation <span id="sv">100%</span></div><input id="saturation" type="range" min="0" max="200" value="100"></div></div></div>`;
 if(n==="OCR"||n==="Copy Text"||n==="Export TXT"||n==="Clear")
 return `<div class="workspace-card"><div class="row"><label class="btn primary">Chọn ảnh<input id="ocrFile" type="file" accept="image/*" style="display:none"></label><select id="ocrLang"><option value="eng">English</option><option value="vie">Vietnamese</option><option value="eng+vie">English + Vietnamese</option></select><button class="btn primary" id="runOCR">Chạy OCR</button></div><img id="ocrPreview" class="preview" style="display:none;margin-top:15px"><div class="group"><div class="label">Kết quả</div><textarea id="ocrText" placeholder="Kết quả OCR sẽ xuất hiện ở đây..."></textarea></div><div class="row"><button class="btn" id="copyOCR">Copy</button><button class="btn" id="downloadOCR">Tải TXT</button><button class="btn danger" id="clearOCR">Clear</button></div><small style="color:var(--muted);display:block;margin-top:12px">OCR sử dụng Tesseract.js từ CDN.</small></div>`;
 if(["Base64","URL","JSON","SHA-256","UUID","Text Counter","Timestamp","CSV ↔ JSON","GZIP"].includes(n))
 return `<div class="workspace-card"><div class="label">Input</div><textarea id="dataIn" placeholder="Nhập dữ liệu..."></textarea><div class="row" style="margin-top:10px">${n==="Base64"?'<button class="btn primary" id="enc">Encode</button><button class="btn" id="dec">Decode</button>':n==="URL"?'<button class="btn primary" id="enc">Encode</button><button class="btn" id="dec">Decode</button>':n==="JSON"?'<button class="btn primary" id="format">Format</button><button class="btn" id="minify">Minify</button>':n==="SHA-256"?'<button class="btn primary" id="hash">SHA-256</button>':n==="UUID"?'<button class="btn primary" id="uuid">Generate</button>':n==="Text Counter"?'<button class="btn primary" id="count">Count</button>':n==="Timestamp"?'<button class="btn primary" id="now">Now</button><button class="btn" id="date">From timestamp</button>':n==="CSV ↔ JSON"?'<button class="btn primary" id="csvjson">CSV → JSON</button><button class="btn" id="jsoncsv">JSON → CSV</button>':'<button class="btn primary" id="gzip">GZIP</button>'}</div><div class="group"><div class="label">Output</div><div id="dataOut" class="result"></div></div></div>`;
 if(n==="Add Account"||n==="Search"||n==="Copy Username"||n==="Open Login"||n==="Backup"||n==="Restore")
 return `<div class="workspace-card"><div class="row"><input id="accName" placeholder="Tên / dịch vụ"><input id="accUser" placeholder="Username / email"></div><input id="accUrl" class="field" style="margin-top:8px" placeholder="URL đăng nhập (https://...)"><div class="row" style="margin-top:10px"><button class="btn primary" id="addAcc">Lưu tài khoản</button><button class="btn" id="exportAcc">Backup JSON</button><label class="btn">Restore<input id="importAcc" type="file" accept=".json" style="display:none"></label></div><div class="group"><div class="label">Danh sách</div><div id="accList"></div></div></div>`;
 if(n==="Translate"||n==="Swap"||n==="Copy"||n==="Clear"||n==="History")
 return `<div class="workspace-card"><div class="row"><select id="from"><option value="vi">Vietnamese</option><option value="en">English</option><option value="ja">Japanese</option><option value="ko">Korean</option><option value="zh">Chinese</option></select><button class="btn" id="swap">⇄</button><select id="to"><option value="en">English</option><option value="vi">Vietnamese</option><option value="ja">Japanese</option><option value="ko">Korean</option><option value="zh">Chinese</option></select></div><textarea id="trIn" style="margin-top:10px" placeholder="Nhập văn bản..."></textarea><button class="btn primary" id="translate" style="margin-top:10px">Translate</button><div class="group"><div class="label">Result</div><textarea id="trOut"></textarea></div><button class="btn" id="copyTr">Copy</button><small style="color:var(--muted);display:block;margin-top:10px">Dùng MyMemory API khi có Internet.</small></div>`;
 return `<div class="empty">Công cụ này không cần mở riêng. Dùng các nút trong workspace.</div>`;
}
async function sha(s){let b=new TextEncoder().encode(s),h=await crypto.subtle.digest("SHA-256",b);return [...new Uint8Array(h)].map(x=>x.toString(16).padStart(2,"0")).join("")}
function bindTool(n,c){
 if(c.querySelector("#imgFile")) bindImage(c);
 if(c.querySelector("#runOCR")) bindOCR(c);
 if(c.querySelector("#dataIn")) bindData(n,c);
 if(c.querySelector("#addAcc")) bindAccounts(c);
 if(c.querySelector("#translate")) bindTranslate(c);
}
function bindImage(c){
 const f=$("#imgFile"),img=$("#imgPreview");let rot=0,flip=false;
 f.onchange=()=>{let file=f.files[0];if(!file)return;let r=new FileReader();r.onload=e=>{img.src=e.target.result;state.imageURL=e.target.result;$("#imgDrop").style.display="none";$("#imgWork").style.display="block"};r.readAsDataURL(file)};
 function filter(){let b=$("#brightness").value,co=$("#contrast").value,s=$("#saturation").value;$("#bv").textContent=b+"%";$("#cv").textContent=co+"%";$("#sv").textContent=s+"%";img.style.filter=`brightness(${b}%) contrast(${co}%) saturate(${s}%) grayscale(${document.body.dataset.gray==="1"?1:0})`;img.style.transform=`rotate(${rot}deg) scaleX(${flip?-1:1})`}
 ["brightness","contrast","saturation"].forEach(x=>$("#"+x).oninput=filter);$("#rot").onclick=()=>{rot=(rot+90)%360;filter()};$("#flip").onclick=()=>{flip=!flip;filter()};$("#gray").onclick=()=>{document.body.dataset.gray=document.body.dataset.gray==="1"?"0":"1";filter()};
 function save(type){let im=new Image();im.onload=()=>{let cv=document.createElement("canvas"),ctx=cv.getContext("2d"),w=im.naturalWidth,h=im.naturalHeight;cv.width=(rot%180? h:w);cv.height=(rot%180? w:h);ctx.filter=`brightness(${$("#brightness").value}%) contrast(${$("#contrast").value}%) saturate(${$("#saturation").value}%) grayscale(${document.body.dataset.gray==="1"?1:0})`;ctx.translate(cv.width/2,cv.height/2);ctx.rotate(rot*Math.PI/180);ctx.scale(flip?-1:1,1);ctx.drawImage(im,-w/2,-h/2);let a=document.createElement("a");a.href=cv.toDataURL(type);a.download="dynamic-hub-image."+type.split("/")[1].replace("jpeg","jpg");a.click()};im.src=state.imageURL}$("#savePng").onclick=()=>save("image/png");$("#saveWebp").onclick=()=>save("image/webp")
}
function bindOCR(c){
 let file=null;$("#ocrFile").onchange=e=>{file=e.target.files[0];if(file){$("#ocrPreview").src=URL.createObjectURL(file);$("#ocrPreview").style.display="block"}};
 $("#runOCR").onclick=async()=>{if(!file)return toast("Chọn ảnh trước");let out=$("#ocrText");out.value="Đang OCR...";try{if(!window.Tesseract){await new Promise((res,rej)=>{let s=document.createElement("script");s.src="https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js";s.onload=res;s.onerror=rej;document.head.appendChild(s)})}let r=await Tesseract.recognize(file,$("#ocrLang").value,{logger:m=>{if(m.status)out.value=`${m.status} ${m.progress?Math.round(m.progress*100):""}%`}});out.value=r.data.text;toast("OCR hoàn tất")}catch(e){out.value="OCR lỗi: "+e.message}};
 $("#copyOCR").onclick=()=>navigator.clipboard?.writeText($("#ocrText").value).then(()=>toast("Đã copy"));$("#clearOCR").onclick=()=>$("#ocrText").value="";$("#downloadOCR").onclick=()=>{let a=document.createElement("a");a.href=URL.createObjectURL(new Blob([$("#ocrText").value],{type:"text/plain"}));a.download="ocr-result.txt";a.click()}
}
function bindData(n,c){
 let i=$("#dataIn"),o=$("#dataOut");
 $("#enc")?.addEventListener("click",()=>{try{o.textContent=n==="Base64"?btoa(unescape(encodeURIComponent(i.value))):encodeURIComponent(i.value)}catch(e){o.textContent=e.message}});
 $("#dec")?.addEventListener("click",()=>{try{o.textContent=n==="Base64"?decodeURIComponent(escape(atob(i.value))):decodeURIComponent(i.value)}catch(e){o.textContent="Lỗi: "+e.message}});
 $("#format")?.addEventListener("click",()=>{try{o.textContent=JSON.stringify(JSON.parse(i.value),null,2)}catch(e){o.textContent="JSON lỗi: "+e.message}});
 $("#minify")?.addEventListener("click",()=>{try{o.textContent=JSON.stringify(JSON.parse(i.value))}catch(e){o.textContent="JSON lỗi: "+e.message}});
 $("#hash")?.addEventListener("click",async()=>o.textContent=await sha(i.value));$("#uuid")?.addEventListener("click",()=>o.textContent=crypto.randomUUID());
 $("#count")?.addEventListener("click",()=>{let s=i.value;o.textContent=`Characters: ${s.length}\nCharacters (no spaces): ${s.replace(/\s/g,"").length}\nWords: ${s.trim()?s.trim().split(/\s+/).length:0}\nLines: ${s? s.split(/\n/).length:0}`});
 $("#now")?.addEventListener("click",()=>o.textContent=Date.now()+"\n"+new Date().toISOString());$("#date")?.addEventListener("click",()=>{let n=Number(i.value);o.textContent=isNaN(n)?"Invalid":new Date(n).toString()});
 $("#csvjson")?.addEventListener("click",()=>{let rows=i.value.trim().split(/\r?\n/).map(x=>x.split(","));if(!rows.length)return;o.textContent=JSON.stringify(rows.slice(1).map(r=>Object.fromEntries(rows[0].map((h,j)=>[h,r[j]??""]))),null,2)});
 $("#jsoncsv")?.addEventListener("click",()=>{try{let a=JSON.parse(i.value);if(!Array.isArray(a))throw Error("Cần JSON array");let h=[...new Set(a.flatMap(x=>Object.keys(x)))];o.textContent=h.join(",")+"\\n"+a.map(x=>h.map(k=>String(x[k]??"").replaceAll(",","")).join(",")).join("\\n")}catch(e){o.textContent=e.message}});
 $("#gzip")?.addEventListener("click",async()=>{if(!window.CompressionStream)return o.textContent="Trình duyệt không hỗ trợ GZIP";let cs=new CompressionStream("gzip"),w=cs.writable.getWriter();w.write(new TextEncoder().encode(i.value));w.close();let buf=await new Response(cs.readable).arrayBuffer();o.textContent=`GZIP tạo thành công: ${buf.byteLength} bytes`;let a=document.createElement("a");a.href=URL.createObjectURL(new Blob([buf],{type:"application/gzip"}));a.download="data.txt.gz";a.click()})
}
function getAcc(){return JSON.parse(localStorage.getItem("dh_accounts")||"[]")}function setAcc(a){localStorage.setItem("dh_accounts",JSON.stringify(a))}
function bindAccounts(c){function draw(){let a=getAcc();$("#accList").innerHTML=a.length?a.map((x,i)=>`<div class="account"><div><b>${esc(x.name)}</b><small>${esc(x.user)} · <span class="pill">${esc(x.url||"no url")}</span></small></div><div><button class="btn" data-open="${i}">↗</button><button class="btn danger" data-del="${i}">×</button></div></div>`).join(""):`<div class="empty" style="padding:25px">Chưa có tài khoản</div>`;$$("[data-del]").forEach(b=>b.onclick=()=>{let a=getAcc();a.splice(+b.dataset.del,1);setAcc(a);draw()});$$("[data-open]").forEach(b=>b.onclick=()=>{let x=getAcc()[+b.dataset.open];if(x.url)window.open(x.url,"_blank")})}$("#addAcc").onclick=()=>{let name=$("#accName").value.trim(),user=$("#accUser").value.trim(),url=$("#accUrl").value.trim();if(!name||!user)return toast("Thiếu tên hoặc username");let a=getAcc();a.push({name,user,url});setAcc(a);$("#accName").value=$("#accUser").value=$("#accUrl").value="";draw();toast("Đã lưu")};$("#exportAcc").onclick=()=>{let a=document.createElement("a");a.href=URL.createObjectURL(new Blob([JSON.stringify(getAcc(),null,2)],{type:"application/json"}));a.download="dynamic-hub-accounts.json";a.click()};$("#importAcc").onchange=e=>{let f=e.target.files[0];if(!f)return;let r=new FileReader();r.onload=()=>{try{setAcc(JSON.parse(r.result));draw();toast("Đã restore")}catch(_){toast("File JSON không hợp lệ")}};r.readAsText(f)};draw()}
function esc(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function bindTranslate(c){$("#swap").onclick=()=>{let x=$("#from").value;$("#from").value=$("#to").value;$("#to").value=x};$("#translate").onclick=async()=>{let q=$("#trIn").value.trim();if(!q)return;if($("#from").value===$("#to").value)return $("#trOut").value=q;$("#trOut").value="Đang dịch...";try{let u=`https://api.mymemory.translated.net/get?q=${encodeURIComponent(q)}&langpair=${$("#from").value}|${$("#to").value}`;let r=await fetch(u);let j=await r.json();$("#trOut").value=j.responseData?.translatedText||"Không có kết quả"}catch(e){$("#trOut").value="Không thể kết nối dịch vụ. Kiểm tra Internet."}};$("#copyTr").onclick=()=>navigator.clipboard?.writeText($("#trOut").value).then(()=>toast("Đã copy"))}
function init(){nav();let [h,p]=titles[page]||titles.dashboard;$("#title").textContent=h;$("#subtitle").textContent=p;renderTools();$("#search").oninput=e=>{let q=e.target.value.toLowerCase();$$(".tool").forEach(b=>b.style.display=b.textContent.toLowerCase().includes(q)?"":"none")};document.addEventListener("keydown",e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="k"){e.preventDefault();$("#search").focus()}});$("#modal").onclick=e=>{if(e.target.id==="modal")closeModal()};$("#close").onclick=closeModal}
document.addEventListener("DOMContentLoaded",init);
