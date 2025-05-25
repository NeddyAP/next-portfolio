// This file is kept for reference but the portfolio now uses dynamic data from Supabase
// The projects are fetched from the database in the main page component

export const projects = [
	{
		title: "Global Competency",
		description:
			"Company profile website for certification and training company, showcasing services, portfolio, and contact information. Built with Laravel and React JS with MySQL database.",
		image: "/projects/globalcompetency.png",
		link: "https://globalcompetency.id/",
		technologies: [
			"Laravel",
			"MySQL",
			"PHP",
			"React",
			"Tailwind CSS",
			"Shadcn UI",
		],
	},
	{
		title: "Vehicle Management System",
		description:
			"Web app that is designed to help users manage their vehicles, including adding, updating, and deleting vehicles. Built with Laravel and MySQL.",
		image: "/projects/managementKendaraan.png",
		link: "https://github.com/neddyap/management-kendaraan",
		technologies: ["Laravel", "MySQL", "PHP", "Bootstrap"],
	},
	{
		title: "RutBis",
		description:
			"Mobile app that is designed to help users find the best route to their destination by providing the shortest route, the fastest route, and the route with the least traffic. Built with Kotlin.",
		image: "/projects/rutbis.png",
		link: "https://github.com/neddyap/rutbis",
		technologies: ["Kotlin", "Android Studio"],
	},
	{
		title: "Portfolio",
		description:
			"My personal Personal Website showcasing my skills, and projects. Built with Javascripts with React library.",
		image: "/projects/portfolio.png",
		link: "https://github.com/neddyap/next-portfolio",
		technologies: ["Next.js", "TypeScript", "Tailwind CSS", "React"],
	},
	{
		title: "Code Crafter",
		description:
			"Landing Page for a web development company, showcasing services, portfolio, and contact information. Built with HTML, CSS, and Bootstrap.",
		image: "/projects/codecrafter.png",
		link: "https://github.com/neddyap/companyprofile",
		technologies: ["HTML", "CSS", "Bootstrap", "JavaScript"],
	},
	{
		title: "Streamlt",
		description:
			"Mobile app designed to stream movies and tv shows, discover new movies and tv shows, and manage your watchlist. Built with Flutter and Firebase.",
		image: "/projects/streamlt.png",
		link: "https://github.com/neddyap/streamlt",
		technologies: ["Flutter", "Dart", "Firebase", "REST API"],
	},
];
