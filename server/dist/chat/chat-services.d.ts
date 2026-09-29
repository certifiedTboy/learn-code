import { ConfigService } from '@nestjs/config';
export declare class ChatService {
    private readonly configService;
    private users;
    private googleGenAi;
    ai_api_key: string;
    constructor(configService: ConfigService);
    userJoin({ roomId, email }: {
        roomId: string;
        email: string;
    }): {
        roomId: string;
        email: string;
    };
    getRoomUsers(roomId: string): {
        roomId: string;
        email: string;
    }[];
    userLeave(roomId: string): void;
    runConveration(message: string): Promise<{
        result: string;
        error?: undefined;
    } | {
        error: string;
        result?: undefined;
    }>;
}
