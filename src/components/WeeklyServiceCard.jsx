import { Calendar, Clock, BookOpen, MapPin, Video } from "lucide-react";

export default function WeeklyServiceCard({ service, featured = false }) {
  return (
    <div className={`bg-white rounded-2xl border overflow-hidden hover:shadow-lg transition ${featured ? "ring-2 ring-[#c9a86a] ring-offset-2" : ""}`}>
      {service.imageUrl && <img src={service.imageUrl} alt={service.theme} className="w-full h-56 object-cover" />}
      <div className="p-6">
        {featured && <span className="inline-block bg-[#c9a86a] text-white text-xs font-bold px-3 py-1 rounded-full mb-3">THIS SUNDAY • {service.date}</span>}
        {!featured && <p className="text-xs text-[#c9a86a] font-bold tracking-widest uppercase flex gap-2 items-center"><Calendar size={12} />{service.date}</p>}
        <h3 className="font-extrabold text-xl text-slate-900 mt-1 leading-tight">{service.theme}</h3>
        <p className="text-sm text-slate-600 mt-2 flex gap-2"><BookOpen size={14} className="text-[#1a3a5f] mt-0.5 shrink-0" />{service.bibleText}</p>
        <p className="text-sm text-slate-600 flex gap-2 mt-1"><span className="font-semibold text-[#1a3a5f]">Minister:</span> {service.minister}</p>
        <div className="flex flex-wrap gap-3 mt-3 text-xs text-slate-500">
          <span className="flex gap-1 items-center bg-slate-50 px-2 py-1 rounded-full"><Clock size={12} />{service.serviceTime}</span>
          <span className="flex gap-1 items-center bg-slate-50 px-2 py-1 rounded-full"><MapPin size={12} />{service.venue}</span>
        </div>
        {service.announcements?.length > 0 && (
          <div className="mt-4 bg-amber-50 border border-amber-100 rounded-xl p-3">
            <p className="text-xs font-bold text-amber-900 uppercase">Announcements</p>
            <ul className="text-xs text-amber-800 mt-1 list-disc list-inside space-y-1">
              {service.announcements.map((a, i) => <li key={i}>{a}</li>)}
            </ul>
          </div>
        )}
        {service.youtubeUrl && (
          <a href={service.youtubeUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 mt-4 bg-[#1a3a5f] text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-[#0f1e33] transition">
            <Video size={14} /> Watch Live / Replay
          </a>
        )}
      </div>
    </div>
  );
}
