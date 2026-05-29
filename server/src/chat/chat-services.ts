import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { Chat, ChatDocument } from './schemas/chat-schema';
import { CreateChatDto } from './dto/create-chat.dto';
import { GoogleGenAI } from '@google/genai';

/**
 * @class UsersService
 * @description Manages all user-related operations.
 * This includes creating users, verifying them, and finding users by their ID or verification code.
 */
@Injectable()
export class ChatService {
  private users: {
    roomId: string;
    email: string;
  }[] = [];
  private googleGenAi: GoogleGenAI;
  ai_api_key: string;
  constructor(
    @InjectModel(Chat.name) private chatModel: Model<ChatDocument>,
    private readonly configService: ConfigService,
  ) {
    this.ai_api_key = this.configService.get<string>('AI_API_KEY')!;

    this.googleGenAi = new GoogleGenAI({
      apiKey: this.ai_api_key,
    });
  }

  /**
   * @method userJoin
   * @description Adds a user to the active users list or updates their information if they already exist.
   * @param {Object} params - The parameters containing user details.
   * @param {string} params.contactName - The name of the user.
   * @param {string} params.roomId - The ID of the room the user is joining.
   * @param {string} params.phoneNumber - The phone number of the user.
   */
  userJoin({ roomId, email }: { roomId: string; email: string }) {
    const user = { roomId, email };

    const findUserIndexIfExist = this.users.findIndex(
      (activeUser: { roomId: string; email: string; userId: string }) =>
        activeUser.userId === user.roomId,
    );

    if (findUserIndexIfExist >= 0) {
      this.users[findUserIndexIfExist] = user;

      return user;
    }
    this.users.push(user);
    return user;
  }

  /**
   * @method getRoomUsers
   * @description Retrieves all users in a specific room based on the room ID.
   * @param {string} roomId - The ID of the room to find users in.
   */
  getRoomUsers(roomId: string) {
    return this.users.filter(
      (activeUser: { roomId: string; email: string }) =>
        activeUser.roomId === roomId,
    );
  }

  /**
   * @method userLeave
   * @description Removes a user from the active users list based on their roomId.
   * @param {string} roomId - The roomId of the user to be removed.
   */
  userLeave(roomId: string) {
    this.users = this.users.filter((user) => user.roomId !== roomId);
  }

  /**
   * @method createChat
   * @description Creates a new chat message in the specified room.
   * @param {CreateChatDto} CreateChatDto - The chat message to be created.
   */
  async createChat(createChatDto: CreateChatDto) {
    const createdChat = new this.chatModel(createChatDto);
    const chat = await createdChat.save();
    return chat;
  }

  /**
   * @method findChatByRoomId
   * @description Finds all chat messages in a specific room by its ID.
   * @param {string} chatRoomId - The ID of the room to find chat messages in.
   * @returns {Promise<ChatDocument[]>} - A promise that resolves to an array of chat messages.
   */
  async findChatByRoomId(
    chatRoomId: string,
    page: number,
    limit: number,
  ): Promise<ChatDocument[]> {
    const skip = (page - 1) * limit;

    const data = await this.chatModel
      .find({ roomId: chatRoomId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    return data;
  }

  /**
   * @method runConveration
   * @description Runs a conversation with the AI model using the provided message.
   * @param {string} message - The message to send to the AI model.
   */
  async runConveration(message: string) {
    try {
      const response = await this.googleGenAi.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: message,
      });

      if (!response || !response?.text) {
        throw new Error('Something went wrong while processing your request.');
      }

      return { result: response.text };
    } catch (error: unknown) {
      if (error instanceof Error) {
        return { error: 'Something went wrong while processing your request.' };
      } else {
        return { error: 'An unexpected error occurred.' };
      }
    }
  }
}
