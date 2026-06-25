// ─── Estado ───────────────────────────────────────────────────────────────────
const state = { user: null };

// ─── SVG Icons ────────────────────────────────────────────────────────────────
const ic = {
  shield:   `<svg width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  code:     `<svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
  upload:   `<svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>`,
  download: `<svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="8 17 12 21 16 17"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>`,
  copy:     `<svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`,
  sun:      `<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`,
  moon:     `<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`,
  logout:   `<svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`,
  x:        `<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
  check:    `<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>`,
  clear:    `<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>`,
};

// ─── Toast ────────────────────────────────────────────────────────────────────
let toastTimer;
function toast(msg, type = 'ok') {
  const el = document.getElementById('toast');
  el.innerHTML = `${type === 'ok' ? ic.check : ic.x}<span>${msg}</span>`;
  el.className = type;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.add('hide'), 3200);
}

// ─── API ──────────────────────────────────────────────────────────────────────
async function api(endpoint, data) {
  const fd = new FormData();
  for (const [k, v] of Object.entries(data)) fd.append(k, v);
  const res = await fetch(`${endpoint}.php`, { method: 'POST', body: fd });
  return res.json();
}

// ─── Tema ─────────────────────────────────────────────────────────────────────
function initTheme() {
  if (localStorage.getItem('jsguard_theme') === 'light') document.body.classList.add('light');
  syncThemeIcon();
}
function toggleTheme() {
  document.body.classList.toggle('light');
  localStorage.setItem('jsguard_theme', document.body.classList.contains('light') ? 'light' : 'dark');
  syncThemeIcon();
}
function syncThemeIcon() {
  const btn = document.getElementById('btn-theme');
  if (btn) btn.innerHTML = document.body.classList.contains('light') ? ic.moon : ic.sun;
}

// ─── Páginas ──────────────────────────────────────────────────────────────────
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.toggle('hidden', p.id !== id));
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
let authMode = 'login';

function setAuthMode(mode) {
  authMode = mode;
  const isLogin = mode === 'login';
  document.getElementById('auth-title').textContent = isLogin ? 'Bem-vindo de volta' : 'Criar conta';
  document.getElementById('auth-sub').textContent   = isLogin ? 'Acesse sua conta para continuar' : 'Cadastre-se gratuitamente';
  document.getElementById('auth-btn').textContent   = isLogin ? 'Entrar' : 'Criar conta';
  document.getElementById('confirm-wrap').classList.toggle('hidden', isLogin);
  document.getElementById('auth-switch-text').innerHTML = isLogin
    ? `Não tem conta? <a onclick="setAuthMode('register')">Cadastre-se</a>`
    : `Já tem conta? <a onclick="setAuthMode('login')">Entrar</a>`;
  hideAuthError();
}

function showAuthError(msg) {
  const el = document.getElementById('auth-error');
  el.innerHTML = `${ic.x} ${msg}`;
  el.classList.remove('hidden');
}
function hideAuthError() {
  document.getElementById('auth-error').classList.add('hidden');
}

async function doAuth() {
  hideAuthError();
  const email   = document.getElementById('auth-email').value.trim();
  const senha   = document.getElementById('auth-senha').value;
  const confirm = document.getElementById('auth-confirm')?.value;
  const btn     = document.getElementById('auth-btn');

  if (!email || !senha) { showAuthError('Preencha todos os campos.'); return; }
  if (authMode === 'register') {
    if (!confirm) { showAuthError('Confirme sua senha.'); return; }
    if (senha !== confirm) { showAuthError('As senhas não coincidem.'); return; }
    if (senha.length < 6) { showAuthError('Senha mínima: 6 caracteres.'); return; }
  }

  btn.disabled = true;
  btn.textContent = authMode === 'login' ? 'Entrando...' : 'Criando conta...';

  const r = await api('auth', { action: authMode === 'login' ? 'login' : 'registrar', email, senha });
  btn.disabled = false;
  btn.textContent = authMode === 'login' ? 'Entrar' : 'Criar conta';

  if (r.error) { showAuthError(r.error); return; }
  state.user = r.email;
  enterApp();
}

async function doLogout() {
  await api('auth', { action: 'logout' });
  state.user = null;
  showPage('page-auth');
  toast('Até logo! 👋');
}

function enterApp() {
  const el = document.getElementById('user-chip');
  if (el) el.textContent = state.user;
  showPage('page-app');
  toast('Bem-vindo! 🎉');
}

async function checkSession() {
  const r = await api('auth', { action: 'sessao' });
  if (r.ok) { state.user = r.email; enterApp(); }
  else showPage('page-auth');
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────
function setTab(id) {
  document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.tab === id));
  document.getElementById('panel-editor').classList.toggle('hidden', id !== 'editor');
}

// ─── Ofuscação ────────────────────────────────────────────────────────────────
async function doObfuscar() {
  const input = document.getElementById('code-input');
  const codigo = input.value.trim();
  if (!codigo) { toast('Cole ou faça upload de um .js primeiro.', 'err'); return; }

  const btn = document.getElementById('btn-obf');
  btn.disabled = true;
  btn.innerHTML = `<span class="spinner"></span> Ofuscando...`;

  const output = document.getElementById('code-output');
  output.value = '';
  output.classList.remove('has-output');

  const r = await api('obfuscar', { action: 'ofuscar', codigo });

  btn.disabled = false;
  btn.innerHTML = `${ic.shield} Ofuscar Código JavaScript`;

  if (r.error) { toast('Erro: ' + r.error, 'err'); return; }

  output.value = r.resultado;
  output.classList.add('has-output');

  const pct = Math.round(((r.resultado.length / Math.max(codigo.length, 1)) - 1) * 100);
  document.getElementById('out-lines').textContent = r.resultado.split('\n').length + ' linhas';
  document.getElementById('out-pct').textContent   = '+' + pct + '% complexidade';
  document.getElementById('out-foot').classList.remove('hidden');

  toast('Código ofuscado! 🛡️');
}

// ─── Upload ───────────────────────────────────────────────────────────────────
function handleFile(e) {
  const file = e.target.files?.[0];
  if (!file) return;
  if (!file.name.endsWith('.js')) { toast('Selecione um arquivo .js', 'err'); return; }
  const reader = new FileReader();
  reader.onload = ev => {
    document.getElementById('code-input').value = ev.target.result;
    updateStats();
    toast(`"${file.name}" carregado!`);
  };
  reader.readAsText(file);
  e.target.value = '';
}

function updateStats() {
  const val = document.getElementById('code-input').value;
  document.getElementById('in-lines').textContent = val.split('\n').length + ' linhas';
  document.getElementById('in-chars').textContent = val.length + ' chars';
}

function limparInput() {
  document.getElementById('code-input').value = '';
  updateStats();
}

// ─── Copiar / Baixar ──────────────────────────────────────────────────────────
function copiar() {
  const val = document.getElementById('code-output').value;
  if (!val) return;
  navigator.clipboard.writeText(val).then(() => toast('Copiado!')).catch(() => toast('Erro ao copiar.', 'err'));
}

function baixar() {
  const val = document.getElementById('code-output').value;
  if (!val) return;
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([val], { type: 'text/javascript' }));
  a.download = 'obfuscated.js'; a.click();
  toast('Arquivo baixado! ⬇️');
}

// ─── Init ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  checkSession();

  // Enter no auth
  ['auth-email','auth-senha','auth-confirm'].forEach(id => {
    document.getElementById(id)?.addEventListener('keydown', e => {
      if (e.key === 'Enter') doAuth();
    });
  });

  // Stats do editor
  document.getElementById('code-input')?.addEventListener('input', updateStats);

  // Upload
  document.getElementById('file-input')?.addEventListener('change', handleFile);
});
