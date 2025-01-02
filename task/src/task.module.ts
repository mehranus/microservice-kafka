import { Module } from "@nestjs/common";
import { TaskController } from "./task.controller";
import { TaskService } from "./task.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Task, TaskSchema } from "./schema/task.schema";



@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/microservice-todo'),
    MongooseModule.forFeature([{name:Task.name,schema:TaskSchema}])
  ],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
