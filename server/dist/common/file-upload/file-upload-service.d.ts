import { ConfigService } from '@nestjs/config';
export declare class FileUploadService {
    private configService;
    private cloudinary;
    constructor(configService: ConfigService);
    uploadFileToCloud(file: Buffer): Promise<{
        secureUrl: string;
        publicId: string;
    } | undefined>;
    deleteUploadedFile(publicId: string): Promise<{
        result: string;
    }>;
}
