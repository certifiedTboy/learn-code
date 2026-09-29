"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const nest_winston_1 = require("nest-winston");
const config_1 = require("@nestjs/config");
const cookieParser = require("cookie-parser");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
const http_exceptions_filter_1 = require("./common/exceptions/http-exceptions.filter");
const bootstrap = async () => {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: false,
    });
    app.useLogger(app.get(nest_winston_1.WINSTON_MODULE_NEST_PROVIDER));
    app.setGlobalPrefix('api');
    app.enableVersioning({
        type: common_1.VersioningType.URI,
    });
    app.enableCors({
        origin: ['http://localhost:5173', 'https://2c8c1a26d806.ngrok-free.app'],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        allowedHeaders: [
            'Content-Type',
            'Authorization',
            'x-client-type',
            'x-platform',
        ],
        credentials: true,
    });
    app.use(cookieParser());
    const configService = app.get(config_1.ConfigService);
    const port = configService.get('PORT');
    app.useGlobalFilters(new http_exceptions_filter_1.HttpExceptionFilter());
    app.useGlobalPipes(new common_2.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        stopAtFirstError: true,
        exceptionFactory: (errors) => {
            const errorMessage = errors[0].constraints
                ? Object.values(errors[0].constraints).join(', ')
                : '';
            throw new common_1.BadRequestException('', {
                cause: errorMessage,
                description: errorMessage,
            });
        },
    }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Learn Code API')
        .setDescription('Learn Code API documentation')
        .setVersion('1.0')
        .build();
    const documentFactory = () => swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, documentFactory);
    await app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
};
bootstrap();
//# sourceMappingURL=main.js.map