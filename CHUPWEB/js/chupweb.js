let capturedBlob = null;

async function captureCurrentTab() {
    const msg = document.getElementById('msg');
    const preview = document.getElementById('preview');
    const previewArea = document.getElementById('preview-area');

    try {
        msg.innerText = 'Đang đợi bạn chọn tab cần chụp...';
        msg.style.color = '#2563eb';

        // Khử hoàn toàn con trỏ chuột khi chia sẻ tab
        const stream = await navigator.mediaDevices.getDisplayMedia({
            video: {
                displaySurface: "browser",
                cursor: "never"
            },
            audio: false,
            preferCurrentTab: false
        });

        msg.innerText = '⏳ Đang quét và cuộn lấy trọn vẹn toàn bộ trang...';

        const video = document.createElement('video');
        video.srcObject = stream;
        video.muted = true;
        await video.play();

        await new Promise(r => setTimeout(r, 500));

        const vw = video.videoWidth;
        const vh = video.videoHeight;
        const frames = [];

        // Lấy 8 khung hình liên tục trong quá trình cuộn
        const maxFrames = 8;
        for (let i = 0; i < maxFrames; i++) {
            const frameCanvas = document.createElement('canvas');
            frameCanvas.width = vw;
            frameCanvas.height = vh;
            const fCtx = frameCanvas.getContext('2d');
            fCtx.drawImage(video, 0, 0, vw, vh);
            frames.push(frameCanvas);

            await new Promise(r => setTimeout(r, 500));
        }

        // Đóng stream sau khi quét xong
        stream.getTracks().forEach(track => track.stop());

        msg.innerText = '⚙️ Đang xử lý và ghép toàn trang...';

        // Khởi tạo Canvas ghép dọc toàn bộ các khung hình
        const finalCanvas = document.createElement('canvas');
        finalCanvas.width = vw;
        finalCanvas.height = vh * frames.length;
        const ctx = finalCanvas.getContext('2d');

        frames.forEach((cvs, idx) => {
            ctx.drawImage(cvs, 0, idx * vh);
        });

        finalCanvas.toBlob((blob) => {
            capturedBlob = blob;
            preview.src = URL.createObjectURL(blob);
            previewArea.style.display = 'block';
            msg.innerText = '✅ Đã chụp trọn vẹn thành công!';
            msg.style.color = '#10b981';

            // Tự động tải ảnh về máy
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = `Full_Capture_${Date.now()}.png`;
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
    a.download = `Full_Capture_${Date.now()}.png`;
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
