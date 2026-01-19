import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat, ChatDocument } from './schemas/chat-schema';
import { CreateChatDto } from './dto/create-chat.dto';

/**
 * @class UsersService
 * @description Manages all user-related operations.
 * This includes creating users, verifying them, and finding users by their ID or verification code.
 */
@Injectable()
export class ChatService {
  private users: {
    name: string;
    roomId: string;
    email: string;
    userId: string;
  }[] = [];
  constructor(@InjectModel(Chat.name) private chatModel: Model<ChatDocument>) {}

  /**
   * @method userJoin
   * @description Adds a user to the active users list or updates their information if they already exist.
   * @param {Object} params - The parameters containing user details.
   * @param {string} params.contactName - The name of the user.
   * @param {string} params.roomId - The ID of the room the user is joining.
   * @param {string} params.phoneNumber - The phone number of the user.
   */
  userJoin({
    name,
    roomId,
    email,
    userId,
  }: {
    name: string;
    roomId: string;
    email: string;
    userId: string;
  }) {
    const user = { name, roomId, email, userId };

    const findUserIndexIfExist = this.users.findIndex(
      (activeUser: {
        name: string;
        roomId: string;
        email: string;
        userId: string;
      }) => activeUser.userId === user.userId,
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
      (activeUser: { name: string; roomId: string; email: string }) =>
        activeUser.roomId === roomId,
    );
  }

  /**
   * @method userLeave
   * @description Removes a user from the active users list based on their userId.
   * @param {string} userId - The userId of the user to be removed.
   */
  userLeave(userId: string) {
    this.users = this.users.filter((user) => user.userId !== userId);
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
}
