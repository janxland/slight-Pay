// src/enums/order-status.enum.ts
export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  RETURNED = 'returned',
  UNPAID = 'NOTPAY',
  PAID = 'SUCCESS',
}
