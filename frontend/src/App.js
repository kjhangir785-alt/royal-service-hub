import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import SmoothScroll from "@/components/site/SmoothScroll";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import FloatingActions from "@/components/site/FloatingActions";

import Home from "@/pages/Home";
import About from "@/pages/About";
import Services from "@/pages/Services";
import Models from "@/pages/Models";
import Modifications from "@/pages/Modifications";
import Accessories from "@/pages/Accessories";
import Gallery from "@/pages/Gallery";
import BookService from "@/pages/BookService";
import Contact from "@/pages/Contact";

function App() {
  return (
    <div className="App grain">
      <BrowserRouter>
        <SmoothScroll>
          <Navbar />
          <main className="relative z-10">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/models" element={<Models />} />
              <Route path="/modifications" element={<Modifications />} />
              <Route path="/accessories" element={<Accessories />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/book" element={<BookService />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </main>
          <Footer />
          <FloatingActions />
          <Toaster
            position="top-center"
            theme="dark"
            toastOptions={{
              style: {
                background: "#111111",
                border: "1px solid rgba(212,175,55,0.3)",
                color: "#f5f5f5",
              },
            }}
          />
        </SmoothScroll>
      </BrowserRouter>
    </div>
  );
}

export default App;
