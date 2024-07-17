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
exports.OrderService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const order_entity_1 = require("./entity/order.entity");
const utils_1 = require("../../common/tool/utils");
const WxPay_service_1 = require("./WxPay.service");
const order_enum_1 = require("./enums/order.enum");
let OrderService = class OrderService {
    constructor(orderRepository, WxPay) {
        this.orderRepository = orderRepository;
        this.WxPay = WxPay;
        this.WxPay = new WxPay_service_1.WxPayService().WxPayService;
    }
    async notify(req) {
        try {
            const headers = req.headers;
            const params = {
                apiSecret: 'APIv3密钥',
                body: req.body,
                signature: headers['wechatpay-signature'],
                serial: headers['wechatpay-serial'],
                nonce: headers['wechatpay-nonce'],
                timestamp: headers['wechatpay-timestamp'],
            };
            const ret = await this.WxPay.verifySign(params);
            console.log('验签结果(bool类型)：' + ret);
            return ret;
        }
        catch (e) {
        }
    }
    async getOrder(orderId) {
        try {
            let res;
            if (orderId) {
                res = await this.orderRepository.findOne({
                    where: { orderId: orderId },
                });
                return { msg: '获取简历成功', data: res };
            }
        }
        catch (e) {
            return { code: utils_1.RCode.ERROR, msg: '获取简历失败', data: e };
        }
    }
    async queryOrder(out_trade_no) {
        try {
            const res = await this.WxPay.query({ out_trade_no });
            const { data } = res;
            let order = new order_entity_1.Order();
            order.orderId = out_trade_no;
            order.transactionId = data.transaction_id;
            if (data.trade_state == "SUCCESS") {
                order.orderStatus = order_enum_1.OrderStatus.PAID;
                await this.orderRepository.save(order);
            }
            const queryOrder = await this.orderRepository.findOne({ where: { orderId: out_trade_no } });
            return { msg: '查询成功', data: queryOrder };
        }
        catch (e) {
            return { code: utils_1.RCode.ERROR, msg: '查询失败', data: e };
        }
    }
    async createOrder(order) {
        try {
            let newOrder = Object.assign(new order_entity_1.Order(), order);
            while (await this.orderRepository.findOne({ orderId: order.orderId })) {
                newOrder = Object.assign(new order_entity_1.Order(), order);
            }
            const params = {
                description: newOrder.productDescription || '一个普通商品',
                out_trade_no: newOrder.orderId,
                notify_url: 'https://pay.roginx.ink/order/notify',
                amount: {
                    total: newOrder.amount || 1,
                },
                scene_info: {
                    payer_client_ip: newOrder.IPAddress || "127.0.0.1",
                },
            };
            const result = await this.WxPay.transactions_native(params);
            if (result.status == 200) {
                newOrder.transactionInfo = JSON.stringify(result.data);
                const savedOrder = await this.orderRepository.save(newOrder);
                return { code: utils_1.RCode.OK, msg: '订单生成成功', data: { orderId: savedOrder.orderId, code_url: result.data.code_url } };
            }
            return { code: utils_1.RCode.ERROR, msg: '订单生成失败', data: result };
        }
        catch (e) {
            console.error('Error saving the order:', e);
            return { code: utils_1.RCode.ERROR, msg: '保存订单失败', data: e };
        }
    }
    async selectOrders(order, num = 10, page = 1) {
        try {
            let queryBuilder = this.orderRepository.createQueryBuilder('order');
            Object.keys(order).forEach(key => {
                if (order[key] !== undefined) {
                    queryBuilder = queryBuilder.andWhere(`order.${key} = :${key}`, { [key]: order[key] });
                }
            });
            const totalCount = await queryBuilder.getCount();
            queryBuilder = queryBuilder.skip((page - 1) * num).take(num);
            const data = await queryBuilder.getMany();
            const totalPage = Math.ceil(totalCount / num);
            return { msg: '获取订单列表成功！', data, totalPage, totalCount };
        }
        catch (e) {
            return { code: 'ERROR', msg: '获取订单失败', data: e };
        }
    }
    async listOrders(orderIds = '', num = 10, page = 1) {
        try {
            let queryBuilder = this.orderRepository.createQueryBuilder('order');
            if (orderIds) {
                const orderIdArr = orderIds.split(',').filter(id => id.trim());
                queryBuilder = queryBuilder.where('order.orderId IN (:...orderIdArr)', { orderIdArr });
            }
            const totalCount = await queryBuilder.getCount();
            if (!orderIds) {
                queryBuilder = queryBuilder.skip((page - 1) * num).take(num);
            }
            const data = await queryBuilder.getMany();
            const totalPage = Math.ceil(totalCount / num);
            return { msg: '获取订单列表成功！', data, totalPage, totalCount };
        }
        catch (e) {
            return { code: 'ERROR', msg: '获取订单失败', data: e };
        }
    }
    async saveOne(order) {
        try {
            let one = await this.orderRepository.findOne({
                where: { orderId: order.orderId },
            });
            if (!one) {
                one = this.orderRepository.create(order);
            }
            else {
                one = this.orderRepository.merge(one, order);
            }
            const savedOne = await this.orderRepository.save(one);
            return { code: utils_1.RCode.OK, msg: '简历保存成功', data: savedOne };
        }
        catch (e) {
            console.error('Error saving the order:', e);
            return { code: utils_1.RCode.ERROR, msg: '保存简历失败', data: e };
        }
    }
};
exports.OrderService = OrderService;
exports.OrderService = OrderService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(order_entity_1.Order)),
    __metadata("design:paramtypes", [typeorm_1.Repository, Object])
], OrderService);
//# sourceMappingURL=order.service.js.map