"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea"; // Not obviously needed based on schema
import { useToast } from "@/hooks/use-toast";
import { Tables, TablesInsert, TablesUpdate } from "@/types/supabase"; // Import TablesInsert and TablesUpdate
import { supabaseBrowserClient } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

interface EditCertificateFormProps {
	certificate?: Tables<"certificates">;
	onOpenChange?: (open: boolean) => void;
	onSaveSuccess?: () => void;
}

export function EditCertificateForm({
	certificate,
	onOpenChange,
	onSaveSuccess,
}: EditCertificateFormProps) {
	const [title, setTitle] = useState("");
	const [issuingOrganization, setIssuingOrganization] = useState("");
	const [issueDate, setIssueDate] = useState("");
	// const [credentialId, setCredentialId] = useState(""); // Removed
	const [credentialUrl, setCredentialUrl] = useState("");
	const [certificateImageUrl, setCertificateImageUrl] = useState("");
	const [certificateFile, setCertificateFile] = useState<File | null>(null);
	// const [displayOrder, setDisplayOrder] = useState<number | undefined>(undefined); // Removed

	const [isLoading, setIsLoading] = useState(false);
	const [isUploadingFile, setIsUploadingFile] = useState(false);
	const { toast } = useToast();
	const router = useRouter();

	useEffect(() => {
		if (certificate) {
			setTitle(certificate.title || "");
			setIssuingOrganization(certificate.issuing_organization || "");
			setIssueDate(certificate.issue_date || "");
			// setCredentialId(certificate.credential_id || ""); // Removed
			setCredentialUrl(certificate.credential_url || "");
			setCertificateImageUrl(certificate.certificate_image_url || "");
			setCertificateFile(null);
			// setDisplayOrder(certificate.display_order === null ? undefined : certificate.display_order); // Removed
		} else {
			// Reset form for new entry
			setTitle("");
			setIssuingOrganization("");
			setIssueDate("");
			// setCredentialId(""); // Removed
			setCredentialUrl("");
			setCertificateImageUrl("");
			setCertificateFile(null);
			// setDisplayOrder(0); // Removed
		}
	}, [certificate]);

	const handleFileUpload = async (file: File) => {
		setIsUploadingFile(true);
		const formData = new FormData();
		formData.append("file", file);
		formData.append("type", "certificate"); // Differentiate upload type

		if (certificateImageUrl) {
			formData.append("currentFileUrl", certificateImageUrl);
		}

		try {
			const response = await fetch("/api/upload", {
				method: "POST",
				body: formData,
				credentials: "include",
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(
					errorData.error || `Failed to upload certificate file.`
				);
			}

			const result = await response.json();
			setCertificateImageUrl(result.url);
			setCertificateFile(null);
			toast({
				title: "Upload Successful",
				description: `Certificate file uploaded. Save changes to persist.`,
			});
		} catch (error: unknown) {
			let errorMessage = `An error occurred while uploading the certificate file.`;
			if (error instanceof Error) {
				errorMessage = error.message;
			}
			toast({
				title: "Upload Error",
				description: errorMessage,
				variant: "destructive",
			});
			setCertificateFile(null);
		} finally {
			setIsUploadingFile(false);
		}
	};

	const handleCertificateFileChange = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const file = event.target.files?.[0];
		if (file) {
			setCertificateFile(file);
			handleFileUpload(file); // Upload immediately on selection
		}
	};

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setIsLoading(true);

		if (!title.trim()) {
			toast({
				title: "Validation Error",
				description: "Certificate Title is required.",
				variant: "destructive",
			});
			setIsLoading(false);
			return;
		}
		if (!issuingOrganization.trim()) {
			toast({
				title: "Validation Error",
				description: "Issuing Organization is required.",
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

			let response;

			if (certificate?.id) {
				// For UPDATE operations
				const updateData: Partial<TablesUpdate<"certificates">> = {
					// We only send fields that could have changed.
					// title and issuing_organization are always present in state.
					title: title,
					issuing_organization: issuingOrganization,
				};
				if (issueDate || issueDate === "")
					updateData.issue_date = issueDate || null; // Send null if cleared
				if (credentialUrl || credentialUrl === "")
					updateData.credential_url = credentialUrl || null; // Send null if cleared
				if (certificateImageUrl || certificateImageUrl === "")
					updateData.certificate_image_url =
						certificateImageUrl || null; // Send null if cleared

				response = await supabaseBrowserClient
					.from("certificates")
					.update(updateData)
					.eq("id", certificate.id)
					.eq("user_id", user.id);
			} else {
				// For INSERT operations
				// All required fields (title, issuing_organization, user_id) are guaranteed by validation
				const insertData: TablesInsert<"certificates"> = {
					user_id: user.id,
					title: title,
					issuing_organization: issuingOrganization, // Guaranteed non-empty by validation
					// Optional fields (nullable in DB) are sent as null if empty, or their value
					issue_date: issueDate || null,
					credential_url: credentialUrl || null,
					certificate_image_url: certificateImageUrl || null,
					// created_at and id are handled by Supabase
				};
				response = await supabaseBrowserClient
					.from("certificates")
					.insert(insertData);
			}

			const { error } = response;
			if (error) throw error;

			toast({
				title: "Success",
				description: `Certificate ${
					certificate?.id ? "updated" : "added"
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
				<Label htmlFor="title">Certificate Title</Label>
				<Input
					id="title"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					placeholder="e.g., AWS Certified Solutions Architect"
					disabled={isLoading}
					required
				/>
			</div>
			<div className="space-y-2">
				<Label htmlFor="issuingOrganization">
					Issuing Organization
				</Label>
				<Input
					id="issuingOrganization"
					value={issuingOrganization}
					onChange={(e) => setIssuingOrganization(e.target.value)}
					placeholder="e.g., Amazon Web Services"
					disabled={isLoading}
					required // Make input required
				/>
			</div>
			<div className="space-y-2">
				<Label htmlFor="issueDate">Issue Date (Optional)</Label>
				<Input
					id="issueDate"
					type="text" // Or type="date" for a date picker, but text allows flexible formats like "Jan 2023"
					value={issueDate}
					onChange={(e) => setIssueDate(e.target.value)}
					placeholder="YYYY-MM-DD or Jan 2023"
					disabled={isLoading}
				/>
			</div>
			{/* Credential ID field removed */}
			<div className="space-y-2">
				<Label htmlFor="credentialUrl">Credential URL (Optional)</Label>
				<Input
					id="credentialUrl"
					type="url"
					value={credentialUrl}
					onChange={(e) => setCredentialUrl(e.target.value)}
					placeholder="https://example.com/credential/verify"
					disabled={isLoading}
				/>
			</div>
			<div className="space-y-2">
				<Label htmlFor="certificateFile">
					Certificate File (PDF only, Optional)
				</Label>
				<Input
					id="certificateFile"
					type="file"
					accept="application/pdf" // Accept only PDFs
					onChange={handleCertificateFileChange}
					disabled={isLoading || isUploadingFile}
				/>
				{isUploadingFile && (
					<p className="text-sm text-muted-foreground">
						Uploading certificate file...
					</p>
				)}
				{certificateImageUrl && !certificateFile && (
					<p className="text-sm text-muted-foreground">
						Current file:{" "}
						<a
							href={certificateImageUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="underline"
						>
							{certificateImageUrl.split("/").pop()}
						</a>
					</p>
				)}
				{certificateFile && (
					<p className="text-sm text-muted-foreground">
						Selected: {certificateFile.name}
					</p>
				)}
			</div>
			{/* Display Order field removed */}
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
				<Button type="submit" disabled={isLoading || isUploadingFile}>
					{isLoading
						? "Saving..."
						: certificate?.id
						? "Update Certificate"
						: "Add Certificate"}
				</Button>
			</div>
		</form>
	);
}
