"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Time = void 0;
class Time {
    static getTimeInOneHour() {
        const currentTime = new Date();
        const oneHourLater = new Date(currentTime.getTime() + 60 * 60 * 1000);
        return oneHourLater;
    }
    static checkIfTimeIsExpired(time) {
        const currentTime = Date.now();
        const expiryTime = time.getTime();
        return currentTime > expiryTime;
    }
}
exports.Time = Time;
//# sourceMappingURL=time.js.map