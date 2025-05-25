"use client";

import { Database } from "@/types/supabase";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

// Define props for the component
interface ContactProps {
	aboutData: Database["public"]["Tables"]["about_me"]["Row"] | null;
}

export default function Contact({ aboutData }: ContactProps) {
	return (
		<section id="contact" className="py-12 md:py-16 lg:py-20">
			<div className="container mx-auto px-4 md:px-6 text-center">
				<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-slate-900 dark:text-slate-100 mb-12">
					Contact Me
				</h2>

				<Card className="max-w-lg mx-auto shadow-lg">
					<CardHeader className="text-center">
						<CardTitle className="text-2xl">Get in Touch</CardTitle>
						<CardDescription className="pt-2">
							I&apos;m always open to discussing new projects,
							creative ideas, or opportunities. Feel free to reach
							out directly.
						</CardDescription>
					</CardHeader>
					<CardContent className="pt-2 pb-6">
						<div className="space-y-4">
							{aboutData?.contact_email && (
								<div className="flex items-center justify-center space-x-3 text-lg py-2 px-4 rounded-md border border-transparent hover:border-primary/20 hover:bg-primary/5 transition-colors duration-200">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
										className="h-6 w-6 text-primary flex-shrink-0"
									>
										<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
										<polyline points="22,6 12,13 2,6"></polyline>
									</svg>
									<a
										href={`mailto:${aboutData.contact_email}`}
										className="text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary hover:underline break-all"
									>
										{aboutData.contact_email}
									</a>
								</div>
							)}
							{/* Phone number section removed as it's not in the about_me table schema */}
							{!aboutData?.contact_email && ( // Check only for contact_email now
								<p className="text-slate-500 dark:text-slate-500">
									Contact email will be available soon.
								</p>
							)}
						</div>
						<p className="mt-8 text-slate-500 dark:text-slate-500 text-sm">
							Looking forward to hearing from you!
						</p>
					</CardContent>
				</Card>
			</div>
		</section>
	);
}
