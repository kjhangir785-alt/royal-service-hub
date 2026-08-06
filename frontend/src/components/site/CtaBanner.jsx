import { Link } from "react-router-dom";
import { Phone, MessageCircle } from "lucide-react";
import { Reveal } from "./Motion";
import { useContent } from "../../context/ContentContext";
import { resolveImg } from "../../lib/api";

export default function CtaBanner() {
  const { business, ctaImageUrl } = useContent();
  const waMsg = encodeURIComponent(
    "Hi The Bullet Zone, I'd like to book a service for my Royal Enfield."
  );
  return (
    <section className="relative overflow-hidden border-t border-white/10" data-testid="cta-banner">
      <img src={resolveImg(ctaImageUrl)} alt="" className="absolute inset-0 h-full w-full object-cover opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/85 to-[#050505]/40" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-32">
        <Reveal>
          <span className="font-body text-xs uppercase tracking-[0.25em] text-[#d4af37]">Ready when you are</span>
          <h2 className="mt-4 max-w-3xl font-display text-3xl font-semibold leading-[1.05] tracking-tighter text-white md:text-6xl">
            Give your Royal Enfield the care it deserves.
          </h2>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link to="/book" data-testid="cta-book-btn" className="flex items-center border border-[#d4af37] bg-[#d4af37] px-8 py-4 font-body text-sm uppercase tracking-widest text-black transition-colors duration-300 hover:bg-transparent hover:text-[#d4af37]">
              Book Service
            </Link>
            <a href={`tel:${business.phoneRaw}`} data-testid="cta-call-btn" className="flex items-center gap-2 border border-white/20 px-8 py-4 font-body text-sm uppercase tracking-widest text-white transition-colors duration-300 hover:border-[#d4af37] hover:text-[#d4af37]">
              <Phone className="h-4 w-4" /> Call Now
            </a>
            <a href={`https://wa.me/${business.whatsapp || business.phoneRaw}?text=${waMsg}`} target="_blank" rel="noopener noreferrer" data-testid="cta-whatsapp-btn" className="flex items-center gap-2 border border-white/20 px-8 py-4 font-body text-sm uppercase tracking-widest text-white transition-colors duration-300 hover:border-[#25D366] hover:text-[#25D366]">
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
