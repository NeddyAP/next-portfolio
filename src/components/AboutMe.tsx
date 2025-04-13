"use client";

import {
	aboutInfo,
	skillset,
	tools,
	githubUsername,
	aboutMeText,
	hobbies,
} from "@/data/aboutMeData";
import { motion } from "framer-motion";
import GitHubCalendar from "react-github-calendar";
import { Badge } from "@/components/ui/badge";

export default function AboutMe() {
	return (
		<section id="about" className="space-y-8">
			<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl justify-center flex">
				About Me
			</h2>
			<div className="space-y-6">
				<p className="text-muted-foreground">{aboutMeText}</p>
				<div className="flex flex-wrap justify-center gap-2">
					{hobbies.map((hobby, index) => (
						<Badge
							key={index}
							variant="secondary"
							className="text-sm py-1.5 px-3 flex items-center gap-2"
						>
							<hobby.icon className="text-primary h-4 w-4" />
							{hobby.name}
						</Badge>
					))}
				</div>
				<div className="space-y-1">
					<p className="text-primary italic">
						&quot;{aboutInfo.quote.text}&quot;
					</p>
					<footer className="text-sm text-muted-foreground">
						- {aboutInfo.quote.author}
					</footer>
				</div>
			</div>

			<div className="space-y-32">
				{/* Removed outer motion.div */}
				<div className="space-y-4">
					<h2 className="text-2xl font-bold text-center">
						Professional{" "}
						<span className="text-primary">Skillset</span>
					</h2>
					<div className="grid grid-cols-2 md:grid-cols-5 gap-4">
						{skillset.map((skill, index) => (
							<motion.div
								key={index}
								className="group relative flex items-center justify-center p-4 rounded-lg bg-gray-800 bg-opacity-25 hover:bg-accent transition-colors text-4xl"
								title={skill.name}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{
									duration: 0.3,
									delay: index * 0.05,
								}}
							>
								<skill.icon />
								<span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
									{skill.name}
								</span>
							</motion.div>
						))}
					</div>
				</div>
				{/* Removed outer motion.div */}
				<div className="space-y-4">
					<h2 className="text-2xl font-bold text-center">
						Tools &{" "}
						<span className="text-primary">Technologies</span>
					</h2>
					<div className="grid grid-cols-2 md:grid-cols-5 gap-4">
						{tools.map((tool, index) => (
							<motion.div
								key={index}
								className="group relative flex items-center justify-center p-4 rounded-lg bg-gray-800 bg-opacity-25 hover:bg-accent transition-colors text-4xl"
								title={tool.name}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{
									duration: 0.3,
									delay: index * 0.05,
								}}
							>
								<tool.icon />
								<span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
									{tool.name}
								</span>
							</motion.div>
						))}
					</div>
				</div>
				{/* Kept outer motion.div for GitHub Calendar as it's a single item */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5, delay: 0.4 }}
					className="space-y-4"
				>
					<h2 className="text-2xl font-bold text-center">
						Days I <span className="text-primary">Code</span>
					</h2>
					<div className="flex justify-center">
						<GitHubCalendar
							username={githubUsername}
							blockSize={15}
							blockMargin={5}
							fontSize={16}
						/>
					</div>
				</motion.div>{" "}
				{/* Corrected: Added closing tag */}
			</div>
		</section>
	);
}
