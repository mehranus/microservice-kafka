import { NestFactory } from "@nestjs/core";
import { TaskModule } from "./task.module";
import { RmqOptions, Transport } from "@nestjs/microservices";

async function bootstrap() {
  const app = await NestFactory.createMicroservice(TaskModule, {
    transport:Transport.RMQ,
    options:{
     urls:["amqp://localhost:5672"],
     queue:"task-queue",
     queueOptions:{}
    }
   } as RmqOptions);
  await app.listen();
  console.log("task service is runnig ");
}
bootstrap();
