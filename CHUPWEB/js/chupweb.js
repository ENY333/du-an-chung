let capturedBlob = null;

async function captureCurrentTab() {
    const msg = document.getElementById('msg') || document.getElementById('shot-status');
    const preview = document.getElementById('preview') || document.getElementById('shot-img');
    const previewArea = document.getElementById('preview-area');

    try {
        if (msg) {
            msg.innerText = 'Vui lòng chọn tab cần chụp và bấm "Chia sẻ"...';
            msg.style.color = '#2563eb';
        }

        // Tắt con trỏ chuột tuyệt đối khi quay tab
        const stream = await navigator.mediaDevices.getDisplayMedia({
            video: {
                displaySurface: "browser",
                cursor: "never"
            },
            audio: false,
            preferCurrentTab: false
        });

        if (msg) msg.innerText = '⏳ Đang quét và cuộn lấy trọn vẹn toàn bộ trang...';

        const video = document.createElement('video');
        video.srcObject = stream;
        video.muted = true;
        await video.play();

        await new Promise(r => setTimeout(r, 500));

        const vw = video.videoWidth;
        const vh = video.videoHeight;
        const frames = [];

        // Lấy liên tục các khung hình trong quá trình cuộn
        const maxFrames = 10;
        for (let i = 0; i < maxFrames; i++) {
            const frameCanvas = document.createElement('canvas');
            frameCanvas.width = vw;
            frameCanvas.height = vh;
            const fCtx = frameCanvas.getContext('2d');
            fCtx.drawImage(video, 0, 0, vw, vh);
            frames.push(frameCanvas);

            // Thời gian giãn cách để người dùng cuộn xem nội dung hoặc tải tiếp
            await new Promise(r => setTimeout(r, 600));
        }

        // Dừng chia sẻ màn hình
        stream.getTracks().forEach(track => track.stop());

        // Ghép tự động toàn bộ dữ liệu thành 1 tấm ảnh duy nhất
        const finalCanvas = document.createElement('canvas');
        finalCanvas.width = vw;
        finalCanvas.height = vh * frames.length;
        const ctx = finalCanvas.getContext('2d');

        frames.forEach((cvs, idx) => {
            ctx.drawImage(cvs, 0, idx * vh);
        });

        finalCanvas.toBlob((blob) => {
            capturedBlob = blob;
            if (preview) {
                preview.src = URL.createObjectURL(blob);
                preview.style.display = 'block';
            }
            if (previewArea) previewArea.style.display = 'block';
            if (msg) {
                msg.innerText = '✅ Đã chụp trọn vẹn thành công!';
                msg.style.color = '#16a34a';
            }

            // Tự tải ảnh Full về máy
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = `Full_Chat_${Date.now()}.png`;
            a.click();
        }, 'image/png');

    } catch (err) {
        if (msg) {
            msg.innerText = 'Đã hủy hoặc gặp lỗi: ' + err.message;
            msg.style.color = '#dc2626';
        }
    }
}