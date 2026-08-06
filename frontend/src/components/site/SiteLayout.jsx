import { Outlet } from "react-router-dom";
import SmoothScroll from "@/components/site/SmoothScroll";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import FloatingActions from "@/components/site/FloatingActions";

export default function SiteLayout() {
  return (
    <SmoothScroll>
      <Navbar />
      <main className="relative z-10">
        <Outlet />
      </main>
      <Footer />
      <FloatingActions />
    </SmoothScroll>
  );
}
