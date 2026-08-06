import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useContent } from "../../context/ContentContext";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/models", label: "Models" },
  { to: "/modifications", label: "Modifications" },
  { to: "/accessories", label: "Accessories" },
  { to: "/gallery", label: "Gallery" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { business } = useContent();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,padding] duration-500 ${
        scrolled
          ? "border-b border-white/10 bg-black/70 py-3 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent py-5"
      }`}
      data-testid="main-navbar"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 md:px-8">
        <Link to="/" data-testid="nav-logo" className="group flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center border border-[#d4af37]/50 text-[#d4af37]">
            <span className="font-display text-lg leading-none">B</span>
          </span>
          <span className="font-display text-base tracking-tight text-white md:text-lg">
            THE BULLET <span className="gold-text">ZONE</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {LINKS.map((l) => {
            const active = location.pathname === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                data-testid={`nav-link-${l.label.toLowerCase()}`}
                className={`relative font-body text-sm tracking-wide transition-colors duration-300 hover:text-[#d4af37] ${
                  active ? "text-[#d4af37]" : "text-white/70"
                }`}
              >
                {l.label}
                {active && (
                  <span className="absolute -bottom-1.5 left-0 h-px w-full bg-[#d4af37]" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={`tel:${business.phoneRaw}`}
            data-testid="nav-call-btn"
            className="hidden items-center gap-2 border border-white/15 px-4 py-2 font-body text-xs uppercase tracking-widest text-white transition-colors duration-300 hover:border-[#d4af37] hover:text-[#d4af37] md:flex"
          >
            <Phone className="h-3.5 w-3.5" /> Call
          </a>
          <Link
            to="/book"
            data-testid="nav-book-btn"
            className="hidden items-center border border-[#d4af37] bg-[#d4af37] px-5 py-2 font-body text-xs uppercase tracking-widest text-black transition-colors duration-300 hover:bg-transparent hover:text-[#d4af37] md:flex"
          >
            Book Service
          </Link>
          <button
            onClick={() => setOpen((v) => !v)}
            data-testid="nav-menu-toggle"
            aria-label="Toggle menu"
            className="flex h-11 w-11 items-center justify-center border border-white/15 text-white lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-white/10 bg-black/95 backdrop-blur-xl lg:hidden"
            data-testid="mobile-menu"
          >
            <nav className="mx-auto flex max-w-7xl flex-col px-4 py-4">
              {LINKS.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  data-testid={`mobile-nav-link-${l.label.toLowerCase()}`}
                  className="border-b border-white/5 py-3.5 font-display text-lg tracking-tight text-white/80 transition-colors hover:text-[#d4af37]"
                >
                  {l.label}
                </Link>
              ))}
              <Link
                to="/book"
                data-testid="mobile-book-btn"
                className="mt-4 flex items-center justify-center bg-[#d4af37] py-3.5 font-body text-sm uppercase tracking-widest text-black"
              >
                Book Service
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
