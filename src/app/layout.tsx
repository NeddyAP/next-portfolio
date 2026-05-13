import { Inter } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ThemeProvider } from "../components/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import SpaceBackground from "../components/SpaceBackground";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

const siteUrl = "https://neddyap.github.io/next-portfolio";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Neddy Avgha Prasetio - Full-Stack Developer Portfolio",
    template: "%s | Neddy Avgha Prasetio",
  },
  description:
    "Portfolio of Neddy Avgha Prasetio, a Full-Stack Developer from Indonesia specializing in React, Laravel, PHP, JavaScript, and Kotlin. View my projects, experience, and certificates.",
  keywords: [
    "Neddy Avgha Prasetio",
    "Neddy AP",
    "Full-Stack Developer",
    "Web Developer",
    "Portfolio",
    "React Developer",
    "Laravel Developer",
    "PHP Developer",
    "JavaScript Developer",
    "Kotlin Developer",
    "Indonesia Developer",
    "Software Engineer",
  ],
  authors: [{ name: "Neddy Avgha Prasetio", url: siteUrl }],
  creator: "Neddy Avgha Prasetio",
  publisher: "Neddy Avgha Prasetio",
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Neddy Avgha Prasetio Portfolio",
    title: "Neddy Avgha Prasetio - Full-Stack Developer Portfolio",
    description:
      "Portfolio of Neddy Avgha Prasetio, a Full-Stack Developer from Indonesia specializing in React, Laravel, PHP, JavaScript, and Kotlin.",
    images: [
      {
        url: `${siteUrl}/profile-img.png`,
        width: 1200,
        height: 630,
        alt: "Neddy Avgha Prasetio - Full-Stack Developer",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Neddy Avgha Prasetio - Full-Stack Developer Portfolio",
    description:
      "Portfolio of Neddy Avgha Prasetio, a Full-Stack Developer from Indonesia specializing in React, Laravel, PHP, JavaScript, and Kotlin.",
    images: [`${siteUrl}/profile-img.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/next-portfolio/favicon.ico",
    apple: "/next-portfolio/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Neddy Avgha Prasetio",
              alternateName: "Neddy AP",
              url: siteUrl,
              image: `${siteUrl}/profile-img.png`,
              jobTitle: "Full-Stack Developer",
              description:
                "Full-Stack Developer from Indonesia specializing in React, Laravel, PHP, JavaScript, and Kotlin.",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Cicurug",
                addressCountry: "ID",
              },
              sameAs: [
                "https://github.com/neddyap",
                "https://linkedin.com/in/neddy-avgha-prasetio/",
              ],
              knowsAbout: [
                "PHP",
                "Laravel",
                "JavaScript",
                "React",
                "Kotlin",
                "Tailwind CSS",
                "MySQL",
                "PostgreSQL",
                "Git",
                "Docker",
              ],
              alumniOf: {
                "@type": "EducationalOrganization",
                name: "Computer Science",
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Neddy Avgha Prasetio Portfolio",
              url: siteUrl,
              description:
                "Portfolio of Neddy Avgha Prasetio, a Full-Stack Developer from Indonesia.",
              author: {
                "@type": "Person",
                name: "Neddy Avgha Prasetio",
              },
              inLanguage: "en-US",
            }),
          }}
        />
      </head>
      <body className={`${inter.className} bg-background`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <SpaceBackground>
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow">{children}</main>
                <Footer />
              </div>
            </SpaceBackground>
          </AuthProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
