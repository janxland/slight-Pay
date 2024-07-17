import { Order } from './entity/order.entity';
import { OrderService } from './order.service';
export declare class OrderController {
    private readonly orderService;
    constructor(orderService: OrderService);
    queryOrder(out_trade_no: string, orderId: any): Promise<{
        msg: string;
        data: Order;
        code?: undefined;
    } | {
        code: import("../../common/tool/utils").RCode;
        msg: string;
        data: any;
    }>;
    selectOrders(selectOrders: Partial<Order>, num: number, page: number): Promise<{
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
    saveOrder(order: any, req: any): Promise<{
        code: import("../../common/tool/utils").RCode;
        msg: string;
        data: any;
    }>;
    listOrders(orderIds: string, num: number, page: number): Promise<{
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
    getOrder(orderId: string): Promise<{
        msg: string;
        data: any;
        code?: undefined;
    } | {
        code: import("../../common/tool/utils").RCode;
        msg: string;
        data: any;
    }>;
    saveOne(order: any): Promise<{
        code: import("../../common/tool/utils").RCode;
        msg: string;
        data: any;
    }>;
}
