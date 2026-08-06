import { useState } from "react";
import { toast } from "sonner";
import { ArrowUpRight, Loader2, Phone, MessageCircle } from "lucide-react";
import SEO from "@/components/site/SEO";
import PageHeader from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Motion";
import Reviews from "@/components/site/Reviews";
import Faq from "@/components/site/Faq";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useContent } from "@/context/ContentContext";
import { api } from "@/lib/api";

const empty = { name: "", phone: "", bike_model: "", service: "", preferred_date: "", message: "" };
const field =
  "border-white/15 bg-[#0a0a0a] text-white placeholder:text-white/30 focus-visible:ring-1 focus-visible:ring-[#d4af37] focus-visible:ring-offset-0 rounded-none h-12";

export default function BookService() {
  const { business, models, services } = useContent();
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(false);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.bike_model || !form.service) {
      toast.error("Please fill in name, phone, bike model and service.");
      return;
    }
    setLoading(true);
    try {
      await api.post(`/bookings`, form);
      toast.success("Booking received! We'll confirm your slot shortly.");
      const msg = encodeURIComponent(
        `New Service Booking — The Bullet Zone\n\nName: ${form.name}\nPhone: ${form.phone}\nBike Model: ${form.bike_model}\nService: ${form.service}\nPreferred Date: ${form.preferred_date || "—"}\nMessage: ${form.message || "—"}`
      );
      window.open(`https://wa.me/${business.whatsapp || business.phoneRaw}?text=${msg}`, "_blank");
      setForm(empty);
    } catch (err) {
      toast.error("Something went wrong. Please call or WhatsApp us directly.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        title="Book Royal Enfield Service Online — Gachibowli"
        description="Book your Royal Enfield service online at The Bullet Zone, Gachibowli, Hyderabad. Share your bike model and preferred date — we'll confirm your slot over call or WhatsApp."
        path="/book"
      />
      <PageHeader
        chapter="Book Service"
        title="Reserve your slot in minutes"
        subtitle="Tell us about your Royal Enfield and when you'd like to come in. We'll confirm your booking over a call or WhatsApp."
      />

      <section className="py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-14 px-4 md:px-8 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal>
            <form onSubmit={submit} className="border border-white/10 bg-[#111111] p-6 md:p-10" data-testid="booking-form">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="font-body text-xs uppercase tracking-widest text-white/60">Customer Name *</Label>
                  <Input data-testid="booking-name" className={field} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Your full name" />
                </div>
                <div className="space-y-2">
                  <Label className="font-body text-xs uppercase tracking-widest text-white/60">Phone Number *</Label>
                  <Input data-testid="booking-phone" className={field} value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+91 ..." />
                </div>
                <div className="space-y-2">
                  <Label className="font-body text-xs uppercase tracking-widest text-white/60">Bike Model *</Label>
                  <Select value={form.bike_model} onValueChange={(v) => set("bike_model", v)}>
                    <SelectTrigger data-testid="booking-bike-model" className={field}><SelectValue placeholder="Select model" /></SelectTrigger>
                    <SelectContent className="max-h-64 border-white/10 bg-[#111111] text-white">
                      {(models || []).map((m) => (<SelectItem key={m.name} value={m.name} className="focus:bg-[#d4af37]/15 focus:text-[#d4af37]">{m.name}</SelectItem>))}
                      <SelectItem value="Other Royal Enfield" className="focus:bg-[#d4af37]/15 focus:text-[#d4af37]">Other Royal Enfield</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="font-body text-xs uppercase tracking-widest text-white/60">Service Required *</Label>
                  <Select value={form.service} onValueChange={(v) => set("service", v)}>
                    <SelectTrigger data-testid="booking-service" className={field}><SelectValue placeholder="Select service" /></SelectTrigger>
                    <SelectContent className="max-h-64 border-white/10 bg-[#111111] text-white">
                      {(services || []).map((s) => (<SelectItem key={s.name} value={s.name} className="focus:bg-[#d4af37]/15 focus:text-[#d4af37]">{s.name}</SelectItem>))}
                      <SelectItem value="Modification / Custom Build" className="focus:bg-[#d4af37]/15 focus:text-[#d4af37]">Modification / Custom Build</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="font-body text-xs uppercase tracking-widest text-white/60">Preferred Date</Label>
                  <Input data-testid="booking-date" type="date" className={`${field} [color-scheme:dark]`} value={form.preferred_date} onChange={(e) => set("preferred_date", e.target.value)} />
                </div>
              </div>
              <div className="mt-6 space-y-2">
                <Label className="font-body text-xs uppercase tracking-widest text-white/60">Message</Label>
                <Textarea data-testid="booking-message" className={`${field} h-28`} value={form.message} onChange={(e) => set("message", e.target.value)} placeholder="Tell us more about what your bike needs..." />
              </div>
              <button type="submit" disabled={loading} data-testid="booking-submit" className="mt-8 flex w-full items-center justify-center gap-2 border border-[#d4af37] bg-[#d4af37] px-8 py-4 font-body text-sm uppercase tracking-widest text-black transition-colors duration-300 hover:bg-transparent hover:text-[#d4af37] disabled:opacity-60">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Submit Booking <ArrowUpRight className="h-4 w-4" /></>}
              </button>
              <p className="mt-4 text-center font-body text-xs text-white/40">On submit, a pre-filled WhatsApp message opens so you can send it to us instantly.</p>
            </form>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="space-y-5">
              <div className="border border-white/10 bg-[#0a0a0a] p-8">
                <h3 className="font-display text-2xl tracking-tight text-white">Prefer to talk?</h3>
                <p className="mt-3 font-body text-sm leading-relaxed text-white/55">Reach {business.owner} directly — we're happy to advise before you book.</p>
                <a href={`tel:${business.phoneRaw}`} data-testid="book-call" className="mt-6 flex items-center gap-3 border border-white/15 px-5 py-4 font-body text-sm text-white transition-colors hover:border-[#d4af37] hover:text-[#d4af37]">
                  <Phone className="h-4 w-4 text-[#d4af37]" /> {business.phone}
                </a>
                <a href={`https://wa.me/${business.whatsapp || business.phoneRaw}`} target="_blank" rel="noopener noreferrer" data-testid="book-whatsapp" className="mt-3 flex items-center gap-3 border border-white/15 px-5 py-4 font-body text-sm text-white transition-colors hover:border-[#25D366] hover:text-[#25D366]">
                  <MessageCircle className="h-4 w-4 text-[#25D366]" /> Chat on WhatsApp
                </a>
              </div>
              <div className="border border-[#d4af37]/25 bg-[#0a0a0a] p-8">
                <h4 className="font-body text-xs uppercase tracking-widest text-[#d4af37]">Working Hours</h4>
                {(business.hours || []).map((h) => (
                  <div key={h.day} className="mt-4 flex justify-between border-b border-white/5 pb-3 font-body text-sm">
                    <span className="text-white/70">{h.day}</span>
                    <span className="text-white">{h.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <Reviews />
      <Faq />
    </>
  );
}
