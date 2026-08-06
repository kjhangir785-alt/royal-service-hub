import { useEffect } from "react";

export default function SEO({ title, description, path = "" }) {
  useEffect(() => {
    const full = title
      ? `${title} | The Bullet Zone — Royal Enfield Workshop Gachibowli`
      : "The Bullet Zone — Royal Enfield Service, Repairs & Modification | Gachibowli, Hyderabad";
    document.title = full;

    const setMeta = (attr, key, content) => {
      let el = document.head.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    if (description) {
      setMeta("name", "description", description);
      setMeta("property", "og:description", description);
    }
    setMeta("property", "og:title", full);
    setMeta("property", "og:type", "website");

    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", `https://thebulletzone.in${path}`);
  }, [title, description, path]);

  return null;
}
