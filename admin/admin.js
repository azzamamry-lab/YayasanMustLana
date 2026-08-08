/* ==========================================================================
   ADMIN PANEL — helper bersama (login & dashboard)
   ========================================================================== */

function escapeHtml(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

async function api(path, options) {
  const res = await fetch(path, Object.assign({ headers: { 'Content-Type': 'application/json' } }, options));
  let data = null;
  try { data = await res.json(); } catch (e) { /* kosong */ }
  if (!res.ok) throw new Error((data && data.error) || 'Terjadi kesalahan.');
  return data;
}

function showToast(message, type) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.className = 'toast show ' + (type || '');
  toast.textContent = message;
  clearTimeout(showToast._t);
  showToast._t = setTimeout(function () { toast.className = 'toast'; }, 2600);
}

async function requireSession() {
  try {
    const s = await api('/api/session');
    if (!s.authed) {
      window.location.href = '/admin/';
      return false;
    }
    return true;
  } catch (e) {
    window.location.href = '/admin/';
    return false;
  }
}
