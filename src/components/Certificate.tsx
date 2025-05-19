"use client";
import Slider from "react-slick";
import PDFViewer from "./PDFViewer";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Database } from "@/types/supabase";

type CertificateRow = Database["public"]["Tables"]["certificates"]["Row"];

interface CertificateProps {
  certificateData: CertificateRow[] | null;
}

export default function Certificate({ certificateData }: CertificateProps) {
  if (!certificateData || certificateData.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl justify-center flex pb-10">
          Certificates
        </h2>
        <p className="text-center">No certificates to display.</p>
      </div>
    );
  }

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
          {certificateData.map((certificate: CertificateRow) => (
            <div key={certificate.id} className="px-2">
              <div className="border p-6 rounded-lg shadow-sm bg-white dark:bg-gray-800 dark:border-gray-700">
                <div className="mb-4">
                  <h2 className="text-xl font-semibold dark:text-white">
                    {certificate.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-200">
                    {certificate.issuing_organization}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {certificate.issue_date}
                  </p>
                </div>
                {certificate.certificate_image_url && (
                  <PDFViewer pdfUrl={certificate.certificate_image_url} />
                )}
              </div>
            </div>
          ))}
        </Slider>
      </div>
		</div>
	);
}
