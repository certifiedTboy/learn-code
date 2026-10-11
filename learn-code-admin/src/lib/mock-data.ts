import { Command, GraduationCap, Lightbulb } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface SubTopic {
  title: string;
  contentURI: string;
  isVideo: boolean;
  isCompleted: boolean;
}

export interface CourseContent {
  mainTopic: string;
  description: string;
  subTopics: SubTopic[];
}

export interface Course {
  id?: string;
  name: string;
  description: string;
  image?: string;
  price: number | string;
  totalTopics: number;
  requiredDuration: number;
  subscribers: number;
  rating: number | string;
  skills: string | string[];
  contents: CourseContent[];
  _id?: string;
  __v?: string;
  createdAt?: string;
  updatedAt?: string;
  completion?: string;
  completed?: boolean;
  isExpired?: boolean;
}

export const CHAT_STARTER: { title: string; icon: LucideIcon }[] = [
  { title: "Explain a tricky concept", icon: Lightbulb },
  { title: "Help me debug my code", icon: Command },
  { title: "Plan my learning path", icon: GraduationCap },
];

export const languageAliases: Record<string, string> = {
  js: "javascript",
  jsx: "jsx",
  ts: "typescript",
  tsx: "tsx",
  html: "markup",
  xml: "markup",
  shell: "bash",
  sh: "bash",
  py: "python",
  rb: "ruby",
  cs: "csharp",
  "c#": "csharp",
  cpp: "cpp",
  "c++": "cpp",
};
