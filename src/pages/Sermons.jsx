import { useEffect, useState } from "react";
import { api } from "../lib/api";
import ReactPlayer from "react-player";
import { Search, Video, Music } from "lucide-react";

export default function Sermons() {
  const [sermons, setSermons] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(null);

  useEffect(() => {
    async function fetchSermons() {
      try {
        const rows = await api.sermonsList();
        if (rows.length) { setSermons(rows); return; }
        throw new Error("empty");
      } catch {
        setSermons([
          { id: "1", title: "Grace That Transforms", pastor: "Parish Pastor", date: "2026-09-07", youtube: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", category: "Grace", desc: "Understanding the transforming power of God's grace." },
          { id: "2", title: "Walking in Divine Favour", pastor: "Pastor Mrs. Adeboye", date: "2026-08-31", youtube: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", category: "Favour", desc: "How to live daily in the favour of God." },
          { id: "3", title: "The Power of Prayer", pastor: "Guest Minister", date: "2026-08-24", youtube: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", category: "Prayer", desc: "Prayer that moves mountains." },
        ]);
      } finally { setLoading(false); }
    }
    fetchSermons();
  }, []);

  const filtered = sermons.filter(s => s.title.toLowerCase().includes(filter.toLowerCase()) || s.pastor.toLowerCase().includes(filter.toLowerCase()));

  if (loading) return <div className="p-16 text-center">Loading sermon archives...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Sermon Archives</h1>
          <p className="text-sm text-slate-600 mt-2">RCCG Grace Ville — Catch up on weekly messages, published by the media team.</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search size={14} className="absolute left-3 top-3 text-slate-400" />
          <input value={filter} onChange={e=>setFilter(e.target.value)} placeholder="Search sermons or ministers" className="w-full pl-9 pr-4 py-2 rounded-full border text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a5f]/20" />
        </div>
      </div>

      {active && (
        <div className="mt-8 bg-black rounded-2xl overflow-hidden border">
          <div className="aspect-video">
            <ReactPlayer src={active.youtube} width="100%" height="100%" controls />
          </div>
          <div className="p-4 bg-white border-t">
            <h3 className="font-bold">{active.title} — {active.pastor}</h3>
            <p className="text-xs text-slate-500">{active.date} • {active.category}</p>
            <button onClick={()=>setActive(null)} className="mt-3 text-xs bg-slate-900 text-white px-4 py-1.5 rounded-full">Close Player</button>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {filtered.map(s => (
          <div key={s.id} className="bg-white rounded-2xl border overflow-hidden hover:shadow-md transition flex flex-col">
            <div className="h-36 bg-[#1a3a5f] flex items-center justify-center text-white relative">
              <span className="text-5xl opacity-20">✦</span>
              <span className="absolute bottom-3 left-3 bg-[#c9a86a] text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase">{s.category}</span>
            </div>
            <div className="p-5 flex flex-col flex-1">
              <p className="text-xs text-[#c9a86a] font-bold uppercase">{s.date} • {s.pastor}</p>
              <h3 className="font-bold mt-1 text-slate-900 leading-tight">{s.title}</h3>
              <p className="text-xs text-slate-500 mt-2 flex-1">{s.desc}</p>
              <div className="flex gap-2 mt-4">
                <button onClick={()=>setActive(s)} className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[#1a3a5f] text-white px-4 py-2 rounded-full text-xs font-bold hover:bg-[#0f1e33] transition"><Video size={12}/> Watch</button>
                <a href={s.youtube} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 border px-4 py-2 rounded-full text-xs font-bold hover:bg-slate-50"><Music size={12}/> Audio</a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
