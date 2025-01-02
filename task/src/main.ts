import { NestFactory } from "@nestjs/core";
import { TaskModule } from "./task.module";
import { KafkaOptions, Transport } from "@nestjs/microservices";

async function bootstrap() {
  const app = await NestFactory.createMicroservice(TaskModule, {
    transport:Transport.KAFKA,
    options:{
    client:{
     clientId:'task',
     brokers:["localhost:29092"]
    },
    consumer:{
     groupId: "task-consumer"
    }
    }
   } as KafkaOptions);
  await app.listen();
  console.log("task service is runnig ");
}
bootstrap();
