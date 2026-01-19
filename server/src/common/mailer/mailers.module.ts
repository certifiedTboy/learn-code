import { Module } from '@nestjs/common';
import { MailerModule, MailerOptions } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import * as path from 'path';
import { EmailService } from './mailer.service';
import { google } from 'googleapis';

@Module({
  imports: [
    ConfigModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const oauth2Client = new google.auth.OAuth2(
          configService.get<string>('EMAIL_CLIENT_ID'),
          configService.get<string>('EMAIL_CLIENT_SECRET'),
          configService.get<string>('EMAIL_REDIRECT_URI'),
        );

        oauth2Client.setCredentials({
          refresh_token: configService.get<string>('EMAIL_REFRESH_TOKEN'),
        });

        const result = await oauth2Client.getAccessToken();
        const accessToken = result.token;

        return {
          transport: {
            service: configService.get<string>('EMAIL_SMTP_HOST'),
            auth: {
              type: 'OAuth2',
              user: configService.get<string>('EMAIL_USER'),
              clientId: configService.get<string>('EMAIL_CLIENT_ID'),
              clientSecret: configService.get<string>('EMAIL_CLIENT_SECRET'),
              refreshToken: configService.get<string>('EMAIL_REFRESH_TOKEN'),
              accessToken: accessToken,
            },

            tls: {
              rejectUnauthorized: false, // optional if running in Docker/container
            },
            connectionTimeout: 20000, // increase timeout
            greetingTimeout: 15000,
            socketTimeout: 20000,
          },
          defaults: {
            from: '"No Reply" <etosin70@gmail.com>',
          },
          template: {
            dir:
              process.env.NODE_ENV === 'production'
                ? path.join(__dirname, 'templates')
                : path.join(process.cwd(), 'src/common/mailer/templates'),
            adapter: new EjsAdapter(),
            options: {
              strict: false,
            },
          },
        } as MailerOptions;
      },
    }),
  ],
  providers: [EmailService],
  exports: [EmailService], // export to use in other modules
})
export class MailersModule {}
