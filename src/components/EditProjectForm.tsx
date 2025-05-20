"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Tables } from "@/types/supabase";
import { supabaseBrowserClient } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

interface EditProjectFormProps {
	project?: Tables<"projects">;
	onOpenChange?: (open: boolean) => void;
	onSaveSuccess?: () => void;
}

export function EditProjectForm({
	project,
	onOpenChange,
	onSaveSuccess,
}: EditProjectFormProps) {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [imageUrl, setImageUrl] = useState("");
	const [projectImageFile, setProjectImageFile] = useState<File | null>(null);
	const [projectLink, setProjectLink] = useState("");
	const [sourceCodeLink, setSourceCodeLink] = useState("");
	const [technologies, setTechnologies] = useState<string[]>([]); // Stored as string array
	const [technologiesInput, setTechnologiesInput] = useState(""); // For comma-separated input
	const [displayOrder, setDisplayOrder] = useState<number | undefined>(
		undefined
	);

	const [isLoading, setIsLoading] = useState(false);
	const [isUploadingImage, setIsUploadingImage] = useState(false);
	const { toast } = useToast();
	const router = useRouter();

	useEffect(() => {
		if (project) {
			setTitle(project.title || "");
			setDescription(project.description || "");
			setImageUrl(project.image_url || "");
			setProjectImageFile(null);
			setProjectLink(project.project_link || "");
			setSourceCodeLink(project.source_code_link || "");
			setTechnologies(project.technologies || []);
			setTechnologiesInput((project.technologies || []).join(", "));
			setDisplayOrder(
				project.display_order === null
					? undefined
					: project.display_order
			);
		} else {
			// Reset form for new entry
			setTitle("");
			setDescription("");
			setImageUrl("");
			setProjectImageFile(null);
			setProjectLink("");
			setSourceCodeLink("");
			setTechnologies([]);
			setTechnologiesInput("");
			setDisplayOrder(0); // Default for new
		}
	}, [project]);

	const handleTechnologiesInputChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		const inputText = e.target.value;
		setTechnologiesInput(inputText);
		// Split by comma and trim whitespace for each technology
		const techArray = inputText
			.split(",")
			.map((tech) => tech.trim())
			.filter((tech) => tech.length > 0);
		setTechnologies(techArray);
	};

	const handleImageUpload = async (file: File) => {
		setIsUploadingImage(true);
		const formData = new FormData();
		formData.append("file", file);
		formData.append("type", "project"); // Differentiate from 'profile' or 'resume' if API handles types

		// If there's an existing image, pass its URL to the API for potential deletion
		if (imageUrl) {
			formData.append("currentFileUrl", imageUrl);
		}

		try {
			const response = await fetch("/api/upload", {
				// Assuming /api/upload can handle 'project' type
				method: "POST",
				body: formData,
				credentials: "include",
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(
					errorData.error || `Failed to upload project image.`
				);
			}

			const result = await response.json();
			setImageUrl(result.url);
			setProjectImageFile(null); // Clear file input state
			toast({
				title: "Upload Successful",
				description: `Project image uploaded. Save changes to persist.`,
			});
		} catch (error: unknown) {
			let errorMessage = `An error occurred while uploading the project image.`;
			if (error instanceof Error) {
				errorMessage = error.message;
			}
			toast({
				title: "Upload Error",
				description: errorMessage,
				variant: "destructive",
			});
			setProjectImageFile(null);
		} finally {
			setIsUploadingImage(false);
		}
	};

	const handleImageFileChange = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const file = event.target.files?.[0];
		if (file) {
			setProjectImageFile(file);
			handleImageUpload(file);
		}
	};

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setIsLoading(true);

		if (!title.trim()) {
			toast({
				title: "Validation Error",
				description: "Project Title is required.",
				variant: "destructive",
			});
			setIsLoading(false);
			return;
		}

		try {
			const { data: sessionData, error: sessionError } =
				await supabaseBrowserClient.auth.getSession();
			if (sessionError || !sessionData.session) {
				toast({
					title: "Error",
					description: "Not authenticated. Please login.",
					variant: "destructive",
				});
				setIsLoading(false);
				return;
			}
			const user = sessionData.session.user;

			const projectData = {
				user_id: user.id,
				title,
				description: description || null,
				image_url: imageUrl || null,
				project_link: projectLink || null,
				source_code_link: sourceCodeLink || null,
				technologies: technologies.length > 0 ? technologies : null,
				display_order: displayOrder === undefined ? null : displayOrder,
			};

			let response;
			if (project?.id) {
				response = await supabaseBrowserClient
					.from("projects")
					.update(projectData)
					.eq("id", project.id)
					.eq("user_id", user.id);
			} else {
				response = await supabaseBrowserClient
					.from("projects")
					.insert(projectData);
			}

			const { error } = response;
			if (error) throw error;

			toast({
				title: "Success",
				description: `Project ${
					project?.id ? "updated" : "added"
				} successfully.`,
			});

			router.refresh();

			if (onSaveSuccess) onSaveSuccess();
			if (onOpenChange) onOpenChange(false);
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
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-6 p-4">
			<div className="space-y-2">
				<Label htmlFor="title">Project Title</Label>
				<Input
					id="title"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					placeholder="My Awesome Project"
					disabled={isLoading}
					required
				/>
			</div>
			<div className="space-y-2">
				<Label htmlFor="description">Description (Optional)</Label>
				<Textarea
					id="description"
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					placeholder="A brief description of the project..."
					className="resize-y min-h-[100px]"
					disabled={isLoading}
				/>
			</div>
			<div className="space-y-2">
				<Label htmlFor="projectImageFile">Project Image</Label>
				<Input
					id="projectImageFile"
					type="file"
					accept="image/*"
					onChange={handleImageFileChange}
					disabled={isLoading || isUploadingImage}
				/>
				{isUploadingImage && (
					<p className="text-sm text-muted-foreground">
						Uploading project image...
					</p>
				)}
				{imageUrl && !projectImageFile && (
					<p className="text-sm text-muted-foreground">
						Current image:{" "}
						<a
							href={imageUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="underline"
						>
							{imageUrl.split("/").pop()}
						</a>
					</p>
				)}
				{projectImageFile && (
					<p className="text-sm text-muted-foreground">
						Selected: {projectImageFile.name}
					</p>
				)}
			</div>
			<div className="space-y-2">
				<Label htmlFor="projectLink">Project Link (Optional)</Label>
				<Input
					id="projectLink"
					type="url"
					value={projectLink}
					onChange={(e) => setProjectLink(e.target.value)}
					placeholder="https://example.com/my-project"
					disabled={isLoading}
				/>
			</div>
			<div className="space-y-2">
				<Label htmlFor="sourceCodeLink">
					Source Code Link (Optional)
				</Label>
				<Input
					id="sourceCodeLink"
					type="url"
					value={sourceCodeLink}
					onChange={(e) => setSourceCodeLink(e.target.value)}
					placeholder="https://github.com/yourusername/my-project"
					disabled={isLoading}
				/>
			</div>
			<div className="space-y-2">
				<Label htmlFor="technologies">
					Technologies (comma-separated, Optional)
				</Label>
				<Input
					id="technologies"
					value={technologiesInput}
					onChange={handleTechnologiesInputChange}
					placeholder="React, Next.js, Tailwind CSS"
					disabled={isLoading}
				/>
			</div>
			<div className="space-y-2">
				<Label htmlFor="displayOrder">Display Order (Optional)</Label>
				<Input
					id="displayOrder"
					type="number"
					value={displayOrder === undefined ? "" : displayOrder}
					onChange={(e) =>
						setDisplayOrder(
							e.target.value === ""
								? undefined
								: parseInt(e.target.value, 10)
						)
					}
					placeholder="0"
					disabled={isLoading}
				/>
			</div>
			<div className="flex justify-end space-x-2 pt-4">
				{onOpenChange && (
					<Button
						type="button"
						variant="outline"
						onClick={() => onOpenChange(false)}
						disabled={isLoading}
					>
						Cancel
					</Button>
				)}
				<Button type="submit" disabled={isLoading || isUploadingImage}>
					{isLoading
						? "Saving..."
						: project?.id
						? "Update Project"
						: "Add Project"}
				</Button>
			</div>
		</form>
	);
}
