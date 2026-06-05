import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { ChatService } from './chat-services';
import { UsersService } from 'src/user/users-service';

// import { ChatDocument } from './schemas/chat-schema';
@Injectable()
@WebSocketGateway({
  cors: {
    origin: '*', // or your frontend URL
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly chatService: ChatService,
    private readonly usersService: UsersService,
  ) {}

  private server!: Server;

  afterInit(server: Server) {
    this.server = server;
    console.log('WebSocket server initialized');
  }

  handleConnection(client: Socket) {
    this.server.to(client.id).emit('connected');
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @MessageBody()
    data: {
      roomId: string;
      email: string;
      // userId: { name: string; email: string };
    },
    @ConnectedSocket() client: Socket,
  ) {
    const { roomId, email } = data;

    // /**
    //  * add current user to temporary room
    //  */
    const user = this.chatService.userJoin({
      roomId,
      email: email,
    });

    await client.join(user.roomId);
  }

  @SubscribeMessage('leaveRoom')
  async handleLeaveRoom(
    @MessageBody()
    data: {
      roomId: string;
      userData: { userId: string };
    },
    // @ConnectedSocket() client: Socket,
  ) {
    const { userData } = data;

    /**
     * remove current user from the room
     */
    this.chatService.userLeave(userData.userId);

    if (userData.userId === data.roomId) {
      await this.usersService.updateUserOnlineStatus(
        userData.userId,
        'offline',
      );
    }
  }

  @SubscribeMessage('message')
  async handleMessage(
    @MessageBody()
    data: {
      content: string;
      roomId: string;
      senderId: string;
    },
    // @ConnectedSocket() client: Socket,
  ) {
    const { content, roomId } = data;

    if (!content.trim()) return;

    this.server.to(roomId).emit('ai-loading', { isLoading: true });

    const result = await this.chatService.runConveration(content);

    // const result = 'how can i be of help to you';

    if (result) {
      this.server.to(roomId).emit('ai-loading', { isLoading: false });
      this.server.to(roomId).emit('message', {
        // content: result.result,
        content:
          result.result ||
          result.error ||
          "Sorry, I couldn't process your request.",
        roomId,
        senderId: 'ai',
        createdAt: new Date(),
      });
    }
  }
}
