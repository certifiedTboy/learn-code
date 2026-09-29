"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DB_URI = exports.user = exports.port = exports.host = exports.redirectUri = exports.accessToken = exports.refreshToken = exports.clientSecret = exports.clientId = void 0;
const dotenv = require("dotenv");
dotenv.config();
exports.clientId = process.env.EMAIL_CLIENT_ID;
exports.clientSecret = process.env.EMAIL_CLIENT_SECRET;
exports.refreshToken = process.env.EMAIL_REFRESH_TOKEN;
exports.accessToken = process.env.EMAIL_ACCESS_TOKEN;
exports.redirectUri = process.env.EMAIL_REDIRECT_URI;
exports.host = process.env.EMAIL_SMTP_HOST;
exports.port = process.env.EMAIL_SMTP_PORT;
exports.user = process.env.EMAIL_USER;
exports.DB_URI = process.env.MONGO_URI;
//# sourceMappingURL=constants.js.map