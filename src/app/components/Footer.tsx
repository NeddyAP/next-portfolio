import { Github, Linkedin, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Footer() {
	return (
		<footer className="border-t">
			<div className="container mx-auto px-4 py-8">
				<div className="flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
					<p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
						© {new Date().getFullYear()} Neddy. All rights reserved.
					</p>
					<div className="flex items-center space-x-4">
						<Button variant="ghost" size="icon">
							<Github className="h-5 w-5" />
							<span className="sr-only">GitHub</span>
						</Button>
						<Button variant="ghost" size="icon">
							<Linkedin className="h-5 w-5" />
							<span className="sr-only">LinkedIn</span>
						</Button>
						<Button variant="ghost" size="icon">
							<Twitter className="h-5 w-5" />
							<span className="sr-only">Twitter</span>
						</Button>
					</div>
				</div>
			</div>
		</footer>
	);
}
