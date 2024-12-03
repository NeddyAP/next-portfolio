"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Moon, Sun, Menu, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { navItems, resumePath, siteConfig } from "@/data/navbarData";

export default function Navbar() {
	const { setTheme, theme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	const handleScroll = (
		e: React.MouseEvent<HTMLAnchorElement>,
		href: string
	) => {
		e.preventDefault();
		const targetId = href.replace("#", "");
		const element = document.getElementById(targetId);
		element?.scrollIntoView({
			behavior: "smooth",
			block: "start",
		});
	};

	const toggleTheme = () => {
		setTheme(theme === "light" ? "dark" : "light");
	};

	return (
		<nav className="sticky top-0 z-50 w-full bg-background/30 backdrop-blur-md shadow-md">
			<div className="container mx-auto px-4 md:px-8 lg:px-16 xl:px-24">
				<div className="flex items-center justify-between py-4">
					<Link
						href="/"
						className="text-2xl font-bold hover:text-primary transition-colors"
					>
						{siteConfig.name}
					</Link>
					<div className="flex items-center space-x-4 ml-auto">
						<div className="hidden md:flex items-center space-x-4">
							{navItems.map((item) => (
								<Link
									key={item.href}
									href={item.href}
									onClick={(e) => handleScroll(e, item.href)}
									className="relative text-sm font-medium transition-colors hover:text-primary after:absolute after:left-0 after:bottom-[-4px] after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 hover:after:scale-x-100"
								>
									{item.label}
								</Link>
							))}
						</div>
						<Button
							onClick={() => window.open(resumePath, "_blank")}
							className="hidden md:flex"
						>
							<Download />
							Resume
						</Button>
						<Button
							variant="ghost"
							size="icon"
							onClick={toggleTheme}
							className="hover:bg-transparent"
						>
							{mounted && (
								<>
									{theme === "light" ? (
										<Moon className="h-[1.2rem] w-[1.2rem] transition-all" />
									) : (
										<Sun className="h-[1.2rem] w-[1.2rem] transition-all" />
									)}
								</>
							)}
							<span className="sr-only">Toggle theme</span>
						</Button>
						<Sheet>
							<SheetTrigger asChild>
								<Button
									variant="ghost"
									size="icon"
									className="md:hidden"
								>
									<Menu className="h-5 w-5" />
									<span className="sr-only">Toggle menu</span>
								</Button>
							</SheetTrigger>
							<SheetContent
								side="right"
								className="bg-slate-900 bg-opacity-85"
							>
								<SheetHeader>
									<SheetTitle>Navigation Menu</SheetTitle>
								</SheetHeader>
								<nav className="flex flex-col space-y-4 mt-4">
									{navItems.map((item) => (
										<Link
											key={item.href}
											href={item.href}
											onClick={(e) =>
												handleScroll(e, item.href)
											}
											className="text-sm font-medium transition-all hover:text-primary hover:translate-x-2"
										>
											{item.label}
										</Link>
									))}
									<Button
										onClick={() =>
											window.open(resumePath, "_blank")
										}
										className="w-full mt-4"
									>
										<Download className="h-4 w-4" />
										Resume
									</Button>
								</nav>
							</SheetContent>
						</Sheet>
					</div>
				</div>
			</div>
		</nav>
	);
}
