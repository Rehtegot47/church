import { useWeeklyServices } from "../hooks/useWeeklyServices";
import WeeklyServiceCard from "../components/WeeklyServiceCard";

export default function WeeklyUpdates() {
  const { services, loading } = useWeeklyServices();

  if (loading) return <div className="p-16 text-center text-slate-500">Loading weekly updates...</div>;

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="bg-[#1a3a5f] text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-[#c9a86a] text-xs font-bold tracking-widest uppercase">RCCG Grace Ville Agbara</p>
          <h1 className="text-3xl md:text-4xl font-extrabold mt-2">Weekly Sunday Service Updates</h1>
          <p className="text-slate-300 mt-3 max-w-2xl text-sm">Updated every week by the admin. Find this Sunday's theme, minister, Bible text, venue and announcements.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {services.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border text-center text-slate-500">No updates yet. Admin will publish the next Sunday service soon.</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, idx) => (
              <WeeklyServiceCard key={s.id} service={s} featured={idx === 0} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
