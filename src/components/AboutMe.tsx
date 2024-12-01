import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
	Lightbulb,
	Code,
	Server,
	Rocket,
	Book,
	Music,
	Film,
} from "lucide-react";

export default function AboutMe() {
	const skills = [
		{ name: "JavaScript & PHP", icon: <Code className="w-4 h-4" /> },
		{ name: "React & Next.js", icon: <Rocket className="w-4 h-4" /> },
		{ name: "Node.js & Laravel", icon: <Server className="w-4 h-4" /> },
		{ name: "Problem Solving", icon: <Lightbulb className="w-4 h-4" /> },
	];

	const hobbies = [
		{ name: "Music", icon: <Music className="w-4 h-4" /> },
		{ name: "Comic Reading", icon: <Book className="w-4 h-4" /> },
		{ name: "Watch Movie", icon: <Film className="w-4 h-4" /> },
	];

	return (
		<section id="about" className="space-y-6">
			<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl  justify-center flex">
				About Me
			</h2>
			<p className="text-xl text-muted-foreground text-center md:text-left">
				I&apos;m a passionate web developer with a keen eye for design
				and a love for creating intuitive, user-friendly interfaces.
				With expertise in modern web technologies, I strive to build
				performant and scalable applications that make a difference.
			</p>
			<div className="grid gap-6 md:grid-cols-2">
				<Card className="text-center md:text-left">
					<CardHeader>
						<CardTitle>Skills</CardTitle>
						<CardDescription>
							Technologies and abilities I&apos;ve mastered
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="flex flex-wrap gap-2">
							{skills.map((skill, index) => (
								<Badge
									key={index}
									variant="secondary"
									className="text-sm py-1 px-2"
								>
									{skill.icon}
									<span className="ml-1">{skill.name}</span>
								</Badge>
							))}
						</div>
					</CardContent>
				</Card>
				<Card className="text-center md:text-left">
					<CardHeader>
						<CardTitle>Hobbies</CardTitle>
						<CardDescription>
							What I enjoy in my free time
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="flex flex-wrap gap-2">
							{hobbies.map((hobby, index) => (
								<Badge
									key={index}
									variant="outline"
									className="text-sm py-1 px-2"
								>
									{hobby.icon}
									<span className="ml-1">{hobby.name}</span>
								</Badge>
							))}
						</div>
					</CardContent>
				</Card>
			</div>
		</section>
	);
}
