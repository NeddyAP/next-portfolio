import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
	return (
		<section className="flex flex-col-reverse md:flex-row items-center justify-between gap-8">
			<div className="md:w-1/2 space-y-6">
				<h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
					Your Name
				</h1>
				<p className="text-xl text-muted-foreground">
					Web Developer & Designer crafting elegant digital
					experiences
				</p>
				<Button asChild>
					<a href="#contact">Get in Touch</a>
				</Button>
			</div>
			<div className="md:w-1/2 flex justify-center">
				<Image
					src="/placeholder.svg"
					alt="Your Name"
					width={400}
					height={400}
					className="rounded-full aspect-square object-cover border-4 border-primary"
				/>
			</div>
		</section>
	);
}
