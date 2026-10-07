import { Church, Mail, MapPin, Phone, Share2, Play, Camera } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#0f1e33] text-slate-300 pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 font-extrabold text-lg text-white mb-3">
            <img src="/LOGO.jpeg" alt="RCCG" className="w-8 h-8 object-contain rounded-full" />
            <span className="bg-[#c9a86a] p-1.5 rounded-lg"><Church size={18} className="text-white" /></span>
            RCCG<span className="text-[#c9a86a]">GRACE VILLE</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">RCCG Grace Ville Agbara — A Parish of The Redeemed Christian Church of God. Raising a generation of grace, grounded in the Word.</p>
          <div className="flex gap-2 mt-4">
            <a href="https://www.facebook.com/rccggva?mibextid=wwXIfr" target="_blank" rel="noreferrer" className="bg-white/10 p-2 rounded-full hover:bg-[#c9a86a] transition"><Share2 size={14} /></a>
            <a href="https://www.facebook.com/rccggva?mibextid=wwXIfr" target="_blank" rel="noreferrer" className="bg-white/10 p-2 rounded-full hover:bg-[#c9a86a] transition"><Play size={14} /></a>
            <a href="https://www.facebook.com/rccggva?mibextid=wwXIfr" target="_blank" rel="noreferrer" className="bg-white/10 p-2 rounded-full hover:bg-[#c9a86a] transition"><Camera size={14} /></a>
          </div>
        </div>
        <div>
          <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-widest">Explore</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/weekly-updates" className="hover:text-[#c9a86a]">Weekly Updates</Link></li>
            <li><Link to="/sermons" className="hover:text-[#c9a86a]">Sermon Archives</Link></li>
            <li><Link to="/gallery" className="hover:text-[#c9a86a]">Gallery</Link></li>
            <li><Link to="/donate" className="hover:text-[#c9a86a]">Donate / Partnership</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-widest">Service Times</h4>
          <ul className="space-y-1.5 text-xs text-slate-400">
            <li>Sunday — 8:00 AM <span className="text-[#c9a86a]">(Grace's Celebration)</span></li>
            <li>Wednesday — 5:00 PM <span className="text-[#c9a86a]">(Spiritual Diet)</span></li>
            <li>Thursday — 7:30 AM <span className="text-[#c9a86a]">(Break Through Hour)</span></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-widest">Contact</h4>
          <ul className="space-y-2 text-xs">
            <li className="flex gap-2"><MapPin size={14} className="text-[#c9a86a] shrink-0" />Block 3, Former FMW Staff Quarters, Opposite Nestle 2 Gate, Frontline Estate, Agbara - Lagos, Nigeria</li>
            <li className="flex gap-2"><Phone size={14} className="text-[#c9a86a]" />08081658009</li>
            <li className="flex gap-2"><Mail size={14} className="text-[#c9a86a]" />rccggva@gmail.com</li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 mt-8 pt-6 border-t border-white/10 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} RCCG Grace Ville Agbara • A Parish of RCCG
      </div>
    </footer>
  );
}
