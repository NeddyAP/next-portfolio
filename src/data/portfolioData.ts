import codecrafter from "@/assets/projects/codecrafter.png";
import portfolio from "@/assets/projects/portfolio.png";
import streamlt from "@/assets/projects/streamlt.png";
import managementKendaraan from "@/assets/projects/managementKendaraan.png";
import rutbis from "@/assets/projects/rutbis.png";

export const projects = [
  {
    title: "Management Kendaraan",
    description: "Web app that is designed to help users manage their vehicles, including adding, updating, and deleting vehicles. Built with Laravel and MySQL.",
    image: managementKendaraan,
    link: "https://github.com/neddy1298/management-kendaraan",
    technologies: ["Laravel", "MySQL", "PHP", "Bootstrap"]
  },{
    title: "RutBis",
    description: "Mobile app that is designed to help users find the best route to their destination by providing the shortest route, the fastest route, and the route with the least traffic. Built with Kotlin.",
    image: rutbis,
    link: "https://github.com/neddy1298/rutbis",
    technologies: ["Kotlin", "Android Studio" ]
  },{
    title: "Portfolio",
    description: "My personal Personal Website showcasing my skills, and projects. Built with Javascripts with React library.",
    image: portfolio,
    link: "https://github.com/neddy1298/next-portfolio",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "React"]
  },{
    title: "Code Crafter",
    description: "Landing Page for a fictional web development company, showcasing services, portfolio, and contact information. Built with HTML, CSS, and Bootstrap.",
    image: codecrafter,
    link: "https://github.com/neddy1298/companyprofile",
    technologies: ["HTML", "CSS", "Bootstrap", "JavaScript"]
  },{
    title: "Streamlt",
    description: "Mobile app designed to stream movies and tv shows, discover new movies and tv shows, and manage your watchlist. Built with Flutter and Firebase.",
    image: streamlt,
    link: "https://github.com/neddy1298/streamlt",
    technologies: ["Flutter", "Dart", "Firebase", "REST API"]
  },
];
