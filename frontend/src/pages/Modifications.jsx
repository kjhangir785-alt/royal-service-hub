import SEO from "@/components/site/SEO";
import PageHeader from "@/components/site/PageHeader";
import { Stagger, StaggerItem, Reveal } from "@/components/site/Motion";
import CtaBanner from "@/components/site/CtaBanner";
import { MODIFICATIONS, IMAGES } from "@/lib/data";

export default function Modifications() {
  return (
    <>
      <SEO
        title="Royal Enfield Modification in Hyderabad — Custom Builds"
        description="Premium Royal Enfield modifications in Gachibowli, Hyderabad: custom seats, custom paint, LED lights, alloy wheels, crash guards, touring accessories, performance exhaust and bespoke custom builds."
        path="/modifications"
      />
      <PageHeader
        chapter="Modifications"
        title="Make it unmistakably yours"
        subtitle="Thoughtful, high-quality modifications that elevate the look, comfort and character of your Royal Enfield — engineered to last, styled to turn heads."
        image={IMAGES.cafeTank}
      />

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          {/* feature row */}
          <div className="mb-6 grid gap-5 lg:grid-cols-3">
            <Reveal className="lg:col-span-2">
              <div className="relative h-72 overflow-hidden border border-white/10 lg:h-full">
                <img src={IMAGES.cafeFront} alt="Custom Royal Enfield build" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent" />
                <div className="absolute bottom-0 left-0 p-8">
                  <span className="font-body text-xs uppercase tracking-[0.25em] text-[#d4af37]">Signature builds</span>
                  <h3 className="mt-2 max-w-md font-display text-2xl tracking-tight text-white md:text-3xl">From cafe racers to touring machines</h3>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="relative h-72 overflow-hidden border border-white/10 lg:h-full">
                <img src={IMAGES.exhaust} alt="Performance exhaust" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent" />
                <div className="absolute bottom-0 left-0 p-8">
                  <h3 className="font-display text-2xl tracking-tight text-white">Performance & Sound</h3>
                </div>
              </div>
            </Reveal>
          </div>

          <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {MODIFICATIONS.map((m, i) => (
              <StaggerItem key={m.name}>
                <div className="hover-lift flex h-full items-start gap-5 border border-white/10 bg-[#111111] p-7" data-testid={`mod-card-${i}`}>
                  <span className="font-display text-2xl text-[#b5955c]">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="font-display text-lg tracking-tight text-white">{m.name}</h3>
                    <p className="mt-2 font-body text-sm leading-relaxed text-white/55">{m.desc}</p>
                  </div>
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
