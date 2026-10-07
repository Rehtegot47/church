import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { localStore } from "../lib/store";

export default function Gallery() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    async function load() {
      // MySQL API first, then local store (church photos)
      try {
        const rows = await api.galleryList();
        if (rows.length) { setItems(rows); return; }
      } catch { /* API down — use local */ }
      setItems(localStore.loadGallery());
    }
    load();
  }, []);

  const categories = ["All", "Service", "Choir", "Youth", "Outreach", "Workers"];
  const filtered = filter === "All" ? items : items.filter(i => i.category === filter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-[#1a3a5f] rounded-2xl p-6 text-white flex flex-col md:flex-row items-center justify-between gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-extrabold">Gallery</h1>
          <p className="text-sm text-slate-300 mt-1">Moments from RCCG Grace Ville — worship, fellowship and outreach.</p>
        </div>
        <a href="https://www.facebook.com/rccggva?mibextid=wwXIfr" target="_blank" rel="noreferrer" className="bg-[#c9a86a] hover:bg-[#b89755] text-white px-6 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition">View on Facebook →</a>
      </div>
      <p className="text-xs text-slate-500 mt-3">📸 More photos on <a href="https://www.facebook.com/rccggva?mibextid=wwXIfr" target="_blank" rel="noreferrer" className="underline text-[#1a3a5f]">facebook.com/rccggva</a>.</p>

      <div className="flex flex-wrap gap-2 mt-6">
        {categories.map(c => (
          <button key={c} onClick={() => setFilter(c)} className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border transition ${filter===c ? "bg-[#1a3a5f] text-white border-[#1a3a5f]" : "bg-white text-slate-600 hover:border-[#c9a86a]"}`}>{c}</button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        {filtered.map(i => (
          <div key={i.id} className="group bg-white rounded-2xl overflow-hidden border hover:shadow-lg transition">
            <div className="overflow-hidden">
              {/\.(mp4|webm|mov)(\?|#|$)/i.test(i.url || "") || (i.url || "").startsWith("data:video")
                ? <video src={i.url} controls className="w-full h-56 object-cover bg-black" />
                : <img src={i.url} alt={i.caption} className="w-full h-56 object-cover group-hover:scale-105 transition duration-300" />}
            </div>
            <div className="p-4">
              <span className="text-[10px] font-bold tracking-widest uppercase text-[#c9a86a] bg-[#c9a86a]/10 px-2 py-1 rounded-full">{i.category}</span>
              <p className="text-sm font-semibold text-slate-900 mt-2">{i.caption}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
