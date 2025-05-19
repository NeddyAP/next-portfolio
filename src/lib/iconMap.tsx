import React from "react";
import { Music, Book, Gamepad, LucideProps, GraduationCap, Briefcase } from "lucide-react";
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
import { MdWorkOutline } from "react-icons/md";
import { RiTailwindCssFill } from "react-icons/ri";
import { FaReact, FaLaravel } from "react-icons/fa";
import { AiOutlineLinux } from "react-icons/ai";
import { BiLogoJavascript, BiLogoVisualStudio } from "react-icons/bi";

// Define a more generic type for react-icons as they don't have a shared base props type like LucideProps
type ReactIconProps = { className?: string; size?: string | number; title?: string;[key: string]: any; };

export interface IconComponentProps extends LucideProps, ReactIconProps {}

export const iconMap: { [key: string]: React.ComponentType<IconComponentProps> } = {
  Music: Music,
  Book: Book,
  Gamepad: Gamepad,
  SiPhp: SiPhp,
  FaLaravel: FaLaravel,
  BiLogoJavascript: BiLogoJavascript,
  RiTailwindCssFill: RiTailwindCssFill,
  FaReact: FaReact,
  SiKotlin: SiKotlin,
  DiGit: DiGit,
  SiMysql: SiMysql,
  SiPostgresql: SiPostgresql,
  BiLogoVisualStudio: BiLogoVisualStudio,
  SiPostman: SiPostman,
  SiJetbrains: SiJetbrains,
  DiWindows: DiWindows,
  AiOutlineLinux: AiOutlineLinux,
  SiDocker: SiDocker,
  SiGithub: SiGithub,
  LuGraduationCap: GraduationCap,
  LuBriefcase: Briefcase,
  MdWorkOutline: MdWorkOutline,
  // Add any other icons you might use here
};

export const getIcon = (iconName: string | undefined | null): React.ComponentType<IconComponentProps> | null => {
  if (!iconName || !iconMap[iconName]) {
    // Return a default icon or null if not found
    // For now, returning null, but you could return a placeholder e.g. HelpCircle
    return null; 
  }
  return iconMap[iconName];
};
