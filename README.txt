DYNAMIC HUB ULTIMATE — PERSONAL ONLY

Đây là bản build lại từ số 0 cho repo ENY333/du-an-chung.

Cấu trúc:
CHUNG.html
css/style.css
js/app.js
CHUPWEB/CHUPWEB.html
GMAIL/GMAIL.html
NEN/NEN.html
OCR/OCR.html
Vi-translate/Vi-translate.html

Không còn phụ thuộc các thư mục cũ đã xóa.

5 module lõi:
1. CHUPWEB: xử lý ảnh, canvas, resize, crop, filter, watermark, download...
2. GMAIL: quản lý username/link, chống trùng, favorite/link nhanh; KHÔNG lưu mật khẩu.
3. NEN: gzip/gunzip, base64, URL encode, JSON, hash, file/text tools.
4. OCR: OCR ảnh + 16 xử lý hậu kỳ.
5. Vi-translate: dịch + 25 xử lý văn bản.

HUB:
- module launcher
- favorite
- lịch sử
- tìm kiếm Ctrl+K
- backup local
- dark/light
- module tự thêm

DEPLOY:
1. Xóa sạch repo cũ.
2. Giải nén ZIP này và upload toàn bộ nội dung vào root repo.
3. Commit.
4. GitHub Pages -> Settings -> Pages -> Deploy from branch -> main -> /root.
5. Mở /CHUNG.html.

LƯU Ý:
- Đây là hệ thống client-side. Dữ liệu local nằm trên từng trình duyệt/máy.
- OCR và dịch có thể cần Internet để tải/dùng dịch vụ tương ứng.
- Gmail Manager không lưu password.
