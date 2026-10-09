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
}
