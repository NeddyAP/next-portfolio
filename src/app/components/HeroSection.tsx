import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
	return (
		<section className="relative">
			{/* Space Background Pattern */}
			<div className="absolute inset-0 -z-10">
				<div className="absolute inset-0 bg-grid-small-white/[0.2] dark:bg-grid-small-white/[0.1]" />
				<div className="absolute h-full w-full bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />

				{/* Animated stars/particles */}
				<div className="absolute inset-0 overflow-hidden">
					<div className="stars-small" />
					<div className="stars-medium" />
					<div className="stars-large" />
				</div>

				{/* Gradient overlay */}
				<div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
			</div>

			{/* Content */}
			<div className="flex flex-col-reverse md:flex-row items-center justify-between gap-8 pt-8">
				<div className="md:w-1/2 space-y-6 text-center md:text-left">
					<h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
						Neddy Avgha Prasetio
					</h1>
					<p className="text-xl text-muted-foreground">
						Web Developer & IT Support
					</p>
					<div className="flex justify-center md:justify-start">
						<Button asChild>
							<a href="#contact">Get in Touch</a>
						</Button>
					</div>
				</div>
				<div className="w-full md:w-1/2 flex justify-center items-center px-4">
					<div className="relative w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80">
						<Image
							src="/placeholder.svg"
							alt="Neddy"
							fill
							className="rounded-full object-cover border-4 border-primary"
						/>
					</div>
				</div>
			</div>

			{/* Additional decorative elements */}
			<div
				className="absolute inset-x-0 -z-10 transform-gpu overflow-hidden blur-3xl top-[calc(100%-30rem)]"
				aria-hidden="true"
			>
				<div
					className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-primary to-secondary opacity-30"
					style={{
						clipPath:
							"polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
					}}
				/>
			</div>
		</section>
	);
}
