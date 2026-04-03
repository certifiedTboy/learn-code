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
