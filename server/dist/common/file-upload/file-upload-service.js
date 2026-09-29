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
exports.FileUploadService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const cloudinary_1 = require("cloudinary");
let FileUploadService = class FileUploadService {
    configService;
    cloudinary;
    constructor(configService) {
        this.configService = configService;
        const cloudinaryApiKey = this.configService.get('CLOUDINARY_API_KEY');
        const cloudinaryApiSecret = this.configService.get('CLOUDINARY_API_SECRET');
        const cloudinaryCloudName = this.configService.get('CLOUDINARY_CLOUD_NAME');
        cloudinary_1.v2.config({
            api_key: cloudinaryApiKey,
            api_secret: cloudinaryApiSecret,
            cloud_name: cloudinaryCloudName,
        });
        this.cloudinary = cloudinary_1.v2;
    }
    async uploadFileToCloud(file) {
        try {
            const promise = new Promise((resolve, reject) => {
                const uploadStream = this.cloudinary.uploader.upload_stream({ folder: 'chat_files' }, (error, result) => {
                    if (error)
                        return reject(error);
                    resolve(result);
                });
                if (file instanceof Buffer) {
                    uploadStream.end(file);
                }
            });
            const result = await promise.then((data) => {
                const { secure_url, public_id } = data;
                return { secureUrl: secure_url, publicId: public_id };
            });
            return { secureUrl: result.secureUrl, publicId: result.publicId };
        }
        catch (error) {
            console.log(error);
        }
    }
    async deleteUploadedFile(publicId) {
        const result = (await this.cloudinary.uploader.destroy(`chat_files/${publicId}`));
        return result;
    }
};
exports.FileUploadService = FileUploadService;
exports.FileUploadService = FileUploadService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], FileUploadService);
//# sourceMappingURL=file-upload-service.js.map