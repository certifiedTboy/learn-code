import { Controller, UseGuards, Req, Get } from '@nestjs/common';
import { Request } from 'express';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ChatService } from './chat-services';
import { ResponseHandler } from '../common/response-handler/response-handler';
import { AuthGuard } from '../guard/auth-guard';

/**
 * @class ChatControllers
 * @description Handles all chat-related HTTP requests.
 * This includes creating chat rooms and retrieving existing chat rooms.
 */
@Controller({
  path: 'chats',
  version: '1',
})
@UseGuards(AuthGuard)
export class ChatControllers {
  constructor(private readonly chatService: ChatService) {}

  @Get(':chatRoomId')
  async getRoomChats(@Req() req: Request) {
    const { chatRoomId } = req.params;
    const page = Math.round(Math.abs(parseInt(req.query.page as string))) || 1;
    const limit =
      Math.round(Math.abs(parseInt(req.query.limit as string))) || 10;

    if (!chatRoomId) {
      throw new BadRequestException('Room ID is required');
    }

    try {
      // const { limit, skip } = ChatHelpers.getPaginationParams(page);
      const chats = await this.chatService.findChatByRoomId(
        chatRoomId,
        page,
        limit,
      );

      return ResponseHandler.ok(200, 'Chats retrieved successfully', chats);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new BadRequestException('', {
          cause: error.cause,
          description: error.message,
        });
      }
      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }
}
