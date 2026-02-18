import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./sections/Hero";
import BentoGrid from "./sections/BentoGrid";
import Projects from "./sections/Projects";
import Skills from "./sections/Skills";
import About from "./sections/About";
import Testimonials from "./sections/Testimonials";
import Contact from "./sections/Contact";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import ProjectDetail from "./pages/ProjectDetail";
import Blog from "./pages/Blog";
import Guestbook from "./pages/Guestbook";
import BucketList from "./pages/BucketList";
import Recommendations from "./pages/Recommendations";
import Admin from "./pages/Admin";
import VisitorTracker from "./components/VisitorTracker";

const HomePage = () => (
  <>
    <Navbar />
    <main>
      <Hero />
      <BentoGrid />
      <Projects />
      <Skills />
      <About />
      <Testimonials />
      <Contact />
    </main>
    <Footer />
    <ScrollToTop />
  </>
);

const App = () => {
  return (
    <div className="relative min-h-screen bg-dark">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/project/:slug" element={<ProjectDetail />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/guestbook" element={<Guestbook />} />
        <Route path="/bucket-list" element={<BucketList />} />
        <Route path="/recommendations" element={<Recommendations />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
      <VisitorTracker />
    </div>
  );
};

export default App;
