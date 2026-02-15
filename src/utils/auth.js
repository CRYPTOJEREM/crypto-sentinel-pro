const USERS_KEY = 'csp_users';
const SESSION_KEY = 'csp_session';

async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + '_csp_salt_2025');
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export async function register(email, password) {
  const e = email.trim().toLowerCase();
  if (!e || !e.includes('@')) return { ok: false, error: 'Email invalide' };
  if (password.length < 6) return { ok: false, error: 'Mot de passe trop court (min 6 caractères)' };

  const users = getUsers();
  if (users[e]) return { ok: false, error: 'Ce compte existe déjà' };

  const hash = await hashPassword(password);
  users[e] = { hash, createdAt: Date.now() };
  saveUsers(users);
  localStorage.setItem(SESSION_KEY, JSON.stringify({ email: e, ts: Date.now() }));
  return { ok: true, email: e };
}

export async function login(email, password) {
  const e = email.trim().toLowerCase();
  const users = getUsers();
  const user = users[e];
  if (!user) return { ok: false, error: 'Compte introuvable' };

  const hash = await hashPassword(password);
  if (hash !== user.hash) return { ok: false, error: 'Mot de passe incorrect' };

  localStorage.setItem(SESSION_KEY, JSON.stringify({ email: e, ts: Date.now() }));
  return { ok: true, email: e };
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
}

export function getCurrentUser() {
  try {
    const session = JSON.parse(localStorage.getItem(SESSION_KEY));
    return session?.email || null;
  } catch {
    return null;
  }
}

export function isLoggedIn() {
  return getCurrentUser() !== null;
}
