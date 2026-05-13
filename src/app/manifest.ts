import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Neddy Avgha Prasetio - Portfolio",
    short_name: "Neddy AP",
    description:
      "Portfolio of Neddy Avgha Prasetio, a Full-Stack Developer from Indonesia.",
    start_url: "/next-portfolio",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#0a0a0a",
    icons: [
      {
        src: "/next-portfolio/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
