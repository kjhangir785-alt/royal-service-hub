import { Reveal } from "./Motion";
import { FAQS } from "../../lib/data";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

export default function Faq() {
  return (
    <section className="relative border-t border-white/10 py-20 md:py-32" data-testid="faq-section">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 md:px-8 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal>
          <div>
            <span className="font-body text-xs uppercase tracking-[0.25em] text-[#d4af37]">Questions</span>
            <h2 className="mt-4 font-display text-3xl font-semibold leading-tight tracking-tighter text-white md:text-5xl">
              Everything you<br />need to know
            </h2>
            <p className="mt-6 max-w-sm font-body text-sm leading-relaxed text-white/50">
              Still have a question about your Royal Enfield? Call or WhatsApp us — we're happy to help.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <Accordion type="single" collapsible className="w-full">
            {FAQS.map((f, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="border-b border-white/10"
                data-testid={`faq-item-${i}`}
              >
                <AccordionTrigger className="py-6 text-left font-display text-lg tracking-tight text-white hover:text-[#d4af37] hover:no-underline data-[state=open]:text-[#d4af37]">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="font-body text-sm leading-relaxed text-white/60">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
