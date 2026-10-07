import { Eye, Target, Users, Focus, Heart, Handshake, TrendingUp, UserPlus } from "lucide-react";

export default function About() {
  return (
    <div>
      <div className="bg-[#1a3a5f] text-white py-14 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <img src="/LOGO.jpeg" alt="RCCG Logo" className="w-20 h-20 mx-auto rounded-full border-2 border-white/20 mb-4" />
          <p className="text-[#c9a86a] text-xs font-bold tracking-widest uppercase">About Us</p>
          <h1 className="text-4xl font-extrabold mt-2">RCCG GRACE VILLE <span className="text-[#c9a86a]">AGBARA</span></h1>
          <p className="text-slate-300 mt-3 text-sm max-w-2xl mx-auto">A parish of The Redeemed Christian Church of God — Mandated to raise a generation that walks in grace, truth and power. Under the leadership of the General Overseer, Pastor E. A. Adeboye.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Vision */}
        <div className="bg-gradient-to-r from-[#1a3a5f] to-[#0f1e33] rounded-2xl p-8 text-white mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="bg-[#c9a86a] text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Vision</span>
          </div>
          <p className="text-2xl md:text-3xl font-extrabold leading-tight">Redefining and Leading the Future</p>
        </div>

        {/* Mission */}
        <div className="bg-gradient-to-r from-[#c9a86a] to-[#b89755] rounded-2xl p-8 text-white mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="bg-white text-[#1a3a5f] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Mission</span>
          </div>
          <p className="text-2xl md:text-3xl font-extrabold leading-tight">Full Expression, Total Transformation</p>
          <p className="text-sm mt-2 opacity-90">(F.E.T.T)</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Mandate */}
          <div className="bg-white border-2 border-[#1a3a5f] rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <span className="bg-[#1a3a5f] text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Our Mandate</span>
            </div>
            <p className="text-xl font-extrabold text-slate-900">...Leading the Future</p>
            <p className="text-xs text-slate-600 mt-2">RCCG Grace Ville Agbara exists to bring people to the knowledge of Christ, nurture them with the Word and release them to fulfil destiny.</p>
          </div>

          {/* Target Audience */}
          <div className="bg-white border-2 border-[#c9a86a] rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <span className="bg-[#c9a86a] text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Target Audience</span>
            </div>
            <p className="text-xl font-extrabold text-slate-900">Raising Young Professionals</p>
            <p className="text-xs text-slate-600 mt-2">Equipping the next generation with grace, excellence and the Word to excel in every sphere of life.</p>
          </div>
        </div>

        {/* Our Focus — 4 W's */}
        <div className="bg-[#0f1e33] rounded-2xl p-8 text-white mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-[#c9a86a] text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Our Focus</span>
          </div>
          <p className="text-sm text-slate-300 mb-6">Our Area of INTEREST are <span className="text-[#c9a86a] font-bold">4 W's</span></p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur rounded-xl p-5 text-center border border-white/10 hover:border-[#c9a86a] transition">
              <div className="bg-[#c9a86a] w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"><UserPlus size={20} className="text-white" /></div>
              <h3 className="font-bold text-[#c9a86a]">We Get</h3>
              <p className="text-xs text-slate-300 mt-1">the People</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-5 text-center border border-white/10 hover:border-[#c9a86a] transition">
              <div className="bg-[#c9a86a] w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"><Heart size={20} className="text-white" /></div>
              <h3 className="font-bold text-[#c9a86a]">We Keep</h3>
              <p className="text-xs text-slate-300 mt-1">the People</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-5 text-center border border-white/10 hover:border-[#c9a86a] transition">
              <div className="bg-[#c9a86a] w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"><Handshake size={20} className="text-white" /></div>
              <h3 className="font-bold text-[#c9a86a]">We Connect</h3>
              <p className="text-xs text-slate-300 mt-1">the People</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-5 text-center border border-white/10 hover:border-[#c9a86a] transition">
              <div className="bg-[#c9a86a] w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"><TrendingUp size={20} className="text-white" /></div>
              <h3 className="font-bold text-[#c9a86a]">We Grow</h3>
              <p className="text-xs text-slate-300 mt-1">the People</p>
            </div>
          </div>
        </div>

        {/* Service Times */}
        <div className="mt-8">
          <h3 className="font-bold text-slate-900 text-lg mb-4">Service Times</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="bg-white border rounded-xl p-5 text-center">
              <p className="font-bold text-sm text-[#1a3a5f]">Grace's Celebration</p>
              <p className="text-xs text-slate-500 mt-1">Sunday Worship</p>
              <p className="text-lg font-extrabold text-[#c9a86a] mt-2">8:00 AM</p>
            </div>
            <div className="bg-white border rounded-xl p-5 text-center">
              <p className="font-bold text-sm text-[#1a3a5f]">Spiritual Diet</p>
              <p className="text-xs text-slate-500 mt-1">Bible Study & Prayer</p>
              <p className="text-lg font-extrabold text-[#c9a86a] mt-2">5:00 PM</p>
            </div>
            <div className="bg-white border rounded-xl p-5 text-center">
              <p className="font-bold text-sm text-[#1a3a5f]">Break Through Hour</p>
              <p className="text-xs text-slate-500 mt-1">Prayer & Deliverance</p>
              <p className="text-lg font-extrabold text-[#c9a86a] mt-2">7:30 AM</p>
            </div>
          </div>
        </div>

        {/* Location & Contact */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <div className="bg-white border rounded-xl p-6">
            <h3 className="font-bold text-sm mb-2">Location</h3>
            <p className="text-xs text-slate-600">Block 3, Former FMW Staff Quarters, Opposite Nestle 2 Gate, Frontline Estate, Agbara - Lagos, Nigeria</p>
            <p className="text-xs text-slate-600 mt-2">📞 08081658009 • ✉️ rccggva@gmail.com</p>
          </div>
          <div className="bg-[#c9a86a]/10 border border-[#c9a86a]/20 rounded-xl p-6">
            <h3 className="font-bold text-sm text-[#1a3a5f] mb-2">Join a Department</h3>
            <p className="text-xs text-slate-700">Choir • Ushery • Prayer Band • Evangelism • Media • Sanctuary Keepers • Children & Teens</p>
          </div>
        </div>
      </div>
    </div>
  );
}
