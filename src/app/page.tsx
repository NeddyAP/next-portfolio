import AboutMe from "./components/AboutMe";
import Contact from "./components/Contact";
import Education from "./components/Education";
import HeroSection from "./components/HeroSection";
import Portfolio from "./components/Portfolio";

export default function Home() {
	return (
		<div className="container mx-auto px-4 space-y-24 py-24">
			<HeroSection />
			<AboutMe />
			<Education />
			<Portfolio />
			<Contact />
		</div>
	);
}
