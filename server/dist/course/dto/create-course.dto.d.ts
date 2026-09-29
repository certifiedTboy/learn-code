export declare class CreateCourseDto {
    readonly name: string;
    readonly description: string;
    readonly contents: {
        mainTopic: string;
        description: string;
        subTopics: [{
            title: string;
            contentURI: string;
            isVideo: boolean;
        }];
    }[];
    readonly skills: string[];
    readonly subscribers: number;
    readonly completed: number;
    readonly price: number;
    readonly rating: number;
    readonly totalTopics: number;
    readonly requiredDuration: number;
    readonly image: string;
    readonly percentageDiscount: number;
}
