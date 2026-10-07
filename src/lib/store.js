// Local store — used when the MySQL API is unreachable.
// Data persists in this browser's localStorage so the admin panel and
// public pages keep working with zero backend.

const WEEKLY_KEY = "gv_weeklyServices";
const GALLERY_KEY = "gv_gallery";

const seedWeekly = [
  { id: "local-1", date: "2026-09-07", theme: "Grace That Transforms", minister: "Parish Pastor — RCCG Grace Ville Agbara", bibleText: "Ephesians 2:8 - For by grace are ye saved...", serviceTime: "8:00 AM", venue: "Block 3, Former FMW Staff Quarters, Opposite Nestle 2 Gate, Frontline Estate, Agbara - Lagos, Nigeria", announcements: ["Workers Meeting Saturday 4PM", "Youth Vigil Friday 10PM", "Holy Communion next Sunday"], imageUrl: "", youtubeUrl: "" },
  { id: "local-2", date: "2026-08-31", theme: "Walking in Divine Favour", minister: "Pastor Mrs. Adeboye", bibleText: "Psalm 90:17", serviceTime: "8:00 AM", venue: "RCCG Grace Ville Agbara", announcements: ["Spiritual Diet Wednesday 5PM", "Break Through Hour Thursday 7:30AM"], imageUrl: "", youtubeUrl: "" },
];

const seedGallery = [
  { id: "g-1", url: "/DONATION1.jpeg", caption: "RCCG Grace Ville Agbara Auditorium", category: "Service" },
  { id: "g-2", url: "/DONATION2.jpeg", caption: "Building Project — Grace Ville", category: "Service" },
  { id: "g-3", url: "/RGVA.jpeg", caption: "Grace Ville Identity", category: "Workers" },
];

function read(key, seed) {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch { /* corrupted — reseed below */ }
  try { localStorage.setItem(key, JSON.stringify(seed)); } catch { /* private mode */ }
  return [...seed];
}

function write(key, list) {
  try { localStorage.setItem(key, JSON.stringify(list)); } catch { /* ignore */ }
}

const uid = () => "local-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

const byDateDesc = (a, b) => (b.date || "").localeCompare(a.date || "");

export const localStore = {
  loadWeekly() { return read(WEEKLY_KEY, seedWeekly).sort(byDateDesc); },
  addWeekly(item) {
    const list = read(WEEKLY_KEY, seedWeekly);
    const entry = { ...item, id: uid() };
    write(WEEKLY_KEY, [...list, entry].sort(byDateDesc));
    return entry;
  },
  updateWeekly(id, item) {
    const list = read(WEEKLY_KEY, seedWeekly).map(s => (s.id === id ? { ...s, ...item, id } : s));
    write(WEEKLY_KEY, list.sort(byDateDesc));
  },
  removeWeekly(id) { write(WEEKLY_KEY, read(WEEKLY_KEY, seedWeekly).filter(s => s.id !== id)); },

  loadGallery() { return read(GALLERY_KEY, seedGallery); },
  addGallery(item) {
    const list = read(GALLERY_KEY, seedGallery);
    const entry = { ...item, id: uid() };
    write(GALLERY_KEY, [...list, entry]);
    return entry;
  },
  removeGallery(id) { write(GALLERY_KEY, read(GALLERY_KEY, seedGallery).filter(g => g.id !== id)); },
};
