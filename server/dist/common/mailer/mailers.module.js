"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailersModule = void 0;
const common_1 = require("@nestjs/common");
const mailer_1 = require("@nestjs-modules/mailer");
const config_1 = require("@nestjs/config");
const ejs_adapter_1 = require("@nestjs-modules/mailer/dist/adapters/ejs.adapter");
const path = require("path");
const mailer_service_1 = require("./mailer.service");
const googleapis_1 = require("googleapis");
let MailersModule = class MailersModule {
};
exports.MailersModule = MailersModule;
exports.MailersModule = MailersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule,
            mailer_1.MailerModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: async (configService) => {
                    const oauth2Client = new googleapis_1.google.auth.OAuth2(configService.get('EMAIL_CLIENT_ID'), configService.get('EMAIL_CLIENT_SECRET'), configService.get('EMAIL_REDIRECT_URI'));
                    oauth2Client.setCredentials({
                        refresh_token: configService.get('EMAIL_REFRESH_TOKEN'),
                    });
                    const result = await oauth2Client.getAccessToken();
                    const accessToken = result.token;
                    return {
                        transport: {
                            service: configService.get('EMAIL_SMTP_HOST'),
                            auth: {
                                type: 'OAuth2',
                                user: configService.get('EMAIL_USER'),
                                clientId: configService.get('EMAIL_CLIENT_ID'),
                                clientSecret: configService.get('EMAIL_CLIENT_SECRET'),
                                refreshToken: configService.get('EMAIL_REFRESH_TOKEN'),
                                accessToken: accessToken,
                                secure: true,
                            },
                            tls: {
                                rejectUnauthorized: false,
                            },
                            connectionTimeout: 20000,
                            greetingTimeout: 15000,
                            socketTimeout: 20000,
                        },
                        defaults: {
                            from: '"No Reply" <admin.learncode@gmail.com>',
                        },
                        template: {
                            dir: process.env.NODE_ENV === 'production'
                                ? path.join(__dirname, 'templates')
                                : path.join(process.cwd(), 'src/common/mailer/templates'),
                            adapter: new ejs_adapter_1.EjsAdapter(),
                            options: {
                                strict: false,
                            },
                        },
                    };
                },
            }),
        ],
        providers: [mailer_service_1.EmailService],
        exports: [mailer_service_1.EmailService],
    })
], MailersModule);
//# sourceMappingURL=mailers.module.js.map