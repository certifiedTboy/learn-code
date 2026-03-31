export interface SubTopic {
  title: string;
  contentURI: string;
  isVideo: boolean;
}

export interface CourseContent {
  mainTopic: string;
  description: string;
  subTopics: SubTopic[];
}

export interface Course {
  id: string;
  name: string;
  description: string;
  image?: string;
  price: number;
  totalTopics: number;
  requiredDuration: number;
  subscribers: number;
  rating: number;
  contents: CourseContent[];
}

export const INITIAL_COURSES: Course[] = [
  {
    id: "1",
    name: "Advanced React Patterns",
    description:
      "Master modern React patterns including compound components, render props, custom hooks, and performance optimization techniques used at scale.",
    image:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop",
    price: 79,
    totalTopics: 12,
    requiredDuration: 6,
    subscribers: 1420,
    rating: 4.8,
    contents: [
      {
        mainTopic: "React Fundamentals Deep Dive",
        description:
          "A thorough review of core React concepts before moving to advanced patterns.",
        subTopics: [
          {
            title: "Understanding the Virtual DOM",
            contentURI: "https://example.com/vdom",
            isVideo: true,
          },
          {
            title: "Re-renders and reconciliation",
            contentURI: "https://example.com/reconciliation",
            isVideo: false,
          },
          {
            title: "State batching in React 18",
            contentURI: "https://example.com/batching",
            isVideo: true,
          },
        ],
      },
      {
        mainTopic: "Compound Component Pattern",
        description:
          "Build flexible, composable components using the compound pattern.",
        subTopics: [
          {
            title: "Introduction to compound components",
            contentURI: "https://example.com/compound-intro",
            isVideo: true,
          },
          {
            title: "Using React Context for implicit state",
            contentURI: "https://example.com/context",
            isVideo: false,
          },
        ],
      },
    ],
  },
  {
    id: "2",
    name: "Full-Stack TypeScript Development",
    description:
      "Build end-to-end type-safe applications with TypeScript, from REST APIs to fully typed frontends with React and Next.js.",
    image:
      "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&auto=format&fit=crop",
    price: 99,
    totalTopics: 18,
    requiredDuration: 8,
    subscribers: 980,
    rating: 4.7,
    contents: [
      {
        mainTopic: "TypeScript Essentials",
        description:
          "Core TypeScript concepts you need before building full-stack apps.",
        subTopics: [
          {
            title: "Types vs Interfaces",
            contentURI: "https://example.com/ts-types",
            isVideo: false,
          },
          {
            title: "Generics in depth",
            contentURI: "https://example.com/ts-generics",
            isVideo: true,
          },
        ],
      },
    ],
  },
  {
    id: "3",
    name: "UI/UX Design for Developers",
    description:
      "Learn the principles of great design — typography, color, spacing, and interaction — specifically tailored for software developers.",
    image:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&auto=format&fit=crop",
    price: 49,
    totalTopics: 9,
    requiredDuration: 4,
    subscribers: 2100,
    rating: 4.9,
    contents: [
      {
        mainTopic: "Design Fundamentals",
        description:
          "Core visual design principles every developer should know.",
        subTopics: [
          {
            title: "Color theory basics",
            contentURI: "https://example.com/color",
            isVideo: true,
          },
          {
            title: "Typography rules",
            contentURI: "https://example.com/typography",
            isVideo: false,
          },
          {
            title: "Whitespace and rhythm",
            contentURI: "https://example.com/spacing",
            isVideo: true,
          },
        ],
      },
    ],
  },
];
