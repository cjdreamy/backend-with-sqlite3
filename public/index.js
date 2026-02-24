/* =====================================================
   UserBase — public/index.js
   Full CRUD client for /api/users
===================================================== */

const API = '/api/users';

let allUsers = [];          // cache for client-side search filter
let pendingDeleteId = null; // tracks which user the modal is confirming

// ─────────────────────────────────────────────────────
// INIT
// ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    loadUsers();

    document.getElementById('user-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('form-id').value;
        if (id) {
            await updateUser(id);
        } else {
            await createUser();
        }
    });
});

// ─────────────────────────────────────────────────────
// READ — load all users
// ─────────────────────────────────────────────────────
async function loadUsers() {
    try {
        const res = await fetch(API);
        const users = await res.json();
        allUsers = users;
        renderTable(users);
        updateCount(users.length);
    } catch (err) {
        renderError();
        showToast('Failed to load users.', 'error');
    }
}

// ─────────────────────────────────────────────────────
// CREATE
// ─────────────────────────────────────────────────────
async function createUser() {
    const body = getFormData();
    if (!validateForm(body)) return;

    setSubmitLoading(true);
    try {
        const res = await fetch(API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to create user');
        showToast('✅ User created successfully!', 'success');
        resetForm();
        await loadUsers();
    } catch (err) {
        showToast('❌ ' + err.message, 'error');
    } finally {
        setSubmitLoading(false);
    }
}

// ─────────────────────────────────────────────────────
// UPDATE
// ─────────────────────────────────────────────────────
async function updateUser(id) {
    const body = getFormData();
    if (!validateForm(body)) return;

    setSubmitLoading(true);
    try {
        const res = await fetch(`${API}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to update user');
        showToast('✅ User updated successfully!', 'success');
        cancelEdit();
        await loadUsers();
    } catch (err) {
        showToast('❌ ' + err.message, 'error');
    } finally {
        setSubmitLoading(false);
    }
}

// ─────────────────────────────────────────────────────
// DELETE (with confirm modal)
// ─────────────────────────────────────────────────────
function promptDelete(id, name) {
    pendingDeleteId = id;
    document.getElementById('modal-username').textContent = name;
    document.getElementById('delete-modal').classList.add('open');

    document.getElementById('confirm-delete-btn').onclick = async () => {
        closeModal();
        await deleteUser(pendingDeleteId);
    };
}

async function deleteUser(id) {
    try {
        const res = await fetch(`${API}/${id}`, { method: 'DELETE' });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to delete user');
        showToast('🗑️ User deleted.', 'success');
        await loadUsers();
    } catch (err) {
        showToast('❌ ' + err.message, 'error');
    }
}

function closeModal() {
    document.getElementById('delete-modal').classList.remove('open');
    pendingDeleteId = null;
}

// ─────────────────────────────────────────────────────
// EDIT — populate form
// ─────────────────────────────────────────────────────
function populateEdit(id, name, email) {
    document.getElementById('form-id').value = id;
    document.getElementById('form-name').value = name;
    document.getElementById('form-email').value = email;
    document.getElementById('form-password').value = '';
    document.getElementById('form-password').placeholder = 'Enter new password';

    // Switch badge & button to edit mode
    const badge = document.getElementById('mode-badge');
    badge.className = 'mode-badge edit-mode';
    badge.innerHTML = '<span>✏️</span> Edit Mode — ID ' + id;

    const submitBtn = document.getElementById('submit-btn');
    submitBtn.innerHTML = '<span>💾</span> Update User';

    document.getElementById('cancel-btn').style.display = 'flex';

    // Scroll to form on mobile
    document.getElementById('form-panel').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function cancelEdit() {
    resetForm();
}

// ─────────────────────────────────────────────────────
// SEARCH / FILTER
// ─────────────────────────────────────────────────────
function filterTable() {
    const query = document.getElementById('search-input').value.toLowerCase().trim();
    const filtered = allUsers.filter(u =>
        u.user_name.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query)
    );
    renderTable(filtered);
    updateCount(filtered.length, query ? allUsers.length : null);
}

// ─────────────────────────────────────────────────────
// RENDER TABLE
// ─────────────────────────────────────────────────────
function renderTable(users) {
    const tbody = document.getElementById('table-body');

    if (!users || users.length === 0) {
        tbody.innerHTML = `
      <tr>
        <td colspan="4">
          <div class="empty-state">
            <div class="empty-icon">👤</div>
            <p>No users found. Create your first user →</p>
          </div>
        </td>
      </tr>`;
        return;
    }

    tbody.innerHTML = users.map(u => `
    <tr>
      <td class="td-id">#${u.userID}</td>
      <td class="td-name">${escHtml(u.user_name)}</td>
      <td class="td-email">${escHtml(u.email)}</td>
      <td>
        <div class="td-actions">
          <button class="btn btn-edit"
            onclick="populateEdit(${u.userID}, '${escAttr(u.user_name)}', '${escAttr(u.email)}')">
            ✏️ Edit
          </button>
          <button class="btn btn-danger"
            onclick="promptDelete(${u.userID}, '${escAttr(u.user_name)}')">
            🗑️ Delete
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

function renderError() {
    document.getElementById('table-body').innerHTML = `
    <tr class="loading-row">
      <td colspan="4" style="color: var(--danger)">⚠️ Could not connect to the server.</td>
    </tr>`;
}

function updateCount(visible, total) {
    const el = document.getElementById('user-count');
    if (total != null) {
        el.textContent = `${visible} of ${total} users`;
    } else {
        el.textContent = `${visible} user${visible !== 1 ? 's' : ''}`;
    }
}

// ─────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────
function getFormData() {
    return {
        user_name: document.getElementById('form-name').value.trim(),
        email: document.getElementById('form-email').value.trim(),
        pass_word: document.getElementById('form-password').value,
    };
}

function validateForm({ user_name, email, pass_word }) {
    if (!user_name) { showToast('⚠️ Username is required.', 'error'); return false; }
    if (!email || !email.includes('@')) { showToast('⚠️ A valid email is required.', 'error'); return false; }
    if (!pass_word) { showToast('⚠️ Password is required.', 'error'); return false; }
    return true;
}

function resetForm() {
    document.getElementById('user-form').reset();
    document.getElementById('form-id').value = '';

    const badge = document.getElementById('mode-badge');
    badge.className = 'mode-badge create-mode';
    badge.innerHTML = '<span>＋</span> Create Mode';

    const submitBtn = document.getElementById('submit-btn');
    submitBtn.innerHTML = '<span>＋</span> Create User';

    document.getElementById('cancel-btn').style.display = 'none';
    document.getElementById('form-password').placeholder = 'Enter password';
}

function setSubmitLoading(loading) {
    const btn = document.getElementById('submit-btn');
    btn.disabled = loading;
    if (loading) {
        btn.innerHTML = '<span class="spinner"></span> Saving…';
    }
}

// Toast notification
let toastTimer;
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `show ${type}`;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        toast.className = toast.className.replace('show', '').trim();
    }, 3500);
}

// Escape HTML to prevent XSS in table
function escHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

// Escape for HTML attribute values (onclick strings)
function escAttr(str) {
    return String(str).replace(/'/g, "\\'").replace(/"/g, '&quot;');
}

// Close modal when clicking the overlay background
document.getElementById('delete-modal').addEventListener('click', function (e) {
    if (e.target === this) closeModal();
});
