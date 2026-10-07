import MarqueeImport from "react-fast-marquee";
const Marquee = MarqueeImport?.default ?? MarqueeImport;

export default function MarqueeBar({ text }) {
  return (
    <div className="bg-[#c9a86a] text-white py-2 text-sm font-semibold">
      <Marquee pauseOnHover gradient={false} speed={45}>
        <span className="mx-8">📢 {text}</span>
        <span className="mx-8">🙏 RCCG GRACE VILLE AGBARA — Raising a Generation of Grace • Grace's Celebration Sundays 8AM • Spiritual Diet Wednesdays 5PM • Break Through Hour Thursdays 7:30AM •</span>
        <span className="mx-8">📢 {text}</span>
      </Marquee>
    </div>
  );
}
