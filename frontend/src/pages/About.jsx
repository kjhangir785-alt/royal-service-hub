import { Check } from "lucide-react";
import SEO from "@/components/site/SEO";
import PageHeader from "@/components/site/PageHeader";
import { Reveal, Stagger, StaggerItem } from "@/components/site/Motion";
import CtaBanner from "@/components/site/CtaBanner";
import { useContent } from "@/context/ContentContext";
import { resolveImg } from "@/lib/api";

export default function About() {
  const { business, about } = useContent();
  return (
    <>
      <SEO
        title="About Us — Trusted Royal Enfield Specialist Workshop"
        description="The Bullet Zone is a trusted Royal Enfield specialist workshop in Gachibowli, Hyderabad offering repairs, servicing, restoration and customization with experienced mechanics."
        path="/about"
      />
      <PageHeader
        chapter="Our Story"
        title="Trusted Royal Enfield specialists in the heart of Hyderabad"
        subtitle={`Founded and led by ${business.owner}, The Bullet Zone brings together experienced mechanics, genuine parts and a genuine love for the marque.`}
        image={resolveImg(about?.headerImageUrl)}
      />

      <section className="py-20 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-14 px-4 md:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <Reveal>
            <div className="space-y-6 font-body text-base leading-relaxed text-white/65">
              {(about?.paragraphs || []).map((p, i) => (<p key={i}>{p}</p>))}
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <div className="relative">
              <img src={resolveImg(about?.image1Url)} alt="Mechanic at The Bullet Zone" className="aspect-[4/5] w-full border border-white/10 object-cover" />
              <div className="absolute -bottom-6 -left-6 hidden border border-[#d4af37]/40 bg-[#050505] px-8 py-6 md:block">
                <span className="font-display text-3xl text-gradient-gold">One Roof</span>
                <p className="font-body text-xs uppercase tracking-widest text-white/50">Complete RE Care</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#0a0a0a] py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 md:grid-cols-4 md:px-8">
          {(about?.stats || []).map((s, i) => (
            <Reveal key={s.l + i} delay={i * 0.06}>
              <div className="text-center md:text-left">
                <div className="font-display text-4xl font-semibold text-white md:text-5xl">{s.v}</div>
                <div className="mt-2 font-body text-xs uppercase tracking-widest text-[#b5955c]">{s.l}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <Reveal>
            <span className="font-body text-xs uppercase tracking-[0.25em] text-[#d4af37]">Why riders choose us</span>
            <h2 className="mt-4 max-w-2xl font-display text-3xl font-semibold leading-tight tracking-tighter text-white md:text-5xl">
              Built on trust, delivered with craft
            </h2>
          </Reveal>
          <Stagger className="mt-12 grid gap-5 md:grid-cols-2">
            {(about?.values || []).map((v, i) => (
              <StaggerItem key={v + i}>
                <div className="flex items-start gap-4 border border-white/10 bg-[#111111] p-6">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-[#d4af37]" />
                  <span className="font-body text-base text-white/80">{v}</span>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
