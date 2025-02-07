import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { projects } from "@/data/portfolioData";

export default function Portfolio() {
	return (
		<section id="portfolio" className="space-y-8 px-4 py-8">
			<h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tighter text-center mb-8">
				Portfolio
			</h2>
			<div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
				{projects.map((project, index) => (
					<Card key={index} className="flex flex-col">
						<CardHeader className="p-0">
							<Image
								src={project.image}
								alt={project.title}
								width={400}
								height={200}
								className="w-full h-40 sm:h-48 object-cover rounded-t-lg"
							/>
						</CardHeader>
						<CardContent className="flex-1 p-4 text-center flex flex-col">
							<CardTitle className="text-xl mb-2">
								{project.title}
							</CardTitle>
							<CardDescription className="text-sm mb-4">
								{project.description}
							</CardDescription>
							<div className="flex flex-wrap gap-2 justify-center mt-auto">
								{project.technologies.map((tech, techIndex) => (
									<span
										key={techIndex}
										className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary inline-block"
									>
										{tech}
									</span>
								))}
							</div>
						</CardContent>
						<CardFooter className="justify-center p-4">
							<Button asChild className="w-full sm:w-auto">
								<a
									href={project.link}
									target="_blank"
									rel="noopener noreferrer"
								>
									View Project
								</a>
							</Button>
						</CardFooter>
					</Card>
				))}
			</div>
		</section>
	);
}
