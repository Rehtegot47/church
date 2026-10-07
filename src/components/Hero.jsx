import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="relative bg-[#0f1e33] text-white overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a3a5f]/90 to-[#0f1e33]/90" />
      <img
        src="https://images.unsplash.com/photo-1436397543931-01c1a9625182?w=1920&h=1080&fit=crop"
        alt="Church interior"
        className="absolute inset-0 w-full h-full object-cover -z-10"
      />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-36 text-center">
        <p className="text-[#c9a86a] font-semibold tracking-widest text-sm uppercase mb-4">
          Welcome to Grace Church
        </p>
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
          Faith, Hope & Love <br />
          <span className="text-[#c9a86a]">Live Here</span>
        </h1>
        <p className="text-slate-200 max-w-2xl mx-auto text-lg mb-8">
          Join a community where everyone is welcome. Experience inspiring worship, meaningful fellowship, and a place to grow in faith.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/contact" className="bg-[#c9a86a] hover:bg-[#b89755] text-white px-8 py-3 rounded-full font-semibold transition">
            Plan Your Visit
          </Link>
          <Link to="/sermons" className="bg-white/10 backdrop-blur hover:bg-white/20 border border-white/20 px-8 py-3 rounded-full font-semibold transition">
            Watch Live
          </Link>
        </div>
        <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm">
          <div><p className="font-bold text-white">Sunday Service</p><p className="text-slate-300">9:00 AM & 11:00 AM</p></div>
          <div className="w-px bg-white/20 hidden sm:block" />
          <div><p className="font-bold text-white">Wednesday Bible Study</p><p className="text-slate-300">7:00 PM</p></div>
          <div className="w-px bg-white/20 hidden sm:block" />
          <div><p className="font-bold text-white">Location</p><p className="text-slate-300">123 Faith Avenue, City</p></div>
        </div>
      </div>
    </section>
  );
}
