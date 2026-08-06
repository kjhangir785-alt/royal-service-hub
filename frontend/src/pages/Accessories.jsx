import SEO from "@/components/site/SEO";
import PageHeader from "@/components/site/PageHeader";
import { Stagger, StaggerItem } from "@/components/site/Motion";
import CtaBanner from "@/components/site/CtaBanner";
import { ACCESSORIES, IMAGES } from "@/lib/data";

export default function Accessories() {
  return (
    <>
      <SEO
        title="Premium Royal Enfield Accessories in Hyderabad"
        description="Premium Royal Enfield accessories in Gachibowli, Hyderabad — helmets, jackets, gloves, mobile holders, mirrors, lights, crash guards, leg guards, seat covers, luggage systems, tank bags and bike covers."
        path="/accessories"
      />
      <PageHeader
        chapter="Accessories"
        title="Premium gear for the way you ride"
        subtitle="Hand-picked, high-quality accessories for protection, comfort and style — for you and your Royal Enfield."
        image={IMAGES.helmetVisor}
      />

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {ACCESSORIES.map((a, i) => (
              <StaggerItem key={a.name}>
                <div className="hover-lift group relative aspect-[4/3] overflow-hidden border border-white/10" data-testid={`accessory-card-${i}`}>
                  <img src={IMAGES[a.img]} alt={a.name} className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 flex w-full items-center justify-between p-6">
                    <h3 className="font-display text-xl tracking-tight text-white">{a.name}</h3>
                    <span className="font-display text-sm text-[#d4af37]">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
          <p className="mt-10 text-center font-body text-sm uppercase tracking-[0.25em] text-white/40">
            …and many more in-store
          </p>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
