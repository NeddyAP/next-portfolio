import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ThemeProvider } from "../components/ThemeProvider";
import SpaceBackground from "../components/SpaceBackground";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
	title: "Neddy AP - Portfolio",
	description: "Professional portfolio showcasing my work and skills",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${inter.className} bg-background`}>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<SpaceBackground>
						<div className="flex flex-col min-h-screen">
							<Navbar />
							<main className="flex-grow">{children}</main>
							<Footer />
						</div>
					</SpaceBackground>
				</ThemeProvider>
			</body>
		</html>
	);
}
