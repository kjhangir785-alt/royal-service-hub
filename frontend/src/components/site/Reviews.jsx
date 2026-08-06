import { Star } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "./Motion";
import { useContent } from "../../context/ContentContext";

export default function Reviews() {
  const { reviews } = useContent();
  return (
    <section className="relative border-t border-white/10 py-20 md:py-32" data-testid="reviews-section">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <Reveal>
          <span className="font-body text-xs uppercase tracking-[0.25em] text-[#d4af37]">Rider Stories</span>
          <h2 className="mt-4 max-w-2xl font-display text-3xl font-semibold leading-tight tracking-tighter text-white md:text-5xl">
            Trusted by Royal Enfield riders across Hyderabad
          </h2>
        </Reveal>

        <Stagger className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {(reviews || []).map((r, i) => (
            <StaggerItem key={i}>
              <figure className="hover-lift flex h-full flex-col border border-white/10 bg-[#111111] p-7" data-testid={`review-card-${i}`}>
                <div className="flex gap-1">
                  {Array.from({ length: r.rating || 5 }).map((_, s) => (
                    <Star key={s} className="h-4 w-4 fill-[#d4af37] text-[#d4af37]" />
                  ))}
                </div>
                <blockquote className="mt-5 flex-1 font-body text-sm leading-relaxed text-white/70">
                  “{r.text}”
                </blockquote>
                <figcaption className="mt-6 border-t border-white/10 pt-5">
                  <span className="block font-display text-base text-white">{r.name}</span>
                  <span className="font-body text-xs uppercase tracking-widest text-[#b5955c]">{r.model}</span>
                </figcaption>
              </figure>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
