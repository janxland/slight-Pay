import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { OrderStatus } from '../enums/order.enum';

// 生成指定长度的唯一标识符函数
function generateUniqueId(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  // 订单ID，自动生成的UUID
  orderId: string = generateUniqueId(32);

  @Column({ default: '' })
  // 客户姓名
  customerName: string;

  @Column({ default: '' })
  // 客户地址
  customerAddress: string;

  @Column({ default: '' })
  // 客户邮箱
  customerEmail: string;

  @Column({ default: '' })
  // 产品代码
  productCode: string;

  @Column({ type: 'varchar', length: 5000, default: '' })
  // 产品描述
  productDescription: string;

  @Column({ default: 1, type: 'double' })
  // 订单金额
  amount: number;

  @Column({ default: 1 })
  // 订单数量
  quantity: number;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING
  })
  // 订单状态，枚举类型
  orderStatus: OrderStatus;

  @Column({ type: 'double', default: new Date().valueOf() })
  // 订单日期
  orderDate: number;

  @Column({ type: 'double', default: new Date().valueOf() })
  // 发货日期
  shippedDate: number;

  @Column({ default: '' })
  // 追踪号码
  trackingNumber: string;

  @Column({ default: '' })
  // 支付方式
  paymentMethod: string;

  @Column({ default: '' })
  // 交易ID
  transactionId: string;

  // 交易信息
  @Column({ default: '' })
  transactionInfo: string;

  @Column({ default: 0, type: 'double' })
  // 订单总金额
  totalAmount: number;

  @Column({ default: '' })
  // 用户ID
  userId: string;
  
  @Column({ default: '' })
  // 客户IP地址
  IPAddress: string;

  @Column({ type: 'double', default: new Date().valueOf() })
  // 创建时间
  createTime: number;

  @Column({ type: 'double', default: new Date().valueOf() })
  // 更新时间
  updateTime: number;
}
