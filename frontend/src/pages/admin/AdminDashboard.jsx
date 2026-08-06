import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  Save, LogOut, ExternalLink, Loader2, RotateCcw, Trash2, Plus,
  Store, Home as HomeIcon, Wrench, Bike, Sparkles, ShoppingBag, Images,
  Star, HelpCircle, Image as ImageIcon, CalendarClock, Users, Menu, X, Info,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useContentCtx } from "@/context/ContentContext";
import { api, apiError } from "@/lib/api";
import { Field, Area, ImageUploader, ListEditor, StringListEditor } from "@/components/admin/fields";

const SECTIONS = [
  { id: "business", label: "Business Info", icon: Store },
  { id: "hero", label: "Home / Hero", icon: HomeIcon },
  { id: "about", label: "About Us", icon: Info },
  { id: "services", label: "Services & Prices", icon: Wrench },
  { id: "models", label: "RE Models", icon: Bike },
  { id: "modifications", label: "Modifications", icon: Sparkles },
  { id: "accessories", label: "Accessories", icon: ShoppingBag },
  { id: "gallery", label: "Gallery", icon: Images },
  { id: "reviews", label: "Reviews", icon: Star },
  { id: "faqs", label: "FAQ", icon: HelpCircle },
  { id: "media", label: "Section Images", icon: ImageIcon },
  { id: "bookings", label: "Bookings", icon: CalendarClock },
  { id: "admins", label: "Admin Users", icon: Users },
];

const clone = (o) => JSON.parse(JSON.stringify(o));

export default function AdminDashboard() {
  const { logout, user } = useAuth();
  const ctx = useContentCtx();
  const content = ctx?.content;
  const [draft, setDraft] = useState(null);
  const [active, setActive] = useState("business");
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    if (content && !draft) setDraft(clone(content));
  }, [content, draft]);

  const setSection = (key, value) => {
    setDraft((d) => ({ ...d, [key]: value }));
    setDirty(true);
  };
  const setBiz = (key, value) => {
    setDraft((d) => ({ ...d, business: { ...d.business, [key]: value } }));
    setDirty(true);
  };
  const setAbout = (key, value) => {
    setDraft((d) => ({ ...d, about: { ...d.about, [key]: value } }));
    setDirty(true);
  };

  const save = async () => {
    setSaving(true);
    try {
      await api.put("/content", { data: draft });
      await ctx.refresh();
      setDirty(false);
      toast.success("Changes saved — your website is updated");
    } catch (e) {
      toast.error(apiError(e, "Could not save"));
    } finally {
      setSaving(false);
    }
  };

  const resetDefaults = async () => {
    if (!window.confirm("Reset ALL website content to the original defaults? This cannot be undone.")) return;
    try {
      const { data } = await api.post("/content/reset");
      await ctx.refresh();
      setDraft(clone(data));
      setDirty(false);
      toast.success("Content reset to defaults");
    } catch (e) {
      toast.error(apiError(e, "Reset failed"));
    }
  };

  if (!draft) {
    return <div className="flex min-h-screen items-center justify-center bg-[#050505]"><Loader2 className="h-6 w-6 animate-spin text-[#d4af37]" /></div>;
  }

  return (
    <div className="grain min-h-screen bg-[#050505] text-white">
      {/* Top bar */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-white/10 bg-black/80 px-4 py-3 backdrop-blur-xl md:px-6">
        <div className="flex items-center gap-3">
          <button onClick={() => setNavOpen((v) => !v)} className="flex h-10 w-10 items-center justify-center border border-white/15 lg:hidden" data-testid="admin-nav-toggle">
            {navOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <span className="font-display text-base tracking-tight">THE BULLET <span className="gold-text">ZONE</span> · Admin</span>
        </div>
        <div className="flex items-center gap-2">
          {dirty && <span className="hidden font-body text-[11px] uppercase tracking-widest text-[#d4af37] sm:inline">Unsaved changes</span>}
          <Link to="/" target="_blank" className="hidden items-center gap-1.5 border border-white/15 px-3 py-2 font-body text-[11px] uppercase tracking-widest text-white/70 transition-colors hover:text-[#d4af37] sm:flex" data-testid="admin-view-site">
            <ExternalLink className="h-3.5 w-3.5" /> View Site
          </Link>
          <button onClick={save} disabled={saving} data-testid="admin-save-btn"
            className="flex items-center gap-2 border border-[#d4af37] bg-[#d4af37] px-4 py-2 font-body text-[11px] uppercase tracking-widest text-black transition-colors hover:bg-transparent hover:text-[#d4af37] disabled:opacity-60">
            {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />} Save
          </button>
          <button onClick={logout} data-testid="admin-logout" className="flex h-9 w-9 items-center justify-center border border-white/15 text-white/70 transition-colors hover:text-red-400"><LogOut className="h-4 w-4" /></button>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1500px]">
        {/* Sidebar */}
        <aside className={`${navOpen ? "block" : "hidden"} fixed inset-x-0 top-[57px] z-30 border-b border-white/10 bg-[#0a0a0a] p-3 lg:sticky lg:top-[57px] lg:block lg:h-[calc(100vh-57px)] lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r`}>
          <nav className="flex flex-col gap-1">
            {SECTIONS.map((s) => {
              const Icon = s.icon;
              return (
                <button key={s.id} onClick={() => { setActive(s.id); setNavOpen(false); }} data-testid={`admin-nav-${s.id}`}
                  className={`flex items-center gap-3 px-3 py-2.5 text-left font-body text-sm transition-colors ${active === s.id ? "border-l-2 border-[#d4af37] bg-[#d4af37]/10 text-[#d4af37]" : "border-l-2 border-transparent text-white/60 hover:text-white"}`}>
                  <Icon className="h-4 w-4 shrink-0" /> {s.label}
                </button>
              );
            })}
            <button onClick={resetDefaults} data-testid="admin-reset" className="mt-4 flex items-center gap-3 px-3 py-2.5 text-left font-body text-xs text-white/40 transition-colors hover:text-red-400">
              <RotateCcw className="h-4 w-4" /> Reset to defaults
            </button>
          </nav>
        </aside>

        {/* Main */}
        <main className="min-w-0 flex-1 px-4 py-8 md:px-8">
          <div className="mx-auto max-w-4xl">
            <h1 className="mb-6 font-display text-3xl tracking-tight text-white">{SECTIONS.find((s) => s.id === active)?.label}</h1>

            {active === "business" && (
              <div className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Workshop Name" value={draft.business.name} onChange={(v) => setBiz("name", v)} testid="biz-name" />
                  <Field label="Owner Name" value={draft.business.owner} onChange={(v) => setBiz("owner", v)} testid="biz-owner" />
                  <Field label="Phone (display)" value={draft.business.phone} onChange={(v) => setBiz("phone", v)} testid="biz-phone" />
                  <Field label="Phone (digits for calls, e.g. 918247730083)" value={draft.business.phoneRaw} onChange={(v) => setBiz("phoneRaw", v)} testid="biz-phoneraw" />
                  <Field label="WhatsApp (digits)" value={draft.business.whatsapp} onChange={(v) => setBiz("whatsapp", v)} testid="biz-whatsapp" />
                  <Field label="Short Address" value={draft.business.addressShort} onChange={(v) => setBiz("addressShort", v)} testid="biz-addr-short" />
                </div>
                <Field label="Tagline" value={draft.business.tagline} onChange={(v) => setBiz("tagline", v)} testid="biz-tagline" />
                <Area label="Google Maps query (place name + area)" value={draft.business.mapsQuery} onChange={(v) => setBiz("mapsQuery", v)} rows={2} testid="biz-maps" />
                <div>
                  <p className="mb-2 font-body text-[11px] uppercase tracking-widest text-white/50">Address Lines</p>
                  <StringListEditor items={draft.business.addressLines} onChange={(v) => setBiz("addressLines", v)} placeholder="Address line" addLabel="Add line" testid="biz-addr" />
                </div>
                <div>
                  <p className="mb-2 font-body text-[11px] uppercase tracking-widest text-white/50">Working Hours</p>
                  <ListEditor items={draft.business.hours} onChange={(v) => setBiz("hours", v)} testid="biz-hours"
                    schema={[{ key: "day", label: "Day(s)", type: "text" }, { key: "time", label: "Time (or 'Closed')", type: "text" }]}
                    newItem={{ day: "", time: "" }} addLabel="Add hours row" />
                </div>
              </div>
            )}

            {active === "hero" && (
              <div className="space-y-6">
                <ImageUploader label="Hero Background Image" value={draft.hero?.imageUrl} onChange={(v) => setSection("hero", { ...draft.hero, imageUrl: v })} testid="hero-img" />
                <div>
                  <p className="mb-2 font-body text-[11px] uppercase tracking-widest text-white/50">Homepage Highlights</p>
                  <StringListEditor items={draft.highlights} onChange={(v) => setSection("highlights", v)} placeholder="Highlight" addLabel="Add highlight" testid="highlights" />
                </div>
              </div>
            )}

            {active === "about" && (
              <div className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <ImageUploader label="Header Image" value={draft.about?.headerImageUrl} onChange={(v) => setAbout("headerImageUrl", v)} testid="about-header-img" />
                  <ImageUploader label="Side Photo" value={draft.about?.image1Url} onChange={(v) => setAbout("image1Url", v)} testid="about-side-img" />
                </div>
                <div>
                  <p className="mb-2 font-body text-[11px] uppercase tracking-widest text-white/50">Story Paragraphs</p>
                  <StringListEditor items={draft.about?.paragraphs} onChange={(v) => setAbout("paragraphs", v)} placeholder="Paragraph" addLabel="Add paragraph" testid="about-paras" />
                </div>
                <div>
                  <p className="mb-2 font-body text-[11px] uppercase tracking-widest text-white/50">Stats</p>
                  <ListEditor items={draft.about?.stats} onChange={(v) => setAbout("stats", v)} testid="about-stats"
                    schema={[{ key: "v", label: "Value", type: "text" }, { key: "l", label: "Label", type: "text" }]} newItem={{ v: "", l: "" }} addLabel="Add stat" />
                </div>
                <div>
                  <p className="mb-2 font-body text-[11px] uppercase tracking-widest text-white/50">Why-choose-us Points</p>
                  <StringListEditor items={draft.about?.values} onChange={(v) => setAbout("values", v)} placeholder="Point" addLabel="Add point" testid="about-values" />
                </div>
              </div>
            )}

            {active === "services" && (
              <div>
                <p className="mb-3 font-body text-xs text-white/40">Leave price empty to show “Contact for price”. Icon = a Lucide icon name (e.g. Wrench, Cog, Gauge).</p>
                <ListEditor items={draft.services} onChange={(v) => setSection("services", v)} testid="services"
                  schema={[
                    { key: "name", label: "Service Name", type: "text" },
                    { key: "price", label: "Price (optional, e.g. ₹1,499)", type: "text" },
                    { key: "icon", label: "Icon name", type: "text" },
                    { key: "desc", label: "Description", type: "textarea" },
                  ]} newItem={{ name: "", price: "", icon: "Wrench", desc: "" }} addLabel="Add service" />
              </div>
            )}

            {active === "models" && (
              <ListEditor items={draft.models} onChange={(v) => setSection("models", v)} testid="models"
                schema={[
                  { key: "name", label: "Model Name", type: "text" },
                  { key: "cc", label: "Engine (e.g. 349cc)", type: "text" },
                  { key: "cat", label: "Category", type: "text" },
                  { key: "imageUrl", label: "Photo", type: "image" },
                ]} newItem={{ name: "", cc: "", cat: "", imageUrl: "" }} addLabel="Add model" />
            )}

            {active === "modifications" && (
              <div className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <ImageUploader label="Feature Image 1" value={draft.modificationsFeatureImageUrls?.[0]} onChange={(v) => setSection("modificationsFeatureImageUrls", [v, draft.modificationsFeatureImageUrls?.[1] || ""])} testid="mod-feat-1" />
                  <ImageUploader label="Feature Image 2" value={draft.modificationsFeatureImageUrls?.[1]} onChange={(v) => setSection("modificationsFeatureImageUrls", [draft.modificationsFeatureImageUrls?.[0] || "", v])} testid="mod-feat-2" />
                </div>
                <ListEditor items={draft.modifications} onChange={(v) => setSection("modifications", v)} testid="modifications"
                  schema={[{ key: "name", label: "Name", type: "text" }, { key: "desc", label: "Description", type: "textarea" }]} newItem={{ name: "", desc: "" }} addLabel="Add modification" />
              </div>
            )}

            {active === "accessories" && (
              <ListEditor items={draft.accessories} onChange={(v) => setSection("accessories", v)} testid="accessories"
                schema={[{ key: "name", label: "Name", type: "text" }, { key: "imageUrl", label: "Photo", type: "image" }]} newItem={{ name: "", imageUrl: "" }} addLabel="Add accessory" />
            )}

            {active === "gallery" && (
              <ListEditor items={draft.gallery} onChange={(v) => setSection("gallery", v)} testid="gallery"
                schema={[{ key: "tag", label: "Category (e.g. Workshop, Modified Bikes)", type: "text" }, { key: "imageUrl", label: "Photo", type: "image" }]} newItem={{ tag: "Workshop", imageUrl: "" }} addLabel="Add photo" />
            )}

            {active === "reviews" && (
              <ListEditor items={draft.reviews} onChange={(v) => setSection("reviews", v)} testid="reviews"
                schema={[
                  { key: "name", label: "Customer Name", type: "text" },
                  { key: "model", label: "Bike Model", type: "text" },
                  { key: "rating", label: "Rating (1-5)", type: "number" },
                  { key: "text", label: "Review", type: "textarea" },
                ]} newItem={{ name: "", model: "", rating: 5, text: "" }} addLabel="Add review" />
            )}

            {active === "faqs" && (
              <ListEditor items={draft.faqs} onChange={(v) => setSection("faqs", v)} testid="faqs"
                schema={[{ key: "q", label: "Question", type: "text" }, { key: "a", label: "Answer", type: "textarea" }]} newItem={{ q: "", a: "" }} addLabel="Add FAQ" />
            )}

            {active === "media" && (
              <div className="grid gap-5 sm:grid-cols-2">
                <ImageUploader label="Services page header" value={draft.servicesHeaderImageUrl} onChange={(v) => setSection("servicesHeaderImageUrl", v)} testid="media-services" />
                <ImageUploader label="Models page header" value={draft.modelsHeaderImageUrl} onChange={(v) => setSection("modelsHeaderImageUrl", v)} testid="media-models" />
                <ImageUploader label="Modifications page header" value={draft.modificationsHeaderImageUrl} onChange={(v) => setSection("modificationsHeaderImageUrl", v)} testid="media-mods" />
                <ImageUploader label="Accessories page header" value={draft.accessoriesHeaderImageUrl} onChange={(v) => setSection("accessoriesHeaderImageUrl", v)} testid="media-acc" />
                <ImageUploader label="Gallery page header" value={draft.galleryHeaderImageUrl} onChange={(v) => setSection("galleryHeaderImageUrl", v)} testid="media-gallery" />
                <ImageUploader label="Call-to-action banner" value={draft.ctaImageUrl} onChange={(v) => setSection("ctaImageUrl", v)} testid="media-cta" />
              </div>
            )}

            {active === "bookings" && <BookingsPanel />}
            {active === "admins" && <AdminsPanel currentUserId={user?.id} />}
          </div>
        </main>
      </div>
    </div>
  );
}

function BookingsPanel() {
  const [bookings, setBookings] = useState(null);
  const load = async () => {
    try {
      const { data } = await api.get("/bookings");
      setBookings(data);
    } catch (e) {
      toast.error(apiError(e, "Could not load bookings"));
      setBookings([]);
    }
  };
  useEffect(() => { load(); }, []);

  const del = async (id) => {
    if (!window.confirm("Delete this booking?")) return;
    try {
      await api.delete(`/bookings/${id}`);
      setBookings((b) => b.filter((x) => x.id !== id));
      toast.success("Booking deleted");
    } catch (e) { toast.error(apiError(e)); }
  };

  if (bookings === null) return <Loader2 className="h-6 w-6 animate-spin text-[#d4af37]" />;
  if (!bookings.length) return <p className="font-body text-sm text-white/50">No bookings yet. Submissions from the Book Service form will appear here.</p>;

  return (
    <div className="space-y-3" data-testid="bookings-panel">
      {bookings.map((b) => (
        <div key={b.id} className="flex items-start justify-between gap-4 border border-white/10 bg-[#0a0a0a] p-5" data-testid={`booking-${b.id}`}>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="font-display text-lg text-white">{b.name}</span>
              <a href={`tel:${b.phone}`} className="font-body text-sm text-[#d4af37]">{b.phone}</a>
            </div>
            <p className="mt-1 font-body text-sm text-white/60">{b.bike_model} · {b.service} {b.preferred_date ? `· ${b.preferred_date}` : ""}</p>
            {b.message ? <p className="mt-2 font-body text-sm text-white/45">“{b.message}”</p> : null}
            <p className="mt-2 font-body text-[11px] uppercase tracking-widest text-white/25">{new Date(b.created_at).toLocaleString()}</p>
          </div>
          <button onClick={() => del(b.id)} data-testid={`booking-delete-${b.id}`} className="shrink-0 p-2 text-white/40 hover:text-red-400"><Trash2 className="h-4 w-4" /></button>
        </div>
      ))}
    </div>
  );
}

function AdminsPanel({ currentUserId }) {
  const [users, setUsers] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [busy, setBusy] = useState(false);

  const load = async () => {
    try { const { data } = await api.get("/auth/users"); setUsers(data); }
    catch (e) { toast.error(apiError(e)); setUsers([]); }
  };
  useEffect(() => { load(); }, []);

  const add = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { toast.error("Email and password required"); return; }
    setBusy(true);
    try {
      await api.post("/auth/users", form);
      toast.success("Admin added");
      setForm({ name: "", email: "", password: "" });
      load();
    } catch (err) { toast.error(apiError(err)); }
    finally { setBusy(false); }
  };

  const del = async (id) => {
    if (!window.confirm("Remove this admin?")) return;
    try { await api.delete(`/auth/users/${id}`); toast.success("Admin removed"); load(); }
    catch (e) { toast.error(apiError(e)); }
  };

  return (
    <div className="space-y-8" data-testid="admins-panel">
      <form onSubmit={add} className="border border-white/10 bg-[#0a0a0a] p-5">
        <h3 className="mb-4 font-display text-lg text-white">Add a new admin</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} testid="admin-new-name" />
          <Field label="Email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} testid="admin-new-email" />
          <Field label="Password" value={form.password} onChange={(v) => setForm({ ...form, password: v })} testid="admin-new-password" />
        </div>
        <button type="submit" disabled={busy} data-testid="admin-new-submit" className="mt-4 inline-flex items-center gap-2 border border-[#d4af37] bg-[#d4af37] px-4 py-2.5 font-body text-xs uppercase tracking-widest text-black transition-colors hover:bg-transparent hover:text-[#d4af37] disabled:opacity-60">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} Add Admin
        </button>
      </form>

      <div className="space-y-3">
        {users === null ? <Loader2 className="h-6 w-6 animate-spin text-[#d4af37]" /> : users.map((u) => (
          <div key={u.id} className="flex items-center justify-between border border-white/10 bg-[#0a0a0a] p-4" data-testid={`admin-user-${u.id}`}>
            <div>
              <span className="font-display text-base text-white">{u.name || "Admin"}</span>
              <span className="ml-3 font-body text-sm text-white/50">{u.email}</span>
              {u.id === currentUserId && <span className="ml-3 font-body text-[10px] uppercase tracking-widest text-[#d4af37]">You</span>}
            </div>
            {u.id !== currentUserId && (
              <button onClick={() => del(u.id)} data-testid={`admin-user-delete-${u.id}`} className="p-2 text-white/40 hover:text-red-400"><Trash2 className="h-4 w-4" /></button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
