import { Module } from '@nestjs/common';
import { ChatService } from './chat-services';
import { UsersModule } from 'src/user/users-module';
import { ChatGateway } from './chat.gateway';
import { AuthModule } from 'src/auth/auth-module';


@Module({
  imports: [
    UsersModule,
    AuthModule,
  ],
  providers: [ChatGateway, ChatService],
  controllers: [], // No controllers needed for WebSocket-based communication
  exports: [ChatService], // Export ChatService to use in other modules
})
export class ChatModule {}
