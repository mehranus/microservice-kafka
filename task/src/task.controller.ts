import { Controller, Get } from '@nestjs/common';
import { TaskService } from './task.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ITask, updateDto } from './Interface/task.interface';


@Controller("task")
export class TaskController {
  constructor(private readonly taskService: TaskService) {}


  @MessagePattern("create_task")
  create(@Payload() taskDto:ITask){
    return this.taskService.create(taskDto)
  }
  @MessagePattern("user_task")
  getTaskUser(@Payload() {userId}:{userId:string}){
    return this.taskService.getUserTask(userId)
  }
  @MessagePattern("delete_task")
  deleteTaskUser(@Payload() {title}:{title:string}){
  
    return this.taskService.deleteTask(title)
  }
  @MessagePattern("update_task")
  updateTaskUser(@Payload() updateDto:updateDto){
    
    return this.taskService.updateTask(updateDto)
  }

}
