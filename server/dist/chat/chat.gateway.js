"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
const chat_services_1 = require("./chat-services");
const users_service_1 = require("../user/users-service");
let ChatGateway = class ChatGateway {
    chatService;
    usersService;
    constructor(chatService, usersService) {
        this.chatService = chatService;
        this.usersService = usersService;
    }
    server;
    afterInit(server) {
        this.server = server;
        console.log('WebSocket server initialized');
    }
    handleConnection(client) {
        this.server.to(client.id).emit('connected');
    }
    handleDisconnect(client) {
        console.log(`Client disconnected: ${client.id}`);
    }
    async handleJoinRoom(data, client) {
        const { roomId, email } = data;
        const user = this.chatService.userJoin({
            roomId,
            email: email,
        });
        await client.join(user.roomId);
    }
    async handleLeaveRoom(data) {
        const { userData } = data;
        this.chatService.userLeave(userData.userId);
        if (userData.userId === data.roomId) {
            await this.usersService.updateUserOnlineStatus(userData.userId, 'offline');
        }
    }
    async handleMessage(data) {
        const { content, roomId } = data;
        if (!content.trim())
            return;
        this.server.to(roomId).emit('ai-loading', { isLoading: true });
        const result = await this.chatService.runConveration(content);
        if (result) {
            this.server.to(roomId).emit('ai-loading', { isLoading: false });
            this.server.to(roomId).emit('message', {
                content: result.result ||
                    result.error ||
                    "Sorry, I couldn't process your request.",
                roomId,
                senderId: 'ai',
                createdAt: new Date(),
            });
        }
    }
};
exports.ChatGateway = ChatGateway;
__decorate([
    (0, websockets_1.SubscribeMessage)('joinRoom'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleJoinRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leaveRoom'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleLeaveRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('message'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleMessage", null);
exports.ChatGateway = ChatGateway = __decorate([
    (0, common_1.Injectable)(),
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        },
    }),
    __metadata("design:paramtypes", [chat_services_1.ChatService,
        users_service_1.UsersService])
], ChatGateway);
//# sourceMappingURL=chat.gateway.js.map