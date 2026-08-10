import { Phone, MessageCircle, MapPin, Clock, User } from "lucide-react";
import SEO from "@/components/site/SEO";
import PageHeader from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Motion";
import { useContent } from "@/context/ContentContext";

export default function Contact() {
  const { business } = useContent();
  const waMsg = encodeURIComponent("Hi The Bullet Zone, I'd like to enquire about a service.");
  return (
    <>
      <SEO
        title="Contact — Royal Enfield Workshop in Gachibowli, Hyderabad"
        description="Contact The Bullet Zone Royal Enfield workshop at Hills Lake View Point, Madhura Nagar Colony, Gachibowli, Khajaguda, Hyderabad. Call +91 8247730083 or WhatsApp. Open all days 9 AM – 11 PM."
        path="/contact"
      />
      <PageHeader
        chapter="Contact"
        title="Come say hello at the workshop"
        subtitle="Find us at Hills Lake View Point in Gachibowli. Call, WhatsApp or drop by — we'd love to help with your Royal Enfield."
      />

      <section className="py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 md:px-8 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <div className="space-y-4">
              <div className="border border-white/10 bg-[#111111] p-7" data-testid="contact-owner">
                <div className="flex items-center gap-3 font-body text-xs uppercase tracking-widest text-[#d4af37]"><User className="h-4 w-4" /> Owner</div>
                <p className="mt-3 font-display text-2xl tracking-tight text-white">{business.owner}</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <a href={`tel:${business.phoneRaw}`} data-testid="contact-call" className="hover-lift border border-white/10 bg-[#111111] p-7">
                  <div className="flex items-center gap-3 font-body text-xs uppercase tracking-widest text-[#d4af37]"><Phone className="h-4 w-4" /> Phone</div>
                  <p className="mt-3 font-display text-lg tracking-tight text-white">{business.phone}</p>
                </a>
                <a href={`https://wa.me/${business.whatsapp || business.phoneRaw}?text=${waMsg}`} target="_blank" rel="noopener noreferrer" data-testid="contact-whatsapp" className="hover-lift border border-white/10 bg-[#111111] p-7">
                  <div className="flex items-center gap-3 font-body text-xs uppercase tracking-widest text-[#25D366]"><MessageCircle className="h-4 w-4" /> WhatsApp</div>
                  <p className="mt-3 font-display text-lg tracking-tight text-white">{business.phone}</p>
                </a>
              </div>

              
<a
  href="https://maps.app.goo.gl/PYmb6eLMy4yLcSKR9"
  target="_blank"
  rel="noopener noreferrer"
  className="block"
>
  <div className="border border-white/10 bg-[#111111] p-7 hover:border-[#d4af37] transition-colors" data-testid="contact-address">
    <div className="flex items-center gap-3 font-body text-xs uppercase tracking-widest text-[#d4af37]">
      <MapPin className="h-4 w-4" /> Address
    </div>
    <p className="mt-3 font-body text-base leading-relaxed text-white/75">
      {(business.addressLines || []).map((l, i) => (
        <span key={i} className="block">{l}</span>
      ))}
    </p>
  </div>
</a>


              <div className="border border-[#d4af37]/25 bg-[#0a0a0a] p-7" data-testid="contact-hours">
                <div className="flex items-center gap-3 font-body text-xs uppercase tracking-widest text-[#d4af37]"><Clock className="h-4 w-4" /> Working Hours</div>
                {(business.hours || []).map((h) => (
                  <div key={h.day} className="mt-4 flex justify-between border-b border-white/5 pb-3 font-body text-sm">
                    <span className="text-white/70">{h.day}</span>
                    <span className="text-white">{h.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="h-full min-h-[420px] border border-white/10">
              <iframe
                title="The Bullet Zone location"
                data-testid="google-map"
                src={`https://www.google.com/maps?q=${business.mapsQuery}&output=embed`}
                className="h-full min-h-[420px] w-full grayscale-[0.3] contrast-[1.1]"
                style={{ border: 0, filter: "invert(0.92) hue-rotate(180deg)" }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
