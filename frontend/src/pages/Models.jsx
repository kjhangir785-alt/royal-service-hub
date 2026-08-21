
import { Link } from "react-router-dom";
import SEO from "@/components/site/SEO";
import PageHeader from "@/components/site/PageHeader";
import { Stagger, StaggerItem, Reveal } from "@/components/site/Motion";
import CtaBanner from "@/components/site/CtaBanner";
import { useContent } from "@/context/ContentContext";
import { resolveImg } from "@/lib/api";

export default function Models() {
  const { models, modelsHeaderImageUrl } = useContent();
  return (
    <>
      <SEO
        title="Royal Enfield Models We Service"
        description="We service all Royal Enfield models in Hyderabad — Bullet 350, Classic 350, Hunter 350, Meteor 350, Super Meteor 650, Himalayan, Scram 411, Interceptor 650, Continental GT 650, Guerrilla 450 and Shotgun 650."
        path="/models"
      />
      <PageHeader
        chapter="The Line-up"
        title="We service all Royal Enfield motorcycles"
        subtitle="From the timeless Bullet 350 to the muscular 650 twins and the all-new Guerrilla 450 — whatever you ride, we know it inside out."
        image={resolveImg(modelsHeaderImageUrl)}
      />

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {(models || []).map((m, i) => (
              <StaggerItem key={m.name + i}>
                <div className="hover-lift group relative overflow-hidden border border-white/10 bg-[#111111]" data-testid={`model-card-${i}`}>
                  <div className="relative h-56 overflow-hidden">
                    <img src={resolveImg(m.imageUrl)} alt={`Royal Enfield ${m.name}`} className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent" />
                    {m.cat ? <span className="absolute left-4 top-4 border border-white/20 bg-black/50 px-3 py-1 font-body text-[10px] uppercase tracking-widest text-white backdrop-blur-md">{m.cat}</span> : null}
                  </div>
                  <div className="flex items-center justify-between p-6">
                    <div>
                      <h3 className="font-display text-xl tracking-tight text-white">{m.name}</h3>
                      <span className="font-body text-xs uppercase tracking-widest text-[#b5955c]">{m.cc}</span>
                    </div>
                    
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal delay={0.1}>
            <div className="mt-12 border border-[#d4af37]/30 bg-[#0a0a0a] p-8 text-center md:p-12">
              <p className="font-display text-2xl tracking-tight text-white md:text-3xl">
                Ride something else? <span className="text-gradient-gold">We service all Royal Enfield motorcycles.</span>
              </p>
              
            </div>
          </Reveal>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
