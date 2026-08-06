# The Bullet Zone — PRD

## Original Problem Statement
Premium, mobile-first luxury website for "The Bullet Zone", a professional Royal Enfield workshop in Gachibowli, Hyderabad. Black/charcoal/metallic-gold/white theme, smooth animations, high-quality motorcycle visuals, SEO optimized. Owner: Mohammed Ayub. Phone/WhatsApp: +91 8247730083.

## Architecture
- **Frontend**: React 19 + React Router, Tailwind, framer-motion (scroll reveals, kinetic hero, parallax), lenis (smooth scroll), react-fast-marquee, shadcn/ui, lucide-react icons, sonner toasts.
- **Backend**: FastAPI + MongoDB (motor). Routes prefixed `/api`.
- **Design**: dark luxury (#050505 base, #d4af37 gold), Clash Display + Manrope fonts, grain overlay, sharp-edged buttons.

## Pages (9)
Home, About, Services (21), Models (11), Modifications (12), Accessories (12), Gallery (filterable), Book Service, Contact (Google Maps embed).

## Core Requirements (static)
- Sticky nav, floating WhatsApp + Call buttons, click-to-call, WhatsApp deep links.
- Book Service form → saves to Mongo + opens pre-filled WhatsApp to owner.
- Customer reviews (5-star), FAQ accordion.
- SEO: meta tags, keywords, JSON-LD AutoRepair schema, per-page titles/descriptions/canonical.

## Implemented (2026-06)
- All 9 pages built and verified.
- Backend: `POST /api/bookings`, `GET /api/bookings` (admin view) — tested via curl, working.
- Kinetic hero with masked line reveal + scroll parallax; editorial marquee; numbered manifesto chapters.
- Booking form → DB + WhatsApp prefill verified; Contact page keyless Google Maps embed.
- Images: royalty-free Unsplash stock (user will replace with own later).
- Reviews & FAQ use professional sample content (user to provide real ones later).

## Backlog / Remaining
- P1: Replace stock images + sample reviews with client-provided assets.
- P2: Admin dashboard UI to view bookings (currently API-only).
- P2: Real map API key for richer map, email notifications on booking.

## Next Tasks
- Swap in real photos and testimonials when provided.
