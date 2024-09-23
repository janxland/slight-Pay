import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../order/entity/order.entity';
import { ePayController } from './epay.controller';
import { ePayService } from './epay.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order
    ]),
  ],
  controllers: [ePayController],
  providers: [ePayService,Object],
})
export class ePayModule {}
