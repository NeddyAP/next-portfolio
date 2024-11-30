"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Moon, Sun, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Navbar() {
	const { setTheme } = useTheme();
	const [scrolled, setScrolled] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setScrolled(window.scrollY > 20);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const navItems = [
		{ href: "#about", label: "About" },
		{ href: "#education", label: "Education" },
		{ href: "#portfolio", label: "Portfolio" },
		{ href: "#contact", label: "Contact" },
	];

	return (
		<nav
			className={`sticky top-0 z-50 w-full transition-all duration-300 ${
				scrolled
					? "bg-background/80 backdrop-blur-md shadow-md"
					: "bg-transparent"
			}`}
		>
			<div className="container mx-auto px-4">
				<div className="flex items-center justify-between py-4">
					<Link
						href="/"
						className={`text-2xl font-bold transition-all duration-300 ${
							scrolled
								? "opacity-0 absolute left-4 lg:left-8"
								: "opacity-100"
						}`}
					>
						Your Name
					</Link>
					<div className="flex items-center space-x-4 ml-auto">
						<div
							className={`hidden md:flex items-center space-x-4 transition-all duration-300 ${
								scrolled
									? "absolute left-1/2 transform -translate-x-1/2"
									: ""
							}`}
						>
							{navItems.map((item) => (
								<Link
									key={item.href}
									href={item.href}
									className="text-sm font-medium hover:text-primary transition-colors"
								>
									{item.label}
								</Link>
							))}
						</div>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" size="icon">
									<Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
									<Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
									<span className="sr-only">
										Toggle theme
									</span>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuItem
									onClick={() => setTheme("light")}
								>
									Light
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => setTheme("dark")}
								>
									Dark
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => setTheme("system")}
								>
									System
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
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
							<SheetContent side="right">
								<nav className="flex flex-col space-y-4">
									{navItems.map((item) => (
										<Link
											key={item.href}
											href={item.href}
											className="text-sm font-medium hover:text-primary transition-colors"
										>
											{item.label}
										</Link>
									))}
								</nav>
							</SheetContent>
						</Sheet>
					</div>
				</div>
			</div>
		</nav>
	);
}
