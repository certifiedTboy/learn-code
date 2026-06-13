import * as winston from 'winston';

export const loggerConfig = {
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',

  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json(),
  ),

  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message, context }) => {
          return `[${timestamp}] ${level} ${context ? `[${context}]` : ''}: ${message}`;
        }),
      ),
    }),

    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
    }),

    new winston.transports.File({
      filename: 'logs/combined.log',
    }),
  ],
};
