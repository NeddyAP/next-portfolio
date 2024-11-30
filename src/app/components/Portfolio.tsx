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

const projects = [
	{
		title: "E-commerce Platform",
		description:
			"A full-stack e-commerce solution built with Next.js and Stripe integration.",
		image: "/placeholder.svg",
		link: "https://github.com/yourusername/ecommerce-platform",
	},
	{
		title: "Task Management App",
		description:
			"A React-based task management application with drag-and-drop functionality.",
		image: "/placeholder.svg",
		link: "https://github.com/yourusername/task-management-app",
	},
	{
		title: "Weather Dashboard",
		description:
			"A weather dashboard built with React, utilizing a third-party weather API.",
		image: "/placeholder.svg",
		link: "https://github.com/yourusername/weather-dashboard",
	},
];

export default function Portfolio() {
	return (
		<section id="portfolio" className="space-y-6">
			<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
				Portfolio
			</h2>
			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{projects.map((project, index) => (
					<Card key={index}>
						<CardHeader>
							<Image
								src={project.image}
								alt={project.title}
								width={400}
								height={200}
								className="w-full h-48 object-cover rounded-t-lg"
							/>
						</CardHeader>
						<CardContent>
							<CardTitle>{project.title}</CardTitle>
							<CardDescription>
								{project.description}
							</CardDescription>
						</CardContent>
						<CardFooter>
							<Button asChild>
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
