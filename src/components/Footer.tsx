import { Button } from "@/components/ui/button";
import { socialLinks, footerConfig } from "@/data/footerData";

export default function Footer() {
	return (
		<footer className="border-t">
			<div className="container mx-auto px-4 py-8">
				<div className="flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
					<p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
						{new Date().getFullYear()} {footerConfig.copyrightName}. All rights reserved.
					</p>
					<div className="flex items-center space-x-4">
						{socialLinks.map((link) => {
							const Icon = link.icon;
							return (
								<Button
									key={link.name}
									variant="ghost"
									size="icon"
									asChild
								>
									<a
										href={link.url}
										target="_blank"
										rel="noopener noreferrer"
										aria-label={link.name}
									>
										<Icon className="h-5 w-5" />
										<span className="sr-only">{link.name}</span>
									</a>
								</Button>
							);
						})}
					</div>
				</div>
			</div>
		</footer>
	);
}
