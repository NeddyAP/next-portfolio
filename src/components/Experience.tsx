"use client";

import React, { useState } from "react"; // Added useState
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button"; // Added Button
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet"; // Added Sheet
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"; // Added Dialog
import { Database, Tables } from "@/types/supabase"; // Import Supabase types
import { getIcon } from "@/lib/iconMap";
import {
	Briefcase,
	GraduationCap,
	HelpCircle,
	PlusCircle,
	Edit,
	Trash2,
} from "lucide-react"; // Added icons
import { useAuth } from "@/contexts/AuthContext"; // Added useAuth
import { EditExperienceForm } from "./EditExperienceForm"; // Added EditExperienceForm
import { useToast } from "@/hooks/use-toast"; // Added useToast
import { supabaseBrowserClient } from "@/lib/supabaseClient"; // Added supabase client
import { useRouter } from "next/navigation"; // Added useRouter

// Define props for the component
interface ExperienceProps {
	experienceData: Tables<"experiences">[] | null;
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
	const { user } = useAuth();
	const { toast } = useToast();
	const router = useRouter();
	const [isSheetOpen, setIsSheetOpen] = useState(false);
	const [selectedExperience, setSelectedExperience] = useState<
		Tables<"experiences"> | undefined
	>(undefined);
	const [experienceToDelete, setExperienceToDelete] =
		useState<Tables<"experiences"> | null>(null);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

	const handleAddNew = () => {
		setSelectedExperience(undefined);
		setIsSheetOpen(true);
	};

	const handleEdit = (experienceItem: Tables<"experiences">) => {
		setSelectedExperience(experienceItem);
		setIsSheetOpen(true);
	};

	const handleDeleteInitiate = (experienceItem: Tables<"experiences">) => {
		setExperienceToDelete(experienceItem);
		setIsDeleteDialogOpen(true);
	};

	const handleDeleteConfirm = async () => {
		if (!experienceToDelete) return;

		try {
			if (!user?.id) {
				toast({
					title: "Error",
					description: "User not authenticated.",
					variant: "destructive",
				});
				return;
			}
			const { error } = await supabaseBrowserClient
				.from("experiences")
				.delete()
				.eq("id", experienceToDelete.id)
				.eq("user_id", user.id); // Ensure user owns the record

			if (error) throw error;

			toast({
				title: "Success",
				description: "Experience deleted successfully.",
			});
			router.refresh(); // Revalidate data
			setIsDeleteDialogOpen(false);
			setExperienceToDelete(null);
		} catch (error: any) {
			toast({
				title: "Error",
				description: error.message || "Could not delete experience.",
				variant: "destructive",
			});
		}
	};

	const handleSaveSuccess = () => {
		setIsSheetOpen(false);
		router.refresh();
	};

	if (!experienceData || experienceData.length === 0) {
		return (
			<section id="experience" className="space-y-6">
				<div className="flex justify-center items-center mb-4">
					<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
						Experience
					</h2>
					{user && (
						<Button
							onClick={handleAddNew}
							variant="outline"
							size="icon"
							className="ml-4"
						>
							<PlusCircle className="h-6 w-6" />
							<span className="sr-only">Add New Experience</span>
						</Button>
					)}
				</div>
				<p className="text-muted-foreground text-center">
					No experience to display.{" "}
					{user ? "Add your first experience!" : ""}
				</p>
			</section>
		);
	}

	// Sort experiences by start_date in descending order (most recent first)
	// or by display_order if available
	const sortedExperienceData = [...experienceData].sort((a, b) => {
		if (
			a.display_order !== null &&
			b.display_order !== null &&
			a.display_order !== undefined &&
			b.display_order !== undefined
		) {
			return a.display_order - b.display_order;
		}
		const dateA = a.start_date ? new Date(a.start_date).getTime() : 0;
		const dateB = b.start_date ? new Date(b.start_date).getTime() : 0;
		return dateB - dateA; // Sorts recent first
	});

	return (
		<section id="experience" className="space-y-6">
			<div className="flex justify-center items-center mb-4">
				<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
					Experience
				</h2>
				{user && (
					<Button
						onClick={handleAddNew}
						variant="outline"
						size="icon"
						className="ml-4"
					>
						<PlusCircle className="h-6 w-6" />
						<span className="sr-only">Add New Experience</span>
					</Button>
				)}
			</div>
			<div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
				{sortedExperienceData.map((item, index) => {
					let IconComponent = getIcon(item.icon_name);
					if (!IconComponent) {
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
							IconComponent = HelpCircle;
						}
					}
					const period = formatDateRange(
						item.start_date,
						item.end_date
					);

					return (
						<motion.div
							key={item.id}
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
							<div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white dark:bg-slate-800 p-4 rounded shadow relative">
								{user && (
									<div className="absolute top-2 right-2 flex space-x-1">
										<Button
											variant="ghost"
											size="icon"
											onClick={() => handleEdit(item)}
											title="Edit Experience"
										>
											<Edit className="h-4 w-4" />
										</Button>
										<Button
											variant="ghost"
											size="icon"
											onClick={() =>
												handleDeleteInitiate(item)
											}
											title="Delete Experience"
										>
											<Trash2 className="h-4 w-4 text-destructive" />
										</Button>
									</div>
								)}
								<Card className="transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-lg border-0">
									{" "}
									{/* Removed border from card as parent div has shadow */}
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

			{/* Sheet for Add/Edit Form */}
			<Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
				<SheetContent className="md:w-[50vw] overflow-y-auto">
					<SheetHeader>
						<SheetTitle>
							{selectedExperience
								? "Edit Experience"
								: "Add New Experience"}
						</SheetTitle>
					</SheetHeader>
					<EditExperienceForm
						experience={selectedExperience}
						onOpenChange={setIsSheetOpen}
						onSaveSuccess={handleSaveSuccess}
					/>
				</SheetContent>
			</Sheet>

			{/* Dialog for Delete Confirmation */}
			<Dialog
				open={isDeleteDialogOpen}
				onOpenChange={setIsDeleteDialogOpen}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Confirm Deletion</DialogTitle>
						<DialogDescription>
							Are you sure you want to delete the experience: "
							{experienceToDelete?.job_title} at{" "}
							{experienceToDelete?.company_name}"? This action
							cannot be undone.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setIsDeleteDialogOpen(false)}
						>
							Cancel
						</Button>
						<Button
							variant="destructive"
							onClick={handleDeleteConfirm}
						>
							Delete
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</section>
	);
}
