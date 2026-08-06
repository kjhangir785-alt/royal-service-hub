import { useState } from "react";
import SEO from "@/components/site/SEO";
import PageHeader from "@/components/site/PageHeader";
import { motion, AnimatePresence } from "framer-motion";
import CtaBanner from "@/components/site/CtaBanner";
import { useContent } from "@/context/ContentContext";
import { resolveImg } from "@/lib/api";

export default function Gallery() {
  const { gallery, galleryHeaderImageUrl } = useContent();
  const [filter, setFilter] = useState("All");
  const tags = Array.from(new Set((gallery || []).map((g) => g.tag)));
  const FILTERS = ["All", ...tags];
  const items = filter === "All" ? gallery || [] : (gallery || []).filter((g) => g.tag === filter);

  return (
    <>
      <SEO
        title="Gallery — Workshop, Custom Builds & Deliveries"
        description="A look inside The Bullet Zone — workshop, service work, before & after transformations, modified Royal Enfields, customer deliveries and premium accessories in Gachibowli, Hyderabad."
        path="/gallery"
      />
      <PageHeader
        chapter="Gallery"
        title="Work we're proud to put our name on"
        subtitle="A glimpse into the workshop, our custom builds, dramatic before-and-afters and the smiles at delivery."
        image={resolveImg(galleryHeaderImageUrl)}
      />

      <section className="py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="flex flex-wrap gap-3">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                data-testid={`gallery-filter-${f.toLowerCase().replace(/[^a-z]+/g, "-")}`}
                className={`border px-5 py-2.5 font-body text-xs uppercase tracking-widest transition-colors duration-300 ${
                  filter === f
                    ? "border-[#d4af37] bg-[#d4af37] text-black"
                    : "border-white/15 text-white/70 hover:border-[#d4af37]/50 hover:text-[#d4af37]"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <motion.div layout className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            <AnimatePresence mode="popLayout">
              {items.map((g, i) => (
                <motion.figure
                  key={g.imageUrl + g.tag + i}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className={`group relative overflow-hidden border border-white/10 ${i % 5 === 0 ? "md:col-span-2 md:row-span-2" : ""}`}
                  data-testid={`gallery-item-${i}`}
                >
                  <img src={resolveImg(g.imageUrl)} alt={g.tag} className="h-full min-h-[180px] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <figcaption className="absolute bottom-4 left-4 font-body text-xs uppercase tracking-widest text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    {g.tag}
                  </figcaption>
                </motion.figure>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
