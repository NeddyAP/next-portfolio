"use client";

import { useState } from "react"; // Added
import { useRouter } from "next/navigation"; // Added for router.refresh()
import { motion } from "framer-motion";
import GitHubCalendar from "react-github-calendar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button"; // Added
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
	SheetDescription,
	// SheetFooter, // Not used yet
	// SheetClose, // Not used yet
} from "@/components/ui/sheet"; // Added
import { Edit } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import EditAboutMeForm from "@/components/EditAboutMeForm";
import EditSkillsetForm, { type Skill } from "@/components/EditSkillsetForm"; // Added
import EditToolsForm, { type Tool } from "@/components/EditToolsForm"; // Added
import { Database } from "@/types/supabase"; // Removed Json
import { getIcon } from "@/lib/iconMap";
import { useToast } from "@/hooks/use-toast"; // Added

// Define the expected structure for hobbies, skillset, and tools from Supabase (JSONB)
interface IconWithName {
	name: string;
	icon_name: string;
	order?: number; // Added for skillset and tools ordering
}

interface Quote {
	text: string;
	author: string;
}

// Define props for the component
interface AboutMeProps {
	aboutData: Database["public"]["Tables"]["about_me"]["Row"] | null;
	// onAboutMeUpdate: () => void; // Removed callback
}

export default function AboutMe({ aboutData }: AboutMeProps) {
	const { user } = useAuth();
	const [isEditAboutMeSheetOpen, setIsEditAboutMeSheetOpen] = useState(false); // Renamed
	const [isEditSkillsetSheetOpen, setIsEditSkillsetSheetOpen] =
		useState(false); // Added
	const [isEditToolsSheetOpen, setIsEditToolsSheetOpen] = useState(false); // Added
	const router = useRouter();
	const { toast } = useToast(); // Added

	if (!aboutData) {
		return (
			<section id="about" className="space-y-8">
				<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl justify-center flex">
					About Me
				</h2>
				<p className="text-muted-foreground text-center">
					Loading about me information...
				</p>
			</section>
		);
	}

	// Type assertion for hobbies, skillset, tools, and quote
	const hobbies =
		(aboutData.hobbies as unknown as IconWithName[] | null) || [];

	const rawSkillset =
		(aboutData.skillset as unknown as IconWithName[] | null) || [];
	const skillset = rawSkillset.slice().sort((a, b) => {
		const orderA = typeof a.order === "number" ? a.order : Infinity;
		const orderB = typeof b.order === "number" ? b.order : Infinity;
		if (orderA === Infinity && orderB === Infinity) {
			// if both lack order, maintain original relative order or sort by name
			return rawSkillset.indexOf(a) - rawSkillset.indexOf(b); // Fallback to original index if no order
		}
		return orderA - orderB;
	});

	const rawTools =
		(aboutData.tools as unknown as IconWithName[] | null) || [];
	const tools = rawTools.slice().sort((a, b) => {
		const orderA = typeof a.order === "number" ? a.order : Infinity;
		const orderB = typeof b.order === "number" ? b.order : Infinity;
		if (orderA === Infinity && orderB === Infinity) {
			return rawTools.indexOf(a) - rawTools.indexOf(b); // Fallback to original index if no order
		}
		return orderA - orderB;
	});

	const quote = aboutData.quote as unknown as Quote | null;
	const githubUsername = aboutData.github_url
		? aboutData.github_url.split("/").pop()
		: "";

	return (
		<section id="about" className="space-y-8">
			<div className="flex justify-between items-center mb-4">
				{" "}
				{/* Added mb-4 for spacing */}
				<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
					About Me
				</h2>
				{user && (
					<Sheet
						open={isEditAboutMeSheetOpen}
						onOpenChange={setIsEditAboutMeSheetOpen}
					>
						<SheetTrigger asChild>
							<Button
								variant="outline"
								size="icon"
								title="Edit General Information"
							>
								<Edit className="h-4 w-4" />
								<span className="sr-only">Edit About Me</span>
							</Button>
						</SheetTrigger>
						<SheetContent
							side="left"
							className="sm:max-w-md w-full md:w-[500px] overflow-y-auto"
						>
							{" "}
							{/* Adjusted width and overflow */}
							<SheetHeader className="mb-4">
								{" "}
								{/* Added margin */}
								<SheetTitle>Edit About Me</SheetTitle>
								<SheetDescription>
									Update your personal information. Click save
									when you&apos;re done.
								</SheetDescription>
							</SheetHeader>
							<EditAboutMeForm
								currentData={aboutData}
								onSave={() => {
									setIsEditAboutMeSheetOpen(false);
									router.refresh();
								}}
								onCancel={() =>
									setIsEditAboutMeSheetOpen(false)
								}
							/>
						</SheetContent>
					</Sheet>
				)}
			</div>
			<div className="space-y-6">
				<p className="text-muted-foreground">
					{aboutData.bio || "Bio not available."}
				</p>
				<div className="flex flex-wrap justify-center gap-2">
					{hobbies.map((hobby, index) => {
						const IconComponent = getIcon(hobby.icon_name);
						return (
							<Badge
								key={index}
								variant="secondary"
								className="text-sm py-1.5 px-3 flex items-center gap-2"
							>
								{IconComponent && (
									<IconComponent className="text-primary h-4 w-4" />
								)}
								{hobby.name}
							</Badge>
						);
					})}
				</div>
				{quote && (
					<div className="space-y-1">
						<p className="text-primary italic">
							&quot;{quote.text}&quot;
						</p>
						<footer className="text-sm text-muted-foreground">
							- {quote.author}
						</footer>
					</div>
				)}
			</div>

			<div className="space-y-32">
				{/* Professional Skillset Section */}
				<div className="space-y-4">
					<div className="flex justify-center items-center gap-4">
						<h2 className="text-2xl font-bold text-center">
							Professional{" "}
							<span className="text-primary">Skillset</span>
						</h2>
						{user && (
							<Sheet
								open={isEditSkillsetSheetOpen}
								onOpenChange={setIsEditSkillsetSheetOpen}
							>
								<SheetTrigger asChild>
									<Button
										variant="outline"
										size="icon"
										title="Edit Skillset"
									>
										<Edit className="h-4 w-4" />
									</Button>
								</SheetTrigger>
								<SheetContent
									side="left"
									className="sm:max-w-md w-full md:w-[500px] overflow-y-auto"
								>
									<SheetHeader className="mb-4">
										<SheetTitle>Edit Skillset</SheetTitle>
										<SheetDescription>
											Update your professional skills.
											Click save when you&apos;re done.
										</SheetDescription>
									</SheetHeader>
									<EditSkillsetForm
										currentSkillset={skillset as Skill[]}
										onSave={async (updatedSkillset) => {
											if (!aboutData?.user_id) return;
											try {
												const response = await fetch(
													"/api/about-me",
													{
														method: "PUT",
														headers: {
															"Content-Type":
																"application/json",
														},
														body: JSON.stringify({
															user_id:
																aboutData.user_id,
															skillset:
																updatedSkillset,
														}),
														credentials: "include",
													}
												);
												if (!response.ok)
													throw new Error(
														"Failed to save skillset"
													);
												toast({
													title: "Success",
													description:
														"Skillset updated.",
												});
												setIsEditSkillsetSheetOpen(
													false
												);
												router.refresh();
											} catch (error: unknown) {
												let errorMessage =
													"Failed to save skillset.";
												if (error instanceof Error) {
													errorMessage =
														error.message;
												}
												toast({
													title: "Error",
													description: errorMessage,
													variant: "destructive",
												});
											}
										}}
										onCancel={() =>
											setIsEditSkillsetSheetOpen(false)
										}
									/>
								</SheetContent>
							</Sheet>
						)}
					</div>
					<div className="grid grid-cols-2 md:grid-cols-5 gap-4">
						{skillset.map((skill, index) => {
							const IconComponent = getIcon(skill.icon_name);
							return (
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
									{IconComponent && <IconComponent />}
									<span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
										{skill.name}
									</span>
								</motion.div>
							);
						})}
					</div>
				</div>

				{/* Tools & Technologies Section */}
				<div className="space-y-4">
					<div className="flex justify-center items-center gap-4">
						<h2 className="text-2xl font-bold text-center">
							Tools &{" "}
							<span className="text-primary">Technologies</span>
						</h2>
						{user && (
							<Sheet
								open={isEditToolsSheetOpen}
								onOpenChange={setIsEditToolsSheetOpen}
							>
								<SheetTrigger asChild>
									<Button
										variant="outline"
										size="icon"
										title="Edit Tools"
									>
										<Edit className="h-4 w-4" />
									</Button>
								</SheetTrigger>
								<SheetContent
									side="left"
									className="sm:max-w-md w-full md:w-[500px] overflow-y-auto"
								>
									<SheetHeader className="mb-4">
										<SheetTitle>Edit Tools</SheetTitle>
										<SheetDescription>
											Update your tools and technologies.
											Click save when you&apos;re done.
										</SheetDescription>
									</SheetHeader>
									<EditToolsForm
										currentTools={tools as Tool[]}
										onSave={async (updatedTools) => {
											if (!aboutData?.user_id) return;
											try {
												const response = await fetch(
													"/api/about-me",
													{
														method: "PUT",
														headers: {
															"Content-Type":
																"application/json",
														},
														body: JSON.stringify({
															user_id:
																aboutData.user_id,
															tools: updatedTools,
														}),
														credentials: "include",
													}
												);
												if (!response.ok)
													throw new Error(
														"Failed to save tools"
													);
												toast({
													title: "Success",
													description:
														"Tools updated.",
												});
												setIsEditToolsSheetOpen(false);
												router.refresh();
											} catch (error: unknown) {
												let errorMessage =
													"Failed to save tools.";
												if (error instanceof Error) {
													errorMessage =
														error.message;
												}
												toast({
													title: "Error",
													description: errorMessage,
													variant: "destructive",
												});
											}
										}}
										onCancel={() =>
											setIsEditToolsSheetOpen(false)
										}
									/>
								</SheetContent>
							</Sheet>
						)}
					</div>
					<div className="grid grid-cols-2 md:grid-cols-5 gap-4">
						{tools.map((tool, index) => {
							const IconComponent = getIcon(tool.icon_name);
							return (
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
									{IconComponent && <IconComponent />}
									<span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
										{tool.name}
									</span>
								</motion.div>
							);
						})}
					</div>
				</div>

				{githubUsername && (
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
					</motion.div>
				)}
			</div>
		</section>
	);
}
