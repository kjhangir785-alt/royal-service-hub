import { Reveal } from "./Motion";

// Reusable inner page hero header
export default function PageHeader({ chapter, title, subtitle, image }) {
  return (
    <section className="relative overflow-hidden border-b border-white/10 pt-36 pb-16 md:pt-44 md:pb-24">
      {image && (
        <>
          <img
            src={image}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-[#050505]/50" />
        </>
      )}
      <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-8">
        <Reveal>
          {chapter && (
            <span className="font-body text-xs uppercase tracking-[0.25em] text-[#d4af37]">
              {chapter}
            </span>
          )}
        </Reveal>
        <Reveal delay={0.08}>
          <h1 className="mt-4 max-w-4xl font-display text-4xl font-semibold leading-[1.02] tracking-tighter text-white md:text-6xl">
            {title}
          </h1>
        </Reveal>
        {subtitle && (
          <Reveal delay={0.16}>
            <p className="mt-6 max-w-2xl font-body text-base leading-relaxed text-white/60 md:text-lg">
              {subtitle}
            </p>
          </Reveal>
        )}
      </div>
    </section>
  );
}
