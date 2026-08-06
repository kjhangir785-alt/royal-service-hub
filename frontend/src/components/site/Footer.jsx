import { Link } from "react-router-dom";
import { Phone, MessageCircle, MapPin, Clock } from "lucide-react";
import { BUSINESS } from "../../lib/data";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative z-10 border-t border-white/10 bg-[#050505]" data-testid="site-footer">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 md:grid-cols-2 md:px-8 lg:grid-cols-4 lg:py-24">
        <div className="lg:col-span-1">
          <Link to="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center border border-[#d4af37]/50 font-display text-xl text-[#d4af37]">B</span>
            <span className="font-display text-lg tracking-tight text-white">
              THE BULLET <span className="gold-text">ZONE</span>
            </span>
          </Link>
          <p className="mt-5 max-w-xs font-body text-sm leading-relaxed text-white/50">
            {BUSINESS.tagline}. Hyderabad's trusted Royal Enfield specialist workshop in Gachibowli.
          </p>
        </div>

        <div>
          <h4 className="font-body text-xs uppercase tracking-[0.2em] text-[#d4af37]">Explore</h4>
          <ul className="mt-5 space-y-3 font-body text-sm text-white/60">
            {[
              ["Services", "/services"],
              ["Royal Enfield Models", "/models"],
              ["Modifications", "/modifications"],
              ["Accessories", "/accessories"],
              ["Gallery", "/gallery"],
              ["Book Service", "/book"],
            ].map(([label, to]) => (
              <li key={to}>
                <Link to={to} className="transition-colors hover:text-[#d4af37]" data-testid={`footer-link-${label.toLowerCase().replace(/\s+/g, "-")}`}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-body text-xs uppercase tracking-[0.2em] text-[#d4af37]">Visit Us</h4>
          <p className="mt-5 flex gap-3 font-body text-sm leading-relaxed text-white/60">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#d4af37]" />
            <span>{BUSINESS.addressLines.join(" ")}</span>
          </p>
          <p className="mt-4 flex gap-3 font-body text-sm text-white/60">
            <Clock className="mt-0.5 h-4 w-4 shrink-0 text-[#d4af37]" />
            <span>Mon–Sat: 9 AM – 11 PM<br />Sunday: Closed</span>
          </p>
        </div>

        <div>
          <h4 className="font-body text-xs uppercase tracking-[0.2em] text-[#d4af37]">Contact</h4>
          <p className="mt-5 font-body text-sm text-white/60">Owner: {BUSINESS.owner}</p>
          <div className="mt-4 flex flex-col gap-3">
            <a href={`tel:${BUSINESS.phoneRaw}`} data-testid="footer-call" className="flex items-center gap-3 font-body text-sm text-white/80 transition-colors hover:text-[#d4af37]">
              <Phone className="h-4 w-4 text-[#d4af37]" /> {BUSINESS.phone}
            </a>
            <a href={`https://wa.me/${BUSINESS.phoneRaw}`} target="_blank" rel="noopener noreferrer" data-testid="footer-whatsapp" className="flex items-center gap-3 font-body text-sm text-white/80 transition-colors hover:text-[#d4af37]">
              <MessageCircle className="h-4 w-4 text-[#25D366]" /> WhatsApp
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 md:flex-row md:px-8">
          <p className="font-body text-xs text-white/40">© {year} The Bullet Zone. All rights reserved.</p>
          <p className="font-body text-xs text-white/40">Royal Enfield Service • Repairs • Custom Builds — Gachibowli, Hyderabad</p>
        </div>
      </div>
    </footer>
  );
}
