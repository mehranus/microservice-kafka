import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Task, TaskDocument } from './schema/task.schema';
import { Model } from 'mongoose';
import { ITask, updateDto } from './Interface/task.interface';
import { error } from 'console';

@Injectable()
export class TaskService {
 constructor(
  @InjectModel(Task.name) private readonly taskModel:Model<TaskDocument>
 ){}

 async create(taskDto:ITask){
  const {content,title,userId}=taskDto
  const task=await this.taskModel.create({
    title,
    content,
    userId
  })
  return{
    status:HttpStatus.CREATED,
    error:false,
    message:"created Task",
    data:{task}
  }
 }

 async getUserTask(userId:string){
  const tasks=await this.taskModel.find({userId})
  return{
    status:HttpStatus.OK,
    error:false,
    data:{tasks}
  }
 }

 async deleteTask(title:string){
  console.log(title)
  const task=await this.taskModel.findOne({title})
  console.log(task)
  if(!task){
    return {
      status:HttpStatus.NOT_FOUND,
      message:"task not found!",
      error:true
    }
  }
  await this.taskModel.deleteOne({title})
  return {
    status:HttpStatus.OK,
    error:false,
    message:"remove task sucessfully"
  }
 }

 async updateTask(updateDto:updateDto){
  const {content,title,status,userId}=updateDto
  const task=await this.taskModel.findOne({userId})
  if(!task){
    return{
      status:HttpStatus.NOT_FOUND,
      error:true,
      message:"task user not found"
    }
  }
  if(title) task.title=title
  if(content) task.content=content
  if(status) task.status=status
  await task.save()
  return{
    status:HttpStatus.OK,
    error:false,
    message:"updated sucessfully",
    data:task
  }
 }

}
