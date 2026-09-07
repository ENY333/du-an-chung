export const routes={dashboard:'../../index.html',image:'../../CHUPWEB.html',ocr:'../../OCR.html',data:'../../NEN.html',accounts:'../../GMAIL.html',translate:'../../Vi-translate.html'};
export function go(route){if(routes[route])location.href=routes[route]}
export function bindNav(current){document.querySelectorAll('[data-route]').forEach(b=>b.classList.toggle('active',b.dataset.route===current));document.querySelectorAll('[data-route]').forEach(b=>b.addEventListener('click',()=>go(b.dataset.route)))}
