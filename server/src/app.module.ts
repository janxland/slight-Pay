import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderModule } from './modules/order/order.module';
require('dotenv').config();
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_HOST || '47.113.184.243',
      port: parseInt(process.env.MYSQL_PORT) || 3306,
      username: process.env.MYSQL_USER || 'order',
      password: process.env.MYSQL_PASSWORD || 'chz8K4FCJwBDe7RR',
      database: process.env.MYSQL_DATABASE || 'order',
      charset: 'utf8mb4', // 设置chatset编码为utf8mb4
      autoLoadEntities: true,
      synchronize: true,
    }),
    OrderModule
  ],
})
export class AppModule {}
