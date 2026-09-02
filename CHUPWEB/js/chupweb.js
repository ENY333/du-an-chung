let capturedBlob = null;

async function captureCurrentTab() {
    const msg = document.getElementById('msg');
    const preview = document.getElementById('preview');
    const previewArea = document.getElementById('preview-area');
    const exportBtn = document.getElementById('btn-export-full');

    try {
        msg.innerText = 'Vui lòng chọn tab cần chụp và bấm "Chia sẻ"...';
        msg.style.color = '#2563eb';

        // Gọi hộp thoại chọn tab của trình duyệt
        const stream = await navigator.mediaDevices.getDisplayMedia({
            video: {
                displaySurface: "browser",
                cursor: "never"
            },
            audio: false,
            preferCurrentTab: false
        });

        // BẬT NÚT "XUẤT FULL TRANG" HIỆN LÊN NGAY KHI VỪA CHỌN TAB XONG
        if (exportBtn) {
            exportBtn.style.setProperty('display', 'inline-flex', 'important');
        }

        msg.innerText = '📸 Đang chụp khung hình...';

        const video = document.createElement('video');
        video.srcObject = stream;
        video.muted = true;
        await video.play();

        await new Promise(r => setTimeout(r, 400));

        // Vẽ khung hình lên Canvas
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Đóng luồng chia sẻ màn hình ngay
        stream.getTracks().forEach(track => track.stop());

        // Xuất ảnh ra preview (Không tự động tải xuống)
        canvas.toBlob((blob) => {
            capturedBlob = blob;
            preview.src = URL.createObjectURL(blob);
            previewArea.style.display = 'block';
            msg.innerText = '✅ Đã chụp xong!';
            msg.style.color = '#10b981';
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
