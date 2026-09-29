declare enum RoleEnum {
    ADMIN = "admin",
    USER = "user"
}
export declare class CreateUserDto {
    readonly email: string;
    readonly password: string;
    readonly role: RoleEnum;
}
export declare class CreateGoogleUserDto {
    readonly email: string;
    readonly firstName: string;
    readonly lastName: string;
    readonly profilePicture: string;
}
export {};
