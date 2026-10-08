"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nest_winston_1 = require("nest-winston");
const logger_config_1 = require("./common/logger/logger.config");
const core_1 = require("@nestjs/core");
const throttler_1 = require("@nestjs/throttler");
const http_exceptions_filter_1 = require("./common/exceptions/http-exceptions.filter");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const users_module_1 = require("./user/users-module");
const auth_module_1 = require("./auth/auth-module");
const mongoose_1 = require("@nestjs/mongoose");
const chat_module_1 = require("./chat/chat-module");
const queue_module_1 = require("./queue/queue-module");
const course_module_1 = require("./course/course-module");
const bullmq_1 = require("@nestjs/bullmq");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forRootAsync({
                imports: [config_1.ConfigModule, nest_winston_1.WinstonModule.forRoot(logger_config_1.loggerConfig)],
                useFactory: (configService) => ({
                    uri: configService.get('MONGO_URI'),
                }),
                inject: [config_1.ConfigService],
            }),
            bullmq_1.BullModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    connection: {
                        host: configService.get('REDIS_HOST_2'),
                        port: configService.get('REDIS_PORT_2'),
                        password: configService.get('REDIS_PASSWORD_2'),
                        user: configService.get('REDIS_USER'),
                    },
                    defaultJobOptions: {
                        removeOnComplete: true,
                        removeOnFail: true,
                    },
                }),
                inject: [config_1.ConfigService],
            }),
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                cache: true,
            }),
            throttler_1.ThrottlerModule.forRoot({
                throttlers: [
                    {
                        ttl: 60000,
                        limit: 100,
                    },
                ],
            }),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            chat_module_1.ChatModule,
            queue_module_1.QueueModule,
            course_module_1.CourseModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            {
                provide: core_1.APP_FILTER,
                useClass: http_exceptions_filter_1.HttpExceptionFilter,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map