async function uploadCompressChunks(item, quality, pollTimer, statusEl, barEl) {
    const f = item.file, fid = item.id, CHUNK = 8 * 1024 * 1024, total = Math.ceil(f.size / CHUNK) || 1;
    for (let i = 0; i < total; i++) {
        const blob = f.slice(i * CHUNK, Math.min(f.size, (i + 1) * CHUNK));
        const res = await fetch('/api/compress-chunk', {
            method: 'POST',
            headers: {
                'X-File-Id': fid,
                'X-Chunk-Index': i.toString(),
                'X-Total-Chunks': total.toString(),
                'X-File-Name': encodeURIComponent(f.name),
                'X-Compress-Level': quality.toString()
            },
            body: blob
        });
        if (i + 1 === total) {
            clearInterval(pollTimer);
            const a = document.createElement('a');
            a.href = URL.createObjectURL(await res.blob());
            a.download = f.name.replace(/\.[^/.]+$/, "") + "_compressed" + f.name.substr(f.name.lastIndexOf('.'));
            a.click();
            if (barEl) barEl.style.width = '100%';
            if (statusEl) { statusEl.innerText = 'Hoàn tất!'; statusEl.style.color = '#10b981'; }
        }
    }
}