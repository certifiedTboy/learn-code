"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const course_services_1 = require("./course-services");
const course_controllers_1 = require("./course-controllers");
const auth_module_1 = require("../auth/auth-module");
const course_schema_1 = require("./schema/course-schema");
const users_module_1 = require("../user/users-module");
const queue_module_1 = require("../queue/queue-module");
let CourseModule = class CourseModule {
};
exports.CourseModule = CourseModule;
exports.CourseModule = CourseModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: course_schema_1.Course.name, schema: course_schema_1.CourseSchema }]),
            (0, common_1.forwardRef)(() => users_module_1.UsersModule),
            auth_module_1.AuthModule,
            (0, common_1.forwardRef)(() => queue_module_1.QueueModule),
        ],
        providers: [course_services_1.CourseServices],
        controllers: [course_controllers_1.CourseControllers],
        exports: [course_services_1.CourseServices],
    })
], CourseModule);
//# sourceMappingURL=course-module.js.map