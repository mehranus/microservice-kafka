import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { TaskEnum } from "src/enum/task.enum";




@Schema()
export class Task{
  @Prop()
  title:string
  @Prop()
  content:string
  @Prop()
  userId:string
  @Prop({enum:TaskEnum,default:TaskEnum.Pending})
  status:string

}

export type TaskDocument=HydratedDocument<Task>
export const TaskSchema=SchemaFactory.createForClass(Task)