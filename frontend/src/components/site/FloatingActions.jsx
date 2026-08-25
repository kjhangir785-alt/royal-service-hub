
import { Phone, MessageCircle, MapPin } from "lucide-react";

import { useContent } from "../../context/ContentContext";

export default function FloatingActions() {
  const { business } = useContent();
  const waMsg = encodeURIComponent(
    "Hi The Bullet Zone, I'd like to know more about your Royal Enfield services."
  );
  return (
    <div className="fixed bottom-5 right-4 z-50 flex flex-col gap-3 md:bottom-8 md:right-8">
      <a
        href={`https://wa.me/${business.whatsapp || business.phoneRaw}?text=${waMsg}`}
        target="_blank"
        rel="noopener noreferrer"
        data-testid="floating-whatsapp-btn"
        aria-label="Chat on WhatsApp"
        className="group flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-black/60 text-[#25D366] backdrop-blur-xl transition-[transform,background-color] duration-300 hover:bg-[#25D366] hover:text-black active:scale-95"
      >
        <MessageCircle className="h-6 w-6" />
      </a>
      <a
        href={`tel:${business.phoneRaw}`}
        data-testid="floating-call-btn"
        aria-label="Call now"
        className="group flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-black/60 text-[#d4af37] backdrop-blur-xl transition-[transform,background-color] duration-300 hover:bg-[#d4af37] hover:text-black active:scale-95"
      >
        <Phone className="h-6 w-6" />
      </a>
<a
  href="https://maps.app.goo.gl/PYmb6eLMy4yLcSKR9"
  target="_blank"
  rel="noopener noreferrer"
  data-testid="floating-location-btn"
  aria-label="Google Maps location"
  className="group flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-black/60 text-[#d4af37] backdrop-blur-xl transition-[transform,background-color] duration-300 hover:bg-[#d4af37] hover:text-black active:scale-95"
>
  <MapPin className="h-6 w-6" />
</a>
  </div>
  );
}
