import { NestFactory } from '@nestjs/core';
import {  TokenModule} from './token.module';
import { RmqOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(TokenModule,{
    transport:Transport.RMQ,
    options:{
     urls:["amqp://localhost:5672"],
     queue:"token-queue",
     queueOptions:{}
    }
   } as RmqOptions);
  await app.listen();
  console.log("Token Service Run ")
}
bootstrap();
