import { NestFactory } from '@nestjs/core';
import { UserModule } from './user.module';
import { KafkaOptions, Transport } from '@nestjs/microservices';


async function bootstrap() {
  const app = await NestFactory.createMicroservice(UserModule,{
   transport:Transport.KAFKA,
   options:{
   client:{
    clientId:'user',
    brokers:["localhost:29092"]
   },
   consumer:{
    groupId: "user-consumer"
   }
   }
  } as KafkaOptions)
  await app.listen();
  console.log("user service run ")
}
bootstrap();
