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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const genai_1 = require("@google/genai");
let ChatService = class ChatService {
    configService;
    users = [];
    googleGenAi;
    ai_api_key;
    constructor(configService) {
        this.configService = configService;
        this.ai_api_key = this.configService.get('AI_API_KEY');
        this.googleGenAi = new genai_1.GoogleGenAI({
            apiKey: this.ai_api_key,
        });
    }
    userJoin({ roomId, email }) {
        const user = { roomId, email };
        const findUserIndexIfExist = this.users.findIndex((activeUser) => activeUser.userId === user.roomId);
        if (findUserIndexIfExist >= 0) {
            this.users[findUserIndexIfExist] = user;
            return user;
        }
        this.users.push(user);
        return user;
    }
    getRoomUsers(roomId) {
        return this.users.filter((activeUser) => activeUser.roomId === roomId);
    }
    userLeave(roomId) {
        this.users = this.users.filter((user) => user.roomId !== roomId);
    }
    async runConveration(message) {
        try {
            const response = await this.googleGenAi.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: message,
                config: {
                    systemInstruction: 'You are an AI model strictly for technical and engineering related questions only. All other questions not related to this should be flagged and you should politely refuse to answer them.',
                },
            });
            if (!response || !response?.text) {
                throw new Error('Something went wrong while processing your request.');
            }
            return { result: response.text };
        }
        catch (error) {
            if (error instanceof Error) {
                return { error: 'Something went wrong while processing your request.' };
            }
            else {
                return { error: 'An unexpected error occurred.' };
            }
        }
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], ChatService);
//# sourceMappingURL=chat-services.js.map