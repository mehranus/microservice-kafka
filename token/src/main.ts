import { NestFactory } from '@nestjs/core';
import {  TokenModule} from './token.module';
import { KafkaOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(TokenModule,{
    transport:Transport.KAFKA,
    options:{
    client:{
     clientId:'token',
     brokers:["localhost:29092"]
    },
    consumer:{
     groupId: "token-consumer"
    }
    }
   } as KafkaOptions);
  await app.listen();
  console.log("Token Service Run ")
}
bootstrap();
