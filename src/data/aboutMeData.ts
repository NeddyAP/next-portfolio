import React from 'react';
import {
  Music,
  Book,
  Gamepad,
} from "lucide-react";
import {
  DiGit,
  DiJava,
} from "react-icons/di";
import {
  SiFirebase,
  SiPostgresql,
  SiPhp,
  SiMysql,
  SiKotlin,
  SiVisualstudiocode,
  SiPostman,
  SiMicrosoftazure,
  SiJetbrains,
  SiWindows,
  SiDocker,
  SiGithub,
} from "react-icons/si";
import type { LucideProps } from "lucide-react";
import { RiJavascriptFill } from 'react-icons/ri';
import { FaReact } from 'react-icons/fa6';
import { FaLaravel } from 'react-icons/fa';
import { AiOutlineLinux } from 'react-icons/ai';

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
  const birthDate = new Date(2001, 9, 16); // Month is 0-based, so 9 = October
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

const age = calculateAge();
export const aboutMeText = "Hi, I am Neddy Avgha Prasetio from Cicurug, am " + age + " years old from Bogor, Indonesia. I am currently studying for a Bachelor's degree in Computer Science. Apart from coding, some other activities that I love to do!";

export const aboutInfo: AboutInfo = {
  name: "Neddy Avgha Prasetio",
  location: "Cicurug, Indonesia",
  education: {
    degree: "Bachelor's",
    field: "Computer Science",
  },
  hobbies: [
    "Playing Games",
    "Reading Comics",
    "Watching Movies",
  ],
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
  { name: "JavaScript", icon: RiJavascriptFill },
  { name: "Java", icon: DiJava },
  { name: "Kotlin", icon: SiKotlin },
  { name: "Laravel", icon: FaLaravel },
  { name: "React", icon: FaReact },
  { name: "Git", icon: DiGit },
  { name: "MySQL", icon: SiMysql },
  { name: "Firebase", icon: SiFirebase },
  { name: "PostgreSQL", icon: SiPostgresql },
];

export const tools = [
  { name: "VS Code", icon: SiVisualstudiocode },
  { name: "Postman", icon: SiPostman },
  { name: "Azure", icon: SiMicrosoftazure },
  { name: "JetBrains", icon: SiJetbrains },
  { name: "Windows", icon: SiWindows },
  { name: "Linux", icon: AiOutlineLinux },
  { name: "Docker", icon: SiDocker },
  { name: "GitHub", icon: SiGithub },
];

export const githubUsername = "neddy1298";
