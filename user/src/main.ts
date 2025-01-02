import { NestFactory } from '@nestjs/core';
import { UserModule } from './user.module';
import { RmqOptions, Transport } from '@nestjs/microservices';


async function bootstrap() {
  const app = await NestFactory.createMicroservice(UserModule,{
   transport:Transport.RMQ,
   options:{
    urls:["amqp://localhost:5672"],
    queue:"user-queue",
    queueOptions:{}
   }
  } as RmqOptions)
  await app.listen();
  console.log("user service run ")
}
bootstrap();
