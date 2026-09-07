
(() => {
  const KEY="dynamicHubPremium";
  const $=id=>document.getElementById(id);
  const toast = msg => {
    let t=$("toast");
    if(!t) return;
    t.textContent=msg; t.classList.add("show");
    clearTimeout(window.__toast); window.__toast=setTimeout(()=>t.classList.remove("show"),1800);
  };
  window.toast=toast;
  window.toggleTheme=()=>{document.body.classList.toggle("light");localStorage.setItem("dh-theme",document.body.classList.contains("light")?"light":"dark")};
  if(localStorage.getItem("dh-theme")==="light") document.body.classList.add("light");

  const defaults=[
    ["CHUPWEB.html","📸","CHUPWEB","Xử lý, chỉnh sửa và chuyển đổi ảnh"],
    ["GMAIL.html","✉️","Gmail Manager","Quản lý liên kết tài khoản Gmail"],
    ["NEN.html","🗜️","Nén / Giải nén","Nén, giải nén và xử lý dữ liệu"],
    ["OCR.html","🔎","OCR","Nhận dạng văn bản từ hình ảnh"],
    ["Vi-translate.html","🌐","Vi-translate","Dịch và xử lý văn bản"]
  ];
  window.openModule = url => { location.href=url; };
  function renderHub(){
    const m=$("modules"); if(!m) return;
    m.innerHTML=defaults.map(([url,icon,name,desc])=>`
      <article class="card module">
        <div style="font-size:31px;margin-bottom:8px">${icon}</div>
        <h3>${name}</h3><p>${desc}</p>
        <button class="btn primary" onclick="openModule('${url}')">Mở module →</button>
      </article>`).join("");
    const s=$("stats");
    if(s) s.innerHTML=`
      <div class="card stat"><b>5</b><span>Module chính</span></div>
      <div class="card stat"><b>50+</b><span>Công cụ tích hợp</span></div>
      <div class="card stat"><b>100%</b><span>Chạy trên trình duyệt</span></div>
      <div class="card stat"><b>0</b><span>Tài khoản / database</span></div>`;
    const h=$("history");
    if(h) h.innerHTML=`<div class="muted">Chưa có hoạt động gần đây. Hãy mở một module để bắt đầu.</div>`;
  }
  function bindSearch(){
    const input=$("hubSearch")||$("search");
    if(!input) return;
    input.addEventListener("input",()=>{
      const q=input.value.trim().toLowerCase();
      document.querySelectorAll(".tool,.module").forEach(x=>{
        x.style.display=!q || x.textContent.toLowerCase().includes(q) ? "" : "none";
      });
    });
    document.addEventListener("keydown",e=>{
      if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="k"){e.preventDefault();input.focus()}
    });
  }
  window.backup=()=>{
    const data={version:1,createdAt:new Date().toISOString(),localStorage:Object.fromEntries(
      Object.keys(localStorage).map(k=>[k,localStorage.getItem(k)])
    )};
    const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});
    const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="dynamic-hub-backup.json";a.click();
    toast("Đã tạo backup");
  };
  window.addModule=()=>toast("Module tự thêm sẽ được hỗ trợ trong phần nâng cấp tiếp theo");
  window.side=document.getElementById("side");
  document.addEventListener("DOMContentLoaded",()=>{renderHub();bindSearch()});
})();
