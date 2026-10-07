import { useEffect, useState } from "react";
import { api, getToken, setToken, clearToken, uploadFile } from "../lib/api";
import { localStore } from "../lib/store";
import { toast } from "react-toastify";

// Only these emails may use the admin panel.
const ADMIN_EMAILS = ["rccggva@gmail.com", "admin@rccggraceville.org"];
const isAdminEmail = (email) => ADMIN_EMAILS.includes((email || "").toLowerCase());

// Local-mode fallback credentials (used only when the API is unreachable).
const LOCAL_EMAIL = (import.meta.env.VITE_ADMIN_EMAIL || "rccggva@gmail.com").toLowerCase();
const LOCAL_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "rccggva@gmail123";
const LOCAL_SESSION_KEY = "gv_admin";

const GALLERY_CATEGORIES = ["Service", "Choir", "Youth", "Outreach", "Workers"];

const emptyServiceForm = {
  date: new Date().toISOString().slice(0, 10),
  theme: "",
  minister: "",
  bibleText: "",
  serviceTime: "8:00 AM",
  venue: "Block 3, Former FMW Staff Quarters, Opposite Nestle 2 Gate, Frontline Estate, Agbara - Lagos, Nigeria",
  youtubeUrl: "",
  imageUrl: "",
  announcements: "",
};

const readLocalSession = () => {
  try { return sessionStorage.getItem(LOCAL_SESSION_KEY); } catch { return null; }
};

export default function Admin() {
  const [apiUser, setApiUser] = useState(null);
  const [localAdmin, setLocalAdmin] = useState(() => readLocalSession());
  const [mode, setMode] = useState("api"); // "api" | "local"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [services, setServices] = useState([]);
  const [form, setForm] = useState(emptyServiceForm);
  const [editingId, setEditingId] = useState(null);
  const [galleryItems, setGalleryItems] = useState([]);
  const [galleryForm, setGalleryForm] = useState({ url: "", caption: "", category: "Service" });
  const [sermons, setSermons] = useState([]);
  const [sermonForm, setSermonForm] = useState({ title: "", pastor: "", date: new Date().toISOString().slice(0, 10), youtube: "", category: "", desc: "" });
  const [editingSermonId, setEditingSermonId] = useState(null);
  const [uploading, setUploading] = useState("");
  // Messages + newsletter inboxes (API mode only)
  const [messages, setMessages] = useState([]);
  const [subscribers, setSubscribers] = useState([]);

  const effectiveUser = apiUser || (localAdmin ? { email: localAdmin, local: true } : null);
  const authorized = effectiveUser && (effectiveUser.local || isAdminEmail(effectiveUser.email));
  const useLocal = mode === "local" || !!localAdmin;

  const fetchServices = async () => {
    if (!useLocal) {
      try {
        setServices(await api.weeklyList());
        return;
      } catch { /* fall through to local */ }
    }
    setServices(localStore.loadWeekly());
  };

  const fetchGallery = async () => {
    if (!useLocal) {
      try {
        const rows = await api.galleryList();
        if (rows.length) { setGalleryItems(rows); return; }
      } catch { /* fall through */ }
    }
    setGalleryItems(localStore.loadGallery());
  };

  const fetchInbox = async () => {
    if (useLocal) return;
    try {
      const [m, s] = await Promise.all([api.messagesList(), api.subscribersList()]);
      setMessages(m);
      setSubscribers(s);
    } catch { /* API down — inbox unavailable */ }
  };

  useEffect(() => {
    // Restore API session if a token was saved
    if (getToken() && !apiUser) {
      api.me().then((me) => setApiUser({ email: me.email })).catch(() => clearToken());
    }
    const saved = readLocalSession();
    if (saved) { setLocalAdmin(saved); setMode("local"); }
  }, []);

  useEffect(() => { if (authorized) { fetchServices(); fetchGallery(); fetchSermons(); fetchInbox(); } }, [authorized]);

  const fetchSermons = async () => {
    if (useLocal) return; // sermons live in MySQL only
    try {
      setSermons(await api.sermonsList());
    } catch { setSermons([]); }
  };

  const isVideoUrl = (u) => /\.(mp4|webm|mov)(\?|#|$)/i.test(u || "") || (u || "").startsWith("data:video");

  // Gallery upload: images AND videos. API mode uploads to the server;
  // local mode embeds the file directly (max 4MB) so it works offline.
  const handleGalleryFile = async (file) => {
    if (!file) return;
    if (!useLocal) {
      await handleFile(file, (url) => setGalleryForm((f) => ({ ...f, url })));
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      toast.error("File too large for local mode (max 4MB) — start the backend for bigger files");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setGalleryForm((f) => ({ ...f, url: reader.result }));
      toast.success("Attached (local mode)!");
    };
    reader.onerror = () => toast.error("Could not read file");
    reader.readAsDataURL(file);
  };

  // Upload a file and put the returned URL into a form field
  const handleFile = async (file, apply) => {
    if (!file) return;
    setUploading(file.name);
    try {
      const url = await uploadFile(file);
      apply(url);
      toast.success("Uploaded!");
    } catch (err) {
      toast.error("Upload failed: " + err.message);
    } finally {
      setUploading("");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!isAdminEmail(email)) {
      toast.error("Access denied — this email is not an admin");
      return;
    }
    // 1) Try the MySQL backend
    try {
      const r = await api.login(email, password);
      setToken(r.token);
      setApiUser({ email: r.email });
      setLocalAdmin(null);
      setMode("api");
      toast.success("Admin logged in — connected to MySQL");
      return;
    } catch (err) {
      if (err.message === "Wrong password" || err.message === "No admin account with this email") {
        toast.error(err.message);
        return;
      }
      // API unreachable → local fallback
    }
    // 2) Local fallback (API down)
    if (email.trim().toLowerCase() === LOCAL_EMAIL && password === LOCAL_PASSWORD) {
      try { sessionStorage.setItem(LOCAL_SESSION_KEY, email.trim()); } catch { /* ignore */ }
      setLocalAdmin(email.trim());
      setMode("local");
      toast.success("Admin logged in (local mode — API unreachable, saved in this browser)");
    } else {
      toast.error("API unreachable and local password did not match — is the backend running on :5000?");
    }
  };

  const handleLogout = () => {
    clearToken();
    try { sessionStorage.removeItem(LOCAL_SESSION_KEY); } catch { /* ignore */ }
    setApiUser(null);
    setLocalAdmin(null);
    setMode("api");
  };

  const resetServiceForm = () => {
    setForm(emptyServiceForm);
    setEditingId(null);
  };

  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    const announcements = form.announcements.split("\n").map(s => s.trim()).filter(Boolean);
    try {
      if (!useLocal) {
        if (editingId) {
          await api.weeklyUpdate(editingId, { ...form, announcements });
          toast.success("Weekly service updated!");
        } else {
          await api.weeklyAdd({ ...form, announcements });
          toast.success("Weekly service added! Live on Home & Weekly Updates");
        }
      } else if (editingId) {
        localStore.updateWeekly(editingId, { ...form, announcements });
        toast.success("Weekly service updated (local mode)!");
      } else {
        localStore.addWeekly({ ...form, announcements });
        toast.success("Weekly service added (local mode)!");
      }
      resetServiceForm();
      fetchServices();
    } catch (err) {
      toast.error("Save failed: " + err.message);
    }
  };

  const startEdit = (s) => {
    setEditingId(s.id);
    setForm({
      date: s.date || new Date().toISOString().slice(0, 10),
      theme: s.theme || "",
      minister: s.minister || "",
      bibleText: s.bibleText || "",
      serviceTime: s.serviceTime || "8:00 AM",
      venue: s.venue || emptyServiceForm.venue,
      youtubeUrl: s.youtubeUrl || "",
      imageUrl: s.imageUrl || "",
      announcements: Array.isArray(s.announcements) ? s.announcements.join("\n") : (s.announcements || ""),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this weekly update?")) return;
    try {
      if (!useLocal) await api.weeklyDelete(id);
      else localStore.removeWeekly(id);
      toast.success("Deleted");
      fetchServices();
    } catch (err) {
      toast.error("Delete failed: " + err.message);
    }
  };

  const handleGalleryAdd = async (e) => {
    e.preventDefault();
    if (!galleryForm.url.trim() || !galleryForm.caption.trim()) { toast.error("Image URL and caption are required"); return; }
    const item = { url: galleryForm.url.trim(), caption: galleryForm.caption.trim(), category: galleryForm.category };
    try {
      if (!useLocal) await api.galleryAdd(item);
      else localStore.addGallery(item);
      toast.success(useLocal ? "Gallery photo added (local mode)!" : "Gallery photo added!");
      setGalleryForm({ url: "", caption: "", category: "Service" });
      fetchGallery();
    } catch (err) {
      toast.error("Gallery save failed: " + err.message);
    }
  };

  const handleGalleryDelete = async (id) => {
    if (!confirm("Delete this photo?")) return;
    try {
      if (!useLocal) await api.galleryDelete(id);
      else localStore.removeGallery(id);
      toast.success("Photo deleted");
      fetchGallery();
    } catch (err) {
      toast.error("Delete failed: " + err.message);
    }
  };

  const handleSermonSubmit = async (e) => {
    e.preventDefault();
    if (useLocal) { toast.error("Sermons need the MySQL backend — start it first"); return; }
    try {
      if (editingSermonId) {
        await api.sermonUpdate(editingSermonId, sermonForm);
        toast.success("Sermon updated!");
      } else {
        await api.sermonAdd(sermonForm);
        toast.success("Sermon published!");
      }
      setSermonForm({ title: "", pastor: "", date: new Date().toISOString().slice(0, 10), youtube: "", category: "", desc: "" });
      setEditingSermonId(null);
      fetchSermons();
    } catch (err) {
      toast.error("Save failed: " + err.message);
    }
  };

  const startSermonEdit = (s) => {
    setEditingSermonId(s.id);
    setSermonForm({ title: s.title || "", pastor: s.pastor || "", date: s.date || "", youtube: s.youtube || "", category: s.category || "", desc: s.desc || "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSermonDelete = async (id) => {
    if (!confirm("Delete this sermon?")) return;
    try {
      await api.sermonDelete(id);
      toast.success("Sermon deleted");
      fetchSermons();
    } catch (err) {
      toast.error("Delete failed: " + err.message);
    }
  };

  const handleMessageDelete = async (id) => {
    if (!confirm("Delete this message?")) return;
    try {
      await api.messageDelete(id);
      toast.success("Message deleted");
      fetchInbox();
    } catch (err) {
      toast.error("Delete failed: " + err.message);
    }
  };

  const handleSubscriberDelete = async (id) => {
    if (!confirm("Remove this subscriber?")) return;
    try {
      await api.subscriberDelete(id);
      toast.success("Subscriber removed");
      fetchInbox();
    } catch (err) {
      toast.error("Delete failed: " + err.message);
    }
  };

  if (!effectiveUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="bg-white border rounded-2xl p-8">
          <h1 className="text-xl font-extrabold text-slate-900">Admin Login — RCCG Grace Ville</h1>
          <p className="text-xs text-slate-500 mt-1">Restricted area. Only allowlisted admin emails can sign in.</p>
          <form onSubmit={handleLogin} className="space-y-3 mt-6">
            <input type="email" placeholder="rccggva@gmail.com" value={email} onChange={e=>setEmail(e.target.value)} required className="w-full border rounded-lg px-3 py-2 text-sm" />
            <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required className="w-full border rounded-lg px-3 py-2 text-sm" />
            <button className="w-full bg-[#1a3a5f] text-white py-2.5 rounded-full font-bold text-sm">Login</button>
          </form>
          <p className="text-[10px] text-slate-400 mt-4">Signs in against the MySQL backend (localhost:5000). Falls back to local mode if the API is down.</p>
        </div>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="bg-white border rounded-2xl p-8 text-center">
          <h1 className="text-xl font-extrabold text-red-600">Access Denied</h1>
          <p className="text-xs text-slate-500 mt-2">Signed in as {effectiveUser.email}, which is not an admin email.</p>
          <button onClick={handleLogout} className="mt-6 bg-slate-900 text-white px-6 py-2 rounded-full text-sm font-bold">Sign out</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-extrabold text-slate-900">Admin Panel — RCCG Grace Ville</h1>
        <button onClick={handleLogout} className="text-xs bg-slate-900 text-white px-4 py-2 rounded-full">Logout ({effectiveUser.email})</button>
      </div>
      {useLocal ? (
        <p className="text-xs mt-2 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg px-3 py-2">Local mode — API unreachable. Changes save in this browser. Start the backend (<code>cd backend</code> → <code>node src/index.js</code>) for shared MySQL data.</p>
      ) : (
        <p className="text-xs mt-2 bg-green-50 border border-green-200 text-green-800 rounded-lg px-3 py-2">Connected to MySQL backend — changes are live for every visitor.</p>
      )}

      {/* Weekly services */}
      <h2 className="font-extrabold text-lg mt-10">{editingId ? "Edit Weekly Service" : "Add Weekly Service"}</h2>
      <form onSubmit={handleServiceSubmit} className="bg-white border rounded-2xl p-6 mt-4 grid md:grid-cols-2 gap-4">
        <div><label className="text-xs font-bold uppercase">Date</label><input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} required className="w-full border rounded-lg px-3 py-2 text-sm mt-1" /></div>
        <div><label className="text-xs font-bold uppercase">Theme / Topic</label><input value={form.theme} onChange={e=>setForm({...form,theme:e.target.value})} required placeholder="e.g. Grace That Transforms" className="w-full border rounded-lg px-3 py-2 text-sm mt-1" /></div>
        <div><label className="text-xs font-bold uppercase">Minister</label><input value={form.minister} onChange={e=>setForm({...form,minister:e.target.value})} required placeholder="Parish Pastor" className="w-full border rounded-lg px-3 py-2 text-sm mt-1" /></div>
        <div><label className="text-xs font-bold uppercase">Bible Text</label><input value={form.bibleText} onChange={e=>setForm({...form,bibleText:e.target.value})} placeholder="Ephesians 2:8" className="w-full border rounded-lg px-3 py-2 text-sm mt-1" /></div>
        <div><label className="text-xs font-bold uppercase">Service Time</label><input value={form.serviceTime} onChange={e=>setForm({...form,serviceTime:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm mt-1" /></div>
        <div><label className="text-xs font-bold uppercase">Venue</label><input value={form.venue} onChange={e=>setForm({...form,venue:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm mt-1" /></div>
        <div><label className="text-xs font-bold uppercase">YouTube URL</label><input value={form.youtubeUrl} onChange={e=>setForm({...form,youtubeUrl:e.target.value})} placeholder="https://youtube.com/..." className="w-full border rounded-lg px-3 py-2 text-sm mt-1" /></div>
        <div><label className="text-xs font-bold uppercase">Image URL</label><input value={form.imageUrl} onChange={e=>setForm({...form,imageUrl:e.target.value})} placeholder="https://... or upload below" className="w-full border rounded-lg px-3 py-2 text-sm mt-1" />
          <label className="text-xs font-bold text-[#c9a86a] cursor-pointer hover:underline mt-1 inline-block">{uploading ? `Uploading ${uploading}...` : "＋ Upload image from device"}<input type="file" accept="image/*" className="hidden" onChange={e=>handleFile(e.target.files[0], (url)=>setForm({...form,imageUrl:url}))} /></label>
          {form.imageUrl && <img src={form.imageUrl} alt="" className="mt-2 h-20 rounded-lg object-cover" />}</div>
        <div className="md:col-span-2"><label className="text-xs font-bold uppercase">Announcements (one per line)</label><textarea value={form.announcements} onChange={e=>setForm({...form,announcements:e.target.value})} rows={3} placeholder="Workers Meeting Saturday 4PM&#10;Youth Vigil Friday 10PM" className="w-full border rounded-lg px-3 py-2 text-sm mt-1" /></div>
        <div className="md:col-span-2 flex gap-3">
          <button className="bg-[#c9a86a] hover:bg-[#b89755] text-white px-8 py-3 rounded-full font-bold text-sm transition">{editingId ? "Save Changes" : "Publish Weekly Update"}</button>
          {editingId && <button type="button" onClick={resetServiceForm} className="bg-white border px-8 py-3 rounded-full font-bold text-sm">Cancel</button>}
        </div>
      </form>

      <div className="mt-8">
        <h3 className="font-bold text-sm">Existing Weekly Services ({services.length})</h3>
        <div className="mt-3 grid md:grid-cols-2 gap-4">
          {services.map(s => (
            <div key={s.id} className="bg-white border rounded-xl p-4 flex justify-between gap-4">
              <div>
                <p className="text-xs font-bold text-[#c9a86a]">{s.date} • {s.minister}</p>
                <p className="font-bold text-sm mt-1">{s.theme}</p>
                <p className="text-xs text-slate-500">{s.bibleText}</p>
              </div>
              <div className="flex flex-col gap-2">
                <button onClick={()=>startEdit(s)} className="text-xs bg-[#1a3a5f] text-white px-3 py-1 rounded-full h-fit">Edit</button>
                <button onClick={()=>handleDelete(s.id)} className="text-xs bg-red-50 text-red-600 px-3 py-1 rounded-full h-fit border border-red-100">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gallery manager */}
      <h2 className="font-extrabold text-lg mt-12">Gallery Manager</h2>
      <form onSubmit={handleGalleryAdd} className="bg-white border rounded-2xl p-6 mt-4 grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2"><label className="text-xs font-bold uppercase">Photo / Video</label>
          <label className="block border-2 border-dashed border-[#c9a86a]/50 rounded-lg px-3 py-4 text-center text-sm font-bold text-[#1a3a5f] cursor-pointer hover:bg-[#c9a86a]/5 mt-1">{uploading ? `Uploading ${uploading}...` : "＋ Upload image or video from device"}<input type="file" accept="image/*,video/*" className="hidden" onChange={e=>handleGalleryFile(e.target.files[0])} /></label>
          <p className="text-[10px] text-slate-400 mt-1">…or paste a link instead:</p>
          <input value={galleryForm.url} onChange={e=>setGalleryForm({...galleryForm,url:e.target.value})} placeholder="https://..." className="w-full border rounded-lg px-3 py-2 text-sm mt-1" />
          {galleryForm.url && (isVideoUrl(galleryForm.url)
            ? <video src={galleryForm.url} controls className="mt-2 h-20 rounded-lg" />
            : <img src={galleryForm.url} alt="" className="mt-2 h-20 rounded-lg object-cover" />)}</div>
        <div><label className="text-xs font-bold uppercase">Category</label>
          <select value={galleryForm.category} onChange={e=>setGalleryForm({...galleryForm,category:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm mt-1">
            {GALLERY_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="md:col-span-3"><label className="text-xs font-bold uppercase">Caption</label><input value={galleryForm.caption} onChange={e=>setGalleryForm({...galleryForm,caption:e.target.value})} required placeholder="e.g. Sunday Worship - Grace Ville Auditorium" className="w-full border rounded-lg px-3 py-2 text-sm mt-1" /></div>
        <div className="md:col-span-3"><button className="bg-[#1a3a5f] text-white px-8 py-3 rounded-full font-bold text-sm">Add Photo</button></div>
      </form>

      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {galleryItems.map(g => (
          <div key={g.id} className="bg-white border rounded-xl overflow-hidden">
            {isVideoUrl(g.url)
              ? <video src={g.url} controls className="w-full h-40 object-cover bg-black" />
              : <img src={g.url} alt={g.caption} className="w-full h-40 object-cover" />}
            <div className="p-3 flex justify-between items-start gap-2">
              <div>
                <span className="text-[10px] font-bold tracking-widest uppercase text-[#c9a86a]">{g.category}</span>
                <p className="text-xs font-semibold text-slate-900 mt-1">{g.caption}</p>
              </div>
              <button onClick={()=>handleGalleryDelete(g.id)} className="text-xs bg-red-50 text-red-600 px-3 py-1 rounded-full border border-red-100 shrink-0">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* Sermon manager — needs MySQL backend */}
      <h2 className="font-extrabold text-lg mt-12">Sermon Manager</h2>
      <p className="text-xs text-slate-500 mt-1">Publish YouTube links or upload video files (mp4/webm/mov) for viewers to watch on the Sermon Archives page.</p>
      {useLocal ? (
        <p className="text-xs mt-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg px-3 py-2">Start the backend to manage sermons.</p>
      ) : (
      <>
      <form onSubmit={handleSermonSubmit} className="bg-white border rounded-2xl p-6 mt-4 grid md:grid-cols-2 gap-4">
        <div><label className="text-xs font-bold uppercase">Title</label><input value={sermonForm.title} onChange={e=>setSermonForm({...sermonForm,title:e.target.value})} required placeholder="e.g. Grace That Transforms" className="w-full border rounded-lg px-3 py-2 text-sm mt-1" /></div>
        <div><label className="text-xs font-bold uppercase">Minister</label><input value={sermonForm.pastor} onChange={e=>setSermonForm({...sermonForm,pastor:e.target.value})} required placeholder="Parish Pastor" className="w-full border rounded-lg px-3 py-2 text-sm mt-1" /></div>
        <div><label className="text-xs font-bold uppercase">Date</label><input type="date" value={sermonForm.date} onChange={e=>setSermonForm({...sermonForm,date:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm mt-1" /></div>
        <div><label className="text-xs font-bold uppercase">Category</label><input value={sermonForm.category} onChange={e=>setSermonForm({...sermonForm,category:e.target.value})} placeholder="Grace / Favour / Prayer" className="w-full border rounded-lg px-3 py-2 text-sm mt-1" /></div>
        <div className="md:col-span-2"><label className="text-xs font-bold uppercase">Video — YouTube link or upload</label><input value={sermonForm.youtube} onChange={e=>setSermonForm({...sermonForm,youtube:e.target.value})} placeholder="https://youtube.com/... or upload below" className="w-full border rounded-lg px-3 py-2 text-sm mt-1" />
          <label className="text-xs font-bold text-[#c9a86a] cursor-pointer hover:underline mt-1 inline-block">{uploading ? `Uploading ${uploading}...` : "＋ Upload video from device (max 200MB)"}<input type="file" accept="video/*" className="hidden" onChange={e=>handleFile(e.target.files[0], (url)=>setSermonForm(f=>({...f,youtube:url})))} /></label></div>
        <div className="md:col-span-2"><label className="text-xs font-bold uppercase">Description</label><textarea value={sermonForm.desc} onChange={e=>setSermonForm({...sermonForm,desc:e.target.value})} rows={2} className="w-full border rounded-lg px-3 py-2 text-sm mt-1" /></div>
        <div className="md:col-span-2 flex gap-3">
          <button className="bg-[#c9a86a] hover:bg-[#b89755] text-white px-8 py-3 rounded-full font-bold text-sm transition">{editingSermonId ? "Save Changes" : "Publish Sermon"}</button>
          {editingSermonId && <button type="button" onClick={()=>{setEditingSermonId(null); setSermonForm({ title: "", pastor: "", date: new Date().toISOString().slice(0, 10), youtube: "", category: "", desc: "" });}} className="bg-white border px-8 py-3 rounded-full font-bold text-sm">Cancel</button>}
        </div>
      </form>

      <div className="mt-6 space-y-3">
        {sermons.map(s => (
          <div key={s.id} className="bg-white border rounded-xl p-4 flex justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-[#c9a86a]">{s.date} • {s.pastor} • {s.category}</p>
              <p className="font-bold text-sm mt-1">{s.title}</p>
              <p className="text-xs text-slate-500 truncate max-w-md">{s.youtube}</p>
            </div>
            <div className="flex flex-col gap-2 shrink-0">
              <button onClick={()=>startSermonEdit(s)} className="text-xs bg-[#1a3a5f] text-white px-3 py-1 rounded-full">Edit</button>
              <button onClick={()=>handleSermonDelete(s.id)} className="text-xs bg-red-50 text-red-600 px-3 py-1 rounded-full border border-red-100">Delete</button>
            </div>
          </div>
        ))}
      </div>
      </>
      )}

      {/* Inbox — API mode only */}
      {!useLocal && (
        <>
          <h2 className="font-extrabold text-lg mt-12">Messages Inbox ({messages.length})</h2>
          <div className="mt-4 space-y-3">
            {messages.length === 0 && <p className="text-xs text-slate-500 bg-white border rounded-xl p-4">No messages yet.</p>}
            {messages.map(m => (
              <div key={m.id} className="bg-white border rounded-xl p-4 flex justify-between gap-4">
                <div>
                  <p className="text-xs font-bold text-[#1a3a5f]">{m.name} • {m.email}</p>
                  <p className="text-sm text-slate-700 mt-1">{m.message}</p>
                </div>
                <button onClick={()=>handleMessageDelete(m.id)} className="text-xs bg-red-50 text-red-600 px-3 py-1 rounded-full h-fit border border-red-100 shrink-0">Delete</button>
              </div>
            ))}
          </div>

          <h2 className="font-extrabold text-lg mt-12">Newsletter Subscribers ({subscribers.length})</h2>
          <div className="mt-4 bg-white border rounded-xl divide-y">
            {subscribers.length === 0 && <p className="text-xs text-slate-500 p-4">No subscribers yet.</p>}
            {subscribers.map(s => (
              <div key={s.id} className="p-3 flex justify-between items-center gap-2">
                <span className="text-sm">{s.email}</span>
                <button onClick={()=>handleSubscriberDelete(s.id)} className="text-xs bg-red-50 text-red-600 px-3 py-1 rounded-full border border-red-100">Remove</button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
