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

// Seed admin account on first load
async function ensureAdmin() {
  const users = getUsers();
  const adminEmail = 'admin@cryptosentinel.pro';
  if (!users[adminEmail]) {
    const hash = await hashPassword('admin123');
    users[adminEmail] = { hash, role: 'admin', createdAt: Date.now() };
    saveUsers(users);
  }
}
ensureAdmin();

export async function register(email, password, bitunixUid = '', telegramUsername = '') {
  const e = email.trim().toLowerCase();
  if (!e || !e.includes('@')) return { ok: false, error: 'Email invalide' };
  if (password.length < 6) return { ok: false, error: 'Mot de passe trop court (min 6 caractères)' };

  const users = getUsers();
  if (users[e]) return { ok: false, error: 'Ce compte existe déjà' };

  const hash = await hashPassword(password);
  const uid = (bitunixUid || '').trim();
  const tg = (telegramUsername || '').trim().replace(/^@/, '');
  users[e] = { hash, role: 'free', createdAt: Date.now(), bitunixUid: uid, telegramUsername: tg };
  saveUsers(users);
  localStorage.setItem(SESSION_KEY, JSON.stringify({ email: e, role: 'free', bitunixUid: uid, telegramUsername: tg, ts: Date.now() }));
  return { ok: true, email: e, role: 'free', bitunixUid: uid, telegramUsername: tg };
}

export async function login(email, password) {
  const e = email.trim().toLowerCase();
  const users = getUsers();
  const user = users[e];
  if (!user) return { ok: false, error: 'Compte introuvable' };

  const hash = await hashPassword(password);
  if (hash !== user.hash) return { ok: false, error: 'Mot de passe incorrect' };

  const role = user.role || 'free';
  const uid = user.bitunixUid || '';
  const tg = user.telegramUsername || '';
  localStorage.setItem(SESSION_KEY, JSON.stringify({ email: e, role, bitunixUid: uid, telegramUsername: tg, ts: Date.now() }));
  return { ok: true, email: e, role, bitunixUid: uid, telegramUsername: tg };
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
}

export function getCurrentUser() {
  try {
    const session = JSON.parse(localStorage.getItem(SESSION_KEY));
    if (!session?.email) return null;
    return { email: session.email, role: session.role || 'free', bitunixUid: session.bitunixUid || '', telegramUsername: session.telegramUsername || '' };
  } catch {
    return null;
  }
}

export function getUserRole() {
  const user = getCurrentUser();
  return user?.role || null;
}

export function isLoggedIn() {
  return getCurrentUser() !== null;
}

export function getAllUsers() {
  const users = getUsers();
  return Object.entries(users).map(([email, data]) => ({
    email,
    role: data.role || 'free',
    bitunixUid: data.bitunixUid || '',
    telegramUsername: data.telegramUsername || '',
    createdAt: data.createdAt || 0,
  }));
}

export function updateBitunixUid(email, uid) {
  const users = getUsers();
  const e = email.trim().toLowerCase();
  if (users[e]) {
    users[e].bitunixUid = uid.trim();
    saveUsers(users);
    const session = JSON.parse(localStorage.getItem(SESSION_KEY) || '{}');
    if (session.email === e) {
      session.bitunixUid = uid.trim();
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    }
  }
}

export function setUserRole(email, role) {
  const users = getUsers();
  const e = email.trim().toLowerCase();
  if (users[e]) {
    users[e].role = role;
    saveUsers(users);
    const session = JSON.parse(localStorage.getItem(SESSION_KEY) || '{}');
    if (session.email === e) {
      session.role = role;
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    }
  }
}

export function upgradeToPremium(email) {
  const users = getUsers();
  const e = email.trim().toLowerCase();
  if (users[e]) {
    users[e].role = 'premium';
    saveUsers(users);
    const session = JSON.parse(localStorage.getItem(SESSION_KEY) || '{}');
    if (session.email === e) {
      session.role = 'premium';
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    }
  }
}
