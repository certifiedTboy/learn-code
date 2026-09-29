export interface ResponseHandlerInterface {
    statusCode: number;
    message: string;
    data?: object;
}
export declare class ResponseHandler {
    static ok(statusCode: number, message: string, data?: object): ResponseHandlerInterface;
}
