function dec2hex(s) { return (s < 15.5 ? '0' : '') + Math.round(s).toString(16); }
function hex2dec(s) { return parseInt(s, 16); }

function base32tohex(base32) {
    let base32chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
    let bits = "", hex = "";
    base32 = base32.replace(/=+$/, "").toUpperCase().replace(/\s/g, "");
    for (let i = 0; i < base32.length; i++) {
        let val = base32chars.indexOf(base32.charAt(i));
        if (val === -1) continue;
        bits += val.toString(2).padStart(5, '0');
    }
    for (let i = 0; i + 4 <= bits.length; i += 4) {
        hex += parseInt(bits.substr(i, 4), 2).toString(16);
    }
    return hex;
}

async function getTOTP(secret) {
    if (!secret || !secret.trim()) return '';
    try {
        let key = base32tohex(secret);
        let epoch = Math.round(new Date().getTime() / 1000.0);
        let time = Math.floor(epoch / 30).toString(16).padStart(16, '0');
        let keyBytes = new Uint8Array(key.match(/[\da-f]{2}/gi).map(h => parseInt(h, 16)));
        let timeBytes = new Uint8Array(time.match(/[\da-f]{2}/gi).map(h => parseInt(h, 16)));
        
        let cryptoKey = await crypto.subtle.importKey('raw', keyBytes, { name: 'HMAC', hash: 'SHA-1' }, false, ['sign']);
        let sig = await crypto.subtle.sign('HMAC', cryptoKey, timeBytes);
        let hmac = new Uint8Array(sig);
        let offset = hmac[hmac.length - 1] & 0xf;
        let otp = ((hmac[offset] & 0x7f) << 24) | ((hmac[offset + 1] & 0xff) << 16) | ((hmac[offset + 2] & 0xff) << 8) | (hmac[offset + 3] & 0xff);
        return (otp % 1000000).toString().padStart(6, '0');
    } catch (e) {
        return 'ERR';
    }
}
window.getTOTP = getTOTP;