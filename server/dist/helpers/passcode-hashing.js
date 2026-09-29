"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasscodeHashing = void 0;
const crypto_1 = require("crypto");
const util_1 = require("util");
const scryptAsync = (0, util_1.promisify)(crypto_1.scrypt);
class PasscodeHashing {
    static async hashPassword(password) {
        const salt = (0, crypto_1.randomBytes)(8).toString('hex');
        const buf = (await scryptAsync(password, salt, 64));
        return `${buf.toString('hex')}.${salt}`;
    }
    static async verifyPassword(plainPassword, storedPassword) {
        const [hashedPassword, salt] = storedPassword.split('.');
        const buf = (await scryptAsync(plainPassword, salt, 64));
        return buf.toString('hex') === hashedPassword;
    }
}
exports.PasscodeHashing = PasscodeHashing;
//# sourceMappingURL=passcode-hashing.js.map