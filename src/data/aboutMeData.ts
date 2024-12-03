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
  SiSpringboot,
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

export const aboutMeText = "Hi Everyone, I am Neddy Avgha Prasetio from Cicurug, Indonesia. I am currently studying for a Bachelor's degree in Computer Science. Apart from coding, some other activities that I love to do!";

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
  { name: "Spring Boot", icon: SiSpringboot },
  { name: "Git", icon: DiGit },
  { name: "Firebase", icon: SiFirebase },
  { name: "PostgreSQL", icon: SiPostgresql },
  { name: "MySQL", icon: SiMysql },
];

export const tools = [
  { name: "VS Code", icon: SiVisualstudiocode },
  { name: "Postman", icon: SiPostman },
  { name: "Azure", icon: SiMicrosoftazure },
  { name: "JetBrains", icon: SiJetbrains },
  { name: "Windows", icon: SiWindows },
  { name: "Docker", icon: SiDocker },
  { name: "GitHub", icon: SiGithub },
];

export const githubUsername = "neddy1298";
