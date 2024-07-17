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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const common_1 = require("@nestjs/common");
const order_service_1 = require("./order.service");
const allowedIps = ['YOUR_ALLOWED_IPS'];
let OrderController = class OrderController {
    constructor(orderService) {
        this.orderService = orderService;
        console.log('OrderController instantiated');
    }
    queryOrder(out_trade_no, orderId) {
        return this.orderService.queryOrder(out_trade_no || orderId);
    }
    selectOrders(selectOrders, num, page) {
        return this.orderService.selectOrders(selectOrders, num, page);
    }
    saveOrder(order, req) {
        order.IPAddress = req.ip || req.connection.remoteAddress;
        return this.orderService.createOrder(order);
    }
    listOrders(orderIds, num, page) {
        return this.orderService.listOrders(orderIds, num, page);
    }
    getOrder(orderId) {
        return this.orderService.getOrder(orderId);
    }
    saveOne(order) {
        return this.orderService.saveOne(order);
    }
};
exports.OrderController = OrderController;
__decorate([
    (0, common_1.Get)('/query'),
    __param(0, (0, common_1.Query)('out_trade_no')),
    __param(1, (0, common_1.Query)('orderId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], OrderController.prototype, "queryOrder", null);
__decorate([
    (0, common_1.Post)('/select'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Query)('num')),
    __param(2, (0, common_1.Query)('page')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number]),
    __metadata("design:returntype", void 0)
], OrderController.prototype, "selectOrders", null);
__decorate([
    (0, common_1.Post)('/createOrder'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], OrderController.prototype, "saveOrder", null);
__decorate([
    (0, common_1.Get)('/list'),
    __param(0, (0, common_1.Query)('orderIds')),
    __param(1, (0, common_1.Query)('num')),
    __param(2, (0, common_1.Query)('page')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", void 0)
], OrderController.prototype, "listOrders", null);
__decorate([
    (0, common_1.Get)("/get"),
    __param(0, (0, common_1.Query)('orderId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OrderController.prototype, "getOrder", null);
__decorate([
    (0, common_1.Post)('/update'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], OrderController.prototype, "saveOne", null);
exports.OrderController = OrderController = __decorate([
    (0, common_1.Controller)('order'),
    __metadata("design:paramtypes", [order_service_1.OrderService])
], OrderController);
//# sourceMappingURL=order.controller.js.map