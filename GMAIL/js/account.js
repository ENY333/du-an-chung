let currentFilter = '';
let selectedIndices = new Set();

function handleSearch() {
    currentFilter = document.getElementById('search-input').value.trim().toLowerCase();
    renderAccounts();
}

function copyToClipboard(text, el) {
    if (!text || text === '-') return;
    navigator.clipboard.writeText(text).then(() => {
        const o = el.innerText;
        el.innerText = '✓';
        setTimeout(() => el.innerText = o, 1000);
    });
}

function toggleSelectAll(m) {
    selectedIndices.clear();
    if (m.checked) (window.accountsList || []).forEach((_, idx) => selectedIndices.add(idx));
    renderAccounts();
}

function toggleRowSelect(idx) {
    if (selectedIndices.has(idx)) selectedIndices.delete(idx);
    else selectedIndices.add(idx);
    renderAccounts();
}

function deleteSelectedBatch() {
    if (selectedIndices.size === 0) return alert('Chưa chọn dòng nào!');
    if (confirm(`Xóa ${selectedIndices.size} tài khoản đã chọn?`)) {
        window.accountsList = window.accountsList.filter((_, idx) => !selectedIndices.has(idx));
        selectedIndices.clear();
        renderAccounts();
        saveAccountsData();
    }
}

async function renderAccounts() {
    const tbody = document.getElementById('account-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    const list = window.accountsList || [];
    const sec = 30 - (Math.floor(Date.now() / 1000) % 30);

    const filtered = list.filter(a => !currentFilter || `${a.name||''} ${a.email||''} ${a.note||''}`.toLowerCase().includes(currentFilter));

    filtered.forEach((acc, i) => {
        const realIdx = list.indexOf(acc);
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><input type="checkbox" ${selectedIndices.has(realIdx)?'checked':''} onchange="toggleRowSelect(${realIdx})"></td>
            <td>${i + 1}</td>
            <td class="copyable" onclick="copyToClipboard('${acc.name||''}', this)">${acc.name||'-'}</td>
            <td class="copyable" onclick="copyToClipboard('${acc.email||''}', this)">${acc.email||'-'}</td>
            <td class="copyable" onclick="copyToClipboard('${acc.password||''}', this)">${acc.password||'-'}</td>
            <td class="copyable" onclick="copyToClipboard('${acc.recovery_email||''}', this)">${acc.recovery_email||'-'}</td>
            <td class="copyable" onclick="copyToClipboard('${acc.phone||''}', this)">${acc.phone||'-'}</td>
            <td><span class="totp-badge" id="totp-${realIdx}">...</span> <small style="color:#ef4444">(${sec}s)</small></td>
            <td>${acc.note||'-'}</td>
            <td>
                <button class="btn btn-secondary" style="padding:2px 6px; font-size:11px;" onclick="openEditModal(${realIdx})">Sửa</button>
                <button class="btn btn-danger" style="padding:2px 6px; font-size:11px;" onclick="deleteAccount(${realIdx})">Xóa</button>
            </td>
        `;
        tbody.appendChild(tr);

        if (acc.secret_2fa && acc.secret_2fa.trim()) {
            getTOTP(acc.secret_2fa.replace(/\s/g,'')).then(code => {
                const el = document.getElementById(`totp-${realIdx}`);
                if (el) el.innerText = code;
            });
        } else {
            const el = document.getElementById(`totp-${realIdx}`);
            if (el) el.innerText = 'Không có';
        }
    });
}

setInterval(renderAccounts, 1000);

function openAddModal() {
    document.getElementById('modal-title').innerText = 'Thêm Tài Khoản';
    document.getElementById('edit-index').value = '-1';
    ['name','email','pass','recovery','phone','2fa','note'].forEach(k => document.getElementById('inp-'+k).value = '');
    document.getElementById('account-modal').classList.add('active');
}

function openEditModal(idx) {
    const a = window.accountsList[idx];
    if (!a) return;
    document.getElementById('modal-title').innerText = 'Sửa Tài Khoản';
    document.getElementById('edit-index').value = idx;
    document.getElementById('inp-name').value = a.name||'';
    document.getElementById('inp-email').value = a.email||'';
    document.getElementById('inp-pass').value = a.password||'';
    document.getElementById('inp-recovery').value = a.recovery_email||'';
    document.getElementById('inp-phone').value = a.phone||'';
    document.getElementById('inp-2fa').value = a.secret_2fa||'';
    document.getElementById('inp-note').value = a.note||'';
    document.getElementById('account-modal').classList.add('active');
}

function closeModal() { document.getElementById('account-modal').classList.remove('active'); }

function saveAccount() {
    const idx = parseInt(document.getElementById('edit-index').value);
    const acc = {
        name: document.getElementById('inp-name').value.trim(),
        email: document.getElementById('inp-email').value.trim(),
        password: document.getElementById('inp-pass').value.trim(),
        recovery_email: document.getElementById('inp-recovery').value.trim(),
        phone: document.getElementById('inp-phone').value.trim(),
        secret_2fa: document.getElementById('inp-2fa').value.trim(),
        note: document.getElementById('inp-note').value.trim()
    };
    if (!acc.email) return alert('Email không được để trống!');
    if (idx >= 0) window.accountsList[idx] = acc;
    else window.accountsList.push(acc);
    closeModal();
    renderAccounts();
    saveAccountsData();
}

function deleteAccount(idx) {
    if (confirm('Xóa tài khoản này?')) {
        window.accountsList.splice(idx, 1);
        renderAccounts();
        saveAccountsData();
    }
}