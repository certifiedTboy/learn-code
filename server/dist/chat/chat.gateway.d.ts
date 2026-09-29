import { OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat-services';
import { UsersService } from "../user/users-service";
export declare class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly chatService;
    private readonly usersService;
    constructor(chatService: ChatService, usersService: UsersService);
    private server;
    afterInit(server: Server): void;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleJoinRoom(data: {
        roomId: string;
        email: string;
    }, client: Socket): Promise<void>;
    handleLeaveRoom(data: {
        roomId: string;
        userData: {
            userId: string;
        };
    }): Promise<void>;
    handleMessage(data: {
        content: string;
        roomId: string;
        senderId: string;
    }): Promise<void>;
}
