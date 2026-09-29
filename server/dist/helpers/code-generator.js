"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenerator = void 0;
class CodeGenerator {
    static OTP_LENGTH = 6;
    static generateOtp() {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        return otp.length === this.OTP_LENGTH ? otp : this.generateOtp();
    }
}
exports.CodeGenerator = CodeGenerator;
//# sourceMappingURL=code-generator.js.map