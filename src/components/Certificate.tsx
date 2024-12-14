"use client";
import Slider from "react-slick";
import certificateData from "@/data/certificateData";
import PDFViewer from "./PDFViewer";
import { CertificateType } from "@/types/types";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function Certificate() {
	const settings = {
		dots: true,
		infinite: true,
		speed: 500,
		slidesToShow: 1,
		slidesToScroll: 1,
		autoplay: true,
		autoplaySpeed: 5000,
		arrows: true,
	};

	return (
		<div className="container mx-auto p-4">
			<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl justify-center flex pb-10">
				Certificates
			</h2>
			<div className="max-w-4xl mx-auto">
				<Slider {...settings}>
					{certificateData.map((certificate: CertificateType) => (
						<div key={certificate.title} className="px-2">
							<div className="border p-6 rounded-lg shadow-sm bg-white dark:bg-gray-800 dark:border-gray-700">
								<div className="mb-4">
									<h2 className="text-xl font-semibold dark:text-white">
										{certificate.title}
									</h2>
									<p className="text-gray-600 dark:text-gray-200">
										{certificate.description}
									</p>
									<p className="text-sm text-gray-500 dark:text-gray-400">
										{certificate.date}
									</p>
								</div>
								<PDFViewer pdfUrl={certificate.link} />
							</div>
						</div>
					))}
				</Slider>
			</div>
		</div>
	);
}
