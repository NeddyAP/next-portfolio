"use client";

import { useState } from "react";

interface PDFViewerProps {
	pdfUrl: string;
}

export default function PDFViewer({ pdfUrl }: PDFViewerProps) {
	const [isExpanded, setIsExpanded] = useState(false);

	return (
		<div className="relative">
			{/* Preview iframe */}
			<div className="h-[650px] w-full border rounded-lg overflow-hidden dark:border-gray-700">
				<iframe
					src={`${pdfUrl}#view=FitH`}
					className="w-full h-full bg-white"
				/>
			</div>

			{/* Expand button */}
			<button
				onClick={() => setIsExpanded(true)}
				className="absolute top-2 right-2 px-3 py-1 bg-blue-500 text-white rounded text-sm opacity-80 hover:opacity-100"
			>
				Fullscreen
			</button>

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
					/>
				</div>
			)}
		</div>
	);
}
