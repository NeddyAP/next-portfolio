import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Award, Briefcase } from "lucide-react";

export default function Education() {
	const educationItems = [
		{
			title: "Bachelor of Science in Computer Science",
			institution: "University Name",
			period: "2016 - 2020",
			details:
				"Relevant coursework: Data Structures, Algorithms, Web Development, Database Systems",
			icon: <GraduationCap className="w-6 h-6" />,
		},
		{
			title: "Full Stack Web Development Bootcamp",
			institution: "Coding Academy",
			period: "2021",
			details:
				"Intensive 12-week program covering modern web technologies and best practices",
			icon: <Award className="w-6 h-6" />,
		},
		{
			title: "Professional Development",
			institution: "Various Online Platforms",
			period: "2021 - Present",
			details:
				"Continuous learning through online courses, workshops, and industry conferences",
			icon: <Briefcase className="w-6 h-6" />,
		},
	];

	return (
		<section id="education" className="space-y-6">
			<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center md:text-left">
				Education
			</h2>
			<div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
				{educationItems.map((item, index) => (
					<div
						key={index}
						className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
					>
						<div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-300 group-[.is-active]:bg-emerald-500 text-slate-500 group-[.is-active]:text-emerald-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
							{item.icon}
						</div>
						<div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white dark:bg-slate-800 p-4 rounded shadow">
							<Card className="text-center md:text-left">
								<CardHeader>
									<CardTitle>{item.title}</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="font-semibold">
										{item.institution}
									</p>
									<p className="text-sm text-muted-foreground">
										{item.period}
									</p>
									<p className="mt-2">{item.details}</p>
								</CardContent>
							</Card>
						</div>
					</div>
				))}
			</div>
		</section>
	);
}
