import { Repository } from 'typeorm';
import { Order } from './entity/order.entity';
import { RCode } from '../../common/tool/utils';
export declare class OrderService {
    private readonly orderRepository;
    private WxPay;
    constructor(orderRepository: Repository<Order>, WxPay: any);
    notify(req: any): Promise<any>;
    getOrder(orderId: string): Promise<{
        msg: string;
        data: any;
        code?: undefined;
    } | {
        code: RCode;
        msg: string;
        data: any;
    }>;
    queryOrder(out_trade_no: string): Promise<{
        msg: string;
        data: Order;
        code?: undefined;
    } | {
        code: RCode;
        msg: string;
        data: any;
    }>;
    createOrder(order: Order): Promise<{
        code: RCode;
        msg: string;
        data: any;
    }>;
    selectOrders(order: Partial<Order>, num?: number, page?: number): Promise<{
        msg: string;
        data: Order[];
        totalPage: number;
        totalCount: number;
        code?: undefined;
    } | {
        code: string;
        msg: string;
        data: any;
        totalPage?: undefined;
        totalCount?: undefined;
    }>;
    listOrders(orderIds?: string, num?: number, page?: number): Promise<{
        msg: string;
        data: Order[];
        totalPage: number;
        totalCount: number;
        code?: undefined;
    } | {
        code: string;
        msg: string;
        data: any;
        totalPage?: undefined;
        totalCount?: undefined;
    }>;
    saveOne(order: Order): Promise<{
        code: RCode;
        msg: string;
        data: any;
    }>;
}
