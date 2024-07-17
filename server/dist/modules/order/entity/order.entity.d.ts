import { OrderStatus } from '../enums/order.enum';
export declare class Order {
    orderId: string;
    customerName: string;
    customerAddress: string;
    customerEmail: string;
    productCode: string;
    productDescription: string;
    amount: number;
    quantity: number;
    orderStatus: OrderStatus;
    orderDate: number;
    shippedDate: number;
    trackingNumber: string;
    paymentMethod: string;
    transactionId: string;
    transactionInfo: string;
    totalAmount: number;
    userId: string;
    IPAddress: string;
    createTime: number;
    updateTime: number;
}
