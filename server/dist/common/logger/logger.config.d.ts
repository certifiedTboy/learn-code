import * as winston from 'winston';
export declare const loggerConfig: {
    level: string;
    format: winston.Logform.Format;
    transports: (winston.transports.ConsoleTransportInstance | winston.transports.FileTransportInstance)[];
};
