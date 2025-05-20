"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Tables } from "@/types/supabase"; // Assuming Tables<'experiences'> is the correct type
import { supabaseBrowserClient } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

interface EditExperienceFormProps {
	experience?: Tables<"experiences">;
	onOpenChange?: (open: boolean) => void; // To close the sheet/dialog
	onSaveSuccess?: () => void; // Callback after successful save
}

export function EditExperienceForm({
	experience,
	onOpenChange,
	onSaveSuccess,
}: EditExperienceFormProps) {
	const [jobTitle, setJobTitle] = useState("");
	const [companyName, setCompanyName] = useState("");
	const [location, setLocation] = useState("");
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [description, setDescription] = useState("");
	const [companyLogoUrl, setCompanyLogoUrl] = useState("");
	const [iconName, setIconName] = useState("");
	const [displayOrder, setDisplayOrder] = useState<number | undefined>(
		undefined
	); // Keep as number or undefined

	const [isLoading, setIsLoading] = useState(false);
	const { toast } = useToast();
	const router = useRouter();

	useEffect(() => {
		if (experience) {
			setJobTitle(experience.job_title || "");
			setCompanyName(experience.company_name || "");
			setLocation(experience.location || "");
			setStartDate(experience.start_date || "");
			setEndDate(experience.end_date || "");
			setDescription(experience.description || "");
			setCompanyLogoUrl(experience.company_logo_url || "");
			setIconName(experience.icon_name || "");
			setDisplayOrder(
				experience.display_order === null
					? undefined
					: experience.display_order
			);
		} else {
			// Reset form for new entry
			setJobTitle("");
			setCompanyName("");
			setLocation("");
			setStartDate("");
			setEndDate("");
			setDescription("");
			setCompanyLogoUrl("");
			setIconName("");
			setDisplayOrder(0); // Default for new
		}
	}, [experience]);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setIsLoading(true);

		if (!jobTitle.trim() || !companyName.trim()) {
			toast({
				title: "Validation Error",
				description: "Job Title and Company Name are required.",
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

			const experienceData = {
				user_id: user.id,
				job_title: jobTitle,
				company_name: companyName,
				location: location || null,
				start_date: startDate || null,
				end_date: endDate || null,
				description: description || null,
				company_logo_url: companyLogoUrl || null,
				icon_name: iconName || null,
				display_order: displayOrder === undefined ? null : displayOrder,
			};

			let response;
			if (experience?.id) {
				// Update existing experience
				response = await supabaseBrowserClient
					.from("experiences")
					.update(experienceData)
					.eq("id", experience.id)
					.eq("user_id", user.id);
			} else {
				// Create new experience
				response = await supabaseBrowserClient
					.from("experiences")
					.insert(experienceData);
			}

			const { error } = response;

			if (error) {
				throw error;
			}

			toast({
				title: "Success",
				description: `Experience ${
					experience?.id ? "updated" : "added"
				} successfully.`,
			});

			router.refresh(); // Revalidate data

			if (onSaveSuccess) {
				onSaveSuccess();
			}
			if (onOpenChange) {
				onOpenChange(false); // Close the sheet/dialog
			}
		} catch (error: any) {
			console.error("Error saving experience:", error);
			toast({
				title: "Error",
				description:
					error.message ||
					"Could not save experience. Please try again.",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-6 p-4">
			<div className="space-y-2">
				<Label htmlFor="jobTitle">Job Title</Label>
				<Input
					id="jobTitle"
					value={jobTitle}
					onChange={(e) => setJobTitle(e.target.value)}
					placeholder="Software Engineer"
					disabled={isLoading}
					required
				/>
			</div>
			<div className="space-y-2">
				<Label htmlFor="companyName">Company Name</Label>
				<Input
					id="companyName"
					value={companyName}
					onChange={(e) => setCompanyName(e.target.value)}
					placeholder="Tech Solutions Inc."
					disabled={isLoading}
					required
				/>
			</div>
			<div className="space-y-2">
				<Label htmlFor="location">Location (Optional)</Label>
				<Input
					id="location"
					value={location}
					onChange={(e) => setLocation(e.target.value)}
					placeholder="San Francisco, CA"
					disabled={isLoading}
				/>
			</div>
			<div className="flex flex-col gap-4">
				<div className="space-y-2">
					<Label htmlFor="startDate">Start Date (Optional)</Label>
					<Input
						id="startDate"
						type="text"
						value={startDate}
						onChange={(e) => setStartDate(e.target.value)}
						placeholder="YYYY-MM-DD or Jan 2020"
						disabled={isLoading}
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="endDate">
						End Date (Optional, or 'Present')
					</Label>
					<Input
						id="endDate"
						type="text"
						value={endDate}
						onChange={(e) => setEndDate(e.target.value)}
						placeholder="YYYY-MM-DD or Present"
						disabled={isLoading}
					/>
				</div>
			</div>
			<div className="space-y-2">
				<Label htmlFor="description">Description (Optional)</Label>
				<Textarea
					id="description"
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					placeholder="Describe your responsibilities and achievements..."
					className="resize-y min-h-[100px]"
					disabled={isLoading}
				/>
			</div>
			<div className="space-y-2">
				<Label htmlFor="companyLogoUrl">
					Company Logo URL (Optional)
				</Label>
				<Input
					id="companyLogoUrl"
					type="url"
					value={companyLogoUrl}
					onChange={(e) => setCompanyLogoUrl(e.target.value)}
					placeholder="https://example.com/logo.png"
					disabled={isLoading}
				/>
			</div>
			<div className="space-y-2">
				<Label htmlFor="iconName">
					Icon Name (Optional, from lucide-react)
				</Label>
				<Input
					id="iconName"
					value={iconName}
					onChange={(e) => setIconName(e.target.value)}
					placeholder="Briefcase"
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
				<Button type="submit" disabled={isLoading}>
					{isLoading
						? "Saving..."
						: experience?.id
						? "Update Experience"
						: "Add Experience"}
				</Button>
			</div>
		</form>
	);
}
