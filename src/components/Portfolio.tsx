"use client";

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
import { motion } from "framer-motion";
import type { Tables } from "@/types/supabase";
import { FiExternalLink, FiGithub } from "react-icons/fi";

interface PortfolioProps {
	projectsData: Tables<"projects">[];
}

export default function Portfolio({ projectsData }: PortfolioProps) {
	if (!projectsData || projectsData.length === 0) {
		return (
			<section id="portfolio" className="space-y-8 px-4 py-8">
				<h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tighter text-center mb-8">
					Portfolio
				</h2>
				<p className="text-center text-muted-foreground">
					No projects to display at the moment.
				</p>
			</section>
		);
	}

	return (
		<section id="portfolio" className="space-y-8 px-4 py-8">
			<h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tighter text-center mb-8">
				Portfolio
			</h2>
			<div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
				{projectsData.map((project, index) => (
					<motion.div
						key={project.id || index} // Use project.id if available, otherwise fallback to index
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.3, delay: index * 0.1 }}
					>
						<Card className="flex flex-col transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-lg h-full">
							<CardHeader className="p-0">
								{project.image_url && (
									<Image
										src={project.image_url} // Use image_url from Supabase
										alt={project.title || "Project image"}
										width={400}
										height={200}
										className="w-full h-40 sm:h-48 object-cover rounded-t-lg"
										priority={index < 3} // Prioritize loading for the first few images
									/>
								)}
							</CardHeader>
							<CardContent className="flex-1 p-4 text-center flex flex-col">
								<CardTitle className="text-xl mb-2">
									{project.title}
								</CardTitle>
								<CardDescription className="text-sm mb-4 flex-grow">
									{" "}
									{/* Added flex-grow to allow description to take space */}
									{project.description}
								</CardDescription>
								<div className="flex flex-wrap gap-2 justify-center mt-auto pt-4">
									{" "}
									{/* Added pt-4 for spacing */}
									{project.technologies &&
										project.technologies.map(
											(tech, techIndex) => (
												<span
													key={techIndex}
													className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary inline-block"
												>
													{tech}
												</span>
											)
										)}
								</div>
							</CardContent>
							{/* ... */}

							<CardFooter className="justify-center p-4">
								<div className="flex flex-wrap gap-2 justify-center">
									{project.project_link && (
										<Button
											asChild
											className="w-full sm:w-auto"
										>
											<a
												href={project.project_link}
												target="_blank"
												rel="noopener noreferrer"
												className="flex items-center justify-center"
											>
												<FiExternalLink className="mr-2 h-4 w-4" />
												View Demo
											</a>
										</Button>
									)}
									{project.source_code_link && (
										<Button
											variant="outline"
											asChild
											className="w-full sm:w-auto"
										>
											<a
												href={project.source_code_link}
												target="_blank"
												rel="noopener noreferrer"
												className="flex items-center justify-center"
											>
												<FiGithub className="mr-2 h-4 w-4" />
												View Source
											</a>
										</Button>
									)}
								</div>
							</CardFooter>
						</Card>
					</motion.div>
				))}
			</div>
		</section>
	);
}
