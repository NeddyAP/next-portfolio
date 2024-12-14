import Experience from "@/components/Experience";
import AboutMe from "@/components/AboutMe";
import Contact from "@/components/Contact";
import HeroSection from "@/components/HeroSection";
import Portfolio from "@/components/Portfolio";
import Certificate from "@/components/Certificate";

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <div className="container mx-auto px-4 md:px-8 lg:px-16 xl:px-24 space-y-32 md:space-y-48 py-16 md:py-24 relative z-[1]">
        <HeroSection />
        <AboutMe />
        <Experience />
        <Certificate />
        <Portfolio />
        <Contact />
      </div>
    </div>
  );
}
