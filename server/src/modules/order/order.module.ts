import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entity/order.entity';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { WxPayService } from './WxPay.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order
    ]),
  ],
  controllers: [OrderController],
  providers: [OrderService,WxPayService,Object],
})
export class OrderModule {}
