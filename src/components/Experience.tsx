"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database } from "@/types/supabase"; // Import Supabase types
import { getIcon } from "@/lib/iconMap"; // Import the icon mapper
import { Briefcase, GraduationCap, HelpCircle } from "lucide-react"; // Default icons

// Define props for the component
interface ExperienceProps {
	experienceData: Database["public"]["Tables"]["experiences"]["Row"][] | null;
}

// Helper function to format date range
const formatDateRange = (
	startDate: string | null,
	endDate: string | null
): string => {
	if (!startDate) return "Date not specified";

	const options: Intl.DateTimeFormatOptions = {
		year: "numeric",
		month: "long",
	};
	const start = new Date(startDate).toLocaleDateString("en-US", options);

	if (!endDate) return `${start} - Present`;

	const end = new Date(endDate).toLocaleDateString("en-US", options);
	return `${start} - ${end}`;
};

export default function Experience({ experienceData }: ExperienceProps) {
	if (!experienceData || experienceData.length === 0) {
		return (
			<section id="experience" className="space-y-6">
				<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl justify-center flex">
					Experience
				</h2>
				<p className="text-muted-foreground text-center">
					Loading experience information or no experience to
					display...
				</p>
			</section>
		);
	}

	// Sort experiences by start_date in descending order (most recent first)
	// or by display_order if available
	const sortedExperienceData = [...experienceData].sort((a, b) => {
		if (a.display_order !== null && b.display_order !== null) {
			return a.display_order - b.display_order;
		}
		// Fallback to date sorting if display_order is not set for all items
		const dateA = a.start_date ? new Date(a.start_date).getTime() : 0;
		const dateB = b.start_date ? new Date(b.start_date).getTime() : 0;
		return dateB - dateA; // Sorts recent first
	});

	return (
		<section id="experience" className="space-y-6">
			<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl justify-center flex">
				Experience
			</h2>
			<div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
				{sortedExperienceData.map((item, index) => {
					let IconComponent = getIcon(item.icon_name);
					if (!IconComponent) {
						// Fallback icon logic based on title or type if needed
						if (
							item.job_title?.toLowerCase().includes("student") ||
							item.job_title?.toLowerCase().includes("university")
						) {
							IconComponent = GraduationCap;
						} else if (
							item.job_title?.toLowerCase().includes("intern") ||
							item.job_title
								?.toLowerCase()
								.includes("developer") ||
							item.job_title?.toLowerCase().includes("support")
						) {
							IconComponent = Briefcase;
						} else {
							IconComponent = HelpCircle; // Default fallback
						}
					}

					const period = formatDateRange(
						item.start_date,
						item.end_date
					);

					return (
						<motion.div
							key={item.id} // Use database ID as key
							className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
							initial={{
								opacity: 0,
								x: index % 2 === 0 ? 50 : -50,
							}}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5, delay: index * 0.1 }}
						>
							<div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-300 group-[.is-active]:bg-emerald-500 text-slate-500 group-[.is-active]:text-emerald-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
								{IconComponent && (
									<IconComponent className="w-6 h-6" />
								)}
							</div>
							<div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white dark:bg-slate-800 p-4 rounded shadow">
								<Card className="transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-lg">
									<CardHeader>
										<CardTitle>
											{item.company_name}
										</CardTitle>
									</CardHeader>
									<CardContent>
										<p className="font-normal">
											{item.job_title}
										</p>
										<p className="text-sm text-muted-foreground">
											{period}
										</p>
										{item.description && (
											<p className="mt-2 text-sm text-muted-foreground">
												{" "}
												{/* Adjusted styling for description */}
												{item.description}
											</p>
										)}
									</CardContent>
								</Card>
							</div>
						</motion.div>
					);
				})}
			</div>
		</section>
	);
}
