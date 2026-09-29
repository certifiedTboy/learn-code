"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.covertToTitleCase = void 0;
const covertToTitleCase = (str) => {
    return str.split('')[0].toUpperCase() + str.slice(1).toLowerCase();
};
exports.covertToTitleCase = covertToTitleCase;
//# sourceMappingURL=title-case.js.map