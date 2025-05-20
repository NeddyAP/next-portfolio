"use client";

import React, { useState } from "react";
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
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";
import type { Tables } from "@/types/supabase";
import { FiExternalLink, FiGithub } from "react-icons/fi";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { EditProjectForm } from "./EditProjectForm";
import { useToast } from "@/hooks/use-toast";
import { supabaseBrowserClient } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

interface PortfolioProps {
	projectsData: Tables<"projects">[];
}

export default function Portfolio({ projectsData }: PortfolioProps) {
	const { user } = useAuth();
	const { toast } = useToast();
	const router = useRouter();
	const [isSheetOpen, setIsSheetOpen] = useState(false);
	const [selectedProject, setSelectedProject] = useState<
		Tables<"projects"> | undefined
	>(undefined);
	const [projectToDelete, setProjectToDelete] =
		useState<Tables<"projects"> | null>(null);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

	const handleAddNew = () => {
		setSelectedProject(undefined);
		setIsSheetOpen(true);
	};

	const handleEdit = (projectItem: Tables<"projects">) => {
		setSelectedProject(projectItem);
		setIsSheetOpen(true);
	};

	const handleDeleteInitiate = (projectItem: Tables<"projects">) => {
		setProjectToDelete(projectItem);
		setIsDeleteDialogOpen(true);
	};

	const handleDeleteConfirm = async () => {
		if (!projectToDelete || !user?.id) {
			toast({
				title: "Error",
				description:
					"Cannot delete project. User or project data missing.",
				variant: "destructive",
			});
			return;
		}

		try {
			// Optional: Delete image from Supabase Storage if image_url exists and you have a storage path
			// This requires knowing the storage path/bucket and file name.
			// For now, we'll just delete the database record.
			// if (projectToDelete.image_url) {
			//   const path = projectToDelete.image_url.substring(projectToDelete.image_url.lastIndexOf('/') + 1); // Example: extract filename
			//   await supabaseBrowserClient.storage.from('project-images').remove([path]);
			// }

			const imageUrlToDelete = projectToDelete.image_url; // Store before DB delete potentially clears projectToDelete

			const { error: dbError } = await supabaseBrowserClient
				.from("projects")
				.delete()
				.eq("id", projectToDelete.id)
				.eq("user_id", user.id);

			if (dbError) throw dbError;

			// If database record deletion is successful, and there was an image URL, delete the local file
			if (imageUrlToDelete) {
				try {
					const response = await fetch("/api/upload", {
						method: "DELETE",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							fileUrl: imageUrlToDelete,
							type: "project",
						}), // Pass 'project' as type
						credentials: "include",
					});
					if (!response.ok) {
						const errorData = await response.json();
						console.error(
							"Failed to delete project image file from local storage:",
							errorData.error
						);
						toast({
							title: "Warning",
							description: `Project record deleted, but failed to delete image file: ${
								errorData.error || "Unknown error"
							}. You may need to delete it manually.`,
							variant: "default",
							duration: 7000,
						});
					} else {
						console.log(
							"Successfully deleted project image file from local storage:",
							imageUrlToDelete
						);
					}
				} catch (fileDeleteError: unknown) {
					console.error(
						"Error calling project image file delete API:",
						fileDeleteError
					);
					const errorMessage =
						fileDeleteError instanceof Error
							? fileDeleteError.message
							: String(fileDeleteError);
					toast({
						title: "Warning",
						description: `Project record deleted, but encountered an error trying to delete image file: ${errorMessage}. You may need to delete it manually.`,
						variant: "default",
						duration: 7000,
					});
				}
			}

			toast({
				title: "Success",
				description: "Project deleted successfully.",
			});
			router.refresh();
			setIsDeleteDialogOpen(false);
			setProjectToDelete(null);
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error
					? error.message
					: "An unknown error occurred.";
			toast({
				title: "Error",
				description: errorMessage,
				variant: "destructive",
			});
		}
	};

	const handleSaveSuccess = () => {
		setIsSheetOpen(false);
		router.refresh();
	};

	const sortedProjectsData = projectsData
		? [...projectsData].sort((a, b) => {
				if (
					a.display_order !== null &&
					b.display_order !== null &&
					a.display_order !== undefined &&
					b.display_order !== undefined
				) {
					return a.display_order - b.display_order;
				}
				// Fallback or default sort if display_order is not consistently set
				return (
					new Date(b.created_at || 0).getTime() -
					new Date(a.created_at || 0).getTime()
				);
		  })
		: [];

	return (
		<section id="portfolio" className="space-y-8 px-4 py-8">
			<div className="flex justify-center items-center mb-8">
				<h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tighter text-center">
					Portfolio
				</h2>
				{user && (
					<Button
						onClick={handleAddNew}
						variant="outline"
						size="icon"
						className="ml-4"
					>
						<PlusCircle className="h-6 w-6" />
						<span className="sr-only">Add New Project</span>
					</Button>
				)}
			</div>

			{(!sortedProjectsData || sortedProjectsData.length === 0) && (
				<p className="text-center text-muted-foreground">
					No projects to display at the moment.{" "}
					{user ? "Add your first project!" : ""}
				</p>
			)}

			<div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
				{sortedProjectsData.map((project, index) => (
					<motion.div
						key={project.id || index}
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.3, delay: index * 0.1 }}
					>
						<Card className="flex flex-col transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-lg h-full relative">
							{user && (
								<div className="absolute top-2 right-2 flex space-x-1 z-10">
									<Button
										variant="ghost"
										size="icon"
										onClick={() => handleEdit(project)}
										title="Edit Project"
									>
										<Edit className="h-4 w-4" />
									</Button>
									<Button
										variant="ghost"
										size="icon"
										onClick={() =>
											handleDeleteInitiate(project)
										}
										title="Delete Project"
									>
										<Trash2 className="h-4 w-4 text-destructive" />
									</Button>
								</div>
							)}
							<CardHeader className="p-0">
								{project.image_url ? (
									<Image
										src={project.image_url}
										alt={project.title || "Project image"}
										width={400}
										height={200}
										className="w-full h-40 sm:h-48 object-cover rounded-t-lg"
										priority={index < 3}
									/>
								) : (
									<div className="w-full h-40 sm:h-48 bg-muted rounded-t-lg flex items-center justify-center">
										<span className="text-muted-foreground text-sm">
											No Image
										</span>
									</div>
								)}
							</CardHeader>
							<CardContent className="flex-1 p-4 text-center flex flex-col">
								<CardTitle className="text-xl mb-2">
									{project.title}
								</CardTitle>
								<CardDescription className="text-sm mb-4 flex-grow">
									{project.description}
								</CardDescription>
								<div className="flex flex-wrap gap-2 justify-center mt-auto pt-4">
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
							<CardFooter className="flex flex-col justify-center p-4">
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
												Demo
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
												Source
											</a>
										</Button>
									)}
								</div>
							</CardFooter>
						</Card>
					</motion.div>
				))}
			</div>

			<Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
				<SheetContent className="md:w-[50vw] lg:w-[40vw] xl:w-[30vw] overflow-y-auto">
					<SheetHeader>
						<SheetTitle>
							{selectedProject
								? "Edit Project"
								: "Add New Project"}
						</SheetTitle>
					</SheetHeader>
					<EditProjectForm
						project={selectedProject}
						onOpenChange={setIsSheetOpen}
						onSaveSuccess={handleSaveSuccess}
					/>
				</SheetContent>
			</Sheet>

			<Dialog
				open={isDeleteDialogOpen}
				onOpenChange={setIsDeleteDialogOpen}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Confirm Deletion</DialogTitle>
						<DialogDescription>
							Are you sure you want to delete the project: &quot;
							{projectToDelete?.title}&quot;? This action cannot
							be undone.
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
