import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import WeeklyUpdates from "./pages/WeeklyUpdates";
import Gallery from "./pages/Gallery";
import Sermons from "./pages/Sermons";
import Donate from "./pages/Donate";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";

function App() {
  return (
    <HelmetProvider>
        <BrowserRouter>
          <div className="min-h-screen flex flex-col bg-slate-50">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/weekly-updates" element={<WeeklyUpdates />} />
                <Route path="/about" element={<About />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/sermons" element={<Sermons />} />
                <Route path="/donate" element={<Donate />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/admin" element={<Admin />} />
              </Routes>
            </main>
            <Footer />
          </div>
          <ToastContainer position="bottom-right" />
        </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
