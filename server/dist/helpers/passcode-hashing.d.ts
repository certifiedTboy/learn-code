export declare class PasscodeHashing {
    static hashPassword(password: string): Promise<string>;
    static verifyPassword(plainPassword: string, storedPassword: string): Promise<boolean>;
}
