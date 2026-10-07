import { Link } from "react-router-dom";
import { BookOpen, Calendar, Users, Heart, ArrowRight } from "lucide-react";
import MarqueeBar from "../components/MarqueeBar";
import Newsletter from "../components/Newsletter";
import WeeklyServiceCard from "../components/WeeklyServiceCard";
import { useWeeklyServices } from "../hooks/useWeeklyServices";

export default function Home() {
  const { services } = useWeeklyServices();
  const latest = services[0];

  return (
    <div>
      {/* Hero - Church building background + Grace Ville logo + blue overlay */}
      <section className="relative bg-[#0f1e33] text-white overflow-hidden">
        <img src="/DONATION1.jpeg" alt="RCCG Grace Ville Agbara building" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[#1a3a5f]/80" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a3a5f]/50 to-[#0f1e33]/60" />
        <div className="absolute inset-0 flex items-center justify-center opacity-15 pointer-events-none">
          <img src="/RGVA.jpeg" alt="" className="w-[400px] h-[400px] object-contain" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 text-center">
          <p className="text-[#c9a86a] font-bold tracking-[0.2em] text-xs uppercase mb-4">RCCG • The Redeemed Christian Church of God</p>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
            RCCG <span className="text-[#c9a86a]">GRACE VILLE</span>
            <br /><span className="text-2xl md:text-3xl font-semibold text-slate-200">Agbara</span>
          </h1>
          <p className="text-[#c9a86a] font-bold text-lg md:text-xl mt-4 italic">Grace speaks for us in all dimension</p>
          <p className="text-slate-200 max-w-2xl mx-auto text-sm md:text-base mt-4 leading-relaxed">
            Welcome home. Experience transforming worship, the undiluted Word, and a family where your faith comes alive. Sunday Service 8AM — Jesus awaits you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link to="/weekly-updates" className="bg-[#c9a86a] hover:bg-[#b89755] text-white px-8 py-3 rounded-full font-bold text-sm transition">This Sunday's Service</Link>
            <Link to="/sermons" className="bg-white/10 backdrop-blur hover:bg-white/20 border border-white/20 px-8 py-3 rounded-full font-bold text-sm transition">Watch Sermons</Link>
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-4 text-xs">
            <div className="bg-white/10 backdrop-blur px-4 py-3 rounded-xl"><p className="font-bold text-white">Grace's Celebration</p><p className="text-slate-300">Sunday 8:00 AM</p></div>
            <div className="bg-white/10 backdrop-blur px-4 py-3 rounded-xl"><p className="font-bold text-white">Spiritual Diet</p><p className="text-slate-300">Wednesday 5:00 PM</p></div>
            <div className="bg-white/10 backdrop-blur px-4 py-3 rounded-xl"><p className="font-bold text-white">Break Through Hour</p><p className="text-slate-300">Thursday 7:30 AM</p></div>
          </div>
        </div>
      </section>

      <MarqueeBar text="Grace's Celebration — Sundays 8AM • Spiritual Diet — Wednesdays 5PM • Break Through Hour — Thursdays 7:30AM • RCCG Grace Ville Agbara" />

      {/* Latest Weekly Service Preview */}
      {latest && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-extrabold text-slate-900">This Sunday at Grace Ville</h2>
            <Link to="/weekly-updates" className="text-sm font-bold text-[#c9a86a] hover:text-[#1a3a5f] flex gap-1 items-center">View All Weekly Updates <ArrowRight size={14}/></Link>
          </div>
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <WeeklyServiceCard service={latest} featured />
            </div>
            <div className="bg-[#1a3a5f] text-white rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-lg">Plan Your Visit</h3>
                <p className="text-sm text-slate-300 mt-2">First time at RCCG Grace Ville Agbara? We'd love to welcome you. Free welcome package for first-timers.</p>
                <ul className="text-xs text-slate-300 mt-4 space-y-2 list-disc list-inside">
                  <li>Free parking & ushers to guide you</li>
                  <li>Vibrant Children & Teens Church</li>
                  <li>Welfare & counselling available</li>
                </ul>
              </div>
              <Link to="/contact" className="mt-6 bg-[#c9a86a] text-white text-center py-3 rounded-full font-bold text-sm hover:bg-[#b89755] transition">I'm New — Get Directions</Link>
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid md:grid-cols-3 gap-6">
        {[
          { icon: BookOpen, title: "Sermon Archives", desc: "Watch past sermons with React Player — dynamically from Firestore.", link: "/sermons" },
          { icon: Calendar, title: "Gallery & Events", desc: "See what God is doing in pictures — filterable gallery from Firestore.", link: "/gallery" },
          { icon: Users, title: "Join Us & Give", desc: "Partner with Grace Ville — secure donation links & newsletter.", link: "/donate" },
        ].map((f) => (
          <div key={f.title} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition">
            <div className="bg-[#1a3a5f]/10 w-10 h-10 rounded-xl flex items-center justify-center mb-3 text-[#1a3a5f]"><f.icon size={18} /></div>
            <h3 className="font-bold text-slate-900">{f.title}</h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">{f.desc}</p>
            <Link to={f.link} className="text-xs font-bold text-[#c9a86a] hover:text-[#1a3a5f] mt-3 inline-block">Learn more →</Link>
          </div>
        ))}
      </section>

      {/* Welcome */}
      <section className="bg-white border-y py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-10 items-center">
          <img src="/DONATION2.jpeg" alt="RCCG Grace Ville Agbara" className="rounded-2xl shadow-lg w-full object-cover h-[360px]" />
          <div>
            <p className="text-[#c9a86a] font-bold text-xs tracking-widest uppercase">Why RCCG Grace Ville?</p>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-2">A Family of Grace and Truth</h2>
            <p className="text-sm text-slate-600 mt-4 leading-relaxed">Whether you're new to faith or a worker in the vineyard, you belong here. We are Word, worship and prayer driven — raising disciples who manifest God's glory everywhere.</p>
            <ul className="space-y-3 mt-6">
              <li className="flex gap-3 text-xs"><Heart size={16} className="text-[#c9a86a] mt-0.5 shrink-0" /> <span><b>Undiluted Word</b> — Sound doctrine from the RCCG tradition</span></li>
              <li className="flex gap-3 text-xs"><Heart size={16} className="text-[#c9a86a] mt-0.5 shrink-0" /> <span><b>Passionate Worship</b> — Choir and Spirit-led praise</span></li>
              <li className="flex gap-3 text-xs"><Heart size={16} className="text-[#c9a86a] mt-0.5 shrink-0" /> <span><b>Next Generation</b> — Children, Teens & Youth ignited for God</span></li>
            </ul>
            <Link to="/about" className="inline-block mt-6 bg-[#1a3a5f] text-white px-6 py-3 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-[#0f1e33] transition">Discover Our Story</Link>
          </div>
        </div>
      </section>

      <Newsletter />
    </div>
  );
}
