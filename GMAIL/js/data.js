window.accountsList = [];

async function loadAccountsData() {
    try {
        const res = await fetch('accounts.json?t=' + Date.now());
        if (res.ok) {
            window.accountsList = await res.json();
        } else {
            window.accountsList = [];
        }
    } catch (e) {
        window.accountsList = [];
    }
    if (typeof renderAccounts === 'function') {
        renderAccounts();
    }
}

async function saveAccountsData() {
    try {
        await fetch('/api/save-accounts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(window.accountsList, null, 2)
        });
    } catch (e) {
        console.error("Lỗi khi ghi accounts.json:", e);
    }
}

document.addEventListener('DOMContentLoaded', loadAccountsData);