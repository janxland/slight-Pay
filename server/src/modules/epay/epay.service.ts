import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import axios from 'axios';
import * as crypto from 'crypto';
import * as dotenv from 'dotenv';
import { RCode } from '../../common/tool/utils';
import { Order } from '../order/entity/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as qs from 'qs';
dotenv.config();

@Injectable()
export class ePayService {
  private readonly pid: string;
  private readonly key: string;
  private readonly submitUrl: string;
  private readonly mapiUrl: string;
  private readonly apiUrl: string;
  private readonly return_url = process.env.EPAY_RETURN_URL;
  private readonly notify_url = process.env.EPAY_NOTIFY_URL;
  private readonly signType = 'MD5';
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {
    this.pid = process.env.EPAY_PID;
    this.key = process.env.EPAY_KEY;
    this.submitUrl = `${process.env.EPAY_API_URL}/submit.php`;
    this.mapiUrl = `${process.env.EPAY_API_URL}/mapi.php`;
    this.apiUrl = `${process.env.EPAY_API_URL}/api.php`;
    
  }

  // 发起支付 (获取支付链接)
  async getPayLink(params: Record<string, any>): Promise<string> {
    const param = this.buildRequestParam(params);
    const queryString = new URLSearchParams(param).toString();
    return `${this.submitUrl}?${queryString}`;
  }

  // 发起支付 (API接口)
  async apiPay(order: Order,params: Record<string, any>,qrcode:boolean | null=null): Promise<any> {
    try {
      let newOrder = Object.assign(new Order(), order);
      while (await this.orderRepository.findOne({ orderId: order.orderId })) {
        newOrder = Object.assign(new Order(), order);
      }
      const requestParams = {
        pid: this.pid,
        key: this.key,
        type: params.type || 'alipay',
        return_url: process.env.EPAY_RETURN_URL || 'http://pay.roginx.ink/epay/return',
        notify_url: process.env.EPAY_NOTIFY_URL || 'http://pay.roginx.ink/epay/notify',
        sign_type: this.signType,
        name: newOrder.productDescription || '一个普通商品',
        out_trade_no: newOrder.orderId,
        money: newOrder.amount || 1,
        clientip: newOrder.IPAddress || "127.0.0.1",
      };
      const param = this.buildRequestParam(requestParams);
      const response = await this.getHttpResponse(this.mapiUrl, param);
      if(response.code == 1) {
        newOrder.transactionId = response.trade_no;
        newOrder.transactionInfo = JSON.stringify({code_url: response.prcode});
        const savedOrder = await this.orderRepository.save(newOrder);
        
        return { code: RCode.OK, msg: '订单生成成功', 
          data:{ 
            money:newOrder.amount,
            orderId: savedOrder.orderId, 
            code_url: response.qrcode, 
            type:response.type,
            trade_no: response.trade_no
          }
        };
      } else {
        return { code: RCode.ERROR, msg: '订单生成失败，但已经创建支付单', data: response }
      }
    } catch (error) {
      return { code: RCode.ERROR, msg: '订单生成失败', data: error }
    }
  }
  async updateOrderStatus(query: any): Promise<string>  {
    let statusMap = {
      TRADE_SUCCESS: 'SUCCESS',
      TRADE_CLOSED: 'CLOSED',
      WAIT_BUYER_PAY: 'WAIT_BUYER_PAY',
      TRADE_FINISHED: 'TRADE_FINISHED',
    };
    let newOrder = Object.assign(new Order(), {
      orderId: query.out_trade_no,
      orderStatus: statusMap[query.trade_status]
    });
    let saveOrder = await this.orderRepository.save(newOrder);
    console.log(saveOrder);
    
    throw new Error('Method not implemented.');
  }
  
  // 异步回调验证
  verifyNotify(query: Record<string, any>): boolean {
    if (Object.keys(query).length === 0) return false;
    const sign = this.getSign(query);
    return sign === query['sign'];
  }

  // 同步回调验证
  verifyReturn(query: Record<string, any>): boolean {
    if (Object.keys(query).length === 0) return false;
    const sign = this.getSign(query);
    return sign === query['sign'];
  }

  // 查询订单支付状态
  async orderStatus(tradeNo: string,orderId: string): Promise<boolean> {
    const result = await this.queryOrder(tradeNo);
    if (result && result.status === 1) {
      return true;
    } else {
      return false;
    }
  }
  // 查询订单（数据库
  async queryOrderFromNative(tradeNo: string): Promise<any> {
    let response = await this.orderRepository.findOne({
      where: [
        { orderId: tradeNo },
        { transactionId: tradeNo }, // 另一个查询条件由于本地商户号订单ID是UUID
      ],
    });
    console.log(response);
    
    return { msg:'查询成功！',data:response };
  }
  // 查询订单（远程服务商服务
  async queryOrder(tradeNo: string): Promise<any> {
    // 加一个时间戳
    const url = `${this.apiUrl}?act=order&pid=${this.pid}&key=${this.key}&out_trade_no=${tradeNo}&trade_no=${tradeNo}&timestamp=${Date.now()}`;
    const response = await this.getHttpResponse(url);
    return response;
  }

  // 请求外部资源
  private async getHttpResponse(url: string, postData: Record<string, any> | null = null, timeout: number = 10000): Promise<any> {
    try {
      if (postData) {
        const response = await axios({
          method: 'POST',
          url: url,
          data: qs.stringify(postData),
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': '*/*',
            'Accept-Language': 'zh-CN,zh;q=0.8',
            'Connection': 'close',
          },
          timeout: timeout,
        });
        
        return response.data;
      } else {
        const response = await axios({
          method: 'GET',
          url: url,
          headers: {
            'Accept': '*/*',
            'Accept-Language': 'zh-CN,zh;q=0.8',
            'Connection': 'close',
          },
          timeout: timeout,
        });
        return response.data;
      }
    } catch (error) {
      console.error('请求失败:', error);
      throw new Error('Failed to fetch data from external resource.');
    }
  }

  async refund(tradeNo: string, amount: string): Promise<any> {
    const url = `${this.apiUrl}?act=refund`;
    const postData = {
      pid: this.pid,
      key: this.key,
      trade_no: tradeNo,
      money: amount,
    };
    const response = await this.httpPost(url, postData);
    return response;
  }

  private buildRequestParam(params: Record<string, any>): Record<string, any> {
    const sign = this.getSign(params);
    return {
      ...params,
      sign,
      sign_type: this.signType,
    };
  }

  private getSign(params: Record<string, any>): string {
    // 1. 需要过滤掉的键
    const ignoredKeys = ['sign', 'sign_type'];
  
    // 2. 排序并构建签名字符串
    const sortedParams = Object.keys(params)
      .filter(key => !ignoredKeys.includes(key) && params[key] !== '')
      .sort()
      .reduce((acc, key) => `${acc}${key}=${params[key]}&`, '');
  
    // 3. 拼接 key 并检查是否存在
    if (!this.key) {
      throw new Error('Key is missing');
    }
  
    const signStr = `${sortedParams.slice(0, -1)}${this.key}`;  // 去掉末尾的 "&" 再拼接 key
  
    // 4. 生成 MD5 签名
    return crypto.createHash('md5').update(signStr).digest('hex');
  }

  private async httpGet(url: string): Promise<any> {
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw new HttpException('Failed to fetch data', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private async httpPost(url: string, data: Record<string, any>): Promise<any> {
    try {
      const queryParams = new URLSearchParams(data).toString(); 
      const fullUrl = `${url}?${queryParams}`; 
      const response = await axios.post(fullUrl);
      return response.data;
    } catch (error) {
      throw new HttpException('Failed to post data', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  
  
}
