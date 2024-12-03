import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
	skills,
	hobbies,
	aboutMeText,
} from "@/data/aboutMeData";

export default function AboutMe() {
	return (
		<section id="about" className="space-y-6">
			<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl  justify-center flex">
				About Me
			</h2>
			<p className="text-xl text-muted-foreground text-center md:text-left">
				{aboutMeText}
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
							{skills.map((skill, index) => {
								const Icon = skill.icon;
								return (
									<Badge
										key={index}
										variant="secondary"
										className="text-sm py-1 px-2"
									>
										<Icon className="w-4 h-4" />
										<span className="ml-1">{skill.name}</span>
									</Badge>
								);
							})}
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
							{hobbies.map((hobby, index) => {
								const Icon = hobby.icon;
								return (
									<Badge
										key={index}
										variant="outline"
										className="text-sm py-1 px-2"
									>
										<Icon className="w-4 h-4" />
										<span className="ml-1">{hobby.name}</span>
									</Badge>
								);
							})}
						</div>
					</CardContent>
				</Card>
			</div>
		</section>
	);
}
