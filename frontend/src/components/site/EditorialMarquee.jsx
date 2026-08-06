import Marquee from "react-fast-marquee";

const ITEMS = [
  "Meticulous Maintenance",
  "Custom Fabrication",
  "Engine Tuning",
  "Genuine Parts",
  "Premium Detailing",
  "Frame-Off Restoration",
];

export default function EditorialMarquee() {
  return (
    <div className="relative border-y border-white/10 bg-[#050505] py-6" data-testid="editorial-marquee">
      <Marquee speed={38} gradient={false} autoFill>
        {ITEMS.map((item, i) => (
          <span key={i} className="mx-16 inline-flex items-center gap-16">
            <span className="font-display text-lg tracking-[0.18em] text-[#b5955c] uppercase md:text-2xl">
              {item}
            </span>
            <span className="text-[#d4af37]">✦</span>
          </span>
        ))}
      </Marquee>
    </div>
  );
}
