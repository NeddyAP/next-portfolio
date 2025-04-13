import Image from "next/image";
import profileImage from "@/assets/profile-img.png";

export default function HeroSection() {
	return (
		<section className="flex items-center justify-center relative py-20 md:py-32"> {/* Adjusted padding */}
			<div className="	 mx-auto px-4">
				<div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-12">
					<div className="lg:w-1/2 space-y-8 text-center lg:text-left">
						<h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60 dark:from-white dark:to-white/60 py-4">
							Neddy Avgha Prasetio
						</h1>
						<p className="text-xl text-muted-foreground max-w-[600px]">
							Web Developer & IT Support
						</p>
					</div>

					<div className="lg:w-1/2 flex justify-center items-center">
						<div className="relative w-48 h-48 sm:w-64 sm:h-64 lg:w-96 lg:h-96">
							<Image
								src={profileImage}
								alt="Neddy Avgha Prasetio profile picture"
								fill
								sizes="(max-width: 640px) 12rem, (max-width: 1024px) 16rem, 24rem"
								className="rounded-full object-cover border-4 border-primary dark:border-white/20"
								priority
							/>
							<div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/10 to-transparent dark:from-white/10" />
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
