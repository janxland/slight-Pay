import { Controller, Post, Body, Get, Query, HttpException, HttpStatus, Param ,Req} from '@nestjs/common';
import { ePayService } from './epay.service'; // 假设你已经在NestJS中创建了一个对应的service
import { Order } from '../order/entity/order.entity';

@Controller('epay')
export class ePayController {
  constructor(private readonly epayService: ePayService) {}

  // // 发起支付 (页面跳转)
  // @Post('pagePay')
  // async pagePay(@Body() payDto: any): Promise<string> {
  //   try {
  //     const result = this.epayService.pagePay(payDto);
  //     return result;
  //   } catch (error) {
  //     throw new HttpException('Payment failed', HttpStatus.INTERNAL_SERVER_ERROR);
  //   }
  // }

  // 获取支付链接
  @Post('getPayLink')
  async getPayLink(@Body() payDto: any): Promise<string> {
    try {
      const result = this.epayService.getPayLink(payDto);
      return result;
    } catch (error) {
      throw new HttpException('Payment failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // API支付
  @Post('apiPay')
  async apiPay(@Body() order,@Query() payDto: any,@Req() req): Promise<any> {
    try {
      let order = Object.assign(new Order(), payDto);
      order.IPAddress = req.ip || req.connection.remoteAddress;
      const result = await this.epayService.apiPay(order,payDto);
      return result
    } catch (error) {
      throw new HttpException('API payment failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // 订单完成/订单过期异步回调验证
  @Get('notify')
  async verifyNotify(@Query() query: any): Promise<boolean> {
    try {
      const result = await this.epayService.verifyNotify(query);
      if(result) {
        await this.epayService.updateOrderStatus(query);
        return true
      }
      return result;
    } catch (error) {
      throw new HttpException('Verification failed', HttpStatus.BAD_REQUEST);
    }
  }

  // 同步回调验证
  @Get('return')
  async verifyReturn(@Query() query: any): Promise<boolean> {
    try {
      const result = await this.epayService.verifyReturn(query);
      return result;
    } catch (error) {
      throw new HttpException('Verification failed', HttpStatus.BAD_REQUEST);
    }
  }

  // 查询订单支付状态
  @Get('orderStatus')
  async orderStatus(@Query('trade_no') tradeNo: string,@Query('orderId') orderId): Promise<boolean> {
    try {
      const result = await this.epayService.queryOrderFromNative(orderId || tradeNo);
      return result;
    } catch (error) {
      throw new HttpException('Order status check failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // 查询订单详情
  @Get('queryOrder')
  async queryOrder(@Query('trade_no') tradeNo: string): Promise<any> {
    try {
      const result = await this.epayService.queryOrder(tradeNo);
      return result;
    } catch (error) {
      throw new HttpException('Order query failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // 订单退款
  // @Post('refund')
  // async refund(@Body() refundDto: { trade_no: string; money: number }): Promise<any> {
  //   try {
  //     const { trade_no, money } = refundDto;
  //     const result = await this.epayService.refund(trade_no, money);
  //     return result;
  //   } catch (error) {
  //     throw new HttpException('Refund failed', HttpStatus.INTERNAL_SERVER_ERROR);
  //   }
  // }
}
