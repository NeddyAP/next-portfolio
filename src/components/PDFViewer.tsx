"use client";

import { useState } from "react";

interface PDFViewerProps {
	pdfUrl: string;
}

export default function PDFViewer({ pdfUrl }: PDFViewerProps) {
	const [isExpanded, setIsExpanded] = useState(false);
	const [isPreviewLoaded, setIsPreviewLoaded] = useState(false);

	return (
		<div className="relative">
			{!isPreviewLoaded ? (
				<div className="h-[240px] w-full border rounded-lg dark:border-gray-700 flex flex-col items-center justify-center gap-3 p-4 text-center">
					<p className="text-sm text-muted-foreground">
						This certificate is a PDF. Load the preview only when needed.
					</p>
					<div className="flex flex-wrap items-center justify-center gap-2">
						<button
							onClick={() => setIsPreviewLoaded(true)}
							aria-label="Load certificate PDF preview"
							className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:opacity-90"
						>
							Load Preview
						</button>
						<a
							href={pdfUrl}
							target="_blank"
							rel="noopener noreferrer"
							aria-label="Open certificate PDF in new tab"
							className="px-3 py-1 border rounded text-sm hover:bg-accent"
						>
							Open PDF
						</a>
					</div>
				</div>
			) : (
				<>
					{/* Preview iframe */}
					<div className="h-[650px] w-full border rounded-lg overflow-hidden dark:border-gray-700">
						<iframe
							src={`${pdfUrl}#view=FitH`}
							className="w-full h-full bg-white"
							title="Certificate PDF preview"
						/>
					</div>

					{/* Expand button */}
					<button
						onClick={() => setIsExpanded(true)}
						aria-label="Open certificate PDF in fullscreen"
						className="absolute top-2 right-2 px-3 py-1 bg-blue-500 text-white rounded text-sm opacity-80 hover:opacity-100"
					>
						Fullscreen
					</button>
				</>
			)}

			{/* Fullscreen modal */}
			{isExpanded && (
				<div className="fixed inset-0 z-50 bg-white dark:bg-gray-900">
					<button
						onClick={() => setIsExpanded(false)}
						className="absolute top-4 right-4 z-10 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
					>
						Close
					</button>
					<iframe
						src={`${pdfUrl}#view=FitH`}
						className="w-full h-full bg-white"
						title="Certificate PDF fullscreen preview"
					/>
				</div>
			)}
		</div>
	);
}
