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
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const signature_v4_1 = require("@smithy/signature-v4");
const sha256_js_1 = require("@aws-crypto/sha256-js");
const protocol_http_1 = require("@smithy/protocol-http");
const axios_1 = require("axios");
let EmailService = class EmailService {
    configService;
    AWS_LAMBDA_URL;
    AWS_REGION;
    AWS_USER_ACCESS_KEY;
    AWS_USER_SECRET_ACCESS_KEY;
    constructor(configService) {
        this.configService = configService;
        this.AWS_LAMBDA_URL = this.configService.get('AWS_LAMBDA_URL');
        this.AWS_REGION = this.configService.get('AWS_REGION');
        this.AWS_USER_ACCESS_KEY = this.configService.get('AWS_USER_ACCESS_KEY');
        this.AWS_USER_SECRET_ACCESS_KEY = this.configService.get('AWS_USER_SECRET_ACCESS_KEY');
    }
    async sendVerificationMail(to, subject, verificationCode, firstName) {
        try {
            await this.sendEmailWithLamba(to, subject, firstName, { verificationCode, firstName }, 'verification-code');
        }
        catch (error) {
            if (error instanceof Error) {
                console.log(error);
            }
        }
    }
    async sendPasswordResetMail(to, subject, passwordResetCode, firstName) {
        try {
            await this.sendEmailWithLamba(to, subject, firstName, { passwordResetCode, firstName }, 'password-reset-code');
        }
        catch (error) {
            if (error instanceof Error) {
                console.log(error);
            }
        }
    }
    async sendPasswordChangeSuccessMail(to, subject, firstName) {
        try {
            await this.sendEmailWithLamba(to, subject, firstName, { firstName }, 'password-reset-success');
        }
        catch (error) {
            if (error instanceof Error) {
                console.log(error);
            }
        }
    }
    async sendAccountSetupSuccessMail(to, subject, firstName) {
        try {
            await this.sendEmailWithLamba(to, subject, firstName, { firstName }, 'account-setup-success');
        }
        catch (error) {
            if (error instanceof Error) {
                console.log(error);
            }
        }
    }
    async paymentSuccessMail(to, subject, firstName, amount, paymentId, courseName) {
        try {
            await this.sendEmailWithLamba(to, subject, firstName, { firstName, amount, paymentId, courseName }, 'payment-success');
        }
        catch (error) {
            if (error instanceof Error) {
                console.log(error);
            }
        }
    }
    async paymentUpdateSuccessMail(to, subject, firstName, amount, paymentId, courseName) {
        try {
            await this.sendEmailWithLamba(to, subject, firstName, { firstName, amount, paymentId, courseName }, 'payment-update');
        }
        catch (error) {
            if (error instanceof Error) {
                console.log(error);
            }
        }
    }
    async sendEmailWithLamba(to, subject, name, data, emailType) {
        try {
            if (!this.AWS_LAMBDA_URL ||
                !this.AWS_REGION ||
                !this.AWS_USER_ACCESS_KEY ||
                !this.AWS_USER_SECRET_ACCESS_KEY) {
                return console.log('AWS credentials are not provided');
            }
            const url = new URL(this.AWS_LAMBDA_URL);
            const credentials = {
                accessKeyId: this.AWS_USER_ACCESS_KEY,
                secretAccessKey: this.AWS_USER_SECRET_ACCESS_KEY,
            };
            const body = JSON.stringify({ ...data, to, subject, name, emailType });
            const request = new protocol_http_1.HttpRequest({
                protocol: url.protocol,
                hostname: url.hostname,
                port: url.port ? Number(url.port) : undefined,
                method: 'POST',
                path: url.pathname || '/',
                headers: {
                    host: url.host,
                    'content-type': 'application/json',
                },
                body,
            });
            const signer = new signature_v4_1.SignatureV4({
                credentials,
                region: this.AWS_REGION,
                service: 'lambda',
                sha256: sha256_js_1.Sha256,
            });
            const signedRequest = await signer.sign(request);
            const response = await axios_1.default.post(this.AWS_LAMBDA_URL, body, {
                headers: signedRequest.headers,
            });
            return response;
        }
        catch (error) {
            if (error instanceof Error) {
                console.log(error);
            }
        }
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], EmailService);
//# sourceMappingURL=mailer.service.js.map