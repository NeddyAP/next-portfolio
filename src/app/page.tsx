import AboutMe from "./components/AboutMe";
import Contact from "./components/Contact";
import Education from "./components/Education";
import HeroSection from "./components/HeroSection";
import Portfolio from "./components/Portfolio";
import SpaceBackground from "./components/SpaceBackground";

export default function Home() {
	return (
		<div className="relative min-h-screen">
			<SpaceBackground />

			<div className="container mx-auto px-4 md:px-8 lg:px-16 xl:px-24 space-y-32 md:space-y-48 py-16 md:py-24 relative z-[1]">
				<HeroSection />
				<AboutMe />
				<Education />
				<Portfolio />
				<Contact />
			</div>
		</div>
	);
}
