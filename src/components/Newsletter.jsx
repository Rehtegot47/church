import { useState } from "react";
import { api } from "../lib/api";
import { toast } from "react-toastify";
import { Mail } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const r = await api.subscribe(email);
      toast[r.already ? "info" : "success"](r.already ? "You are already subscribed!" : "Subscribed! Check your email for weekly updates.");
      setEmail("");
    } catch {
      toast.error("Subscription failed — please try again later");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-[#0f1e33] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="flex gap-4 items-center">
          <div className="bg-[#c9a86a] p-3 rounded-xl"><Mail className="text-white" /></div>
          <div>
            <h3 className="text-white font-bold text-lg">Stay Connected</h3>
            <p className="text-slate-400 text-sm">Get weekly service updates, sermon notes & events directly in your inbox.</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="flex w-full lg:w-auto gap-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="flex-1 lg:w-80 px-4 py-3 rounded-full bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#c9a86a]"
          />
          <button disabled={loading} className="bg-[#c9a86a] hover:bg-[#b89755] text-white px-8 py-3 rounded-full font-semibold whitespace-nowrap disabled:opacity-50 transition">
            {loading ? "..." : "Subscribe"}
          </button>
        </form>
      </div>
    </section>
  );
}
