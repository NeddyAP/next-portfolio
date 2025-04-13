import React from "react";
import { Music, Book, Gamepad } from "lucide-react";
import { DiGit, DiWindows } from "react-icons/di";
import {
	SiPostgresql,
	SiPhp,
	SiMysql,
	SiKotlin,
	SiPostman,
	SiJetbrains,
	SiDocker,
	SiGithub,
} from "react-icons/si";
import type { LucideProps } from "lucide-react";
import { RiTailwindCssFill } from "react-icons/ri";
import { FaReact } from "react-icons/fa6";
import { FaLaravel } from "react-icons/fa";
import { AiOutlineLinux } from "react-icons/ai";
import { BiLogoJavascript, BiLogoVisualStudio } from "react-icons/bi";

export interface Skill {
	name: string;
	icon: React.ComponentType<LucideProps>;
}

interface AboutInfo {
	name: string;
	location: string;
	education: {
		degree: string;
		field: string;
	};
	hobbies: string[];
	quote: {
		text: string;
		author: string;
	};
}

const calculateAge = () => {
	const birthDate = new Date(2001, 9, 16);
	const today = new Date();
	let age = today.getFullYear() - birthDate.getFullYear();
	const monthDiff = today.getMonth() - birthDate.getMonth();

	if (
		monthDiff < 0 ||
		(monthDiff === 0 && today.getDate() < birthDate.getDate())
	) {
		age--;
	}

	return age;
};

const age = calculateAge();
export const aboutMeText = `Hello! I'm Neddy Avgha Prasetio, a ${age}-year-old Computer Science student from Cicurug, Indonesia. While I'm passionate about coding and pursuing my Bachelor's degree, I also love diving into other activities!`;

export const aboutInfo: AboutInfo = {
	name: "Neddy Avgha Prasetio",
	location: "Cicurug, Indonesia",
	education: {
		degree: "Bachelor's",
		field: "Computer Science",
	},
	hobbies: ["Playing Games", "Reading Comics", "Watching Movies"],
	quote: {
		text: "Simple But Better!",
		author: "Neddy Avgha Prasetio",
	},
};

export const hobbies = [
	{ name: "Music", icon: Music },
	{ name: "Reading Comic", icon: Book },
	{ name: "Playing Games", icon: Gamepad },
];

export const skillset = [
	{ name: "PHP", icon: SiPhp },
	{ name: "Laravel", icon: FaLaravel },
	{ name: "JavaScript", icon: BiLogoJavascript },
	{ name: "Tailwind CSS", icon: RiTailwindCssFill },
	{ name: "React", icon: FaReact },
	{ name: "Kotlin", icon: SiKotlin },
	{ name: "Git", icon: DiGit },
	{ name: "MySQL", icon: SiMysql },
	{ name: "PostgreSQL", icon: SiPostgresql },
];

export const tools = [
	{ name: "VS Code", icon: BiLogoVisualStudio },
	{ name: "Postman", icon: SiPostman },
	{ name: "JetBrains", icon: SiJetbrains },
	{ name: "Windows", icon: DiWindows },
	{ name: "Linux", icon: AiOutlineLinux },
	{ name: "Docker", icon: SiDocker },
	{ name: "GitHub", icon: SiGithub },
];

export const githubUsername = "neddyap";
