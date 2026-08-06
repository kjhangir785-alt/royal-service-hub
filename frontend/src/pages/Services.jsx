import * as Icons from "lucide-react";
import SEO from "@/components/site/SEO";
import PageHeader from "@/components/site/PageHeader";
import { Stagger, StaggerItem } from "@/components/site/Motion";
import Faq from "@/components/site/Faq";
import CtaBanner from "@/components/site/CtaBanner";
import { useContent } from "@/context/ContentContext";
import { resolveImg } from "@/lib/api";

export default function Services() {
  const { services, servicesHeaderImageUrl } = useContent();
  return (
    <>
      <SEO
        title="Royal Enfield Services — Repairs, Tuning & Detailing"
        description="Full range of Royal Enfield services in Gachibowli, Hyderabad: general service, engine repair & rebuild, EFI diagnostics, performance tuning, ceramic coating, accident repair and complete restoration."
        path="/services"
      />
      <PageHeader
        chapter="Services"
        title="Everything your Royal Enfield needs, under one roof"
        subtitle="Professional services — from a quick oil change to a full frame-off restoration — handled by mechanics who specialise in Royal Enfield."
        image={resolveImg(servicesHeaderImageUrl)}
      />

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {(services || []).map((s, i) => {
              const Icon = Icons[s.icon] || Icons.Wrench;
              return (
                <StaggerItem key={s.name + i}>
                  <div className="hover-lift group flex h-full flex-col border border-white/10 bg-[#111111] p-8" data-testid={`service-card-${i}`}>
                    <div className="flex items-center justify-between">
                      <span className="flex h-12 w-12 items-center justify-center border border-[#d4af37]/30 text-[#d4af37] transition-colors duration-300 group-hover:bg-[#d4af37] group-hover:text-black">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="font-display text-sm text-white/20">{String(i + 1).padStart(2, "0")}</span>
                    </div>
                    <h3 className="mt-6 font-display text-xl tracking-tight text-white">{s.name}</h3>
                    <p className="mt-3 flex-1 font-body text-sm leading-relaxed text-white/55">{s.desc}</p>
                    <div className="mt-5 border-t border-white/10 pt-4">
                      <span className="font-body text-sm text-[#d4af37]">{s.price ? s.price : "Contact for price"}</span>
                    </div>
                  </div>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </section>

      <Faq />
      <CtaBanner />
    </>
  );
}
