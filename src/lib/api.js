// Backend API client — talks to the Express + MySQL API.
// Falls back gracefully when the API is unreachable.

const BASE = import.meta.env.VITE_API_URL || "";
const TOKEN_KEY = "gv_token";

export const apiStatus = { ok: false };

export function getToken() {
  try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
}
export function setToken(t) {
  try { localStorage.setItem(TOKEN_KEY, t); } catch { /* ignore */ }
}
export function clearToken() {
  try { localStorage.removeItem(TOKEN_KEY); } catch { /* ignore */ }
}

async function request(path, { method = "GET", body, auth = false } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth) {
    const token = getToken();
    if (!token) throw new Error("Not logged in");
    headers.Authorization = `Bearer ${token}`;
  }
  const res = await fetch(BASE + path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  apiStatus.ok = true;
  return data;
}

export const apiBase = BASE;

// Turn a backend file path (/uploads/x) into an absolute URL viewers can load
export function fileUrl(path) {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  return (BASE || "") + path;
}

export async function uploadFile(file) {
  const token = getToken();
  if (!token) throw new Error("Not logged in");
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch(BASE + "/api/uploads", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: fd,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Upload failed (${res.status})`);
  return fileUrl(data.url);
}

export const api = {
  health: () => request("/api/health"),
  login: (email, password) => request("/api/auth/login", { method: "POST", body: { email, password } }),
  me: () => request("/api/auth/me", { auth: true }),

  weeklyList: () => request("/api/weekly"),
  weeklyAdd: (item) => request("/api/weekly", { method: "POST", body: item, auth: true }),
  weeklyUpdate: (id, item) => request(`/api/weekly/${id}`, { method: "PUT", body: item, auth: true }),
  weeklyDelete: (id) => request(`/api/weekly/${id}`, { method: "DELETE", auth: true }),

  galleryList: () => request("/api/gallery"),
  galleryAdd: (item) => request("/api/gallery", { method: "POST", body: item, auth: true }),
  galleryDelete: (id) => request(`/api/gallery/${id}`, { method: "DELETE", auth: true }),

  sermonsList: () => request("/api/sermons"),
  sermonAdd: (item) => request("/api/sermons", { method: "POST", body: item, auth: true }),
  sermonUpdate: (id, item) => request(`/api/sermons/${id}`, { method: "PUT", body: item, auth: true }),
  sermonDelete: (id) => request(`/api/sermons/${id}`, { method: "DELETE", auth: true }),

  sendMessage: (item) => request("/api/messages", { method: "POST", body: item }),
  messagesList: () => request("/api/messages", { auth: true }),
  messageDelete: (id) => request(`/api/messages/${id}`, { method: "DELETE", auth: true }),

  subscribe: (email) => request("/api/newsletter/subscribe", { method: "POST", body: { email } }),
  subscribersList: () => request("/api/newsletter", { auth: true }),
  subscriberDelete: (id) => request(`/api/newsletter/${id}`, { method: "DELETE", auth: true }),
};
