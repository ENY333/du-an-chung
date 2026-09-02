let capturedBlob = null;

async function captureCurrentTab() {
    const msg = document.getElementById('msg');
    const preview = document.getElementById('preview');
    const previewArea = document.getElementById('preview-area');

    try {
        msg.innerText = 'Vui lòng chọn tab cần chụp và bấm "Chia sẻ"...';
        msg.style.color = '#2563eb';

        // Tắt con trỏ chuột
        const stream = await navigator.mediaDevices.getDisplayMedia({
            video: {
                displaySurface: "browser",
                cursor: "never"
            },
            audio: false,
            preferCurrentTab: false
        });

        msg.innerText = '📸 Đang xử lý hình ảnh...';

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

        // Dừng chia sẻ màn hình ngay khi lấy xong ảnh
        stream.getTracks().forEach(track => track.stop());

        canvas.toBlob((blob) => {
            capturedBlob = blob;
            preview.src = URL.createObjectURL(blob);
            previewArea.style.display = 'block';
            msg.innerText = '✅ Đã chụp xong! Xem ảnh bên dưới:';
            msg.style.color = '#10b981';

            // ĐÃ BỎ ĐOẠN TỰ ĐỘNG TẢI (a.click())
            // Giờ chỉ hiện trên web, khi nào bạn muốn tải thì bấm nút "💾 Tải Về Máy"
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

// Bấm nút này mới tải file về máy
function downloadImage() {
    if (!capturedBlob) return;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(capturedBlob);
    a.download = `Screenshot_${Date.now()}.png`;
    a.click();
}

// Sao chép ảnh vào clipboard
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
