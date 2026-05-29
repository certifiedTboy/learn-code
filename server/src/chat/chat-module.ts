import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatService } from './chat-services';
import { UsersModule } from 'src/user/users-module';
import { ChatGateway } from './chat.gateway';
import { AuthModule } from 'src/auth/auth-module';
import { Chat, ChatSchema } from './schemas/chat-schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
    UsersModule,
    AuthModule,
  ],
  providers: [ChatGateway, ChatService],
  controllers: [], // No controllers needed for WebSocket-based communication
  exports: [ChatService], // Export ChatService to use in other modules
})
export class ChatModule {}
