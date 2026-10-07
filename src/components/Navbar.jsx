import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, Church } from "lucide-react";
import { getToken } from "../lib/api";

const links = [
  { to: "/", label: "Home" },
  { to: "/weekly-updates", label: "Weekly Updates" },
  { to: "/about", label: "About Us" },
  { to: "/gallery", label: "Gallery" },
  { to: "/sermons", label: "Sermon Archives" },
  { to: "/donate", label: "Donate" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  // Show Admin link if a backend token or local admin session exists
  let user = null;
  try { user = getToken() || sessionStorage.getItem("gv_admin") ? true : null; } catch { user = null; }

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur shadow-sm border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 font-extrabold text-lg tracking-tight">
          <img src="/LOGO.jpeg" alt="RCCG" className="w-9 h-9 object-contain rounded-full border" />
          <img src="/RGVA.jpeg" alt="RCCG Grace Ville" className="w-9 h-9 object-contain rounded-lg bg-white p-1 border" />
          <span className="text-[#1a3a5f]">RCCG</span><span className="text-[#c9a86a]">GRACE VILLE</span><span className="text-xs font-semibold text-slate-500 ml-1 hidden sm:inline">Agbara</span>
        </Link>

        <div className="hidden lg:flex items-center gap-6">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `text-[13px] font-semibold tracking-wide uppercase transition ${isActive ? "text-[#1a3a5f] border-b-2 border-[#c9a86a] pb-1" : "text-slate-600 hover:text-[#1a3a5f]"}`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <Link to="/donate" className="bg-[#c9a86a] hover:bg-[#b89755] text-white px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition">Give Online</Link>
          {user && <Link to="/admin" className="text-xs bg-slate-900 text-white px-3 py-1.5 rounded-full">Admin</Link>}
        </div>

        <button className="lg:hidden p-2" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
      </div>

      {open && (
        <div className="lg:hidden bg-white border-t px-4 py-4 space-y-3">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} onClick={() => setOpen(false)} className="block py-2 text-slate-700 font-medium text-sm">{l.label}</NavLink>
          ))}
          {user && <Link to="/admin" onClick={()=>setOpen(false)} className="block py-2 text-[#1a3a5f] font-bold text-sm">Admin Panel</Link>}
        </div>
      )}
    </nav>
  );
}
