"use client";

import React, { useState } from "react";
import Slider from "react-slick";
import PDFViewer from "./PDFViewer"; // Assuming this can handle images too, or we might need an Image component
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Tables } from "@/types/supabase";
import { Button } from "@/components/ui/button";
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
import { PlusCircle, Edit, Trash2, ExternalLink } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { EditCertificateForm } from "./EditCertificateForm";
import { useToast } from "@/hooks/use-toast";
import { supabaseBrowserClient } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Image from "next/image"; // For displaying image certificates

interface CertificateProps {
	certificateData: Tables<"certificates">[] | null;
}

export default function Certificate({ certificateData }: CertificateProps) {
	const { user } = useAuth();
	const { toast } = useToast();
	const router = useRouter();
	const [isSheetOpen, setIsSheetOpen] = useState(false);
	const [selectedCertificate, setSelectedCertificate] = useState<
		Tables<"certificates"> | undefined
	>(undefined);
	const [certificateToDelete, setCertificateToDelete] =
		useState<Tables<"certificates"> | null>(null);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

	const handleAddNew = () => {
		setSelectedCertificate(undefined);
		setIsSheetOpen(true);
	};

	const handleEdit = (certificateItem: Tables<"certificates">) => {
		setSelectedCertificate(certificateItem);
		setIsSheetOpen(true);
	};

	const handleDeleteInitiate = (certificateItem: Tables<"certificates">) => {
		setCertificateToDelete(certificateItem);
		setIsDeleteDialogOpen(true);
	};

	const handleDeleteConfirm = async () => {
		if (!certificateToDelete || !user?.id) {
			toast({
				title: "Error",
				description:
					"Cannot delete certificate. User or certificate data missing.",
				variant: "destructive",
			});
			return;
		}

		const imageUrlToDelete = certificateToDelete.certificate_image_url;

		try {
			// First, delete the database record
			const { error: dbError } = await supabaseBrowserClient
				.from("certificates")
				.delete()
				.eq("id", certificateToDelete.id)
				.eq("user_id", user.id);

			if (dbError) throw dbError;

			// If database record deletion is successful, and there was an image URL, delete the file from storage
			if (imageUrlToDelete) {
				try {
					const response = await fetch("/api/upload", {
						method: "DELETE",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							fileUrl: imageUrlToDelete,
							type: "certificate",
						}),
						credentials: "include",
					});

					if (!response.ok) {
						let errorDetail = `HTTP error ${response.status}`;
						try {
							// Attempt to parse JSON only if content type suggests it
							const contentType =
								response.headers.get("content-type");
							if (
								contentType &&
								contentType.includes("application/json")
							) {
								const errorData = await response.json();
								errorDetail =
									errorData.error ||
									JSON.stringify(errorData) ||
									errorDetail;
							} else {
								// If not JSON, try to get text, but be cautious about large responses
								const textError = await response.text();
								errorDetail =
									textError.substring(0, 100) || errorDetail; // Limit length
							}
						} catch (e) {
							// Parsing error, stick with HTTP status
							console.warn(
								"Could not parse error response from file delete API:",
								e
							);
						}

						console.error(
							"Failed to delete certificate file from storage:",
							errorDetail
						);
						toast({
							title: "Warning",
							description: `Certificate record deleted, but failed to delete file: ${errorDetail}. You may need to delete it manually from storage.`,
							variant: "default",
							duration: 7000,
						});
					} else {
						// Successfully deleted or file was already gone (API returns 200 for not found too)
						console.log(
							"File deletion from storage successful or file was not found:",
							imageUrlToDelete
						);
					}
				} catch (fileDeleteError: any) {
					// Catches network errors or issues before response is received
					console.error(
						"Error calling file delete API (network or setup issue):",
						fileDeleteError
					);
					toast({
						title: "Warning",
						description: `Certificate record deleted, but encountered an error trying to delete file: ${fileDeleteError.message}. You may need to delete it manually from storage.`,
						variant: "default",
						duration: 7000,
					});
				}
			}

			toast({
				title: "Success",
				description: "Certificate deleted successfully.",
			});
			router.refresh();
			setIsDeleteDialogOpen(false);
			setCertificateToDelete(null);
		} catch (error: any) {
			// This will catch dbError or any other error before file deletion attempt
			toast({
				title: "Error",
				description: error.message || "Could not delete certificate.",
				variant: "destructive",
			});
		}
	};

	const handleSaveSuccess = () => {
		setIsSheetOpen(false);
		router.refresh();
	};

	const sortedCertificateData = certificateData
		? [...certificateData].sort((a, b) => {
				// Sort by issue_date (most recent first), then by title
				const dateA = a.issue_date
					? new Date(a.issue_date).getTime()
					: 0;
				const dateB = b.issue_date
					? new Date(b.issue_date).getTime()
					: 0;
				if (dateB !== dateA) return dateB - dateA;
				return (a.title || "").localeCompare(b.title || "");
		  })
		: [];

	const settings = {
		dots: true,
		infinite: sortedCertificateData.length > 1, // Only infinite if more than 1 slide
		speed: 500,
		slidesToShow: 1,
		slidesToScroll: 1,
		autoplay: sortedCertificateData.length > 1, // Only autoplay if more than 1 slide
		autoplaySpeed: 5000,
		arrows: true,
	};

	return (
		<div className="container mx-auto p-4">
			<div className="flex justify-center items-center mb-10">
				<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center">
					Certificates
				</h2>
				{user && (
					<Button
						onClick={handleAddNew}
						variant="outline"
						size="icon"
						className="ml-4"
					>
						<PlusCircle className="h-6 w-6" />
						<span className="sr-only">Add New Certificate</span>
					</Button>
				)}
			</div>

			{(!sortedCertificateData || sortedCertificateData.length === 0) && (
				<p className="text-center text-muted-foreground">
					No certificates to display.{" "}
					{user ? "Add your first certificate!" : ""}
				</p>
			)}

			{sortedCertificateData.length > 0 && (
				<div className="w-full">
					<Slider {...settings}>
						{sortedCertificateData.map((certificate) => (
							<div
								key={certificate.id}
								className="px-2 outline-none"
							>
								<div className="border p-6 rounded-lg shadow-sm bg-card text-card-foreground relative">
									{user && (
										<div className="absolute top-2 right-2 flex space-x-1 z-10">
											<Button
												variant="ghost"
												size="icon"
												onClick={() =>
													handleEdit(certificate)
												}
												title="Edit Certificate"
											>
												<Edit className="h-4 w-4" />
											</Button>
											<Button
												variant="ghost"
												size="icon"
												onClick={() =>
													handleDeleteInitiate(
														certificate
													)
												}
												title="Delete Certificate"
											>
												<Trash2 className="h-4 w-4 text-destructive" />
											</Button>
										</div>
									)}
									<div className="mb-4 text-center">
										<h3 className="text-xl font-semibold">
											{certificate.title}
										</h3>
										{certificate.issuing_organization && (
											<p className="text-muted-foreground">
												{
													certificate.issuing_organization
												}
											</p>
										)}
										{certificate.issue_date && (
											<p className="text-sm text-muted-foreground">
												Issued: {certificate.issue_date}
											</p>
										)}
										{certificate.credential_url && (
											<a
												href={
													certificate.credential_url
												}
												target="_blank"
												rel="noopener noreferrer"
												className="text-sm text-primary hover:underline inline-flex items-center mt-1"
											>
												Verify Credential{" "}
												<ExternalLink className="ml-1 h-3 w-3" />
											</a>
										)}
									</div>
									{certificate.certificate_image_url && (
										<div className="mt-4 w-full flex justify-center">
											{certificate.certificate_image_url
												.toLowerCase()
												.endsWith(".pdf") ? (
												<div className="w-full max-h-[100vh]">
													<PDFViewer
														pdfUrl={
															certificate.certificate_image_url
														}
													/>
												</div>
											) : (
												<div
													className="relative w-full"
													style={{
														minHeight: "400px",
														maxHeight: "70vh",
													}}
												>
													<Image
														src={
															certificate.certificate_image_url
														}
														alt={`Certificate for ${certificate.title}`}
														fill
														sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
														className="object-contain rounded-md"
														priority={true}
													/>
												</div>
											)}
										</div>
									)}
								</div>
							</div>
						))}
					</Slider>
				</div>
			)}

			<Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
				<SheetContent className="md:w-[50vw] lg:w-[40vw] xl:w-[30vw] overflow-y-auto">
					<SheetHeader>
						<SheetTitle>
							{selectedCertificate
								? "Edit Certificate"
								: "Add New Certificate"}
						</SheetTitle>
					</SheetHeader>
					<EditCertificateForm
						certificate={selectedCertificate}
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
							Are you sure you want to delete the certificate: "
							{certificateToDelete?.title}"? This action cannot be
							undone.
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
		</div>
	);
}
