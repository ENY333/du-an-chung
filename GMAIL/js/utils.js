const firstNames = ["Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Huỳnh", "Phan", "Vũ", "Võ", "Đặng"];
const middleNames = ["Văn", "Thị", "Hữu", "Đức", "Thành", "Công", "Minh", "Quang", "Hải", "Ngọc"];
const lastNames = ["An", "Bình", "Cường", "Dũng", "Đạt", "Hải", "Hoàng", "Huy", "Hùng", "Long"];

function generateRandomName() {
    const fn = firstNames[Math.floor(Math.random() * firstNames.length)];
    const mn = middleNames[Math.floor(Math.random() * middleNames.length)];
    const ln = lastNames[Math.floor(Math.random() * lastNames.length)];
    const val = `${fn} ${mn} ${ln}`;
    document.getElementById('gen-name-val').value = val;
    return val;
}

function copyGenName() {
    const v = document.getElementById('gen-name-val').value;
    if (v) navigator.clipboard.writeText(v);
}

async function getQuick2FA() {
    const sec = document.getElementById('quick-2fa-secret').value;
    const el = document.getElementById('quick-2fa-code');
    el.value = '...';
    el.value = await getTOTP(sec);
}