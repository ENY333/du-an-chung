function exportBackup() {
    const blob = new Blob([JSON.stringify(window.accountsList, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `Gmail_Backup_${Date.now()}.json`;
    a.click();
}

function exportCSV() {
    let csv = '\uFEFFHọ Tên,Email,Mật Khẩu,Email Khôi Phục,SĐT,Khóa 2FA,Ghi Chú\n';
    (window.accountsList || []).forEach(a => {
        csv += `"${a.name||''}","${a.email||''}","${a.password||''}","${a.recovery_email||''}","${a.phone||''}","${a.secret_2fa||''}","${a.note||''}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `Gmail_Accounts_${Date.now()}.csv`;
    a.click();
}

function importBackup(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
        try {
            window.accountsList = JSON.parse(ev.target.result);
            renderAccounts();
            saveAccountsData();
        } catch(err) {
            alert('File JSON không hợp lệ!');
        }
    };
    reader.readAsText(file);
}