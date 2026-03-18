import { lazy, Suspense, useCallback, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import LandingAnimation from "./components/LandingAnimation";
import Hero from "./sections/Hero";
import LifeCanvas from "./sections/LifeCanvas";
import BentoGrid from "./sections/BentoGrid";
import Projects from "./sections/Projects";
import Skills from "./sections/Skills";
import About from "./sections/About";
import CodingProfiles from "./sections/CodingProfiles";
import Testimonials from "./sections/Testimonials";
import Contact from "./sections/Contact";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import VisitorTracker from "./components/VisitorTracker";

// Lazy-loaded pages (code-split)
const ProjectDetail = lazy(() => import("./pages/ProjectDetail"));
const Blog = lazy(() => import("./pages/Blog"));
const Guestbook = lazy(() => import("./pages/Guestbook"));
const BucketList = lazy(() => import("./pages/BucketList"));
const Recommendations = lazy(() => import("./pages/Recommendations"));
const Admin = lazy(() => import("./pages/Admin"));

const HomePage = () => (
  <>
    <Navbar />
    <main>
      <Hero />
      <About />
      <CodingProfiles />
      <LifeCanvas />
      <BentoGrid />
      <Projects />
      <Skills />
      <Testimonials />
      <Contact />
    </main>
    <Footer />
    <ScrollToTop />
  </>
);
const App = () => {
  const [showLanding, setShowLanding] = useState(true);

  const handleLandingComplete = useCallback(() => {
    setShowLanding(false);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a]">
      {showLanding && <LandingAnimation onComplete={handleLandingComplete} />}
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen text-gray-400 dark:text-white/40">Loading...</div>}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/project/:slug" element={<ProjectDetail />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/guestbook" element={<Guestbook />} />
          <Route path="/bucket-list" element={<BucketList />} />
          <Route path="/recommendations" element={<Recommendations />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Suspense>
      <VisitorTracker />
    </div>
  );
};
export default App;
