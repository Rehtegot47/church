import { Heart, CreditCard, Building2, Copy } from "lucide-react";
import { toast } from "react-toastify";

export default function Donate() {
  const copy = (num) => {
    navigator.clipboard.writeText(num);
    toast.success(`Copied ${num}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="relative bg-gradient-to-br from-[#1a3a5f] to-[#0f1e33] text-white rounded-2xl p-8 md:p-12 overflow-hidden">
        <img src="/DONATION2.jpeg" alt="RCCG Grace Ville Agbara" className="absolute inset-0 w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a3a5f]/90 to-[#0f1e33]/70" />
        <div className="relative">
          <p className="text-[#c9a86a] text-xs font-bold tracking-widest uppercase">Partnership & Giving</p>
          <h1 className="text-3xl md:text-4xl font-extrabold mt-2">Support the Work at RCCG Grace Ville Agbara</h1>
          <p className="text-slate-300 mt-3 max-w-2xl text-sm">"Give, and it shall be given unto you; good measure..." — Luke 6:38. Your giving advances the Gospel, welfare and building project.</p>
          <a href="#accounts" className="inline-block mt-6 bg-[#c9a86a] hover:bg-[#b89755] text-white px-8 py-3 rounded-full font-bold text-sm transition">Give Now</a>
        </div>
      </div>

      <div id="accounts" className="grid md:grid-cols-2 gap-6 mt-8">
        {/* Tithes & Offering */}
        <div className="bg-white rounded-2xl border overflow-hidden hover:shadow-md transition">
          <img src="/DONATION1.jpeg" alt="RCCG Grace Ville Agbara" className="w-full h-48 object-cover" />
          <div className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-[#1a3a5f]/10 w-10 h-10 rounded-xl flex items-center justify-center text-[#1a3a5f]"><Heart size={18} /></div>
              <div>
                <h3 className="font-bold text-slate-900">Tithes & Offering</h3>
                <p className="text-xs text-slate-500">FCMB</p>
              </div>
            </div>
            <p className="text-lg font-mono font-bold tracking-widest text-slate-900">7450767010</p>
            <p className="text-xs text-slate-500 mt-1">RCCG Grace Ville Agbara</p>
            <button onClick={()=>copy("7450767010")} className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-[#c9a86a] hover:text-[#1a3a5f]"><Copy size={12}/> Copy Account Number</button>
          </div>
        </div>

        {/* Building Project */}
        <div className="bg-white rounded-2xl border overflow-hidden hover:shadow-md transition">
          <img src="/DONATION2.jpeg" alt="RCCG Grace Ville Agbara Building Project" className="w-full h-48 object-cover" />
          <div className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-[#c9a86a]/10 w-10 h-10 rounded-xl flex items-center justify-center text-[#c9a86a]"><Building2 size={18} /></div>
              <div>
                <h3 className="font-bold text-slate-900">Building Project</h3>
                <p className="text-xs text-slate-500">FCMB</p>
              </div>
            </div>
            <p className="text-lg font-mono font-bold tracking-widest text-slate-900">9017147011</p>
            <p className="text-xs text-slate-500 mt-1">RCCG Grace Ville Agbara</p>
            <button onClick={()=>copy("9017147011")} className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-[#c9a86a] hover:text-[#1a3a5f]"><Copy size={12}/> Copy Account Number</button>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <div className="bg-white rounded-2xl border p-6">
          <h3 className="font-bold flex gap-2 items-center"><CreditCard size={16} className="text-[#c9a86a]" /> Online Payment Links</h3>
          <p className="text-sm text-slate-600 mt-2">Pay securely with Paystack / Flutterwave (replace links with your church's payment URLs).</p>
          <div className="flex flex-wrap gap-3 mt-4">
            <a href="https://paystack.com/pay/rccg-graceville-agbara" target="_blank" rel="noreferrer" className="bg-[#1a3a5f] text-white px-5 py-2 rounded-full text-xs font-bold">Pay with Paystack</a>
            <a href="https://flutterwave.com/pay/rccg-graceville-agbara" target="_blank" rel="noreferrer" className="bg-white border border-slate-200 px-5 py-2 rounded-full text-xs font-bold">Pay with Flutterwave</a>
          </div>
        </div>
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6">
          <h3 className="font-bold flex gap-2 items-center text-amber-900"><Heart size={16} /> God Loves a Cheerful Giver</h3>
          <p className="text-sm text-amber-800 mt-2">For questions on giving, contact the church office: <b>08081658009</b> or email <b>rccggva@gmail.com</b></p>
          <p className="text-xs text-amber-700 mt-3">Please include your name and purpose (Tithe/Thanksgiving/Building) in the transfer narration.</p>
        </div>
      </div>
    </div>
  );
}
