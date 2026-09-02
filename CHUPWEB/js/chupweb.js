let capturedBlob = null;

async function captureCurrentTab() {
    const msg = document.getElementById('msg');
    const preview = document.getElementById('preview');
    const previewArea = document.getElementById('preview-area');

    try {
        msg.innerText = 'Chọn tab cần chụp và bấm "Chia sẻ"...';
        msg.style.color = '#2563eb';

        const stream = await navigator.mediaDevices.getDisplayMedia({
            video: {
                displaySurface: "browser",
                cursor: "never"
            },
            audio: false,
            preferCurrentTab: false
        });

        msg.innerText = '📸 Đang ghi lại khung hình chuẩn...';

        const video = document.createElement('video');
        video.srcObject = stream;
        video.muted = true;
        await video.play();

        await new Promise(r => setTimeout(r, 400));

        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        stream.getTracks().forEach(track => track.stop());

        canvas.toBlob((blob) => {
            capturedBlob = blob;
            preview.src = URL.createObjectURL(blob);
            previewArea.style.display = 'block';
            msg.innerText = '✅ Đã chụp thành công!';
            msg.style.color = '#10b981';

            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = `Screenshot_${Date.now()}.png`;
            a.click();
        }, 'image/png');

    } catch (err) {
        if (err.name !== 'NotAllowedError') {
            msg.innerText = 'Lỗi: ' + err.message;
            msg.style.color = '#ef4444';
        } else {
            msg.innerText = '';
        }
    }
}

function downloadImage() {
    if (!capturedBlob) return;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(capturedBlob);
    a.download = `Screenshot_${Date.now()}.png`;
    a.click();
}

async function copyImage() {
    if (!capturedBlob) return;
    try {
        await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': capturedBlob })
        ]);
        alert('Đã sao chép ảnh vào bộ nhớ tạm!');
    } catch (e) {
        alert('Không thể sao chép: ' + e.message);
    }
}
