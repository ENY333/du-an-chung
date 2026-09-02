let compressQueue = [];
document.addEventListener('DOMContentLoaded', () => {
    const dropzone = document.getElementById('compress-dropzone');
    const input = document.getElementById('compress-input');
    document.getElementById('btn-select-files').onclick = () => input.click();
    dropzone.onclick = () => input.click();
    input.onchange = () => {
        for (let f of input.files) compressQueue.push({ id: generateSafeId(), file: f });
        renderQueue();
    };
    document.getElementById('btn-clear-all').onclick = () => { compressQueue = []; renderQueue(); };
    document.getElementById('btn-start-compress').onclick = async function() {
        this.disabled = true;
        const q = document.getElementById('compress-quality').value;
        for (let item of compressQueue) {
            const st = document.getElementById('st-' + item.id);
            const bar = document.getElementById('bar-' + item.id);
            const poll = startCompressProgressPoll(item.id, p => {
                if (bar) bar.style.width = p.percent + '%';
                if (st) st.innerText = p.msg;
            });
            await uploadCompressChunks(item, q, poll, st, bar);
        }
        this.disabled = false;
        document.getElementById('btn-download-all-zip').style.display = 'inline-block';
    };
});
function renderQueue() {
    const qEl = document.getElementById('compress-queue');
    qEl.innerHTML = '';
    document.getElementById('btn-start-compress').disabled = compressQueue.length === 0;
    compressQueue.forEach(item => {
        const d = document.createElement('div');
        d.className = 'file-item';
        d.innerHTML = `
            <div style="display:flex; justify-content:space-between;">
                <span>${item.file.name} (${formatBytes(item.file.size)})</span>
                <span id="st-${item.id}" style="color:#64748b">Sẵn sàng</span>
            </div>
            <div style="background:#e2e8f0; height:6px; border-radius:3px; margin-top:8px; overflow:hidden;">
                <div id="bar-${item.id}" style="width:0; height:100%; background:#2563eb; transition:width 0.3s;"></div>
            </div>
        `;
        qEl.appendChild(d);
    });
}
async function downloadAllAsZip() {
    const res = await fetch('/api/download-all-zip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file_ids: compressQueue.map(i => i.id) })
    });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(await res.blob());
    a.download = 'All_Compressed.zip';
    a.click();
}