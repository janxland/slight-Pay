"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const order_module_1 = require("./modules/order/order.module");
require('dotenv').config();
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRoot({
                type: 'mysql',
                host: process.env.MYSQL_HOST || '47.113.184.243',
                port: parseInt(process.env.MYSQL_PORT) || 3306,
                username: process.env.MYSQL_USER || 'order',
                password: process.env.MYSQL_PASSWORD || 'chz8K4FCJwBDe7RR',
                database: process.env.MYSQL_DATABASE || 'order',
                charset: 'utf8mb4',
                autoLoadEntities: true,
                synchronize: true,
            }),
            order_module_1.OrderModule
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map