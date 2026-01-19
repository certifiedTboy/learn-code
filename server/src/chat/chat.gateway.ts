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

  private server: Server;

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
      userData: { name: string; email: string; userId: string };
      // userId: { name: string; email: string };
    },
    @ConnectedSocket() client: Socket,
  ) {
    const { roomId, userData } = data;

    // /**
    //  * add current user to temporary room
    //  */
    const user = this.chatService.userJoin({
      name: userData.name,
      roomId,
      email: userData.email,
      userId: userData.userId,
    });

    await client.join(user.roomId);

    if (user.userId !== roomId) {
      await this.usersService.clearUserUnreadMessageCount(roomId);
    } else {
      await this.usersService.updateUserOnlineStatus(roomId, 'online');
    }
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
      message: string;
      roomId: string;
      senderId: string;
    },
    // @ConnectedSocket() client: Socket,
  ) {
    const { message, roomId, senderId } = data;

    if (!message.trim()) return;

    this.server.to(roomId).emit('message', {
      message,
      roomId,
      senderId,
      createdAt: new Date(),
    });

    if (senderId === roomId) {
      const activeUsers = this.chatService.getRoomUsers(roomId);

      if (activeUsers.length === 1) {
        const user = await this.usersService.checkUserExistById(senderId);
        if (user) {
          // if (user?.unreadMessagesCount <= 0) {
          //   this.server.to(roomId).emit('message', {
          //     message: `Hello ${user.firstName}, you can send your message, someone will attend to you shortly.`,
          //     roomId,
          //     senderId: 'system',
          //     createdAt: new Date(),
          //   });
          // }

          // user.unreadMessagesCount += 1;

          await this.usersService.increaseUserUnreadMessageCount(
            user._id.toString(),
          );
        }
      }
    }
    // Save chat message to database
    await this.chatService.createChat({
      message,
      roomId,
      senderId,
    });
  }
}
