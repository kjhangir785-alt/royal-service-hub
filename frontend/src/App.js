import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";

import { ContentProvider } from "@/context/ContentContext";
import { AuthProvider } from "@/context/AuthContext";
import SiteLayout from "@/components/site/SiteLayout";
import ProtectedRoute from "@/components/admin/ProtectedRoute";

import Home from "@/pages/Home";
import About from "@/pages/About";
import Services from "@/pages/Services";
import Models from "@/pages/Models";
import Modifications from "@/pages/Modifications";
import Accessories from "@/pages/Accessories";
import Gallery from "@/pages/Gallery";
import BookService from "@/pages/BookService";
import Contact from "@/pages/Contact";
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminDashboard from "@/pages/admin/AdminDashboard";

function App() {
  return (
    <div className="App grain">
      <ContentProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<SiteLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<Services />} />
                <Route path="/models" element={<Models />} />
                <Route path="/modifications" element={<Modifications />} />
                <Route path="/accessories" element={<Accessories />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/book" element={<BookService />} />
                <Route path="/contact" element={<Contact />} />
              </Route>
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            </Routes>
            <Toaster
              position="top-center"
              theme="dark"
              toastOptions={{
                style: { background: "#111111", border: "1px solid rgba(212,175,55,0.3)", color: "#f5f5f5" },
              }}
            />
          </BrowserRouter>
        </AuthProvider>
      </ContentProvider>
    </div>
  );
}

export default App;
