import { Link } from "react-router-dom";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Phone, MessageCircle, ArrowUpRight, Check } from "lucide-react";
import SEO from "@/components/site/SEO";
import { MaskedLines, Reveal, Stagger, StaggerItem } from "@/components/site/Motion";
import EditorialMarquee from "@/components/site/EditorialMarquee";
import Reviews from "@/components/site/Reviews";
import Faq from "@/components/site/Faq";
import CtaBanner from "@/components/site/CtaBanner";
import { useContent } from "@/context/ContentContext";
import { resolveImg } from "@/lib/api";

const CHAPTERS = [
  { n: "01", title: "Expertise", text: "Seasoned mechanics who live and breathe Royal Enfield — every bolt torqued to spec, every fault diagnosed with intent." },
  { n: "02", title: "Authenticity", text: "Genuine and OEM-grade parts only. No shortcuts, no surprises — just honest work confirmed with you before it begins." },
  { n: "03", title: "Craft", text: "From frame-off restorations to bespoke cafe-racer builds, we treat every motorcycle like a signature piece." },
];

export default function Home() {
  const { business, hero, highlights, services, models } = useContent();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.18]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [0.55, 0.9]);

  const waMsg = encodeURIComponent("Hi The Bullet Zone, I'd like to book a service for my Royal Enfield.");

  return (
    <>
      <SEO
        title="Royal Enfield Service, Repairs & Custom Builds in Gachibowli"
        description="The Bullet Zone is Hyderabad's premium Royal Enfield workshop in Gachibowli — expert service, engine repair, modifications, restoration & performance tuning. Book online or call +91 8247730083."
        path="/"
      />

      <section ref={heroRef} className="relative flex min-h-[100svh] items-end overflow-hidden" data-testid="hero-section">
        <motion.img
          src={resolveImg(hero?.imageUrl)}
          alt="Premium Royal Enfield motorcycle at The Bullet Zone workshop"
          style={{ y: bgY, scale: bgScale }}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <motion.div style={{ opacity: overlayOpacity }} className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-[#050505]/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/70 to-transparent" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-16 pt-32 md:px-8 md:pb-24">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
            <span className="font-body text-xs uppercase tracking-[0.3em] text-[#d4af37]">
              Gachibowli · Hyderabad
            </span>
          </motion.div>

          <h1 className="mt-6 font-display text-[15vw] font-semibold leading-[0.9] tracking-tighter text-white sm:text-7xl md:text-8xl lg:text-[8.5rem]">
            <MaskedLines lines={["THE BULLET", <span key="z" className="text-gradient-gold">ZONE</span>]} delay={0.15} />
          </h1>

          <Reveal delay={0.7}>
            <p className="mt-8 max-w-xl font-body text-base leading-relaxed text-white/70 md:text-lg">
              Professional Royal Enfield Service, Repairs, Custom Builds & Performance Upgrades. {business.tagline}.
            </p>
          </Reveal>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.85 }}
            className="mt-10 flex flex-wrap gap-3 md:gap-4"
          >
            <Link to="/book" data-testid="hero-book-btn" className="flex items-center gap-2 border border-[#d4af37] bg-[#d4af37] px-7 py-4 font-body text-sm uppercase tracking-widest text-black transition-colors duration-300 hover:bg-transparent hover:text-[#d4af37]">
              Book Service <ArrowUpRight className="h-4 w-4" />
            </Link>
            <a href={`tel:${business.phoneRaw}`} data-testid="hero-call-btn" className="flex items-center gap-2 border border-white/25 px-7 py-4 font-body text-sm uppercase tracking-widest text-white backdrop-blur-sm transition-colors duration-300 hover:border-[#d4af37] hover:text-[#d4af37]">
              <Phone className="h-4 w-4" /> Call Now
            </a>
            <a href={`https://wa.me/${business.whatsapp || business.phoneRaw}?text=${waMsg}`} target="_blank" rel="noopener noreferrer" data-testid="hero-whatsapp-btn" className="flex items-center gap-2 border border-white/25 px-7 py-4 font-body text-sm uppercase tracking-widest text-white backdrop-blur-sm transition-colors duration-300 hover:border-[#25D366] hover:text-[#25D366]">
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>
          </motion.div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#0a0a0a] py-14" data-testid="highlights-section">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <Stagger className="grid grid-cols-2 gap-x-6 gap-y-6 md:grid-cols-3 lg:grid-cols-6">
            {(highlights || []).map((h) => (
              <StaggerItem key={h} className="flex items-center gap-3">
                <Check className="h-5 w-5 shrink-0 text-[#d4af37]" />
                <span className="font-body text-sm text-white/80">{h}</span>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="relative py-20 md:py-32" data-testid="manifesto-section">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
            <div>
              <Reveal>
                <span className="font-body text-xs uppercase tracking-[0.25em] text-[#d4af37]">Who we are</span>
                <h2 className="mt-4 font-display text-3xl font-semibold leading-[1.08] tracking-tighter text-white md:text-5xl">
                  A workshop built on precision, patience and pure passion for the thump.
                </h2>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="mt-6 max-w-lg font-body text-base leading-relaxed text-white/60">
                  The Bullet Zone is a specialist Royal Enfield workshop in Gachibowli, Hyderabad. Under the guidance of {business.owner}, we deliver professional repairs, servicing, restoration and customization — all under one roof.
                </p>
              </Reveal>
              <Reveal delay={0.18}>
                <Link to="/about" data-testid="manifesto-about-link" className="mt-8 inline-flex items-center gap-2 font-body text-sm uppercase tracking-widest text-[#d4af37] transition-colors hover:text-white">
                  Our Story <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Reveal>
            </div>

            <div className="flex flex-col">
              {CHAPTERS.map((c, i) => (
                <Reveal key={c.n} delay={i * 0.08}>
                  <div className="flex gap-6 border-t border-white/10 py-7">
                    <span className="font-display text-2xl text-[#b5955c]">{c.n}</span>
                    <div>
                      <h3 className="font-display text-xl tracking-tight text-white">{c.title}</h3>
                      <p className="mt-2 font-body text-sm leading-relaxed text-white/55">{c.text}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <EditorialMarquee />

      <section className="relative py-20 md:py-32" data-testid="services-teaser">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <Reveal>
              <span className="font-body text-xs uppercase tracking-[0.25em] text-[#d4af37]">What we do</span>
              <h2 className="mt-4 max-w-xl font-display text-3xl font-semibold leading-tight tracking-tighter text-white md:text-5xl">
                Complete Royal Enfield care, expertly delivered
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <Link to="/services" data-testid="services-teaser-link" className="inline-flex items-center gap-2 border border-white/20 px-6 py-3 font-body text-xs uppercase tracking-widest text-white transition-colors hover:border-[#d4af37] hover:text-[#d4af37]">
                All {(services || []).length} Services <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Reveal>
          </div>

          <Stagger className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {(services || []).slice(0, 6).map((s) => (
              <StaggerItem key={s.name}>
                <div className="hover-lift h-full border border-white/10 bg-[#111111] p-8" data-testid={`service-teaser-${s.name.toLowerCase().replace(/\s+/g, "-")}`}>
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-display text-xl tracking-tight text-white">{s.name}</h3>
                    {s.price ? <span className="shrink-0 font-body text-sm text-[#d4af37]">{s.price}</span> : null}
                  </div>
                  <p className="mt-3 font-body text-sm leading-relaxed text-white/55">{s.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="relative overflow-hidden border-t border-white/10 py-20 md:py-32" data-testid="models-teaser">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <Reveal>
            <span className="font-body text-xs uppercase tracking-[0.25em] text-[#d4af37]">Every Enfield, welcome</span>
            <h2 className="mt-4 max-w-2xl font-display text-3xl font-semibold leading-tight tracking-tighter text-white md:text-5xl">
              We service all Royal Enfield motorcycles
            </h2>
          </Reveal>
          <Stagger className="mt-12 flex flex-wrap gap-3">
            {(models || []).map((m) => (
              <StaggerItem key={m.name}>
                <span className="inline-flex items-center gap-2 border border-white/10 bg-[#111111] px-5 py-3 font-body text-sm text-white/75 transition-colors duration-300 hover:border-[#d4af37]/40 hover:text-[#d4af37]">
                  {m.name} <span className="text-xs text-white/30">{m.cc}</span>
                </span>
              </StaggerItem>
            ))}
          </Stagger>
          <Reveal delay={0.1}>
            <Link to="/models" data-testid="models-teaser-link" className="mt-10 inline-flex items-center gap-2 font-body text-sm uppercase tracking-widest text-[#d4af37] transition-colors hover:text-white">
              Explore Models <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </section>

      <Reviews />
      <Faq />
      <CtaBanner />
    </>
  );
}
