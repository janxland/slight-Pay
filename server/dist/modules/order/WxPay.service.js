"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WxPayService = void 0;
const common_1 = require("@nestjs/common");
const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config();
let WxPayService = class WxPayService {
    constructor() {
        const WxPay = require('wechatpay-node-v3');
        this.WxPayService = new WxPay({
            appid: process.env.WX_APPID || '默认的公众号或移动应用appid',
            mchid: process.env.WX_MCHID || '默认的商户号',
            publicKey: fs.readFileSync(process.env.WX_PUBLIC_KEY_PATH || './默认的公钥路径.pem'),
            privateKey: fs.readFileSync(process.env.WX_PRIVATE_KEY_PATH || './默认的私钥路径.pem'),
        });
    }
};
exports.WxPayService = WxPayService;
exports.WxPayService = WxPayService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], WxPayService);
//# sourceMappingURL=WxPay.service.js.map