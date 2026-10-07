import { useState } from "react";
import { api } from "../lib/api";
import { toast } from "react-toastify";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.sendMessage(form);
      toast.success("Message sent! RCCG Grace Ville Agbara will respond soon.");
      setForm({ name: "", email: "", message: "" });
    } catch {
      toast.error("Could not send message — please try again or call 08081658009");
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid lg:grid-cols-2 gap-10">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Contact RCCG Grace Ville Agbara</h1>
          <p className="text-sm text-slate-600 mt-2">We'd love to hear from you. Visit us this Sunday or send a message below.</p>

          <div className="mt-8 grid sm:grid-cols-2 gap-4">
            <div className="bg-white border rounded-xl p-4">
              <p className="text-xs font-bold uppercase tracking-widest text-[#c9a86a] flex gap-1 items-center"><MapPin size={12}/> Address</p>
              <p className="text-sm font-semibold mt-1">RCCG Grace Ville Agbara</p>
              <p className="text-xs text-slate-500">Block 3, Former FMW Staff Quarters, Opposite Nestle 2 Gate, Frontline Estate, Agbara - Lagos, Nigeria</p>
            </div>
            <div className="bg-white border rounded-xl p-4">
              <p className="text-xs font-bold uppercase tracking-widest text-[#c9a86a] flex gap-1 items-center"><Clock size={12}/> Service Times</p>
              <p className="text-xs mt-1">Sunday 8AM (Grace's Celebration) • Wed 5PM (Spiritual Diet) • Thu 7:30AM (Break Through Hour)</p>
            </div>
            <div className="bg-white border rounded-xl p-4">
              <p className="text-xs font-bold uppercase tracking-widest text-[#c9a86a] flex gap-1 items-center"><Phone size={12}/> Phone</p>
              <p className="text-sm font-semibold mt-1">08081658009</p>
            </div>
            <div className="bg-white border rounded-xl p-4">
              <p className="text-xs font-bold uppercase tracking-widest text-[#c9a86a] flex gap-1 items-center"><Mail size={12}/> Email</p>
              <p className="text-sm font-semibold mt-1">rccggva@gmail.com</p>
            </div>
          </div>

          <iframe
            title="RCCG Grace Ville Agbara Map"
            src="https://maps.google.com/maps?q=Block+3+Former+FMW+Staff+Quarters+Opposite+Nestle+2+Gate+Frontline+Estate+Agbara+Lagos+Nigeria&t=&z=15&ie=UTF8&iwloc=&output=embed"
            className="w-full h-64 rounded-xl border mt-6"
            loading="lazy"
          />
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-2xl border shadow-sm space-y-4 h-fit">
          <h3 className="font-bold text-slate-900">Send a Message</h3>
          <div>
            <label className="text-xs font-semibold uppercase tracking-widest">Name</label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a5f]/20" placeholder="Your full name" />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-widest">Email</label>
            <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a5f]/20" placeholder="you@example.com" />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-widest">Message</label>
            <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required rows={5} className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a5f]/20" placeholder="How can we help you? Prayer request, testimony, enquiry..." />
          </div>
          <button disabled={loading} className="w-full bg-[#1a3a5f] text-white py-3 rounded-full font-bold text-sm hover:bg-[#0f1e33] disabled:opacity-50 transition">
            {loading ? "Sending..." : "Send Message"}
          </button>
          <p className="text-[10px] text-slate-400 text-center">Messages go straight to the church admin inbox</p>
        </form>
      </div>
    </div>
  );
}
