import { Body, Controller, Delete, Get, HttpException, Inject, InternalServerErrorException, OnModuleInit, Post, Put, Req } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';

import { catchError, lastValueFrom } from 'rxjs';
import { Auth } from './decorator/auth.decorator';
import { Request } from 'express';
import { RemoveTaskDto, TaskDto, updatetaskDto } from './dto/task.dto';
import { ResposeType } from './types/respons.type';



@Controller('task')
@ApiTags("Task")
export class TaskController implements OnModuleInit {
  constructor(
    @Inject("TASK_SERVICE") private readonly  taskClinetService:ClientKafka,

  ) {}

 async onModuleInit() {
    this.taskClinetService.subscribeToResponseOf('create_task')
    this.taskClinetService.subscribeToResponseOf('user_task')
    this.taskClinetService.subscribeToResponseOf('delete_task')
    this.taskClinetService.subscribeToResponseOf('update_task')

    await this.taskClinetService.connect()
  }

  @Post('create')
  @Auth()
  @ApiConsumes('application/x-www-form-urlencoded')
   async create(@Body() createDto:TaskDto,@Req() req:Request){
    const respons:ResposeType=await new Promise((resolve,reject)=>{
      this.taskClinetService.send("create_task",{
        title:createDto.title,
        content:createDto.content,
        userId:req.user?._id
      }).subscribe((data)=>resolve(data))
    })
    if(respons?.error){
      throw new HttpException(respons?.message,respons?.status ?? 500)
    }
    return {
      message:respons?.message,
      data:respons?.data
    }
  }
  @Get('user')
  @Auth()
  @ApiConsumes('application/x-www-form-urlencoded')
   async userTask(@Req() req:Request){
    const respons:ResposeType=await new Promise((resolve,reject)=>{
      this.taskClinetService.send("user_task",{userId:req.user?._id})
      .subscribe((data)=>resolve(data))
    } )

    return respons?.data ?? {data:[]}
  }
  @Delete('delete')
  @Auth()
  @ApiConsumes('application/x-www-form-urlencoded')
   async deleteTask(@Body() removeDto:RemoveTaskDto){
    const respons:ResposeType=await new Promise((resolve,reject)=>{
      this.taskClinetService.send("delete_task",{title:removeDto.title})
      .subscribe((deta)=>resolve(deta))
   })
  if(respons?.error) throw new HttpException(respons?.message,respons?.status || 500)
    
    return respons?.message

  
  }
  @Put('update')
  @Auth()
  @ApiConsumes('application/x-www-form-urlencoded')
   async updateTask(@Body() updateDto:updatetaskDto,@Req() req:Request){
  
    const respons:ResposeType=await new Promise((resolve,reject)=>{
      this.taskClinetService.send("update_task",{
        title:updateDto.title,
        content:updateDto.content,
        status:updateDto.status,
        userId:req.user?._id})
        .subscribe((data)=>resolve(data))
   })
 
  if(respons?.error) throw new HttpException(respons?.message,respons?.status || 500)
    
    return {
     message: respons?.message,
     data: respons?.data
    }

  
  }


}
