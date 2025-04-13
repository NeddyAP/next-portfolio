import { Button } from "@/components/ui/button";
import { socialLinks, footerConfig } from "@/data/footerData";

export default function Footer() {
	return (
		<footer className="border-t">
			<div className="container mx-auto px-4 py-8">
				<div className=" items-center justify-center gap-4 md:h-24 flex-col flex">
					<div className="flex items-center space-x-1">
						{" "}
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
										<span className="sr-only">
											{link.name}
										</span>
									</a>
								</Button>
							);
						})}
					</div>
					<p className="text-center text-sm leading-loose text-muted-foreground">
						{new Date().getFullYear()} {footerConfig.copyrightName}
						©️. All rights reserved.
					</p>
				</div>
			</div>
		</footer>
	);
}
